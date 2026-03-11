"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
    // ── Slide 1 ──
    { name: "Huzefa Badshah", role: "Verified Guest", quote: "Amazing place for Arabic chicken and shawarma. The food is always fresh, tasty, and the chicken is perfectly cooked and juicy.", rating: 5, initial: "H", featured: true },
    { name: "Birju Raikwar", role: "Verified Guest", quote: "Authentic and gorgeous food. The chicken shawarma, falafel, and grilled fish are all top-notch.", rating: 5, initial: "B" },
    { name: "Yash Gadwal", role: "Verified Guest", quote: "Found the best Turkish-style shawarma in Indore here. The paneer shawarma was also brilliant.", rating: 5, initial: "Y" },
    { name: "Burhanuddin Badshah", role: "Verified Guest", quote: "A treat for chicken lovers. The shawarma and crispy chicken are juicy, tender, and packed with flavor.", rating: 5, initial: "B" },
    { name: "Anmol Menghani", role: "Verified Guest", quote: "Authentic taste that exceeds expectations. The ambiance and aura of the restaurant are unmatchable.", rating: 5, initial: "A" },
    { name: "Khadija Badshah", role: "Verified Guest", quote: "Great place for fresh, juicy chicken. Good portions and quick service.", rating: 5, initial: "K" },
    // ── Slide 2 ──
    { name: "Siddhant Soni", role: "Verified Guest", quote: "Truly amazing for chicken lovers. One of the few places in the city with high hygiene standards.", rating: 5, initial: "S" },
    { name: "Yashvardhan Sharma", role: "Verified Guest", quote: "Best shawarma plate in town. Great for gym freaks if you substitute Arabian sauce with coleslaw.", rating: 5, initial: "Y" },
    { name: "Nidhi Choudhary", role: "Verified Guest", quote: "Delicious biryani with authentic flavors and juicy chicken. The raita completes the meal.", rating: 5, initial: "N" },
    { name: "Rajeev Gupta", role: "Verified Guest", quote: "Excellent food quality and authentic Lebanese cuisine. A must-visit place.", rating: 5, initial: "R" },
    { name: "Bharanidharan Rajaraman", role: "Verified Guest", quote: "Amazing tandoori and butter chicken. The biryani has a rich aroma and great taste.", rating: 5, initial: "B" },
    { name: "Pranjal Agnihotri", role: "Verified Guest", quote: "Awesome taste and fresh meat. Highly recommends the tandoori chicken and shawarma.", rating: 5, initial: "P" },
    // ── Slide 3 ──
    { name: "Neeraj Jatav", role: "Verified Guest", quote: "Unique combination of tandoori chicken served with hummus and pita. Very tasty.", rating: 5, initial: "N" },
    { name: "Mustansir Sanawadwala", role: "Verified Guest", quote: "Authentic Arabic cuisine. Having grown up in Kuwait, this felt like eating back home.", rating: 5, initial: "M" },
    { name: "Narendra Singh Rawat", role: "Verified Guest", quote: "The right place for authentic food. Staff is humble and service is amazing.", rating: 5, initial: "N" },
    { name: "Harish Vasnani", role: "Verified Guest", quote: "Exceptional hospitality from the owner and staff. The atmosphere is cozy and welcoming.", rating: 5, initial: "H" },
    { name: "Ali Aaliya", role: "Verified Guest", quote: "Perfect place for Middle Eastern cuisine. Has tried half the non-veg menu and recommends it.", rating: 5, initial: "A" },
    { name: "Nalini Singh", role: "Verified Guest", quote: "Amazing food and service with a very health-inspired menu.", rating: 5, initial: "N" },
    // ── Slide 4 ──
    { name: "Deepanshu Batra", role: "Verified Guest", quote: "Good taste. A must-try place for non-veg lovers.", rating: 5, initial: "D" },
    { name: "Zainab Husain", role: "Verified Guest", quote: "Awesome taste; expressed a definite desire to visit again.", rating: 5, initial: "Z" },
    { name: "Devesh Bokil", role: "Verified Guest", quote: "Ambient setting. Rates look high but are worth it due to huge serving sizes and fast service.", rating: 5, initial: "D" },
    { name: "Leepak Kumar Sahoo", role: "Verified Guest", quote: "Unique and delicious dinner experience, though the price is a little high.", rating: 5, initial: "L" },
    { name: "Yusufali Ali", role: "Verified Guest", quote: "Very good and authentic Lebanese food in Indore with proper hygiene.", rating: 5, initial: "Y" },
    { name: "Aditya Ingle", role: "Verified Guest", quote: "Must try the shawarma. Prices and menu have been updated.", rating: 5, initial: "A" },
    // ── Slide 5 ──
    { name: "Mushtak Batterywala", role: "Verified Guest", quote: "Probably the best Lebanese food in Indore with reasonable prices.", rating: 5, initial: "M" },
    { name: "Digvijay Singh", role: "Verified Guest", quote: "Wonderful place to eat authentic Lebanese food.", rating: 5, initial: "D" },
    { name: "Ahmed Nadeem", role: "Verified Guest", quote: "Tandoori chicken was the best ever. Restaurant was super clean and staff were kind.", rating: 5, initial: "A" },
    { name: "Pankaj Parihar", role: "Verified Guest", quote: "One of the best places for Middle Eastern chicken. Friends travel from Bhopal just to eat here.", rating: 5, initial: "P" },
    { name: "Ziya Khan", role: "Verified Guest", quote: "Delicious food and cooperative staff. Suggested that the speed of delivery could be improved.", rating: 5, initial: "Z" },
    { name: "Vijay Sharma", role: "Verified Guest", quote: "The chicken broast was fabulous and exceeded expectations. Great for health-conscious people.", rating: 5, initial: "V" },
];

