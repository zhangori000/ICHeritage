import { NextResponse } from "next/server";
import { Resend } from "resend";
import { resolveNotificationRecipients } from "@/app/api/_lib/recipients";

const resendApiKey = process.env.RESEND_API_KEY;
const BUSINESS_REPLY_TO = "chineseicheritage@gmail.com";

type NormalizedFields = Record<string, string | string[]>;

type FileEntry = {
  key: string;
  file: File;
};

const FIELD_ORDER: Array<{ key: string; label: string }> = [
  { key: "chapterType", label: "Chapter type" },
  { key: "institutionName", label: "Institution or organization name" },
  { key: "location", label: "City / State / Country" },
  { key: "launchMonth", label: "Anticipated launch month" },
  { key: "chapterWebsite", label: "Website or social handle" },
  { key: "leadName", label: "Primary contact name" },
  { key: "leadRole", label: "Primary contact role/title" },
  { key: "leadAcademicYear", label: "Academic year" },
  { key: "leadMajor", label: "Major or field of study" },
  { key: "leadEmail", label: "Primary email" },
  { key: "leadContact", label: "Mobile / WhatsApp / WeChat / email" },
  { key: "leadProfile", label: "LinkedIn or personal site" },
  { key: "motivationWhy", label: "Why start an ICHeritage chapter?" },
  { key: "motivationStory", label: "What inspired this chapter?" },
  { key: "motivationChallenges", label: "Challenges to address" },
  { key: "motivationEngagement", label: "First three months engagement plan" },
  { key: "leadershipExperience", label: "Leadership experience" },
  {
    key: "leadershipVolunteerExperience",
    label: "Volunteer or cultural experience",
  },
  { key: "leadershipSkills", label: "Key skills or networks" },
  { key: "advisorName", label: "Advisor name" },
  { key: "advisorTitle", label: "Advisor title / department" },
  { key: "advisorEmail", label: "Advisor email" },
  { key: "teamSizeRoles", label: "Initial team size & roles" },
  { key: "teamCadence", label: "Meeting cadence" },
  { key: "mentorshipNeeds", label: "Mentorship requested" },
  { key: "mentorshipNeedsOther", label: "Other mentorship notes" },
  { key: "commitments", label: "Commitments agreed" },
  { key: "signatureName", label: "Signature" },
  { key: "signatureDate", label: "Signature date" },
  { key: "submittedAt", label: "Submitted at (UTC)" },
];

function normalizeFormData(formData: FormData): {
  fields: NormalizedFields;
  files: FileEntry[];
} {
  const fields: NormalizedFields = {};
  const files: FileEntry[] = [];

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (value.size > 0) {
        files.push({ key, file: value });
      }
    } else {
      const stringValue = value.toString().trim();
      if (!stringValue) continue;
      if (Object.prototype.hasOwnProperty.call(fields, key)) {
        const existing = fields[key];
        if (Array.isArray(existing)) {
          fields[key] = [...existing, stringValue];
        } else {
          fields[key] = [existing, stringValue];
        }
      } else {
        fields[key] = stringValue;
      }
    }
  }

  return { fields, files };
}

const extractValue = (value: string | string[] | undefined) => {
  if (!value) return undefined;
  return Array.isArray(value) ? value.join("; ") : value;
};

