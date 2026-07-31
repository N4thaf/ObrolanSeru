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
  redeemCode: (code: string) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isPremium: false,
  setUserProfile: () => {},
  redeemCode: () => ({ success: false, message: "" }),
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
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session & premium pass status on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("obrolan_user_session");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        if (parsed.email === "nathaf@gmail.com" || parsed.email === "pemain@gmail.com") {
          localStorage.removeItem("obrolan_user_session");
          setUser(null);
        } else {
          setUser(parsed);
        }
      }

      // Check premium unlock status (default is false)
      const premiumStatus = localStorage.getItem("obrolan_is_premium");
      if (premiumStatus === "true") {
        setIsPremium(true);
      }
    } catch (e) {
      console.warn("Failed to load user session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setUserProfile = async (profile: UserProfile) => {
    sound.playChime();
    setUser(profile);
    try {
      localStorage.setItem("obrolan_user_session", JSON.stringify(profile));
      sessionStorage.setItem("my_name", profile.name.split(" ")[0]);

      // Sync user profile to backend server database
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch (e) {}
  };

  const redeemCode = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    if (clean === "OS4FREE") {
      sound.playChime();
      setIsPremium(true);
      try {
        localStorage.setItem("obrolan_is_premium", "true");
      } catch (e) {}
      return {
        success: true,
        message: "Selamat! Kode OS4FREE berhasil. Seluruh Mode & Topik Premium telah terbuka!",
      };
    }

    sound.playClick();
    return {
      success: false,
      message: "Kode promo tidak valid. Gunakan kode: OS4FREE",
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
