import { NextResponse } from "next/server";
import { Resend } from "resend";
import groq from "groq";

import {
  resolveNotificationRecipients,
  detectEmailFromText,
} from "@/app/api/_lib/recipients";
import {
  SummaryField,
  summaryToCsvAttachment,
  summaryToHtml,
  summaryToText,
} from "@/app/api/_lib/summary";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { writeClient } from "@/sanity/lib/writeClient";

const resendApiKey = process.env.RESEND_API_KEY;
const ADMIN_FROM = "ICHeritage Workshops <onboarding@resend.dev>";
const BUSINESS_REPLY_TO = "chineseicheritage@gmail.com";

type VolunteerDetails = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string | null;
  pronouns?: string | null;
  availability?: string | null;
  interests?: string[];
  experience?: string | null;
  notes?: string | null;
};

type VolunteerPayload = {
  workshopId?: string;
  workshopSlug?: string;
  workshopTitle?: string;
  workshopDate?: string | null;
  workshopLocation?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  pageUrl?: string | null;
  volunteer?: VolunteerDetails;
};

type NormalizedVolunteerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  pronouns: string | null;
  availability: string | null;
  interests: string[];
  experience: string | null;
  notes: string | null;
};

type NormalizedVolunteerPayload = {
  workshopId: string;
  workshopSlug: string;
  workshopTitle: string;
  workshopDate: string;
  workshopLocation: string;
  contactEmail: string | null;
  contactPhone: string | null;
  pageUrl: string | null;
  volunteer: NormalizedVolunteerDetails;
};

const readClient = client.withConfig({ token, useCdn: false });

const WORKSHOP_CONTACT_QUERY = groq`
  *[_type == "workshop" && (
    (defined($workshopId) && _id == $workshopId) ||
    (defined($workshopSlug) && slug.current == $workshopSlug)
  )][0]{
    _id,
    title,
    "slug": slug.current,
    contact{
      email,
      phone
    }
  }
`;

type WorkshopContactLookupResult = {
  contact?: {
    email?: string | null;
    phone?: string | null;
  };
};

const parseJsonBody = async (request: Request) => {
  try {
    return (await request.json()) as VolunteerPayload;
  } catch {
    return null;
  }
};

const sanitizePhone = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed || null;
};

const fetchWorkshopContactDetails = async (
  workshopId?: string | null,
  workshopSlug?: string | null
) => {
  if (!workshopId && !workshopSlug) {
    return {
      contactEmail: null,
      contactPhone: null,
    };
  }

  try {
    const result = await readClient.fetch<WorkshopContactLookupResult | null>(
      WORKSHOP_CONTACT_QUERY,
      {
        workshopId: workshopId ?? null,
        workshopSlug: workshopSlug ?? null,
      }
    );

    return {
      contactEmail: detectEmailFromText(result?.contact?.email),
      contactPhone: sanitizePhone(result?.contact?.phone),
    };
  } catch (error) {
    console.error("Failed to read workshop contact details", error);
    return {
      contactEmail: null,
      contactPhone: null,
    };
  }
};

type SanityMutationError = {
  statusCode?: number;
  response?: {
    statusCode?: number;
    body?: {
      error?: {
        type?: string;
        description?: string;
        items?: Array<{
          index?: number;
          error?: {
            type?: string;
            description?: string;
            permission?: string;
          };
        }>;
      };
    };
  };
  message?: string;
};

type SanityResponse = NonNullable<SanityMutationError["response"]>;
type SanityResponseBody = NonNullable<SanityResponse["body"]>;
type SanityBodyError = SanityResponseBody extends { error?: infer T } ? T : undefined;

const includesPermissionMessage = (value?: string | null) =>
  typeof value === "string" && value.toLowerCase().includes("permission");

