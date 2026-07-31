"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Heart, Smile, Sparkles, Compass, Moon, Home as HomeIcon, Clock, Rocket, Shuffle, MessageSquare, Dices, User, Users, Globe, Lock } from 'lucide-react';
import { sound } from '@/utils/sound';
import { useAuth } from '@/context/AuthContext';
import { LockedFeatureModal } from '@/app/components/LockedFeatureModal';

const C = {
  teal: "#257180",
  sand: "#F2E5BF",
  linen: "#FAF3E0",
  orange: "#FD8B51",
  rust: "#CB6040",
  muted: "#6B8E94",
};

const TOPICS = [
  { id: "kenalan",   name: "Kenalan Dulu",    desc: "Obrolan santai ketemu teman baru", icon: Smile, free: true },
  { id: "mix",       name: "Acak Topik",      desc: "Campuran semua topik seru",        icon: Shuffle, free: true },
  { id: "absurd",    name: "Absurd Abis",     desc: "Pertanyaan random & kocak",        icon: Sparkles, free: false },
  { id: "deep",      name: "Deep Talk",       desc: "Diskusi bermakna & personal",      icon: Moon, free: false },
  { id: "pasangan",  name: "Khusus Pasangan", desc: "Topik romantis buat couple",       icon: Heart, free: false },
  { id: "keluarga",  name: "Keluarga",        desc: "Obrolan hangat sekeluarga",         icon: HomeIcon, free: false },
  { id: "nostalgia", name: "Nostalgia",       desc: "Masa kecil & kenangan lalu",       icon: Clock, free: false },
  { id: "whatif",    name: "What If...?",     desc: "Skenario imajinatif",              icon: Compass, free: false },
  { id: "karir",     name: "Karir & Mimpi",   desc: "Cita-cita & perjalanan hidup",     icon: Rocket, free: false },
];

export const QUESTION_BANKS: Record<string, string[]> = {
  kenalan: [
    "Kalau hidup kamu dijadikan film bioskop, judulnya apa dan siapa aktor yang meranakan kamu?",
    "Siapa teman yang paling sering janji 'otw' padahal sebenarnya baru banget bangun tidur?",
    "Hal konyol apa yang membuat kamu tertawa paling keras dalam sebulan terakhir ini?",
    "Satu kebiasaan unik yang hanya kamu sendiri yang tahu dan tidak pernah dijelaskan ke orang lain?",
    "Makanan apa yang paling kamu benci waktu kecil tapi sekarang malah jadi favorit?",
    "Kalau besok kamu mendapat uang 1 miliar tanpa syarat, hal pertama yang dibeli apa?",
    "Fakta paling random atau bakat rahasia tentang diri kamu yang belum pernah diceritakan?",
    "Kalau bisa tukar nasib dan hidup 1 hari jadi orang lain di dunia ini, kamu pilih siapa?"
  ],
  absurd: [
    "Kalau kedua tangan kamu bisa berbicara sendiri, kalimat pertama yang diucapkan apa?",
    "Kalau terpaksa harus tinggal selamanya di dalam sebuah video game, game apa yang kamu pilih?",
    "Pilih mana: bisa terbang tapi hanya setinggi 10 cm dari tanah, atau bisa teleportasi tapi hanya 1 meter?",
    "Kalau kamu berubah menjadi varian makanan atau minuman, kamu jadi rasa apa dan kenapa?",
    "Hal paling konyol yang pernah kamu percayai 100 persen saat masih berumur 7 tahun?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget diceritakan ke orang lain?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir kamu sampai hari ini?",
    "Kalau bisa mengirim satu kalimat pesan ke diri kamu sendiri 10 tahun lalu, apa isinya?",
    "Menurut pandangan kamu pribadi, definisi sukses yang benar-benar membuat kamu bahagia seperti apa?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering membuat kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah membuat kangen?",
    "Apa hal pertama yang membuat kamu yakin untuk membuka hati dan mendekat ke aku dulu?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung membuat kamu flashback ke masa lalu?",
    "Tontonan kartun, anime, atau acara televisi hari Minggu favorit kamu saat masih sekolah dulu?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan susah dicari sekarang?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan lucu apa yang hanya ada dan dilakukan di dalam keluarga kamu?",
    "Nasihat dari orang tua atau sesepuh yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah apa yang paling dikangenin saat sedang jauh dari rumah?"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100 percent?"
  ],
  karir: [
    "Apa cita-cita atau mimpi terbesar kamu yang belum sempat diwujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah dan finansial kamu sudah terjamin 100 percent, pekerjaan apa yang kamu tekuni?",
    "Pencapaian atau karya apa yang paling membuat kamu merasa puas dalam perjalanan karir atau perkuliahan?"
  ]
};

