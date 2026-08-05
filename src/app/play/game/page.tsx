"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { RotateCcw, CheckSquare, Volume2, VolumeX, Check } from 'lucide-react';
import { QUESTION_BANKS } from '../offline/page';
import { sound } from '@/utils/sound';
import { useAuth } from '@/context/AuthContext';

/* Official User Color Palette (Warm Sunset Tones - Zero Cold White) */
const C = {
  teal: "#257180",
  sand: "#F2E5BF",
  linen: "#FAF3E0",
  gold: "#FFBB5C",    // User ordered palette color 1
  orange: "#FF9B50",  // User ordered palette color 2
  rust: "#E25E3E",    // User ordered palette color 3
  crimson: "#C63D2F", // User ordered palette color 4
  muted: "#6B8E94",
};

const CARD_COLORS = [
  "linear-gradient(150deg, #FD8B51 0%, #E25E3E 100%)", // 1. Sunset Orange to Terracotta
  "linear-gradient(150deg, #257180 0%, #174E59 100%)", // 2. Deep Warm Teal
  "linear-gradient(150deg, #FFBB5C 0%, #E68A00 100%)", // 3. Warm Honey Gold
  "linear-gradient(150deg, #CB6040 0%, #A53E22 100%)", // 4. Rich Terracotta Rust
  "linear-gradient(150deg, #C63D2F 0%, #8A2218 100%)", // 5. Deep Vintage Crimson
  "linear-gradient(150deg, #FF9B50 0%, #D96B27 100%)", // 6. Warm Peach Amber
  "linear-gradient(150deg, #3B828E 0%, #20555E 100%)", // 7. Muted Slate Teal
  "linear-gradient(150deg, #B84A39 0%, #7E2B1E 100%)", // 8. Deep Cinnamon Clay
  "linear-gradient(150deg, #F5A623 0%, #D47A00 100%)", // 9. Warm Golden Sand
  "linear-gradient(150deg, #A8442A 0%, #6E2613 100%)", // 10. Warm Chestnut Wood
  "linear-gradient(150deg, #FF8C32 0%, #DD5518 100%)", // 11. Vibrant Sunburst Orange
  "linear-gradient(150deg, #1D5966 0%, #0F353D 100%)", // 12. Deep Forest Teal
];

const TOD_TRUTH = [
  "Siapa orang yang paling kamu sukai saat masa sekolah dulu?",
  "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain?",
  "Pernahkah kamu pura-pura sakit untuk kabur dari janji bertemu?",
  "Apa ketakutan terbesar dalam hidup kamu yang jarang orang lain tahu?",
  "Siapa orang yang paling sering kamu cari tahu kabarnya diam-diam?",
  "Ceritakan satu momen paling canggung dalam hidup kamu!",
  "Hal paling konyol apa yang pernah kamu beli padahal tidak berguna?",
  "Sifat siapa di grup ini yang paling sering membuat kamu gemas?",
  "Pernahkah kamu diam-diam membaca chat orang lain tanpa izin?",
  "Apa rahasia paling konyol yang belum pernah kamu ceritakan ke siapa pun?",
  "Siapa teman pertama yang akan kamu hubungi saat kamu tertimpa masalah?",
  "Apa hal paling memalukan yang pernah terjadi saat kamu berada di tempat umum?",
  "Pernahkah kamu menyukai mantan teman sendiri secara diam-diam?",
  "Apa alasan teraneh yang pernah kamu pakai untuk menolak ajakan nongkrong?",
  "Hal apa yang paling sering membuat kamu merasa iri secara tidak sengaja?",
  "Apa kebiasaan buruk kamu saat sedang panik atau cemas?",
  "Siapa orang di ruangan ini yang paling ingin kamu peluk saat ini?",
  "Pernahkah kamu berpura-pura tahu suatu topik padahal tidak tahu sama sekali?",
  "Apa janji ke diri sendiri yang sampai sekarang paling sering kamu ingkari?",
  "Kalau kamu bisa minta maaf ke satu orang dari masa lalu, ke siapa itu?"
];

const TOD_DARE_OFFLINE = [
  "Tatap mata teman di sebelah kananmu selama 20 detik tanpa tersenyum!",
  "Tunjukkan foto paling konyol di galeri HP kamu ke semua orang di meja!",
  "Tiru gaya jalan atau gaya bicara salah satu orang di sini!",
  "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di sini!",
  "Lakukan gerakan olahraga ringan 10 kali sambil menyebutkan nama makanan!",
  "Tunjukkan 3 histori pencarian terakhir di aplikasi YouTube kamu ke teman!",
  "Puji 3 kebaikan dari teman di sebelah kanan kamu dengan tulus!",
  "Biarkan teman di sebelah kirimu memilih 1 foto di HP kamu untuk ditunjukkan!",
  "Posisikan wajah paling konyol dan tahan selama 15 detik di depan teman-teman!",
  "Ucapkan terima kasih ke teman di sebelah kamu dengan gaya seperti di panggung penghargaan Oscar!",
  "Tiru suara hewan favorit kamu sampai teman-teman di sini tertawa!",
  "Minum 1 teguk minuman dan tahan gaya seperti bintang iklan di TV!",
  "Minta 1 suapan makanan teman kamu sekarang dengan gaya paling memohon!"
];

const TOD_DARE_ONLINE = [
  "Kirim pesan singkat ke kontak ke-5 di HP kamu: 'Aku mau bicara sesuatu penting.'",
  "Perlihatkan foto paling konyol yang ada di galeri HP kamu lewat kamera / share screen!",
  "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!",
  "Biarkan teman kamu memilih 1 foto di galeri HP kamu untuk diposting di story!",
  "Tunjukkan histori pencarian terakhir di aplikasi YouTube atau Google kamu ke layar!",
  "Reagikan salah satu postingan foto teman di Instagram dengan komentar paling kocak!",
  "Tunjukkan wallpaper lockscreen HP kamu ke kamera seluruh teman di room!",
  "Ganti nama profil WhatsApp / sosial media kamu jadi nama konyol selama 10 menit!",
  "Kirimkan foto selfie wajah konyol kamu ke grup chat saat ini juga!",
  "Buka aplikasi belanja online di HP kamu dan tunjukkan keranjang belanjaan kamu ke layar!"
];

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getCardDimensions(count: number) {
  if (count <= 3) return { w: 165, h: 235, symbolSize: "text-5xl", fontBtn: "text-xs px-4 py-2" };
  if (count <= 5) return { w: 135, h: 195, symbolSize: "text-4xl", fontBtn: "text-[11px] px-3 py-1.5" };
  return { w: 110, h: 158, symbolSize: "text-3xl", fontBtn: "text-[10px] px-2.5 py-1" };
}

