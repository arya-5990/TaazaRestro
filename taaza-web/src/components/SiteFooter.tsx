"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";

const footerNav = {
    Discover: ["The Menu", "Chef's Table", "Private Dining", "Catering & Events"],
    Experience: ["Reserve a Table", "Gift Vouchers", "Loyalty Programme", "Seasonal Menus"],
    Connect: ["Our Story", "Press & Media", "Careers", "Contact Us"],
};

const socialLinks = [
    { imageSrc: "/social_media_and_delivery_partner/instagram.png", label: "Instagram", href: "https://www.instagram.com/taazaindore/" },
    { imageSrc: "/social_media_and_delivery_partner/Zomato_logo.png", label: "Zomato", href: "http://zoma.to/r/20493103" },
    { imageSrc: "/social_media_and_delivery_partner/swiggy.jpeg", label: "Swiggy", href: "https://www.swiggy.com/city/indore/taaza-restaurant-ab-road-vijay-nagar-rest642525" },
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1.5fr] gap-x-8 gap-y-12 mb-16">
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
                                    { Icon: MapPin, text: "Shop No. LG-4, Exotica Lower Ground Floor, Shalimar Township, AB Road, Indore, MP 452010" },
                                    { Icon: Phone, text: "+91 731 XXX XXXX" },
                                    { Icon: Mail, text: "reserve@taazaindore.in" },
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

                    {/* Order Online Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                    >
                        <p className="label-cinzel text-[var(--gold-primary)] mb-6">ORDER ONLINE</p>
                        <div className="flex flex-col gap-4">
                            <a
                                href="http://zoma.to/r/20493103"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--gold-border)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 w-full bg-white/5"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
                                    {/* Using standard img to bypass Next/Image external domain configs */}
                                    <img src="/social_media_and_delivery_partner/Zomato_logo.png" alt="Zomato" className="w-full h-full object-contain rounded-full" />
                                </div>
                                <span className="text-[var(--text-secondary)] group-hover:text-[var(--gold-light)] text-sm" style={{ fontFamily: "var(--font-body)" }}>Order on Zomato</span>
                            </a>
                            <a
                                href="https://www.swiggy.com/city/indore/taaza-restaurant-ab-road-vijay-nagar-rest642525"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 p-3 rounded-lg border border-[var(--gold-border)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 w-full bg-white/5"
                            >
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-white flex items-center justify-center p-1">
                                    <img src="/social_media_and_delivery_partner/swiggy.jpeg" alt="Swiggy" className="w-full h-full object-contain rounded-full" />
                                </div>
                                <span className="text-[var(--text-secondary)] group-hover:text-[var(--gold-light)] text-sm" style={{ fontFamily: "var(--font-body)" }}>Order on Swiggy</span>
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Google Maps Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-10"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="gold-rule flex-1" />
                        <p
                            className="label-cinzel text-[var(--gold-primary)] text-xs tracking-[0.2em]"
                        >
                            FIND US
                        </p>
                        <div className="gold-rule flex-1" />
                    </div>

                    <div
                        className="relative w-full overflow-hidden"
                        style={{
                            borderRadius: "12px",
                            border: "1px solid var(--gold-border)",
                            boxShadow: "0 0 40px rgba(201, 168, 76, 0.08), inset 0 0 0 1px rgba(201,168,76,0.05)",
                            height: "280px",
                        }}
                    >
                        {/* Subtle gold corner accents */}
                        <span className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[var(--gold-primary)] z-10 pointer-events-none" style={{ borderRadius: "12px 0 0 0" }} />
                        <span className="absolute top-0 right-0 w-5 h-5 border-t border-r border-[var(--gold-primary)] z-10 pointer-events-none" style={{ borderRadius: "0 12px 0 0" }} />
                        <span className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-[var(--gold-primary)] z-10 pointer-events-none" style={{ borderRadius: "0 0 0 12px" }} />
                        <span className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-[var(--gold-primary)] z-10 pointer-events-none" style={{ borderRadius: "0 0 12px 0" }} />

                        <iframe
                            title="Taaza Restaurant Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3679.4338!2d75.8999899!3d22.7643345!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39631d33fc9f7ca5%3A0xf0d00e09c8feb0f3!2sTaaza%20Restaurant!5e0!3m2!1sen!2sin!4v1709000000000!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(0.3) contrast(1.05) brightness(0.85)" }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                    {/* Directions link */}
                    <div className="flex justify-end mt-3">
                        <a
                            href="https://maps.app.goo.gl/P2EjTduRYVzvJfjh8"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[var(--gold-primary)] hover:text-[var(--gold-light)] transition-colors duration-300 text-xs group"
                            style={{ fontFamily: "var(--font-body)" }}
                        >
                            <MapPin size={11} strokeWidth={1.5} />
                            <span className="underline underline-offset-2 decoration-[var(--gold-border)] group-hover:decoration-[var(--gold-primary)] transition-all duration-300">
                                Open in Google Maps
                            </span>
                        </a>
                    </div>
                </motion.div>

                {/* Bottom bar */}
                <div className="border-t border-[var(--gold-border)] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Copyright */}
                    <p
                        className="text-[var(--text-muted)] text-xs"
                        style={{ fontFamily: "var(--font-body)" }}
                    >
                        © {new Date().getFullYear()} Taaza Restaurant Pvt. Ltd. &nbsp;·&nbsp; All rights reserved
                    </p>

                    {/* Social */}
                    <div className="flex items-center gap-4">
                        {socialLinks.map(({ imageSrc, label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                aria-label={label}
                                target={href !== "#" ? "_blank" : undefined}
                                rel={href !== "#" ? "noopener noreferrer" : undefined}
                                onClick={href === "#" ? (e) => e.preventDefault() : undefined}
                                className="w-10 h-10 rounded-full border border-[var(--gold-border)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 group flex items-center justify-center overflow-hidden bg-white/5"
                                whileHover={{ scale: 1.12, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <img
                                    src={imageSrc}
                                    alt={label}
                                    className="w-full h-full object-cover"
                                    style={{ padding: "0.4rem", borderRadius: "50%" }}
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
