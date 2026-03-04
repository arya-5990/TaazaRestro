"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { label: "Experience", href: "#experience" },
    { label: "Menu", href: "#menu" },
    { label: "Story", href: "#story" },
    { label: "Reserve", href: "#reserve" },
];

/* Nav always has a dark base — only the blur/border changes on scroll */
const NAV_BASE = {
    position: "fixed" as const,
    top: 0, left: 0, right: 0,
    zIndex: 50,
};

export default function PrimaryNavigation() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollTo = (href: string) => {
        setMobileOpen(false);
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <>
            <motion.nav
                style={NAV_BASE}
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                {/* ── Persistent dark gradient so links are always readable ── */}
                <div
                    style={{
                        position: "absolute", inset: 0,
                        background: scrolled
                            ? "rgba(5,4,10,0.94)"
                            : "linear-gradient(to bottom, rgba(5,4,10,0.82) 0%, rgba(5,4,10,0.0) 100%)",
                        backdropFilter: scrolled ? "blur(16px)" : "none",
                        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
                        borderBottom: scrolled ? "1px solid rgba(201,168,76,0.15)" : "none",
                        transition: "background 0.5s ease, backdrop-filter 0.5s ease",
                    }}
                />

                <div
                    style={{
                        position: "relative", zIndex: 1,
                        maxWidth: "80rem", margin: "0 auto",
                        padding: scrolled ? "0.85rem 1.5rem" : "1.4rem 1.5rem",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        transition: "padding 0.4s ease",
                    }}
                >
                    {/* ── Wordmark ── */}
                    <motion.a
                        href="#"
                        style={{ textDecoration: "none", cursor: "pointer", display: "flex", flexDirection: "column" }}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                        <span style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "1.35rem",
                            letterSpacing: "0.18em",
                            color: "var(--gold-primary)",
                            lineHeight: 1,
                        }}>TAAZA</span>
                        <span style={{
                            fontFamily: "var(--font-serif)",
                            fontStyle: "italic",
                            fontSize: "0.6rem",
                            letterSpacing: "0.35em",
                            /* Use gold-light so it reads on the dark gradient */
                            color: "rgba(232,201,122,0.7)",
                            lineHeight: 1,
                            marginTop: "0.15rem",
                        }}>Arabic Fusion</span>
                    </motion.a>

                    {/* ── Desktop nav links ── */}
                    <ul style={{ display: "flex", alignItems: "center", gap: "2.5rem", listStyle: "none" }}
                        className="hidden md:flex">
                        {navLinks.map((link, i) => (
                            <motion.li
                                key={link.href}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, duration: 0.6 }}
                            >
                                <button
                                    onClick={() => scrollTo(link.href)}
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "0.62rem",
                                        letterSpacing: "0.22em",
                                        textTransform: "uppercase",
                                        /* Gold-tinted cream — always visible on dark nav background */
                                        color: "rgba(232,201,122,0.85)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        position: "relative",
                                        padding: "0.2rem 0",
                                        transition: "color 0.3s ease",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,201,122,0.85)")}
                                    className="nav-link-btn"
                                >
                                    {link.label}
                                    {/* Gold underline on hover */}
                                    <span style={{
                                        position: "absolute", bottom: -2, left: 0,
                                        height: "1px", background: "var(--gold-primary)",
                                        width: 0, transition: "width 0.35s ease",
                                    }}
                                        className="nav-underline"
                                    />
                                </button>
                            </motion.li>
                        ))}
                    </ul>

                    {/* ── Book Table CTA ── */}
                    <motion.button
                        onClick={() => scrollTo("#reserve")}
                        className="hidden md:flex btn-gold-outline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Book Table
                    </motion.button>

                    {/* ── Mobile hamburger ── */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        style={{ display: "flex", flexDirection: "column", gap: "0.35rem", padding: "0.5rem", background: "none", border: "none", cursor: "pointer" }}
                        aria-label="Toggle navigation"
                        id="mobile-menu-toggle"
                        className="md:hidden"
                    >
                        {[
                            mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 },
                            mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 },
                            mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 },
                        ].map((anim, i) => (
                            <motion.span
                                key={i}
                                animate={anim}
                                transition={{ duration: 0.3 }}
                                style={{
                                    display: "block",
                                    width: i === 1 ? "1rem" : "1.5rem",
                                    height: "1px",
                                    background: "var(--gold-primary)",
                                }}
                            />
                        ))}
                    </button>
                </div>
            </motion.nav>

            {/* ── Mobile Drawer ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        className="glass-surface"
                        style={{
                            position: "fixed", inset: 0, zIndex: 40,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", gap: "2rem",
                        }}
                        initial={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
                        animate={{ opacity: 1, clipPath: "circle(150% at 95% 5%)" }}
                        exit={{ opacity: 0, clipPath: "circle(0% at 95% 5%)" }}
                        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                        {navLinks.map((link, i) => (
                            <motion.button
                                key={link.href}
                                onClick={() => scrollTo(link.href)}
                                className="headline-md"
                                style={{
                                    color: "var(--text-primary)", background: "none",
                                    border: "none", cursor: "pointer",
                                    transition: "color 0.3s",
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-primary)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.2 }}
                            >
                                {link.label}
                            </motion.button>
                        ))}
                        <motion.button
                            onClick={() => scrollTo("#reserve")}
                            className="btn-gold-outline"
                            style={{ marginTop: "0.5rem" }}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            Book Table
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hover underline style for nav links */}
            <style>{`
        .nav-link-btn:hover .nav-underline { width: 100% !important; }
      `}</style>
        </>
    );
}