QUESTION_BANKS['mix'] = [
  ...QUESTION_BANKS.kenalan,
  ...QUESTION_BANKS.absurd,
  ...QUESTION_BANKS.deep,
  ...QUESTION_BANKS.pasangan,
  ...QUESTION_BANKS.nostalgia,
  ...QUESTION_BANKS.keluarga,
  ...QUESTION_BANKS.whatif,
  ...QUESTION_BANKS.karir,
];

function Header({ onBack, stepIndex, totalSteps }: { onBack: () => void; stepIndex: number; totalSteps: number }) {
  return (
    <header className="w-full max-w-xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between">
      <button onClick={() => { sound.playClick(); onBack(); }}
        className="w-10 h-10 rounded-xl bg-[#FAF3E0] border border-[#257180]/15 text-[#257180] flex items-center justify-center hover:bg-[#FAF3E0]/80 transition cursor-pointer">
        <ArrowLeft className="w-5 h-5" />
      </button>

      <div className="px-4 py-1.5 rounded-full bg-[#FAF3E0] border border-[#257180]/15 text-xs font-black text-[#257180]">
        Langkah {stepIndex + 1} dari {totalSteps}
      </div>

      <Link href="/" className="w-10 h-10 rounded-xl bg-[#FAF3E0] border border-[#257180]/15 text-[#257180] flex items-center justify-center hover:bg-[#FAF3E0]/80 transition">
        <RotateCcw className="w-4 h-4" />
      </Link>
    </header>
  );
}

