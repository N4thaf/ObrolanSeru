"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Heart, Smile, Sparkles, Compass, Moon, Home as HomeIcon, Clock, Rocket, Shuffle, MessageSquare, Dices, User, Users, Globe, Lock, Wand2 } from 'lucide-react';
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
  { id: "ai_custom", name: "Racikan AI",      desc: "Racik topik custom sesuai imajinasimu", icon: Wand2, free: false },
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
    "Kalau bisa tukar nasib dan hidup 1 hari jadi orang lain di dunia ini, kamu pilih siapa?",
    "Apa first impression kamu saat pertama kali ketemu orang-orang di meja/grup ini?",
    "Aplikasi di HP kamu yang paling sering dibuka tapi sebenarnya kurang berguna apa?",
    "Kalau kamu punya peliharaan hewan eksotis atau imajiner, kamu ingin pelihara apa?",
    "Karakter fiksi dari anime, film, atau buku yang sifatnya paling mirip sama kamu siapa?",
    "Apa superpower konyol yang paling ingin kamu punya hanya untuk memudahkan hidup sehari-hari?",
    "Momen saat kamu merasa paling salah kostum atau canggung di suatu tempat acara kapan?",
    "Ceritakan 1 tempat di kota ini yang punya kenangan paling berkesan buat kamu!",
    "Minuman atau racikan kopi/teh favorit kamu kalau lagi nongkrong santai apa?",
    "Kalau ada lomba tidur paling lama atau rebahan, berapa jam rekor kamu?",
    "Apa hal pertama yang kamu perhatikan saat baru kenal orang baru?",
    "Kalau kamu bikin acara podcast sendiri, topik apa yang bakalan kamu bahas berjam-jam?",
    "Siapa penyanyi atau band favorit kamu yang lagu-lagunya tidak pernah bikin bosan?"
  ],
  absurd: [
    "Kalau kedua tangan kamu bisa berbicara sendiri, kalimat pertama yang diucapkan apa?",
    "Kalau terpaksa harus tinggal selamanya di dalam sebuah video game, game apa yang kamu pilih?",
    "Pilih mana: bisa terbang tapi hanya setinggi 10 cm dari tanah, atau bisa teleportasi tapi hanya 1 meter?",
    "Kalau kamu berubah menjadi varian makanan atau minuman, kamu jadi rasa apa dan kenapa?",
    "Hal paling konyol yang pernah kamu percayai 100 persen saat masih berumur 7 tahun?",
    "Kalau kucing & anjing bisa bicara bahasa Indonesia, apa hal pertama yang bakalan mereka protes?",
    "Pilih mana: bisa mengerti bahasa semua hewan di bumi, atau bisa memainkan seluruh alat musik di dunia secara instan?",
    "Kalau kamu jadi presiden selama 1 hari saja, peraturan aneh apa yang wajib dipatuhi semua orang?",
    "Kalau alien datang ke bumi dan kamu harus kasih 1 makanan Indonesia untuk mewakili bumi, kamu kasih apa?",
    "Pilih mana: harus jalan mundur sepanjang hari atau harus ngomong bernyanyi setiap kali bicara?",
    "Kalau semua benda mati di kamar kamu bisa ngobrol saat kamu tidur, benda mana yang paling cerewet?",
    "Apa konspirasi paling absurd yang pernah kamu denger tapi sempat membuat kamu kepikiran?",
    "Kalau muka kamu tercetak di uang kertas Rp 100.000, ekspresi wajah seperti apa yang kamu pilih?",
    "Pilih mana: tidak bisa makan manis selamanya atau tidak bisa makan pedas selamanya?",
    "Kalau monster di bawah kasur itu beneran ada, kira-kira dia lagi ngapain pas kamu ketiduran?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget diceritakan ke orang lain?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir kamu sampai hari ini?",
    "Kalau bisa mengirim satu kalimat pesan ke diri kamu sendiri 10 tahun lalu, apa isinya?",
    "Menurut pandangan kamu pribadi, definisi sukses yang benar-benar membuat kamu bahagia seperti apa?",
    "Apa penyesalan terkecil atau terbesar yang pernah mengajarkan kamu pelajaran hidup paling berharga?",
    "Apa hal paling berat yang pernah kamu lewati tahun ini tapi berhasil kamu lalui dengan tenang?",
    "Kapan momen terakhir kali kamu merasa sangat bangga sama diri sendiri walau tanpa pujian orang lain?",
    "Nasihat hidup terbaik apa yang pernah kamu terima saat kamu berada di titik terendah?",
    "Apa arti sebuah persahabatan yang sejati menurut versi kamu setelah bertambah dewasa?",
    "Hal apa dalam hidup kamu yang paling kamu syukuri saat kamu terbangun dari tidur pagi ini?",
    "Bagaimana cara kamu menenangkan diri sendiri saat dunia di sekitar terasa terlalu bising?",
    "Satu hal yang paling ingin kamu ubah dari cara kamu merespons masalah saat ini apa?",
    "Apakah ada impian kecil kamu waktu kecil yang sekarang baru kamu sadari sudah terwujud?",
    "Bagaimana kamu ingin dikenang oleh teman-teman dekat dan keluarga kamu kelak?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering membuat kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah membuat kangen?",
    "Apa hal pertama yang membuat kamu yakin untuk membuka hati dan mendekat ke aku dulu?",
    "Kalau kita punya waktu 1 minggu liburan bebas tanpa gangguan kerjaan, tempat impian yang kamu pilih ke mana?",
    "Apa hal ter-sweet atau hal paling menyentuh yang pernah aku lakukan buat kamu?",
    "Lagu apa yang kalau diputar selalu mengingatkan kamu ke momen-momen awal kita kenalan?",
    "Apa harapan terbesar kamu untuk perjalanan hubungan kita di masa depan?",
    "Kebiasaan romantis sederhana apa yang paling ingin kita rutin lakukan setiap minggu?",
    "Kapan pertama kali kamu menyadari bahwa kamu benar-benar sayang dan nyaman sama aku?",
    "Bagaimana cara favorit kamu kalau lagi ingin bermanja-manja atau minta perhatian dari aku?",
    "Pelajaran terbaik apa yang kamu dapatkan tentang cinta setelah kita bersama?",
    "Kalau kita bisa bikin panggilan sayang baru yang lucu dan konyol, kamu mau panggil aku apa?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung membuat kamu flashback ke masa lalu?",
    "Tontonan kartun, anime, atau acara televisi hari Minggu favorit kamu saat masih sekolah dulu?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan susah dicari sekarang?",
    "Momen kelulusan atau acara sekolah masa lalu mana yang paling membekas di ingatan kamu?",
    "Permainan tradisional atau game konsol zaman dulu apa yang pernah bikin kamu lupa waktu?",
    "Gaya baju, potong rambut, atau foto zaman dulu kamu yang kalau dilihat lagi sekarang bikin ngakak apa?",
    "Siapa guru atau sahabat zaman sekolah yang pernah memberikan kesan paling berharga buat kamu?",
    "Mainan atau barang masa kecil apa yang pernah kamu pertahankan sampai rusak parah?",
    "Pengalaman bolos atau kejahilan konyol apa yang pernah kamu lakukan waktu zaman sekolah/kuliah?",
    "Apa memori liburan keluarga zaman kecil yang paling hangat dan tidak pernah kamu lupakan?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan lucu apa yang hanya ada dan dilakukan di dalam keluarga kamu?",
    "Nasihat dari orang tua atau sesepuh yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah apa yang paling dikangenin saat sedang jauh dari rumah?",
    "Momen kebersamaan keluarga mana yang paling hangat dan bikin kamu merasa bersyukur?",
    "Siapa anggota keluarga yang sifat atau kebiasaannya paling mirip sama kamu?",
    "Ceritakan momen lucu atau konyol yang pernah terjadi saat acara kumpul keluarga besar!",
    "Apa hal dari orang tua kamu yang paling ingin kamu tiru saat kamu membangun keluarga kelak?",
    "Pernahkah kamu diam-diam menyiapkan kejutan sederhana buat keluarga dan bagaimana reaksinya?",
    "Ungkapan atau kata-kata khas apa yang sering diucapkan orang tua kamu saat menasihati?"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100 percent?",
    "Bagaimana jika kamu bangun besok pagi dan menemukan kamu bisa mengerti bahasa semua hewan?",
    "Bagaimana jika kamu diberikan pintu kemana saja Doraemon, tempat pertama yang kamu kunjungi mana?",
    "Bagaimana jika kamu terbangun dan menjadi satu-satunya manusia yang tersisa di kota ini selama 24 jam?",
    "Bagaimana jika kamu bisa bertemu dengan diri kamu sendiri di usia 70 tahun, apa yang ingin kamu tanyakan?",
    "Bagaimana jika setiap kali kamu memikirkan seseorang, bunga favorit mereka muncul di tangan kamu?"
  ],
  karir: [
    "Apa cita-cita atau mimpi terbesar kamu yang belum sempat diwujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah dan finansial kamu sudah terjamin 100%, pekerjaan atau karya apa yang akan kamu tekuni?",
    "Pencapaian atau karya apa dalam karir/perkuliahan yang paling membuat kamu merasa puas dan bangga?",
    "Nasihat karir atau pelajaran pekerjaan terbaik apa yang paling mengubah cara pandang kamu?",
    "Apa pengorbanan terbesar yang pernah kamu lakukan demi meraih posisi atau impian kamu saat ini?",
    "Kalau kamu punya modal bebas untuk buka bisnis sendiri esok hari, bidang usaha apa yang ingin kamu bangun?",
    "Momen ketika kamu merasa paling burnout atau lelah dalam bekerja/kuliah, dan bagaimana kamu melewatinya?",
    "Siapa sosok profesional atau pengusaha yang paling menginspirasi etos kerja dan cara berpikir kamu?",
    "Apa skill atau keahlian baru yang paling ingin kamu kuasai dalam 1 tahun ke depan untuk mendukung karir kamu?",
    "Bagaimana definisi keseimbangan hidup (*work-life balance*) yang ideal versi kamu pribadi?",
    "Momen ketika kamu pernah gagal dalam suatu wawancara atau proyek, tapi hasilnya malah membuka jalan yang lebih baik?",
    "Kalau kamu bisa memutar waktu ke hari pertama kamu mulai bekerja/kuliah, nasihat apa yang ingin kamu sampaikan ke diri sendiri?",
    "Apa prinsip atau nilai kejujuran dalam bekerja yang tidak akan pernah kamu kompromikan demi uang?",
    "Pernahkah kamu mengambil risiko besar dalam keputusan karir atau studi? Bagaimana hasilnya?",
    "Apa proyek atau target kerja terbesar yang sedang kamu perjuangkan dan ingin kamu selesaikan tahun ini?",
    "Lingkungan kerja atau budaya tim impian yang paling membuat kamu merasa bersemangat seperti apa?",
    "Kalau kamu diundang berbicara di panggung seminar internasional, topik keahlian apa yang ingin kamu bawakan?",
    "Gaji atau pendapatan pertama dalam hidup kamu dulu kamu pakai untuk membeli apa?",
    "Apa pencapaian finansial atau tabungan terkecil yang pernah membuat kamu tersenyum lega?",
    "Bagaimana cara kamu menghadapi rekan kerja atau atasan yang punya karakter sulit diajak kerja sama?",
    "Apa impian terbesar kamu untuk masa pensiun atau masa tua kelak?"
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

  const MAX_PLAYERS = 10;
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

  const [customAiPrompt, setCustomAiPrompt] = useState<string>('');
  const [showAiPromptModal, setShowAiPromptModal] = useState<boolean>(false);
  const [tempPromptInput, setTempPromptInput] = useState<string>('');

  const handleStart = () => {
    sound.playChime();
    const cleanNames = playerNames.map((n, i) => n.trim() || `Pemain ${i + 1}`);
    const params = new URLSearchParams({
      mode: selectedMode,
      todType: todType,
      players: cleanNames.join(','),
      rounds: String(rounds),
      ...(selectedTopic ? { topic: selectedTopic } : {}),
      ...(customAiPrompt ? { aiPrompt: customAiPrompt } : {})
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
                          if (t.id === 'ai_custom') {
                            setShowAiPromptModal(true);
                          }
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

      {/* Custom AI Prompt Configuration Modal */}
      {showAiPromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#257180]/65 backdrop-blur-md animate-pop-in">
          <div className="bg-[#FAF3E0] rounded-[36px] p-7 sm:p-9 w-[340px] sm:w-[420px] border-4 border-[#FD8B51] shadow-2xl flex flex-col items-center text-center relative select-none">
            <button
              onClick={() => {
                sound.playClick();
                setShowAiPromptModal(false);
              }}
              className="absolute top-4 right-4 text-[#257180]/50 hover:text-[#257180] font-black text-sm w-8 h-8 rounded-full bg-[#F2E5BF] flex items-center justify-center cursor-pointer">
              ✕
            </button>

            <div className="w-14 h-14 rounded-2xl bg-[#FD8B51]/15 border border-[#FD8B51]/30 flex items-center justify-center text-[#FD8B51] my-2 shadow-sm">
              <Wand2 className="w-7 h-7" />
            </div>

            <h3 className="text-2xl font-black text-[#257180] tracking-tight">Racik Topik AI Custom</h3>
            <p className="text-xs font-semibold text-[#257180]/80 mt-1">
              Ketik suasana atau topik apa saja yang ingin kamu racik menjadi kartu pertanyaan AI!
            </p>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap gap-1.5 my-3 justify-center">
              {[
                "Trip Liburan ke Bali",
                "Deep Talk Finansial",
                "Cinta Monyet & PDKT",
                "Pertanyaan Absurd & Random"
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setTempPromptInput(chip)}
                  className="px-2.5 py-1 rounded-full bg-[#257180]/10 text-[#257180] hover:bg-[#FD8B51] hover:text-white transition text-[11px] font-extrabold cursor-pointer">
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={tempPromptInput}
              onChange={(e) => setTempPromptInput(e.target.value)}
              placeholder="misal: Pertanyaan konyol buat reuni alumni SMA..."
              className="w-full p-4 rounded-2xl bg-white border-2 border-[#257180]/20 text-xs sm:text-sm font-bold text-[#257180] outline-none focus:border-[#FD8B51] placeholder:text-[#257180]/40 resize-none my-2"
            />

            <button
              onClick={() => {
                const promptToUse = tempPromptInput.trim() || "Pertanyaan Seru & Random";
                sound.playChime();
                setShowAiPromptModal(false);

                const cleanNames = playerNames.map((n, i) => n.trim() || `Pemain ${i + 1}`);
                const params = new URLSearchParams({
                  mode: selectedMode,
                  todType: todType,
                  players: cleanNames.join(','),
                  rounds: String(rounds),
                  topic: 'ai_custom',
                  aiPrompt: promptToUse
                });

                // Clear temp state for next custom creation
                setTempPromptInput('');
                setCustomAiPrompt('');

                // DIRECTLY NAVIGATE STRAIGHT TO GAME!
                router.push(`/play/game?${params}`);
              }}
              className="w-full py-3.5 rounded-2xl font-black text-sm text-white bg-[#FD8B51] hover:bg-[#e0753c] transition shadow-md cursor-pointer mt-2">
              Racik &amp; Mulai Bermain →
            </button>
          </div>
        </div>
      )}

      {/* Locked Premium Feature Redeem Modal */}
      <LockedFeatureModal
        isOpen={!!lockedModalTitle}
        onClose={() => setLockedModalTitle(null)}
        featureTitle={lockedModalTitle || undefined}
      />
    </div>
  );
}
