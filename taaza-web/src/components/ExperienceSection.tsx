"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

/* ── Reels list ── */
const REELS = [
    "/reels/reel_1.mp4",
    "/reels/reel_2.mp4",
    "/reels/reel_3.mp4",
    "/reels/reel_4.mp4",
    "/reels/reel_5.mp4",
    "/reels/reel_6.mp4",
    "/reels/reel_7.mp4",
    "/reels/reel_8.mp4",
    "/reels/reel_9.mp4",
];

/* ─────────────────────────────────────────────────
   NAV BUTTON STYLES (shared by modal)
───────────────────────────────────────────────── */
const navBtnStyle: React.CSSProperties = {
    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
    border: "1px solid rgba(201,168,76,0.5)",
    background: "rgba(5,4,10,0.65)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "var(--gold-primary)", cursor: "pointer", transition: "all 0.25s ease",
};
const navBtnHover: React.CSSProperties = {
    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
    border: "1px solid rgba(201,168,76,0.5)",
    background: "var(--gold-primary)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#05040a", cursor: "pointer", transition: "all 0.25s ease",
};

/* ═══════════════════════════════════════════════
   FULLSCREEN SHORTS MODAL
═══════════════════════════════════════════════ */
function ShortsModal({ startIndex, onClose }: { startIndex: number; onClose: () => void }) {
    const [activeReel, setActiveReel] = useState(startIndex);
    const [muted, setMuted] = useState(false);
    const [direction, setDirection] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const scrollLock = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef<number | null>(null);

    /* Lock body scroll while modal is open */
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const navigateTo = useCallback((idx: number, dir: number) => {
        setDirection(dir);
        setActiveReel(idx);
    }, []);

    const goNext = useCallback(() => {
        setActiveReel(prev => {
            const next = (prev + 1) % REELS.length;
            setDirection(1);
            return next;
        });
    }, []);

    const goPrev = useCallback(() => {
        setActiveReel(prev => {
            const next = (prev - 1 + REELS.length) % REELS.length;
            setDirection(-1);
            return next;
        });
    }, []);

    /* Play / restart on reel change */
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        v.src = REELS[activeReel];
        v.muted = muted;
        v.load();
        v.play().catch(() => { });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeReel]);

    /* Sync muted */
    useEffect(() => {
        if (videoRef.current) videoRef.current.muted = muted;
    }, [muted]);

    /* Keyboard nav */
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown" || e.key === "ArrowRight") goNext();
            if (e.key === "ArrowUp" || e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, goNext, goPrev]);

    /* Scroll wheel nav */
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (scrollLock.current) return;
            scrollLock.current = true;
            if (e.deltaY > 40) goNext();
            else if (e.deltaY < -40) goPrev();
            setTimeout(() => { scrollLock.current = false; }, 700);
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, [goNext, goPrev]);

    /* Touch swipe */
    const onTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd = (e: React.TouchEvent) => {
        if (touchStartY.current === null) return;
        const diff = touchStartY.current - e.changedTouches[0].clientY;
        if (diff > 50) goNext();
        else if (diff < -50) goPrev();
        touchStartY.current = null;
    };

    /* Slide variants */
    const slideVariants = {
        enter: (d: number) => ({ y: d > 0 ? "100%" : "-100%", opacity: 0 }),
        center: { y: "0%", opacity: 1 },
        exit: (d: number) => ({ y: d > 0 ? "-100%" : "100%", opacity: 0 }),
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            ref={containerRef}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            style={{
                position: "fixed", inset: 0, zIndex: 9999,
                background: "rgba(0,0,0,0.96)",
                display: "flex", alignItems: "center", justifyContent: "center",
                overscrollBehavior: "contain",
            }}
        >
            {/* ── Background radial glow ── */}
            <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)",
            }} />

            {/* ── Close button ── */}
            <button
                id="shorts-close-btn"
                onClick={onClose}
                aria-label="Close Vibe player"
                style={{
                    position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10,
                    width: "2.4rem", height: "2.4rem", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.2)",
                    background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", cursor: "pointer", transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(201,168,76,0.85)"; b.style.color = "#000";
                }}
                onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(0,0,0,0.7)"; b.style.color = "#fff";
                }}
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>

            {/* ── Branding top-left ── */}
            <div style={{ position: "absolute", top: "1.4rem", left: "1.5rem", zIndex: 10 }}>
                <span style={{ fontFamily: "var(--font-display, 'Cinzel', serif)", fontSize: "0.65rem", letterSpacing: "0.3em", color: "var(--gold-primary)", textTransform: "uppercase" }}>
                    TAAZA <span style={{ opacity: 0.5 }}>VIBES</span>
                </span>
            </div>

            {/* ── Reel counter (top center) ── */}
            <div style={{ position: "absolute", top: "1.35rem", left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                <span style={{
                    fontFamily: "var(--font-display, 'Cinzel', serif)", fontSize: "0.6rem",
                    letterSpacing: "0.18em", color: "var(--gold-primary)", textTransform: "uppercase",
                    background: "rgba(5,4,10,0.6)", backdropFilter: "blur(6px)",
                    padding: "0.25rem 0.75rem", borderRadius: "9999px",
                    border: "1px solid rgba(201,168,76,0.3)",
                }}>
                    {String(activeReel + 1).padStart(2, "0")} / {String(REELS.length).padStart(2, "0")}
                </span>
            </div>

            {/* ── Main video card (portrait 9:16) ── */}
            <div style={{
                position: "relative",
                width: "min(420px, 90vw)",
                height: "min(748px, 88vh)",
                borderRadius: "1.25rem",
                overflow: "hidden",
                boxShadow: "0 0 80px rgba(201,168,76,0.12), 0 0 0 1px rgba(201,168,76,0.15)",
            }}>
                <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                        key={activeReel}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <video
                            ref={videoRef}
                            src={REELS[activeReel]}
                            autoPlay loop muted={muted} playsInline
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient overlay */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.7) 100%)",
                    pointerEvents: "none",
                }} />

                {/* Bottom label */}
                <div style={{ position: "absolute", bottom: "1.2rem", left: "1rem", right: "3rem", zIndex: 5, pointerEvents: "none" }}>
                    <p style={{ fontFamily: "var(--font-display, 'Cinzel', serif)", fontSize: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "0.2rem" }}>
                        The Atmosphere
                    </p>
                    <p style={{ fontFamily: "var(--font-serif, serif)", fontSize: "0.85rem", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>
                        Where every wall tells a story
                    </p>
                </div>

                {/* Mute button — bottom-right of card */}
                <button
                    onClick={() => setMuted(m => !m)}
                    aria-label={muted ? "Unmute" : "Mute"}
                    style={{
                        position: "absolute", bottom: "1rem", right: "0.85rem", zIndex: 10,
                        width: "2rem", height: "2rem", borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", cursor: "pointer",
                    }}
                >
                    {muted ? (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                        </svg>
                    ) : (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ── Right side nav column ── */}
            <div style={{
                position: "absolute", right: "clamp(1rem, 4vw, 3.5rem)", top: "50%",
                transform: "translateY(-50%)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", zIndex: 10,
            }}>
                <button onClick={goPrev} aria-label="Previous reel" style={navBtnStyle}
                    onMouseEnter={e => Object.assign((e.currentTarget as HTMLButtonElement).style, navBtnHover)}
                    onMouseLeave={e => Object.assign((e.currentTarget as HTMLButtonElement).style, navBtnStyle)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15l-6-6-6 6" />
                    </svg>
                </button>

                {/* Dot indicators */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.28rem", alignItems: "center" }}>
                    {REELS.map((_, i) => (
                        <button key={i} onClick={() => navigateTo(i, i > activeReel ? 1 : -1)}
                            aria-label={`Reel ${i + 1}`}
                            style={{
                                width: "0.28rem",
                                height: i === activeReel ? "1.2rem" : "0.28rem",
                                borderRadius: "9999px", border: "none",
                                background: i === activeReel ? "var(--gold-primary)" : "rgba(201,168,76,0.35)",
                                cursor: "pointer", transition: "all 0.35s ease", padding: 0,
                            }}
                        />
                    ))}
                </div>

                <button onClick={goNext} aria-label="Next reel" style={navBtnStyle}
                    onMouseEnter={e => Object.assign((e.currentTarget as HTMLButtonElement).style, navBtnHover)}
                    onMouseLeave={e => Object.assign((e.currentTarget as HTMLButtonElement).style, navBtnStyle)}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                    </svg>
                </button>
            </div>

            {/* ── Scroll hint (bottom center) ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{ position: "absolute", bottom: "1.5rem", left: "50%", transform: "translateX(-50%)", zIndex: 10, textAlign: "center" }}
            >
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </motion.div>
                <p style={{ fontFamily: "var(--font-body, sans-serif)", fontSize: "0.55rem", color: "rgba(201,168,76,0.45)", letterSpacing: "0.15em", textTransform: "uppercase", marginTop: "0.25rem" }}>
                    scroll to explore
                </p>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════
   SMALL REELS PLAYER (bento card)
═══════════════════════════════════════════════ */
function ReelsPlayer({ isInView, onOpenModal }: { isInView: boolean; onOpenModal: (idx: number) => void }) {
    const [activeReel, setActiveReel] = useState(0);
    const [muted, setMuted] = useState(true);
    const reelRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const transitionRef = useRef(false);

    const navigateTo = useCallback((idx: number) => {
        if (transitionRef.current) return;
        transitionRef.current = true;
        setActiveReel(idx);
        setTimeout(() => { transitionRef.current = false; }, 400);
    }, []);

    const goNext = useCallback(() => navigateTo((activeReel + 1) % REELS.length), [activeReel, navigateTo]);
    const goPrev = useCallback(() => navigateTo((activeReel - 1 + REELS.length) % REELS.length), [activeReel, navigateTo]);

    useEffect(() => {
        reelRefs.current.forEach((v, i) => {
            if (!v) return;
            if (i === activeReel) { v.currentTime = 0; v.muted = muted; v.play().catch(() => { }); }
            else v.pause();
        });
    }, [activeReel, muted]);

    useEffect(() => {
        const v = reelRefs.current[activeReel];
        if (v) v.muted = muted;
    }, [muted, activeReel]);

    useEffect(() => {
        const v = reelRefs.current[activeReel];
        if (!v) return;
        const onEnd = () => goNext();
        v.addEventListener("ended", onEnd);
        return () => v.removeEventListener("ended", onEnd);
    }, [activeReel, goNext]);

    useEffect(() => {
        const v = reelRefs.current[activeReel];
        if (!v) return;
        if (isInView) v.play().catch(() => { });
        else v.pause();
    }, [isInView, activeReel]);

    return (
        <div style={{ position: "relative", width: "100%", height: "100%", backgroundColor: "#000", overflow: "hidden" }}>

            {/* Video layers */}
            {REELS.map((src, i) => (
                <video key={src} ref={el => { reelRefs.current[i] = el; }}
                    src={src} playsInline muted={muted} loop={false}
                    preload={i === 0 ? "auto" : "metadata"}
                    style={{
                        position: "absolute", inset: 0, width: "100%", height: "100%",
                        objectFit: "cover", opacity: i === activeReel ? 1 : 0,
                        transition: "opacity 0.4s ease", pointerEvents: "none",
                    }}
                />
            ))}

            {/* Gradient overlay */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.6) 100%)",
                pointerEvents: "none",
            }} />

            {/* ── VIBE button — top-right ── */}
            <button
                id="reel-vibe-btn"
                onClick={() => onOpenModal(activeReel)}
                aria-label="Open Vibe fullscreen player"
                style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem", zIndex: 20,
                    display: "flex", alignItems: "center", gap: "0.35rem",
                    padding: "0.3rem 0.75rem 0.3rem 0.55rem",
                    borderRadius: "9999px",
                    border: "1px solid rgba(201,168,76,0.6)",
                    background: "rgba(5,4,10,0.65)", backdropFilter: "blur(10px)",
                    color: "var(--gold-primary)", cursor: "pointer",
                    fontFamily: "var(--font-display, 'Cinzel', serif)",
                    fontSize: "0.55rem", letterSpacing: "0.15em", textTransform: "uppercase",
                    fontWeight: 600, transition: "all 0.25s ease",
                }}
                onMouseEnter={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "var(--gold-primary)"; b.style.color = "#05040a";
                    b.style.borderColor = "var(--gold-primary)"; b.style.transform = "scale(1.05)";
                }}
                onMouseLeave={e => {
                    const b = e.currentTarget as HTMLButtonElement;
                    b.style.background = "rgba(5,4,10,0.65)"; b.style.color = "var(--gold-primary)";
                    b.style.borderColor = "rgba(201,168,76,0.6)"; b.style.transform = "scale(1)";
                }}
            >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                </svg>
                Vibe
            </button>

            {/* UP button */}
            <button onClick={goPrev} aria-label="Previous reel" style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -340%)", zIndex: 10,
                width: "2.1rem", height: "2.1rem", borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.6)", background: "rgba(5,4,10,0.6)",
                backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--gold-primary)", transition: "all 0.25s ease",
            }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "#05040a"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(5,4,10,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold-primary)"; }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6" /></svg>
            </button>

            {/* DOWN button */}
            <button onClick={goNext} aria-label="Next reel" style={{
                position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, 240%)", zIndex: 10,
                width: "2.1rem", height: "2.1rem", borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.6)", background: "rgba(5,4,10,0.6)",
                backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--gold-primary)", transition: "all 0.25s ease",
            }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "var(--gold-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "#05040a"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(5,4,10,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--gold-primary)"; }}
            >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
            </button>

            {/* Counter top-left */}
            <div style={{ position: "absolute", top: "0.85rem", left: "0.85rem", zIndex: 10 }}>
                <span style={{
                    fontFamily: "var(--font-display, 'Cinzel', serif)", fontSize: "0.6rem",
                    letterSpacing: "0.18em", color: "var(--gold-primary)", textTransform: "uppercase",
                    background: "rgba(5,4,10,0.55)", backdropFilter: "blur(6px)",
                    padding: "0.25rem 0.6rem", borderRadius: "9999px",
                    border: "1px solid rgba(201,168,76,0.35)",
                }}>
                    {String(activeReel + 1).padStart(2, "0")} / {String(REELS.length).padStart(2, "0")}
                </span>
            </div>

            {/* Dot indicators — right */}
            <div style={{
                position: "absolute", right: "0.65rem", top: "50%", transform: "translateY(-50%)",
                zIndex: 10, display: "flex", flexDirection: "column", gap: "0.28rem", alignItems: "center",
            }}>
                {REELS.map((_, i) => (
                    <button key={i} onClick={() => navigateTo(i)} aria-label={`Reel ${i + 1}`}
                        style={{
                            width: "0.28rem", height: i === activeReel ? "1.2rem" : "0.28rem",
                            borderRadius: "9999px", border: "none",
                            background: i === activeReel ? "var(--gold-primary)" : "rgba(201,168,76,0.4)",
                            cursor: "pointer", transition: "all 0.35s ease", padding: 0,
                        }}
                    />
                ))}
            </div>

            {/* Mute button — bottom right */}
            <button
                id="reel-mute-btn"
                onClick={() => setMuted(m => !m)}
                aria-label={muted ? "Unmute reel" : "Mute reel"}
                style={{
                    position: "absolute", bottom: "1rem", right: "0.85rem", zIndex: 10,
                    width: "1.9rem", height: "1.9rem", borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff", transition: "background 0.2s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.8)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.55)"; }}
            >
                {muted ? (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                ) : (
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                )}
            </button>

            {/* Label overlay — bottom left */}
            <div style={{ position: "absolute", bottom: "1rem", left: "0.85rem", zIndex: 10 }}>
                <p style={{
                    fontFamily: "var(--font-display, 'Cinzel', serif)", fontSize: "0.55rem",
                    letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-primary)", marginBottom: "0.15rem",
                }}>The Atmosphere</p>
                <p style={{ fontFamily: "var(--font-serif, serif)", fontSize: "0.95rem", color: "#fff", fontWeight: 300, lineHeight: 1.2 }}>
                    Where every wall tells a story
                </p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════════ */
