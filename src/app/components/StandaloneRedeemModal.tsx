"use client";

import React, { useState } from "react";
import { Ticket, Sparkles, X, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sound } from "@/utils/sound";
import { GoogleAuthButton } from "./GoogleAuthButton";

interface StandaloneRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StandaloneRedeemModal({ isOpen, onClose }: StandaloneRedeemModalProps) {
  const { redeemCode, user, isPremium } = useAuth();
  const [inputCode, setInputCode] = useState("OS4FREE");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      const result = await redeemCode(inputCode);
      if (result.success) {
        setStatusMessage({ type: "success", text: result.message });
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 2000);
      } else {
        setStatusMessage({ type: "error", text: result.message });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Terjadi kesalahan saat memproses kode." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/65 backdrop-blur-md animate-pop-in">
      <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 w-[340px] sm:w-[420px] border-4 border-[#FD8B51] shadow-2xl flex flex-col items-center text-center relative select-none">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#257180]/50 hover:text-[#257180] font-black text-sm w-8 h-8 rounded-full bg-[#F2E5BF] flex items-center justify-center cursor-pointer">
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-[#FD8B51]/15 border border-[#FD8B51]/30 flex items-center justify-center text-[#FD8B51] my-2 shadow-sm">
          <Ticket className="w-7 h-7" />
        </div>

        {/* Modal Title */}
        <h2 className="text-2xl font-black text-[#257180] tracking-tight">Tukarkan Kode Promo</h2>
        <p className="text-xs font-semibold text-[#257180]/75 mt-1">
          Gunakan kode promo <strong className="text-[#FD8B51] font-black">OS4FREE</strong> untuk mengaktifkan Pass Gratis 3 Jam!
        </p>

        {/* User Google Login Warning if not logged in */}
        {!user && (
          <div className="my-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center space-y-2 w-full">
            <p>Silakan masuk Akun Google terlebih dahulu agar kode promo terikat ke akun kamu!</p>
            <div className="flex justify-center">
              <GoogleAuthButton />
            </div>
          </div>
        )}

        {/* Promo Hint Box */}
        <div className="my-4 px-4 py-2.5 rounded-2xl bg-[#257180]/10 border border-[#257180]/20 text-[#257180] text-xs font-bold w-full flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FD8B51]" />
          <span>Gunakan Kode: <strong className="text-[#FD8B51] font-black">OS4FREE</strong></span>
        </div>

        {/* Redeem Form */}
        <form onSubmit={handleRedeem} className="w-full space-y-3">
          <input
            type="text"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            placeholder="Ketik kode promo..."
            className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#257180]/20 text-center font-black text-base text-[#257180] outline-none uppercase placeholder:normal-case placeholder:font-semibold placeholder:text-sm focus:border-[#FD8B51]"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] active:scale-95 transition shadow-md cursor-pointer flex items-center justify-center gap-2">
            {isSubmitting ? "Memproses..." : "Tukarkan Kode Sekarang"}
          </button>
        </form>

        {/* Status Message Alert */}
        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 w-full ${
              statusMessage.type === "success"
                ? "bg-green-100 border border-green-300 text-green-800"
                : "bg-red-100 border border-red-300 text-red-800"
            }`}>
            {statusMessage.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

      </div>
    </div>
  );
}