export default function OfflineSetup() {
  const router = useRouter();
  const { user, isPremium } = useAuth();

  const [step, setStep] = useState<'mode'|'todType'|'players'|'rounds'|'topic'>('mode');
  const [selectedMode, setSelectedMode] = useState<'pertanyaan'|'tod'>('pertanyaan');
  const [todType, setTodType] = useState<'tatapmuka'|'jarakjauh'>('tatapmuka');
  const [selectedTopic, setSelectedTopic] = useState<string|null>('kenalan');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState<string[]>(['Pemain 1', 'Pemain 2']);
  const [rounds, setRounds] = useState(3);
  const [lockedModalTitle, setLockedModalTitle] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setPlayerNames(prev => {
        const next = [...prev];
        if (!next[0] || next[0] === 'Pemain 1') {
          next[0] = user.name;
        }
        return next;
      });
    }
  }, [user]);

  const MAX_PLAYERS = 8;
  const MAX_ROUNDS = 20;

  const handlePlayerCountChange = (newCount: number) => {
    setPlayerCount(newCount);
    setPlayerNames(prev => {
      const next = [...prev];
      if (newCount > next.length) {
        for (let i = next.length; i < newCount; i++) {
          next.push(`Pemain ${i + 1}`);
        }
      } else {
        next.length = newCount;
      }
      return next;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setPlayerNames(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const stepOrder: Array<'mode'|'todType'|'players'|'rounds'|'topic'> =
    selectedMode === 'pertanyaan'
      ? ['mode', 'players', 'rounds', 'topic']
      : ['mode', 'todType', 'players', 'rounds'];

  const stepIndex = stepOrder.indexOf(step);

  const goBack = () => {
    if (stepIndex <= 0) router.push('/');
    else setStep(stepOrder[stepIndex - 1]);
  };

  const goNext = () => {
    sound.playClick();
    if (stepIndex < stepOrder.length - 1) setStep(stepOrder[stepIndex + 1]);
    else handleStart();
  };

  const handleStart = () => {
    sound.playChime();
    const cleanNames = playerNames.map((n, i) => n.trim() || `Pemain ${i + 1}`);
    const params = new URLSearchParams({
      mode: selectedMode,
      todType: todType,
      players: cleanNames.join(','),
      rounds: String(rounds),
      ...(selectedTopic ? { topic: selectedTopic } : {})
    });
    router.push(`/play/game?${params}`);
  };

  return (
    <div className="min-h-screen pb-12 bg-[#F2E5BF] text-[#257180] font-sans">
      <Header onBack={goBack} stepIndex={stepIndex} totalSteps={stepOrder.length} />

      <main className="max-w-[520px] mx-auto px-4 mt-6">
        <div className="bg-[#FAF3E0] rounded-[32px] p-7 sm:p-9 border border-[#257180]/15 shadow-lg">

          {/* STEP 0: Mode Selection */}
          {step === 'mode' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-3xl font-black text-[#257180] tracking-tight">Pilih Mode Bermain</h1>
                <p className="text-sm font-semibold text-[#257180]/70 mt-1.5">Mau ngobrol santai atau tantangan seru?</p>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  onClick={() => { sound.playClick(); setSelectedMode('pertanyaan'); setStep('players'); }}
                  className="w-full p-5 sm:p-6 rounded-2xl border-2 border-[#FD8B51] bg-[#F2E5BF] text-left flex items-start gap-4 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#FD8B51] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-base sm:text-lg text-[#257180]">Pertanyaan Seru</div>
                    <div className="text-xs sm:text-sm font-medium text-[#257180]/80 mt-1 leading-relaxed">
                      Jelajahi 9+ topik obrolan santai, deep talk, &amp; kenalan bareng teman.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => { sound.playClick(); setSelectedMode('tod'); setStep('todType'); }}
                  className="w-full p-5 sm:p-6 rounded-2xl border-2 border-[#CB6040] bg-[#F2E5BF] text-left flex items-start gap-4 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#CB6040] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Dices className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-base sm:text-lg text-[#257180]">Truth or Dare</div>
                    <div className="text-xs sm:text-sm font-medium text-[#257180]/80 mt-1 leading-relaxed">
                      Putar roda spin nama pemain, lalu pilih Truth atau Dare!
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 0.5: Truth or Dare Type Selection (Tatap Muka vs Jarak Jauh) */}
          {step === 'todType' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-3xl font-black text-[#257180] tracking-tight">Pilih Akses Bermain</h1>
                <p className="text-sm font-semibold text-[#257180]/70 mt-1.5">Kalian lagi nongkrong bareng atau main dari jauh?</p>
              </div>

              <div className="space-y-4 pt-2">
                {/* Opsi 1: Tatap Muka (Jarak Dekat - Gratis) */}
                <button
                  onClick={() => { sound.playClick(); setTodType('tatapmuka'); setStep('players'); }}
                  className="w-full p-5 sm:p-6 rounded-2xl border-2 border-[#FD8B51] bg-[#F2E5BF] text-left flex items-start gap-4 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#FD8B51] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-base sm:text-lg text-[#257180] flex items-center gap-2 flex-wrap">
                      <span>Tatap Muka (Jarak Dekat)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#257180]/15 text-[#257180]">Gratis</span>
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-[#257180]/80 mt-1 leading-relaxed">
                      Tantangan Dare seru untuk main bareng saat kumpul nongkrong di satu lokasi.
                    </div>
                  </div>
                </button>

                {/* Opsi 2: Jarak Jauh (Online Remote - Premium Subscriber) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    if (!isPremium) {
                      setLockedModalTitle("Truth or Dare Jarak Jauh (Online Remote)");
                    } else {
                      setTodType('jarakjauh');
                      setStep('players');
                    }
                  }}
                  className={`w-full p-5 sm:p-6 rounded-2xl border-2 text-left flex items-start gap-4 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm relative ${
                    !isPremium ? 'border-[#257180]/20 bg-[#F2E5BF]/50' : 'border-[#CB6040] bg-[#F2E5BF]'
                  }`}>
                  <div className="w-12 h-12 rounded-xl bg-[#CB6040] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-base sm:text-lg text-[#257180] flex items-center gap-2 flex-wrap">
                      <span>Jarak Jauh (Online Remote)</span>
                      {!isPremium ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#257180] text-white flex items-center gap-1">
                          <Lock className="w-3 h-3 text-white" />
                          <span>Locked</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#CB6040] text-white">
                          VIP Premium
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-[#257180]/80 mt-1 leading-relaxed">
                      Tantangan Dare digital via video call, chat, sosial media &amp; telepon jarak jauh.
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Players & Names Input */}
          {step === 'players' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-3xl font-black text-[#257180] tracking-tight">Siapa Saja Pemainnya?</h1>
                <p className="text-sm font-semibold text-[#257180]/70 mt-1.5">Atur jumlah dan nama pemain yang bakal ikut main</p>
              </div>

              {/* Stepper Count */}
              <div className="flex items-center justify-center gap-5 bg-[#F2E5BF]/70 p-4 rounded-2xl border border-[#257180]/15">
                <button
                  onClick={() => { sound.playClick(); handlePlayerCountChange(Math.max(2, playerCount - 1)); }}
                  className="w-12 h-12 rounded-xl bg-[#FAF3E0] border border-[#257180]/20 text-[#257180] font-black text-xl hover:bg-[#F2E5BF] transition flex items-center justify-center cursor-pointer">
                  −
                </button>

                <div className="text-center px-6">
                  <span className="text-3xl font-black text-[#257180]">{playerCount}</span>
                  <span className="text-sm font-extrabold text-[#257180]/70 ml-2">Pemain</span>
                </div>

                <button
                  onClick={() => { sound.playClick(); handlePlayerCountChange(Math.min(MAX_PLAYERS, playerCount + 1)); }}
                  className="w-12 h-12 rounded-xl text-[#FAF3E0] bg-[#257180] font-black text-xl hover:bg-[#1d5966] transition flex items-center justify-center cursor-pointer">
                  +
                </button>
              </div>

              {/* Editable Player Names Input List */}
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {playerNames.map((name, i) => {
                  const isDefault = !name || name === `Pemain ${i + 1}`;
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-2xl border transition-all duration-200 cursor-text ${
                        isDefault
                          ? 'bg-[#F2E5BF]/50 border-[#257180]/20 hover:border-[#257180]/40'
                          : 'bg-[#FAF3E0] border-[#257180] shadow-sm'
                      } focus-within:border-[#257180] focus-within:ring-2 focus-within:ring-[#257180]/20 focus-within:bg-[#FAF3E0]`}>
                      
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <User className={`w-4 h-4 flex-shrink-0 ${isDefault ? 'text-[#257180]/40' : 'text-[#257180]'}`} />
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => handleNameChange(i, e.target.value)}
                          placeholder={`Ketik nama Pemain ${i + 1}...`}
                          className={`w-full bg-transparent text-sm outline-none transition-all ${
                            isDefault
                              ? 'font-medium text-[#257180]/50 italic placeholder:text-[#257180]/35'
                              : 'font-extrabold text-[#257180]'
                          }`}
                        />
                      </div>

                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#257180]/50 select-none flex-shrink-0">
                        <span>✎</span>
                        <span className="hidden sm:inline">Ubah</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={goNext}
                className="w-full py-4 rounded-2xl font-black text-base text-[#FAF3E0] bg-[#257180] hover:bg-[#1d5966] transition shadow-md cursor-pointer">
                Lanjut Ke Ronde →
              </button>
            </div>
          )}

          {/* STEP 2: Rounds */}
          {step === 'rounds' && (
            <div className="space-y-6 text-center">
              <div>
                <h1 className="text-3xl font-black text-[#257180] tracking-tight">Berapa Ronde?</h1>
                <p className="text-sm font-semibold text-[#257180]/70 mt-1.5">
                  {rounds} ronde × {playerCount} pemain = <strong className="text-[#257180]">{rounds * playerCount} kartu total</strong>
                </p>
              </div>

              <div className="py-2">
                <div className="text-7xl font-black text-[#FD8B51]">{rounds}</div>
                <div className="text-sm font-extrabold text-[#257180]/60 mt-1">Ronde Permainan</div>
              </div>

              <div className="flex items-center justify-center gap-5 bg-[#F2E5BF]/70 p-4 rounded-2xl border border-[#257180]/15">
                <button
                  onClick={() => { sound.playClick(); setRounds(r => Math.max(1, r - 1)); }}
                  className="w-12 h-12 rounded-xl bg-[#FAF3E0] border border-[#257180]/20 text-[#257180] font-black text-xl hover:bg-[#F2E5BF] transition flex items-center justify-center cursor-pointer">
                  −
                </button>

                <div className="flex-1 max-w-[170px] h-3 bg-[#D6C79E] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FD8B51] transition-all" style={{ width: `${(rounds / MAX_ROUNDS) * 100}%` }} />
                </div>

                <button
                  onClick={() => { sound.playClick(); setRounds(r => Math.min(MAX_ROUNDS, r + 1)); }}
                  className="w-12 h-12 rounded-xl text-white bg-[#FD8B51] font-black text-xl hover:bg-[#e0753c] transition flex items-center justify-center cursor-pointer">
                  +
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {[1, 3, 5, 10, 20].map(n => (
                  <button key={n} onClick={() => { sound.playClick(); setRounds(n); }}
                    className="px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer"
                    style={rounds === n ? { background: C.orange, color: "white" } : { background: "#F2E5BF", color: C.teal }}>
                    {n} Ronde
                  </button>
                ))}
              </div>

              <button onClick={goNext}
                className="w-full py-4 rounded-2xl font-black text-base text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-md cursor-pointer">
                {selectedMode === 'pertanyaan' ? 'Pilih Topik →' : 'Mulai Bermain'}
              </button>
            </div>
          )}

          {/* STEP 3: Topics */}
          {step === 'topic' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-black text-[#257180] tracking-tight">Pilih Topik</h1>
                <p className="text-sm font-semibold text-[#257180]/70 mt-1">Pilih topik obrolan favorit kamu</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {TOPICS.map(t => {
                  const selected = selectedTopic === t.id;
                  const isLocked = !t.free && !isPremium;
                  const IconComp = t.icon;
                  return (
                    <button key={t.id}
                      onClick={() => {
                        sound.playClick();
                        if (isLocked) {
                          setLockedModalTitle(t.name);
                        } else {
                          setSelectedTopic(t.id);
                        }
                      }}
                      className={`relative p-3.5 rounded-2xl border-2 transition flex flex-col items-center justify-center text-center cursor-pointer ${
                        isLocked
                          ? 'bg-[#F2E5BF]/40 border-[#257180]/15 opacity-90 hover:border-[#FD8B51]/50'
                          : selected
                          ? 'bg-[#F2E5BF] border-[#FD8B51]'
                          : 'bg-[#FAF3E0] border-[#257180]/15 hover:bg-[#F2E5BF]/50'
                      }`}>
                      <div className="w-11 h-11 rounded-xl bg-[#257180]/10 flex items-center justify-center mb-2.5 relative">
                        <IconComp className="w-5 h-5 text-[#257180]" />
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-[#257180] leading-tight text-center w-full">{t.name}</div>
                      <div className="text-[11px] font-medium text-[#257180]/65 mt-0.5 leading-tight text-center w-full">{t.desc}</div>

                      {/* Locked Premium Badge (Chain & Padlock) */}
                      {isLocked && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#FD8B51] text-white text-[9px] font-black flex items-center gap-1 shadow-sm">
                          <Lock className="w-2.5 h-2.5" />
                          <span>Locked</span>
                        </div>
                      )}

                      {selected && !isLocked && (
                        <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-[#FD8B51] text-[#FAF3E0] flex items-center justify-center text-[10px] font-black">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleStart}
                className="w-full py-4 rounded-2xl font-black text-base text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-md cursor-pointer">
                Mulai Bermain
              </button>
            </div>
          )}

        </div>
      </main>

      {/* Locked Premium Feature Redeem Modal */}
      <LockedFeatureModal
        isOpen={!!lockedModalTitle}
        onClose={() => setLockedModalTitle(null)}
        featureTitle={lockedModalTitle || undefined}
      />
    </div>
  );
}
