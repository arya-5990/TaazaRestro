"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

interface FormState {
    name: string; email: string; phone: string;
    date: string; time: string; guests: string;
    occasion: string; notes: string;
}

const INITIAL: FormState = {
    name: "", email: "", phone: "", date: "",
    time: "", guests: "2", occasion: "", notes: "",
};

const OCCASIONS = [
    "Anniversary", "Birthday", "Business Lunch",
    "Date Night", "Family Gathering", "Special Celebration", "Other",
];

/** Returns a YYYY-MM-DD string for a given Date (local time). */
function toDateString(d: Date): string {
    return d.toLocaleDateString("en-CA"); // 'en-CA' gives YYYY-MM-DD natively
}

export default function ReservationSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-8%" });
    const [form, setForm] = useState<FormState>(INITIAL);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Allowed booking window: today → today + 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDay = new Date(today);
    maxDay.setDate(today.getDate() + 7);
    const minDate = toDateString(today);
    const maxDate = toDateString(maxDay);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // ── Date range guard ──
        if (form.date) {
            const chosen = new Date(form.date + "T00:00:00"); // parse as local midnight
            if (chosen < today) {
                setError("Please choose a date from today onwards — we can't travel back in time!");
                return;
            }
            if (chosen > maxDay) {
                setError("Reservations can only be made up to 7 days in advance. Please pick a closer date.");
                return;
            }
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "reservation"), {
                name: form.name,
                email: form.email,
                phone: form.phone,
                date: form.date,
                time: form.time,
                guests: Number(form.guests),
                occasion: form.occasion,
                notes: form.notes,
                status: "pending",
                createdAt: serverTimestamp(),
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Reservation error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="reserve"
            ref={sectionRef}
            style={{ position: "relative", overflow: "hidden", padding: "6rem 0" }}
        >
            {/* ── Rich atmospheric background ── */}
            <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {/* Warm gold bloom — left side */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 55% 70% at 20% 50%, rgba(201,168,76,0.10) 0%, transparent 65%)",
                }} />
                {/* Subtle right vignette */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "radial-gradient(ellipse 45% 60% at 85% 55%, rgba(201,168,76,0.05) 0%, transparent 70%)",
                }} />
                {/* Horizontal divider line at mid */}
                <div style={{
                    position: "absolute", top: 0, left: "50%",
                    width: "1px", height: "100%",
                    background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.12), transparent)",
                }} />
            </div>

            {/* Decorative corner SVG arcs */}
            <svg aria-hidden style={{ position: "absolute", bottom: 0, left: 0, opacity: 0.06, pointerEvents: "none" }}
                width="480" height="480" viewBox="0 0 480 480" fill="none">
                <path d="M0 480 Q240 240 480 0" stroke="#C9A84C" strokeWidth="0.8" />
                <path d="M0 400 Q200 200 400 0" stroke="#C9A84C" strokeWidth="0.5" />
                <path d="M0 320 Q160 160 320 0" stroke="#C9A84C" strokeWidth="0.3" />
            </svg>
            <svg aria-hidden style={{ position: "absolute", top: 0, right: 0, opacity: 0.05, pointerEvents: "none" }}
                width="320" height="320" viewBox="0 0 320 320" fill="none">
                <path d="M320 0 Q160 160 0 320" stroke="#C9A84C" strokeWidth="0.7" />
                <path d="M320 80 Q200 200 80 320" stroke="#C9A84C" strokeWidth="0.4" />
            </svg>

            <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.75rem" }}>

                {/* ── Section label ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7 }}
                    style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3.5rem" }}
                >
                    <div style={{ height: "1px", width: "2rem", background: "var(--gold-primary)" }} />
                    <span className="label-cinzel">Reserve Your Table</span>
                    <div style={{ height: "1px", flex: 1, background: "linear-gradient(to right, rgba(201,168,76,0.4), transparent)" }} />
                </motion.div>

                {/* ── Two-column split layout ── */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1.4fr",
                    gap: "4rem",
                    alignItems: "start",
                }}>

                    {/* ════════════ LEFT PANEL — atmospheric info ════════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                        style={{ paddingTop: "0.5rem" }}
                    >
                        {/* Headline */}
                        <h2 className="headline-lg" style={{ marginBottom: "1.25rem", lineHeight: 1 }}>
                            An evening<br />
                            <em className="flourish">awaits</em> you
                        </h2>

                        <p style={{
                            fontFamily: "var(--font-body)", fontSize: "0.9rem",
                            color: "var(--text-secondary)", lineHeight: 1.75,
                            marginBottom: "2.5rem", maxWidth: "34ch",
                        }}>
                            Every table at Taaza is a stage — for stories, for celebration,
                            for the quiet pleasure of food done with uncommon care.
                        </p>

                        <div className="gold-rule" style={{ marginBottom: "2.5rem" }} />

                        {/* Info blocks */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

                            <InfoBlock
                                icon={
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" strokeLinecap="round" />
                                    </svg>
                                }
                                label="Hours"
                                lines={["Mon – Thu  · 12:00 – 22:30", "Fri – Sun  · 12:00 – 23:30"]}
                            />

                            <InfoBlock
                                icon={
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                                        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                                    </svg>
                                }
                                label="Location"
                                lines={["The Grand Arcade, Level 2", "Connaught Place, New Delhi"]}
                            />

                            <InfoBlock
                                icon={
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81 19.8 19.8 0 01.07 2.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
                                    </svg>
                                }
                                label="Reservations & Large Groups"
                                lines={["+91 11 4567 8910", "For parties of 8+, call directly"]}
                            />
                        </div>

                        {/* Pull-quote */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            style={{
                                marginTop: "2.75rem",
                                paddingLeft: "1.25rem",
                                borderLeft: "2px solid var(--gold-border)",
                            }}
                        >
                            <p className="flourish" style={{ fontSize: "1rem", color: "var(--gold-light)", lineHeight: 1.5 }}>
                                &ldquo;We reserve not just a table,<br />but an experience.&rdquo;
                            </p>
                            <p style={{
                                fontFamily: "var(--font-display)", fontSize: "0.55rem",
                                letterSpacing: "0.15em", color: "var(--text-muted)",
                                marginTop: "0.5rem", textTransform: "uppercase",
                            }}>— Chef Ibrahim Al-Rashid</p>
                        </motion.div>
                    </motion.div>

                    {/* ════════════ RIGHT PANEL — form ════════════ */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.85, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
                        style={{
                            background: "rgba(12,11,8,0.82)",
                            backdropFilter: "blur(16px)",
                            WebkitBackdropFilter: "blur(16px)",
                            border: "1px solid rgba(201,168,76,0.18)",
                            borderRadius: "1.5rem",
                            padding: "clamp(2rem,4vw,2.75rem)",
                            position: "relative",
                        }}
                    >
                        {/* Corner gold glows */}
                        <div aria-hidden style={{
                            position: "absolute", top: 0, left: 0, width: "8rem", height: "8rem", pointerEvents: "none",
                            background: "radial-gradient(circle at top left, rgba(201,168,76,0.13) 0%, transparent 70%)",
                            borderRadius: "1.5rem 0 0 0",
                        }} />
                        <div aria-hidden style={{
                            position: "absolute", bottom: 0, right: 0, width: "8rem", height: "8rem", pointerEvents: "none",
                            background: "radial-gradient(circle at bottom right, rgba(201,168,76,0.08) 0%, transparent 70%)",
                            borderRadius: "0 0 1.5rem 0",
                        }} />

                        <AnimatePresence mode="wait">
                            {submitted ? (
                                /* ── Success state ── */
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.93 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{ textAlign: "center", padding: "3rem 0" }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.2 }}
                                        style={{
                                            width: 72, height: 72, borderRadius: "50%",
                                            border: "1px solid var(--gold-primary)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            margin: "0 auto 1.5rem",
                                        }}
                                    >
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.5">
                                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </motion.div>
                                    <h3 className="headline-md" style={{ color: "var(--gold-light)", marginBottom: "0.75rem" }}>
                                        Table Reserved
                                    </h3>
                                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                                        A confirmation is on its way to <span style={{ color: "var(--gold-light)" }}>{form.email}</span>.<br />
                                        We look forward to welcoming you.
                                    </p>
                                    <p className="flourish" style={{ color: "var(--gold-primary)", fontSize: "0.9rem", marginBottom: "2rem" }}>
                                        — The Taaza Team
                                    </p>
                                    <motion.button
                                        onClick={() => { setSubmitted(false); setForm(INITIAL); }}
                                        className="btn-gold-outline"
                                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                    >
                                        Make Another Reservation
                                    </motion.button>
                                </motion.div>
                            ) : (
                                /* ── Form ── */
                                <motion.form
                                    key="form"
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    style={{
                                        position: "relative", zIndex: 1,
                                        display: "grid", gridTemplateColumns: "1fr 1fr",
                                        gap: "1.1rem",
                                    }}
                                >
                                    {/* Full-width: Name */}
                                    <FormField label="Full Name" id="res-name" name="name"
                                        type="text" placeHolder="Ibrahim Al-Rashid" required
                                        value={form.name} onChange={handleChange} colSpan />

                                    <FormField label="Email Address" id="res-email" name="email"
                                        type="email" placeHolder="you@example.com" required
                                        value={form.email} onChange={handleChange} />

                                    <FormField label="Phone Number" id="res-phone" name="phone"
                                        type="tel" placeHolder="+91 98765 43210"
                                        value={form.phone} onChange={handleChange} />

                                    <FormField label="Preferred Date" id="res-date" name="date"
                                        type="date" required
                                        min={minDate} max={maxDate}
                                        value={form.date} onChange={handleChange} />

                                    <FormField label="Preferred Time" id="res-time" name="time"
                                        type="time" required
                                        value={form.time} onChange={handleChange} />

                                    {/* Guests select */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                                        <label htmlFor="res-guests" className="label-cinzel"
                                            style={{ fontSize: "0.56rem", color: "var(--text-secondary)" }}>
                                            Guests
                                        </label>
                                        <select id="res-guests" name="guests"
                                            value={form.guests} onChange={handleChange}
                                            style={fieldStyle} required>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                <option key={n} value={n} style={{ background: "#0C0B08" }}>
                                                    {n} {n === 1 ? "Guest" : "Guests"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Occasion — full width */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "1 / -1" }}>
                                        <label htmlFor="res-occasion" className="label-cinzel"
                                            style={{ fontSize: "0.56rem", color: "var(--text-secondary)" }}>
                                            Occasion (optional)
                                        </label>
                                        <select id="res-occasion" name="occasion"
                                            value={form.occasion} onChange={handleChange} style={fieldStyle}>
                                            <option value="" style={{ background: "#0C0B08" }}>— Select if applicable —</option>
                                            {OCCASIONS.map(o => (
                                                <option key={o} value={o} style={{ background: "#0C0B08" }}>{o}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Notes — full width */}
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", gridColumn: "1 / -1" }}>
                                        <label htmlFor="res-notes" className="label-cinzel"
                                            style={{ fontSize: "0.56rem", color: "var(--text-secondary)" }}>
                                            Special Requests
                                        </label>
                                        <textarea
                                            id="res-notes" name="notes" rows={3}
                                            value={form.notes} onChange={handleChange}
                                            placeholder="Dietary requirements, seating preferences, allergies…"
                                            style={{ ...fieldStyle, resize: "none", fontFamily: "var(--font-body)" }}
                                        />
                                    </div>

                                    {/* Error message */}
                                    {error && (
                                        <div style={{
                                            gridColumn: "1 / -1",
                                            padding: "0.65rem 1rem",
                                            borderRadius: "0.5rem",
                                            background: "rgba(220,38,38,0.12)",
                                            border: "1px solid rgba(220,38,38,0.25)",
                                            color: "#f87171",
                                            fontFamily: "var(--font-body)",
                                            fontSize: "0.8rem",
                                        }}>
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit — full width */}
                                    <div style={{ gridColumn: "1 / -1", marginTop: "0.5rem" }}>
                                        <motion.button
                                            id="reservation-submit-btn"
                                            type="submit"
                                            disabled={loading}
                                            style={{
                                                width: "100%", padding: "1rem",
                                                background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-primary) 50%, var(--gold-light) 100%)",
                                                borderRadius: "0.75rem",
                                                fontFamily: "var(--font-display)",
                                                fontSize: "0.68rem", letterSpacing: "0.25em",
                                                textTransform: "uppercase",
                                                color: "var(--obsidian)", fontWeight: 600,
                                                border: "none", cursor: loading ? "wait" : "pointer",
                                            }}
                                            whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(201,168,76,0.35)" }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {loading ? (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.5, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                >
                                                    Securing your table…
                                                </motion.span>
                                            ) : "Reserve My Table"}
                                        </motion.button>
                                    </div>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

/* ── Shared field style ── */
const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.18)",
    borderRadius: "0.5rem",
    padding: "0.7rem 1rem",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.3s ease",
    colorScheme: "dark" as React.CSSProperties["colorScheme"],
};

