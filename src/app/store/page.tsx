"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, Calendar, Crown, ShieldCheck, Sparkles, Loader2, Zap, Timer } from "lucide-react";
import { BrandLogo } from "../components/BrandLogo";
import { useAuth } from "@/context/AuthContext";
import { sound } from "@/utils/sound";

/* Official User Color Palette (Warm Sunset & Deep Teal - Zero Cold White - Zero Emojis) */
const C = {
  teal: "#257180",
  sand: "#F2E5BF",
  linen: "#FAF3E0",
  orange: "#FD8B51",
  rust: "#CB6040",
  muted: "#6B8E94",
};

const PASS_PACKAGES = [
  {
    id: "pass_3jam",
    name: "Pass 3 Jam",
    subtitle: "Akses Penuh 3 Jam",
    price: "Rp 5.000",
    numericPrice: 5000,
    badge: null,
    icon: Zap,
    features: [
      "Akses seluruh 10+ topik obrolan & mode game",
      "Truth or Dare Jarak Jauh (Online)",
      "Main sepuasnya selama 3 jam",
      "Cocok untuk 1x nongkrong santai"
    ],
    border: "#257180",
    bg: "#FAF3E0",
    ctaBg: "#257180",
    ctaText: "#FAF3E0",
  },
  {
    id: "pass_10jam",
    name: "Pass 10 Jam",
    subtitle: "Akses Penuh 10 Jam",
    price: "Rp 10.000",
    numericPrice: 10000,
    badge: "Hemat 50%",
    icon: Timer,
    features: [
      "Akses seluruh 10+ topik obrolan & mode game",
      "Truth or Dare Jarak Jauh (Online)",
      "Main sepuasnya selama 10 jam",
      "Akses Racikan AI Custom Topic"
    ],
    border: "#E0753C",
    bg: "#FAF3E0",
    ctaBg: "#E0753C",
    ctaText: "#FFFFFF",
  },
  {
    id: "pass_1minggu",
    name: "Pass 1 Minggu",
    subtitle: "Akses Penuh 7 Hari",
    price: "Rp 20.000",
    numericPrice: 20000,
    badge: "Pilihan Populer",
    icon: Calendar,
    features: [
      "Akses seluruh 10+ topik obrolan & mode game",
      "Truth or Dare Jarak Jauh (Online)",
      "Bebas main selama 7 hari penuh",
      "Akses Racikan AI Custom Topic"
    ],
    border: "#FD8B51",
    bg: "#FAF3E0",
    ctaBg: "#FD8B51",
    ctaText: "#FFFFFF",
  },
  {
    id: "pass_1bulan",
    name: "Pass 1 Bulan",
    subtitle: "Akses Penuh 30 Hari (VIP)",
    price: "Rp 40.000",
    numericPrice: 40000,
    badge: "Akses Terbaik",
    icon: Crown,
    features: [
      "Akses SELURUH topik & mode game",
      "Truth or Dare Jarak Jauh (Online)",
      "Bebas main tanpa batas 30 hari",
      "Akses Racikan AI Custom Topic"
    ],
    border: "#CB6040",
    bg: "#FAF3E0",
    ctaBg: "#CB6040",
    ctaText: "#FFFFFF",
  },
];

