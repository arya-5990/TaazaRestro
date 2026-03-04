"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const TOTAL_FRAMES = 93;
const FIRST_FRAME = 4;
const frameUrl = (n: number) =>
    `/food-1/ezgif-frame-${String(n).padStart(3, "0")}.png`;

const SIGNATURE_ITEMS = [
    { id: 1, name: "The Taaza", nameAccent: "Burger", subtitle: "Smash patty · Sumac aioli · Pickled jalapeño", note: "Our Signature Creation", tag: "Chef's Choice" },
    { id: 2, name: "Shawarma", nameAccent: "Royale", subtitle: "Slow-roasted lamb · Arabic spice blend · Garlic toum", note: "From the Wood-fire Rotisserie", tag: "Most Loved" },
    { id: 3, name: "Kofta", nameAccent: "Al Aseel", subtitle: "Grilled minced lamb · Rose harissa · Pomegranate glaze", note: "A Heritage Recipe", tag: "Tradition" },
    { id: 4, name: "Mezze", nameAccent: "Platter", subtitle: "Hummus · Mutabal · Fattoush · Warm pita", note: "To Share, To Savour", tag: "For Two" },
    { id: 5, name: "Arabic", nameAccent: "Fusion Bowl", subtitle: "Saffron rice · Chicken · Za'atar oil · Feta", note: "East Meets West", tag: "New Season" },
];

