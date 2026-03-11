import fs from "fs";
import path from "path";
import GalleryClient from "./GalleryClient";

function readImagesFromFolder(folderName: string) {
    const folderPath = path.join(process.cwd(), "public", folderName);
    if (!fs.existsSync(folderPath)) return [];

    const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

    return fs
        .readdirSync(folderPath)
        .filter((file) => ALLOWED_EXT.has(path.extname(file).toLowerCase()))
        .map((file) => ({
            src: `/${folderName}/${file}`,
            alt: path
                .basename(file, path.extname(file))
                .replace(/[-_]/g, " ")
                .replace(/\s+/g, " ")
                .trim(),
        }));
}

export default function GalleryPage() {
    const foodImages = readImagesFromFolder("food");
    const ambienceImages = readImagesFromFolder("ambience"); // add /public/ambience/ whenever ready

    return <GalleryClient foodImages={foodImages} ambienceImages={ambienceImages} />;
}
