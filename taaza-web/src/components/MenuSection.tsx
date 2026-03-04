"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import MenuBookModal from "./MenuBookModal";

const menuItems = [
    {
        name: "Al-Aseel Kofta",
        category: "Grilled Mains",
        price: "₹680",
        desc: "Hand-rolled minced lamb with Aleppo pepper, charcoal-grilled to perfection, served with rose harissa.",
        tag: "Signature",
        tagColor: "var(--gold-primary)",
    },
    {
        name: "Mezze Royale",
        category: "Sharing Starters",
        price: "₹520",
        desc: "A curated selection: silken hummus, smoky mutabal, fattoush salad, and pita baked in-house daily.",
        tag: "For Two",
        tagColor: "var(--gold-primary)",
    },
    {
        name: "Shawarma Wreath",
        category: "Wood-fire Rotisserie",
        price: "₹750",
        desc: "72-hour marinated chicken thigh, slow-spun over wood fire. Dressed with garlic toum and pickled turnip.",
        tag: "Best Seller",
        tagColor: "#C77A5A",
    },
    {
        name: "Saffron Biryani",
        category: "Rice & Grains",
        price: "₹620",
        desc: "Fragrant basmati infused with Kashmiri saffron, crowned with braised lamb and crispy barberries.",
        tag: "Heritage Recipe",
        tagColor: "var(--gold-primary)",
    },
    {
        name: "Labneh & Truffle Flatbread",
        category: "From the Oven",
        price: "₹430",
        desc: "House-churned labneh, black truffle oil, za'atar dust, finished with Aleppo chilli flakes.",
        tag: "Vegetarian",
        tagColor: "#6BAC7A",
    },
    {
        name: "Knafeh Soufflé",
        category: "Sweet Finales",
        price: "₹380",
        desc: "Warm cheese pastry drenched in orange blossom syrup. A contemporary reimagining of a Nabulsi classic.",
        tag: "Must Try",
        tagColor: "#C77A5A",
    },
];

export default function MenuSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-5%" });
    const [isBookOpen, setIsBookOpen] = useState(false);

    return (
        <section
            id="menu"
            ref={sectionRef}
            className="relative pt-[calc(var(--space-section)*0.2)] pb-[var(--space-section)] overflow-hidden"
            style={{ background: "linear-gradient(180deg, var(--obsidian) 0%, var(--obsidian-mid) 50%, var(--obsidian) 100%)" }}
        >
            {/* Decorative corner */}
            <svg
                className="absolute top-0 right-0 opacity-5 pointer-events-none"
                width="500"
                height="500"
                viewBox="0 0 500 500"
                fill="none"
            >
                <path d="M500 0 Q250 250 0 500" stroke="#C9A84C" strokeWidth="0.5" />
                <path d="M500 50 Q280 280 50 500" stroke="#C9A84C" strokeWidth="0.3" />
                <path d="M500 100 Q310 310 100 500" stroke="#C9A84C" strokeWidth="0.2" />
            </svg>

            <div className="max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <motion.div
                            className="flex items-center gap-4 mb-4"
                            initial={{ opacity: 0, x: -20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.7 }}
                        >
                            <div className="h-px w-8 bg-[var(--gold-primary)]" />
                            <span className="label-cinzel">Curated Selections</span>
                        </motion.div>
                        <motion.h2
                            className="headline-lg"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            The <em className="flourish">Menu</em>
                        </motion.h2>
                    </div>
                    <motion.p
                        className="text-[var(--text-secondary)] max-w-xs text-sm leading-relaxed"
                        style={{ fontFamily: "var(--font-body)" }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Every dish is crafted fresh daily. We source ingredients within a 200km radius wherever possible.
                    </motion.p>
                </div>

                {/* Menu Grid — intentionally asymmetric spans */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {menuItems.map((item, i) => (
                        <motion.article
                            key={item.name}
                            className="group relative glass-surface p-7 cursor-pointer overflow-hidden"
                            style={{
                                borderRadius:
                                    i % 3 === 0
                                        ? "0.5rem 2rem 0.5rem 0.5rem"
                                        : i % 3 === 1
                                            ? "2rem 0.5rem 2rem 0.5rem"
                                            : "0.5rem 0.5rem 2rem 0.5rem",
                            }}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                            whileHover={{ y: -4 }}
                        >
                            {/* Hover shimmer */}
                            <motion.div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 60%)",
                                }}
                            />

                            {/* Tag */}
                            <div className="flex items-center justify-between mb-5">
                                <span
                                    className="label-cinzel text-[0.55rem] px-2.5 py-1 rounded-full"
                                    style={{
                                        color: item.tagColor,
                                        border: `1px solid ${item.tagColor}40`,
                                        background: `${item.tagColor}12`,
                                    }}
                                >
                                    {item.tag}
                                </span>
                                <span
                                    className="text-[var(--text-muted)] text-xs"
                                    style={{ fontFamily: "var(--font-display)", letterSpacing: "0.1em" }}
                                >
                                    {item.category}
                                </span>
                            </div>

                            {/* Name & Price */}
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3
                                    className="text-xl font-light leading-tight text-[var(--text-primary)] group-hover:text-[var(--gold-light)] transition-colors duration-400"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                >
                                    {item.name}
                                </h3>
                                <span
                                    className="text-lg shrink-0 text-[var(--gold-primary)]"
                                    style={{ fontFamily: "var(--font-serif)" }}
                                >
                                    {item.price}
                                </span>
                            </div>

                            {/* Description */}
                            <p
                                className="text-[var(--text-secondary)] text-sm leading-relaxed"
                                style={{ fontFamily: "var(--font-body)" }}
                            >
                                {item.desc}
                            </p>

                            {/* Bottom accent line */}
                            <div className="mt-5 h-px w-0 group-hover:w-full bg-gradient-to-r from-[var(--gold-primary)] to-transparent transition-all duration-500" />
                        </motion.article>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    className="mt-14 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.6 }}
                >
                    <p className="flourish text-[var(--text-secondary)] mb-5 text-sm">
                        Seasonal specials curated every 30 days
                    </p>
                    <motion.button
                        onClick={() => setIsBookOpen(true)}
                        className="btn-gold-outline inline-flex"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                    >
                        View Full Menu
                    </motion.button>
                </motion.div>
            </div>

            <MenuBookModal isOpen={isBookOpen} onClose={() => setIsBookOpen(false)} />
        </section>
    );
}
