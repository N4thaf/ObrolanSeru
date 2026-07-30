"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const C = { bg:"#FCF9EA",teal:"#BADFDB",peach:"#FFA4A4",pink:"#FFBDBD",text:"#3D3D3D",muted:"#888888" };

export default function JoinRoom() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const canJoin = code.length >= 6 && name.trim().length > 0;

  return (
    <div className="min-h-screen" style={{ background: C.bg, fontFamily: "Nunito, sans-serif" }}>
      <header className="flex items-center gap-3 px-5 py-3.5 bg-white/50 border-b" style={{ background: "#FFA4A4", borderColor: "#e88080" }}>
        <Link href="/" className="p-2 rounded-xl hover:bg-black/5 transition">
          <ArrowLeft className="w-5 h-5" style={{ color: C.muted }} />
        </Link>
        <div>
          <h1 className="font-extrabold text-base" style={{ color: C.text }}>Gabung Room 🔑</h1>
          <p className="text-xs" style={{ color: C.muted }}>Masuk pakai kode dari teman</p>
        </div>
      </header>

      <div className="max-w-sm mx-auto px-5 py-8 space-y-5">
        <div className="bg-white/70 rounded-2xl p-5 border-2 space-y-4" style={{ background: "#FFA4A4", borderColor: "#e88080" }}>

          <div>
            <label className="block text-xs font-extrabold mb-2" style={{ color: C.text }}>Nama Kamu 👤</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Misal: Budi" maxLength={20}
              className="w-full bg-white border-2 rounded-xl px-4 py-2.5 font-bold text-sm outline-none transition"
              style={{ borderColor: "#ede9c8", color: C.text }}
              onFocus={e => e.target.style.borderColor = C.teal}
              onBlur={e => e.target.style.borderColor = "#ede9c8"} />
          </div>

          <div>
            <label className="block text-xs font-extrabold mb-2" style={{ color: C.text }}>Kode Room 🔐</label>
            <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="AB1C2D" maxLength={6}
              className="w-full bg-white border-2 rounded-xl px-4 py-3 font-black text-xl tracking-[0.3em] text-center outline-none transition"
              style={{ borderColor: "#ede9c8", color: C.peach }}
              onFocus={e => e.target.style.borderColor = C.teal}
              onBlur={e => e.target.style.borderColor = "#ede9c8"} />
            <p className="text-xs text-center mt-2" style={{ color: C.muted }}>6 karakter dari teman yang buat room</p>
          </div>
        </div>

        <button
          onClick={() => { if (canJoin) router.push(`/room/${code}?name=${encodeURIComponent(name)}&mode=pertanyaan`); }}
          disabled={!canJoin}
          className="w-full py-3.5 rounded-2xl font-extrabold text-sm text-white transition-all"
          style={canJoin ? { background: C.peach, boxShadow: "0 4px 0 #e88080" } : { background: "#ddd", cursor: "not-allowed" }}>
          Masuk Room 🚀
        </button>
      </div>
    </div>
  );
}