// Cards per slide handled dynamically in component

const statHighlights = [
    { value: "200+", label: "Five-Star Reviews" },
    { value: "4.9", label: "Average Rating" },
    { value: "5", label: "Years of Excellence" },
    { value: "40+", label: "Menu Creations" },
];

const borderRadiusMap = [
    "2rem 0.5rem 0.5rem 2rem",
    "0.5rem 2rem 0.5rem 0.5rem",
    "0.5rem 0.5rem 2rem 0.5rem",
    "2rem 0.5rem 2rem 0.5rem",
    "0.5rem 2rem 0.5rem 2rem",
    "2rem 0.5rem 0.5rem 0.5rem",
];

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? 120 : -120,
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
        x: dir > 0 ? -120 : 120,
        opacity: 0,
    }),
};

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-8%" });

    const [cardsPerSlide, setCardsPerSlide] = useState(6);

    // Adjust cards per slide based on mobile viewport
    useEffect(() => {
        const handleResize = () => setCardsPerSlide(window.innerWidth < 768 ? 3 : 6);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);

    const [page, setPage] = useState(0);
    const [direction, setDirection] = useState(1);

    const goTo = useCallback((index: number, dir: number) => {
        setDirection(dir);
        setPage((index + totalSlides) % totalSlides);
    }, [totalSlides]);

    const prev = () => goTo(page - 1, -1);
    const next = () => goTo(page + 1, 1);

    const pageCards = testimonials.slice(
        page * cardsPerSlide,
        page * cardsPerSlide + cardsPerSlide
    );

    return (
        <section
            id="story"
            ref={sectionRef}
            className="relative pt-[calc(var(--space-section)*0.4)] pb-[var(--space-section)] overflow-hidden"
        >
            {/* Background glow */}
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

                    {/* Stat row & Controls */}
                    <div className="flex flex-col items-center lg:items-end gap-10">
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

                        {/* Controls row */}
                        <motion.div
                            className="flex items-center gap-6"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            {/* Left arrow */}
                            <button
                                onClick={prev}
                                aria-label="Previous reviews"
                                className="w-10 h-10 rounded-full border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-primary)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 group"
                                style={{ background: "rgba(10,8,6,0.6)", backdropFilter: "blur(8px)" }}
                            >
                                <ChevronLeft
                                    size={16}
                                    strokeWidth={1.5}
                                    className="group-hover:-translate-x-0.5 transition-transform duration-200"
                                />
                            </button>

                            {/* Dot indicators */}
                            <div className="flex items-center gap-2.5">
                                {Array.from({ length: totalSlides }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goTo(i, i > page ? 1 : -1)}
                                        aria-label={`Go to slide ${i + 1}`}
                                        className="transition-all duration-300"
                                        style={{
                                            width: i === page ? "24px" : "6px",
                                            height: "6px",
                                            borderRadius: "999px",
                                            background:
                                                i === page
                                                    ? "var(--gold-primary)"
                                                    : "rgba(201,168,76,0.25)",
                                            border: "1px solid var(--gold-border)",
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Right arrow */}
                            <button
                                onClick={next}
                                aria-label="Next reviews"
                                className="w-10 h-10 rounded-full border border-[var(--gold-border)] flex items-center justify-center text-[var(--gold-primary)] hover:border-[var(--gold-primary)] hover:bg-[var(--gold-muted)] transition-all duration-300 group"
                                style={{ background: "rgba(10,8,6,0.6)", backdropFilter: "blur(8px)" }}
                            >
                                <ChevronRight
                                    size={16}
                                    strokeWidth={1.5}
                                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                                />
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* ── PAGINATED GRID ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                >
                    {/* Slide area */}
                    <div className="relative overflow-hidden w-full pb-8">
                        <AnimatePresence custom={direction} mode="wait">
                            <motion.div
                                key={page}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
                                className="columns-1 md:columns-2 xl:columns-3 gap-6"
                            >
                                {pageCards.map((t, i) => (
                                    <motion.div
                                        key={`${page}-${i}`}
                                        className="relative glass-surface p-8 group cursor-default break-inside-avoid mb-6 inline-block w-full text-left"
                                        style={{ borderRadius: borderRadiusMap[i % borderRadiusMap.length] }}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.55, delay: i * 0.07 }}
                                        whileHover={{ y: -4 }}
                                    >
                                        {/* Quote mark decoration */}
                                        <div
                                            className="absolute top-4 right-6 text-7xl leading-none text-[var(--gold-primary)] opacity-10 pointer-events-none select-none"
                                            style={{ fontFamily: "var(--font-serif)" }}
                                            aria-hidden="true"
                                        >
                                            &quot;
                                        </div>

                                        {/* Stars */}
                                        <div className="flex gap-0.5 mb-5">
                                            {Array.from({ length: t.rating }).map((_, j) => (
                                                <motion.span
                                                    key={j}
                                                    className="text-[var(--gold-primary)] text-sm"
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.07 + j * 0.05 + 0.2 }}
                                                >
                                                    ★
                                                </motion.span>
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <p
                                            className="text-[var(--text-primary)] leading-relaxed mb-6 text-sm"
                                            style={{
                                                fontFamily: "var(--font-serif)",
                                                fontStyle: "italic",
                                                fontSize: i === 0 ? "1rem" : "0.875rem",
                                            }}
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

                                        {/* Featured badge — first card of first slide only */}
                                        {page === 0 && i === 0 && t.featured && (
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
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>


                </motion.div>
            </div>
        </section>
    );
}
