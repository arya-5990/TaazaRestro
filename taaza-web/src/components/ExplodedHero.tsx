"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const SIGNATURE_ITEMS = [
    {
        id: 1, name: "The Taaza", nameAccent: "Burger", subtitle: "Smash patty · Sumac aioli · Pickled jalapeño", note: "Our Signature Creation", tag: "Chef's Choice",
        frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    },
    {
        id: 2, name: "Taaza Cold", nameAccent: "Coffee", subtitle: "Rich espresso · Frothy milk · Signature syrup", note: "A Refreshing Classic", tag: "Fan Favorite",
        frames: { folder: "food 2", total: 131, first: 1, ext: "jpg", fit: "contain" }
    },
    {
        id: 3, name: "Kofta", nameAccent: "Al Aseel", subtitle: "Grilled minced lamb · Rose harissa · Pomegranate glaze", note: "A Heritage Recipe", tag: "Tradition",
        frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    },
    {
        id: 4, name: "Mezze", nameAccent: "Platter", subtitle: "Hummus · Mutabal · Fattoush · Warm pita", note: "To Share, To Savour", tag: "For Two",
        frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    },
    {
        id: 5, name: "Arabic", nameAccent: "Fusion Bowl", subtitle: "Saffron rice · Chicken · Za'atar oil · Feta", note: "East Meets West", tag: "New Season",
        frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    },
];

export default function ExplodedHero() {
    const outerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<{ [slide: number]: HTMLImageElement[] }>({});

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

    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            const item = SIGNATURE_ITEMS[activeSlide];
            setFrameIndex(Math.round(v * (item.frames.total - 1)));
        });
    }, [scrollYProgress, activeSlide]);

    /* ── Progressive frame preload ── */
    useEffect(() => {
        const item = SIGNATURE_ITEMS[activeSlide];
        const TOTAL_FRAMES = item.frames.total;
        const FIRST_FRAME = item.frames.first;

        if (!imagesRef.current[activeSlide]) {
            imagesRef.current[activeSlide] = [];
        }

        if (imagesRef.current[activeSlide].length > Math.min(15, TOTAL_FRAMES)) {
            setImagesLoaded(true);
            setFrameIndex(cur => cur);
            return;
        }

        setImagesLoaded(false);

        const loadFrame = (i: number) => {
            const img = new window.Image();
            img.src = `/${item.frames.folder}/ezgif-frame-${String(FIRST_FRAME + i).padStart(3, "0")}.${item.frames.ext}`;
            img.onload = () => {
                imagesRef.current[activeSlide][i] = img;
                if (i === 0) setImagesLoaded(true);
                setFrameIndex((cur) => cur);
            };
        };

        for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) loadFrame(i);

        const timer = setTimeout(() => {
            for (let i = 15; i < TOTAL_FRAMES; i++) loadFrame(i);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeSlide]);

    /* ── Draw frame → canvas with cover-fit crop ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let img = imagesRef.current[activeSlide]?.[frameIndex];
        if (!img?.complete || !img.naturalWidth) {
            for (let f = frameIndex - 1; f >= 0; f--) {
                const candidate = imagesRef.current[activeSlide]?.[f];
                if (candidate?.complete && candidate.naturalWidth) { img = candidate; break; }
            }
            if (!img?.complete || !img.naturalWidth) {
                for (let f = frameIndex + 1; f < SIGNATURE_ITEMS[activeSlide].frames.total; f++) {
                    const candidate = imagesRef.current[activeSlide]?.[f];
                    if (candidate?.complete && candidate.naturalWidth) { img = candidate; break; }
                }
            }
        }
        if (!img?.complete || !img.naturalWidth) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        canvas.width = vw;
        canvas.height = vh;

        const fit = SIGNATURE_ITEMS[activeSlide].frames.fit || "cover";

        ctx.clearRect(0, 0, vw, vh);

        // Calculate aspect ratios for "cover" logic (always needed for the background)
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = vw / vh;
        let coverSw = img.naturalWidth;
        let coverSh = img.naturalHeight;
        let coverSx = 0;
        let coverSy = 0;

        if (imgAspect > canvasAspect) {
            coverSw = img.naturalHeight * canvasAspect;
            coverSx = (img.naturalWidth - coverSw) / 2;
        } else {
            coverSh = img.naturalWidth / canvasAspect;
            coverSy = (img.naturalHeight - coverSh) / 2;
        }

        if (fit === "contain") {
            const scale = Math.min(vw / img.naturalWidth, vh / img.naturalHeight);
            const dw = img.naturalWidth * scale;
            const dh = img.naturalHeight * scale;
            let dx = (vw - dw) / 2;
            const dy = (vh - dh) / 2;

            // On larger landscape screens, align logic to the right to balance the text
            if (vw > 768 && vw > vh) {
                dx = vw - dw - (vw * 0.05); // 5% from right border
            }

            // 1. Draw blurred & dimmed 'cover' background to fill empty space
            ctx.filter = "blur(20px) brightness(0.35)";
            ctx.drawImage(img, coverSx, coverSy, coverSw, coverSh, 0, 0, vw, vh);
            ctx.filter = "none";

            // 2. Draw actual full image
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
        } else {
            // Standard "cover" fit
            ctx.drawImage(img, coverSx, coverSy, coverSw, coverSh, 0, 0, vw, vh);
        }
    }, [frameIndex, imagesLoaded, activeSlide]);

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
