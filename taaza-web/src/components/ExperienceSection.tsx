"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";



export default function ExperienceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const imageVersion = "2026-03-08";
    const imageFrame = {
        interior: "center 55%",
        chef: "center 38%",
        terrace: "center 68%",
    } as const;

    /* Parallax for images */
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });
    const imgY1 = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
    const imgY2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
    const imgY3 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.1 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
            },
        },
    };

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative pt-[var(--space-section)] pb-4 overflow-hidden"
        >
            {/* Subtle background texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 100% 60% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
                }}
            />

            <div className="max-w-7xl mx-auto px-6">
                {/* Section marker */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-4 mb-14"
                >
                    <div className="h-px w-8 bg-[var(--gold-primary)]" />
                    <span className="label-cinzel">The Experience</span>
                </motion.div>

                {/* ────────────────────────────────────────────
            ASYMMETRIC BENTO GRID
            Col ratio: 5fr | 3fr | 4fr (intentional asymmetry)
            ──────────────────────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr_4fr] gap-4 mb-0 z-10 relative">

                    {/* CELL 1 — Large image, tall */}
                    <motion.div
                        className="relative min-h-[420px] lg:min-h-[520px] overflow-hidden group"
                        style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.9, delay: 0.1 }}
                    >
                        <motion.div className="absolute inset-0" style={{ y: imgY1, scale: 1.04 }}>
                            <Image
                                src={`/interior.png?v=${imageVersion}`}
                                alt="Taaza restaurant dining room — ornate Arabic décor with warm amber lighting"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                style={{ objectPosition: imageFrame.interior }}
                                sizes="(max-width: 1024px) 100vw, 42vw"
                            />
                        </motion.div>
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] via-transparent to-transparent opacity-60" />

                        {/* Bottom text */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="label-cinzel text-[var(--gold-primary)] mb-1">The Atmosphere</p>
                            <p
                                style={{ fontFamily: "var(--font-serif)" }}
                                className="text-xl text-[var(--text-primary)] font-light"
                            >
                                Where every wall tells a story
                            </p>
                        </div>

                        {/* Gold border accent */}
                        <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]"
                            style={{ borderRadius: "inherit" }}
                        />
                    </motion.div>

                    {/* CELL 2 — Text card + small image stack */}
                    <div className="flex flex-col gap-4">
                        {/* Text block */}
                        <motion.div
                            className="glass-surface p-8 flex-1"
                            style={{ borderRadius: "0.5rem 2rem 0.5rem 0.5rem" }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.25 }}
                        >
                            <h2 className="headline-lg mb-4">
                                Born from <em className="flourish">ancient</em> spice routes
                            </h2>
                            <p
                                className="text-[var(--text-secondary)] leading-relaxed mb-6"
                                style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem" }}
                            >
                                Taaza — meaning &quot;fresh&quot; in Arabic — was conceived as a love letter to Levantine gastronomy.
                                Every recipe carries the fingerprint of generations, reinterpreted through a contemporary lens.
                            </p>
                            <div className="gold-rule" />
                            <p className="mt-5 flourish text-[var(--gold-light)] text-sm">
                                &quot;Food is memory. We cook memories.&quot;
                            </p>
                            <p className="label-cinzel mt-2 text-[var(--text-muted)] text-[0.55rem]">
                                — Chef Ibrahim Al-Rashid, Founder
                            </p>
                        </motion.div>

                        {/* Social proof floating badge */}
                        <motion.div
                            className="relative glass-surface p-5 border border-[var(--gold-border)]"
                            style={{ borderRadius: "2rem 0.5rem 0.5rem 0.5rem" }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            {/* Gold Z-space badge */}
                            <motion.div
                                className="absolute -top-4 -right-4 glass-surface px-3 py-1.5 border border-[var(--gold-primary)] z-10"
                                style={{
                                    borderRadius: "0.75rem",
                                    background: "rgba(201,168,76,0.12)",
                                }}
                                animate={{ y: [0, -4, 0] }}
                                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            >
                                <span className="label-cinzel text-[0.55rem] text-[var(--gold-primary)]">
                                    ★ Rated #1
                                </span>
                            </motion.div>

                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold-primary)] to-[var(--gold-dark)] flex items-center justify-center">
                                    <span style={{ fontFamily: "var(--font-display)", fontSize: "0.6rem" }}>G</span>
                                </div>
                                <div>
                                    <p className="text-[var(--text-primary)] text-xs font-medium">Fatima R.</p>
                                    <p className="text-[var(--gold-primary)] text-xs">★★★★★</p>
                                </div>
                            </div>
                            <p className="text-[var(--text-secondary)] text-xs leading-relaxed italic" style={{ fontFamily: "var(--font-serif)" }}>
                                &quot;The most authentic Arabic fusion I&apos;ve experienced outside of Beirut. Transcendent.&quot;
                            </p>
                        </motion.div>
                    </div>

                    {/* CELL 3 — Two images stacked */}
                    <div className="flex flex-col gap-4">
                        <motion.div
                            className="relative min-h-[300px] lg:min-h-[300px] overflow-hidden group flex-1"
                            style={{ borderRadius: "0.5rem 2rem 0.5rem 0.5rem" }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.2 }}
                        >
                            <motion.div className="absolute inset-0" style={{ y: imgY2, scale: 1.07 }}>
                                <Image
                                    src={`/chef.jpeg?v=${imageVersion}`}
                                    alt="Chef plating a premium Arabic fusion dish with gold leaf"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    style={{ objectPosition: imageFrame.chef }}
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-b from-[var(--obsidian)] via-transparent to-transparent opacity-40" />
                            <div className="absolute top-4 left-4">
                                <span className="label-cinzel">The Craft</span>
                            </div>
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]" style={{ borderRadius: "inherit" }} />
                        </motion.div>

                        <motion.div
                            className="relative min-h-[280px] lg:min-h-[240px] overflow-hidden group"
                            style={{ borderRadius: "0.5rem 0.5rem 2rem 0.5rem" }}
                            initial={{ opacity: 0, x: 50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.35 }}
                        >
                            <motion.div className="absolute inset-0" style={{ y: imgY3, scale: 1.06 }}>
                                <Image
                                    src={`/terrace.jpeg?v=${imageVersion}`}
                                    alt="Taaza restaurant terrace at golden hour with fairy lights"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    style={{ objectPosition: imageFrame.terrace }}
                                    sizes="(max-width: 1024px) 100vw, 33vw"
                                />
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] via-transparent to-transparent opacity-50" />
                            <div className="absolute bottom-4 left-4">
                                <p className="flourish text-sm text-[var(--gold-light)]">Al Fresco Dining</p>
                            </div>
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]" style={{ borderRadius: "inherit" }} />
                        </motion.div>
                    </div>
                </div>


            </div>
        </section>
    );
}