const isPermissionError = (error: unknown): error is SanityMutationError => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const candidate = error as SanityMutationError;
  if (candidate.statusCode && [401, 403].includes(candidate.statusCode)) {
    return true;
  }
  if (
    candidate.response?.statusCode &&
    [401, 403].includes(candidate.response.statusCode)
  ) {
    return true;
  }

  const responseBody = candidate.response?.body;
  let bodyError: SanityBodyError | undefined;
  if (responseBody && typeof responseBody === "object") {
    const typedBody = responseBody as SanityResponseBody;
    bodyError = typedBody.error;
  }

  if (includesPermissionMessage(bodyError?.description)) {
    return true;
  }

  const items = bodyError?.items ?? [];
  if (
    items.some((item) => {
      const typeMatch =
        item.error?.type === "insufficientPermissionsError" ||
        item.error?.permission === "create";
      return typeMatch || includesPermissionMessage(item.error?.description);
    })
  ) {
    return true;
  }

  if (includesPermissionMessage(candidate.message)) {
    return true;
  }

  try {
    const serialized = JSON.stringify(error);
    if (includesPermissionMessage(serialized)) {
      return true;
    }
  } catch {
    // ignore serialization errors
  }

  return false;
};

const buildSummaryFields = (payload: NormalizedVolunteerPayload, timestamp: string): SummaryField[] => [
  { label: "Workshop", value: payload.workshopTitle },
  { label: "Workshop slug", value: payload.workshopSlug },
  { label: "Workshop ID", value: payload.workshopId },
  { label: "Workshop date", value: payload.workshopDate },
  { label: "Workshop location", value: payload.workshopLocation },
  { label: "Volunteer first name", value: payload.volunteer.firstName },
  { label: "Volunteer last name", value: payload.volunteer.lastName },
  { label: "Volunteer email", value: payload.volunteer.email },
  { label: "Volunteer phone", value: payload.volunteer.phone },
  { label: "Pronouns", value: payload.volunteer.pronouns },
  { label: "Availability", value: payload.volunteer.availability },
  { label: "Interests", value: payload.volunteer.interests },
  { label: "Experience", value: payload.volunteer.experience },
  { label: "Additional notes", value: payload.volunteer.notes },
  { label: "Contact email configured", value: payload.contactEmail },
  { label: "Contact phone configured", value: payload.contactPhone },
  { label: "Workshop URL", value: payload.pageUrl },
  { label: "Submitted at (UTC)", value: timestamp },
];

