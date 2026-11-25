"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { RotateCcw, CheckSquare, Volume2, VolumeX, Check, Wand2 } from 'lucide-react';
import { MASTER_QUESTION_BANKS as QUESTION_BANKS } from '@/utils/masterQuestionBank';
import { sound } from '@/utils/sound';
import { useAuth } from '@/context/AuthContext';
import { generateProceduralQuestions } from '@/utils/proceduralQuestions';

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
  "Siapa orang yang paling kamu sukai atau taksir secara diam-diam saat masa sekolah dulu?",
  "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain dan belum pernah ketahuan?",
  "Pernahkah kamu pura-pura sakit atau sibuk cuma demi kabur dari janji bertemu teman?",
  "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke orang lain?",
  "Siapa orang yang paling sering kamu cari tahu kabarnya atau stalk diam-diam di sosmed?",
  "Ceritakan satu momen paling canggung atau tengsin yang pernah kamu alami dalam hidup!",
  "Hal paling impulsif apa yang pernah kamu beli padahal sebenarnya tidak berguna?",
  "Apa rahasia paling konyol yang belum pernah kamu ceritakan ke siapa pun sampai hari ini?",
  "Siapa teman pertama yang akan kamu hubungi saat kamu tertimpa masalah berat?",
  "Pernahkah kamu menyukai mantan teman sendiri secara diam-diam?",
  "Apa alasan teraneh yang pernah kamu pakai untuk menolak ajakan nongkrong?",
  "Hal apa yang paling sering membuat kamu merasa iri secara tidak sengaja?",
  "Apa kebiasaan buruk kamu saat sedang panik atau cemas sendirian?",
  "Siapa orang di antara kita yang menurutmu paling berbeda antara di chat dan aslinya?",
  "Pernahkah kamu berpura-pura tahu suatu topik obrolan padahal tidak paham sama sekali?",
  "Apa janji ke diri sendiri yang sampai sekarang paling sering kamu ingkari?",
  "Kalau kamu bisa minta maaf ke satu orang dari masa lalumu tanpa gengsi, ke siapa itu?",
  "Berapa jumlah uang paling sedikit yang pernah ada di rekeningmu saat kamu butuh banget?",
  "Pernahkah kamu salah kirim pesan rahasia ke orang yang sedang kamu bicarakan?",
  "Apa hal paling memalukan yang pernah kamu lakukan demi menarik perhatian gebetan?",
  "Hal apa dari penampilanmu sendiri yang paling bikin kamu insecure?",
  "Pernahkah kamu menangis sendirian di kamar mandi karena urusan kerjaan atau cinta?",
  "Siapa sosok yang paling berjasa dalam hidupmu tapi belum pernah kamu ucapkan terima kasih secara langsung?",
  "Apa makanan atau minuman aneh yang kamu suka tapi orang lain anggap menjijikkan?",
  "Pernahkah kamu diam-diam membaca chat atau notifikasi di HP orang lain?",
  "Apa hal paling konyol yang pernah kamu percayai sampai kamu menginjak usia remaja?",
  "Kalau ada satu hari di mana kamu bebas berbuat apa saja tanpa ada konsekuensi, apa yang kamu lakukan?",
  "Pernahkah kamu merasa kesepian banget padahal sedang berada di tengah keramaian?",
  "Apa penyesalan terbesar yang paling sering terlintas di pikiranmu saat mau tidur?",
  "Siapa orang di sini yang pertama kali kamu nilai salah saat pertama kali kenal?"
];

const TOD_DARE_OFFLINE = [
  "Tatap mata teman di sebelah kananmu selama 20 detik penuh tanpa tersenyum sedikit pun!",
  "Tunjukkan foto paling konyol di galeri HP kamu ke semua teman di meja!",
  "Tiru gaya jalan atau gaya bicara salah satu orang di sini dengan mirip!",
  "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di meja!",
  "Lakukan gerakan olahraga ringan 10 kali sambil sebutkan 5 nama makanan!",
  "Ucapkan pantun lucu secara spontan untuk orang di depan kamu!",
  "Tunjukkan 3 histori pencarian terakhir di aplikasi YouTube kamu ke teman!",
  "Puji 3 kebaikan dari teman di sebelah kanan kamu dengan tulus dari hati!",
  "Biarkan teman di sebelah kirimu memilih 1 foto di HP kamu untuk ditunjukkan ke semua!",
  "Posisikan wajah paling konyol dan tahan selama 15 detik di depan teman-teman!",
  "Ucapkan terima kasih ke teman di sebelahmu dengan gaya pidato Oscar penuh haru!",
  "Tiru suara hewan favorit kamu sampai teman-teman di sini tertawa!",
  "Minum 1 teguk minuman dan tahan gaya seperti bintang iklan TV selama 10 detik!",
  "Minta 1 suapan makanan teman kamu sekarang dengan gaya paling memohon!",
  "Berikan jabat tangan paling formal layaknya pejabat negara ke semua orang di meja!",
  "Katakan satu kalimat gombalan paling garing ke orang yang duduk di hadapanmu!",
  "Tutup mata dan tebak tangan siapa yang sedang kamu pegang!",
  "Bicara dengan logat atau aksen daerah lain selama 2 putaran ke depan!",
  "Pijat pundak teman di sebelah kirimu selama 15 detik sambil menyanyikan lagu anak-anak!",
  "Lakukan pose superhero terbaikmu dan tahan selama 10 detik tanpa bergerak!"
];

