"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface FormState {
    name: string;
    email: string;
    phone: string;
    date: string;
    time: string;
    guests: string;
    occasion: string;
    notes: string;
}

const INITIAL: FormState = {
    name: "", email: "", phone: "", date: "",
    time: "", guests: "2", occasion: "", notes: "",
};

const occasionOptions = [
    "Anniversary", "Birthday", "Business Lunch", "Date Night",
    "Family Gathering", "Special Celebration", "Other",
];

export default function ReservationSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
    const [form, setForm] = useState<FormState>(INITIAL);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        await new Promise((r) => setTimeout(r, 1600));
        setLoading(false);
        setSubmitted(true);
    };

    return (
        <section
            id="reserve"
            ref={sectionRef}
            className="relative py-[var(--space-section)] overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.07) 0%, var(--obsidian) 70%)",
                    }}
                />
            </div>

            {/* Decorative gold arcs */}
            <svg
                className="absolute bottom-0 left-0 opacity-5 pointer-events-none"
                width="400"
                height="400"
                viewBox="0 0 400 400"
                fill="none"
            >
                <path d="M0 400 Q200 200 400 0" stroke="#C9A84C" strokeWidth="0.6" />
                <path d="M0 350 Q200 170 350 0" stroke="#C9A84C" strokeWidth="0.4" />
            </svg>

            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-14">
                    <motion.div
                        className="flex items-center justify-center gap-4 mb-5"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="h-px w-12 bg-[var(--gold-primary)]" />
                        <span className="label-cinzel">Reserve Your Table</span>
                        <div className="h-px w-12 bg-[var(--gold-primary)]" />
                    </motion.div>
                    <motion.h2
                        className="headline-lg mb-4"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        An evening <em className="flourish">awaits</em> you
                    </motion.h2>
                    <motion.p
                        className="text-[var(--text-secondary)] text-sm max-w-md mx-auto leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.3 }}
                    >
                        Reservations recommended. We hold your table for 15 minutes.
                        For parties of 8+, please call us directly.
                    </motion.p>
                </div>

                {/* ─── Glassmorphism Form Card ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.9, delay: 0.2 }}
                    className="relative max-w-3xl mx-auto"
                    style={{
                        background: "rgba(12, 11, 8, 0.80)",
                        backdropFilter: "blur(10px)",
                        WebkitBackdropFilter: "blur(10px)",
                        border: "1px solid var(--gold-border)",
                        borderRadius: "1.5rem",
                        padding: "clamp(2rem, 5vw, 3rem)",
                    }}
                >
                    {/* Corner accent */}
                    <div
                        className="absolute top-0 left-0 w-20 h-20 pointer-events-none"
                        style={{
                            background: "radial-gradient(circle at top left, rgba(201,168,76,0.12) 0%, transparent 70%)",
                            borderRadius: "1.5rem 0 0 0",
                        }}
                    />
                    <div
                        className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
                        style={{
                            background: "radial-gradient(circle at bottom right, rgba(201,168,76,0.08) 0%, transparent 70%)",
                            borderRadius: "0 0 1.5rem 0",
                        }}
                    />

                    <AnimatePresence mode="wait">
                        {submitted ? (
                            /* ─── Success State ─── */
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="text-center py-12"
                            >
                                <motion.div
                                    className="w-20 h-20 rounded-full border-2 border-[var(--gold-primary)] flex items-center justify-center mx-auto mb-6"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                                >
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold-primary)" strokeWidth="1.5">
                                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </motion.div>
                                <h3 className="headline-md text-[var(--gold-light)] mb-3">Table Reserved</h3>
                                <p className="text-[var(--text-secondary)] text-sm mb-6" style={{ fontFamily: "var(--font-body)" }}>
                                    We&apos;ll send a confirmation to {form.email} shortly.
                                    <br />
                                    We look forward to welcoming you.
                                </p>
                                <p className="flourish text-[var(--gold-primary)] text-sm">— The Taaza Team</p>
                                <motion.button
                                    onClick={() => { setSubmitted(false); setForm(INITIAL); }}
                                    className="mt-8 btn-gold-outline"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    Make Another Reservation
                                </motion.button>
                            </motion.div>
                        ) : (
                            /* ─── Form ─── */
                            <motion.form
                                key="form"
                                onSubmit={handleSubmit}
                                className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5"
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {/* Full-width: Name */}
                                <FormField label="Full Name" id="name" name="name"
                                    type="text" placeHolder="Ibrahim Al-Rashid" required
                                    value={form.name} onChange={handleChange} colSpan="full"
                                />

                                {/* Email */}
                                <FormField label="Email Address" id="email" name="email"
                                    type="email" placeHolder="you@example.com" required
                                    value={form.email} onChange={handleChange}
                                />

                                {/* Phone */}
                                <FormField label="Phone Number" id="phone" name="phone"
                                    type="tel" placeHolder="+91 98765 43210"
                                    value={form.phone} onChange={handleChange}
                                />

                                {/* Date */}
                                <FormField label="Preferred Date" id="date" name="date"
                                    type="date" required
                                    value={form.date} onChange={handleChange}
                                />

                                {/* Time */}
                                <FormField label="Preferred Time" id="time" name="time"
                                    type="time" required
                                    value={form.time} onChange={handleChange}
                                />

                                {/* Guests */}
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="guests" className="label-cinzel text-[0.58rem] text-[var(--text-secondary)]">
                                        Number of Guests
                                    </label>
                                    <select
                                        id="guests"
                                        name="guests"
                                        value={form.guests}
                                        onChange={handleChange}
                                        style={fieldStyle}
                                        required
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                            <option key={n} value={n} style={{ background: "#0C0B08" }}>{n} {n === 1 ? "Guest" : "Guests"}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Occasion */}
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label htmlFor="occasion" className="label-cinzel text-[0.58rem] text-[var(--text-secondary)]">
                                        Occasion (optional)
                                    </label>
                                    <select
                                        id="occasion"
                                        name="occasion"
                                        value={form.occasion}
                                        onChange={handleChange}
                                        style={fieldStyle}
                                    >
                                        <option value="" style={{ background: "#0C0B08" }}>— Select if applicable —</option>
                                        {occasionOptions.map(o => (
                                            <option key={o} value={o} style={{ background: "#0C0B08" }}>{o}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Notes */}
                                <div className="flex flex-col gap-1.5 md:col-span-2">
                                    <label htmlFor="notes" className="label-cinzel text-[0.58rem] text-[var(--text-secondary)]">
                                        Special Requests
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Dietary requirements, seating preferences, allergies..."
                                        style={{
                                            ...fieldStyle,
                                            resize: "none",
                                            fontFamily: "var(--font-body)",
                                        }}
                                    />
                                </div>

                                {/* Submit */}
                                <div className="md:col-span-2 mt-2">
                                    <motion.button
                                        id="reservation-submit-btn"
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-4 relative overflow-hidden"
                                        style={{
                                            background: "linear-gradient(135deg, var(--gold-dark) 0%, var(--gold-primary) 50%, var(--gold-light) 100%)",
                                            borderRadius: "0.75rem",
                                            fontFamily: "var(--font-display)",
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.25em",
                                            textTransform: "uppercase",
                                            color: "var(--obsidian)",
                                            fontWeight: 600,
                                            border: "none",
                                            cursor: loading ? "wait" : "pointer",
                                        }}
                                        whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(201,168,76,0.3)" }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {loading ? (
                                            <motion.span
                                                animate={{ opacity: [1, 0.5, 1] }}
                                                transition={{ repeat: Infinity, duration: 1 }}
                                            >
                                                Securing your table...
                                            </motion.span>
                                        ) : (
                                            "Reserve My Table"
                                        )}
                                    </motion.button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}

/* ─── Shared field styles ─── */
const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(201,168,76,0.2)",
    borderRadius: "0.5rem",
    padding: "0.75rem 1rem",
    color: "var(--text-primary)",
    fontFamily: "var(--font-body)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.3s ease",
};

interface FieldProps {
    label: string;
    id: string;
    name: string;
    type: string;
    placeHolder?: string;
    required?: boolean;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    colSpan?: "full";
}

function FormField({ label, id, name, type, placeHolder, required, value, onChange, colSpan }: FieldProps) {
    return (
        <div className={`flex flex-col gap-1.5 ${colSpan === "full" ? "md:col-span-2" : ""}`}>
            <label htmlFor={id} className="label-cinzel text-[0.58rem] text-[var(--text-secondary)]">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeHolder}
                required={required}
                value={value}
                onChange={onChange}
                style={{
                    ...fieldStyle,
                    colorScheme: "dark",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--gold-primary)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(201,168,76,0.2)")}
            />
        </div>
    );
}
