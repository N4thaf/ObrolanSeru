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
  setUserProfile: (profile: UserProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUserProfile: () => {},
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session on mount (and purge dummy data)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("obrolan_user_session");
      if (stored) {
        const parsed: UserProfile = JSON.parse(stored);
        // Purge old dummy mock data if present
        if (parsed.email === "nathaf@gmail.com" || parsed.email === "pemain@gmail.com") {
          localStorage.removeItem("obrolan_user_session");
          setUser(null);
        } else {
          setUser(parsed);
        }
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
      await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
    } catch (e) {}
  };

  const logout = () => {
    sound.playClick();
    setUser(null);
    try {
      localStorage.removeItem("obrolan_user_session");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUserProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
