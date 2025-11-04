import { NextResponse } from "next/server";
import { Resend } from "resend";

import {
  detectEmailFromText,
  resolveNotificationRecipients,
} from "@/app/api/_lib/recipients";
import {
  SummaryField,
  summaryToCsvAttachment,
  summaryToHtml,
  summaryToText,
} from "@/app/api/_lib/summary";

const resendApiKey = process.env.RESEND_API_KEY;
const ADMIN_FROM = "ICHeritage Workshops <onboarding@resend.dev>";
const BUSINESS_REPLY_TO = "chineseicheritage@gmail.com";

type RsvpPayload = {
  workshopId?: string;
  workshopTitle?: string;
  workshopSlug?: string;
  workshopDate?: string;
  workshopLocation?: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  pageUrl?: string | null;
  attendee?: {
    firstName?: string;
    lastName?: string;
    contact?: string;
    email?: string | null;
    notes?: string | null;
  };
};

const parseJsonBody = async (request: Request) => {
  try {
    return (await request.json()) as RsvpPayload;
  } catch {
    return null;
  }
};

const buildSummaryFields = (
  payload: Required<RsvpPayload>,
  timestamp: string
): SummaryField[] => [
  { label: "Workshop", value: payload.workshopTitle },
  { label: "Workshop slug", value: payload.workshopSlug },
  { label: "Workshop ID", value: payload.workshopId },
  { label: "Workshop date", value: payload.workshopDate },
  { label: "Workshop location", value: payload.workshopLocation },
  { label: "Attendee first name", value: payload.attendee.firstName },
  { label: "Attendee last name", value: payload.attendee.lastName },
  { label: "Attendee contact", value: payload.attendee.contact },
  { label: "Attendee email", value: payload.attendee.email },
  { label: "Additional notes", value: payload.attendee.notes },
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
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const attendee = body.attendee ?? {};
  const attendeeContact = attendee.contact?.trim();
  const firstName = attendee.firstName?.trim();
  const lastName = attendee.lastName?.trim();

  if (!firstName || !lastName || !attendeeContact) {
    return NextResponse.json(
      {
        error:
          "First name, last name, and contact information are required for RSVP requests.",
      },
      { status: 400 }
    );
  }

  const timestamp = new Date().toISOString();
  const attendeeEmail =
    attendee.email?.trim() ?? detectEmailFromText(attendeeContact);

  const payload: Required<RsvpPayload> = {
    workshopId: body.workshopId ?? "unknown",
    workshopTitle: body.workshopTitle ?? "Untitled workshop",
    workshopSlug: body.workshopSlug ?? "",
    workshopDate: body.workshopDate ?? "",
    workshopLocation: body.workshopLocation ?? "",
    contactEmail: body.contactEmail ?? null,
    contactPhone: body.contactPhone ?? null,
    pageUrl: body.pageUrl ?? null,
    attendee: {
      firstName,
      lastName,
      contact: attendeeContact,
      email: attendeeEmail,
      notes: attendee.notes?.trim() ?? null,
    },
  };

  const { recipients: toEmails, fallbackUsed } =
    await resolveNotificationRecipients([payload.contactEmail]);

  if (!toEmails.length) {
    return NextResponse.json(
      {
        error:
          "No recipients are configured to receive workshop RSVP requests.",
      },
      { status: 500 }
    );
  }

  const summaryFields = buildSummaryFields(payload, timestamp);
  const textSummary = summaryToText(summaryFields);
  const htmlSummary = `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">A new RSVP request was submitted for ${
    payload.workshopTitle
  }.</p>${summaryToHtml(summaryFields)}`;
  const csvFilename = `workshop-rsvp-${timestamp.slice(0, 10)}.csv`;
  const csvAttachment = summaryToCsvAttachment(summaryFields, csvFilename);

  const replyToCandidates = [
    BUSINESS_REPLY_TO,
    ...([payload.attendee.email].filter(
      (value): value is string => typeof value === "string" && value.length > 0
    ) as string[]),
  ];
  const replyToValue =
    replyToCandidates.length === 1 ? replyToCandidates[0] : replyToCandidates;

  const resend = new Resend(resendApiKey);

  try {
    const adminPayload: Parameters<typeof resend.emails.send>[0] & {
      reply_to?: string | string[];
    } = {
      from: ADMIN_FROM,
      to: toEmails,
      subject: payload.workshopTitle
        ? `Workshop RSVP request: ${payload.workshopTitle}`
        : "Workshop RSVP request",
      text: `A new RSVP request was submitted for ${payload.workshopTitle}.\n\n${textSummary}`,
      html: htmlSummary,
      attachments: [csvAttachment],
      reply_to: replyToValue,
    };

    await resend.emails.send(adminPayload);

    let confirmationEmailSent = false;
    let confirmationEmailError: string | undefined;

    if (payload.attendee.email) {
      try {
        const confirmationPayload: Parameters<typeof resend.emails.send>[0] & {
          reply_to?: string | string[];
        } = {
          from: ADMIN_FROM,
          to: payload.attendee.email,
          subject: `We received your RSVP for ${payload.workshopTitle}`,
          text: `Thanks for your interest in ${payload.workshopTitle}. Here's a copy of what you shared:\n\n${textSummary}\n\nWe'll send RSVP details as soon as they are available.`,
          html: `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">Thanks for your interest in ${
            payload.workshopTitle
          }. Here's a copy of what you shared:</p>${summaryToHtml(
            summaryFields
          )}<p style="font-family:Arial,sans-serif;font-size:13px;color:#555;">We'll follow up with RSVP details soon. If anything changes, reply to this email.</p>`,
          attachments: [summaryToCsvAttachment(summaryFields, csvFilename)],
          reply_to: BUSINESS_REPLY_TO,
        };

        await resend.emails.send(confirmationPayload);
        confirmationEmailSent = true;
      } catch (error) {
        console.error("Failed to send workshop RSVP confirmation", error);
        confirmationEmailError =
          "We could not send a confirmation email to the attendee.";
      }
    }

    return NextResponse.json({
      ok: true,
      message: "RSVP request delivered to the workshop team.",
      confirmationEmailSent,
      confirmationEmailError,
      fallbackGroupUsed: fallbackUsed,
      targetRecipients: toEmails,
    });
  } catch (error) {
    console.error("Failed to deliver workshop RSVP request", error);
    return NextResponse.json(
      { error: "Unable to send the RSVP request. Please try again later." },
      { status: 500 }
    );
  }
}

