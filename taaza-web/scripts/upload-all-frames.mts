/**
 * Bulk migration script:
 *   1. Uploads ALL frames from each slide folder to Cloudinary
 *   2. Saves slide metadata to Firestore `hero_slides` collection
 *
 * Run:  npx tsx scripts/upload-all-frames.mts
 */
import "dotenv/config";
import { resolve } from "path";
import { readdirSync, existsSync, readFileSync } from "fs";
import { createHash } from "crypto";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

/* ── Firebase init ── */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ── Cloudinary config ── */
const cloudName = process.env.CLOUDINARY_CLOUD_NAME!;
const apiKey = process.env.CLOUDINARY_API_KEY!;
const apiSecret = process.env.CLOUDINARY_API_SECRET!;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Missing Cloudinary env vars");
}

/* ── Slide definitions ── */
const SLIDES = [
  { folder: "food-1", first: 4, total: 93, ext: "png", fit: "cover", docId: "slide-0" },
  { folder: "food-2", first: 1, total: 127, ext: "png", fit: "cover", docId: "slide-1" },
  { folder: "food-3", first: 1, total: 129, ext: "png", fit: "cover", docId: "slide-2" },
  { folder: "drink-1", first: 1, total: 154, ext: "png", fit: "cover", docId: "slide-3" },
];

/* ── Fetch existing resources from Cloudinary Admin API ── */
async function getExistingPublicIds(prefix: string): Promise<Set<string>> {
  const ids = new Set<string>();
  let nextCursor: string | undefined;

  do {
    const url = new URL(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image`);
    url.searchParams.set("type", "upload");
    url.searchParams.set("prefix", prefix);
    url.searchParams.set("max_results", "500");
    if (nextCursor) url.searchParams.set("next_cursor", nextCursor);

    const res = await fetch(url.toString(), {
      headers: {
        Authorization: "Basic " + Buffer.from(`${apiKey}:${apiSecret}`).toString("base64"),
      },
    });

    if (!res.ok) {
      console.warn(`   ⚠ Could not list existing resources (${res.status}), will upload all.`);
      return ids;
    }

    const data = (await res.json()) as { resources: { public_id: string }[]; next_cursor?: string };
    for (const r of data.resources) ids.add(r.public_id);
    nextCursor = data.next_cursor;
  } while (nextCursor);

  return ids;
}

/* ── Upload helper with retry ── */
async function uploadFile(
  filePath: string,
  folder: string,
  publicId: string,
): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign: Record<string, string> = {
    folder,
    public_id: publicId,
    timestamp: String(timestamp),
  };

  const stringToSign =
    Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join("&") + apiSecret;

  const signature = createHash("sha1").update(stringToSign).digest("hex");

  const fileBuffer = readFileSync(filePath);
  const base64File = `data:image/png;base64,${fileBuffer.toString("base64")}`;

  const form = new FormData();
  form.append("file", base64File);
  form.append("folder", folder);
  form.append("public_id", publicId);
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: form },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      const data = (await res.json()) as { secure_url: string };
      return data.secure_url;
    } catch (err) {
      if (attempt === 3) throw err;
      console.warn(`   ⚠ Attempt ${attempt} failed, retrying…`);
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    }
  }
  throw new Error("Unreachable");
}

/* ── Main ── */
async function main() {
  console.log("🚀 Starting bulk frame upload…\n");

  for (const slide of SLIDES) {
    const dir = resolve("public", slide.folder);
    if (!existsSync(dir)) {
      console.warn(`⚠  Folder not found: ${dir}, skipping.`);
      continue;
    }

    const files = readdirSync(dir)
      .filter((f) => f.endsWith(`.${slide.ext}`))
      .sort();

    console.log(`📁 ${slide.folder}: ${files.length} frames`);

    const cloudFolder = `taaza/frames/${slide.folder}`;

    // Check what's already uploaded
    const existing = await getExistingPublicIds(cloudFolder);
    const toUpload = files.filter((f) => {
      const publicId = `${cloudFolder}/${f.replace(`.${slide.ext}`, "")}`;
      return !existing.has(publicId);
    });

    if (toUpload.length === 0) {
      console.log(`   ✅ All ${files.length} frames already uploaded, skipping.`);
    } else {
      console.log(`   ${existing.size} already uploaded, ${toUpload.length} remaining…`);
      let uploaded = 0;

      // Upload in batches of 5 concurrently
      const BATCH_SIZE = 5;
      for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
        const batch = toUpload.slice(i, i + BATCH_SIZE);
        await Promise.all(
          batch.map(async (file) => {
            const filePath = resolve(dir, file);
            const publicId = file.replace(`.${slide.ext}`, "");
            await uploadFile(filePath, cloudFolder, publicId);
            uploaded++;
            process.stdout.write(`\r   Uploaded ${uploaded}/${toUpload.length}`);
          }),
        );
      }
      console.log("");
    }

    console.log(`   ✅ ${slide.folder} done.`);

    // Save slide metadata to Firestore
    await setDoc(doc(db, "hero_slides", slide.docId), {
      cloudinaryFolder: cloudFolder,
      totalFrames: slide.total,
      firstFrame: slide.first,
      ext: slide.ext,
      fit: slide.fit,
      order: SLIDES.indexOf(slide),
    });
    console.log(`   Firestore → hero_slides/${slide.docId}\n`);
  }

  console.log("✅ All frames uploaded and metadata synced to Firestore.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