export default function StorePage() {
  const { user, isPremium, setUserProfile } = useAuth();
  const [loadingPkgId, setLoadingPkgId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const status = params.get("status");
      const targetEmail = params.get("email");

      if (status === "success" && (targetEmail || user?.email)) {
        const finalEmail = targetEmail || user?.email || "";
        sound.playChime();
        setSuccessBanner(`✓ Pembayaran Berhasil! Pass VIP Premium kamu telah aktif untuk akun ${finalEmail}!`);

        // Auto activate in server database
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: finalEmail,
            isPermanentPremium: true,
            activePass: {
              type: "doku_pass_paid",
              expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
            }
          }),
        }).then(() => {
          if (user) {
            setUserProfile({ ...user });
          }
        });
      }
    }
  }, [user]);

  const handleCheckout = async (pkg: typeof PASS_PACKAGES[0]) => {
    sound.playClick();
    setCheckoutError(null);

    if (!user || !user.email) {
      setCheckoutError("Silakan Masuk dengan Akun Google terlebih dahulu di pojok kanan atas sebelum membeli pass!");
      return;
    }

    setLoadingPkgId(pkg.id);

    try {
      const res = await fetch("/api/checkout/doku", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passId: pkg.id,
          passName: pkg.name,
          amount: pkg.numericPrice,
          userEmail: user.email,
          userName: user.name,
        }),
      });

      const data = await res.json();

      if (data.success && data.paymentUrl) {
        sound.playChime();
        // Redirect directly to official DOKU Payment Page (QRIS, VA, E-Wallet, CC)
        window.location.href = data.paymentUrl;
      } else {
        setCheckoutError(data.message || "Gagal memproses pembayaran DOKU. Pastikan DOKU_CLIENT_ID & DOKU_SECRET_KEY sudah diisi di Vercel.");
      }
    } catch (e: any) {
      setCheckoutError(e.message || "Terjadi kesalahan koneksi saat memanggil DOKU.");
    } finally {
      setLoadingPkgId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2E5BF] text-[#257180] font-sans pb-12">
      {/* Warm Header */}
      <header className="sticky top-0 z-30 bg-[#FAF3E0]/90 backdrop-blur-md border-b border-[#257180]/15 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/"
              className="w-10 h-10 rounded-xl bg-[#F2E5BF] border border-[#257180]/20 text-[#257180] flex items-center justify-center hover:bg-[#ebdcae] transition cursor-pointer">
              <ArrowLeft className="w-5 h-5" />
            </Link>

            {/* 3 Dynamic Fan Cards Logo */}
            <div className="hidden sm:block">
              <BrandLogo />
            </div>

            <div>
              <h1 className="font-black text-xl text-[#257180] tracking-tight leading-none">Pass ObrolanSeru</h1>
              <p className="text-xs font-bold text-[#257180]/70 mt-1">Pilih durasi pass akses sesuai kebutuhan kumpul kamu</p>
            </div>
          </div>

          <Link href="/play/offline"
            className="px-4 py-2 rounded-xl font-extrabold text-xs text-[#FAF3E0] bg-[#257180] hover:bg-[#1d5966] transition">
            Main Sekarang →
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        
        {/* Banner Section */}
        <div className="bg-[#FAF3E0] rounded-[32px] p-8 border-2 border-[#FD8B51]/30 shadow-lg text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FD8B51]/15 text-[#CB6040] text-xs font-black mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pembayaran Instan via QRIS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#257180] tracking-tight">Pilih Pass Akses Obrolan Kamu</h2>
          <p className="text-xs sm:text-sm font-semibold text-[#257180]/75 max-w-xl mx-auto">
            Pilih pass 3 jam, 10 jam, 1 minggu, atau 1 bulan untuk membuka seluruh topik obrolan sepuasnya!
          </p>
        </div>

        {/* Symmetrical Clean Orange/Yellow VIP Status Active Box */}
        {isPremium && (
          <div className="bg-[#FEF3C7] border-2 border-[#FD8B51] rounded-2xl p-4 max-w-xl mx-auto flex items-center justify-center gap-3 text-center shadow-sm animate-pop-in">
            <div className="w-8 h-8 rounded-xl bg-[#FD8B51] text-white flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div className="text-left sm:text-center">
              <div className="text-sm font-black text-[#CB6040]">Status VIP Aktif</div>
              <div className="text-xs font-bold text-[#257180]/80">Seluruh topik &amp; fitur premium terbuka untuk akun kamu</div>
            </div>
          </div>
        )}

        {successBanner && (
          <div className="bg-green-100 border-2 border-green-400 text-green-800 p-5 rounded-2xl max-w-2xl mx-auto text-xs sm:text-sm font-black text-center shadow-md animate-pop-in">
            {successBanner}
          </div>
        )}

        {checkoutError && (
          <div className="bg-red-100 border-2 border-red-300 text-red-800 p-4 rounded-2xl max-w-2xl mx-auto text-xs font-extrabold text-center animate-pop-in">
            {checkoutError}
          </div>
        )}

        {/* 4 Column Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          {PASS_PACKAGES.map((pkg) => {
            const IconComp = pkg.icon;
            const isLoadingThis = loadingPkgId === pkg.id;

            return (
              <div
                key={pkg.id}
                className="relative rounded-[32px] p-6 border-2 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-lg"
                style={{
                  backgroundColor: pkg.bg,
                  borderColor: pkg.border,
                }}>
                
                {/* Badge if available */}
                {pkg.badge && (
                  <div
                    className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-md uppercase tracking-wider whitespace-nowrap"
                    style={{ backgroundColor: pkg.border }}>
                    {pkg.badge}
                  </div>
                )}

                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-2xl bg-[#257180]/10 flex items-center justify-center flex-shrink-0">
                      <IconComp className="w-5 h-5 text-[#257180]" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-[#257180] leading-tight">{pkg.name}</h3>
                      <p className="text-[11px] font-bold text-[#257180]/65 mt-0.5">{pkg.subtitle}</p>
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="py-2 border-y border-[#257180]/10">
                    <div className="text-2xl font-black text-[#257180]">{pkg.price}</div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2 text-xs font-semibold text-[#257180]/80">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#257180] flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Real Checkout Action Button */}
                <button
                  onClick={() => handleCheckout(pkg)}
                  disabled={isLoadingThis || (isPremium && pkg.id === "pass_1bulan")}
                  className="w-full mt-6 py-3.5 rounded-2xl font-black text-xs transition cursor-pointer shadow-md text-center flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: isPremium && pkg.id === "pass_1bulan" ? "#6B8E94" : pkg.ctaBg,
                    color: isPremium && pkg.id === "pass_1bulan" ? "#FAF3E0" : pkg.ctaText,
                  }}>
                  {isLoadingThis ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Menghubungkan QRIS...</span>
                    </>
                  ) : isPremium && pkg.id === "pass_1bulan" ? (
                    "✓ Pass VIP Aktif"
                  ) : (
                    "Bayar via QRIS →"
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Dedicated Redeem Code Section (OS4FREE) */}
        <StoreRedeemBox />

        {/* Footer Guarantee Info Box */}
        <div className="bg-[#FAF3E0] rounded-2xl p-4 border border-[#257180]/15 text-center text-xs font-bold text-[#257180]/70 max-w-xl mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#257180] flex-shrink-0" />
          <span>Pembayaran aman via DOKU Checkout &amp; QRIS. Pass otomatis terikat ke akun Google kamu seketika.</span>
        </div>
      </main>
    </div>
  );
}

