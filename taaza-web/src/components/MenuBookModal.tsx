"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface MenuBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuPages = [
    {
        title: "Starters & Soups",
        items: [
            { name: "Mezze Royale", desc: "Hummus, mutabal, fattoush, fresh baked pita", price: "₹520" },
            { name: "Velvet Lentil Soup", desc: "Red lentil, warm spices, crispy parsley", price: "₹310" },
            { name: "Muhammara", desc: "Roasted red pepper, walnut, pomegranate molasses", price: "₹450" },
            { name: "Batata Harra", desc: "Crispy spiced potatoes, coriander, garlic chili", price: "₹380" },
            { name: "Tabbouleh", desc: "Fine bulgur, parsley, mint, lemon vinaigrette", price: "₹350" },
            { name: "Falafel Platter", desc: "Crispy chickpea patties, tahini, pickles", price: "₹420" },
        ]
    },
    {
        title: "Signature Mains",
        items: [
            { name: "Al-Aseel Kofta", desc: "Hand-rolled lamb, Aleppo pepper, rose harissa", price: "₹680" },
            { name: "Shawarma Wreath", desc: "72-hour marinated chicken, garlic toum", price: "₹750" },
            { name: "Samak Meshwi", desc: "Wood-grilled sea bass, tahini lemon sauce", price: "₹890" },
            { name: "Lamb Ouzi", desc: "Slow-roasted lamb, spiced rice, roasted nuts", price: "₹920" },
            { name: "Shish Tawook", desc: "Yogurt-marinated chicken skewers, charred veg", price: "₹650" },
            { name: "Moussaka", desc: "Layered eggplant, spiced ground beef, bechamel", price: "₹580" },
        ]
    },
    {
        title: "Rice & Oven",
        items: [
            { name: "Saffron Biryani", desc: "Basmati, Kashmiri saffron, braised lamb", price: "₹620" },
            { name: "Labneh & Truffle Flatbread", desc: "House labneh, truffle oil, za'atar, chilli", price: "₹430" },
            { name: "Za'atar Manakish", desc: "Classic Lebanese flatbread, olive oil, thyme", price: "₹320" },
            { name: "Lahmacun", desc: "Thin crust flatbread, spiced minced meat", price: "₹480" },
            { name: "Freekah Pilaf", desc: "Smoked green wheat, roasted almonds", price: "₹390" },
            { name: "Garlic Butter Naan", desc: "Tandoor baked flatbread, fresh garlic", price: "₹120" },
        ]
    },
    {
        title: "Sweet Finales",
        items: [
            { name: "Knafeh Soufflé", desc: "Warm cheese pastry, orange blossom syrup", price: "₹380" },
            { name: "Pistachio Baklava", desc: "Filo pastry, honey, crushed pistachios", price: "₹410" },
            { name: "Umm Ali", desc: "Egyptian bread pudding, nuts, raisins, cream", price: "₹350" },
            { name: "Rose Water Mahalabia", desc: "Milk pudding, rose water, crushed almonds", price: "₹290" },
            { name: "Turkish Delight", desc: "Assorted traditional soft candies", price: "₹250" },
            { name: "Arabic Coffee", desc: "Cardamom infused traditional brew", price: "₹180" },
        ]
    }
];

