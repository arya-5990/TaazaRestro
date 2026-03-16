"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Cache-buster: bump this string manually whenever you replace a video file ── */
const CB = `?v=20260311`;

/* ── Slide definitions ── */
interface Slide {
    id: number;
    name: string; nameAccent: string; subtitle: string; note: string; tag: string;
    src: string;
}

const SLIDES: Slide[] = [
    { id: 1, name: "The Shish", nameAccent: " Tawook", subtitle: "", note: "Our Signature Creation", tag: "Chef's Choice", src: `/food1.mp4${CB}` },
    { id: 2, name: "Summer ", nameAccent: "favourites", subtitle: "", note: "A Refreshing Classic", tag: "Fan Favorite", src: `/drink1.mp4${CB}` },
    { id: 3, name: "Irani ", nameAccent: "Kebab", subtitle: "", note: "A Heritage Recipe", tag: "Tradition", src: `/food2.mp4${CB}` },
    { id: 4, name: "Fattoush", nameAccent: "Salad", subtitle: "", note: "To Share, To Savour", tag: "For Two", src: `/food3.mp4${CB}` },
];

export default function ExplodedHero() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const isTransitioningRef = useRef(false);

    const [activeSlide, setActiveSlide] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(false);

    /* ── Global initial loader state ── */
    const [siteLoaded, setSiteLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    /* ── Lock scroll until first video is ready ── */
    useEffect(() => {
        if (!siteLoaded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [siteLoaded]);

    /* ── Track first video loading progress then unlock the site ── */
    useEffect(() => {
        const video = videoRefs.current[0];
        if (!video) return;
        let finished = false;

        const finish = () => {
            if (finished) return;
            finished = true;
            setLoadProgress(100);
            setTimeout(() => setSiteLoaded(true), 450);
        };

        const handleProgress = () => {
            if (!video.duration || video.buffered.length === 0) return;
            const pct = Math.round((video.buffered.end(video.buffered.length - 1) / video.duration) * 100);
            setLoadProgress(Math.min(pct, 99));
        };

        video.addEventListener("progress", handleProgress);
        video.addEventListener("canplaythrough", finish);
        const fallback = setTimeout(finish, 4000);

        return () => {
            video.removeEventListener("progress", handleProgress);
            video.removeEventListener("canplaythrough", finish);
            clearTimeout(fallback);
        };
    }, []);

    /* ── On slide change, play the new video; auto-advance on end ── */
    useEffect(() => {
        videoRefs.current.forEach((v, i) => {
            if (!v) return;
            if (i === activeSlide) { v.currentTime = 0; v.play().catch(() => { }); }
            else v.pause();
        });

        const video = videoRefs.current[activeSlide];
        if (!video) return;
        const handleEnded = () => navigateTo((activeSlide + 1) % SLIDES.length, 1);
        video.addEventListener("ended", handleEnded);
        return () => video.removeEventListener("ended", handleEnded);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSlide]);

    /* ── Slide nav ── */
    const navigateTo = (idx: number, dir: number) => {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        setIsTransitioning(true);
        setDirection(dir);
        setActiveSlide(idx);

        setTimeout(() => {
            isTransitioningRef.current = false;
            setIsTransitioning(false);
        }, 600);
    };
    const goNext = () => navigateTo((activeSlide + 1) % SLIDES.length, 1);
    const goPrev = () => navigateTo((activeSlide - 1 + SLIDES.length) % SLIDES.length, -1);
    const current = SLIDES[activeSlide];

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
                        <motion.div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.3rem",
                                marginBottom: "2.5rem",
                            }}
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        >
                            {/* Red Fez Hat — scaled up for loading screen */}
                            <img
                                src="/Red_hat.png"
                                alt=""
                                aria-hidden="true"
                                style={{
                                    height: "clamp(55px, 12vw, 90px)",
                                    width: "auto",
                                    objectFit: "contain",
                                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.5))",
                                    marginBottom: "-15px",
                                    transform: "translateX(-clamp(3.5rem, 9.6vw, 7rem))",
                                }}
                            />

                            {/* Wordmark: Taaza + Restaurant */}
                            <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.2rem", lineHeight: 1 }}>
                                <span style={{
                                    fontFamily: "'Montserrat', 'Inter', sans-serif",
                                    fontWeight: 800,
                                    fontSize: "clamp(3rem, 8vw, 6rem)",
                                    letterSpacing: "0.01em",
                                    color: "#FFFFFF",
                                    lineHeight: 1,
                                }}>
                                    Taaza
                                </span>
                                <span style={{
                                    fontFamily: "'Montserrat', 'Inter', sans-serif",
                                    fontWeight: 400,
                                    fontSize: "clamp(0.9rem, 2.5vw, 1.8rem)",
                                    letterSpacing: "0.25em",
                                    color: "rgba(210,210,210,0.70)",
                                    textTransform: "uppercase",
                                    lineHeight: 1,
                                }}>
                                    Restaurant
                                </span>
                            </span>
                        </motion.div>

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
                            {`Preparing Experience ${loadProgress}%`}
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div
                ref={sectionRef}
                id="hero"
                style={{ position: "relative", height: "100vh", overflow: "hidden" }}
            >
                {/* ── Video elements (one per slide) ── */}
                {SLIDES.map((slide, i) => (
                    <video
                        key={slide.id}
                        ref={(el) => { videoRefs.current[i] = el; }}
                        src={slide.src}
                        playsInline muted autoPlay={i === 0} preload="auto"
                        style={{
                            position: "absolute",
                            top: 0, left: 0,
                            width: "100%", height: "100%",
                            objectFit: "cover",
                            opacity: i === activeSlide ? 1 : 0,
                            transition: "opacity 0.5s ease",
                        }}
                    />
                ))}

                {/* ── Vignette — left text shadow + thin top bar only, no bottom cover ── */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: [
                            "linear-gradient(to right, rgba(5,4,10,0.78) 0%, rgba(5,4,10,0.30) 45%, transparent 70%)",
                            "linear-gradient(to bottom, rgba(5,4,10,0.55) 0%, transparent 18%)",
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
                        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "var(--text-muted)" }}>/ {String(SLIDES.length).padStart(2, '0')}</span>
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
                            {SLIDES.map((_, i) => (
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
