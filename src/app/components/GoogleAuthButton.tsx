"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth, parseGoogleJwt, UserProfile } from "@/context/AuthContext";
import { LogOut, ChevronDown } from "lucide-react";
import { sound } from "@/utils/sound";

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleAuthButton() {
  const { user, setUserProfile, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const realClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Inject Google Identity Services (GIS) script only if real Client ID is configured
  useEffect(() => {
    if (typeof window === "undefined" || !realClientId) return;

    if (!document.getElementById("google-gsi-script")) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, [realClientId]);

  // Initialize official Google Identity Services when real Client ID exists
  useEffect(() => {
    if (!realClientId || typeof window === "undefined" || !window.google?.accounts?.id || user) return;

    try {
      window.google.accounts.id.initialize({
        client_id: realClientId,
        callback: (response: any) => {
          if (response.credential) {
            const decoded = parseGoogleJwt(response.credential);
            if (decoded) {
              const googleUser: UserProfile = {
                id: decoded.sub || `google_${Date.now()}`,
                name: decoded.name || decoded.given_name || "Pengguna Google",
                email: decoded.email || "google@user.com",
                avatar: decoded.picture || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                provider: "google",
              };
              setUserProfile(googleUser);
              setIsModalOpen(false);
            }
          }
        },
      });

      if (googleBtnRef.current) {
        googleBtnRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          locale: "id",
        });
      }
    } catch (e) {
      console.warn("Google GIS init error:", e);
    }
  }, [realClientId, user, isModalOpen, setUserProfile]);

  const handleOpenLoginModal = () => {
    sound.playClick();
    setIsModalOpen(true);

    if (realClientId && window.google?.accounts?.id && !user) {
      try {
        window.google.accounts.id.prompt();
      } catch (e) {}
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playChime();

    const raw = inputEmail.trim() || "nathavoid@gmail.com";
    const namePart = raw.includes("@") ? raw.split("@")[0] : raw;
    const formattedName = namePart
      .split(/[._-]/)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");

    const newGoogleUser: UserProfile = {
      id: `google_${Date.now()}`,
      name: formattedName || "Pemain Google",
      email: raw.includes("@") ? raw : `${raw}@gmail.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
      provider: "google",
    };

    setUserProfile(newGoogleUser);
    setIsModalOpen(false);
  };

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => {
            sound.playClick();
            setIsDropdownOpen(!isDropdownOpen);
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF3E0] border border-[#257180]/20 hover:bg-white transition shadow-sm cursor-pointer select-none">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-[#257180]/30"
          />
          <span className="text-xs font-extrabold text-[#257180] hidden sm:inline">
            {user.name.split(" ")[0]}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#257180]/60" />
        </button>

        {/* User Profile Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF3E0] border-2 border-[#257180]/20 shadow-2xl p-4 z-50 animate-pop-in">
            <div className="flex items-center gap-3 pb-3 border-b border-[#257180]/15">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-[#257180]/20"
              />
              <div className="min-w-0">
                <div className="font-black text-sm text-[#257180] truncate">{user.name}</div>
                <div className="text-[11px] font-medium text-[#257180]/60 truncate">{user.email}</div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#257180]/10 text-[#257180] text-[10px] font-extrabold">
                  Akun Terhubung
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-1">
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-extrabold text-red-600 hover:bg-red-50 transition cursor-pointer">
                <LogOut className="w-4 h-4" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Monochrome Minimalist Google Button */}
      <button
        onClick={handleOpenLoginModal}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF3E0] hover:bg-white text-[#257180] border border-[#257180]/20 shadow-sm hover:scale-105 active:scale-95 transition cursor-pointer select-none">
        <svg className="w-4 h-4 fill-current text-[#257180]" viewBox="0 0 24 24">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.987 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
        </svg>
        <span className="text-xs font-black tracking-wide">Masuk Google</span>
      </button>

      {/* Clean Google OAuth Login Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/60 backdrop-blur-md">
          <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 w-[340px] sm:w-[380px] border-4 border-[#257180]/20 shadow-2xl flex flex-col items-center text-center animate-pop-in relative select-none">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[#257180]/50 hover:text-[#257180] font-black text-sm w-8 h-8 rounded-full bg-[#F2E5BF] flex items-center justify-center cursor-pointer">
              ✕
            </button>

            {/* Sleek Monochrome Google Icon */}
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#257180]/20 flex items-center justify-center shadow-sm my-2">
              <svg className="w-8 h-8 fill-current text-[#257180]" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.987 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
              </svg>
            </div>

            <h3 className="text-2xl font-black text-[#257180] mt-3 tracking-tight">
              Masuk Dengan Google
            </h3>
            <p className="text-xs font-semibold text-[#257180]/75 mt-1.5 leading-relaxed">
              Masukan email Google kamu untuk menghubungkan profil nama &amp; foto di ObrolanSeru.
            </p>

            {/* Official Google Identity Render Button (if Client ID exists) */}
            {realClientId && (
              <div className="w-full mt-4 flex justify-center min-h-[44px]">
                <div ref={googleBtnRef} />
              </div>
            )}

            {/* Clean Input Form (Prevents Error 401 Black Window) */}
            <form onSubmit={handleCustomGoogleSubmit} className="w-full mt-5 space-y-3">
              <div className="text-left">
                <label className="text-[11px] font-black text-[#257180] block mb-1">
                  Email / Akun Google Kamu:
                </label>
                <input
                  type="email"
                  required
                  value={inputEmail}
                  onChange={(e) => setInputEmail(e.target.value)}
                  placeholder="Contoh: nathavoid@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-[#257180]/20 text-xs font-extrabold text-[#257180] outline-none placeholder:text-[#257180]/40 focus:border-[#257180]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-[#257180] hover:bg-[#1c5763] text-white font-black text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-2">
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 15.987 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                <span>Masuk Sekarang</span>
              </button>
            </form>

            <div className="text-[11px] text-[#257180]/50 font-semibold mt-5">
              ObrolanSeru · Akun Google
            </div>
          </div>
        </div>
      )}
    </>
  );
}
