"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Users, ShoppingBag, X, Coins, ShieldCheck, Check, Crown, HelpCircle, Share2, LogOut, User, FileText, Info, BookOpen, Lock, MessageSquare } from "lucide-react";
import { BrandLogo } from "./components/BrandLogo";
import { GoogleAuthButton } from "./components/GoogleAuthButton";
import { LockedFeatureModal } from "./components/LockedFeatureModal";
import { useAuth } from "@/context/AuthContext";

/* Official User Color Palette */
const C = {
  teal: "#257180",
  sand: "#F2E5BF",
  linen: "#FAF3E0",
  orange: "#FD8B51",
  rust: "#CB6040",
  muted: "#6B8E94",
};

interface UserAccount {
  name: string;
  email: string;
  avatar?: string;
  plan: 'Gratis' | 'Premium';
}

export default function Home() {
  const { isPremium } = useAuth();
  const [showOnline, setShowOnline] = useState(false);
  const [showAccountBenefits, setShowAccountBenefits] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [activeFooterModal, setActiveFooterModal] = useState<'about' | 'howToPlay' | 'privacy' | 'terms' | 'help' | null>(null);
  const [user, setUser] = useState<UserAccount | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("obrolan_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const handleGoogleLogin = () => {
    const newUser: UserAccount = {
      name: "Pemain Obrolan",
      email: "pemain@gmail.com",
      plan: "Gratis"
    };
    setUser(newUser);
    try {
      localStorage.setItem("obrolan_user", JSON.stringify(newUser));
    } catch (e) {}
    setShowGoogleModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("obrolan_user");
    } catch (e) {}
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between relative bg-[#F2E5BF] text-[#257180] font-sans select-none">
      
      {/* Clean Un-cluttered Navbar Header */}
      <header className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 z-20">
        <div className="bg-[#FAF3E0] border-2 border-[#257180]/15 rounded-full px-5 py-2.5 shadow-sm flex items-center justify-between">
          
          {/* Logo & Brand (3 Dynamic Fan Cards Logo) */}
          <Link href="/" className="flex items-center gap-3 group">
            <BrandLogo />
            <span className="font-extrabold text-xl tracking-tight text-[#257180] hidden sm:inline group-hover:text-[#FD8B51] transition-colors">ObrolanSeru</span>
          </Link>

          {/* User Status Bar & Toko */}
          <div className="flex items-center gap-2 sm:gap-3">
            <GoogleAuthButton />

            {/* Mode Status Indicator Badge */}
            {isPremium ? (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                <Crown className="w-3.5 h-3.5 text-amber-600" />
                <span>VIP Premium</span>
              </span>
            ) : (
              <button
                onClick={() => setShowRedeemModal(true)}
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-[#257180]/10 text-[#257180] border border-[#257180]/20 hover:bg-[#257180]/20 transition cursor-pointer">
                <Lock className="w-3 h-3 text-[#257180]" />
                <span>Mode: Gratis</span>
              </button>
            )}

            {/* Toko Pass Button */}
            <Link href="/store" className="flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-[#FD8B51] text-white hover:bg-[#e0753c] transition shadow-sm">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli Pass</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center my-auto z-10">
        
        {/* Left Column: Headline & Call To Action */}
        <div className="space-y-5 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#257180] leading-[1.15]">
            Ubah Suasana Kumpul Jadi{" "}
            <span className="relative inline-block text-[#FD8B51] pb-2">
              Lebih Seru
              <svg className="absolute left-0 -bottom-1 w-full h-3.5 text-[#FD8B51]/60 pointer-events-none" viewBox="0 0 100 16" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                <path d="M 0 8 Q 12.5 1, 25 8 T 50 8 T 75 8 T 100 8" />
              </svg>
            </span>
          </h1>

          <p className="text-sm sm:text-base font-medium leading-relaxed text-[#257180]/80 max-w-md">
            Kartu pertanyaan pilihan untuk ice breaking, kenalan, deep talk, atau sekadar pencair suasana bareng teman dan keluarga.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start">
            <Link href="/play/offline"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-sm text-center flex items-center justify-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              <span>Main Offline</span>
            </Link>

            <Link href="/play/online"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm text-[#257180] bg-[#FAF3E0] border border-[#257180]/20 hover:bg-[#f2e6cb] transition shadow-sm text-center flex items-center justify-center gap-2 cursor-pointer">
              <Users className="w-4 h-4 text-[#257180]" />
              <span>Main Online (Room Code)</span>
            </Link>
          </div>
        </div>

        {/* 3 Stacked Animated Floating Hero Cards */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-80 h-96 flex items-center justify-center">
            {/* Back Card 1 — Deep Teal (Left Fan) */}
            <div className="card-anim-1 absolute">
              <div className="w-48 h-68 rounded-[24px] bg-[#257180] border-2 border-[#FAF3E0] shadow-xl flex flex-col items-center justify-between p-4">
                <div className="w-full flex justify-between text-xs font-black text-[#FAF3E0]/50">
                  <span>♥</span><span>♠</span>
                </div>
                <span className="text-5xl font-black text-[#FAF3E0] drop-shadow-md">?</span>
                <div className="w-full flex justify-between text-xs font-black text-[#FAF3E0]/50">
                  <span>♦</span><span>♣</span>
                </div>
              </div>
            </div>

            {/* Back Card 2 — Terracotta Rust (Right Fan) */}
            <div className="card-anim-2 absolute">
              <div className="w-48 h-68 rounded-[24px] bg-[#CB6040] border-2 border-[#FAF3E0] shadow-xl flex flex-col items-center justify-between p-4">
                <div className="w-full flex justify-between text-xs font-black text-[#FAF3E0]/50">
                  <span>♥</span><span>♠</span>
                </div>
                <span className="text-5xl font-black text-[#FAF3E0] drop-shadow-md">♥</span>
                <div className="w-full flex justify-between text-xs font-black text-[#FAF3E0]/50">
                  <span>♦</span><span>♣</span>
                </div>
              </div>
            </div>

            {/* Front Card 3 — Vibrant Sunset Orange (Center Spotlight with Clean OS Monogram) */}
            <div className="card-anim-3 absolute z-10">
              <div className="w-52 h-72 rounded-[28px] bg-gradient-to-br from-[#FD8B51] to-[#CB6040] border-4 border-[#FAF3E0] shadow-2xl flex flex-col items-center justify-between p-5">
                <div className="w-full flex justify-between text-xs font-black text-white/60">
                  <span>♥</span><span>♠</span>
                </div>
                
                {/* Pure Sleek "O" and "S" Monogram Emblem (No Crown, Clean & Bold) */}
                <div className="flex items-center justify-center my-auto">
                  <span className="text-6xl font-black tracking-widest text-[#FAF3E0] drop-shadow-lg select-none font-serif italic">
                    OS
                  </span>
                </div>

                <div className="w-full flex justify-between text-xs font-black text-white/60">
                  <span>♦</span><span>♣</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL 1: Google Login (Clean, No Google SVG Logo) */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/50 backdrop-blur-md">
          <div className="bg-[#FAF3E0] rounded-[32px] p-7 sm:p-8 max-w-sm w-full border-2 border-[#257180]/30 shadow-2xl text-center space-y-6 animate-pop-in relative">
            <button onClick={() => setShowGoogleModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#257180]/10 transition text-[#257180]">
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#F2E5BF] border-2 border-[#257180]/20 flex items-center justify-center mx-auto shadow-sm text-[#257180]">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-[#257180]">Masuk Akun</h3>
              <p className="text-xs font-semibold text-[#257180]/70">
                Simpan akun, koin, dan status berlangganan kamu secara aman.
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full py-4 rounded-2xl font-black text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <span>Lanjutkan dengan Google</span>
            </button>

            <p className="text-[11px] font-bold text-[#257180]/50">
              Dengan melanjutkan, kamu menyetujui Syarat &amp; Ketentuan ObrolanSeru.
            </p>
          </div>
        </div>
      )}

      {/* MODAL 2: Account Benefits & User Profile */}
      {showAccountBenefits && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/50 backdrop-blur-md">
          <div className="bg-[#FAF3E0] rounded-[32px] p-7 sm:p-8 max-w-lg w-full border-2 border-[#FD8B51]/40 shadow-2xl space-y-6 animate-pop-in relative">
            <button onClick={() => setShowAccountBenefits(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#257180]/10 transition text-[#257180]">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#257180]/15 text-[#257180] text-xs font-black">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Informasi Akun</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#257180]">
                {user ? `Halo, ${user.name}!` : 'Benefit Status Akun'}
              </h3>
              {user && <p className="text-xs font-semibold text-[#257180]/70">{user.email}</p>}
            </div>

            {/* Comparison Grid (100% Mathematically Aligned Headers & Divider Lines) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {/* Card 1: Akun Gratis */}
              <div className="p-5 rounded-2xl bg-[#F2E5BF]/70 border border-[#257180]/20 flex flex-col justify-between">
                <div>
                  <div className="h-10 flex items-center justify-between gap-2 border-b border-[#257180]/15 pb-2.5">
                    <span className="font-black text-xs sm:text-sm text-[#257180] leading-tight">Akun Gratis</span>
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#257180]/15 text-[#257180] whitespace-nowrap flex-shrink-0">
                      {user?.plan === 'Gratis' || !user ? 'Status Saat Ini' : 'Dasar'}
                    </span>
                  </div>
                  <ul className="space-y-2.5 text-xs font-bold text-[#257180]/80 pt-3">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FD8B51] flex-shrink-0 mt-0.5 stroke-[3]" />
                      <span>Akses 9+ topik obrolan (5 koin / sesi)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FD8B51] flex-shrink-0 mt-0.5 stroke-[3]" />
                      <span>Mode Truth or Dare Tatap Muka (Jarak Dekat)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#FD8B51] flex-shrink-0 mt-0.5 stroke-[3]" />
                      <span>AI Question Generator otomatis</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Card 2: Premium Subscriber */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FD8B51]/15 to-[#CB6040]/15 border-2 border-[#CB6040] flex flex-col justify-between">
                <div>
                  <div className="h-10 flex items-center justify-between gap-2 border-b border-[#CB6040]/20 pb-2.5">
                    <span className="font-black text-xs sm:text-sm text-[#CB6040] leading-tight">Premium Subscriber</span>
                    <Crown className="w-4 h-4 text-[#CB6040] flex-shrink-0" />
                  </div>
                  <ul className="space-y-2.5 text-xs font-bold text-[#257180]/90 pt-3">
                    <li className="flex items-start gap-2">
                      <Crown className="w-3.5 h-3.5 text-[#CB6040] flex-shrink-0 mt-0.5" />
                      <span>Buka SELURUH topik tanpa perlu koin per sesi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Crown className="w-3.5 h-3.5 text-[#CB6040] flex-shrink-0 mt-0.5" />
                      <span>Akses Truth or Dare Jarak Jauh (Online Remote)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Crown className="w-3.5 h-3.5 text-[#CB6040] flex-shrink-0 mt-0.5" />
                      <span>Bebas main tanpa batas selama 30 hari</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {!user ? (
                <button
                  onClick={() => { setShowAccountBenefits(false); setShowGoogleModal(true); }}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-center text-[#257180] bg-[#F2E5BF] border-2 border-[#257180]/30 hover:bg-[#ebdcae] transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
                  <User className="w-4 h-4 text-[#257180]" />
                  <span>Masuk dengan Google</span>
                </button>
              ) : null}

              <Link href="/store" onClick={() => setShowAccountBenefits(false)}
                className="block w-full py-4 rounded-2xl font-black text-sm text-center text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-md">
                Upgrade Ke Premium (Rp 50.000 / bln) →
              </Link>

              {user && (
                <button
                  onClick={() => { handleLogout(); setShowAccountBenefits(false); }}
                  className="flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-[#CB6040] hover:underline cursor-pointer">
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Keluar dari Akun Google</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Online Modal */}
      {showOnline && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/40 backdrop-blur-sm">
          <div className="bg-[#FAF3E0] rounded-3xl p-6 sm:p-8 max-w-sm w-full border-2 border-[#FD8B51]/30 shadow-2xl text-center space-y-4 animate-pop-in relative">
            <button onClick={() => setShowOnline(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#257180]/10 transition text-[#257180]">
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#FD8B51]/20 text-[#FD8B51] flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-[#257180]">Mode Online Segera Hadir!</h3>
            <p className="text-xs font-medium text-[#257180]/80 leading-relaxed">
              Fitur main online dengan teman jarak jauh sedang dalam tahap pengembangan. Yuk coba mode offline dulu bareng teman di samping kamu!
            </p>
            <Link href="/play/offline" onClick={() => setShowOnline(false)}
              className="block w-full py-3 rounded-xl font-extrabold text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-sm">
              Main Offline Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* MODAL 4: Dynamic Functional Modals for Footer Links */}
      {activeFooterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/50 backdrop-blur-md">
          <div className="bg-[#FAF3E0] rounded-[32px] p-7 sm:p-8 max-w-lg w-full border-2 border-[#FD8B51]/40 shadow-2xl space-y-5 animate-pop-in relative max-h-[85vh] overflow-y-auto">
            <button onClick={() => setActiveFooterModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#257180]/10 transition text-[#257180]">
              <X className="w-5 h-5" />
            </button>

            {activeFooterModal === 'about' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#257180]/10 text-[#257180] flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#257180]">Tentang ObrolanSeru</h3>
                    <p className="text-xs font-semibold text-[#257180]/70">Platform Kartu Obrolan &amp; Ice Breaking Interaktif</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs font-bold text-[#257180]/85 leading-relaxed bg-[#F2E5BF]/60 p-4 rounded-2xl border border-[#257180]/15">
                  <p>
                    <strong>ObrolanSeru</strong> dirancang untuk mencairkan suasana dan menghidupkan percakapan saat kumpul bersama teman, pasangan, maupun keluarga.
                  </p>
                  <p>
                    Dengan puluhan topik obrolan serta mode Truth or Dare yang didukung mesin AI Generator, percakapan kamu dijamin selalu segar dan tanpa batas!
                  </p>
                </div>
              </div>
            )}

            {activeFooterModal === 'howToPlay' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FD8B51]/15 text-[#FD8B51] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#257180]">Cara Bermain</h3>
                    <p className="text-xs font-semibold text-[#257180]/70">Panduan Praktis Bermain ObrolanSeru</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-xs font-bold text-[#257180]/85 leading-relaxed bg-[#F2E5BF]/60 p-4 rounded-2xl border border-[#257180]/15">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#257180] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">1</span>
                    <span>Pilih mode permainan: <strong>Pertanyaan Seru</strong> atau <strong>Truth or Dare</strong>.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#257180] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">2</span>
                    <span>Masukkan nama pemain dan tentukan jumlah ronde permainan.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#257180] text-white flex items-center justify-center text-[10px] font-black flex-shrink-0">3</span>
                    <span>Buka kartu fisik di meja atau putar Roda Spin untuk memilih giliran tantangan!</span>
                  </div>
                </div>
              </div>
            )}

            {activeFooterModal === 'privacy' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#CB6040]/15 text-[#CB6040] flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#257180]">Kebijakan Privasi</h3>
                    <p className="text-xs font-semibold text-[#257180]/70">Perlindungan Data &amp; Kerahasiaan Pengguna</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs font-bold text-[#257180]/85 leading-relaxed bg-[#F2E5BF]/60 p-4 rounded-2xl border border-[#257180]/15">
                  <p>
                    Kami di <strong>ObrolanSeru</strong> sangat menghormati privasi Anda. Data sesi permainan dan nama pemain disimpan secara aman di browser lokal Anda.
                  </p>
                  <p>
                    Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga mana pun.
                  </p>
                </div>
              </div>
            )}

            {activeFooterModal === 'terms' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#257180]/15 text-[#257180] flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#257180]">Syarat &amp; Ketentuan</h3>
                    <p className="text-xs font-semibold text-[#257180]/70">Ketentuan Penggunaan Layanan</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs font-bold text-[#257180]/85 leading-relaxed bg-[#F2E5BF]/60 p-4 rounded-2xl border border-[#257180]/15">
                  <p>
                    Dengan menggunakan ObrolanSeru, Anda menyetujui untuk saling menghormati antar sesama pemain saat menjawab pertanyaan atau menjalankan tantangan.
                  </p>
                  <p>
                    Penggunaan koin dan paket berlangganan berlaku sesuai dengan ketentuan toko yang tertera.
                  </p>
                </div>
              </div>
            )}

            {activeFooterModal === 'help' && (
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FD8B51]/15 text-[#FD8B51] flex items-center justify-center">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#257180]">Bantuan &amp; Dukungan</h3>
                    <p className="text-xs font-semibold text-[#257180]/70">Pusat Bantuan ObrolanSeru</p>
                  </div>
                </div>
                <div className="space-y-3 text-xs font-bold text-[#257180]/85 leading-relaxed bg-[#F2E5BF]/60 p-4 rounded-2xl border border-[#257180]/15">
                  <p>
                    Punya pertanyaan, kendala, atau saran topik baru?
                  </p>
                  <p>
                    Hubungi tim dukungan kami melalui email di <strong>support@obrolanseru.com</strong> atau via DM Instagram resmi kami.
                  </p>
                </div>
              </div>
            )}

            <button onClick={() => setActiveFooterModal(null)}
              className="w-full py-3 rounded-2xl font-black text-sm text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] transition shadow-sm cursor-pointer">
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Custom Unique Clean Footer */}
      <footer className="w-full max-w-5xl mx-auto px-6 py-4 border-t border-[#257180]/15 relative z-20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-bold text-[#257180]/70">
        
        {/* Left: Copyright & Functional Navigation */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
          <span className="font-black text-[#257180]">© 2026 ObrolanSeru.</span>
          <span className="text-[#257180]/30">•</span>
          <button onClick={() => setActiveFooterModal('about')} className="hover:text-[#257180] transition cursor-pointer">Tentang Kami</button>
          <span className="text-[#257180]/30">•</span>
          <button onClick={() => setActiveFooterModal('howToPlay')} className="hover:text-[#257180] transition cursor-pointer">Cara Bermain</button>
          <span className="text-[#257180]/30">•</span>
          <button onClick={() => setActiveFooterModal('privacy')} className="hover:text-[#257180] transition cursor-pointer">Kebijakan Privasi</button>
          <span className="text-[#257180]/30">•</span>
          <button onClick={() => setActiveFooterModal('terms')} className="hover:text-[#257180] transition cursor-pointer">Syarat &amp; Ketentuan</button>
        </div>

        {/* Right: Interactive Action Icons */}
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveFooterModal('help')} title="Bantuan & Dukungan"
            className="w-8 h-8 rounded-full bg-[#FAF3E0] border border-[#257180]/20 flex items-center justify-center hover:bg-[#257180] hover:text-[#FAF3E0] transition cursor-pointer">
            <HelpCircle className="w-4 h-4" />
          </button>
          
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram ObrolanSeru"
            className="w-8 h-8 rounded-full bg-[#FAF3E0] border border-[#257180]/20 flex items-center justify-center hover:bg-[#257180] hover:text-[#FAF3E0] transition cursor-pointer">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <button onClick={handleShare} title="Bagikan Web Ini"
            className="w-8 h-8 rounded-full bg-[#FAF3E0] border border-[#257180]/20 flex items-center justify-center hover:bg-[#FD8B51] hover:text-white transition cursor-pointer relative">
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -top-8 right-0 px-2 py-0.5 rounded bg-[#257180] text-white text-[10px] font-black whitespace-nowrap animate-pop-in">
                Link Disalin!
              </span>
            )}
          </button>
        </div>
      </footer>

      {/* Redeem Promo Code Modal */}
      <LockedFeatureModal
        isOpen={showRedeemModal}
        onClose={() => setShowRedeemModal(false)}
      />

    </div>
  );
}
