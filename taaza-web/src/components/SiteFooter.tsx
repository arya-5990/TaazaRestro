"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

const footerNav = {
    Discover: ["The Menu", "Chef's Table", "Private Dining", "Catering & Events"],
    Experience: ["Reserve a Table", "Gift Vouchers", "Loyalty Programme", "Seasonal Menus"],
    Connect: ["Our Story", "Press & Media", "Careers", "Contact Us"],
};

const socialLinks = [
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Youtube, label: "YouTube", href: "#" },
];

export default function SiteFooter() {
    return (
        <footer className="relative border-t border-[var(--gold-border)] overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(180deg, var(--obsidian-mid) 0%, var(--obsidian) 100%)",
                }}
            />

            {/* Decorative arcs */}
            <svg
                className="absolute top-0 left-0 w-full opacity-[0.03] pointer-events-none"
                viewBox="0 0 1440 300"
                fill="none"
            >
                <path d="M0 0 Q720 300 1440 0" stroke="#C9A84C" strokeWidth="1" />
                <path d="M0 60 Q720 360 1440 60" stroke="#C9A84C" strokeWidth="0.5" />
            </svg>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-8">
                {/* Top row — Wordmark + Nav */}
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-16">
                    {/* Brand block */}
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                        >
                            <span
                                style={{ fontFamily: "var(--font-display)" }}
                                className="text-3xl tracking-[0.2em] text-[var(--gold-primary)]"
                            >
                                TAAZA
                            </span>
                            <p
                                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                                className="text-[var(--text-muted)] text-sm mt-1 mb-5"
                            >
                                Arabic Fusion
                            </p>
                            <div className="gold-rule mb-6" />
                            <p
                                style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem" }}
                                className="text-[var(--text-secondary)] leading-relaxed max-w-xs"
                            >
                                A sanctuary for those who believe food is more than sustenance —
                                it is culture, memory, and art.
                            </p>

                            {/* Contact */}
                            <div className="mt-8 space-y-3">
                                {[
                                    { Icon: MapPin, text: "12, Fusion Quarter, Bandra West, Mumbai 400050" },
                                    { Icon: Phone, text: "+91 22 6789 0012" },
                                    { Icon: Mail, text: "reserve@taazarestaurant.in" },
                                ].map(({ Icon, text }) => (
                                    <div key={text} className="flex items-start gap-3 group">
                                        <div className="mt-0.5 p-1.5 rounded-md border border-[var(--gold-border)] shrink-0"
                                            style={{ background: "var(--gold-muted)" }}>
                                            <Icon
                                                size={11}
                                                className="text-[var(--gold-primary)] group-hover:text-[var(--gold-light)] transition-colors duration-300"
                                                strokeWidth={1.5}
                                                style={{
                                                    filter: "drop-shadow(0 0 4px rgba(201,168,76,0.5))",
                                                }}
                                            />
                                        </div>
                                        <span
                                            className="text-[var(--text-secondary)] text-xs leading-relaxed group-hover:text-[var(--text-primary)] transition-colors duration-300"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Nav columns */}
                    {Object.entries(footerNav).map(([title, links], colIndex) => (
                        <motion.div
                            key={title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: colIndex * 0.1 + 0.2 }}
                        >
                            <p className="label-cinzel text-[var(--gold-primary)] mb-6">{title}</p>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="text-[var(--text-secondary)] hover:text-[var(--gold-light)] transition-colors duration-300 text-sm relative group inline-flex items-center gap-1.5"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            <span
                                                className="inline-block w-0 h-px bg-[var(--gold-primary)] group-hover:w-3 transition-all duration-300"
                                            />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="border-t border-[var(--gold-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p
                        className="text-[var(--text-muted)] text-xs"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        © 2025 Taaza Restaurant Pvt. Ltd. &nbsp;·&nbsp; All rights reserved
                    </p>

                    {/* Social */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map(({ icon: Icon, label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                aria-label={label}
                                onClick={(e) => e.preventDefault()}
                                className="p-2.5 rounded-full border border-[var(--gold-border)] text-[var(--gold-primary)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 group"
                                whileHover={{ scale: 1.12, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.5}
                                    style={{
                                        filter: "drop-shadow(0 0 6px rgba(201,168,76,0.4))",
                                    }}
                                />
                            </motion.a>
                        ))}
                    </div>

                    {/* Tagline */}
                    <p
                        className="flourish text-[var(--text-muted)] text-xs"
                    >
                        Crafted with passion. Served with love.
                    </p>
                </div>
            </div>
        </footer>
    );
}
