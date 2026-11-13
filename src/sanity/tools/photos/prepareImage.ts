/**
 * Get a photo ready to upload: note when it was taken, and shrink very large
 * photos so a phone upload of a whole event does not take forever.
 *
 * Phones save 12–48 megapixel photos of 3–10 MB each. The site never shows
 * them wider than 2000 px, so anything bigger than MAX_EDGE is redrawn at
 * MAX_EDGE as a JPEG. Files the browser cannot decode (HEIC in Chrome, for
 * example) are uploaded as they are; Sanity accepts HEIF and the image CDN
 * converts it for visitors.
 */

const MAX_EDGE = 3000;
const RESIZE_ABOVE_BYTES = 2.5 * 1024 * 1024;
const JPEG_QUALITY = 0.86;

export type PreparedImage = {
  body: Blob;
  filename: string;
  /** ISO date-time the photo was taken, or the file's date when unknown. */
  takenAt: string;
};

export async function prepareImage(file: File): Promise<PreparedImage> {
  const takenAt =
    (await readExifDate(file)) ?? new Date(file.lastModified || Date.now()).toISOString();
  const original: PreparedImage = { body: file, filename: file.name, takenAt };

  if (file.size <= RESIZE_ABOVE_BYTES || !isPhotoFormat(file)) return original;

  try {
    // "from-image" applies the EXIF rotation, so the redrawn JPEG is upright.
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) {
      bitmap.close();
      return original;
    }
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );
    if (!blob || blob.size >= file.size) return original;
    return { body: blob, filename: file.name.replace(/\.[^.]+$/, "") + ".jpg", takenAt };
  } catch {
    return original;
  }
}

/** JPEG, WebP and HEIC are photos; PNG and GIF may carry transparency or animation, so leave them alone. */
function isPhotoFormat(file: File) {
  return (
    /^image\/(jpeg|webp|heic|heif)$/.test(file.type) || /\.(jpe?g|webp|heic|heif)$/i.test(file.name)
  );
}

/** Read DateTimeOriginal from a JPEG's EXIF block. Returns null for anything else. */
async function readExifDate(file: File): Promise<string | null> {
  try {
    const view = new DataView(await file.slice(0, 256 * 1024).arrayBuffer());
    if (view.byteLength < 4 || view.getUint16(0) !== 0xffd8) return null;

    let offset = 2;
    while (offset + 4 <= view.byteLength) {
      const marker = view.getUint16(offset);
      const size = view.getUint16(offset + 2);
      if (marker === 0xffe1 && view.getUint32(offset + 4) === 0x45786966) {
        return readTiffDate(view, offset + 10);
      }
      if ((marker & 0xff00) !== 0xff00 || marker === 0xffda) return null;
      offset += 2 + size;
    }
    return null;
  } catch {
    return null;
  }
}

function readTiffDate(view: DataView, tiff: number): string | null {
  const little = view.getUint16(tiff) === 0x4949;
  const u16 = (at: number) => view.getUint16(at, little);
  const u32 = (at: number) => view.getUint32(at, little);

  const findTag = (ifd: number, tag: number) => {
    const count = u16(ifd);
    for (let i = 0; i < count; i++) {
      const entry = ifd + 2 + i * 12;
      if (u16(entry) === tag) return entry;
    }
    return -1;
  };

  const ifd0 = tiff + u32(tiff + 4);
  const exifPointer = findTag(ifd0, 0x8769);
  if (exifPointer < 0) return null;
  const exifIfd = tiff + u32(exifPointer + 8);
  const dateEntry = findTag(exifIfd, 0x9003);
  if (dateEntry < 0) return null;

  const start = tiff + u32(dateEntry + 8);
  let text = "";
  for (let i = 0; i < 19; i++) text += String.fromCharCode(view.getUint8(start + i));

  // "2026:02:14 13:05:09", in the camera's local time
  const match = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(text);
  if (!match) return null;
  const [, y, mo, d, h, mi, s] = match.map(Number);
  const date = new Date(y, mo - 1, d, h, mi, s);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}
