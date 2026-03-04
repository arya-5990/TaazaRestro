"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const testimonials = [
    {
        name: "Aisha Al-Khatib",
        role: "Food Critic · The Arabian Table",
        quote:
            "Taaza has achieved what few restaurants dare attempt — the seamless marriage of tradition and innovation. The kofta alone is worth the journey.",
        rating: 5,
        initial: "A",
        size: "lg",
    },
    {
        name: "Rohan Mehta",
        role: "Verified Guest · Google",
        quote:
            "Absolutely breathtaking interiors. The shawarma royale was a revelation — layers of flavour I didn't know existed.",
        rating: 5,
        initial: "R",
        size: "sm",
    },
    {
        name: "Priya Nair",
        role: "Food Blogger · Spice & Soul",
        quote:
            "The mezze platter arrived like a painting. The hummus is impossibly smooth. Taaza understands that presentation is part of the taste.",
        rating: 5,
        initial: "P",
        size: "sm",
    },
    {
        name: "Xavier Torres",
        role: "Chef & Restaurateur",
        quote:
            "As a professional, I rarely say this — but Taaza made me feel like a guest at someone&apos;s grandmother&apos;s table. Genuine, soulful cooking.",
        rating: 5,
        initial: "X",
        size: "md",
    },
];

const statHighlights = [
    { value: "200+", label: "Five-Star Reviews" },
    { value: "4.9", label: "Average Rating" },
    { value: "5", label: "Years of Excellence" },
    { value: "40+", label: "Menu Creations" },
];

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-8%" });

    return (
        <section
            id="story"
            ref={sectionRef}
            className="relative py-[var(--space-section)] overflow-hidden"
        >
            {/* Grain texture overlay for this section */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 70% 80% at 20% 60%, rgba(201,168,76,0.06) 0%, transparent 65%)",
                }}
            />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
                    <div>
                        <motion.div
                            className="flex items-center gap-4 mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="h-px w-8 bg-[var(--gold-primary)]" />
                            <span className="label-cinzel">Guest Stories</span>
                        </motion.div>
                        <motion.h2
                            className="headline-lg"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            What our <em className="flourish">guests</em> say
                        </motion.h2>
                    </div>

                    {/* Stat row */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.4, duration: 0.8 }}
                    >
                        {statHighlights.map((stat) => (
                            <div key={stat.label} className="text-center lg:text-right">
                                <p
                                    className="text-3xl font-light text-[var(--gold-primary)]"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                >
                                    {stat.value}
                                </p>
                                <p className="label-cinzel text-[0.55rem] text-[var(--text-muted)] mt-1">
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* ASYMMETRIC TESTIMONIAL GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[5fr_3fr_4fr_4fr] gap-4">
                    {testimonials.map((t, i) => {
                        const borderRadiusMap = [
                            "2rem 0.5rem 0.5rem 2rem",
                            "0.5rem 2rem 0.5rem 0.5rem",
                            "0.5rem 0.5rem 2rem 0.5rem",
                            "2rem 0.5rem 2rem 0.5rem",
                        ];

                        return (
                            <motion.div
                                key={t.name}
                                className="relative glass-surface p-7 group cursor-default"
                                style={{ borderRadius: borderRadiusMap[i] }}
                                initial={{ opacity: 0, y: 50 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.7, delay: i * 0.12 + 0.2 }}
                                whileHover={{ y: -4 }}
                            >
                                {/* Quote mark decoration */}
                                <div
                                    className="absolute top-4 right-6 text-7xl leading-none text-[var(--gold-primary)] opacity-10 pointer-events-none"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                    aria-hidden="true"
                                >
                                    "
                                </div>

                                {/* Stars */}
                                <div className="flex gap-0.5 mb-5">
                                    {Array.from({ length: t.rating }).map((_, j) => (
                                        <motion.span
                                            key={j}
                                            className="text-[var(--gold-primary)] text-sm"
                                            initial={{ opacity: 0, scale: 0 }}
                                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                            transition={{ delay: i * 0.12 + j * 0.06 + 0.5 }}
                                        >
                                            ★
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Quote */}
                                <p
                                    className="text-[var(--text-primary)] leading-relaxed mb-6 text-sm"
                                    style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: t.size === "lg" ? "1rem" : "0.875rem" }}
                                >
                                    &ldquo;{t.quote}&rdquo;
                                </p>

                                <div className="h-px bg-gradient-to-r from-[var(--gold-primary)] to-transparent opacity-30 mb-5" />

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-[var(--obsidian)] text-sm font-medium"
                                        style={{
                                            background: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
                                            fontFamily: "var(--font-display)",
                                        }}
                                    >
                                        {t.initial}
                                    </div>
                                    <div>
                                        <p
                                            className="text-[var(--text-primary)] text-sm font-medium leading-tight"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {t.name}
                                        </p>
                                        <p
                                            className="text-[var(--text-muted)] text-xs mt-0.5"
                                            style={{ fontFamily: "var(--font-body)" }}
                                        >
                                            {t.role}
                                        </p>
                                    </div>
                                </div>

                                {/* Floating gold accent badge */}
                                {i === 0 && (
                                    <motion.div
                                        className="absolute -top-3 -right-3 z-10 glass-surface px-3 py-1 border border-[var(--gold-primary)]"
                                        style={{ borderRadius: "0.75rem", background: "rgba(201,168,76,0.15)" }}
                                        animate={{ y: [0, -5, 0] }}
                                        transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                                    >
                                        <span className="label-cinzel text-[0.5rem] text-[var(--gold-primary)]">
                                            Featured Review
                                        </span>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