export default function MenuBookModal({ isOpen, onClose }: MenuBookModalProps) {
    const [currentPage, setCurrentPage] = useState(0);

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setCurrentPage(0); // Reset to first page
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const nextPage = () => {
        if (currentPage < menuPages.length - 1) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 0) setCurrentPage(currentPage - 1);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-4xl flex flex-col items-center justify-center mx-auto my-auto z-10">
                        {/* Close Button Above the Book */}
                        <div className="w-full flex justify-end mb-4">
                            <button
                                onClick={onClose}
                                className="group flex items-center justify-center w-10 h-10 rounded-full bg-[var(--obsidian-light)] border border-white/10 hover:border-[var(--gold-primary)] transition-colors duration-300"
                            >
                                <X className="text-[var(--text-secondary)] group-hover:text-[var(--gold-primary)] transition-colors duration-300" size={24} />
                            </button>
                        </div>

                        {/* The Book */}
                        <motion.div
                            className="relative w-full aspect-[3/4] sm:aspect-auto sm:h-[600px] bg-[var(--obsidian)] border border-[var(--gold-primary)]/30 rounded-lg shadow-2xl overflow-hidden flex"
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 100 }}
                            style={{
                                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 0 1px rgba(201,168,76,0.1), inset 0 0 20px rgba(0,0,0,0.5)"
                            }}
                        >
                            {/* Book Spine (Desktop only - visible in middle) */}
                            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-8 -translate-x-1/2 bg-gradient-to-r from-transparent via-black/40 to-transparent z-20 pointer-events-none" />

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPage}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full flex flex-col sm:flex-row"
                                >
                                    {/* Mobile: Single Page View. Desktop: Left page (Even), Right page (Odd) view if checking pages */}
                                    {/* Since prompt said 4 page menu, on mobile we show 1 page at a time. On desktop, maybe 2 pages side by side? Or just keep it perfectly responsive: 1 page with big text. Let's do a uniform 1 page view for simplicity, but nicely styled, or a 2-page spread on desktop. Let's do a 2-page spread on md+ screens. */}

                                    <div className="w-full h-full p-6 sm:p-10 flex flex-col items-center justify-start overflow-y-auto no-scrollbar relative">
                                        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />

                                        {/* Page decorative border */}
                                        <div className="absolute inset-4 border border-[var(--gold-primary)]/20 pointer-events-none rounded sm:hidden" />

                                        <div className="w-full max-w-md mx-auto text-center mt-4">
                                            <span className="label-cinzel text-[var(--gold-primary)] text-sm mb-2 block tracking-[0.2em]">Chapter {currentPage + 1}</span>
                                            <h2 className="text-3xl sm:text-4xl text-[var(--text-primary)] mb-8 pb-4 border-b border-[var(--gold-primary)]/20 inline-block px-8" style={{ fontFamily: "var(--font-serif)" }}>
                                                {menuPages[currentPage].title}
                                            </h2>

                                            <div className="space-y-8 text-left">
                                                {menuPages[currentPage].items.map((item, i) => (
                                                    <div key={i} className="flex flex-col gap-1">
                                                        <div className="flex justify-between items-baseline gap-4">
                                                            <h3 className="text-lg text-[var(--gold-light)]" style={{ fontFamily: "var(--font-serif)" }}>
                                                                {item.name}
                                                            </h3>
                                                            {/* Dotted line */}
                                                            <div className="flex-grow border-b border-dotted border-[var(--text-muted)]/40 relative -top-1" />
                                                            <span className="text-[var(--gold-primary)] font-medium" style={{ fontFamily: "var(--font-serif)" }}>
                                                                {item.price}
                                                            </span>
                                                        </div>
                                                        <p className="text-[var(--text-secondary)] text-sm font-light leading-relaxed pr-12" style={{ fontFamily: "var(--font-body)" }}>
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Page Number */}
                                        <div className="mt-auto pt-8 text-center text-[var(--text-muted)] text-xs" style={{ fontFamily: "var(--font-display)" }}>
                                            - {currentPage + 1} -
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation Buttons (Inside the book bounds or absolute) */}
                            {currentPage > 0 && (
                                <button
                                    onClick={prevPage}
                                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--obsidian)]/80 border border-[var(--gold-primary)]/30 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[var(--obsidian)] transition-all duration-300 z-30"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            {currentPage < menuPages.length - 1 && (
                                <button
                                    onClick={nextPage}
                                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-[var(--obsidian)]/80 border border-[var(--gold-primary)]/30 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-[var(--obsidian)] transition-all duration-300 z-30"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </motion.div>

                        {/* Page Indicators */}
                        <div className="flex items-center gap-3 mt-6">
                            {menuPages.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentPage(idx)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentPage ? "bg-[var(--gold-primary)] scale-125" : "bg-[var(--text-muted)]/40 hover:bg-[var(--gold-primary)]/50"}`}
                                    aria-label={`Go to page ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