function StoreRedeemBox() {
  const { redeemCode, isPremium } = useAuth();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await redeemCode(code);
    setMsg({ success: res.success, text: res.message });
  };

  return (
    <div className="bg-[#FAF3E0] rounded-2xl p-6 sm:p-7 border-2 border-[#257180]/20 shadow-md max-w-2xl mx-auto space-y-4">
      {/* Symmetrical Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#257180]/10 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-[#257180] tracking-tight">Tukarkan Kode Promo</h3>
            <span className="px-2.5 py-0.5 rounded-md bg-[#257180]/10 text-[#257180] text-[10px] font-black uppercase tracking-wider">
              Voucher
            </span>
          </div>
          <p className="text-xs font-semibold text-[#257180]/75">
            Gunakan kode <strong className="text-[#FD8B51] font-black">OS4FREE</strong> untuk Pass Gratis 3 Jam!
          </p>
        </div>

        {isPremium && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#FEF3C7] border-2 border-[#FD8B51]/40 text-[#CB6040] font-black text-xs shadow-xs flex-shrink-0">
            <Check className="w-4 h-4 text-[#CB6040]" />
            <span>Status VIP Aktif</span>
          </div>
        )}
      </div>

      {/* Symmetrical Form Controls */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Masukkan kode redeem..."
          className="flex-1 px-4 py-3 rounded-xl bg-white border-2 border-[#257180]/20 text-sm font-black tracking-widest text-[#257180] outline-none uppercase placeholder:normal-case placeholder:font-semibold placeholder:tracking-normal placeholder:text-[#257180]/40 focus:border-[#FD8B51] transition"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl font-black text-xs text-white bg-[#FD8B51] hover:bg-[#e0753c] active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5">
          <span>Gunakan Kode</span>
        </button>
      </form>

      {msg && (
        <div className={`p-3 rounded-xl text-xs font-black border ${msg.success ? 'bg-[#FEF3C7] text-[#CB6040] border-[#FD8B51]/30' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {msg.text}
        </div>
      )}
    </div>
  );
}
