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
  loginWithGoogle: (mockProfile?: Partial<UserProfile>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  loginWithGoogle: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load existing session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("obrolan_user_session");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to load user session:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = (mockProfile?: Partial<UserProfile>) => {
    sound.playChime();
    const newUser: UserProfile = {
      id: mockProfile?.id || `google_${Date.now()}`,
      name: mockProfile?.name || "Nathaf Pratama",
      email: mockProfile?.email || "nathaf@gmail.com",
      avatar: mockProfile?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      provider: "google",
    };

    setUser(newUser);
    try {
      localStorage.setItem("obrolan_user_session", JSON.stringify(newUser));
      sessionStorage.setItem("my_name", newUser.name.split(" ")[0]);
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
    <AuthContext.Provider value={{ user, isLoading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