export default function ExplodedHero() {
    const outerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);

    const [frameIndex, setFrameIndex] = useState(0);
    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    /* ── Scroll: track the outer 300vh container ── */
    const { scrollYProgress } = useScroll({
        target: outerRef,
        offset: ["start start", "end end"],
    });

    const rawFrame = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    useEffect(() => {
        return rawFrame.on("change", (v) => setFrameIndex(Math.round(v)));
    }, [rawFrame]);

    /* ── Preload all frames ── */
    useEffect(() => {
        let loaded = 0;
        imagesRef.current = [];
        for (let i = 0; i < TOTAL_FRAMES; i++) {
            const img = new window.Image();
            img.src = frameUrl(FIRST_FRAME + i);
            img.onload = () => { loaded++; if (loaded === TOTAL_FRAMES) setImagesLoaded(true); };
            imagesRef.current[i] = img;
        }
    }, []);

    /* ── Draw frame → canvas with cover-fit crop ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const img = imagesRef.current[frameIndex];
        if (!canvas || !img?.complete || !img.naturalWidth) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        canvas.width = vw;
        canvas.height = vh;

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = vw / vh;
        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

        if (imgAspect > canvasAspect) {
            sw = img.naturalHeight * canvasAspect;
            sx = (img.naturalWidth - sw) / 2;
        } else {
            sh = img.naturalWidth / canvasAspect;
            sy = (img.naturalHeight - sh) / 2;
        }
        ctx.clearRect(0, 0, vw, vh);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, vw, vh);
    }, [frameIndex, imagesLoaded]);

    useEffect(() => {
        const onResize = () => setFrameIndex(f => f); // force redraw
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* ── Slide nav ── */
    const navigateTo = (idx: number, dir: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection(dir);
        setActiveSlide(idx);
        setTimeout(() => setIsTransitioning(false), 600);
    };
    const goNext = () => navigateTo((activeSlide + 1) % SIGNATURE_ITEMS.length, 1);
    const goPrev = () => navigateTo((activeSlide - 1 + SIGNATURE_ITEMS.length) % SIGNATURE_ITEMS.length, -1);
    const current = SIGNATURE_ITEMS[activeSlide];

    const tv = {
        enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
    };

    return (
        /*
          300vh outer = the scroll budget for the animation.
          The inner sticky panel stays anchored to the top
          while the user burns through that scroll space.
        */
        <div
            ref={outerRef}
            id="hero"
            style={{ position: "relative", height: "300vh" }}
        >
            {/* ── Sticky viewport panel ── */}
            <div
                style={{
                    position: "sticky",
                    top: 0,
                    height: "100vh",
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                {/* Loading spinner */}
                {!imagesLoaded && (
                    <div style={{
                        position: "absolute", inset: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "var(--obsidian)", zIndex: 0,
                    }}>
                        <motion.div
                            style={{
                                width: 56, height: 56, borderRadius: "50%",
                                border: "1px solid var(--gold-primary)",
                                borderTopColor: "transparent",
                            }}
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        />
                    </div>
                )}

                {/* ── Full-screen canvas ── */}
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%", height: "100%",
                        display: "block",
                        opacity: imagesLoaded ? 1 : 0,
                        transition: "opacity 0.5s ease",
                    }}
                />

                {/* ── Vignette — light so food shows through everywhere ── */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute", inset: 0, pointerEvents: "none",
                        background: [
                            /* radial dark corners */
                            "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(5,4,10,0.45) 100%)",
                            /* left-side fade for text legibility */
                            "linear-gradient(to right, rgba(5,4,10,0.70) 0%, rgba(5,4,10,0.30) 50%, transparent 100%)",
                            /* very subtle bottom fade — only 30% opacity, NOT 90% */
                            "linear-gradient(to top, rgba(5,4,10,0.55) 0%, transparent 35%)",
                            /* top fade for nav */
                            "linear-gradient(to bottom, rgba(5,4,10,0.40) 0%, transparent 20%)",
                        ].join(", "),
                    }}
                />

                {/* ── Text overlay — left-center, clear of the dark zone ── */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",   /* vertically centered */
                        paddingLeft: "clamp(2rem, 8vw, 6rem)",
                        paddingBottom: "4rem",
                        pointerEvents: "none",
                        maxWidth: "680px",
                    }}
                >
                    {/* Label */}
                    <motion.div
                        style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        <div style={{ width: "2.5rem", height: "1px", background: "var(--gold-primary)" }} />
                        <span className="label-cinzel">Signature Collection</span>
                    </motion.div>

                    {/* Slide counter */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.5rem" }}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.span
                                key={`num-${activeSlide}`}
                                custom={direction}
                                variants={tv}
                                initial="enter" animate="center" exit="exit"
                                transition={{ duration: 0.35 }}
                                style={{
                                    fontFamily: "var(--font-serif)",
                                    fontSize: "clamp(1.5rem, 3vw, 2rem)",
                                    fontWeight: 300,
                                    color: "var(--gold-primary)",
                                    opacity: 0.55,
                                    lineHeight: 1,
                                }}
                            >0{activeSlide + 1}</motion.span>
                        </AnimatePresence>
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)" }}>/ 05</span>
                    </div>

                    {/* Headline */}
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.h1
                            key={`title-${activeSlide}`}
                            custom={direction}
                            variants={tv}
                            initial="enter" animate="center" exit="exit"
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                            className="headline-xl"
                            style={{ lineHeight: 0.92, marginBottom: "0.85rem" }}
                        >
                            {current.name}{" "}
                            <em className="flourish">{current.nameAccent}</em>
                        </motion.h1>
                    </AnimatePresence>

                    {/* Subtitle */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`sub-${activeSlide}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, delay: 0.08 }}
                            style={{
                                fontFamily: "var(--font-body)", fontSize: "0.875rem",
                                color: "var(--text-secondary)", letterSpacing: "0.06em",
                                marginBottom: "0.3rem",
                            }}
                        >{current.subtitle}</motion.p>
                    </AnimatePresence>

                    {/* Note */}
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={`note-${activeSlide}`}
                            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.35, delay: 0.12 }}
                            className="flourish"
                            style={{ fontSize: "0.9rem", color: "var(--gold-light)", marginBottom: "1.4rem" }}
                        >— {current.note}</motion.p>
                    </AnimatePresence>

                    {/* Controls row — re-enable pointer events */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", pointerEvents: "auto", flexWrap: "wrap" }}>

                        {/* Tag pill */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`tag-${activeSlide}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="glass-surface"
                                style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 1rem", borderRadius: "9999px" }}
                            >
                                <span style={{ width: "0.35rem", height: "0.35rem", borderRadius: "50%", background: "var(--gold-primary)", display: "inline-block" }} />
                                <span className="label-cinzel" style={{ fontSize: "0.57rem" }}>{current.tag}</span>
                            </motion.div>
                        </AnimatePresence>

                        {/* Prev */}
                        <ArrowBtn id="hero-prev-btn" onClick={goPrev} aria-label="Previous dish">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ArrowBtn>

                        {/* Next */}
                        <ArrowBtn id="hero-next-btn" onClick={goNext} aria-label="Next dish">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </ArrowBtn>

                        {/* Dot indicators */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                            {SIGNATURE_ITEMS.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigateTo(i, i > activeSlide ? 1 : -1)}
                                    aria-label={`Slide ${i + 1}`}
                                    style={{
                                        borderRadius: "9999px", height: "0.3rem", border: "none", cursor: "pointer",
                                        width: i === activeSlide ? "1.4rem" : "0.3rem",
                                        background: i === activeSlide ? "var(--gold-primary)" : "rgba(201,168,76,0.35)",
                                        transition: "all 0.4s ease",
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Right floating badges ── */}
                <motion.div
                    style={{ position: "absolute", right: "2rem", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                >
                    <FloatingBadge label="Premium" value="Halal Certified" delay={0} />
                    <FloatingBadge label="Since 2019" value="★★★★★ · 200+ Reviews" delay={0.5} />
                </motion.div>

                {/* ── Scroll cue ── */}
                <motion.div
                    style={{
                        position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.6rem",
                    }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                >
                    <span className="label-cinzel" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontSize: "0.52rem" }}>
                        Scroll to assemble
                    </span>
                    <div style={{ width: 1, height: "3.5rem", background: "linear-gradient(to bottom, transparent, var(--gold-primary), transparent)" }} />
                    <motion.div
                        style={{ width: "0.3rem", height: "0.3rem", borderRadius: "50%", background: "var(--gold-primary)" }}
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* ── Scroll progress bar ── */}
                <motion.div
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
                        background: "linear-gradient(to right, var(--gold-dark), var(--gold-primary), var(--gold-light))",
                        scaleX: scrollYProgress,
                        transformOrigin: "left",
                    }}
                />

                {/* ── Bottom section fade ── */}
                <div
                    aria-hidden="true"
                    style={{
                        position: "absolute", bottom: 0, left: 0, right: 0, height: "5rem",
                        background: "linear-gradient(to top, var(--obsidian), transparent)",
                        pointerEvents: "none",
                    }}
                />
            </div>
        </div>
    );
}

