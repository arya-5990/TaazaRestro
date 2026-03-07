"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";

interface SignatureItem {
    id: number; name: string; nameAccent: string; subtitle: string; note: string; tag: string;
    frames: { folder: string; total: number; first: number; ext: string; fit: string };
}

const SIGNATURE_ITEMS: SignatureItem[] = [
    {
        id: 1, name: "The Taaza", nameAccent: "Burger", subtitle: "Smash patty · Sumac aioli · Pickled jalapeño", note: "Our Signature Creation", tag: "Chef's Choice",
        frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    },
    {
        id: 2, name: "Taaza Cold", nameAccent: "Coffee", subtitle: "Rich espresso · Frothy milk · Signature syrup", note: "A Refreshing Classic", tag: "Fan Favorite",
        frames: { folder: "food-2", total: 127, first: 1, ext: "png", fit: "cover" }
    },
    {
        id: 3, name: "Kofta", nameAccent: "Al Aseel", subtitle: "Grilled minced lamb · Rose harissa · Pomegranate glaze", note: "A Heritage Recipe", tag: "Tradition",
        frames: { folder: "food-3", total: 212, first: 1, ext: "png", fit: "cover" }
    },
    {
        id: 4, name: "Mezze", nameAccent: "Platter", subtitle: "Hummus · Mutabal · Fattoush · Warm pita", note: "To Share, To Savour", tag: "For Two",
        frames: { folder: "drink-1", total: 212, first: 1, ext: "png", fit: "cover" }
    },
    // {
    //     id: 5, name: "Arabic", nameAccent: "Fusion Bowl", subtitle: "Saffron rice · Chicken · Za'atar oil · Feta", note: "East Meets West", tag: "New Season",
    //     frames: { folder: "food-1", total: 93, first: 4, ext: "png", fit: "cover" }
    // },
];