const TOD_DARE_ONLINE = [
  "Kirim pesan singkat ke kontak ke-5 di WhatsApp kamu: 'Aku mau bicara sesuatu penting banget.'",
  "Perlihatkan foto paling konyol yang ada di galeri HP kamu lewat kamera atau share screen!",
  "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!",
  "Ubah foto profil media sosial kamu jadi gambar karakter kartun favorit selama 30 menit!",
  "Tuliskan status singkat yang lucu atau nyeleneh di WhatsApp Story kamu selama 10 menit!",
  "Tunjukkan histori pencarian terakhir di aplikasi YouTube atau Google kamu ke layar!",
  "Reagikan salah satu postingan foto teman di Instagram dengan komentar paling kocak!",
  "Tunjukkan wallpaper lockscreen HP kamu ke kamera seluruh teman di room!",
  "Ganti nama profil WhatsApp kamu jadi nama konyol selama 10 menit!",
  "Kirimkan foto selfie wajah konyol kamu ke grup chat keluarga atau pertemanan sekarang!",
  "Buka aplikasi belanja online di HP kamu dan tunjukkan keranjang belanjaan kamu ke layar!",
  "Tunjukkan playlist lagu yang paling sering kamu dengarkan secara diam-diam!",
  "Kirim emoji acak ke kontak WhatsApp teratas tanpa penjelasan apapun!",
  "Buka galeri dan bacakan catatan (notes) paling lama yang ada di HP kamu!",
  "Gunakan filter wajah paling aneh di kamera kamu selama 1 putaran penuh!",
  "Kirim voice note bernyanyi 1 bait lagu dangdut ke teman dekatmu!"
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
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>

        {/* Col 2: ABSOLUTELY CENTERED TITLE & TURN */}
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

/* ── Dynamic Scaled Physical Game Card Back ──────────────────────────────── */
function GameCard({
  index, onClick, dismissed, playerCount, playerName, isCurrentTurn, isMyCard
}: {
  index: number; onClick: () => void; dismissed: boolean; playerCount: number;
  playerName?: string; isCurrentTurn?: boolean; isMyCard?: boolean;
}) {
  if (dismissed) return null;

  const { w, h, symbolSize, fontBtn } = getCardDimensions(playerCount);
  const bg = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2.5 hover:scale-105 active:scale-95 flex flex-col items-center animate-pop-in ${isCurrentTurn ? 'scale-105' : 'opacity-90'}`}
      style={{ width: w }} onClick={onClick}>
      
      {/* Sleek Luxury Playing Card Back */}
      <div className={`w-full relative rounded-[24px] overflow-hidden shadow-xl shadow-orange-950/20 border-[2.5px] ${isCurrentTurn ? 'border-[#FD8B51] ring-4 ring-[#FD8B51]/30' : 'border-[#FAF3E0]'} flex flex-col items-center justify-between p-3`}
        style={{ height: h, background: bg }}>
        
        {/* Single Clean Inner Linen Frame Line */}
        <div className="absolute inset-2.5 rounded-[16px] border border-[#FAF3E0]/35 pointer-events-none z-10" />

        {/* Top-Left Corner Suit Emblem */}
        <div className="w-full flex justify-between text-[11px] font-black text-[#FAF3E0]/60 z-10 select-none px-1">
          <span>♥</span>
          <span>♠</span>
        </div>

        {/* Center Watermark & Big Clean '?' Symbol */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center gap-1">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF3E0]/15 flex items-center justify-center backdrop-blur-[1px]">
            <span className={`${symbolSize} font-black text-[#FAF3E0] drop-shadow-md select-none`}>?</span>
          </div>
          {playerName && (
            <span className="text-[10px] sm:text-[11px] font-black text-[#FAF3E0] tracking-wide px-2 py-0.5 rounded-full bg-black/25 backdrop-blur-xs max-w-[120px] truncate">
              {playerName} {isMyCard ? '★' : ''}
            </span>
          )}
        </div>

        {/* Bottom-Right Corner Suit Emblem */}
        <div className="w-full flex justify-between text-[11px] font-black text-[#FAF3E0]/60 z-10 select-none px-1">
          <span>♦</span>
          <span>♣</span>
        </div>
      </div>

      {/* Action Button Pill */}
      <div className="mt-2.5">
        <span className={`rounded-full font-black ${isCurrentTurn ? 'bg-[#FD8B51] text-white border-[#CB6040]' : 'bg-[#FAF3E0] text-[#257180] border-[#FD8B51]/30'} border shadow-md group-hover:bg-[#257180] group-hover:text-[#FAF3E0] transition-all ${fontBtn}`}>
          {isMyCard ? "Buka Kartumu" : isCurrentTurn ? `Giliran ${playerName || 'Pemain'}` : `Buka Kartu`}
        </span>
      </div>
    </div>
  );
}

/* ── All Cards Display & Spotlight 3D Flip Question Modal ────────────────── */
function AllCardsDisplay({
  playerNames, questions, onRoundComplete, onBackToLobby, round, totalRounds,
  activePlayerIndex, setActivePlayerIndex, roomCode, topic, myName
}: {
  playerNames: string[]; questions: string[];
  onRoundComplete: () => void; onBackToLobby: () => void; round: number; totalRounds: number;
  activePlayerIndex: number; setActivePlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  roomCode?: string; topic?: string; myName?: string;
}) {
  const { syncSeenQuestions } = useAuth();
  const playerCount = playerNames.length;
  const [dismissed, setDismissed] = useState<boolean[]>(new Array(playerCount).fill(false));
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [activeQuestionText, setActiveQuestionText] = useState<string>('');
  const [isClosingModal, setIsClosingModal] = useState(false);

  // Version-based synchronization refs to keep multi-device state strictly in sync
  const lastSyncedVersionRef = useRef<number>(0);

  const allDone = dismissed.every(Boolean);

  // Helper to send real-time card state to /api/room with version tracking
  const sendCardRoomSync = async (patch: any) => {
    if (!roomCode) return;
    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: patch
        })
      });
      const data = await res.json();
      if (data.success && data.room?.gameState?.version) {
        lastSyncedVersionRef.current = data.room.gameState.version;
      }
    } catch (e) {}
  };

  // Poll room state in real-time (350ms) using logical version ordering
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          
          // Strict monotonic version check: skip already applied versions
          if (typeof gs.version === 'number' && gs.version <= lastSyncedVersionRef.current) {
            return;
          }
          lastSyncedVersionRef.current = gs.version;

          // Sync active card modal index
          if (gs.activeModalIndex !== undefined) {
            setActiveModalIndex(gs.activeModalIndex);
            if (gs.activeModalIndex === null) {
              setIsClosingModal(false);
            }
          }

          // Sync question text (properly handles empty string on close)
          if (typeof gs.activeQuestionText === 'string') {
            setActiveQuestionText(gs.activeQuestionText);
          }

          // Sync dismissed cards array across all devices
          if (Array.isArray(gs.dismissed)) {
            setDismissed(gs.dismissed);
          }

          // Sync active turn player index
          if (typeof gs.activePlayerIndex === 'number') {
            setActivePlayerIndex(gs.activePlayerIndex);
          }
        }
      } catch (e) {}
    }, 350);

    return () => clearInterval(interval);
  }, [roomCode, setActivePlayerIndex]);

  const handleOpenCard = (index: number) => {
    if (dismissed[index]) return;
    sound.playFlip();

    // Use question from questions array, with fallback to procedurally generated question
    const proceduralFallback = generateProceduralQuestions(topic as string, 1, new Set())[0] || "Ceritakan satu pengalaman paling berkesan dalam hidup kamu!";
    const selectedQuestion = (questions && questions[index]) ? questions[index] : proceduralFallback;

    // Immediately mark as seen the moment card is opened
    try {
      syncSeenQuestions([selectedQuestion]);
    } catch {}

    setActiveQuestionText(selectedQuestion);
    setActiveModalIndex(index);

    sendCardRoomSync({
      activeModalIndex: index,
      activeQuestionText: selectedQuestion,
      dismissed,
      activePlayerIndex: index
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

    const nextActivePlayer = (targetIdx + 1) % playerCount;
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

  return (
    <div className="w-full flex flex-col items-center justify-center my-auto">
      {/* Clean Organic Game Table Mat */}
      <div className={`w-full max-w-3xl bg-[#FAF3E0]/95 backdrop-blur-md rounded-[36px] p-6 sm:p-8 border-2 border-[#257180]/15 shadow-xl shadow-orange-950/10 flex flex-col items-center justify-center my-auto transition-all duration-300 ${allDone ? 'min-h-0 py-6' : 'min-h-[360px]'}`}>
        
        {/* Table Cards Grid */}
        {!allDone && (
          <div className={`flex flex-wrap justify-center items-center w-full my-auto ${playerCount > 5 ? 'gap-3.5 sm:gap-4' : 'gap-5 sm:gap-8'}`}>
            {Array.from({ length: playerCount }).map((_, i) => (
              <GameCard
                key={i}
                index={i}
                playerName={playerNames[i]}
                isCurrentTurn={i === activePlayerIndex}
                isMyCard={Boolean(myName && playerNames[i]?.toLowerCase() === myName.toLowerCase())}
                dismissed={dismissed[i]}
                playerCount={playerCount}
                onClick={() => handleOpenCard(i)}
              />
            ))}
          </div>
        )}

        {/* Round Completion & Game Summary View */}
        {allDone && (
          round < totalRounds ? (
            <div className="relative z-10 text-center space-y-5 animate-pop-in my-auto max-w-md w-full py-2 flex flex-col items-center">
              
              {/* Decorative 3 Stacked Cards Graphic */}
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
              
              {/* Decorative 3 Stacked Cards Graphic */}
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
                {roomCode ? (
                  <button onClick={onBackToLobby}
                    className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] text-center transition shadow-md cursor-pointer">
                    Kembali ke Room Lobby
                  </button>
                ) : (
                  <Link href="/play/offline"
                    className="flex-1 py-3.5 rounded-2xl font-black text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] text-center transition shadow-md">
                    Main Lagi
                  </Link>
                )}
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
                Kartu #{activeModalIndex + 1}
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-[#FD8B51]/15 text-[#CB6040] text-[11px] font-extrabold shadow-sm">
                Giliran: {playerNames[activeModalIndex] || `Pemain ${activeModalIndex + 1}`}
              </div>
            </div>

            {/* Inner Luxury Card Content Frame */}
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
  playerNames, todType, onFinish, roomCode, myName
}: {
  playerNames: string[]; todType: string; onFinish: () => void; roomCode?: string; myName?: string;
}) {
  const playerCount = playerNames.length;
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [todPhase, setTodPhase] = useState<'spin'|'choice'|'reveal'>('spin');
  const [chosenType, setChosenType] = useState<'truth'|'dare'|null>(null);
  const [todContent, setTodContent] = useState<string>('');

  const sliceColors = [C.gold, C.orange, C.rust, C.crimson, C.teal, C.gold];
  const sliceDeg = 360 / playerCount;
  const wheelRadius = 180;
  const cx = 200;
  const cy = 200;
  const VIEWBOX_SIZE = 400;

  const lastSyncedVersionRef = useRef<number>(0);

  // Poll room roulette state
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          if (typeof gs.version === 'number' && gs.version <= lastSyncedVersionRef.current) {
            return;
          }
          lastSyncedVersionRef.current = gs.version;

          if (gs.rotation !== undefined) setRotation(gs.rotation);
          if (gs.todPhase !== undefined) setTodPhase(gs.todPhase);
          if (gs.landedIndex !== undefined) setLandedIndex(gs.landedIndex);
          if (gs.chosenType !== undefined) setChosenType(gs.chosenType);
          if (gs.todContent !== undefined) setTodContent(gs.todContent);
          if (gs.spinning !== undefined) setSpinning(gs.spinning);
        }
      } catch (e) {}
    }, 350);
    return () => clearInterval(interval);
  }, [roomCode]);

  const sendRouletteSync = async (nextGS: any) => {
    if (!roomCode) return;
    try {
      const res = await fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: nextGS
        })
      });
      const data = await res.json();
      if (data.success && data.room?.gameState?.version) {
        lastSyncedVersionRef.current = data.room.gameState.version;
      }
    } catch (e) {}
  };

  const spin = () => {
    if (spinning) return;
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
    sendRouletteSync({ rotation: newRot, todPhase: 'spin', landedIndex: null, spinning: true });

    setTimeout(() => {
      setSpinning(false);
      setLandedIndex(target);
      sound.playChime();
      sendRouletteSync({ rotation: newRot, todPhase: 'choice', landedIndex: target, spinning: false });
    }, 3800);
  };

  const handlePickChoice = async (type: 'truth'|'dare') => {
    sound.playFlip();
    setChosenType(type);

    let seen: string[] = [];
    try {
      const stored = sessionStorage.getItem('obrolan_seen_tod');
      if (stored) seen = JSON.parse(stored);
    } catch (e) {}

    const isRemote = todType === 'jarakjauh' || Boolean(roomCode);
    const topicToFetch = type === 'truth' ? 'tod_truth' : (isRemote ? 'tod_dare_online' : 'tod_dare_offline');

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicToFetch, count: 5, exclude: seen })
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
      : (isRemote ? TOD_DARE_ONLINE : TOD_DARE_OFFLINE);

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
    setSpinning(false);
    sendRouletteSync({ todPhase: 'spin', landedIndex: null, chosenType: null, todContent: '', spinning: false });
  };

  const slices = Array.from({ length: playerCount }).map((_, i) => {
    const startAngle = (i * sliceDeg - 90) * Math.PI / 180;
    const endAngle = ((i + 1) * sliceDeg - 90) * Math.PI / 180;

    const x1 = cx + wheelRadius * Math.cos(startAngle);
    const y1 = cy + wheelRadius * Math.sin(startAngle);
    const x2 = cx + wheelRadius * Math.cos(endAngle);
    const y2 = cy + wheelRadius * Math.sin(endAngle);

    const largeArc = sliceDeg > 180 ? 1 : 0;
    const path = `M ${cx} ${cy} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    const midAngle = (i * sliceDeg + sliceDeg / 2 - 90) * Math.PI / 180;
    const textRadius = wheelRadius * 0.65;
    const tx = cx + textRadius * Math.cos(midAngle);
    const ty = cy + textRadius * Math.sin(midAngle);

    const textAngle = i * sliceDeg + sliceDeg / 2;

    return {
      path,
      tx,
      ty,
      textAngle,
      label: playerNames[i],
      color: sliceColors[i % sliceColors.length]
    };
  });

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center my-auto space-y-6">
      
      {/* ── PHASE 1: SPINNING WHEEL ────────────────────────────────────── */}
      {todPhase === 'spin' && (
        <div className="flex flex-col items-center space-y-6 animate-pop-in">
          {/* Wheel Container Box */}
          <div className="relative w-72 sm:w-84 aspect-square flex items-center justify-center select-none">
            {/* Top Fixed Indicator Needle */}
            <div className="absolute -top-3 z-30 flex flex-col items-center filter drop-shadow-lg">
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#CB6040]" />
              <div className="w-4 h-4 rounded-full bg-[#FAF3E0] -mt-6 border-2 border-[#CB6040]" />
            </div>

            {/* Stand Post */}
            <div className="absolute inset-y-3 w-7 bg-gradient-to-b from-[#257180] via-[#1d5966] to-[#257180] border-2 border-[#FAF3E0]/30 rounded-lg shadow-xl z-0" />

            {/* Wheel SVG Frame */}
            <div className="relative z-10 w-full aspect-square">
              <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="w-full h-full filter drop-shadow-2xl overflow-visible">
                
                {/* Rotates on Poros */}
                <g style={{
                  transition: spinning ? "transform 3.8s cubic-bezier(0.12, 0.85, 0.15, 1)" : "none",
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "200px 200px",
                }}>
                  {/* Outer Rim */}
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

                  {/* Inner Hub Rim */}
                  <circle cx={cx} cy={cy} r={46} fill="#FAF3E0" stroke="#FD8B51" strokeWidth={4} />
                  <circle cx={cx} cy={cy} r={34} fill="#257180" />
                  <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#FAF3E0" fontSize={16} fontWeight="900" fontFamily="Nunito, sans-serif">
                    TOD
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Action Spin Button */}
          <button
            onClick={spin}
            disabled={spinning}
            className={`px-10 py-4 rounded-2xl font-black text-lg text-white shadow-xl transition-all cursor-pointer ${spinning ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95'}`}
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
            {spinning ? "Memutar Roda..." : "Putar Roda Sekarang 🎯"}
          </button>
        </div>
      )}

      {/* ── PHASE 2: CHOICE (TRUTH OR DARE) ────────────────────────────── */}
      {todPhase === 'choice' && landedIndex !== null && (
        <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 border-4 border-[#FD8B51] shadow-2xl flex flex-col items-center text-center space-y-6 max-w-sm w-full animate-pop-in">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-[#CB6040] bg-[#FD8B51]/15 px-3 py-1 rounded-full">
              Pilihan Pemain
            </span>
            <h2 className="text-3xl font-black text-[#257180] tracking-tight">
              {playerNames[landedIndex]}!
            </h2>
            <p className="text-xs font-bold text-[#257180]/70">
              Roda berhenti di nama kamu. Sekarang pilih tantanganmu:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 w-full">
            <button
              onClick={() => handlePickChoice('truth')}
              className="py-5 px-3 rounded-2xl bg-[#257180] text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer">
              <span className="text-2xl">🤫</span>
              <span>Truth</span>
              <span className="text-[10px] font-bold text-white/70">Kejujuran</span>
            </button>

            <button
              onClick={() => handlePickChoice('dare')}
              className="py-5 px-3 rounded-2xl bg-[#CB6040] text-white font-black text-base shadow-lg hover:scale-105 active:scale-95 transition flex flex-col items-center justify-center gap-1 cursor-pointer">
              <span className="text-2xl">⚡</span>
              <span>Dare</span>
              <span className="text-[10px] font-bold text-white/70">Tantangan</span>
            </button>
          </div>
        </div>
      )}

      {/* ── PHASE 3: REVEAL CONTENT ────────────────────────────────────── */}
      {todPhase === 'reveal' && (
        <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 border-4 border-[#FD8B51] shadow-2xl flex flex-col items-center text-center space-y-6 max-w-md w-full animate-pop-in">
          <div className="w-full flex items-center justify-between border-b border-[#257180]/15 pb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-black text-white ${chosenType === 'truth' ? 'bg-[#257180]' : 'bg-[#CB6040]'}`}>
              {chosenType === 'truth' ? '🤫 KARTU TRUTH' : '⚡ KARTU DARE'}
            </span>
            <span className="text-xs font-black text-[#257180]">
              Untuk: {landedIndex !== null ? playerNames[landedIndex] : 'Pemain'}
            </span>
          </div>

          <div className="py-4 px-2">
            <p className="text-lg sm:text-xl font-black text-[#257180] leading-relaxed">
              "{todContent}"
            </p>
          </div>

          <button
            onClick={handleNextSpin}
            className="w-full py-4 rounded-2xl font-black text-base text-white shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer"
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
            Lanjut Putaran Berikutnya →
          </button>
        </div>
      )}

    </div>
  );
}

/* ── Main Game Screen ──────────────────────────────────────────────────────── */
function OfflineGame() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, getMergedSeenQuestions, syncSeenQuestions } = useAuth();

  const mode = searchParams.get('mode') as 'pertanyaan'|'tod' || 'pertanyaan';
  const todType = searchParams.get('todType') || 'tatapmuka';
  const topic = searchParams.get('topic') || 'kenalan';
  const totalRounds = parseInt(searchParams.get('rounds') || '3', 10);
  const roomCode = searchParams.get('roomCode') || undefined;
  const isHost = searchParams.get('isHost') !== 'false';
  const myName = searchParams.get('myName') || (typeof window !== 'undefined' ? sessionStorage.getItem('my_name') : '') || '';

  const rawPlayersParam = searchParams.get('players') || 'Pemain 1,Pemain 2';
  const playerNames = rawPlayersParam.split(',').map(s => s.trim()).filter(Boolean);

  const [currentRound, setCurrentRound] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);
  const [isQuestionsLoading, setIsQuestionsLoading] = useState<boolean>(mode === 'pertanyaan');

  const roundQuestionsRef = useRef<string[]>(roundQuestions);
  const allQuestionsRef = useRef<string[]>(allQuestions);
  const currentRoundRef = useRef<number>(currentRound);

  useEffect(() => { roundQuestionsRef.current = roundQuestions; }, [roundQuestions]);
  useEffect(() => { allQuestionsRef.current = allQuestions; }, [allQuestions]);
  useEffect(() => { currentRoundRef.current = currentRound; }, [currentRound]);

  // Poll room questions & round state for room players (350ms)
  useEffect(() => {
    if (!roomCode) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/room?code=${roomCode}`);
        const data = await res.json();
        if (data.success && data.room && data.room.gameState) {
          const gs = data.room.gameState;
          if (Array.isArray(gs.roundQuestions) && gs.roundQuestions.length > 0 && JSON.stringify(gs.roundQuestions) !== JSON.stringify(roundQuestionsRef.current)) {
            setRoundQuestions(gs.roundQuestions);
            setIsQuestionsLoading(false);
          }
          if (Array.isArray(gs.allQuestions) && gs.allQuestions.length > 0 && JSON.stringify(gs.allQuestions) !== JSON.stringify(allQuestionsRef.current)) {
            setAllQuestions(gs.allQuestions);
          }
          if (typeof gs.currentRound === 'number' && gs.currentRound !== currentRoundRef.current) {
            setCurrentRound(gs.currentRound);
          }
        }
      } catch (e) {}
    }, 350);
    return () => clearInterval(interval);
  }, [roomCode]);

  useEffect(() => {
    async function loadFreshAIQuestions() {
      // Non-host in online room: wait for Host to generate and broadcast questions
      if (roomCode && !isHost) {
        setIsQuestionsLoading(true);
        try {
          const roomRes = await fetch(`/api/room?code=${roomCode}`);
          const roomData = await roomRes.json();
          if (roomData.success && roomData.room?.gameState?.roundQuestions) {
            const gs = roomData.room.gameState;
            setRoundQuestions(gs.roundQuestions);
            if (gs.allQuestions) setAllQuestions(gs.allQuestions);
            setIsQuestionsLoading(false);
            return;
          }
        } catch (e) {}
        return;
      }

      setIsQuestionsLoading(true);

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
      // Normalize: strip quotes, punctuation, extra spaces for fuzzy dedup
      const normalizeQ = (s: string) => s.trim().toLowerCase().replace(/["'"'`”«»]/g, '').replace(/[?.!,;:]/g, '').replace(/\s+/g, ' ');
      const seenSet = new Set(seen.map(s => normalizeQ(String(s))));

      // Gemini cache helpers
      const CACHE_KEY = `obrolan_q_cache_${topic}`;
      const CACHE_MAX = 500;

      const readCache = (): string[] => {
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          return raw ? JSON.parse(raw) : [];
        } catch { return []; }
      };

      const writeCache = (incoming: string[]) => {
        try {
          const existing = readCache();
          const merged = Array.from(new Set([...existing, ...incoming]));
          const trimmed = merged.slice(-CACHE_MAX);
          localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
        } catch {}
      };

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
          body: JSON.stringify({ topic, customPrompt: aiPromptParam, count: totalNeeded + 15, exclude: seen })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          const pool: string[] = cleanPool(data.questions as string[]).filter(q => !seenSet.has(normalizeQ(q)));
          if (pool.length > 0) {
            selectedQuestions = shuffle(pool);
            writeCache(data.questions as string[]);
          }
        }
      } catch (e) {
        console.warn('Gemini API call failed, falling back to local cache:', e);
      }

      // Fallback 1: Local Gemini cache
      if (selectedQuestions.length < totalNeeded) {
        const cachedPool = cleanPool(readCache());
        const unseenCached = cachedPool.filter(q => !seenSet.has(normalizeQ(q)));
        const merged = Array.from(new Set([...selectedQuestions, ...unseenCached]));
        if (merged.length > 0) {
          selectedQuestions = shuffle(merged);
        }
      }

      // Fallback 2: Static master bank (600+ Indonesian questions)
      if (selectedQuestions.length < totalNeeded) {
        const primaryBank = cleanPool(QUESTION_BANKS[topic] || QUESTION_BANKS['kenalan']);
        const allBanks = topic === 'mix'
          ? cleanPool(Object.values(QUESTION_BANKS).flat() as string[])
          : primaryBank;
        
        // Filter strictly unseen static questions with fuzzy normalizeQ
        const unseenStatic = shuffle(allBanks.filter(q => !seenSet.has(normalizeQ(q))));
        const mergedStatic = Array.from(new Set([...selectedQuestions, ...unseenStatic]));

        if (mergedStatic.length >= totalNeeded) {
          selectedQuestions = shuffle(mergedStatic).slice(0, totalNeeded);
        } else {
          const needed = totalNeeded - mergedStatic.length;
          const procedural = generateProceduralQuestions(topic, Math.max(needed, 10), seenSet);
          selectedQuestions = shuffle([...mergedStatic, ...procedural]).slice(0, totalNeeded);
        }
      }

      // Strict fuzzy deduplication within the single session array
      const makeFuzzyUnique = (arr: string[]): string[] => {
        const seenNorms = new Set<string>();
        const result: string[] = [];
        for (const q of arr) {
          if (!q) continue;
          const norm = normalizeQ(q);
          if (!seenNorms.has(norm)) {
            seenNorms.add(norm);
            result.push(q);
          }
        }
        return result;
      };

      // Always ensure final pool has exactly totalNeeded unique questions
      let uniquePool = makeFuzzyUnique(selectedQuestions);
      const sessionDedupSet = new Set<string>([...seenSet, ...uniquePool.map(normalizeQ)]);

      while (uniquePool.length < totalNeeded) {
        const needed = totalNeeded - uniquePool.length;
        const fillProcedural = generateProceduralQuestions(topic, needed + 5, sessionDedupSet);
        if (fillProcedural.length === 0) break;
        for (const q of fillProcedural) {
          const norm = normalizeQ(q);
          if (!sessionDedupSet.has(norm)) {
            sessionDedupSet.add(norm);
            uniquePool.push(q);
          }
          if (uniquePool.length >= totalNeeded) break;
        }
      }

      selectedQuestions = shuffle(uniquePool).slice(0, totalNeeded);

      const firstRoundQs = selectedQuestions.slice(0, playerNames.length);
      setAllQuestions(selectedQuestions);
      setRoundQuestions(firstRoundQs);
      setIsQuestionsLoading(false);

      // Broadcast questions to room so ALL devices get 100% identical questions
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
                currentRound: 1,
                activeModalIndex: null,
                activeQuestionText: '',
                dismissed: new Array(playerNames.length).fill(false),
                activePlayerIndex: 0
              }
            })
          });
        } catch (e) {}
      }
    }

    loadFreshAIQuestions();
  }, [topic, totalRounds, playerNames.length, roomCode, isHost]);

  const handleNextRound = () => {
    const next = currentRound + 1;
    setCurrentRound(next);
    const start = (next - 1) * playerNames.length;
    const nextRoundQs = allQuestions.slice(start, start + playerNames.length);
    setRoundQuestions(nextRoundQs);

    if (roomCode) {
      const resetDismissed = new Array(playerNames.length).fill(false);
      fetch('/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: roomCode,
          gameState: {
            currentRound: next,
            roundQuestions: nextRoundQs,
            activeModalIndex: null,
            activeQuestionText: '',
            dismissed: resetDismissed,
            activePlayerIndex: 0
          }
        })
      });
    }
  };

  const handleBackToLobby = async () => {
    if (roomCode) {
      try {
        await fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: roomCode,
            status: 'lobby',
            gameState: {
              currentRound: 1,
              activeModalIndex: null,
              activeQuestionText: '',
              dismissed: new Array(playerNames.length).fill(false),
              activePlayerIndex: 0
            }
          })
        });
      } catch (e) {}
      router.push(`/play/room/${roomCode}?isHost=${isHost ? 'true' : 'false'}&myName=${encodeURIComponent(myName)}`);
    } else {
      router.push('/play/offline');
    }
  };

  const handleReset = () => {
    if (roomCode) {
      handleBackToLobby();
    } else {
      router.push('/play/offline');
    }
  };

  const handleFinish = () => {
    if (roomCode) {
      handleBackToLobby();
    } else {
      router.push('/play/offline');
    }
  };

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
    ? `Truth or Dare (${todType === 'jarakjauh' || roomCode ? 'Jarak Jauh' : 'Tatap Muka'})`
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
        {isQuestionsLoading && mode === 'pertanyaan' ? (
          <div className="flex flex-col items-center justify-center my-auto py-16 gap-3">
            <div className="w-10 h-10 border-3 border-[#257180]/20 border-t-[#FD8B51] rounded-full animate-spin" />
            <span className="text-xs font-black text-[#257180]/70">Menyiapkan kartu obrolan...</span>
          </div>
        ) : mode === 'pertanyaan' ? (
          <AllCardsDisplay
            playerNames={playerNames}
            questions={roundQuestions}
            onRoundComplete={handleNextRound}
            onBackToLobby={handleBackToLobby}
            round={currentRound}
            totalRounds={totalRounds}
            activePlayerIndex={activePlayerIndex}
            setActivePlayerIndex={setActivePlayerIndex}
            roomCode={roomCode}
            topic={topic}
            myName={myName}
          />
        ) : (
          <SpinnerWheelFlow
            playerNames={playerNames}
            todType={todType}
            onFinish={handleFinish}
            roomCode={roomCode}
            myName={myName}
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

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F2E5BF] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#257180]/20 border-t-[#FD8B51] rounded-full animate-spin" />
      </div>
    }>
      <OfflineGame />
    </Suspense>
  );
}