/* ── Info block ── */
function InfoBlock({ icon, label, lines }: {
    icon: React.ReactNode; label: string; lines: string[];
}) {
    return (
        <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
            <div style={{
                width: "2.2rem", height: "2.2rem", borderRadius: "50%",
                border: "1px solid var(--gold-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--gold-primary)", flexShrink: 0,
                background: "rgba(201,168,76,0.07)",
            }}>
                {icon}
            </div>
            <div>
                <p className="label-cinzel" style={{ fontSize: "0.55rem", color: "var(--gold-primary)", marginBottom: "0.3rem" }}>
                    {label}
                </p>
                {lines.map((l, i) => (
                    <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                        {l}
                    </p>
                ))}
            </div>
        </div>
    );
}

/* ── Form field ── */
interface FieldProps {
    label: string; id: string; name: string; type: string;
    placeHolder?: string; required?: boolean;
    min?: string; max?: string;
    value: string; onChange: React.ChangeEventHandler<HTMLInputElement>;
    colSpan?: boolean;
}

function FormField({ label, id, name, type, placeHolder, required, min, max, value, onChange, colSpan }: FieldProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", ...(colSpan ? { gridColumn: "1 / -1" } : {}) }}>
            <label htmlFor={id} className="label-cinzel"
                style={{ fontSize: "0.56rem", color: "var(--text-secondary)" }}>
                {label}
            </label>
            <input
                id={id} name={name} type={type}
                placeholder={placeHolder} required={required}
                min={min} max={max}
                value={value} onChange={onChange}
                style={{ ...fieldStyle, colorScheme: "dark" as React.CSSProperties["colorScheme"] }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.18)")}
            />
        </div>
    );
}