export default function ExplodedHero() {
    const outerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<{ [slide: number]: HTMLImageElement[] }>({});
    const frameIndexRef = useRef(0);
    const rafIdRef = useRef<number>(0);
    const canvasSizeRef = useRef({ w: 0, h: 0 });

    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    /* ── Global initial loader state ── */
    const [siteLoaded, setSiteLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    /* ── Lock scroll until initial frames finish loading ── */
    useEffect(() => {
        if (!siteLoaded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [siteLoaded]);

    /* ── Scroll: track the outer 300vh container ── */
    const { scrollYProgress } = useScroll({
        target: outerRef,
        offset: ["start start", "end end"],
    });

    /* ── Ensure canvas matches viewport ── */
    const ensureCanvasSize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return false;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        if (canvasSizeRef.current.w !== vw || canvasSizeRef.current.h !== vh) {
            canvas.width = vw;
            canvas.height = vh;
            canvasSizeRef.current = { w: vw, h: vh };
        }
        return true;
    }, []);

    /* ── Draw image source to canvas with cover/contain ── */
    const drawSource = useCallback((source: CanvasImageSource, sw: number, sh: number, fit: string) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const vw = canvas.width;
        const vh = canvas.height;

        ctx.clearRect(0, 0, vw, vh);

        const imgAspect = sw / sh;
        const canvasAspect = vw / vh;
        let coverSw = sw, coverSh = sh, coverSx = 0, coverSy = 0;
        if (imgAspect > canvasAspect) {
            coverSw = sh * canvasAspect;
            coverSx = (sw - coverSw) / 2;
        } else {
            coverSh = sw / canvasAspect;
            coverSy = (sh - coverSh) / 2;
        }

        if (fit === "contain") {
            const scale = Math.min(vw / sw, vh / sh);
            const dw = sw * scale;
            const dh = sh * scale;
            let dx = (vw - dw) / 2;
            const dy = (vh - dh) / 2;
            if (vw > 768 && vw > vh) dx = vw - dw - (vw * 0.05);
            ctx.filter = "blur(20px) brightness(0.35)";
            ctx.drawImage(source, coverSx, coverSy, coverSw, coverSh, 0, 0, vw, vh);
            ctx.filter = "none";
            ctx.drawImage(source, 0, 0, sw, sh, dx, dy, dw, dh);
        } else {
            ctx.drawImage(source, coverSx, coverSy, coverSw, coverSh, 0, 0, vw, vh);
        }
    }, []);

    /* ── Draw a single image frame to canvas ── */
    const drawFrame = useCallback((idx: number, slide: number) => {
        const item = SIGNATURE_ITEMS[slide];
        if (!ensureCanvasSize()) return;

        let img = imagesRef.current[slide]?.[idx];
        if (!img?.complete || !img.naturalWidth) {
            for (let f = idx - 1; f >= 0; f--) {
                const c = imagesRef.current[slide]?.[f];
                if (c?.complete && c.naturalWidth) { img = c; break; }
            }
            if (!img?.complete || !img.naturalWidth) {
                for (let f = idx + 1; f < item.frames.total; f++) {
                    const c = imagesRef.current[slide]?.[f];
                    if (c?.complete && c.naturalWidth) { img = c; break; }
                }
            }
        }
        if (!img?.complete || !img.naturalWidth) return;
        drawSource(img, img.naturalWidth, img.naturalHeight, item.frames.fit || "cover");
    }, [ensureCanvasSize, drawSource]);

    /* ── Scroll → rAF-throttled canvas draw ── */
    useEffect(() => {
        return scrollYProgress.on("change", (v) => {
            const item = SIGNATURE_ITEMS[activeSlide];
            const newIdx = Math.round(v * (item.frames.total - 1));
            if (newIdx !== frameIndexRef.current) {
                frameIndexRef.current = newIdx;
                cancelAnimationFrame(rafIdRef.current);
                rafIdRef.current = requestAnimationFrame(() => {
                    drawFrame(newIdx, activeSlide);
                });
            }
        });
    }, [scrollYProgress, activeSlide, drawFrame]);

    /* ── Progressive frame preload ── */
    useEffect(() => {
        const item = SIGNATURE_ITEMS[activeSlide];
        const TOTAL_FRAMES = item.frames.total;
        const FIRST_FRAME = item.frames.first;

        if (!imagesRef.current[activeSlide]) {
            imagesRef.current[activeSlide] = [];
        }

        // ── 1. Rigorous 100% preload for the very first slide ──
        if (activeSlide === 0 && !siteLoaded) {
            let loadedCount = 0;
            let hasFinished = false;
            setImagesLoaded(false);

            const loadInitialFrame = (i: number) => {
                const img = new window.Image();
                img.src = `/${item.frames.folder}/ezgif-frame-${String(FIRST_FRAME + i).padStart(3, "0")}.${item.frames.ext}`;
                img.onload = () => {
                    imagesRef.current[activeSlide][i] = img;
                    loadedCount++;
                    const progress = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
                    setLoadProgress(progress);

                    if (i === 0) drawFrame(0, activeSlide);

                    if (loadedCount === TOTAL_FRAMES && !hasFinished) {
                        hasFinished = true;
                        setImagesLoaded(true);
                        setTimeout(() => setSiteLoaded(true), 450); // Small pause at 100% before fading out
                    }
                };
                img.onerror = () => {
                    loadedCount++; // Avoid getting stuck on error
                    if (loadedCount === TOTAL_FRAMES && !hasFinished) {
                        hasFinished = true;
                        setImagesLoaded(true);
                        setTimeout(() => setSiteLoaded(true), 450);
                    }
                };
            };

            for (let i = 0; i < TOTAL_FRAMES; i++) loadInitialFrame(i);

            // Pre-warm the first frame of other slides quietly in the background
            SIGNATURE_ITEMS.forEach((sf, idx) => {
                if (idx === 0) return;
                const img = new window.Image();
                img.src = `/${sf.frames.folder}/ezgif-frame-${String(sf.frames.first).padStart(3, "0")}.${sf.frames.ext}`;
                if (!imagesRef.current[idx]) imagesRef.current[idx] = [];
                img.onload = () => { imagesRef.current[idx][0] = img; };
            });
            return;
        }

        // ── 2. Progressive loading for subsequent slides ──
        if (imagesRef.current[activeSlide][0]) {
            setImagesLoaded(true);
            drawFrame(frameIndexRef.current, activeSlide);
        } else {
            setImagesLoaded(false);
        }

        const loadSubFrame = (i: number) => {
            if (imagesRef.current[activeSlide][i]) {
                if (i === 0) {
                    setImagesLoaded(true);
                    drawFrame(0, activeSlide);
                }
                return;
            }
            const img = new window.Image();
            img.src = `/${item.frames.folder}/ezgif-frame-${String(FIRST_FRAME + i).padStart(3, "0")}.${item.frames.ext}`;
            img.onload = () => {
                imagesRef.current[activeSlide][i] = img;
                if (i === 0) {
                    setImagesLoaded(true);
                    drawFrame(0, activeSlide);
                }
            };
        };

        for (let i = 0; i < Math.min(15, TOTAL_FRAMES); i++) loadSubFrame(i);

        const timer = setTimeout(() => {
            for (let i = 15; i < TOTAL_FRAMES; i++) loadSubFrame(i);
        }, 600);

        return () => clearTimeout(timer);
    }, [activeSlide, siteLoaded, drawFrame]);

    /* ── On slide change, redraw first available frame ── */
    useEffect(() => {
        drawFrame(frameIndexRef.current, activeSlide);
    }, [activeSlide, imagesLoaded, drawFrame]);

    useEffect(() => {
        const onResize = () => {
            canvasSizeRef.current = { w: 0, h: 0 };
            drawFrame(frameIndexRef.current, activeSlide);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [activeSlide, drawFrame]);

    /* ── Slide nav ── */
    const navigateTo = (idx: number, dir: number) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setDirection(dir);
        setActiveSlide(idx);

        // Snap scroll back to the top of this section so the new slide effectively starts at frame 0
        if (outerRef.current) {
            window.scrollTo({
                top: outerRef.current.offsetTop,
                behavior: "smooth"
            });
        }

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
        <>
            {/* ── Global Initial Loader ── */}
            <AnimatePresence>
                {!siteLoaded && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                        style={{
                            position: "fixed", inset: 0,
                            zIndex: 9999,
                            background: "var(--obsidian)",
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}
                    >
                        <motion.h1
                            style={{
                                fontFamily: "var(--font-serif)",
                                fontSize: "clamp(3rem, 8vw, 6rem)",
                                fontWeight: 300,
                                lineHeight: 1,
                                marginBottom: "2rem",
                                letterSpacing: "0.05em",
                                color: "var(--gold-primary)"
                            }}
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            TAAZA
                        </motion.h1>

                        <div style={{ width: "200px", height: "1px", background: "rgba(201,168,76,0.2)", position: "relative", overflow: "hidden" }}>
                            <motion.div
                                style={{ position: "absolute", left: 0, top: 0, bottom: 0, background: "var(--gold-primary)" }}
                                animate={{ width: `${loadProgress}%` }}
                                transition={{ ease: "linear", duration: 0.1 }}
                            />
                        </div>

                        <motion.p
                            style={{
                                marginTop: "1rem",
                                fontFamily: "var(--font-body)",
                                fontSize: "0.75rem",
                                letterSpacing: "0.2em",
                                color: "var(--gold-light)",
                                textTransform: "uppercase"
                            }}
                        >
                            Preparing Experience {loadProgress}%
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/*
          300vh outer = the scroll budget for the animation.
          The inner sticky panel stays anchored to the top
          while the user burns through that scroll space.
        */}
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
                    {/* ── Vignette — Desktop ── */}
                    <div
                        aria-hidden="true"
                        className="hidden md:block absolute inset-0 pointer-events-none"
                        style={{
                            background: [
                                "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(5,4,10,0.65) 100%)",
                                "linear-gradient(to right, rgba(5,4,10,0.75) 0%, rgba(5,4,10,0.20) 60%, transparent 100%)",
                                "linear-gradient(to top, rgba(5,4,10,0.75) 0%, transparent 40%)",
                                "linear-gradient(to bottom, rgba(5,4,10,0.60) 0%, transparent 20%)",
                            ].join(", "),
                        }}
                    />
                    {/* ── Vignette — Mobile ── */}
                    <div
                        aria-hidden="true"
                        className="block md:hidden absolute inset-0 pointer-events-none"
                        style={{
                            background: [
                                "radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(5,4,10,0.65) 100%)",
                                "linear-gradient(to top, rgba(5,4,10,0.85) 0%, rgba(5,4,10,0.60) 40%, transparent 100%)",
                                "linear-gradient(to bottom, rgba(5,4,10,0.60) 0%, transparent 20%)",
                            ].join(", "),
                        }}
                    />

                    {/* ── Text overlay — bottom-aligned on mobile, center-left on desktop ── */}
                    <div
                        className="absolute inset-0 flex flex-col justify-end pb-32 md:justify-center md:pb-16 pointer-events-none z-10"
                        style={{
                            paddingLeft: "clamp(1.5rem, 5vw, 6rem)",
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
                                >{String(activeSlide + 1).padStart(2, '0')}</motion.span>
                            </AnimatePresence>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)" }}>/ {String(SIGNATURE_ITEMS.length).padStart(2, '0')}</span>
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
        </>
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