export async function POST(request: Request) {
  if (!resendApiKey) {
    return NextResponse.json(
      { error: "Email service is not configured. Please set RESEND_API_KEY." },
      { status: 500 }
    );
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const volunteer = body.volunteer ?? {};
  const firstName = volunteer.firstName?.trim();
  const lastName = volunteer.lastName?.trim();
  const email = volunteer.email?.trim();

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      {
        error: "First name, last name, and a valid email address are required to volunteer.",
      },
      { status: 400 }
    );
  }

  const { contactEmail, contactPhone: configuredContactPhone } = await fetchWorkshopContactDetails(
    body.workshopId,
    body.workshopSlug
  );
  const fallbackContactPhone = sanitizePhone(body.contactPhone);

  const timestamp = new Date().toISOString();
  const normalizedPayload: NormalizedVolunteerPayload = {
    workshopId: body.workshopId ?? "unknown",
    workshopSlug: body.workshopSlug ?? "",
    workshopTitle: body.workshopTitle ?? "Untitled workshop",
    workshopDate: body.workshopDate ?? "",
    workshopLocation: body.workshopLocation ?? "",
    contactEmail,
    contactPhone: configuredContactPhone ?? fallbackContactPhone,
    pageUrl: body.pageUrl?.trim() || null,
    volunteer: {
      firstName,
      lastName,
      email,
      phone: volunteer.phone?.trim() || null,
      pronouns: volunteer.pronouns?.trim() || null,
      availability: volunteer.availability?.trim() || null,
      interests: Array.isArray(volunteer.interests)
        ? volunteer.interests.filter((item): item is string => Boolean(item && item.trim()))
        : [],
      experience: volunteer.experience?.trim() || null,
      notes: volunteer.notes?.trim() || null,
    },
  };

  let volunteerRecordId: string | undefined;
  let persistenceWarning: string | undefined;
  try {
    const created = await writeClient.create({
      _type: "workshopVolunteer",
      workshop: body.workshopId
        ? {
            _type: "reference",
            _ref: body.workshopId,
          }
        : undefined,
      workshopTitle: normalizedPayload.workshopTitle,
      workshopSlug: normalizedPayload.workshopSlug,
      workshopDate: normalizedPayload.workshopDate,
      workshopLocation: normalizedPayload.workshopLocation,
      pageUrl: normalizedPayload.pageUrl,
      firstName: normalizedPayload.volunteer.firstName,
      lastName: normalizedPayload.volunteer.lastName,
      email: normalizedPayload.volunteer.email,
      phone: normalizedPayload.volunteer.phone,
      pronouns: normalizedPayload.volunteer.pronouns,
      interests: normalizedPayload.volunteer.interests,
      availability: normalizedPayload.volunteer.availability,
      experience: normalizedPayload.volunteer.experience,
      notes: normalizedPayload.volunteer.notes,
      submittedAt: timestamp,
      source: "workshop-volunteer-form",
    });
    volunteerRecordId = created?._id;
  } catch (error) {
    if (isPermissionError(error)) {
      persistenceWarning =
        "Workshop volunteer submissions were delivered via email, but the Sanity token is missing create permissions.";
      console.warn("Skipping volunteer persistence due to insufficient permissions", error);
    } else {
      console.error("Failed to store workshop volunteer submission", error);
      return NextResponse.json(
        { error: "Unable to record this volunteer interest. Please try again later." },
        { status: 500 }
      );
    }
  }

  if (volunteerRecordId && body.workshopId) {
    try {
      await writeClient
        .patch(body.workshopId)
        .setIfMissing({ volunteerResponses: [] })
        .append("volunteerResponses", [
          {
            _type: "reference",
            _ref: volunteerRecordId,
          },
        ])
        .commit({ autoGenerateArrayKeys: true });
    } catch (error) {
      console.error("Failed to link volunteer to workshop document", error);
    }
  }

  const preferredRecipients = normalizedPayload.contactEmail
    ? [normalizedPayload.contactEmail]
    : [];
  const { recipients: toEmails, fallbackUsed } = await resolveNotificationRecipients(
    preferredRecipients
  );

  if (!toEmails.length) {
    return NextResponse.json(
      {
        error: "No recipients are configured to receive volunteer interest notifications.",
      },
      { status: 500 }
    );
  }

  const summaryFields = buildSummaryFields(normalizedPayload, timestamp);
  const textSummary = summaryToText(summaryFields);
  const adminIntro = persistenceWarning
    ? `A new volunteer wants to support ${normalizedPayload.workshopTitle}. We could not save this record to Sanity automatically, so please log it manually if needed.`
    : `A new volunteer wants to support ${normalizedPayload.workshopTitle}. We already added this record to Sanity Studio (Workshop Volunteers) so you can manage assignments.`;
  const adminHtml = `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">${adminIntro}</p>${summaryToHtml(
    summaryFields
  )}`;
  const csvAttachment = summaryToCsvAttachment(
    summaryFields,
    `workshop-volunteer-${timestamp.slice(0, 10)}.csv`
  );

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: ADMIN_FROM,
      to: toEmails,
      subject: `Workshop volunteer interest: ${normalizedPayload.workshopTitle}`,
      text: `${adminIntro}\n\n${textSummary}`,
      html: adminHtml,
      attachments: [csvAttachment],
      replyTo: BUSINESS_REPLY_TO,
    });

    await resend.emails.send({
      from: ADMIN_FROM,
      to: normalizedPayload.volunteer.email,
      subject: `Thanks for volunteering for ${normalizedPayload.workshopTitle}`,
      text: `Thank you for offering to support ${normalizedPayload.workshopTitle}. Here's a copy of what you shared:\n\n${textSummary}\n\nWe'll follow up with next steps soon.`,
      html: `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">Thank you for offering to support ${
        normalizedPayload.workshopTitle
      }! Here's a copy of what you shared.</p>${summaryToHtml(
        summaryFields
      )}<p style="font-family:Arial,sans-serif;font-size:13px;color:#555;">We’ll reply with next steps shortly. Feel free to respond to this email if you have updates.</p>`,
      replyTo: BUSINESS_REPLY_TO,
    });

    return NextResponse.json(
      {
        ok: true,
        message: "Volunteer interest delivered to the workshop team.",
        targetRecipients: toEmails,
        fallbackGroupUsed: fallbackUsed,
        volunteerId: volunteerRecordId,
        storageWarning: persistenceWarning,
      },
      {
        status: persistenceWarning ? 202 : 200,
      }
    );
  } catch (error) {
    console.error("Failed to send workshop volunteer notifications", error);
    return NextResponse.json(
      { error: "Unable to send volunteer notifications. Please try again later." },
      { status: 500 }
    );
  }
}