/* ── Sub-components ── */
function ArrowBtn({ id, onClick, children, "aria-label": ariaLabel }: {
    id: string; onClick: () => void; children: React.ReactNode; "aria-label": string;
}) {
    return (
        <motion.button
            id={id}
            onClick={onClick}
            aria-label={ariaLabel}
            style={{
                width: "2.6rem", height: "2.6rem", borderRadius: "50%",
                border: "1px solid var(--gold-border)",
                background: "rgba(5,4,10,0.55)",
                backdropFilter: "blur(6px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold-primary)", cursor: "pointer",
            }}
            whileHover={{ scale: 1.1, background: "var(--gold-primary)", color: "var(--obsidian)" }}
            whileTap={{ scale: 0.9 }}
        >{children}</motion.button>
    );
}

function FloatingBadge({ label, value, delay }: { label: string; value: string; delay: number }) {
    return (
        <motion.div
            className="glass-surface"
            style={{ padding: "0.6rem 0.9rem", borderRadius: "0.75rem" }}
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 + delay, ease: "easeInOut", delay }}
        >
            <p className="label-cinzel" style={{ fontSize: "0.5rem", color: "var(--gold-primary)" }}>{label}</p>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "0.82rem", color: "var(--text-primary)", marginTop: "0.1rem" }}>{value}</p>
        </motion.div>
    );
}
