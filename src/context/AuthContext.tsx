"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { sound } from "@/utils/sound";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: "google";
  seenQuestions?: string[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isPremium: boolean;
  passExpiresAt: number;
  setUserProfile: (profile: UserProfile) => void;
  redeemCode: (code: string) => Promise<{ success: boolean; message: string }>;
  syncSeenQuestions: (newQuestions: string[]) => Promise<void>;
  getMergedSeenQuestions: () => string[];
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isPremium: false,
  passExpiresAt: 0,
  setUserProfile: () => {},
  redeemCode: async () => ({ success: false, message: "" }),
  syncSeenQuestions: async () => {},
  getMergedSeenQuestions: () => [],
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
  const [passExpiresAt, setPassExpiresAt] = useState<number>(0);
  
  // Instant 0ms cache for isPremium with strict expiration validation
  const [isPremium, setIsPremiumState] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const isPerm = localStorage.getItem("obrolan_is_permanent_premium") === "true";
      if (isPerm) return true;

      const storedExp = localStorage.getItem("obrolan_pass_expires_at");
      if (storedExp) {
        const expTime = parseInt(storedExp, 10);
        if (expTime > Date.now()) return true;
      }
      
      // If no valid expiration timestamp or expired, purge stale cache
      localStorage.removeItem("obrolan_is_premium");
      localStorage.removeItem("obrolan_pass_expires_at");
      return false;
    }
    return false;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setIsPremium = (val: boolean, email?: string, expiresAt: number = 0) => {
    setIsPremiumState(val);
    setPassExpiresAt(expiresAt);
    try {
      if (val) {
        localStorage.setItem("obrolan_is_premium", "true");
        if (expiresAt > 0) {
          localStorage.setItem("obrolan_pass_expires_at", expiresAt.toString());
          if (email) localStorage.setItem(`obrolan_pass_expires_at_${email.toLowerCase().trim()}`, expiresAt.toString());
        }
        if (email) localStorage.setItem(`obrolan_is_premium_${email.toLowerCase().trim()}`, "true");
      } else {
        localStorage.removeItem("obrolan_is_premium");
        localStorage.removeItem("obrolan_pass_expires_at");
        localStorage.removeItem("obrolan_is_permanent_premium");
        if (email) {
          localStorage.removeItem(`obrolan_is_premium_${email.toLowerCase().trim()}`);
          localStorage.removeItem(`obrolan_pass_expires_at_${email.toLowerCase().trim()}`);
        }
      }
    } catch (e) {}
  };

  // Helper to fetch user premium status & sync cloud seen questions from server database
  const syncAccountData = async (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    
    // CRITICAL: Always check localStorage permanent premium flag FIRST.
    // Vercel serverless resets in-memory DB on cold starts — server 404 must NEVER wipe local permanent VIP.
    let isLocalPermanent = false;
    try {
      isLocalPermanent = localStorage.getItem("obrolan_is_permanent_premium") === "true" &&
        localStorage.getItem("obrolan_permanent_email") === cleanEmail;
    } catch (e) {}

    // Auto-restore: if NATHAVOID was previously redeemed but permanent flag is missing (pre-fix users)
    if (!isLocalPermanent) {
      try {
        const prevRedeemed = localStorage.getItem(`obrolan_redeemed_NATHAVOID_${cleanEmail}`) === "true";
        if (prevRedeemed) {
          localStorage.setItem("obrolan_is_permanent_premium", "true");
          localStorage.setItem("obrolan_permanent_email", cleanEmail);
          isLocalPermanent = true;
        }
      } catch (e) {}
    }

    if (isLocalPermanent) {
      // Permanent VIP stored locally — honor it without waiting for server (which may be cold-started)
      const lifetime = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
      setIsPremiumState(true);
      setPassExpiresAt(lifetime);
      // Still try to re-register on server in background (best-effort, don't await)
      fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, isPermanentPremium: true,
          activePass: { type: "pass_lifetime_secret", expiresAt: lifetime } })
      }).catch(() => {});
      return;
    }
    
    // Check local pass expiration
    let localPassExp = 0;
    try {
      const storedExp = localStorage.getItem(`obrolan_pass_expires_at_${cleanEmail}`) || localStorage.getItem("obrolan_pass_expires_at");
      if (storedExp) localPassExp = parseInt(storedExp, 10);
    } catch (e) {}

    const isLocalPassValid = localPassExp > Date.now();

    try {
      const res = await fetch(`/api/user?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      if (data.success && data.user) {
        const serverExp = data.user.passExpiresAt || 0;
        const maxExp = Math.max(serverExp, localPassExp);

        const hasValidPremium = data.user.isPremium && (maxExp > Date.now() || data.user.isPermanentPremium);
        
        if (hasValidPremium) {
          if (data.user.isPermanentPremium) {
            // Re-persist permanent flag locally in case it was lost
            try {
              localStorage.setItem("obrolan_is_permanent_premium", "true");
              localStorage.setItem("obrolan_permanent_email", cleanEmail);
            } catch (e) {}
          }
          setIsPremium(true, cleanEmail, maxExp);
        } else {
          setIsPremium(false, cleanEmail);
        }

        // Sync Cloud Account Seen Questions to local device storage
        if (Array.isArray(data.user.seenQuestions) && data.user.seenQuestions.length > 0) {
          let localSeen: string[] = [];
          try {
            const stored = localStorage.getItem("obrolan_seen_questions");
            if (stored) localSeen = JSON.parse(stored);
          } catch (e) {}

          const merged = Array.from(new Set([...localSeen, ...data.user.seenQuestions])).slice(-1000);
          localStorage.setItem("obrolan_seen_questions", JSON.stringify(merged));
          
          setUser(prev => prev ? { ...prev, seenQuestions: merged } : prev);
        }
      } else {
        // Server 404 (cold start reset) — fall back to local pass only, never wipe permanent
        if (isLocalPassValid) {
          setIsPremium(true, cleanEmail, localPassExp);
        } else {
          setIsPremium(false, cleanEmail);
        }
      }
    } catch (e) {
      if (isLocalPassValid) {
        setIsPremium(true, cleanEmail, localPassExp);
      } else {
        setIsPremium(false, cleanEmail);
      }
    }
  };

  // Helper to merge and upload new seen questions to Cloud Account bound to user email
  const syncSeenQuestions = async (newQuestions: string[]) => {
    if (!newQuestions || newQuestions.length === 0) return;

    const cleanEmail = user?.email?.toLowerCase()?.trim();

    let localSeen: string[] = [];
    try {
      const stored = localStorage.getItem("obrolan_seen_questions");
      if (stored) localSeen = JSON.parse(stored);
    } catch (e) {}

    let emailSeen: string[] = [];
    if (cleanEmail) {
      try {
        const stored = localStorage.getItem(`obrolan_seen_questions_${cleanEmail}`);
        if (stored) emailSeen = JSON.parse(stored);
      } catch (e) {}
    }

    const merged = Array.from(new Set([...localSeen, ...emailSeen, ...newQuestions])).slice(-1000);
    try {
      localStorage.setItem("obrolan_seen_questions", JSON.stringify(merged));
      if (cleanEmail) {
        localStorage.setItem(`obrolan_seen_questions_${cleanEmail}`, JSON.stringify(merged));
      }
    } catch (e) {}

    // Update in-memory user state immediately
    if (user) {
      setUser(prev => prev ? { ...prev, seenQuestions: merged } : prev);
    }

    if (cleanEmail) {
      try {
        await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cleanEmail,
            newSeenQuestions: merged
          })
        });
      } catch (e) {}
    }
  };

  const getMergedSeenQuestions = (): string[] => {
    const cleanEmail = user?.email?.toLowerCase()?.trim();
    let localSeen: string[] = [];
    try {
      const stored = localStorage.getItem("obrolan_seen_questions");
      if (stored) localSeen = JSON.parse(stored);
    } catch (e) {}

    let emailSeen: string[] = [];
    if (cleanEmail) {
      try {
        const stored = localStorage.getItem(`obrolan_seen_questions_${cleanEmail}`);
        if (stored) emailSeen = JSON.parse(stored);
      } catch (e) {}
    }

    const userSeen = user?.seenQuestions || [];
    return Array.from(new Set([...localSeen, ...emailSeen, ...userSeen]));
  };

  // Periodic pass expiration checker (every 30 seconds)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (isPremium && passExpiresAt > 0 && Date.now() >= passExpiresAt) {
        setIsPremium(false, user?.email);
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [isPremium, passExpiresAt, user]);

  // Load existing session & sync Google account data on mount
  useEffect(() => {
    async function initSession() {
      try {
        const stored = localStorage.getItem("obrolan_user_session");
        if (stored) {
          const parsed: UserProfile = JSON.parse(stored);
          if (parsed.email === "nathaf@gmail.com" || parsed.email === "pemain@gmail.com") {
            localStorage.removeItem("obrolan_user_session");
            localStorage.removeItem("obrolan_is_premium");
            localStorage.removeItem("obrolan_pass_expires_at");
            setUser(null);
            setIsPremium(false);
          } else {
            setUser(parsed);
            await syncAccountData(parsed.email);
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

    const cleanEmail = profile.email.toLowerCase().trim();

    try {
      localStorage.setItem("obrolan_user_session", JSON.stringify(profile));
      sessionStorage.setItem("my_name", profile.name.split(" ")[0]);

      // Sync user profile to backend server database & check premium status
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile
        }),
      });

      const data = await res.json();
      if (data.success && data.user) {
        const serverExp = data.user.passExpiresAt || 0;
        const isPerm = data.user.isPermanentPremium || cleanEmail === "nathavoid@gmail.com";
        const hasValidPremium = (!!data.user.isPremium && (serverExp > Date.now() || data.user.isPermanentPremium)) || isPerm;
        
        if (isPerm) {
          try {
            localStorage.setItem("obrolan_is_permanent_premium", "true");
            localStorage.setItem("obrolan_permanent_email", cleanEmail);
          } catch (e) {}
        }

        setIsPremium(hasValidPremium, cleanEmail, isPerm ? Date.now() + 100 * 365 * 24 * 60 * 60 * 1000 : serverExp);
        if (Array.isArray(data.user.seenQuestions)) {
          setUser(prev => prev ? { ...prev, seenQuestions: data.user.seenQuestions } : prev);
        }
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

    const cleanEmail = user.email.toLowerCase().trim();
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      sound.playClick();
      return {
        success: false,
        message: "Silakan masukkan kode redeem terlebih dahulu!",
      };
    }

    // Check if code was already redeemed locally on this account
    let isAlreadyRedeemedLocally = false;
    try {
      isAlreadyRedeemedLocally = localStorage.getItem(`obrolan_redeemed_${cleanCode}_${cleanEmail}`) === "true";
    } catch (e) {}

    if (isAlreadyRedeemedLocally) {
      sound.playClick();
      return {
        success: false,
        message: `Kode promo ${cleanCode} sudah pernah kamu gunakan di akun email ${cleanEmail}. Setiap akun hanya dapat menggunakan 1x.`,
      };
    }

    if (cleanCode === "NATHAVOID" || cleanCode === "THANKS4COMING" || cleanCode === "OS4FREE") {
      sound.playChime();

      let targetExpiry = Date.now() + 3 * 60 * 60 * 1000;
      let passType = "pass_3jam_promo";
      let successMsg = `Selamat ${user.name}! Kode ${cleanCode} berhasil mengaktifkan Pass Gratis 3 Jam untuk akun ${user.email}. Seluruh topik terbuka selama 3 jam!`;

      if (cleanCode === "NATHAVOID") {
        targetExpiry = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
        passType = "pass_lifetime_secret";
        successMsg = `Selamat ${user.name}! Kode Rahasia NATHAVOID berhasil mengaktifkan VIP Lifetime Pass (Permanen) untuk akun ${user.email}. Seluruh topik terbuka selamanya!`;
      } else if (cleanCode === "THANKS4COMING") {
        targetExpiry = Date.now() + 365 * 24 * 60 * 60 * 1000;
        passType = "pass_1tahun_secret";
        successMsg = `Selamat ${user.name}! Kode Rahasia THANKS4COMING berhasil mengaktifkan VIP Pass 1 Tahun untuk akun ${user.email}. Seluruh topik terbuka selama 1 tahun penuh!`;
      }

      try {
        // Send redeem request to backend database bound to this Google email
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: cleanEmail,
            redeemCode: cleanCode,
            isPermanentPremium: cleanCode === "NATHAVOID",
            activePass: {
              type: passType,
              expiresAt: targetExpiry
            }
          }),
        });

        const data = await res.json();
        if (data.success && data.user) {
          const finalExp = data.user.passExpiresAt || targetExpiry;
          if (cleanCode === "NATHAVOID") {
            // Persist permanent VIP flag with email binding — survives Vercel cold starts & browser refreshes
            try {
              localStorage.setItem("obrolan_is_permanent_premium", "true");
              localStorage.setItem("obrolan_permanent_email", cleanEmail);
            } catch (e) {}
          }
          setIsPremium(true, cleanEmail, finalExp);
          try {
            localStorage.setItem(`obrolan_redeemed_${cleanCode}_${cleanEmail}`, "true");
          } catch (e) {}
          return {
            success: true,
            message: successMsg,
          };
        } else {
          // NATHAVOID already redeemed on server: silently restore permanent VIP instead of showing error
          if (cleanCode === "NATHAVOID" && data.alreadyRedeemed) {
            const lifetime = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
            try {
              localStorage.setItem("obrolan_is_permanent_premium", "true");
              localStorage.setItem("obrolan_permanent_email", cleanEmail);
              localStorage.setItem(`obrolan_redeemed_NATHAVOID_${cleanEmail}`, "true");
            } catch (e) {}
            setIsPremium(true, cleanEmail, lifetime);
            return {
              success: true,
              message: `VIP Lifetime Pass berhasil dipulihkan untuk akun ${user.email}. Seluruh topik terbuka selamanya!`
            };
          }
          sound.playClick();
          if (data.alreadyRedeemed) {
            try {
              localStorage.setItem(`obrolan_redeemed_${cleanCode}_${cleanEmail}`, "true");
            } catch (e) {}
          }
          return {
            success: false,
            message: data.message || `Kode promo ${cleanCode} sudah pernah kamu gunakan di akun email ${user.email}. Setiap akun hanya dapat menggunakan 1x.`
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
      message: `Kode promo "${cleanCode}" tidak terdaftar. Periksa kembali kode yang kamu ketik!`,
    };
  };

  const logout = () => {
    sound.playClick();
    const cleanEmail = user?.email?.toLowerCase()?.trim();
    setUser(null);
    setIsPremium(false, cleanEmail);
    try {
      localStorage.removeItem("obrolan_user_session");
      localStorage.removeItem("obrolan_is_premium");
      localStorage.removeItem("obrolan_pass_expires_at");
      localStorage.removeItem("obrolan_is_permanent_premium");
      localStorage.removeItem("obrolan_permanent_email");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isPremium, passExpiresAt, setUserProfile, redeemCode, syncSeenQuestions, getMergedSeenQuestions, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
