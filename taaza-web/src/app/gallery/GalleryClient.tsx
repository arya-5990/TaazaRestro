"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PrimaryNavigation from "@/components/PrimaryNavigation";
import SiteFooter from "@/components/SiteFooter";

const CATEGORIES = ["Food", "Ambience"] as const;
type Category = typeof CATEGORIES[number];

interface GalleryImage {
    src: string;
    alt: string;
}

interface Props {
    foodImages: GalleryImage[];
    ambienceImages: GalleryImage[];
}

export default function GalleryClient({ foodImages, ambienceImages }: Props) {
    const [active, setActive] = useState<Category>("Food");
    const [lightbox, setLightbox] = useState<number | null>(null);

    const GALLERY_DATA: Record<Category, GalleryImage[]> = {
        Food: foodImages,
        Ambience: ambienceImages,
    };

    const images = GALLERY_DATA[active];

    const closeLightbox = () => setLightbox(null);
    const prev = () => setLightbox((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    const next = () => setLightbox((i) => (i === null ? null : (i + 1) % images.length));

    return (
        <>
            <div className="grain-overlay" aria-hidden="true" />
            <div className="scanline-overlay" aria-hidden="true" />
            <PrimaryNavigation />

            <main
                style={{
                    minHeight: "100vh",
                    background: "var(--obsidian)",
                    paddingTop: "8rem",
                    paddingBottom: "var(--space-section)",
                }}
            >
                {/* ── Page Header ── */}
                <div style={{ textAlign: "center", marginBottom: "3.5rem", padding: "0 1.5rem" }}>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "0.55rem",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            color: "var(--gold-primary)",
                            marginBottom: "1rem",
                        }}
                    >
                        Visual Stories
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.75, delay: 0.1 }}
                        style={{
                            fontFamily: "var(--font-serif)",
                            fontWeight: 300,
                            fontSize: "clamp(2.8rem, 6vw, 5rem)",
                            color: "var(--text-primary)",
                            lineHeight: 1.1,
                            marginBottom: "1.25rem",
                        }}
                    >
                        Our <em style={{ color: "var(--gold-primary)", fontStyle: "italic" }}>Gallery</em>
                    </motion.h1>

                    <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.7, delay: 0.25 }}
                        style={{
                            display: "block",
                            width: "4rem",
                            height: "1px",
                            background: "linear-gradient(90deg, transparent, var(--gold-primary), transparent)",
                            margin: "0 auto",
                        }}
                    />
                </div>

                {/* ── Category Tabs ── */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "0",
                        marginBottom: "4rem",
                        padding: "0 1.5rem",
                    }}
                >
                    {CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat}
                            onClick={() => setActive(cat)}
                            whileHover={{ color: "#C9A84C" }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "0.6rem",
                                letterSpacing: "0.25em",
                                textTransform: "uppercase",
                                color: active === cat ? "var(--gold-primary)" : "rgba(245,240,232,0.45)",
                                background: "none",
                                border: "none",
                                borderBottom: active === cat
                                    ? "1px solid var(--gold-primary)"
                                    : "1px solid rgba(201,168,76,0.15)",
                                padding: "0.75rem 2.5rem 1.25rem",
                                cursor: "pointer",
                                transition: "color 0.3s ease, border-color 0.3s ease",
                                position: "relative",
                            }}
                        >
                            {cat}
                            {images.length > 0 && active === cat && (
                                <span
                                    style={{
                                        position: "absolute",
                                        bottom: "0.4rem",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.42rem",
                                        letterSpacing: "0.12em",
                                        color: "rgba(201,168,76,0.45)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {images.length} photos
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* ── Gallery Grid ── */}
                <div style={{ maxWidth: "88rem", margin: "0 auto", padding: "0 1.75rem" }}>
                    <AnimatePresence mode="wait">
                        {images.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "1rem",
                                    padding: "8rem 0",
                                    border: "1px dashed rgba(201,168,76,0.2)",
                                    borderRadius: "4px",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.5rem",
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        color: "rgba(201,168,76,0.35)",
                                    }}
                                >
                                    {active} images coming soon
                                </span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={active}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                style={{ columns: "3 280px", columnGap: "1rem" }}
                            >
                                {images.map((img, i) => (
                                    <motion.div
                                        key={img.src}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.55,
                                            delay: i * 0.04,
                                            ease: [0.25, 0.46, 0.45, 0.94],
                                        }}
                                        onClick={() => setLightbox(i)}
                                        style={{
                                            breakInside: "avoid",
                                            marginBottom: "1rem",
                                            position: "relative",
                                            overflow: "hidden",
                                            borderRadius: "6px",
                                            cursor: "zoom-in",
                                            display: "block",
                                        }}
                                        whileHover="hover"
                                    >
                                        <Image
                                            src={img.src}
                                            alt={img.alt}
                                            width={600}
                                            height={400}
                                            unoptimized
                                            style={{
                                                width: "100%",
                                                height: "auto",
                                                display: "block",
                                                objectFit: "cover",
                                                transition: "transform 0.55s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)";
                                            }}
                                            onMouseLeave={(e) => {
                                                (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                                            }}
                                        />
                                        {/* Hover label overlay */}
                                        <motion.div
                                            variants={{ hover: { opacity: 1 } }}
                                            initial={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                background: "linear-gradient(180deg, transparent 50%, rgba(5,4,10,0.75) 100%)",
                                                display: "flex",
                                                alignItems: "flex-end",
                                                padding: "1rem",
                                                pointerEvents: "none",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontFamily: "var(--font-display)",
                                                    fontSize: "0.48rem",
                                                    letterSpacing: "0.2em",
                                                    textTransform: "uppercase",
                                                    color: "rgba(201,168,76,0.8)",
                                                }}
                                            >
                                                {img.alt}
                                            </span>
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <SiteFooter />

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {lightbox !== null && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={closeLightbox}
                        style={{
                            position: "fixed",
                            inset: 0,
                            zIndex: 200,
                            background: "rgba(5,4,10,0.95)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backdropFilter: "blur(12px)",
                        }}
                    >
                        {/* Close */}
                        <button
                            onClick={closeLightbox}
                            aria-label="Close lightbox"
                            style={{
                                position: "absolute",
                                top: "1.5rem",
                                right: "1.75rem",
                                background: "none",
                                border: "none",
                                color: "rgba(232,201,122,0.7)",
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                lineHeight: 1,
                                zIndex: 1,
                            }}
                        >
                            ✕
                        </button>

                        {/* Prev */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            aria-label="Previous image"
                            style={{
                                position: "absolute",
                                left: "1.25rem",
                                background: "rgba(201,168,76,0.12)",
                                border: "1px solid rgba(201,168,76,0.25)",
                                borderRadius: "50%",
                                color: "rgba(232,201,122,0.85)",
                                width: "2.75rem",
                                height: "2.75rem",
                                fontSize: "1.4rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ‹
                        </button>

                        {/* Image */}
                        <motion.img
                            key={lightbox}
                            src={images[lightbox].src}
                            alt={images[lightbox].alt}
                            initial={{ opacity: 0, scale: 0.94 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                maxWidth: "min(90vw, 80rem)",
                                maxHeight: "85vh",
                                objectFit: "contain",
                                borderRadius: "6px",
                                boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
                            }}
                        />

                        {/* Next */}
                        <button
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            aria-label="Next image"
                            style={{
                                position: "absolute",
                                right: "1.25rem",
                                background: "rgba(201,168,76,0.12)",
                                border: "1px solid rgba(201,168,76,0.25)",
                                borderRadius: "50%",
                                color: "rgba(232,201,122,0.85)",
                                width: "2.75rem",
                                height: "2.75rem",
                                fontSize: "1.4rem",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            ›
                        </button>

                        {/* Counter */}
                        <span
                            style={{
                                position: "absolute",
                                bottom: "1.5rem",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontFamily: "var(--font-display)",
                                fontSize: "0.85rem",
                                letterSpacing: "0.25em",
                                color: "rgba(201,168,76,0.75)",
                                textTransform: "uppercase",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {lightbox + 1} / {images.length}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
