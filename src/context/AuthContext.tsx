"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { sound } from "@/utils/sound";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google";
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isPremium: boolean;
  setUserProfile: (profile: UserProfile) => void;
  redeemCode: (code: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isPremium: false,
  setUserProfile: () => {},
  redeemCode: async () => ({ success: false, message: "" }),
  logout: () => {},
});

// Helper to decode Google JWT token securely
export function parseGoogleJwt(token: string): any {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Instant 0ms cache for isPremium to prevent refresh flickers
  const [isPremium, setIsPremiumState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("obrolan_is_premium") === "true";
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setIsPremium = (val: boolean) => {
    setIsPremiumState(val);
    try {
      if (val) {
        localStorage.setItem("obrolan_is_premium", "true");
      } else {
        localStorage.removeItem("obrolan_is_premium");
      }
    } catch (e) {}
  };

  // Helper to fetch user premium status from server database
  const syncAccountPremiumStatus = async (email: string) => {
    try {
      const res = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.user) {
        setIsPremium(!!data.user.isPremium);
      } else {
        setIsPremium(false);
      }
    } catch (e) {
      // Retain existing local premium status on network errors
    }
  };

  // Load existing session & sync Google account premium status on mount
  useEffect(() => {
    async function initSession() {
      try {
        const stored = localStorage.getItem("obrolan_user_session");
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          if (parsed.email === "nathaf@gmail.com" || parsed.email === "pemain@gmail.com") {
            localStorage.removeItem("obrolan_user_session");
            localStorage.removeItem("obrolan_is_premium");
            setUser(null);
            setIsPremium(false);
          } else {
            setUser(parsed);
            await syncAccountPremiumStatus(parsed.email);
          }
        } else {
          setIsPremium(false);
        }
      } catch (e) {
        console.warn("Failed to load user session:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initSession();
  }, []);

  const setUserProfile = async (profile: UserProfile) => {
    sound.playChime();
    setUser(profile);

    try {
      localStorage.setItem("obrolan_user_session", JSON.stringify(profile));
      sessionStorage.setItem("my_name", profile.name.split(" ")[0]);

      // Sync user profile to backend server database & check premium status
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = await res.json();
      if (data.success && data.user) {
        setIsPremium(!!data.user.isPremium);
      }
    } catch (e) {}
  };

  const redeemCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!user || !user.email) {
      sound.playClick();
      return {
        success: false,
        message: "Silakan Masuk dengan Akun Google terlebih dahulu agar Pass Premium terikat di akun kamu!",
      };
    }

    if (isPremium) {
      sound.playClick();
      return {
        success: false,
        message: "Akun kamu sudah menjadi VIP Premium Aktif! Kode promo tidak perlu digunakan lagi karena kamu sudah memiliki akses penuh.",
      };
    }

    const clean = code.trim().toUpperCase();

    if (!clean) {
      sound.playClick();
      return {
        success: false,
        message: "Silakan masukkan kode redeem terlebih dahulu!",
      };
    }

    if (clean === "OS4FREE") {
      sound.playChime();

      try {
        // Send redeem request to backend database bound to this Google email (Pass 3 Jam)
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user.email,
            redeemCode: "OS4FREE",
            isPremium: true,
            activePass: {
              type: "pass_3jam_promo",
              expiresAt: Date.now() + 3 * 60 * 60 * 1000 // Pass 3 Jam
            }
          }),
        });

        const data = await res.json();
        if (data.success && data.user) {
          setIsPremium(true);
          return {
            success: true,
            message: `Selamat ${user.name}! Kode OS4FREE berhasil mengaktifkan Pass Gratis 3 Jam untuk akun ${user.email}. Seluruh topik terbuka selama 3 jam!`,
          };
        } else {
          sound.playClick();
          return {
            success: false,
            message: data.message || `Kode promo OS4FREE sudah pernah kamu gunakan di akun email ${user.email}. Setiap akun hanya dapat menggunakan 1x.`
          };
        }
      } catch (e) {
        sound.playClick();
        return {
          success: false,
          message: "Terjadi kesalahan saat memproses penukaran kode promo."
        };
      }
    }

    sound.playClick();
    return {
      success: false,
      message: `Kode promo "${clean}" tidak terdaftar. Periksa kembali kode yang kamu ketik!`,
    };
  };

  const logout = () => {
    sound.playClick();
    setUser(null);
    setIsPremium(false);
    try {
      localStorage.removeItem("obrolan_user_session");
      localStorage.removeItem("obrolan_is_premium");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isPremium, setUserProfile, redeemCode, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
