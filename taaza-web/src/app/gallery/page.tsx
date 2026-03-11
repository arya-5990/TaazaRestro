"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrimaryNavigation from "@/components/PrimaryNavigation";
import SiteFooter from "@/components/SiteFooter";

const CATEGORIES = ["Food", "Ambience"] as const;
type Category = typeof CATEGORIES[number];

export default function GalleryPage() {
    const [active, setActive] = useState<Category>("Food");

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
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "3.5rem",
                        padding: "0 1.5rem",
                    }}
                >
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
                                padding: "0.75rem 2.5rem",
                                cursor: "pointer",
                                transition: "color 0.3s ease, border-color 0.3s ease",
                                position: "relative",
                            }}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* ── Gallery Grid ── */}
                <div
                    style={{
                        maxWidth: "80rem",
                        margin: "0 auto",
                        padding: "0 1.75rem",
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                                gap: "1.25rem",
                                minHeight: "320px",
                            }}
                        >
                            {/* Empty state */}
                            <div
                                style={{
                                    gridColumn: "1 / -1",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "1rem",
                                    padding: "6rem 0",
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
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <SiteFooter />
        </>
    );
}
