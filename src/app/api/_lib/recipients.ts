import groq from "groq";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";

const CONTACT_GROUP_QUERY = groq`
  *[_type == "contactGroup" && notifyChapterApplications == true][0]{
    title,
    recipients[]{
      email
    }
  }
`;

export const FALLBACK_RECIPIENTS = ["zhangorienspam@gmail.com"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return EMAIL_REGEX.test(trimmed) ? trimmed : null;
};

export async function resolveNotificationRecipients(
  preferred: Array<string | null | undefined>
) {
  const preferredEmails = preferred
    .map(normalizeEmail)
    .filter((email): email is string => Boolean(email));

  const readClient = client.withConfig({ token, useCdn: false });
  const contactGroup = await readClient.fetch<{
    recipients?: Array<{ email?: string | null }>;
  } | null>(CONTACT_GROUP_QUERY);

  const groupRecipients =
    contactGroup?.recipients
      ?.map((recipient) => normalizeEmail(recipient?.email))
      .filter((email): email is string => Boolean(email)) ?? [];

  const recipientSet = new Set<string>();
  preferredEmails.forEach((email) => recipientSet.add(email));
  groupRecipients.forEach((email) => recipientSet.add(email));

  let fallbackUsed = false;

  if (recipientSet.size === 0) {
    FALLBACK_RECIPIENTS.forEach((email) => recipientSet.add(email));
    fallbackUsed = true;
  }

  return {
    recipients: Array.from(recipientSet),
    fallbackUsed,
    groupRecipients,
  };
}

export const detectEmailFromText = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return EMAIL_REGEX.test(trimmed) ? trimmed : null;
};
