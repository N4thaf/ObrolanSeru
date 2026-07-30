"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const C = { bg:"#FCF9EA",teal:"#7FC9C3",tealDk:"#5aada6",peach:"#FF8A80",peachDk:"#e06060",text:"#1a1a1a",muted:"#999" };

function Navbar({ onBack }: { onBack: () => void }) {
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b"
      style={{ borderColor:"#e06060", background:C.peach }}>
      <button onClick={onBack} className="p-1.5 rounded-xl hover:bg-black/10 transition">
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
      <div className="flex items-center gap-2">
        <div className="relative w-7 h-7">
          <div className="absolute inset-0 rounded-lg bg-white/25" style={{ transform:"rotate(-10deg)" }} />
          <div className="absolute inset-0 rounded-lg flex items-center justify-center font-black text-white bg-white/15" style={{ transform:"rotate(4deg)" }}>O</div>
        </div>
        <span className="font-black text-base text-white">ObrolanSeru</span>
      </div>
      <div className="w-8" />
    </nav>
  );
}

export default function CreateRoom() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedMode, setSelectedMode] = useState<'pertanyaan'|'tod'|null>(null);
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string|null>(null);
  const [copied, setCopied] = useState(false);

  const canStart = name.trim().length > 0 && selectedMode !== null;

  const handleCreate = () => {
    if (!canStart) return;
    setLoading(true);
    setTimeout(() => {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      setRoomCode(code);
      setLoading(false);
    }, 700);
  };

  const copyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartGame = () => {
    router.push(`/play/offline?mode=${selectedMode}&src=online`);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background:C.bg, fontFamily:"Nunito,sans-serif" }}>
      <Navbar onBack={() => router.push('/')} />

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full px-6 py-8">

        {!roomCode ? (
          /* ── Create form ─────────────────────────────────────────────── */
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black" style={{ color:C.text }}>Buat Room Baru</h2>
              <p className="text-sm mt-1" style={{ color:C.muted }}>Buat room, bagikan kode ke teman</p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-extrabold mb-2 uppercase tracking-wider" style={{ color:C.muted }}>Nama kamu (Host)</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)}
                placeholder="Masukkan nama..." maxLength={20}
                className="w-full bg-white border-2 rounded-2xl px-5 py-3.5 font-bold text-base outline-none transition"
                style={{ borderColor:"#ede9c8", color:C.text }}
                onFocus={e=>e.target.style.borderColor=C.teal}
                onBlur={e=>e.target.style.borderColor="#ede9c8"} />
            </div>

            {/* Mode */}
            <div>
              <label className="block text-xs font-extrabold mb-3 uppercase tracking-wider" style={{ color:C.muted }}>Mode Permainan</label>
              <div className="flex flex-col gap-3">
                {[
                  { id:'pertanyaan' as const, emoji:'💬', name:'Pertanyaan Seru', desc:'Topik & pertanyaan untuk deep talk', accent:C.teal },
                  { id:'tod' as const, emoji:'🎡', name:'Truth or Dare', desc:'Spin roda, Truth atau Dare', accent:C.peach },
                ].map(m => (
                  <button key={m.id} onClick={()=>setSelectedMode(m.id)}
                    className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:bg-white"
                    style={{
                      borderColor: selectedMode===m.id ? m.accent : "#ede9c8",
                      background: selectedMode===m.id ? `${m.accent}18` : "rgba(255,255,255,0.6)",
                      boxShadow: selectedMode===m.id ? `0 3px 0 ${m.accent}` : "0 2px 0 #ede9c8",
                    }}>
                    <span className="text-2xl">{m.emoji}</span>
                    <div className="flex-1">
                      <div className="font-extrabold text-sm" style={{ color:C.text }}>{m.name}</div>
                      <div className="text-xs mt-0.5" style={{ color:C.muted }}>{m.desc}</div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor:selectedMode===m.id?m.accent:"#ddd", background:selectedMode===m.id?m.accent:"white" }}>
                      {selectedMode===m.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCreate} disabled={!canStart||loading}
              className="w-full py-4 rounded-2xl font-extrabold text-base text-white transition-all"
              style={canStart&&!loading?{ background:C.peach, boxShadow:`0 5px 0 ${C.peachDk}` }:{ background:"#ddd", cursor:"not-allowed" }}>
              {loading ? 'Membuat room...' : 'Buat Room'}
            </button>
          </div>
        ) : (
          /* ── Room lobby ──────────────────────────────────────────────── */
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-black mb-1" style={{ color:C.text }}>Room siap! 🎉</h2>
              <p className="text-sm" style={{ color:C.muted }}>Bagikan kode ini ke teman-temanmu</p>
            </div>

            {/* Code display */}
            <div className="rounded-3xl p-8 text-center border-2" style={{ background:C.teal, borderColor:C.tealDk, boxShadow:`0 6px 0 ${C.tealDk}` }}>
              <div className="text-xs font-extrabold tracking-widest text-white/70 mb-3 uppercase">Kode Room</div>
              <div className="text-5xl font-black tracking-[0.2em] text-white drop-shadow mb-4">{roomCode}</div>
              <button onClick={copyCode}
                className="px-6 py-2.5 rounded-full font-extrabold text-sm transition-all"
                style={{ background:"rgba(255,255,255,0.9)", color:C.tealDk, boxShadow:"0 2px 0 rgba(0,0,0,0.1)" }}>
                {copied ? '✓ Tersalin!' : 'Salin Kode'}
              </button>
            </div>

            {/* Host info */}
            <div className="p-4 rounded-2xl border-2 bg-white/60" style={{ borderColor:"#ede9c8" }}>
              <div className="flex justify-between text-sm">
                <span style={{ color:C.muted }}>Host</span>
                <span className="font-extrabold" style={{ color:C.text }}>{name} 👑</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span style={{ color:C.muted }}>Mode</span>
                <span className="font-extrabold" style={{ color:C.text }}>{selectedMode==='tod'?'Truth or Dare':'Pertanyaan Seru'}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={handleStartGame}
                className="w-full py-4 rounded-2xl font-extrabold text-base text-white transition-all"
                style={{ background:C.peach, boxShadow:`0 5px 0 ${C.peachDk}` }}>
                Mulai Permainan
              </button>
              <p className="text-center text-xs" style={{ color:C.muted }}>
                * Mode online real-time segera hadir. Saat ini permainan berjalan lokal.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
