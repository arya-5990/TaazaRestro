import { createHash } from "crypto";
import { readFileSync } from "fs";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

/**
 * Upload a local file to Cloudinary via the Upload API (signed).
 * Server-only — requires Node.js runtime (scripts / API routes).
 */
export async function uploadToCloudinary(
  filePath: string,
  options: { folder?: string; publicId?: string } = {},
): Promise<CloudinaryUploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, or CLOUDINARY_API_SECRET env vars",
    );
  }

  const folder = options.folder ?? "taaza/hero";
  const timestamp = Math.floor(Date.now() / 1000);

  // Build string-to-sign (params in alphabetical order, no api_key/file/signature)
  const paramsToSign: Record<string, string> = {
    folder,
    timestamp: String(timestamp),
  };
  if (options.publicId) paramsToSign.public_id = options.publicId;

  const stringToSign =
    Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&") + apiSecret;

  const signature = createHash("sha1").update(stringToSign).digest("hex");

  // Read file and convert to Data URI for upload
  const fileBuffer = readFileSync(filePath);
  const base64File = `data:image/png;base64,${fileBuffer.toString("base64")}`;

  const form = new FormData();
  form.append("file", base64File);
  form.append("folder", folder);
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);
  if (options.publicId) form.append("public_id", options.publicId);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<CloudinaryUploadResult>;
}
