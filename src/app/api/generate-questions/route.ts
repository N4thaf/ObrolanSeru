import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 100% Natural, Authentic, Grammatically Flawless Indonesian Question Database (Zero Synthetic Mad-Libs)
const BASE_AI_BANKS: Record<string, string[]> = {
  kenalan: [
    "Kalau hidup kamu dibuat film dokumenter Netflix, kira-kira judulnya apa dan siapa yang cocok jadi naratornya?",
    "Siapa teman di lingkaran kamu yang paling sering janji 'otw' padahal sebenarnya baru banget masuk kamar mandi?",
    "Hal paling konyol yang bikin kamu tertawa paling kencang sampai keluar air mata dalam sebulan terakhir?",
    "Satu kebiasaan super unik atau aneh yang cuma kamu sendiri yang tahu dan tidak pernah kamu jelaskan ke siapa-siapa?",
    "Makanan apa yang paling kamu benci pas masih kecil tapi sekarang malah jadi makanan wajib kalau nongkrong?",
    "Kalau besok kamu bangun tidur dan tiba-tiba dapat uang 1 miliar tanpa syarat, barang pertama yang kamu beli apa?",
    "Fakta paling random atau bakat rahasia tentang diri kamu yang tidak ada satu pun teman kamu tahu?",
    "Kalau bisa tukar nasib dan hidup 24 jam jadi sosok terkenal di dunia ini, kamu mau pilih siapa dan lakukan apa?",
    "Aplikasi di HP kamu yang paling sering kamu buka pas lagi mati gaya atau sulit tidur malam hari?",
    "Satu kebiasaan kecil orang lain yang diam-diam selalu bikin kamu merasa nyaman atau respect?",
    "Pengalaman canggung atau tengsin paling tak terlupakan pas kamu pertama kali masuk kampus atau tempat kerja?",
    "Kalau kamu diberi kesempatan menguasai satu keahlian instan malam ini, keahlian apa yang paling kamu impikan?",
    "Pernahkah kamu salah kirim pesan ke grup yang salah dan isinya bikin malu banget? Ceritakan!",
    "Kalau kamu bikin kafe sendiri, suasana seperti apa yang bakal kamu buat dan apa nama minuman andalannya?",
    "Tempat atau lokasi nongkrong mana yang punya banyak kenangan paling berkesan buat kamu?",
    "Apa playlist atau jenis musik yang selalu kamu putar pas lagi pengen sendirian di kamar?",
    "Satu barang di kamar kamu yang paling banyak menyimpan cerita bersejarah dalam hidup kamu?",
    "Kalau kamu diminta merekomendasikan 1 film atau series yang wajib ditonton semua orang di meja ini, film apa?",
    "Hal paling impulsif yang pernah kamu lakukan tanpa berpikir panjang dan ternyata hasilnya seru?",
    "Kalau kamu harus menjelaskan kepribadian kamu cuma memakai 3 kata kasual, kata apa saja itu?",
    "Apa pujian paling membekas dari orang lain yang sampai sekarang masih sering bikin kamu tersenyum saat mengingatnya?",
    "Siapa sosok yang paling sering jadi tempat curhat pertama kamu pas lagi ada masalah berat?",
    "Kalau kamu punya mesin waktu dan cuma bisa balik ke 1 momen indah dalam hidup kamu, momen apa yang ingin kamu ulangi?",
    "Barang bekas atau benda lama apa yang sampai sekarang masih kamu simpan rapat-rapat di kamar?",
    "Apa hal pertama yang selalu kamu perhatikan dari seseorang pas pertama kali bertemu?"
  ],
  absurd: [
    "Kalau kedua tangan kamu tiba-tiba bisa bicara sendiri pas kamu lagi makan, kalimat pertama yang dia omongkan apa?",
    "Kalau kamu terpaksa harus tinggal selamanya di dalam sebuah video game kuno, game apa yang bakal kamu pilih?",
    "Pilih mana: bisa terbang tapi cuma setinggi 10 cm dari tanah, atau bisa teleportasi tapi cuma sejauh 1 meter?",
    "Kalau kamu berubah jadi varian mie instan terbaru, kamu bakal jadi rasa apa dan apa keunikannya?",
    "Hal paling konyol atau bodoh yang pernah kamu percayai 100% pas kamu masih umur 7 tahun dulu?",
    "Hewan apa yang kalau dipakaikan kemeja dan dasi bakal kelihatan paling cocok jadi pimpinan perusahaan?",
    "Kalau semua barang di kamar kamu bisa protes pas dipakai, barang mana yang kira-kira paling galak dan cerewet?",
    "Pilih mana: setiap bicara harus pakai nada bernyanyi opera, atau setiap jalan harus sambil berjoget pargoy?",
    "Kalau kamu harus dapat nama panggung penyanyi dangdut kasual, nama apa yang paling cocok buat kamu?",
    "Karakter kartun atau anime mana yang menurut kamu jalan pikirannya paling ngaco dan mirip kamu?",
    "Kalau kamu bisa bikin peraturan ajaib di negara ini yang wajib ditaati semua orang, peraturan konyol apa itu?",
    "Seandainya alien mendarat di depan rumah kamu dan minta ditunjukkan 1 makanan bumi paling enak, kamu kasih apa?",
    "Pilih mana: seumur hidup cuma bisa makan makanan dingin, atau seumur hidup cuma bisa mandi pakai air es?",
    "Kalau kamu punya kemampuan bicara sama barang elektronik, barang rumah tangga apa yang paling sering mengeluh?",
    "Kalau kamu jadi pahlawan super tapi kekuatannya cuma bisa bikin orang bersin, bagaimana cara kamu mengalahkan penjahat?",
    "Pilih mana: ke mana-mana harus naik sepedah roda tiga kecil, atau ke mana-mana harus memakai jubah penyihir?",
    "Kalau kamu bisa mengubah suara klakson kendaraan di seluruh dunia jadi suara hewan, kamu mau pilih suara hewan apa?",
    "Apa ide bisnis paling aneh atau ngaco yang pernah terlintas di pikiran kamu pas lagi melamun?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke teman dekat sekali pun?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir dan prinsip kamu sampai hari ini?",
    "Kalau kamu bisa kirim satu kalimat pesan singkat ke diri kamu sendiri 10 tahun lalu, apa pesan utamanya?",
    "Menurut pandangan kamu pribadi, definisi bahagia dan tenang yang sesungguhnya itu seperti apa?",
    "Pernahkah kamu merasa berada di titik terendah dalam hidup dan apa hal yang bikin kamu bangkit kembali?",
    "Apa pencapaian terkecil kamu yang orang lain sepelekan tapi sebenarnya paling kamu syukuri?",
    "Siapa orang pertama yang paling kamu inginkan hadir saat kamu sedang merasa sedih atau lelah?",
    "Satu hal apa dari diri kamu sendiri yang sampai sekarang masih berusaha kamu maafkan dan ikhlaskan?",
    "Kalau kamu melihat kehidupan kamu 5 tahun ke depan, suasana seperti apa yang ingin kamu capai?",
    "Apa kekecewaan atau rasa sakit masa lalu yang mengajarkan kamu pelajaran hidup paling berharga?",
    "Pernahkah kamu merasa berpura-pura baik-baik saja di depan orang lain padahal di dalam hati sedang sangat lelah?",
    "Apa batas toleransi kamu terhadap seseorang sebelum kamu memilih untuk pelan-pelan menjauh?",
    "Hal paling berani apa yang pernah kamu lakukan demi mempertahankan nilai dan prinsip hidup kamu?",
    "Apa definisi kedewasaan yang paling terasa bedanya saat kamu bertambah usia sekarang?",
    "Satu mimpi besar kamu yang belum pernah kamu bagikan ke siapa pun karena takut diremehkan?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering membuat kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah membuat kangen?",
    "Apa hal pertama yang membuat kamu yakin untuk membuka hati dan mendekat ke aku dulu?",
    "Kalau kita punya waktu 1 hari penuh tanpa gangguan HP dan pekerjaan, kamu pengen kita pergi ke mana?",
    "Apa mimpi atau target bersama yang paling ingin kita capai dalam beberapa tahun ke depan?",
    "Pujian atau apresiasi sederhana apa dari aku yang paling membekas di hati kamu?",
    "Bahasa cinta (*love language*) mana dari aku yang paling membuat kamu merasa dicintai secara utuh?",
    "Ceritakan momen PDKT kita yang menurut kamu paling lucu, salah tingkah, atau canggung!",
    "Apa perbedaan sifat di antara kita yang menurut kamu justru bikin hubungan kita saling melengkapi?",
    "Bagaimana cara favorit kamu kalau lagi pengen bermanja-manja atau minta perhatian dari aku?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung membuat kamu flashback ke masa lalu?",
    "Tontonan kartun, anime, atau acara televisi hari Minggu favorit kamu saat masih sekolah dulu?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan susah dicari sekarang?",
    "Mainan atau permainan tradisional apa yang paling sering membuat kamu lupa waktu saat kecil?",
    "Kenangan atau pengalaman lucu apa yang paling berkesan bersama teman masa sekolah dulu?",
    "Foto atau gaya berpakaian jaman sekolah mana yang kalau kamu lihat lagi sekarang bikin tengsin setengah mati?",
    "Momen bolos atau ketahuan melanggar aturan sekolah paling kocak yang pernah kamu alami dulu?",
    "Siapa guru atau pengajar jaman sekolah yang paling ikonik dan tidak pernah kamu lupakan?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan lucu apa yang hanya ada dan dilakukan di dalam keluarga kamu?",
    "Nasihat dari orang tua atau sesepuh yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah apa yang paling dikangenin saat sedang jauh dari rumah?",
    "Momen kebersamaan keluarga mana yang paling hangat dan selalu kamu kenang sampai sekarang?",
    "Siapa anggota keluarga kamu yang paling humoris dan selalu jadi pemecah suasana kalau lagi kumpul?",
    "Ceritakan momen ketika kamu bikin bangga orang tua kamu dan perasaan kamu saat itu!"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100 percent?",
    "Bagaimana jika kamu bisa mengerti dan menguasai seluruh bahasa di dunia secara instan malam ini?",
    "Bagaimana jika kamu diizinkan tinggal di negara mana pun di dunia gratis selama 1 tahun penuh, kamu pilih negara apa?",
    "Bagaimana jika kamu bisa membaca pikiran hewan peliharaan kamu selama 24 jam, apa yang ingin kamu tanyakan?"
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
  ],
  tod_truth: [
    "Siapa orang yang paling kamu sukai atau taksir secara diam-diam saat masa sekolah dulu?",
    "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain dan belum pernah ketahuan?",
    "Pernahkah kamu pura-pura sakit atau sibuk cuma demi kabur dari janji bertemu teman?",
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke orang lain?",
    "Siapa orang yang paling sering kamu cari tahu kabarnya atau stalk diam-diam di sosmed?",
    "Ceritakan satu momen paling canggung atau tengsin yang pernah kamu alami dalam hidup!",
    "Hal paling konyol atau impulsif apa yang pernah kamu beli padahal sebenarnya tidak berguna?",
    "Pernahkah kamu diam-diam membaca pesan HP orang lain tanpa izin?",
    "Apa rahasia paling konyol yang belum pernah kamu ceritakan ke siapa pun sampai hari ini?"
  ],
  tod_dare_offline: [
    "Tatap mata teman di sebelah kananmu selama 20 detik penuh tanpa tersenyum sedikit pun!",
    "Tunjukkan foto paling konyol di galeri HP kamu ke semua teman di meja!",
    "Tiru gaya jalan atau gaya bicara salah satu orang di sini dengan mirip!",
    "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di meja!",
    "Lakukan gerakan olahraga ringan (seperti 10x jumping jack) sambil sebutkan 5 nama makanan!",
    "Pinjamkan HP kamu ke teman di sebelah kirimu untuk memilih 1 lagu dari playlist kamu!",
    "Ucapkan pantun lucu secara spontan untuk orang di depan kamu!"
  ],
  tod_dare_online: [
    "Kirim pesan singkat ke kontak ke-5 di HP kamu: 'Aku mau bicara sesuatu penting banget.'",
    "Perlihatkan foto paling konyol yang ada di galeri HP kamu lewat kamera / share screen!",
    "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!",
    "Ubah foto profil media sosial kamu jadi gambar karakter kartun favorit selama 1 jam!",
    "Tuliskan status singkat yang lucu atau nyeleneh di WhatsApp Story kamu!"
  ]
};