const toCsv = (fields: NormalizedFields) => {
  const rows = ['"Field","Value"'];

  FIELD_ORDER.forEach(({ key, label }) => {
    const value = extractValue(fields[key]);
    if (!value) return;
    const safeLabel = label.replace(/"/g, '""');
    const safeValue = value.replace(/"/g, '""').replace(/\r?\n/g, "\\n");
    rows.push(`"${safeLabel}","${safeValue}"`);
  });

  return rows.join("\r\n");
};

const buildTextSummary = (fields: NormalizedFields) => {
  const lines: string[] = [];
  FIELD_ORDER.forEach(({ key, label }) => {
    const value = extractValue(fields[key]);
    if (!value) return;
    lines.push(`${label}: ${value}`);
  });
  return lines.join("\n");
};

const buildHtmlSummary = (fields: NormalizedFields) => {
  const rows = FIELD_ORDER.map(({ key, label }) => {
    const value = extractValue(fields[key]);
    if (!value) return null;
    const safeValue = value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br />");
    return `<tr>
      <th style="text-align:left;padding:6px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif;">${label}</th>
      <td style="padding:6px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif;">${safeValue}</td>
    </tr>`;
  }).filter(Boolean);

  return `<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;">${rows.join("")}</table>`;
};

function guessSubject(fields: NormalizedFields) {
  const institution = extractValue(fields.institutionName)?.slice(0, 60);
  const lead = extractValue(fields.leadName)?.split(";")[0];
  if (institution) return `New Chapter Application - ${institution}`;
  if (lead) return `New Chapter Application - ${lead}`;
  return "New Chapter Application";
}

const createCsvAttachment = (fields: NormalizedFields, timestamp: string) => ({
  filename: `chapter-application-${timestamp.slice(0, 10)}.csv`,
  content: Buffer.from(toCsv(fields), "utf8").toString("base64"),
  type: "text/csv",
});

export async function POST(request: Request) {
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY environment variable.");
    return NextResponse.json(
      { error: "Email service is not configured. Please set RESEND_API_KEY." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const timestamp = new Date().toISOString();
  formData.set("submittedAt", timestamp);

  const { fields, files } = normalizeFormData(formData);

  const { recipients: toEmails, fallbackUsed: fallbackGroupUsed } =
    await resolveNotificationRecipients([]);

  if (!toEmails.length) {
    return NextResponse.json(
      {
        error:
          "No notification recipients configured for chapter applications.",
      },
      { status: 500 }
    );
  }

  const resend = new Resend(resendApiKey);

  const csvAttachment = createCsvAttachment(fields, timestamp);

  const fileAttachments = await Promise.all(
    files.map(async ({ key, file }) => {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const extension = file.name?.includes(".")
        ? ""
        : guessExtension(file.type);
      const filename = file.name || `${key}${extension}`;
      return {
        filename,
        content: buffer.toString("base64"),
        type: file.type || "application/octet-stream",
      };
    })
  );

  const textSummary = buildTextSummary(fields);
  const htmlSummary = `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">A new Start a Chapter application was submitted.</p>${buildHtmlSummary(
    fields
  )}`;

  const adminFrom = "ICHeritage Applications <onboarding@resend.dev>";

  const applicantEmailRaw = extractValue(fields.leadEmail);
  const applicantEmail = applicantEmailRaw?.split(";")[0]?.trim();
  const replyToAddresses = [
    BUSINESS_REPLY_TO,
    ...(applicantEmail ? [applicantEmail] : []),
  ];

  try {
    const replyToValue =
      replyToAddresses.length === 1 ? replyToAddresses[0] : replyToAddresses;

    const adminEmailPayload: Parameters<typeof resend.emails.send>[0] & {
      reply_to?: string | string[];
    } = {
      from: adminFrom,
      to: toEmails,
      subject: guessSubject(fields),
      text: `A new Start a Chapter application was submitted.\n\n${textSummary}`,
      html: htmlSummary,
      attachments: [csvAttachment, ...fileAttachments],
      reply_to: replyToValue,
    };

    await resend.emails.send(adminEmailPayload);

    let confirmationEmailSent = false;
    let confirmationEmailError: string | undefined;

    if (applicantEmail) {
      const applicantSubject = "We received your ICHeritage chapter application";
      const applicantIntro =
        "Thanks for submitting your Start a Chapter application. Here's a copy of what we received for your records.";
      const applicantHtml = `<p style="font-family:Arial,sans-serif;font-size:14px;color:#333;">${applicantIntro}</p>${buildHtmlSummary(
        fields
      )}<p style="font-family:Arial,sans-serif;font-size:13px;color:#555;">If anything looks off, simply reply to this email and our team will help.</p>`;
      const applicantText = `${applicantIntro}\n\n${textSummary}\n\nIf anything looks off, reply to this email and our team will help.`;

      try {
        const confirmationPayload: Parameters<typeof resend.emails.send>[0] & {
          reply_to?: string | string[];
        } = {
          from: adminFrom,
          to: applicantEmail,
          subject: applicantSubject,
          text: applicantText,
          html: applicantHtml,
          attachments: [createCsvAttachment(fields, timestamp), ...fileAttachments],
          reply_to: BUSINESS_REPLY_TO,
        };

        await resend.emails.send(confirmationPayload);
        confirmationEmailSent = true;
      } catch (error) {
        console.error("Failed to send confirmation email to applicant", error);
        confirmationEmailError = "We could not send a confirmation email to the applicant.";
      }
    }

    return NextResponse.json({
      ok: true,
      message: "Chapter application delivered to the HQ notification list.",
      confirmationEmailSent,
      confirmationEmailError,
      fallbackGroupUsed,
      targetRecipients: toEmails,
    });
  } catch (error) {
    console.error("Failed to send chapter application notification", error);
    return NextResponse.json(
      { error: "Unable to send email notification. Please try again later." },
      { status: 500 }
    );
  }
}

const guessExtension = (mimeType?: string) => {
  if (!mimeType) return ".bin";
  if (mimeType === "application/pdf") return ".pdf";
  if (mimeType === "application/msword") return ".doc";
  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return ".docx";
  if (mimeType === "image/png") return ".png";
  if (mimeType === "image/jpeg") return ".jpg";
  return ".bin";
};

