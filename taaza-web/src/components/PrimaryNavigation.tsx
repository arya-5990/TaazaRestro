"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
    { label: "Experience", href: "#experience" },
    { label: "Menu", href: "#menu" },
    { label: "Testimonials", href: "#story" },
    { label: "Gallery", href: "/gallery" },
];

export default function PrimaryNavigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // Track which section is currently in view (home page only)
    useEffect(() => {
        if (pathname !== "/") return;
        const sectionIds = ["experience", "menu", "story"];
        const observers: IntersectionObserver[] = [];
        const ratios: Record<string, number> = {};

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    ratios[id] = entry.intersectionRatio;
                    // Pick the section with the highest intersection ratio
                    const best = Object.entries(ratios).sort((a, b) => b[1] - a[1])[0];
                    if (best && best[1] > 0.15) setActiveSection(`#${best[0]}`);
                    else if (Object.values(ratios).every((r) => r === 0)) setActiveSection("");
                },
                { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [pathname]);

    // Determine if a given nav link is the active one
    const isActive = (href: string) => {
        if (href.startsWith("/")) return pathname === href;          // e.g. /gallery
        return activeSection === href;                                // e.g. #experience
    };

    const scrollTo = (href: string) => {
        setMobileOpen(false);
        if (href.startsWith("/")) {
            router.push(href);
        } else if (pathname !== "/") {
            // On sub-pages (e.g. /gallery), navigate home first then scroll
            router.push(`/${href}`);
        } else {
            document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
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

                    {/* ── Logo (Brand Recreation) ── */}
                    <motion.a
                        href="/"
                        onClick={(e) => { e.preventDefault(); if (pathname === "/") { window.scrollTo({ top: 0, behavior: "smooth" }); } else { router.push("/"); } }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{
                            textDecoration: "none",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "0.15rem",
                            flexShrink: 0,
                        }}
                    >
                        {/* Red Fez Hat — placed over 'T' */}
                        <img
                            src="/Red_hat.png"
                            alt=""
                            aria-hidden="true"
                            style={{
                                height: scrolled ? "30px" : "38px",
                                width: "auto",
                                objectFit: "contain",
                                transition: "all 0.4s ease",
                                filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.5))",
                                marginBottom: "-6px",
                                marginTop: "-4px",
                                transform: scrolled ? "translateX(-1.35rem)" : "translateX(-1.6rem)",
                            }}
                        />

                        {/* Wordmark: Taaza + Restaurant */}
                        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.08rem", lineHeight: 1 }}>
                            <span style={{
                                fontFamily: "'Montserrat', 'Inter', sans-serif",
                                fontWeight: 800,
                                fontSize: scrolled ? "1.1rem" : "1.35rem",
                                letterSpacing: "0.01em",
                                color: "#FFFFFF",
                                transition: "font-size 0.4s ease",
                                lineHeight: 1,
                            }}>
                                Taaza
                            </span>
                            <span style={{
                                fontFamily: "'Montserrat', 'Inter', sans-serif",
                                fontWeight: 400,
                                fontSize: scrolled ? "0.42rem" : "0.5rem",
                                letterSpacing: "0.25em",
                                color: "rgba(210,210,210,0.70)",
                                textTransform: "uppercase",
                                transition: "font-size 0.4s ease",
                                lineHeight: 1,
                            }}>
                                Restaurant
                            </span>
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
                        {NAV_LINKS.map((link, i) => {
                            const active = isActive(link.href);
                            return (
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
                                    {/* Active underline (white) + hover underline (gold) */}
                                    <motion.span
                                        animate={{ scaleX: active ? 1 : 0 }}
                                        transition={{ duration: 0.35, ease: "easeOut" }}
                                        style={{
                                            position: "absolute",
                                            bottom: 0, left: 0, right: 0,
                                            height: "1px",
                                            background: "#ffffff",
                                            transformOrigin: "left",
                                        }}
                                    />
                                    {/* Hover underline (gold, only when not active) */}
                                    {!active && (
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
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>

                    {/* ── "Book Table" CTA (hidden on mobile) ── */}
                    {/* <motion.button
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
                    </motion.button> */}

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