export default function ExperienceSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const imageVersion = "2026-03-08";
    const imageFrame = { chef: "center 38%", terrace: "center 68%" } as const;

    const [modalOpen, setModalOpen] = useState(false);
    const [modalStartIdx, setModalStartIdx] = useState(0);

    const openModal = useCallback((idx: number) => {
        setModalStartIdx(idx);
        setModalOpen(true);
    }, []);

    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
    const imgY2 = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
    const imgY3 = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

    return (
        <>
            {/* ── Fullscreen Vibe Modal ── */}
            <AnimatePresence>
                {modalOpen && (
                    <ShortsModal startIndex={modalStartIdx} onClose={() => setModalOpen(false)} />
                )}
            </AnimatePresence>

            <section id="experience" ref={sectionRef} className="relative pt-[var(--space-section)] pb-4 overflow-hidden">

                <div className="absolute inset-0 pointer-events-none" style={{
                    background: "radial-gradient(ellipse 100% 60% at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)",
                }} />

                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8 }} className="flex items-center gap-4 mb-14"
                    >
                        <div className="h-px w-8 bg-[var(--gold-primary)]" />
                        <span className="label-cinzel">The Experience</span>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr_4fr] gap-4 mb-0 z-10 relative">

                        {/* CELL 1 — Reels player */}
                        <motion.div
                            className="relative min-h-[420px] lg:min-h-[520px] overflow-hidden"
                            style={{ borderRadius: "2rem 0.5rem 2rem 0.5rem" }}
                            initial={{ opacity: 0, x: -50 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.9, delay: 0.1 }}
                        >
                            <ReelsPlayer isInView={isInView} onOpenModal={openModal} />
                            <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]" style={{ borderRadius: "inherit" }} />
                        </motion.div>

                        {/* CELL 2 — Text card */}
                        <div className="flex flex-col gap-4">
                            <motion.div className="glass-surface p-8 flex-1" style={{ borderRadius: "0.5rem 2rem 0.5rem 0.5rem" }}
                                initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.25 }}
                            >
                                <h2 className="headline-lg mb-4">Born from <em className="flourish">ancient</em> spice routes</h2>
                                <p className="text-[var(--text-secondary)] leading-relaxed mb-6" style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem" }}>
                                    Taaza — meaning &quot;fresh&quot; in Arabic — was conceived as a love letter to Levantine gastronomy.
                                    Every recipe carries the fingerprint of generations, reinterpreted through a contemporary lens.
                                </p>
                                <div className="gold-rule" />
                                <p className="mt-5 flourish text-[var(--gold-light)] text-sm">&quot;Food is memory. We cook memories.&quot;</p>
                                <p className="label-cinzel mt-2 text-[var(--text-muted)] text-[0.55rem]">— Chef Ibrahim Al-Rashid, Founder</p>
                            </motion.div>

                            <motion.div className="relative glass-surface p-5 border border-[var(--gold-border)]"
                                style={{ borderRadius: "2rem 0.5rem 0.5rem 0.5rem" }}
                                initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.6, delay: 0.5 }}
                            >
                                <motion.div className="absolute -top-4 -right-4 glass-surface px-3 py-1.5 border border-[var(--gold-primary)] z-10"
                                    style={{ borderRadius: "0.75rem", background: "rgba(201,168,76,0.12)" }}
                                    animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                >
                                    <span className="label-cinzel text-[0.55rem] text-[var(--gold-primary)]">★ Rated #1</span>
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
                            <motion.div className="relative min-h-[300px] lg:min-h-[300px] overflow-hidden group flex-1"
                                style={{ borderRadius: "0.5rem 2rem 0.5rem 0.5rem" }}
                                initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.2 }}
                            >
                                <motion.div className="absolute inset-0" style={{ y: imgY2, scale: 1.07 }}>
                                    <Image src={`/chef.jpeg?v=${imageVersion}`} alt="Chef plating a premium Arabic fusion dish" fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ objectPosition: imageFrame.chef }} sizes="(max-width: 1024px) 100vw, 33vw" />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-b from-[var(--obsidian)] via-transparent to-transparent opacity-40" />
                                <div className="absolute top-4 left-4"><span className="label-cinzel">The Craft</span></div>
                                <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]" style={{ borderRadius: "inherit" }} />
                            </motion.div>

                            <motion.div className="relative min-h-[280px] lg:min-h-[240px] overflow-hidden group"
                                style={{ borderRadius: "0.5rem 0.5rem 2rem 0.5rem" }}
                                initial={{ opacity: 0, x: 50 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.9, delay: 0.35 }}
                            >
                                <motion.div className="absolute inset-0" style={{ y: imgY3, scale: 1.06 }}>
                                    <Image src={`/terrace.jpeg?v=${imageVersion}`} alt="Taaza restaurant terrace at golden hour" fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{ objectPosition: imageFrame.terrace }} sizes="(max-width: 1024px) 100vw, 33vw" />
                                </motion.div>
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)] via-transparent to-transparent opacity-50" />
                                <div className="absolute bottom-4 left-4"><p className="flourish text-sm text-[var(--gold-light)]">Al Fresco Dining</p></div>
                                <div className="absolute inset-0 pointer-events-none ring-1 ring-[var(--gold-border)]" style={{ borderRadius: "inherit" }} />
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
}
