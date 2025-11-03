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

type ContactPayload = {
  workshopId?: string;
  workshopTitle?: string;
  workshopSlug?: string;
  workshopDate?: string;
  workshopLocation?: string;
  hostNames?: string[];
  message?: string;
  attendeeContact?: string;
  attendeeEmail?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  pageUrl?: string | null;
};

const parseJsonBody = async (request: Request) => {
  try {
    return (await request.json()) as ContactPayload;
  } catch {
    return null;
  }
};

const buildSummaryFields = (
  payload: Required<ContactPayload>,
  timestamp: string
): SummaryField[] => [
  { label: "Workshop", value: payload.workshopTitle },
  { label: "Workshop slug", value: payload.workshopSlug },
  { label: "Workshop ID", value: payload.workshopId },
  { label: "Workshop date", value: payload.workshopDate },
  { label: "Workshop location", value: payload.workshopLocation },
  { label: "Hosts", value: payload.hostNames },
  { label: "Message", value: payload.message },
  { label: "Attendee contact", value: payload.attendeeContact },
  { label: "Attendee email", value: payload.attendeeEmail },
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

  const message = body.message?.trim();
  const attendeeContact = body.attendeeContact?.trim();

  if (!message || !attendeeContact) {
    return NextResponse.json(
      { error: "Message and contact information are required." },
      { status: 400 }
    );
  }

  const timestamp = new Date().toISOString();

  const payload: Required<ContactPayload> = {
    workshopId: body.workshopId ?? "unknown",
    workshopTitle: body.workshopTitle ?? "Untitled workshop",
    workshopSlug: body.workshopSlug ?? "",
    workshopDate: body.workshopDate ?? "",
    workshopLocation: body.workshopLocation ?? "",
    hostNames: Array.isArray(body.hostNames) ? body.hostNames : [],
    message,
    attendeeContact,
    attendeeEmail:
      body.attendeeEmail?.trim() ??
      detectEmailFromText(attendeeContact) ??
      null,
    contactEmail: body.contactEmail ?? null,
    contactPhone: body.contactPhone ?? null,
    pageUrl: body.pageUrl ?? null,
  };

  const { recipients: toEmails, fallbackUsed } =
    await resolveNotificationRecipients([payload.contactEmail]);

  if (!toEmails.length) {
    return NextResponse.json(
      { error: "No recipients are configured to receive workshop messages." },
      { status: 500 }
    );
  }

  const summaryFields = buildSummaryFields(payload, timestamp);
  const textSummary = summaryToText(summaryFields);
  const htmlSummary = `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">A new contact message was submitted for ${
    payload.workshopTitle
  }.</p>${summaryToHtml(summaryFields)}`;
  const csvFilename = `workshop-contact-${timestamp.slice(0, 10)}.csv`;
  const csvAttachment = summaryToCsvAttachment(summaryFields, csvFilename);

  const attendeeEmail = payload.attendeeEmail;
  const replyTo = attendeeEmail
    ? [BUSINESS_REPLY_TO, attendeeEmail]
    : [BUSINESS_REPLY_TO];

  const resend = new Resend(resendApiKey);

  try {
    await resend.emails.send({
      from: ADMIN_FROM,
      to: toEmails,
      subject: payload.workshopTitle
        ? `Workshop contact: ${payload.workshopTitle}`
        : "Workshop contact request",
      text: `A new contact message was submitted for ${payload.workshopTitle}.\n\n${textSummary}`,
      html: htmlSummary,
      replyTo,
      attachments: [csvAttachment],
    });

    let confirmationEmailSent = false;
    let confirmationEmailError: string | undefined;

    if (attendeeEmail) {
      try {
        await resend.emails.send({
          from: ADMIN_FROM,
          to: attendeeEmail,
          subject: `We received your message about ${payload.workshopTitle}`,
          text: `Thanks for reaching out about ${payload.workshopTitle}. Here's a copy of what you sent:\n\n${textSummary}\n\nWe'll be in touch soon.`,
          html: `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">Thanks for reaching out about ${
            payload.workshopTitle
          }. Here's a copy of what you sent:</p>${summaryToHtml(
            summaryFields
          )}<p style="font-family:Arial,sans-serif;font-size:13px;color:#555;">We will reply as soon as possible. If you need to add anything, reply to this email.</p>`,
          replyTo: [BUSINESS_REPLY_TO],
          attachments: [
            summaryToCsvAttachment(summaryFields, csvFilename),
          ],
        });
        confirmationEmailSent = true;
      } catch (error) {
        console.error("Failed to send workshop contact confirmation", error);
        confirmationEmailError =
          "We could not send a confirmation email to the attendee.";
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Message delivered to the workshop hosts.",
      confirmationEmailSent,
      confirmationEmailError,
      fallbackGroupUsed: fallbackUsed,
      targetRecipients: toEmails,
    });
  } catch (error) {
    console.error("Failed to deliver workshop contact message", error);
    return NextResponse.json(
      { error: "Unable to send the message right now. Please try again later." },
      { status: 500 }
    );
  }
}
