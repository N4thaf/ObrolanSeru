"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, PlusCircle, LogIn, Copy, Check, Sparkles, ShieldCheck } from "lucide-react";
import { sound } from "@/utils/sound";
import { BrandLogo } from "@/app/components/BrandLogo";

export default function OnlineRoomSetup() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  
  // Create Room State
  const [hostName, setHostName] = useState("");
  const [selectedMode, setSelectedMode] = useState<'pertanyaan' | 'tod'>('pertanyaan');
  
  // Join Room State
  const [joinCode, setJoinCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostName.trim()) return;
    sound.playClick();

    // Generate random 6-character room code (e.g. OS-882)
    const randomCode = `OS-${Math.floor(100 + Math.random() * 900)}`;
    
    // Store initial host data in room state
    const roomState = {
      code: randomCode,
      host: hostName.trim(),
      mode: selectedMode,
      players: [hostName.trim()],
      status: 'lobby', // 'lobby' | 'playing'
      createdAt: Date.now()
    };

    try {
      sessionStorage.setItem(`room_${randomCode}`, JSON.stringify(roomState));
      sessionStorage.setItem(`my_name`, hostName.trim());
    } catch (err) {}

    router.push(`/play/room/${randomCode}?isHost=true&mode=${selectedMode}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim() || !playerName.trim()) return;
    sound.playClick();

    const formattedCode = joinCode.trim().toUpperCase();

    try {
      sessionStorage.setItem(`my_name`, playerName.trim());
    } catch (err) {}

    router.push(`/play/room/${formattedCode}?name=${encodeURIComponent(playerName.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#F2E5BF] text-[#257180] font-sans flex flex-col justify-between py-6 px-4">
      {/* Header */}
      <header className="w-full max-w-md mx-auto flex items-center justify-between">
        <Link href="/"
          className="w-10 h-10 rounded-xl bg-[#FAF3E0] border border-[#257180]/15 text-[#257180] flex items-center justify-center hover:bg-[#FAF3E0]/80 transition cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="font-black text-lg tracking-tight text-[#257180]">ObrolanSeru Online</span>
        </div>

        <div className="w-10 h-10" />
      </header>

      {/* Main Form Container */}
      <main className="w-full max-w-md mx-auto my-auto animate-pop-in">
        <div className="bg-[#FAF3E0] rounded-[36px] p-6 sm:p-8 border-2 border-[#FD8B51]/30 shadow-2xl space-y-6">
          
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-[#F2E5BF] p-1.5 rounded-2xl border border-[#257180]/15">
            <button
              onClick={() => { sound.playClick(); setActiveTab('create'); }}
              className={`py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'create'
                  ? 'bg-[#257180] text-[#FAF3E0] shadow-md'
                  : 'text-[#257180]/70 hover:text-[#257180]'
              }`}>
              <PlusCircle className="w-4 h-4" />
              <span>Buat Room</span>
            </button>

            <button
              onClick={() => { sound.playClick(); setActiveTab('join'); }}
              className={`py-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeTab === 'join'
                  ? 'bg-[#257180] text-[#FAF3E0] shadow-md'
                  : 'text-[#257180]/70 hover:text-[#257180]'
              }`}>
              <LogIn className="w-4 h-4" />
              <span>Masuk Room</span>
            </button>
          </div>

          {/* CREATE ROOM FORM */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateRoom} className="space-y-5 animate-pop-in">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-[#257180]">Buat Room Baru</h2>
                <p className="text-xs font-semibold text-[#257180]/70">Unduh teman kamu untuk main jarak jauh lewat link atau kode</p>
              </div>

              {/* Host Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#257180] uppercase tracking-wider block">Nama Kamu (Host)</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama kamu..."
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F2E5BF] border-2 border-[#257180]/20 font-bold text-sm text-[#257180] placeholder-[#257180]/40 focus:outline-none focus:border-[#FD8B51] transition"
                />
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#257180] uppercase tracking-wider block">Mode Permainan</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMode('pertanyaan')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      selectedMode === 'pertanyaan'
                        ? 'border-[#FD8B51] bg-[#FD8B51]/10 text-[#CB6040]'
                        : 'border-[#257180]/15 bg-[#F2E5BF]/50 text-[#257180]/70'
                    }`}>
                    <div className="font-black text-xs">Pertanyaan Seru</div>
                    <div className="text-[10px] font-semibold opacity-80 mt-0.5">Topik obrolan pilihan</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedMode('tod')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all ${
                      selectedMode === 'tod'
                        ? 'border-[#FD8B51] bg-[#FD8B51]/10 text-[#CB6040]'
                        : 'border-[#257180]/15 bg-[#F2E5BF]/50 text-[#257180]/70'
                    }`}>
                    <div className="font-black text-xs">Truth or Dare</div>
                    <div className="text-[10px] font-semibold opacity-80 mt-0.5">Spin Roda Tantangan</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-black text-base text-white shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
                Buat Room &amp; Dapatkan Kode →
              </button>
            </form>
          )}

          {/* JOIN ROOM FORM */}
          {activeTab === 'join' && (
            <form onSubmit={handleJoinRoom} className="space-y-5 animate-pop-in">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-[#257180]">Masuk Kode Room</h2>
                <p className="text-xs font-semibold text-[#257180]/70">Masukkan kode room dari teman kamu untuk bergabung</p>
              </div>

              {/* Room Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#257180] uppercase tracking-wider block">Kode Room (Contoh: OS-882)</label>
                <input
                  type="text"
                  required
                  placeholder="OS-882"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F2E5BF] border-2 border-[#257180]/20 font-black text-center text-lg uppercase tracking-widest text-[#257180] placeholder-[#257180]/30 focus:outline-none focus:border-[#FD8B51] transition"
                />
              </div>

              {/* Player Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-black text-[#257180] uppercase tracking-wider block">Nama Kamu</label>
                <input
                  type="text"
                  required
                  placeholder="Masukkan nama kamu..."
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#F2E5BF] border-2 border-[#257180]/20 font-bold text-sm text-[#257180] placeholder-[#257180]/40 focus:outline-none focus:border-[#FD8B51] transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-black text-base text-white shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                style={{ background: "linear-gradient(135deg, #257180 0%, #1d5966 100%)" }}>
                Gabung ke Room →
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer Info */}
      <footer className="text-center text-xs font-bold text-[#257180]/60 max-w-md mx-auto">
        <ShieldCheck className="w-4 h-4 inline-block -mt-0.5 mr-1" />
        <span>Koneksi Real-Time aman tanpa perlu instal aplikasi tambahan</span>
      </footer>
    </div>
  );
}
