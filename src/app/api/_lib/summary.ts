export type SummaryField = {
  label: string;
  value?: string | string[] | null;
};

const normalizeValue = (value?: string | string[] | null) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (item ?? "").toString().trim())
      .filter(Boolean)
      .join("; ");
  }
  return (value ?? "").toString().trim();
};

export const summaryToText = (fields: SummaryField[]) => {
  const lines: string[] = [];
  fields.forEach(({ label, value }) => {
    const normalized = normalizeValue(value);
    if (!normalized) return;
    lines.push(`${label}: ${normalized}`);
  });
  return lines.join("\n");
};

export const summaryToHtml = (fields: SummaryField[]) => {
  const rows = fields
    .map(({ label, value }) => {
      const normalized = normalizeValue(value);
      if (!normalized) return null;
      const safeValue = normalized
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br />");
      return `<tr>
        <th style="text-align:left;padding:6px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif;">${label}</th>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif;">${safeValue}</td>
      </tr>`;
    })
    .filter(Boolean)
    .join("");

  return `<table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #eee;">${rows}</table>`;
};

export const summaryToCsvAttachment = (
  fields: SummaryField[],
  filename: string
) => {
  const rows = ['"Field","Value"'];
  fields.forEach(({ label, value }) => {
    const normalized = normalizeValue(value);
    if (!normalized) return;
    const safeLabel = label.replace(/"/g, '""');
    const safeValue = normalized.replace(/"/g, '""').replace(/\r?\n/g, "\\n");
    rows.push(`"${safeLabel}","${safeValue}"`);
  });

  return {
    filename,
    content: Buffer.from(rows.join("\r\n"), "utf8").toString("base64"),
    type: "text/csv",
  };
};
