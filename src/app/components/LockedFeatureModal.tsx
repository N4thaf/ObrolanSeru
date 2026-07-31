"use client";

import React, { useState } from "react";
import { Lock, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { sound } from "@/utils/sound";

interface LockedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle?: string;
}

export function LockedFeatureModal({ isOpen, onClose, featureTitle }: LockedFeatureModalProps) {
  const { redeemCode, user } = useAuth();
  const [inputCode, setInputCode] = useState("OS4FREE");
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  if (!isOpen) return null;

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await redeemCode(inputCode);
    if (result.success) {
      setStatusMessage({ type: "success", text: result.message });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1500);
    } else {
      setStatusMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/65 backdrop-blur-md animate-pop-in">
      <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 w-[340px] sm:w-[400px] border-4 border-[#FD8B51] shadow-2xl flex flex-col items-center text-center relative select-none">
        
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#257180]/50 hover:text-[#257180] font-black text-sm w-8 h-8 rounded-full bg-[#F2E5BF] flex items-center justify-center cursor-pointer">
          ✕
        </button>

        {/* Chain & Padlock Graphic Badge */}
        <div className="relative my-2">
          <div className="w-18 h-18 rounded-3xl bg-gradient-to-br from-[#FD8B51] to-[#CB6040] text-white flex items-center justify-center shadow-xl border-2 border-[#FAF3E0]">
            <Lock className="w-9 h-9 text-[#FAF3E0] drop-shadow-md" />
          </div>
          {/* Metallic Badge Overlay */}
          <div className="absolute -top-1 -right-1 bg-[#257180] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full border border-white shadow-md flex items-center gap-1">
            <Lock className="w-2.5 h-2.5 text-white" />
            <span>Locked</span>
          </div>
        </div>

        <h3 className="text-2xl font-black text-[#257180] mt-3 tracking-tight">
          {featureTitle ? `"${featureTitle}" Terkunci` : "Fitur Premium Terkunci"}
        </h3>
        <p className="text-xs font-semibold text-[#257180]/80 mt-1">
          Gunakan kode promo <strong className="text-[#FD8B51] font-black">OS4FREE</strong> untuk mengaktifkan Pass Gratis 3 Jam!
        </p>

        {/* Redeem Code Form */}
        <form onSubmit={handleRedeem} className="w-full mt-5 space-y-3">
          <div className="text-left">
            <label className="text-[11px] font-black text-[#257180] block mb-1">
              Kode Promo / Redeem Voucher:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Masukkan kode: OS4FREE"
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#FD8B51]/40 text-sm font-black tracking-widest text-[#257180] uppercase outline-none placeholder:normal-case placeholder:font-semibold placeholder:tracking-normal placeholder:text-[#257180]/40 focus:border-[#FD8B51]"
              />
              <button
                type="button"
                onClick={() => setInputCode("OS4FREE")}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl bg-[#FD8B51]/15 text-[#CB6040] text-[10px] font-black hover:bg-[#FD8B51]/30 transition">
                Gunakan: OS4FREE
              </button>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 ${
                statusMessage.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}>
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
            <Sparkles className="w-4 h-4" />
            <span>Buka Akses Premium (OS4FREE)</span>
          </button>
        </form>

        <div className="text-[11px] text-[#257180]/50 font-semibold mt-4">
          Redeem Code Resmi · ObrolanSeru 2026
        </div>
      </div>
    </div>
  );
}