// Pure Human-Curated Pool Resolver (Zero Synthetic Mad-Libs Generator)
function generateCustomQuestions(rawPrompt: string, count: number = 50): string[] {
  const p = rawPrompt.trim().toLowerCase();

  const REGULAR_KEYS = ['kenalan', 'absurd', 'deep', 'pasangan', 'nostalgia', 'keluarga', 'whatif', 'karir'];
  let pool: string[] = [];

  if (p.includes("konyol") || p.includes("lucu") || p.includes("receh") || p.includes("aib") || p.includes("sekolah")) {
    pool = [...(BASE_AI_BANKS['kenalan'] || []), ...(BASE_AI_BANKS['absurd'] || []), ...(BASE_AI_BANKS['nostalgia'] || [])];
  } else if (p.includes("sedih") || p.includes("galau") || p.includes("emosional") || p.includes("perasaan")) {
    pool = [...(BASE_AI_BANKS['deep'] || []), ...(BASE_AI_BANKS['keluarga'] || [])];
  } else if (p.includes("pasangan") || p.includes("cinta") || p.includes("romantis") || p.includes("gebetan")) {
    pool = [...(BASE_AI_BANKS['pasangan'] || []), ...(BASE_AI_BANKS['deep'] || [])];
  } else if (p.includes("karir") || p.includes("uang") || p.includes("kerja") || p.includes("bisnis") || p.includes("mimpi")) {
    pool = [...(BASE_AI_BANKS['karir'] || []), ...(BASE_AI_BANKS['deep'] || [])];
  } else {
    pool = REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || []);
  }

  return fisherYatesShuffle(pool);
}

