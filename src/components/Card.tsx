"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface CardProps {
  question: string;
  type?: "normal" | "truth" | "dare";
  onDraw?: () => void;
  isFlipped: boolean;
  disabled?: boolean;
}

export default function Card({ question, type = "normal", onDraw, isFlipped, disabled = false }: CardProps) {
  
  const handleCardClick = () => {
    if (!isFlipped && !disabled && onDraw) {
      onDraw();
    }
  };

  const getCardBg = () => {
    if (type === "truth") return "bg-blue-50";
    if (type === "dare") return "bg-red-50";
    return "bg-white";
  };

  const getCardAccent = () => {
    if (type === "truth") return "text-blue-500 border-blue-200";
    if (type === "dare") return "text-red-500 border-red-200";
    return "text-[var(--color-brand-coral)] border-[rgba(26,42,74,0.1)]";
  };

  return (
    <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] perspective-1000 cursor-pointer group" onClick={handleCardClick}>
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front of Card (The Back side visually in UI before drawing) */}
        <div className="absolute w-full h-full backface-hidden rounded-3xl bg-[var(--color-brand-navy)] border-4 border-[var(--color-brand-gold)] shadow-2xl flex flex-col items-center justify-center p-6 text-center transform-style-3d group-hover:shadow-[0_10px_40px_-10px_rgba(26,42,74,0.5)] transition-shadow">
           <div className="w-full h-full border-2 border-dashed border-[rgba(245,166,35,0.3)] rounded-xl flex items-center justify-center flex-col gap-4">
              <span className="text-[var(--color-brand-gold)] text-4xl opacity-80">?</span>
              <p className="text-[var(--color-brand-cream)] font-heading font-medium tracking-wide opacity-80">Tarik Kartu</p>
           </div>
        </div>

        {/* Back of Card (The Front side visually showing the question) */}
        <div className={`absolute w-full h-full backface-hidden rounded-3xl border-2 shadow-xl flex flex-col items-center justify-center p-8 text-center rotate-y-180 ${getCardBg()} ${getCardAccent()}`}>
           
           <div className="absolute top-6 left-6 right-6 flex justify-between items-center opacity-50 uppercase tracking-widest text-xs font-bold">
             <span>ObrolanSeru</span>
             <span>{type}</span>
           </div>

           <p className="text-xl sm:text-2xl font-medium text-[var(--color-brand-navy)] leading-relaxed mt-4">
             {question}
           </p>

           <div className="absolute bottom-6 w-full text-center opacity-40">
              <span className="inline-block w-12 h-1 rounded-full bg-current"></span>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
