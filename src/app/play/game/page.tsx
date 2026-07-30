"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { RotateCcw, CheckSquare, Volume2, VolumeX, Check } from 'lucide-react';
import { QUESTION_BANKS } from '../offline/page';
import { sound } from '@/utils/sound';

/* Official User Color Palette (Warm Sunset Tones - Zero Cold White) */
const C = {
  teal: "#257180",
  sand: "#F2E5BF",
  linen: "#FAF3E0",
  orange: "#FD8B51",
  rust: "#CB6040",
  muted: "#6B8E94",
};

const CARD_COLORS = [
  "linear-gradient(150deg, #FD8B51 0%, #E0733C 100%)", // Sunset Orange
  "linear-gradient(150deg, #CB6040 0%, #9E452A 100%)", // Terracotta Rust
  "linear-gradient(150deg, #E8A246 0%, #D4882C 100%)", // Warm Gold Sand
  "linear-gradient(150deg, #D97736 0%, #B8581E 100%)", // Autumn Amber
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

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

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
    <nav className="w-full max-w-4xl mx-auto px-4 pt-3 sticky top-0 z-30">
      <div className="bg-[#FAF3E0]/95 backdrop-blur-md border-2 border-[#FD8B51]/30 rounded-full px-5 py-2.5 shadow-lg shadow-orange-950/10 grid grid-cols-3 items-center w-full">
        {/* Col 1: Reset Button */}
        <div className="justify-self-start">
          <button onClick={() => { sound.playClick(); onReset(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] active:scale-95 transition shadow-sm cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        {/* Col 2: Center Title & Turn */}
        <div className="justify-self-center text-center flex flex-col items-center">
          <div className="font-black text-xs sm:text-sm text-[#257180] tracking-tight leading-tight">{title}</div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[#257180]/80 mt-0.5 whitespace-nowrap">
            <span>Ronde {round}/{totalRounds}</span>
            {!isTod && (
              <>
                <span>·</span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-[#FD8B51]/20 text-[#CB6040] border border-[#FD8B51]/30">
                  Giliran {activePlayerName}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Col 3: Audio & Finish */}
        <div className="justify-self-end flex items-center gap-1.5">
          <button onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black text-[#257180] bg-[#F2E5BF] border border-[#257180]/20 hover:bg-[#ebdcae] active:scale-95 transition shadow-sm cursor-pointer">
            {soundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundOn ? "Suara" : "Mute"}</span>
          </button>
          <button onClick={() => { sound.playClick(); onFinish(); }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black text-[#FAF3E0] bg-[#257180] hover:bg-[#1d5966] active:scale-95 transition shadow-md cursor-pointer">
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
  const { w, h, symbolSize, fontBtn } = getCardDimensions(playerCount);
  const bg = CARD_COLORS[index % CARD_COLORS.length];

  return (
    <div className={`group cursor-pointer transition-all duration-300 hover:-translate-y-2.5 hover:scale-105 active:scale-95 flex flex-col items-center ${dismissed ? 'animate-shrink-out' : 'animate-pop-in'}`}
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
  playerNames, questions, onRoundComplete, round, totalRounds, activePlayerIndex, setActivePlayerIndex
}: {
  playerNames: string[]; questions: string[];
  onRoundComplete: () => void; round: number; totalRounds: number;
  activePlayerIndex: number; setActivePlayerIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const playerCount = playerNames.length;
  const [dismissed, setDismissed] = useState<boolean[]>(new Array(playerCount).fill(false));
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

  const allDone = dismissed.every(Boolean);

  useEffect(() => {
    setDismissed(new Array(playerCount).fill(false));
    setActiveModalIndex(null);
  }, [round, playerCount]);

  const handleOpenCard = (index: number) => {
    if (dismissed[index]) return;
    sound.playFlip();
    setActiveModalIndex(index);
  };

  const handleLanjut = () => {
    if (activeModalIndex === null) return;
    sound.playClick();
    setIsClosingModal(true);

    setTimeout(() => {
      const targetIdx = activeModalIndex;
      setDismissed(prev => {
        const next = [...prev];
        next[targetIdx] = true;
        if (next.every(Boolean)) setTimeout(() => sound.playChime(), 150);
        return next;
      });

      setActivePlayerIndex(prev => (prev + 1) % playerCount);
      setActiveModalIndex(null);
      setIsClosingModal(false);
    }, 280);
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

      {/* ── SLEEK LONG PORTRAIT PLAYING CARD SPOTLIGHT MODAL ─────────────── */}
      {activeModalIndex !== null && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-[#257180]/50 backdrop-blur-md transition-opacity duration-300 ${isClosingModal ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

          {/* Long Portrait Rectangular Card */}
          {(() => {
            const cardBg = CARD_COLORS[activeModalIndex % CARD_COLORS.length];
            return (
              <div className={`relative w-[320px] sm:w-[360px] h-[500px] sm:h-[540px] rounded-[32px] overflow-hidden p-7 flex flex-col items-center justify-between transition-all duration-300 ${isClosingModal ? 'scale-90 opacity-0' : 'animate-card-flip-pop'}`}
                style={{
                  background: cardBg,
                  border: "3.5px solid #F2E5BF",
                  boxShadow: "0 35px 90px rgba(0,0,0,0.38)"
                }}>

                {/* Card Top Header */}
                <div className="relative z-10 w-full flex items-center justify-between text-[#F2E5BF]/80 text-xs font-black">
                  <div className="flex items-center gap-1.5">
                    <span>♥</span>
                    <span className="text-xs font-bold text-[#F2E5BF]">Pertanyaan untuk {activeName}</span>
                  </div>
                  <span>♦</span>
                </div>

                {/* Question Container Box (Warm Sand - ZERO COLD WHITE) */}
                <div className="relative z-10 my-auto text-center w-full px-6 py-9 rounded-3xl bg-[#F2E5BF] shadow-xl border-2 border-[#FD8B51]/40">
                  <p className="text-xl sm:text-2xl font-black text-[#257180] leading-relaxed tracking-tight">
                    {questions[activeModalIndex] || "Siapa teman yang paling sering janji 'otw' padahal baru banget bangun tidur?"}
                  </p>
                </div>

                {/* Card Bottom Footer */}
                <div className="relative z-10 w-full flex items-center justify-between text-xs font-black text-[#F2E5BF]/90">
                  <span>ObrolanSeru</span>
                  <span>✦</span>
                </div>
              </div>
            );
          })()}

          {/* Action Button */}
          <button
            onClick={handleLanjut}
            className="mt-6 px-10 py-4 rounded-2xl font-black text-base text-white flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer z-50"
            style={{
              background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)",
              boxShadow: "0 10px 30px rgba(253, 139, 81, 0.4)"
            }}>
            <span>Pemain Selanjutnya</span>
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── REAL-LIFE ROULETTE WHEEL WITH PILLAR STAND & TOP POINTER STOPPER ─────── */
function SpinnerWheelFlow({
  playerNames, todType, onRoundComplete
}: {
  playerNames: string[]; todType: string; onRoundComplete: () => void;
}) {
  const playerCount = playerNames.length;
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [landedIndex, setLandedIndex] = useState<number | null>(null);
  const [todPhase, setTodPhase] = useState<'spin'|'choice'|'reveal'>('spin');
  const [chosenType, setChosenType] = useState<'truth'|'dare'|null>(null);
  const [todContent, setTodContent] = useState<string>('');

  const sliceColors = [C.orange, C.teal, C.rust, "#E8A246", "#D97736", C.orange];
  
  // Vector-perfect SVG viewBox 400x400
  const VIEWBOX_SIZE = 400;
  const cx = 200;
  const cy = 200;
  const wheelRadius = 170;
  const sliceDeg = 360 / playerCount;

  const spin = () => {
    if (spinning) return;
    setLandedIndex(null);
    setSpinning(true);
    sound.playFlip();

    // 1. Pick a random player target index
    const target = Math.floor(Math.random() * playerCount);
    
    // 2. Add an organic random offset inside the slice (between -30% and +30% of slice width)
    const offsetInSlice = (Math.random() * 0.6 - 0.3) * sliceDeg;
    
    // 3. Center angle of target slice relative to top (12 o'clock)
    const sliceCenterAngle = target * sliceDeg + sliceDeg / 2 + offsetInSlice;
    
    // 4. Calculate exact clockwise rotation needed to bring target center under top pointer
    const delta = (360 - (sliceCenterAngle % 360) + 360) % 360;
    
    // 5. Add 5 full extra rotations (1800 deg) for spin excitement
    const baseRot = Math.ceil(rotation / 360) * 360;
    const newRot = baseRot + 1800 + delta;
    
    setRotation(newRot);

    setTimeout(() => {
      setSpinning(false);
      setLandedIndex(target);
      sound.playChime();
    }, 3800);
  };

  const handlePickChoice = async (type: 'truth'|'dare') => {
    sound.playFlip();
    setChosenType(type);

    const topicKey = type === 'truth'
      ? 'tod_truth'
      : (todType === 'jarakjauh' ? 'tod_dare_online' : 'tod_dare_offline');

    let seen: string[] = [];
    try {
      const stored = sessionStorage.getItem('obrolan_seen_tod');
      if (stored) seen = JSON.parse(stored);
    } catch (e) {}

    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicKey, count: 1, exclude: seen })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
        const item = data.questions[0];
        setTodContent(item);
        setTodPhase('reveal');
        try {
          sessionStorage.setItem('obrolan_seen_tod', JSON.stringify([...seen, item]));
        } catch (e) {}
        return;
      }
    } catch (e) {
      console.warn("Falling back to local TOD bank:", e);
    }

    const fallbackBank = type === 'truth'
      ? TOD_TRUTH
      : (todType === 'jarakjauh' ? TOD_DARE_ONLINE : TOD_DARE_OFFLINE);
    const randomItem = fallbackBank[Math.floor(Math.random() * fallbackBank.length)];
    setTodContent(randomItem);
    setTodPhase('reveal');
  };

  const handleNextTurn = () => {
    sound.playClick();
    setTodPhase('spin');
    setLandedIndex(null);
    setChosenType(null);
  };

  // Generate vector slices + brass rivets inside exact SVG math
  const slices = Array.from({ length: playerCount }).map((_, i) => {
    const startDeg = i * sliceDeg - 90;
    const endDeg = (i + 1) * sliceDeg - 90;
    const toRad = (d: number) => d * Math.PI / 180;
    const x1 = cx + wheelRadius * Math.cos(toRad(startDeg));
    const y1 = cy + wheelRadius * Math.sin(toRad(startDeg));
    const x2 = cx + wheelRadius * Math.cos(toRad(endDeg));
    const y2 = cy + wheelRadius * Math.sin(toRad(endDeg));
    const largeArc = sliceDeg > 180 ? 1 : 0;
    const midDeg = (i + 0.5) * sliceDeg - 90;
    const textR = wheelRadius * 0.62;
    const tx = cx + textR * Math.cos(toRad(midDeg));
    const ty = cy + textR * Math.sin(toRad(midDeg));
    const textAngle = midDeg + 90;

    return {
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${wheelRadius} ${wheelRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      tx, ty, textAngle,
      color: sliceColors[i % sliceColors.length],
      label: playerNames[i] || `Pemain ${i + 1}`,
    };
  });

  // Brass studs evenly placed along outer rim inside SVG
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
      
      {/* PHASE 1: Real-Life Roulette Wheel with Stand & Top Stopper Pin */}
      {todPhase === 'spin' && (
        <div className="flex flex-col items-center gap-5 w-full my-auto animate-pop-in">
          
          {/* Wheel Assembly Container */}
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

            {/* Rotating Wheel Frame (Spins 100% on Central Axle Poros) */}
            <div className="relative z-10 w-full aspect-square">
              <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="w-full h-full filter drop-shadow-2xl overflow-visible"
                style={{
                  display: "block",
                  transition: spinning ? "transform 3.8s cubic-bezier(0.12, 0.85, 0.15, 1)" : "none",
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "center center",
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
              </svg>
            </div>

            {/* Solid Heavy Base Stand at Bottom (Static) */}
            <div className="relative z-20 w-40 sm:w-44 h-7 bg-gradient-to-r from-[#257180] via-[#1d5966] to-[#257180] rounded-t-2xl border-t-2 border-[#FAF3E0]/40 shadow-xl flex items-center justify-center -mt-3.5">
              <div className="w-20 sm:w-24 h-1.5 bg-[#FD8B51] rounded-full opacity-80" />
            </div>
          </div>

          <button onClick={spin} disabled={spinning}
            className="px-12 py-4 rounded-2xl font-black text-base text-white shadow-xl hover:scale-105 active:scale-95 disabled:opacity-60 transition cursor-pointer"
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)", boxShadow: "0 10px 30px rgba(253, 139, 81, 0.4)" }}>
            {spinning ? "Memutar Roulette..." : "Putar Roulette Wheel"}
          </button>
          {landedIndex !== null && (
            <div className="text-center p-6 rounded-3xl bg-[#FAF3E0] border-2 border-[#FD8B51] shadow-xl animate-pop-in space-y-4">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-[#257180]/70">Terpilih Kena Tantangan</div>
                <div className="text-3xl font-black text-[#CB6040] mt-0.5">{selectedName}</div>
              </div>
              <button
                onClick={() => { sound.playClick(); setTodPhase('choice'); }}
                className="px-8 py-3.5 rounded-xl font-black text-sm text-white bg-[#257180] hover:bg-[#1d5966] transition shadow-md cursor-pointer">
                Pilih Tantangan (Truth / Dare) →
              </button>
            </div>
          )}
        </div>
      )}

      {/* PHASE 2: Choice between TRUTH or DARE (Enlarged Grand Playing Cards) */}
      {todPhase === 'choice' && (
        <div className="text-center space-y-6 animate-pop-in max-w-lg w-full px-4 my-auto">
          <div>
            <div className="text-xs font-black text-[#257180]/70 uppercase tracking-widest">Giliran Tantangan</div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#257180] mt-1">{selectedName}, Pilih Mana?</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {/* TRUTH Card (Enlarged Sleek Grand Playing Card) */}
            <button onClick={() => handlePickChoice('truth')}
              className="relative h-80 sm:h-88 rounded-[30px] p-6 flex flex-col items-center justify-between border-3 border-[#FAF3E0] shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer overflow-hidden group"
              style={{ background: "linear-gradient(150deg, #FD8B51 0%, #CB6040 100%)" }}>
              <div className="absolute inset-3 rounded-[20px] border border-[#FAF3E0]/30 pointer-events-none" />
              
              <div className="w-full flex justify-between text-xs font-black text-white/70">
                <span>♥</span><span>♠</span>
              </div>
              <div className="text-center text-white my-auto z-10">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">TRUTH</div>
                <div className="text-xs sm:text-sm font-bold text-white/90 mt-2">Jawab Jujur</div>
              </div>
              <span className="px-6 py-2.5 rounded-full text-xs font-black text-[#257180] bg-[#FAF3E0] shadow-md group-hover:bg-[#257180] group-hover:text-[#FAF3E0] transition-all z-10">
                Buka Kartu
              </span>
            </button>

            {/* DARE Card (Enlarged Sleek Grand Playing Card) */}
            <button onClick={() => handlePickChoice('dare')}
              className="relative h-80 sm:h-88 rounded-[30px] p-6 flex flex-col items-center justify-between border-3 border-[#FAF3E0] shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer overflow-hidden group"
              style={{ background: "linear-gradient(150deg, #CB6040 0%, #8A3720 100%)" }}>
              <div className="absolute inset-3 rounded-[20px] border border-[#FAF3E0]/30 pointer-events-none" />
              
              <div className="w-full flex justify-between text-xs font-black text-white/70">
                <span>♦</span><span>♣</span>
              </div>
              <div className="text-center text-white my-auto z-10">
                <div className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">DARE</div>
                <div className="text-xs sm:text-sm font-bold text-white/90 mt-2">Lakukan Tantangan</div>
              </div>
              <span className="px-6 py-2.5 rounded-full text-xs font-black text-[#257180] bg-[#FAF3E0] shadow-md group-hover:bg-[#257180] group-hover:text-[#FAF3E0] transition-all z-10">
                Buka Kartu
              </span>
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: Reveal Truth / Dare Rectangular Card */}
      {todPhase === 'reveal' && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-4 bg-[#257180]/55 backdrop-blur-md">
          
          {/* Long Portrait Rectangular Card */}
          <div className="relative w-[340px] sm:w-[390px] h-[520px] sm:h-[560px] rounded-[36px] overflow-hidden p-8 flex flex-col items-center justify-between transition-all duration-300 animate-card-flip-pop shadow-2xl"
            style={{
              background: chosenType === 'truth' ? "linear-gradient(150deg, #FD8B51 0%, #CB6040 100%)" : "linear-gradient(150deg, #CB6040 0%, #8A3720 100%)",
              border: "3.5px solid #FAF3E0"
            }}>
            
            {/* Single Clean Inner Frame Line */}
            <div className="absolute inset-3 rounded-[26px] border border-[#FAF3E0]/35 pointer-events-none z-10" />

            {/* Header */}
            <div className="relative z-10 w-full flex items-center justify-between text-[#FAF3E0]/90 text-xs font-black">
              <span>{chosenType === 'truth' ? 'TRUTH' : 'DARE'}</span>
              <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#FAF3E0]/20 text-[#FAF3E0]">
                {selectedName}
              </span>
            </div>

            {/* Question / Challenge Box (Warm Sand - ZERO COLD WHITE) */}
            <div className="relative z-10 my-auto text-center w-full px-6 py-9 rounded-3xl bg-[#F2E5BF] shadow-xl border-2 border-[#FD8B51]/40">
              <p className="text-xl sm:text-2xl font-black text-[#257180] leading-relaxed tracking-tight">
                {todContent}
              </p>
            </div>

            {/* Footer */}
            <div className="relative z-10 w-full flex items-center justify-between text-xs font-black text-[#FAF3E0]/90">
              <span>ObrolanSeru</span>
              <span>✦</span>
            </div>
          </div>

          <button
            onClick={handleNextTurn}
            className="mt-6 px-10 py-4 rounded-2xl font-black text-base text-white flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition cursor-pointer z-50"
            style={{ background: "linear-gradient(135deg, #FD8B51 0%, #CB6040 100%)" }}>
            <span>Pemain Selanjutnya</span>
            <Check className="w-5 h-5 stroke-[3]" />
          </button>
        </div>
      )}

    </div>
  );
}

/* ── Main Game Screen (Strictly Single Viewport Fit + Footer) ───────────────── */
function OfflineGame() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const mode = searchParams.get('mode') as 'pertanyaan'|'tod' || 'pertanyaan';
  const todType = searchParams.get('todType') || 'tatapmuka';
  const topic = searchParams.get('topic') || 'kenalan';
  const totalRounds = parseInt(searchParams.get('rounds') || '3', 10);
  
  const rawPlayersParam = searchParams.get('players') || 'Pemain 1,Pemain 2';
  const playerNames = rawPlayersParam.split(',').map(s => s.trim()).filter(Boolean);

  const [currentRound, setCurrentRound] = useState(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundQuestions, setRoundQuestions] = useState<string[]>([]);
  const [allQuestions, setAllQuestions] = useState<string[]>([]);

  useEffect(() => {
    async function loadFreshAIQuestions() {
      const totalNeeded = totalRounds * playerNames.length;
      let seen: string[] = [];
      try {
        const stored = sessionStorage.getItem('obrolan_seen_questions');
        if (stored) seen = JSON.parse(stored);
      } catch (e) {
        console.warn("sessionStorage read error:", e);
      }

      try {
        const res = await fetch('/api/generate-questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, count: totalNeeded, exclude: seen })
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions) && data.questions.length > 0) {
          const pool: string[] = shuffle(data.questions as string[]);
          setAllQuestions(pool);
          setRoundQuestions(pool.slice(0, playerNames.length));

          try {
            const updatedSeen = Array.from(new Set([...seen, ...pool]));
            sessionStorage.setItem('obrolan_seen_questions', JSON.stringify(updatedSeen));
          } catch (e) {}
          return;
        }
      } catch (e) {
        console.warn("Falling back to local pool:", e);
      }

      // Fallback if API fails
      const bank = QUESTION_BANKS[topic] || QUESTION_BANKS['kenalan'];
      const pool: string[] = [];
      while (pool.length < totalNeeded) pool.push(...shuffle(bank));
      const selected = pool.slice(0, totalNeeded);
      setAllQuestions(selected);
      setRoundQuestions(selected.slice(0, playerNames.length));
    }

    loadFreshAIQuestions();
  }, [topic, totalRounds, playerNames.length]);

  const handleNextRound = () => {
    const next = currentRound + 1;
    setCurrentRound(next);
    const start = (next - 1) * playerNames.length;
    setRoundQuestions(allQuestions.slice(start, start + playerNames.length));
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
          />
        ) : (
          <SpinnerWheelFlow
            playerNames={playerNames}
            todType={todType}
            onRoundComplete={handleNextRound}
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