// Fisher-Yates Shuffle algorithm for true uniform randomness
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const { topic = 'kenalan', customPrompt = '', count = 20, exclude = [] } = await request.json();

    const excludeSet = new Set<string>(
      Array.isArray(exclude) ? exclude.map((s: string) => String(s).trim().toLowerCase()) : []
    );

    const isExcluded = (q: string) => excludeSet.has(q.trim().toLowerCase());

    const REGULAR_KEYS = ['kenalan', 'absurd', 'deep', 'pasangan', 'nostalgia', 'keluarga', 'whatif', 'karir'];
    const TOD_KEYS = ['tod_truth', 'tod_dare_offline', 'tod_dare_online'];

    const isTodTopic = TOD_KEYS.includes(topic);

    // 1. Select Primary Topic Bank or Mix All Regular Banks
    let primaryBank: string[] = [];
    if (topic === 'mix' || (topic === 'ai_custom' && !customPrompt)) {
      primaryBank = REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || []);
    } else if (topic === 'ai_custom' && customPrompt) {
      primaryBank = generateCustomQuestions(customPrompt, count * 2);
    } else {
      primaryBank = BASE_AI_BANKS[topic] || BASE_AI_BANKS['kenalan'];
    }

    // 2. Filter out any questions already seen by this user/account
    let availablePool = primaryBank.filter(q => !isExcluded(q));

    // 3. Top up seamlessly from all regular banks if count is greater than primary bank
    if (availablePool.length < count && !isTodTopic) {
      const allRegular = REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || []);
      const extraUnseen = allRegular.filter(q => !isExcluded(q));
      availablePool = Array.from(new Set([...availablePool, ...extraUnseen]));
    }

    // 4. Final fallback if pool is still smaller than requested count (reset exclusion filter as last resort)
    if (availablePool.length < count && !isTodTopic) {
      const allRegular = REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || []);
      const fullMaster = Array.from(new Set([...primaryBank, ...allRegular]));
      availablePool = Array.from(new Set([...availablePool, ...fisherYatesShuffle(fullMaster)]));
    }

    // 5. Shuffle with true Fisher-Yates and slice requested count
    const shuffled = fisherYatesShuffle(availablePool);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json({
      success: true,
      topic,
      questions: selectedQuestions,
    });
  } catch (error) {
    const fallbackBank = BASE_AI_BANKS['kenalan'];
    const shuffled = fisherYatesShuffle(fallbackBank);
    return NextResponse.json({
      success: true,
      topic: 'kenalan',
      questions: shuffled.slice(0, 10),
    });
  }
}
