/**
 * One-time migration script:
 *   1. Uploads one representative frame per slide to Cloudinary
 *   2. Saves the secure_url to Firestore `hero_slides` collection
 *
 * Run:  npx tsx scripts/upload-hero-slides.mts
 * Requires: dotenv  (npm i -D dotenv)
 *           tsx     (npm i -D tsx)
 */
import "dotenv/config";
import { resolve } from "path";
import { existsSync } from "fs";
import { uploadToCloudinary } from "../src/lib/cloudinary.js";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

/* ── Firebase init (reuses the same env vars as the app) ── */
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

/**
 * Each entry picks ONE frame from the original animation sequence.
 * Adjust `frame` if you want a different hero shot (e.g. mid-animation).
 * The last frame is usually the fully-assembled view.
 */
const SLIDES = [
  { folder: "food-1", frame: 96, ext: "png", docId: "slide-0" },
  { folder: "food-2", frame: 127, ext: "png", docId: "slide-1" },
  { folder: "food-3", frame: 129, ext: "png", docId: "slide-2" },
  { folder: "drink-1", frame: 154, ext: "png", docId: "slide-3" },
];

async function main() {
  console.log("🚀 Starting hero-slide upload…\n");

  for (let i = 0; i < SLIDES.length; i++) {
    const slide = SLIDES[i];
    const filename = `ezgif-frame-${String(slide.frame).padStart(3, "0")}.${slide.ext}`;
    const filePath = resolve("public", slide.folder, filename);

    if (!existsSync(filePath)) {
      console.warn(`⚠  Skipped – file not found: ${filePath}`);
      continue;
    }

    console.log(`[${i + 1}/${SLIDES.length}] Uploading ${slide.folder}/${filename}…`);

    const result = await uploadToCloudinary(filePath, {
      folder: "taaza/hero",
      publicId: slide.folder, // e.g. taaza/hero/food-1
    });

    console.log(`   Cloudinary → ${result.secure_url}`);

    // ── Save to Firestore ──
    await setDoc(doc(db, "hero_slides", slide.docId), {
      imageUrl: result.secure_url,
      publicId: result.public_id,
      order: i,
    });

    console.log(`   Firestore  → hero_slides/${slide.docId}\n`);
  }

  console.log("✅ All hero slides uploaded and synced to Firestore.");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Upload failed:", err);
  process.exit(1);
});