/* ── Minimal Navbar (100% Mathematically Centered 3-Col Grid) ───────────── */
function Navbar({
  title, round, totalRounds, activePlayerName, isTod, onReset, onFinish
}: {
  title: string; round: number; totalRounds: number; activePlayerName: string; isTod?: boolean;
  onReset: () => void; onFinish: () => void;
}) {
  const [soundOn, setSoundOn] = useState(true);

  const toggleAudio = () => {
    const next = sound.toggle();
    setSoundOn(next);
  };

  return (
    <nav className="w-full max-w-4xl mx-auto px-3 sm:px-4 pt-2.5 sm:pt-3 sticky top-0 z-30 select-none">
      <div className="relative bg-[#FAF3E0]/95 backdrop-blur-md border-2 border-[#FD8B51]/30 rounded-full px-3 sm:px-5 py-2 sm:py-2.5 shadow-lg shadow-orange-950/10 flex items-center justify-between w-full min-h-[46px] sm:min-h-[52px]">
        {/* Col 1: Reset Button */}
        <div className="z-10 flex-shrink-0">
          <button onClick={() => { sound.playClick(); onReset(); }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] active:scale-95 transition shadow-sm cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Col 2: ABSOLUTELY CENTERED TITLE & TURN (100% Presisi Tengah) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center pointer-events-none px-20 sm:px-28">
          <div className="font-black text-xs sm:text-sm text-[#257180] tracking-tight leading-tight truncate max-w-full">
            {title.replace(/\s*\(.*?\)\s*/g, '')}
          </div>
          <div className="flex items-center justify-center gap-1 text-[10px] font-extrabold text-[#257180]/80 mt-0.5 whitespace-nowrap">
            <span>Ronde {round}/{totalRounds}</span>
            {!isTod && (
              <>
                <span>·</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#FD8B51]/20 text-[#CB6040] border border-[#FD8B51]/30 truncate max-w-[70px] sm:max-w-[120px]">
                  {activePlayerName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Col 3: Audio & Finish */}
        <div className="z-10 flex-shrink-0 flex items-center gap-1 sm:gap-1.5">
          <button onClick={toggleAudio}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-black text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] active:scale-95 transition shadow-sm cursor-pointer whitespace-nowrap">
            {soundOn ? <Volume2 className="w-3.5 h-3.5 flex-shrink-0" /> : <VolumeX className="w-3.5 h-3.5 flex-shrink-0" />}
            <span className="hidden sm:inline">{soundOn ? "Suara" : "Mute"}</span>
          </button>
          <button onClick={() => { sound.playClick(); onFinish(); }}
            className="flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-black text-[#FAF3E0] bg-[#257180] hover:bg-[#1d5966] active:scale-95 transition shadow-md cursor-pointer">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Selesai</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── Dynamic Scaled Physical Game Card Back (Sleek & Luxury) ─────────────── */
function GameCard({
  index, onClick, dismissed, playerCount
}: {
  index: number; onClick: () => void; dismissed: boolean; playerCount: number;
}) {
  if (dismissed) return null;

  const { w, h, symbolSize, fontBtn } = getCardDimensions(playerCount);
  const bg = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div className="group cursor-pointer transition-all duration-300 hover:-translate-y-2.5 hover:scale-105 active:scale-95 flex flex-col items-center animate-pop-in"
      style={{ width: w }} onClick={onClick}>
      
      {/* Sleek Luxury Playing Card Back */}
      <div className="w-full relative rounded-[24px] overflow-hidden shadow-xl shadow-orange-950/20 border-[2.5px] border-[#FAF3E0] flex flex-col items-center justify-between p-3"
        style={{ height: h, background: bg }}>
        
        {/* Single Clean Inner Linen Frame Line */}
        <div className="absolute inset-2.5 rounded-[16px] border border-[#FAF3E0]/35 pointer-events-none z-10" />

        {/* Top-Left Corner Suit Emblem (Outside Inner Frame Line) */}
        <div className="w-full flex justify-between text-[11px] font-black text-[#FAF3E0]/60 z-10 select-none px-1">
          <span>♥</span>
          <span>♠</span>
        </div>

        {/* Center Watermark & Big Clean '?' Symbol */}
        <div className="relative z-10 my-auto flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF3E0]/15 flex items-center justify-center backdrop-blur-[1px]">
            <span className={`${symbolSize} font-black text-[#FAF3E0] drop-shadow-md select-none`}>?</span>
          </div>
        </div>

        {/* Bottom-Right Corner Suit Emblem */}
        <div className="w-full flex justify-between text-[11px] font-black text-[#FAF3E0]/60 z-10 select-none px-1">
          <span>♦</span>
          <span>♣</span>
        </div>
      </div>

      {/* Action Button Pill */}
      <div className="mt-2.5">
        <span className={`rounded-full font-black text-[#257180] bg-[#FAF3E0] border border-[#FD8B51]/30 shadow-md group-hover:bg-[#257180] group-hover:text-[#FAF3E0] transition-all ${fontBtn}`}>
          Buka Kartu
        </span>
      </div>
    </div>
  );
}

/* ── All Cards Display & Spotlight 3D Flip Question Modal ────────────────── */
function AllCardsDisplay({
  playerNames, questions, onRoundComplete, round, totalRounds,
  activePlayerIndex, setActivePlayerIndex, roomCode
}: {
  playerNames: string[]; questions: string[];
  onRoundComplete: () => void; round: number; totalRounds: number;
  activePlayerIndex: number; setActivePlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  roomCode?: string;
}) {
  const playerCount = playerNames.length;
  const [dismissed, setDismissed] = useState<boolean[]>(new Array(playerCount).fill(false));
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [activeQuestionText, setActiveQuestionText] = useState<string>('');
  const [isClosingModal, setIsClosingModal] = useState(false);

  // Timestamp guard & stable refs to prevent network race conditions from flickering local state
  const lastActionTimeRef = useRef<number>(0);
  const lastLocalOpenTimeRef = useRef<number>(0);
  const lastSyncedVersionRef = useRef<number>(0);
  const activeModalIndexRef = useRef<number | null>(activeModalIndex);
  const activeQuestionTextRef = useRef<string>(activeQuestionText);
  const dismissedRef = useRef<boolean[]>(dismissed);
  const activePlayerIndexRef = useRef<number>(activePlayerIndex);

  useEffect(() => {
    activeModalIndexRef.current = activeModalIndex;
  }, [activeModalIndex]);

  useEffect(() => {
    activeQuestionTextRef.current = activeQuestionText;
  }, [activeQuestionText]);

  useEffect(() => {
    dismissedRef.current = dismissed;
  }, [dismissed]);

  useEffect(() => {
    activePlayerIndexRef.current = activePlayerIndex;
  }, [activePlayerIndex]);

  const allDone = dismissed.every(Boolean);

  // Reset round state
  useEffect(() => {
    const initialDismissed = new Array(playerCount).fill(false);
    setDismissed(initialDismissed);
    setActiveModalIndex(null);
    setActiveQuestionText('');

    if (roomCode) {
      sendCardRoomSync({
        activeModalIndex: null,
        activeQuestionText: '',
        dismissed: initialDismissed
      });
    }
  }, [round, playerCount, roomCode]);

  // Helper to send real-time card state to /api/room
  const sendCardRoomSync = async (patch: any) => {
    if (!roomCode) return;
    const now = Date.now();
    lastActionTimeRef.current = now;
    try {
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: patch
        })
      });
    } catch (e) {}
  };

  // Poll room state in real-time (400ms) with strict version & timestamp protection (Zero flicker)
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          
          // 1. Version Guard: Ignore stale or out-of-order server responses
          if (gs.version && gs.version <= lastSyncedVersionRef.current) {
            return;
          }

          // 2. Ignore stale server responses if a local user action occurred recently
          if (gs.updatedAt && gs.updatedAt < lastActionTimeRef.current) {
            return;
          }

          // 3. Local Open Guard: Do not let stale server nulls close a card just opened locally
          if (gs.activeModalIndex === null && activeModalIndexRef.current !== null) {
            if (Date.now() - lastLocalOpenTimeRef.current < 2000) {
              return;
            }
          }

          if (gs.version) {
            lastSyncedVersionRef.current = gs.version;
          }

          // Sync active card modal index (open or close)
          if (gs.activeModalIndex !== undefined && gs.activeModalIndex !== activeModalIndexRef.current) {
            setActiveModalIndex(gs.activeModalIndex);
            if (gs.activeModalIndex === null) {
              setIsClosingModal(false);
            }
          }

          // Sync question text
          if (gs.activeQuestionText && gs.activeQuestionText !== activeQuestionTextRef.current) {
            setActiveQuestionText(gs.activeQuestionText);
          }

          // Sync dismissed cards array across all devices
          if (Array.isArray(gs.dismissed) && JSON.stringify(gs.dismissed) !== JSON.stringify(dismissedRef.current)) {
            setDismissed(gs.dismissed);
          }

          // Sync active turn player index
          if (gs.activePlayerIndex !== undefined && gs.activePlayerIndex !== activePlayerIndexRef.current) {
            setActivePlayerIndex(gs.activePlayerIndex);
          }
        }
      } catch (e) {}
    }, 400);

    return () => clearInterval(interval);
  }, [roomCode]);

  const handleOpenCard = (index: number) => {
    if (dismissed[index]) return;
    sound.playFlip();

    const selectedQuestion = questions[index] || "Ceritakan satu momen paling berkesan dalam hidup kamu!";
    const now = Date.now();
    lastLocalOpenTimeRef.current = now;
    lastActionTimeRef.current = now;

    setActiveQuestionText(selectedQuestion);
    setActiveModalIndex(index);

    sendCardRoomSync({
      activeModalIndex: index,
      activeQuestionText: selectedQuestion,
      dismissed,
      activePlayerIndex
    });
  };

  const handleLanjut = () => {
    if (activeModalIndex === null) return;
    sound.playClick();
    setIsClosingModal(true);

    const targetIdx = activeModalIndex;
    const nextDismissed = [...dismissed];
    nextDismissed[targetIdx] = true;
    setDismissed(nextDismissed);

    if (nextDismissed.every(Boolean)) setTimeout(() => sound.playChime(), 150);

    const nextActivePlayer = (activePlayerIndex + 1) % playerCount;
    setActivePlayerIndex(nextActivePlayer);
    setActiveModalIndex(null);
    setIsClosingModal(false);

    // Broadcast card modal close & card dismissal to ALL room devices in real-time
    sendCardRoomSync({
      activeModalIndex: null,
      activeQuestionText: '',
      dismissed: nextDismissed,
      activePlayerIndex: nextActivePlayer
    });
  };

  const activeName = playerNames[activePlayerIndex] || `Pemain ${activePlayerIndex + 1}`;

  return (
    <div className="w-full flex flex-col items-center justify-center my-auto">
      {/* Clean Organic Game Table Mat (Spacious & Consistent) */}
      <div className={`w-full max-w-3xl bg-[#FAF3E0]/95 backdrop-blur-md rounded-[36px] p-6 sm:p-8 border-2 border-[#257180]/15 shadow-xl shadow-orange-950/10 flex flex-col items-center justify-center my-auto transition-all duration-300 ${allDone ? 'min-h-0 py-6' : 'min-h-[360px]'}`}>
        
        {/* Table Cards Grid (Dynamically Scaled & Generous Spacing) */}
        {!allDone && (
          <div className={`flex flex-wrap justify-center items-center w-full my-auto ${playerCount > 5 ? 'gap-3.5 sm:gap-4' : 'gap-5 sm:gap-8'}`}>
            {Array.from({ length: playerCount }).map((_, i) => (
              <GameCard
                key={i}
                index={i}
                dismissed={dismissed[i]}
                playerCount={playerCount}
                onClick={() => handleOpenCard(i)}
              />
            ))}
          </div>
        )}

        {/* Round Completion & Game Summary View (Enlarged Cards & Snug Fit) */}
        {allDone && (
          round < totalRounds ? (
            <div className="relative z-10 text-center space-y-5 animate-pop-in my-auto max-w-md w-full py-2 flex flex-col items-center">
              
              {/* Decorative Prominent 3 Stacked Cards Graphic */}
              <div className="flex items-center justify-center -space-x-5 mb-2 mt-1">
                <div className="w-18 h-26 rounded-2xl bg-[#257180] border-2 border-[#FAF3E0] shadow-lg -rotate-12 flex flex-col items-center justify-between p-2 select-none">
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-start">♥</span>
                  <span className="text-2xl font-black text-[#FAF3E0]">?</span>
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-end">♠</span>
                </div>
                <div className="w-18 h-26 rounded-2xl bg-[#CB6040] border-2 border-[#FAF3E0] shadow-lg rotate-12 flex flex-col items-center justify-between p-2 select-none">
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-start">♦</span>
                  <span className="text-2xl font-black text-[#FAF3E0]">♥</span>
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-end">♣</span>
                </div>
                <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-[#FD8B51] to-[#CB6040] border-[3px] border-[#FAF3E0] shadow-2xl z-10 flex flex-col items-center justify-between p-2.5 select-none">
                  <span className="text-[10px] text-white/60 font-black self-start">♥</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">♥</span>
                  <span className="text-[10px] text-white/60 font-black self-end">♦</span>
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-[#FD8B51]/15 text-[#CB6040] text-xs font-black border border-[#FD8B51]/30">
                  <span>Ronde {round} dari {totalRounds} Selesai</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#257180] tracking-tight">Kalian Luar Biasa!</h2>
                <p className="text-xs sm:text-sm font-semibold text-[#257180]/75">
                  {playerCount} pemain sudah menyelesaikan giliran di ronde ini.
                </p>
              </div>

              {/* Stats Recap Box */}
              <div className="bg-[#FAF3E0] p-4.5 rounded-2xl border-2 border-[#FD8B51]/30 shadow-md w-full text-center">
                <div className="text-xs font-black text-[#257180]/60 uppercase tracking-wider">Total Kartu Terjawab</div>
                <div className="text-3xl font-black text-[#FD8B51] mt-1">{round * playerCount} Kartu</div>
              </div>

              <button onClick={onRoundComplete}
                className="w-full py-4 rounded-2xl font-black text-base text-white shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
                style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
                Lanjut ke Ronde {round + 1} →
              </button>
            </div>
          ) : (
            <div className="relative z-10 text-center space-y-5 animate-pop-in my-auto max-w-md w-full py-2 flex flex-col items-center">
              
              {/* Decorative Prominent 3 Stacked Cards Graphic */}
              <div className="flex items-center justify-center -space-x-5 mb-2 mt-1">
                <div className="w-18 h-26 rounded-2xl bg-[#257180] border-2 border-[#FAF3E0] shadow-lg -rotate-12 flex flex-col items-center justify-between p-2 select-none">
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-start">♥</span>
                  <span className="text-2xl font-black text-[#FAF3E0]">?</span>
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-end">♠</span>
                </div>
                <div className="w-18 h-26 rounded-2xl bg-[#CB6040] border-2 border-[#FAF3E0] shadow-lg rotate-12 flex flex-col items-center justify-between p-2 select-none">
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-start">♦</span>
                  <span className="text-2xl font-black text-[#FAF3E0]">♥</span>
                  <span className="text-[10px] text-[#FAF3E0]/50 font-black self-end">♣</span>
                </div>
                <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-[#FD8B51] to-[#CB6040] border-[3px] border-[#FAF3E0] shadow-2xl z-10 flex flex-col items-center justify-between p-2.5 select-none">
                  <span className="text-[10px] text-white/60 font-black self-start">♥</span>
                  <span className="text-3xl font-black text-white drop-shadow-md">♥</span>
                  <span className="text-[10px] text-white/60 font-black self-end">♦</span>
                </div>
              </div>

              <div className="space-y-1.5 w-full">
                <div className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-[#257180]/15 text-[#257180] text-xs font-black border border-[#257180]/30">
                  <span>Sesi Permainan Selesai</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#257180] tracking-tight">Obrolan Makin Akrab!</h2>
                <p className="text-xs sm:text-sm font-semibold text-[#257180]/75">
                  Selamat! Seluruh {totalRounds} ronde telah berhasil diselesaikan.
                </p>
              </div>

              {/* End Game Summary Box */}
              <div className="bg-[#FAF3E0] p-4.5 rounded-2xl border-2 border-[#FD8B51]/30 shadow-md space-y-2.5 text-left w-full">
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#257180]">
                  <span>Total Pertanyaan Terjawab:</span>
                  <span className="font-black text-base text-[#FD8B51]">{totalRounds * playerCount} Kartu</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#257180]">
                  <span>Total Ronde:</span>
                  <span className="font-black text-base text-[#257180]">{totalRounds} Ronde</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#257180]">
                  <span>Daftar Pemain:</span>
                  <span className="font-black text-xs sm:text-sm text-[#257180] truncate max-w-[200px]">{playerNames.join(', ')}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3.5 pt-1 w-full">
                <Link href="/play/offline"
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] text-center transition shadow-md">
                  Main Lagi
                </Link>
                <Link href="/"
                  className="flex-1 py-3.5 rounded-2xl font-black text-sm text-[#257180] bg-[#FAF3E0] border border-[#257180]/20 hover:bg-[#f2e6cb] text-center transition shadow-sm">
                  Kembali ke Beranda
                </Link>
              </div>
            </div>
          )
        )}
      </div>

      {/* ── CARD REVEAL QUESTION MODAL ──────────────────────────────────── */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/65 backdrop-blur-md">
          <div className={`relative bg-[#FAF3E0] rounded-[36px] p-6 sm:p-8 w-[340px] sm:w-[390px] h-[520px] sm:h-[560px] border-4 border-[#FD8B51] shadow-2xl flex flex-col justify-between items-center text-center ${isClosingModal ? 'animate-card-flip-close' : 'animate-card-flip-pop'}`}>
            
            {/* Header Card Badges */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="px-3.5 py-1.5 rounded-full bg-[#257180] text-[#FAF3E0] text-[11px] font-extrabold tracking-wider uppercase shadow-sm">
                Kartu Giliran #{activeModalIndex + 1}
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#FD8B51]/15 text-[#CB6040] text-[11px] font-extrabold shadow-sm">
                Giliran: {playerNames[activeModalIndex] || `Pemain ${activeModalIndex + 1}`}
              </div>
            </div>

            {/* Inner Luxury Card Content Frame (Textured Playing Card Face - NOT PLAIN) */}
            <div className="w-full flex-1 my-4 rounded-[28px] p-6 flex flex-col justify-between items-center shadow-inner relative overflow-hidden border-2 border-[#FD8B51]/35 select-none"
              style={{ background: "linear-gradient(150deg, #FAF3E0 0%, #F3E4C0 100%)" }}>
              
              {/* Fine Inner Linen Frame */}
              <div className="absolute inset-2.5 rounded-[22px] border border-[#257180]/20 pointer-events-none" />

              {/* Corner Suit Accents Top */}
              <div className="w-full flex justify-between text-xs font-serif text-[#257180]/35 z-10">
                <span className="flex items-center gap-1"><span className="text-[10px]">♥</span> <span className="text-[9px] font-sans font-bold">ObrolanSeru</span></span>
                <span>♠</span>
              </div>

              {/* Central Background Watermark Suit */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] text-8xl font-serif text-[#257180]">
                ♥
              </div>
              
              {/* Question Text */}
              <div className="my-auto z-10 px-2">
                <p className="text-base sm:text-lg font-black text-[#257180] leading-relaxed tracking-tight">
                  "{activeQuestionText || questions[activeModalIndex] || "Ceritakan satu momen paling berkesan dalam hidup kamu!"}"
                </p>
              </div>

              {/* Corner Suit Accents Bottom */}
              <div className="w-full flex justify-between text-xs font-serif text-[#257180]/35 z-10">
                <span>♦</span>
                <span>♣</span>
              </div>
            </div>

            {/* Footer Action Button */}
            <button
              onClick={handleLanjut}
              className="w-full py-4 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer z-10"
              style={{ background: "linear-gradient(135deg, #257180 0%, #1d5966 100%)" }}>
              Sudah Dijawab · Lanjut →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SpinnerWheelFlow({
  playerNames, todType, onFinish, roomCode
}: {
  playerNames: string[]; todType: string; onFinish: () => void; roomCode?: string;
}) {
  const playerCount = playerNames.length;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [todPhase, setTodPhase] = useState<'spin'|'choice'|'reveal'>('spin');
  const [chosenType, setChosenType] = useState<'truth'|'dare'|null>(null);
  const [todContent, setTodContent] = useState<string>('');

  const sliceColors = [C.gold, C.orange, C.rust, C.crimson, C.teal, C.gold];
  
  const VIEWBOX_SIZE = 400;
  const cx = 200;
  const cy = 200;
  const wheelRadius = 170;
  const sliceDeg = 360 / playerCount;

  const lastActionRef = useRef<number>(0);

  // Poll room roulette state safely with local action guard (0 network race flicker)
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      if (Date.now() - lastActionRef.current < 2500) return;

      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          if (gs.rotation !== undefined) setRotation(gs.rotation);
          if (gs.todPhase !== undefined) setTodPhase(gs.todPhase);
          if (gs.landedIndex !== undefined) setLandedIndex(gs.landedIndex);
          if (gs.chosenType !== undefined) setChosenType(gs.chosenType);
          if (gs.todContent !== undefined) setTodContent(gs.todContent);
        }
      } catch (e) {}
    }, 800);
    return () => clearInterval(interval);
  }, [roomCode]);

  const sendRouletteSync = async (nextGS: any) => {
    if (!roomCode) return;
    try {
      await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: nextGS
        })
      });
    } catch (e) {}
  };

  const spin = () => {
    if (spinning) return;
    lastActionRef.current = Date.now();
    setLandedIndex(null);
    setSpinning(true);
    sound.playFlip();

    const target = Math.floor(Math.random() * playerCount);
    const offsetInSlice = (Math.random() * 0.6 - 0.3) * sliceDeg;
    const sliceCenterAngle = target * sliceDeg + sliceDeg / 2 + offsetInSlice;
    const delta = (360 - (sliceCenterAngle % 360) + 360) % 360;
    const baseRot = Math.ceil(rotation / 360) * 360;
    const newRot = baseRot + 1800 + delta;
    
    setRotation(newRot);
    sendRouletteSync({ rotation: newRot, todPhase: 'spin', landedIndex: null });

    setTimeout(() => {
      setSpinning(false);
      setLandedIndex(target);
      sound.playChime();
      sendRouletteSync({ rotation: newRot, todPhase: 'spin', landedIndex: target });
    }, 3800);
  };

  const handlePickChoice = async (type: 'truth'|'dare') => {
    sound.playFlip();
    lastActionRef.current = Date.now();
    setChosenType(type);

    let seen: string[] = [];
    try {
        const stored = sessionStorage.getItem('obrolan_seen_tod');
        if (stored) seen = JSON.parse(stored);
    } catch (e) {}

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: type === 'truth' ? 'tod_truth' : (todType === 'jarakjauh' ? 'tod_dare_online' : 'tod_dare_offline'), count: 5, exclude: seen })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const shuffledPool = shuffle(data.questions as string[]);
        const item = shuffledPool[0];
        setTodContent(item);
        setTodPhase('reveal');
        sendRouletteSync({ todPhase: 'reveal', chosenType: type, todContent: item });
        try {
          const updatedSeen = Array.from(new Set([...seen, item]));
          sessionStorage.setItem('obrolan_seen_tod', JSON.stringify(updatedSeen));
        } catch (e) {}
        return;
      }
    } catch (e) {}

    const fallbackBank = type === 'truth'
      ? TOD_TRUTH
      : (todType === 'jarakjauh' ? TOD_DARE_ONLINE : TOD_DARE_OFFLINE);

    const unseenItems = fallbackBank.filter(q => !seen.includes(q));
    const poolToUse = unseenItems.length > 0 ? unseenItems : fallbackBank;
    const item = poolToUse[Math.floor(Math.random() * poolToUse.length)];

    setTodContent(item);
    setTodPhase('reveal');
    sendRouletteSync({ todPhase: 'reveal', chosenType: type, todContent: item });
    try {
      const updatedSeen = Array.from(new Set([...seen, item]));
      sessionStorage.setItem('obrolan_seen_tod', JSON.stringify(updatedSeen));
    } catch (e) {}
  };

  const handleNextSpin = () => {
    sound.playClick();
    setTodPhase('spin');
    setLandedIndex(null);
    setChosenType(null);
    setTodContent('');
    sendRouletteSync({ todPhase: 'spin', landedIndex: null, chosenType: null, todContent: '' });
  };

  const slices = Array.from({ length: playerCount }).map((_, i) => {
    const startAngle = (i * sliceDeg - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * sliceDeg - 90) * Math.PI / 180;

    const x1 = cx + wheelRadius * Math.cos(startAngle);
    const y1 = cy + wheelRadius * Math.sin(startAngle);
    const x2 = cx + wheelRadius * Math.cos(endAngle);
    const y2 = cy + wheelRadius * Math.sin(endAngle);

    const largeArc = sliceDeg > 180 ? 1 : 0;
    const midAngle = (i * sliceDeg + sliceDeg / 2 - 90) * Math.PI / 180;
    const textRadius = wheelRadius * 0.65;
    const tx = cx + textRadius * Math.cos(midAngle);
    const ty = cy + textRadius * Math.sin(midAngle);
    const textAngle = i * sliceDeg + sliceDeg / 2;

    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      tx, ty, textAngle,
      color: sliceColors[i % sliceColors.length],
      label: playerNames[i] || `Pemain ${i + 1}`,
    };
  });

  const studCount = Math.max(12, playerCount * 2);
  const studs = Array.from({ length: studCount }).map((_, idx) => {
    const angle = (idx * (360 / studCount) - 90) * Math.PI / 180;
    const studR = wheelRadius + 10;
    return {
      sx: cx + studR * Math.cos(angle),
      sy: cy + studR * Math.sin(angle),
    };
  });

  const selectedName = landedIndex !== null ? (playerNames[landedIndex] || `Pemain ${landedIndex + 1}`) : '';

  return (
    <div className="flex flex-col items-center justify-center w-full my-auto">
      
      {/* PHASE 1: Real-Life Roulette Wheel with Static Stand & Rotating Inner Wheel */}
      {todPhase === 'spin' && (
        <div className="flex flex-col items-center gap-5 w-full my-auto animate-pop-in">
          
          {/* Wheel Assembly Container (Outer Frame & Stand STAY 100% STILL) */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-[290px] sm:max-w-[370px] mx-auto select-none pt-4 pb-1">
            
            {/* Top Downward Pointer Stopper Pin (Static 12 o'clock) */}
            <div className="absolute top-0 z-30 flex flex-col items-center">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FD8B51] border-2 border-[#FAF3E0] shadow-md -mb-1" />
              <div style={{
                width: 0, height: 0,
                borderLeft: "13px solid transparent",
                borderRight: "13px solid transparent",
                borderTop: `25px solid ${C.teal}`,
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))"
              }} />
            </div>

            {/* Vertical Pillar Stand Behind Wheel (Static) */}
            <div className="absolute inset-y-3 w-7 bg-gradient-to-b from-[#257180] via-[#1d5966] to-[#257180] border-2 border-[#FAF3E0]/30 rounded-lg shadow-xl z-0" />

            {/* Wheel SVG Frame (Outer Container Static, ONLY Inner Group Rotates) */}
            <div className="relative z-10 w-full aspect-square">
              <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="w-full h-full filter drop-shadow-2xl overflow-visible">
                
                {/* ONLY THIS INNER GROUP ROTATES ON POROS (200px, 200px) */}
                <g style={{
                  transition: spinning ? "transform 3.8s cubic-bezier(0.12, 0.85, 0.15, 1)" : "none",
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "200px 200px",
                }}>
                  {/* Outer Wooden/Metallic Rim */}
                  <circle cx={cx} cy={cy} r={192} fill="#FAF3E0" stroke="#CB6040" strokeWidth={6} />
                  <circle cx={cx} cy={cy} r={185} fill="#FAF3E0" stroke="#FD8B51" strokeWidth={10} />

                  {/* Slices */}
                  {slices.map((s, i) => (
                    <g key={i}>
                      <path d={s.path} fill={s.color} stroke="#FAF3E0" strokeWidth={2.5} />
                      <text x={s.tx} y={s.ty} textAnchor="middle" dominantBaseline="middle" fill="#FAF3E0" fontSize={playerCount > 5 ? 12 : 14} fontWeight="900" fontFamily="Nunito, sans-serif" transform={`rotate(${s.textAngle}, ${s.tx}, ${s.ty})`}>
                        {s.label}
                      </text>
                    </g>
                  ))}

                  {/* Outer Brass Rivet Studs */}
                  {studs.map((st, idx) => (
                    <circle key={idx} cx={st.sx} cy={st.sy} r={4.5} fill="#FAF3E0" stroke="#257180" strokeWidth={2} />
                  ))}

                  {/* Center Metallic Axle Hub Cap */}
                  <circle cx={cx} cy={cy} r={34} fill="#FAF3E0" stroke="#FD8B51" strokeWidth={4} />
                  <circle cx={cx} cy={cy} r={24} fill="#257180" />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#FAF3E0" fontSize={15} fontWeight="900">✦</text>
                </g>
              </svg>
            </div>

            {/* Solid Heavy Base Stand at Bottom (Static) */}
            <div className="relative z-20 w-40 sm:w-44 h-7 bg-gradient-to-r from-[#257180] via-[#1d5966] to-[#257180] rounded-t-2xl border-t-2 border-[#FAF3E0]/40 shadow-xl flex items-center justify-center -mt-3.5">
              <div className="w-20 sm:w-24 h-1.5 bg-[#FD8B51] rounded-full opacity-80" />
            </div>
          </div>

          <button onClick={spin} disabled={spinning}
            className={`px-10 py-4 rounded-2xl font-black text-base text-white shadow-xl transition cursor-pointer ${spinning ? 'opacity-50 scale-95 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-95'}`}
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
            {spinning ? 'Roda Sedang Berputar...' : 'Putar Roulette Wheel ✦'}
          </button>

          {/* Winner Result Box */}
          {landedIndex !== null && !spinning && (
            <div className="bg-[#FAF3E0] p-6 rounded-[32px] border-2 border-[#FD8B51] shadow-2xl text-center space-y-4 max-w-sm w-full animate-pop-in">
              <div className="space-y-1">
                <span className="text-[11px] font-black text-[#257180] uppercase tracking-wider">TERPILIH KENA TANTANGAN</span>
                <h3 className="text-3xl font-black text-[#CB6040]">{selectedName}</h3>
              </div>

              <button
                onClick={() => setTodPhase('choice')}
                className="w-full py-3.5 rounded-2xl font-black text-sm text-white shadow-md hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                style={{ background: "linear-gradient(135deg, #257180 0%, #1d5966 100%)" }}>
                Pilih Tantangan (Truth / Dare) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: Choice between TRUTH or DARE (Clean Minimalist Warm Cards) */}
      {todPhase === 'choice' && (
        <div className="text-center space-y-6 animate-pop-in max-w-lg w-full px-4 my-auto">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#257180]/60 uppercase tracking-widest">
              GILIRAN TANTANGAN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#257180] tracking-tight">
              {selectedName}, Pilih Mana?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-1">
            {/* TRUTH Card */}
            <button onClick={() => handlePickChoice('truth')}
              className="relative h-80 sm:h-88 rounded-[28px] p-6 flex flex-col items-center justify-between border-2 border-[#FAF3E0]/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden group select-none"
              style={{ background: "linear-gradient(160deg, #FD8B51 0%, #CB6040 100%)" }}>
              
              {/* Corner Suits Top */}
              <div className="w-full flex justify-between text-[11px] font-bold text-[#FAF3E0]/40">
                <span>♥</span><span>♠</span>
              </div>

              {/* Center Title */}
              <div className="text-center my-auto space-y-1">
                <div className="text-3xl sm:text-4xl font-black tracking-widest text-[#FAF3E0]">
                  TRUTH
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#FAF3E0]/85">
                  Jawab Jujur
                </div>
              </div>

              {/* Corner Suits Bottom */}
              <div className="w-full flex justify-between text-[11px] font-bold text-[#FAF3E0]/40">
                <span>♦</span><span>♣</span>
              </div>
            </button>

            {/* DARE Card */}
            <button onClick={() => handlePickChoice('dare')}
              className="relative h-80 sm:h-88 rounded-[28px] p-6 flex flex-col items-center justify-between border-2 border-[#FAF3E0]/40 shadow-xl hover:-translate-y-1.5 hover:shadow-2xl active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden group select-none"
              style={{ background: "linear-gradient(160deg, #CB6040 0%, #8A3720 100%)" }}>
              
              {/* Corner Suits Top */}
              <div className="w-full flex justify-between text-[11px] font-bold text-[#FAF3E0]/40">
                <span>♦</span><span>♣</span>
              </div>

              {/* Center Title */}
              <div className="text-center my-auto space-y-1">
                <div className="text-3xl sm:text-4xl font-black tracking-widest text-[#FAF3E0]">
                  DARE
                </div>
                <div className="text-xs sm:text-sm font-semibold text-[#FAF3E0]/85">
                  Lakukan Tantangan
                </div>
              </div>

              {/* Corner Suits Bottom */}
              <div className="w-full flex justify-between text-[11px] font-bold text-[#FAF3E0]/40">
                <span>♥</span><span>♠</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: Reveal Truth / Dare Minimalist Card Modal */}
      {todPhase === 'reveal' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-[#257180]/60 backdrop-blur-md">
          <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 w-[340px] sm:w-[390px] h-[490px] sm:h-[530px] border-2 border-[#FD8B51]/30 shadow-2xl flex flex-col justify-between items-center text-center animate-pop-in select-none">
            
            {/* Header Badges */}
            <div className="w-full flex items-center justify-between">
              <div className="px-3.5 py-1.5 rounded-full bg-[#FD8B51] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                Tantangan {chosenType === 'truth' ? 'TRUTH' : 'DARE'}
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#257180]/15 text-[#257180] text-[11px] font-extrabold">
                {selectedName}
              </div>
            </div>

            {/* Inner Content Box */}
            <div className="w-full flex-1 my-4 bg-[#F2E5BF]/80 rounded-[28px] border border-[#257180]/15 p-6 flex flex-col justify-center items-center shadow-inner relative overflow-hidden">
              <p className="text-base sm:text-lg font-extrabold text-[#257180] leading-relaxed max-w-xs">
                "{todContent}"
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handleNextSpin}
              className="w-full py-4 rounded-2xl font-black text-sm text-white shadow-xl hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
              Tantangan Selesai · Putar Lagi →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

/* ── Main Game Screen (Strictly Single Viewport Fit + Footer) ───────────────── */
function OfflineGame() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, getMergedSeenQuestions, syncSeenQuestions } = useAuth();

  const mode = searchParams.get('mode') as 'pertanyaan'|'tod' || 'pertanyaan';
  const todType = searchParams.get('todType') || 'tatapmuka';
  const topic = searchParams.get('topic') || 'kenalan';
  const totalRounds = parseInt(searchParams.get('rounds') || '3', 10);
  const roomCode = searchParams.get('roomCode') || undefined;
  
  const rawPlayersParam = searchParams.get('players') || 'Pemain 1,Pemain 2';
  const playerNames = rawPlayersParam.split(',').map(s => s.trim()).filter(Boolean);

  const [currentRound, setCurrentRound] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);

  // Poll room questions & round state for room players
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          if (Array.isArray(gs.roundQuestions) && gs.roundQuestions.length > 0 && JSON.stringify(gs.roundQuestions) !== JSON.stringify(roundQuestions)) {
            setRoundQuestions(gs.roundQuestions);
          }
          if (Array.isArray(gs.allQuestions) && gs.allQuestions.length > 0 && JSON.stringify(gs.allQuestions) !== JSON.stringify(allQuestions)) {
            setAllQuestions(gs.allQuestions);
          }
          if (gs.currentRound !== undefined && gs.currentRound !== currentRound) {
            setCurrentRound(gs.currentRound);
          }
        }
      } catch (e) {}
    }, 500);
    return () => clearInterval(interval);
  }, [roomCode, currentRound, roundQuestions, allQuestions]);

  useEffect(() => {
    async function loadFreshAIQuestions() {
      // If playing in an online room, check if room already has questions broadcasted
      if (roomCode) {
        try {
          const roomRes = await fetch(`/api/room?code=${roomCode}`);
          const roomData = await roomRes.json();
          if (roomData.success && roomData.room?.gameState?.roundQuestions) {
            const gs = roomData.room.gameState;
            setRoundQuestions(gs.roundQuestions);
            if (gs.allQuestions) setAllQuestions(gs.allQuestions);
            return;
          }
        } catch (e) {}
      }

      const BAD_PHRASES = [
        "diajak nongkrong sama",
        "disamakan dengan",
        "apa alasan utamanya",
        "ceritakan dengan detail",
        "pilih reaksi paling kocak",
        "kalau hidup kamu disamakan",
        "pas kamu dapat kesempatan"
      ];

      const cleanPool = (list: string[]) => list.filter(q => q && !BAD_PHRASES.some(b => q.toLowerCase().includes(b)));

      const totalNeeded = totalRounds * playerNames.length;
      const seen: string[] = getMergedSeenQuestions();
      const seenSet = new Set(seen.map(s => String(s).trim().toLowerCase()));

      let selectedQuestions: string[] = [];

      try {
        const aiPromptParam = searchParams.get('aiPrompt') || '';
        const res = await fetch(`/api/generate-questions?_t=${Date.now()}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          },
          cache: 'no-store',
          body: JSON.stringify({ topic, customPrompt: aiPromptParam, count: totalNeeded + 10, exclude: seen })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          const pool: string[] = cleanPool(shuffle(data.questions as string[])).filter(q => !seenSet.has(q.trim().toLowerCase()));
          selectedQuestions = pool;
        }
      } catch (e) {
        console.warn("Falling back to local pool:", e);
      }

      // Top up pool seamlessly up to totalNeeded with zero duplicate questions
      if (selectedQuestions.length < totalNeeded) {
        const primaryBank = cleanPool(QUESTION_BANKS[topic] || QUESTION_BANKS['kenalan']);
        const allBanks = cleanPool(Object.values(QUESTION_BANKS).flat());

        const unseenPrimary = primaryBank.filter(q => !seenSet.has(q.trim().toLowerCase()));
        const unseenGlobal = allBanks.filter(q => !seenSet.has(q.trim().toLowerCase()));

        const fullMasterSet = Array.from(new Set([
          ...selectedQuestions,
          ...unseenPrimary,
          ...unseenGlobal,
          ...primaryBank,
          ...allBanks
        ]));

        selectedQuestions = shuffle(fullMasterSet).slice(0, totalNeeded);
      }

      const firstRoundQs = selectedQuestions.slice(0, playerNames.length);
      setAllQuestions(selectedQuestions);
      setRoundQuestions(firstRoundQs);

      // Sync seen questions across devices and upload to Cloud Account
      try {
        await syncSeenQuestions(selectedQuestions);
      } catch (e) {}

      // Broadcast questions to room so ALL devices get 100% identical questions!
      if (roomCode) {
        try {
          await fetch('/api/room', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: roomCode,
              gameState: {
                allQuestions: selectedQuestions,
                roundQuestions: firstRoundQs,
                currentRound: 1
              }
            })
          });
        } catch (e) {}
      }
    }

    loadFreshAIQuestions();
  }, [topic, totalRounds, playerNames.length, roomCode]);

  const handleNextRound = () => {
    const next = currentRound + 1;
    setCurrentRound(next);
    const start = (next - 1) * playerNames.length;
    const nextRoundQs = allQuestions.slice(start, start + playerNames.length);
    setRoundQuestions(nextRoundQs);

    if (roomCode) {
      fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: {
            currentRound: next,
            roundQuestions: nextRoundQs
          }
        })
      });
    }
  };

  const handleReset = () => router.push('/play/offline');
  const handleFinish = () => router.push('/play/offline');

  const TOPIC_TITLES: Record<string, string> = {
    kenalan: "Kenalan Dulu",
    absurd: "Absurd Abis",
    mix: "Acak Topik",
    deep: "Deep Talk",
    pasangan: "Khusus Pasangan",
    keluarga: "Keluarga",
    nostalgia: "Nostalgia",
    whatif: "What If...?",
    karir: "Karir & Mimpi",
    ai_custom: "Racikan AI",
  };

  const navTitle = mode === 'tod'
    ? `Truth or Dare (${todType === 'jarakjauh' ? 'Jarak Jauh' : 'Tatap Muka'})`
    : (TOPIC_TITLES[topic] || topic.charAt(0).toUpperCase() + topic.slice(1));
  const activeName = playerNames[activePlayerIndex] || `Pemain ${activePlayerIndex + 1}`;

  return (
    <div className="min-h-screen w-full flex flex-col justify-between relative bg-[#F2E5BF] text-[#257180] font-sans pb-4 overflow-y-auto">
      <Navbar
        title={navTitle}
        round={currentRound}
        totalRounds={totalRounds}
        activePlayerName={activeName}
        isTod={mode === 'tod'}
        onReset={handleReset}
        onFinish={handleFinish}
      />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-2 relative z-10 w-full max-w-5xl mx-auto my-auto">
        {mode === 'pertanyaan' ? (
          <AllCardsDisplay
            playerNames={playerNames}
            questions={roundQuestions}
            onRoundComplete={handleNextRound}
            round={currentRound}
            totalRounds={totalRounds}
            activePlayerIndex={activePlayerIndex}
            setActivePlayerIndex={setActivePlayerIndex}
            roomCode={roomCode}
          />
        ) : (
          <SpinnerWheelFlow
            playerNames={playerNames}
            todType={todType}
            onFinish={handleFinish}
            roomCode={roomCode}
          />
        )}
      </main>

      {/* Clean Bottom Footer */}
      <footer className="w-full py-2 text-center text-xs font-black text-[#257180]/60 relative z-20">
        ObrolanSeru © 2026
      </footer>
    </div>
  );
}

export default function OfflineGamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F2E5BF]">
        <div className="w-8 h-8 border-3 border-[#FD8B51] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <OfflineGame />
    </Suspense>
  );
}
