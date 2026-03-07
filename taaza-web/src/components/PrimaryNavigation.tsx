"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Experience", href: "#experience" },
    { label: "Menu", href: "#menu" },
    { label: "Story", href: "#story" },
    { label: "Reserve", href: "#reserve" },
];

export default function PrimaryNavigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const scrollTo = (href: string) => {
        setMobileOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            {/* ─────────────────────────────────────────────────────────────
          Primary Nav Bar
          Always has a dark gradient so links are visible over any
          background; transitions to a solid blur on scroll.
          ───────────────────────────────────────────────────────────── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0,
                    zIndex: 50,
                }}
            >
                {/* Dark background layer — gradient at top, solid when scrolled */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute", inset: 0,
                        background: scrolled
                            ? "rgba(5, 4, 10, 0.95)"
                            : "linear-gradient(180deg, rgba(5,4,10,0.88) 0%, rgba(5,4,10,0.0) 100%)",
                        backdropFilter: scrolled ? "blur(18px)" : "none",
                        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
                        borderBottom: scrolled
                            ? "1px solid rgba(201,168,76,0.18)"
                            : "none",
                        transition: "all 0.5s ease",
                    }}
                />

                {/* ── Inner flex row: logo | links | cta ── */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 1,
                        maxWidth: "80rem",
                        margin: "0 auto",
                        padding: `${scrolled ? "0.8rem" : "1.35rem"} 1.75rem`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        transition: "padding 0.4s ease",
                    }}
                >

                    {/* ── Logo / Wordmark ── */}
                    <motion.a
                        href="#"
                        onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                            textDecoration: "none",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-start",
                            gap: "0.15rem",
                            flexShrink: 0,
                        }}
                    >
                        <span style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.3rem",
                            letterSpacing: "0.2em",
                            color: "var(--gold-primary)",
                            lineHeight: 1,
                        }}>
                            TAAZA
                        </span>
                        <span style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: "0.58rem",
                            letterSpacing: "0.3em",
                            color: "rgba(232,201,122,0.65)",
                            lineHeight: 1,
                        }}>
                            Arabic Fusion
                        </span>
                    </motion.a>

                    {/* ── Desktop navigation links (hidden on mobile) ── */}
                    <nav
                        aria-label="Main navigation"
                        className="hidden md:flex"
                        style={{
                            alignItems: "center",
                            gap: "2.75rem",
                        }}
                    >
                        {NAV_LINKS.map((link, i) => (
                            <motion.button
                                key={link.href}
                                onClick={() => scrollTo(link.href)}
                                aria-label={`Navigate to ${link.label}`}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.12 + i * 0.08, duration: 0.55 }}
                                whileHover={{ color: "#C9A84C" }}
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "0.6rem",
                                    letterSpacing: "0.22em",
                                    textTransform: "uppercase",
                                    color: "rgba(232,201,122,0.80)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "0.25rem 0",
                                    position: "relative",
                                    lineHeight: 1,
                                    transition: "color 0.3s ease",
                                }}
                            >
                                {link.label}
                                {/* Animated underline */}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    style={{
                                        position: "absolute",
                                        bottom: 0, left: 0, right: 0,
                                        height: "1px",
                                        background: "var(--gold-primary)",
                                        transformOrigin: "left",
                                    }}
                                />
                            </motion.button>
                        ))}
                    </nav>

                    {/* ── "Book Table" CTA (hidden on mobile) ── */}
                    <motion.button
                        onClick={() => scrollTo("#reserve")}
                        id="nav-book-btn"
                        className="!hidden md:!flex btn-gold-outline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55, duration: 0.6 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{ flexShrink: 0 }}
                    >
                        Book Table
                    </motion.button>

                    {/* ── Mobile hamburger (visible only on mobile) ── */}
                    <button
                        onClick={() => setMobileOpen((v) => !v)}
                        aria-label="Open navigation menu"
                        id="mobile-menu-toggle"
                        className="!flex md:!hidden"
                        style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            gap: "0.3rem",
                            padding: "0.4rem",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        <motion.span animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.28 }} style={{ display: "block", width: "1.5rem", height: "1px", background: "var(--gold-primary)", transformOrigin: "center" }} />
                        <motion.span animate={mobileOpen ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }} transition={{ duration: 0.22 }} style={{ display: "block", width: "1rem", height: "1px", background: "var(--gold-primary)" }} />
                        <motion.span animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }} transition={{ duration: 0.28 }} style={{ display: "block", width: "1.5rem", height: "1px", background: "var(--gold-primary)", transformOrigin: "center" }} />
                    </button>
                </div>
            </motion.header>

            {/* ─────────────────────────────────────────────────────────────
          Mobile Full-Screen Drawer
          ───────────────────────────────────────────────────────────── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="glass-surface"
                        style={{
                            position: "fixed", inset: 0, zIndex: 40,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            gap: "1.75rem",
                        }}
                        initial={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 92% 4%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
                        transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                    >
                        {NAV_LINKS.map((link, i) => (
                            <motion.button
                                key={link.href}
                                onClick={() => scrollTo(link.href)}
                                className="headline-md"
                                style={{
                                    color: "var(--text-primary)", background: "none",
                                    border: "none", cursor: "pointer",
                                }}
                                whileHover={{ color: "var(--gold-primary)", scale: 1.02 }}
                                initial={{ opacity: 0, y: 28 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.09 + 0.18 }}
                            >
                                {link.label}
                            </motion.button>
                        ))}

                        <motion.button
                            onClick={() => scrollTo("#reserve")}
                            className="btn-gold-outline"
                            style={{ marginTop: "0.5rem" }}
                            initial={{ opacity: 0, y: 28 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.52 }}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            Book Table
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
