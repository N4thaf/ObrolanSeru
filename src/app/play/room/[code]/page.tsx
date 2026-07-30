"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Users, Play, Share2, Sparkles, RefreshCw, Crown } from "lucide-react";
import { sound } from "@/utils/sound";
import { BrandLogo } from "@/app/components/BrandLogo";

interface RoomState {
  code: string;
  host: string;
  mode: 'pertanyaan' | 'tod';
  topic: string;
  rounds: number;
  players: string[];
  status: 'lobby' | 'playing';
}

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawCode = (params.code as string) || "OS361";
  const code = rawCode.replace(/-/g, "").toUpperCase();
  const isHostParam = searchParams.get("isHost") === "true";
  const nameParam = searchParams.get("name") || "";
  const initialMode = (searchParams.get("mode") as 'pertanyaan' | 'tod') || 'pertanyaan';

  const [copied, setCopied] = useState(false);
  const [myName, setMyName] = useState<string>("");
  const [room, setRoom] = useState<RoomState>({
    code,
    host: isHostParam ? (nameParam || "Host") : "Host",
    mode: initialMode,
    topic: "kenalan",
    rounds: 3,
    players: [],
    status: "lobby",
  });

  // Initialize player & sync with /api/room & BroadcastChannel
  useEffect(() => {
    let savedName = nameParam;
    try {
      if (!savedName) savedName = sessionStorage.getItem("my_name") || "Pemain";
    } catch (e) {}

    setMyName(savedName);

    // Sync player with API serverless store
    const syncRoomApi = async () => {
      try {
        const res = await fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            host: isHostParam ? savedName : undefined,
            mode: initialMode,
            players: [savedName]
          })
        });
        const data = await res.json();
        if (data.success && data.room) {
          setRoom(data.room);
          if (data.room.status === 'playing') {
            sound.playChime();
          }
        }
      } catch (e) {}
    };

    syncRoomApi();

    // Poll /api/room every 1.2s for cross-device live sync
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${code}`);
        const data = await res.json();
        if (data.success && data.room) {
          setRoom(prev => {
            if (prev.status !== 'playing' && data.room.status === 'playing') {
              sound.playChime();
              const playersQuery = data.room.players.join(",");
              router.push(`/play/game?mode=${data.room.mode}&topic=${data.room.topic}&rounds=${data.room.rounds}&players=${encodeURIComponent(playersQuery)}&roomCode=${code}`);
            }
            return data.room;
          });
        }
      } catch (e) {}
    }, 1200);

    return () => {
      clearInterval(interval);
    };
  }, [code, isHostParam, nameParam, initialMode, router]);

  const broadcastRoomUpdate = async (updatedRoom: RoomState) => {
    setRoom(updatedRoom);
    try {
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom)
      });
    } catch (e) {}
  };

  const handleCopyLink = () => {
    sound.playClick();
    const shareUrl = `${window.location.origin}/play/room/${code}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    sound.playClick();
    const shareUrl = `${window.location.origin}/play/room/${code}`;
    const text = `Yuk main ObrolanSeru bareng! Masuk ke room kode: *${code}* di link ini: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleStartGame = () => {
    sound.playChime();
    const initialDismissed = new Array(room.players.length).fill(false);
    const updated: RoomState = { ...room, status: "playing" };

    // Broadcast room start AND reset clean game state
    fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...updated,
        gameState: {
          activeModalIndex: null,
          dismissed: initialDismissed,
          activePlayerIndex: 0,
          todPhase: 'spin',
          landedIndex: null,
          chosenType: null,
          todContent: ''
        }
      })
    });

    setRoom(updated);

    // Redirect to actual game board with room sync params
    const playersQuery = updated.players.join(",");
    router.push(`/play/game?mode=${updated.mode}&topic=${updated.topic}&rounds=${updated.rounds}&players=${encodeURIComponent(playersQuery)}&roomCode=${code}`);
  };

  const isHost = room.host === myName || isHostParam;

  return (
    <div className="min-h-screen bg-[#F2E5BF] text-[#257180] font-sans flex flex-col justify-between p-4 sm:p-6 overflow-x-hidden">
      {/* Header */}
      <header className="w-full max-w-xl mx-auto flex items-center justify-between">
        <Link href="/play/online"
          className="w-10 h-10 rounded-xl bg-[#FAF3E0] border border-[#257180]/15 text-[#257180] flex items-center justify-center hover:bg-[#FAF3E0]/80 transition cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="flex items-center gap-2">
          <BrandLogo />
          <span className="font-black text-lg tracking-tight text-[#257180]">Room Kode: {code}</span>
        </div>

        <button onClick={handleCopyLink}
          className="w-10 h-10 rounded-xl bg-[#FAF3E0] border border-[#257180]/15 text-[#257180] flex items-center justify-center hover:bg-[#FAF3E0]/80 transition cursor-pointer"
          title="Salin Link Room">
          {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Room Card */}
      <main className="w-full max-w-xl mx-auto my-auto py-4 animate-pop-in">
        <div className="bg-[#FAF3E0] rounded-[36px] p-6 sm:p-8 border-2 border-[#FD8B51]/30 shadow-2xl space-y-6">
          
          {/* Room Banner Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FD8B51]/15 text-[#CB6040] text-xs font-black border border-[#FD8B51]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Room Multi-Device Live</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-[#257180] tracking-tight">
              Kode Room: <span className="text-[#FD8B51] font-mono tracking-widest">{code}</span>
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-[#257180]/75 max-w-sm mx-auto">
              Bagikan kode atau link ini ke HP teman-teman kamu agar bisa bergabung secara langsung!
            </p>
          </div>

          {/* Share Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] transition flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Link Tersalin!" : "Salin Link Room"}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex-1 py-3.5 rounded-2xl font-black text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20bd5a] transition flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <Share2 className="w-4 h-4" />
              <span>Bagikan WA</span>
            </button>
          </div>

          {/* Joined Players List Box */}
          <div className="bg-[#F2E5BF]/70 p-5 rounded-3xl border border-[#257180]/15 space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-[#257180]">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FD8B51]" />
                <span>Pemain Terhubung ({room.players.length})</span>
              </div>
              <span className="text-[10px] font-extrabold text-[#257180]/60 uppercase tracking-wider">Live Lobby</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {room.players.map((p, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF3E0] border border-[#257180]/20 text-xs font-black text-[#257180] shadow-sm">
                  {p === room.host && <Crown className="w-3 h-3 text-[#FD8B51]" />}
                  <span>{p}</span>
                  {p === myName && <span className="text-[9px] text-[#CB6040] font-extrabold">(Kamu)</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Host Game Settings & Start Button */}
          {isHost ? (
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#257180] uppercase tracking-wider">Topik</label>
                  <select
                    value={room.topic}
                    onChange={(e) => broadcastRoomUpdate({ ...room, topic: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2E5BF] border border-[#257180]/20 text-xs font-bold text-[#257180] focus:outline-none">
                    <option value="kenalan">Kenalan Dulu</option>
                    <option value="absurd">Absurd Abis</option>
                    <option value="mix">Acak Topik</option>
                    <option value="deep">Deep Talk</option>
                    <option value="pasangan">Khusus Pasangan</option>
                    <option value="keluarga">Keluarga</option>
                    <option value="nostalgia">Nostalgia</option>
                    <option value="whatif">What If...?</option>
                    <option value="karir">Karir &amp; Mimpi</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-[#257180] uppercase tracking-wider">Ronde</label>
                  <select
                    value={room.rounds}
                    onChange={(e) => broadcastRoomUpdate({ ...room, rounds: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#F2E5BF] border border-[#257180]/20 text-xs font-bold text-[#257180] focus:outline-none">
                    <option value={3}>3 Ronde</option>
                    <option value={5}>5 Ronde</option>
                    <option value={10}>10 Ronde</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
                <Play className="w-5 h-5 fill-current" />
                <span>Mulai Permainan Room →</span>
              </button>
            </div>
          ) : (
            <div className="bg-[#FAF3E0] p-4 rounded-2xl border border-[#FD8B51]/30 text-center space-y-2">
              <div className="text-xs font-black text-[#257180]">Menunggu Host Memulai Permainan...</div>
              <p className="text-[11px] font-semibold text-[#257180]/70">
                Layar kamu akan otomatis berpindah secara real-time begitu {room.host} menekan tombol mulai!
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs font-bold text-[#257180]/60 max-w-xl mx-auto">
        ObrolanSeru Real-Time Engine · Room {code}
      </footer>
    </div>
  );
}
