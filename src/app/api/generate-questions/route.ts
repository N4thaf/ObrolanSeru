import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Vercel: allow up to 60s for Gemini to respond

// ─── Fallback Static Banks (used when Gemini API is unavailable) ───────────────
const BASE_AI_BANKS: Record<string, string[]> = {
  kenalan: [
    "Kalau hidup kamu dibuat film dokumenter Netflix, kira-kira judulnya apa dan siapa yang cocok jadi naratornya?",
    "Siapa teman di lingkaran kamu yang paling sering janji 'otw' padahal sebenarnya baru banget masuk kamar mandi?",
    "Hal paling konyol yang bikin kamu tertawa paling kencang sampai keluar air mata dalam sebulan terakhir?",
    "Satu kebiasaan super unik yang cuma kamu sendiri yang tahu dan tidak pernah kamu jelaskan ke siapa-siapa?",
    "Makanan apa yang paling kamu benci pas masih kecil tapi sekarang malah jadi makanan wajib kalau nongkrong?",
    "Kalau besok kamu bangun tidur dan tiba-tiba dapat uang 1 miliar tanpa syarat, barang pertama yang kamu beli apa?",
    "Fakta paling random atau bakat rahasia tentang diri kamu yang tidak ada satu pun teman kamu tahu?",
    "Kalau bisa tukar nasib dan hidup 24 jam jadi sosok terkenal di dunia ini, kamu mau pilih siapa?",
    "Aplikasi di HP kamu yang paling sering kamu buka pas lagi mati gaya atau sulit tidur malam hari?",
    "Satu kebiasaan kecil orang lain yang diam-diam selalu bikin kamu merasa nyaman atau respect?",
    "Pengalaman canggung paling tak terlupakan pas kamu pertama kali masuk kampus atau tempat kerja?",
    "Kalau kamu diberi kesempatan menguasai satu keahlian instan malam ini, keahlian apa yang paling kamu impikan?",
    "Pernahkah kamu salah kirim pesan ke grup yang salah dan isinya bikin malu banget? Ceritakan!",
    "Kalau kamu bikin kafe sendiri, suasana seperti apa yang bakal kamu buat dan apa nama minuman andalannya?",
    "Tempat atau lokasi nongkrong mana yang punya banyak kenangan paling berkesan buat kamu?",
    "Apa playlist atau jenis musik yang selalu kamu putar pas lagi pengen sendirian di kamar?",
    "Satu barang di kamar kamu yang paling banyak menyimpan cerita bersejarah dalam hidup kamu?",
    "Kalau kamu diminta merekomendasikan 1 film atau series yang wajib ditonton semua orang di meja ini, film apa?",
    "Hal paling impulsif yang pernah kamu lakukan tanpa berpikir panjang dan ternyata hasilnya seru?",
    "Kalau kamu harus menjelaskan kepribadian kamu cuma memakai 3 kata kasual, kata apa saja itu?",
    "Apa pujian paling membekas dari orang lain yang sampai sekarang masih sering bikin kamu tersenyum?",
    "Kalau kamu punya mesin waktu dan cuma bisa balik ke 1 momen indah dalam hidup kamu, momen apa itu?",
    "Apa hal pertama yang selalu kamu perhatikan dari seseorang pas pertama kali bertemu?",
    "Kalau kamu bisa mengundang 3 tokoh terkenal untuk makan malam di rumah kamu, siapa saja yang kamu ajak?",
    "Apa arti waktu luang atau weekend yang sempurna versi kamu pribadi?"
  ],
  absurd: [
    "Kalau kedua tangan kamu tiba-tiba bisa bicara sendiri pas kamu lagi makan, kalimat pertama yang dia omongkan apa?",
    "Kalau kamu terpaksa harus tinggal selamanya di dalam sebuah video game kuno, game apa yang bakal kamu pilih?",
    "Pilih mana: bisa terbang tapi cuma setinggi 10 cm dari tanah, atau bisa teleportasi tapi cuma sejauh 1 meter?",
    "Kalau kamu berubah jadi varian mie instan terbaru, kamu bakal jadi rasa apa dan apa keunikannya?",
    "Hewan apa yang kalau dipakaikan kemeja dan dasi bakal kelihatan paling cocok jadi pimpinan perusahaan?",
    "Kalau semua barang di kamar kamu bisa protes, barang mana yang kira-kira paling galak dan cerewet?",
    "Pilih mana: setiap bicara harus pakai nada bernyanyi opera, atau setiap jalan harus sambil berjoget?",
    "Kalau kamu harus dapat nama panggung penyanyi dangdut, nama apa yang paling cocok buat kamu?",
    "Kalau kamu bisa bikin peraturan ajaib yang wajib ditaati semua orang, peraturan konyol apa itu?",
    "Seandainya alien mendarat di depan rumah kamu dan minta 1 makanan bumi paling enak, kamu kasih apa?",
    "Pilih mana: seumur hidup cuma bisa makan makanan dingin, atau seumur hidup cuma bisa mandi pakai air es?",
    "Kalau kamu jadi presiden planet Mars, undang-undang pertama yang kamu buat apa?",
    "Pilih mana: bisa mengerti bahasa semua hewan di bumi, atau bisa memainkan semua alat musik secara instan?",
    "Seandainya kamu tiba-tiba punya bantal ajaib yang mencetak mimpi jadi film, film seperti apa itu?",
    "Pilih mana: seumur hidup berjalan kesamping seperti kepiting, atau seumur hidup melompat seperti kangguru?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke teman dekat sekali pun?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir dan prinsip kamu sampai hari ini?",
    "Kalau kamu bisa kirim satu kalimat pesan singkat ke diri kamu sendiri 10 tahun lalu, apa pesan utamanya?",
    "Menurut pandangan kamu pribadi, definisi bahagia dan tenang yang sesungguhnya itu seperti apa?",
    "Pernahkah kamu merasa berada di titik terendah dalam hidup dan apa hal yang bikin kamu bangkit kembali?",
    "Apa pencapaian terkecil kamu yang orang lain sepelekan tapi sebenarnya paling kamu syukuri?",
    "Satu hal apa dari diri kamu sendiri yang sampai sekarang masih berusaha kamu maafkan dan ikhlaskan?",
    "Kalau kamu melihat kehidupan kamu 5 tahun ke depan, suasana seperti apa yang ingin kamu capai?",
    "Apa kekecewaan atau rasa sakit masa lalu yang mengajarkan kamu pelajaran hidup paling berharga?",
    "Hal paling berani apa yang pernah kamu lakukan demi mempertahankan nilai dan prinsip hidup kamu?",
    "Satu mimpi besar kamu yang belum pernah kamu bagikan ke siapa pun karena takut diremehkan?",
    "Kapan kali terakhir kamu merasa sangat bersyukur hingga meneteskan air mata haru?",
    "Apa pesan terbaik yang ingin kamu tinggalkan untuk orang-orang terkasih di hidup kamu kelak?",
    "Satu hal yang paling ingin kamu perbaiki dari cara kamu menyikapi ketidakpastian masa depan?",
    "Pernahkah kamu merasa berpura-pura baik-baik saja di depan orang lain padahal di dalam hati sedang sangat lelah?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering membuat kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah membuat kangen?",
    "Apa hal pertama yang membuat kamu yakin untuk membuka hati dan mendekat ke aku dulu?",
    "Kalau kita punya waktu 1 hari penuh tanpa gangguan HP dan pekerjaan, kamu pengen kita pergi ke mana?",
    "Apa mimpi atau target bersama yang paling ingin kita capai dalam beberapa tahun ke depan?",
    "Bahasa cinta mana dari aku yang paling membuat kamu merasa dicintai secara utuh?",
    "Ceritakan momen PDKT kita yang menurut kamu paling lucu, salah tingkah, atau canggung!",
    "Apa perbedaan sifat di antara kita yang menurut kamu justru bikin hubungan kita saling melengkapi?",
    "Apa momen di mana kamu merasa paling beruntung dan bersyukur memiliki aku di hidup kamu?",
    "Hal sederhana apa yang paling sering bikin kamu merasa nyaman saat kita lagi duduk berdua?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung membuat kamu flashback ke masa lalu?",
    "Tontonan kartun atau acara televisi hari Minggu favorit kamu saat masih sekolah dulu?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan susah dicari sekarang?",
    "Mainan atau permainan tradisional apa yang paling sering membuat kamu lupa waktu saat kecil?",
    "Kenangan atau pengalaman lucu apa yang paling berkesan bersama teman masa sekolah dulu?",
    "Foto atau gaya berpakaian jaman sekolah mana yang kalau kamu lihat lagi sekarang bikin tengsin?",
    "Siapa guru atau pengajar jaman sekolah yang paling ikonik dan tidak pernah kamu lupakan?",
    "Cerita cinta monyet atau pengalaman naksir seseorang jaman sekolah yang paling bikin senyum-senyum sendiri?",
    "Permainan konsol atau game HP jadul apa yang dulu pernah bikin kamu ketagihan sampai malam?",
    "Apa kebiasaan sore hari pas masa kecil setelah pulang sekolah yang paling bikin kangen?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan hangat apa yang hanya ada dan rutin dilakukan di dalam keluarga kamu?",
    "Nasihat terpenting dari orang tua yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah favorit apa yang selalu paling dikangenin saat sedang jauh dari rumah?",
    "Momen kebersamaan keluarga mana yang paling hangat dan selalu kamu kenang sampai hari ini?",
    "Siapa anggota keluarga kamu yang paling humoris dan selalu jadi pemecah suasana kalau lagi kumpul?",
    "Ceritakan momen ketika kamu berhasil membuat orang tua kamu tersenyum bangga!",
    "Pelajaran tentang kerja keras dan rasa syukur apa yang paling melekat dari cara orang tua membesarkan kamu?",
    "Acara mudik atau liburan keluarga mana yang punya cerita paling seru dan tak terlupakan?",
    "Hal sederhana apa dari suasana rumah yang selalu membuat kamu merasa tenang dan aman?",
    "Kalau kamu bisa memberikan hadiah impian untuk orang tua kamu esok hari, hadiah apa itu?"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100 persen?",
    "Bagaimana jika kamu bisa mengerti dan menguasai seluruh bahasa di dunia secara instan malam ini?",
    "Bagaimana jika kamu diizinkan tinggal di negara mana pun di dunia gratis selama 1 tahun penuh?",
    "Bagaimana jika kamu bisa membaca pikiran hewan peliharaan kamu selama 24 jam?",
    "Bagaimana jika kamu menemukan pintu rahasia di kamar kamu yang bisa mengantar kamu ke masa lalu?",
    "Bagaimana jika kamu bisa menukar keahlian kamu dengan satu tokoh sejarah terkenal, siapa yang kamu pilih?",
    "Bagaimana jika kamu diberi kemampuan melihat masa depan 5 menit ke depan, bagaimana kamu memanfaatkannya?",
    "Bagaimana jika kamu memenangkan kompetisi dunia dan diberi pulau pribadi, pulau itu mau kamu jadikan apa?"
  ],
  karir: [
    "Apa cita-cita atau mimpi terbesar kamu yang belum sempat diwujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah, pekerjaan atau karya apa yang akan kamu tekuni sepenuh hati?",
    "Pencapaian atau karya apa dalam karir yang paling membuat kamu merasa puas dan bangga?",
    "Nasihat karir terbaik apa yang paling mengubah cara pandang kamu?",
    "Apa pengorbanan terbesar yang pernah kamu lakukan demi meraih posisi atau impian kamu saat ini?",
    "Kalau kamu punya modal bebas untuk buka bisnis sendiri esok hari, bidang usaha apa yang ingin kamu bangun?",
    "Momen ketika kamu merasa paling burnout dalam bekerja, dan bagaimana kamu melewatinya?",
    "Siapa sosok profesional yang paling menginspirasi etos kerja dan cara berpikir kamu?",
    "Apa skill baru yang paling ingin kamu kuasai dalam 1 tahun ke depan untuk mendukung karir kamu?",
    "Bagaimana definisi work-life balance yang ideal versi kamu pribadi?",
    "Momen ketika kamu pernah gagal dalam proyek, tapi hasilnya malah membuka jalan yang lebih baik?",
    "Apa prinsip dalam bekerja yang tidak akan pernah kamu kompromikan demi uang?",
    "Gaji atau pendapatan pertama dalam hidup kamu dulu kamu pakai untuk membeli apa?",
    "Apa impian terbesar kamu untuk masa pensiun atau masa tua kelak?"
  ],
  tod_truth: [
    "Siapa orang yang paling kamu sukai atau taksir secara diam-diam saat masa sekolah dulu?",
    "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain dan belum pernah ketahuan?",
    "Pernahkah kamu pura-pura sakit atau sibuk cuma demi kabur dari janji bertemu teman?",
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke orang lain?",
    "Siapa orang yang paling sering kamu cari tahu kabarnya atau stalk diam-diam di sosmed?",
    "Ceritakan satu momen paling canggung atau tengsin yang pernah kamu alami dalam hidup!",
    "Hal paling impulsif apa yang pernah kamu beli padahal sebenarnya tidak berguna?",
    "Apa rahasia paling konyol yang belum pernah kamu ceritakan ke siapa pun sampai hari ini?"
  ],
  tod_dare_offline: [
    "Tatap mata teman di sebelah kananmu selama 20 detik penuh tanpa tersenyum sedikit pun!",
    "Tunjukkan foto paling konyol di galeri HP kamu ke semua teman di meja!",
    "Tiru gaya jalan atau gaya bicara salah satu orang di sini dengan mirip!",
    "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di meja!",
    "Lakukan gerakan olahraga ringan sambil sebutkan 5 nama makanan!",
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

// ─── Topic Configs for Gemini Prompts ──────────────────────────────────────────
const TOPIC_PROMPTS: Record<string, string> = {
  kenalan: "perkenalan, cerita diri, kebiasaan unik, hal-hal lucu sehari-hari, selera dan preferensi, pengalaman pertama, kepribadian seseorang",
  absurd: "pertanyaan absurd, pilihan konyol, skenario tidak masuk akal, imajinasi liar, humor ringan tanpa kata-kata kasar atau menjijikkan",
  deep: "refleksi diri, makna hidup, ketakutan, impian tersembunyi, pertumbuhan pribadi, pelajaran dari kesulitan, hubungan emosional yang dalam",
  pasangan: "hubungan romantis, kenangan bersama pasangan, momen manis, rencana masa depan berdua, bahasa cinta, hal-hal kecil yang berarti",
  nostalgia: "kenangan masa kecil, jaman sekolah, permainan tradisional, jajanan jadul, lagu nostalgia, teman lama, momen bersejarah",
  keluarga: "kebersamaan keluarga, tradisi rumah, nasihat orang tua, masakan rumah, momen hangat bersama saudara, nilai-nilai keluarga",
  whatif: "skenario hipotetis yang menarik dan penuh imajinasi, bagaimana jika sesuatu berubah total, pilihan-pilihan besar dalam hidup",
  karir: "pekerjaan, mimpi karir, bisnis, pencapaian profesional, pelajaran kerja, keseimbangan hidup, pengembangan diri",
};

// ─── Fisher-Yates Shuffle ───────────────────────────────────────────────────────
function fisherYatesShuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// ─── Gemini Question Generator ─────────────────────────────────────────────────
async function generateWithGemini(topic: string, customPrompt: string, count: number, exclude: string[]): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('No Gemini API key');

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const topicDesc = topic === 'ai_custom' && customPrompt
    ? customPrompt
    : (TOPIC_PROMPTS[topic] || TOPIC_PROMPTS['kenalan']);

  // Send up to 80 excluded questions to Gemini to minimize repeats
  const excludeSnippet = exclude.length > 0
    ? `\n\nJANGAN gunakan atau parafrase pertanyaan-pertanyaan berikut (sudah pernah keluar sebelumnya):\n${exclude.slice(0, 80).map(q => `- ${q}`).join('\n')}`
    : '';

  const prompt = `Kamu adalah kreator konten game obrolan sosial Indonesia yang berpengalaman. 
Tugasmu: buat tepat ${count} pertanyaan obrolan seru dan autentik dalam Bahasa Indonesia.

TOPIK: ${topicDesc}

ATURAN WAJIB (SANGAT PENTING):
1. Semua pertanyaan WAJIB dalam Bahasa Indonesia yang natural dan kasual (bukan formal/kaku)
2. Setiap pertanyaan harus 100% relevan dengan topik "${topicDesc}" — JANGAN keluar dari topik ini
3. Pertanyaan harus mengundang cerita, bukan jawaban ya/tidak
4. Gaya bahasa: hangat, seru, seperti ngobrol sama teman dekat
5. DILARANG KERAS: konten vulgar, jorok, SARA, politik sensitif, atau menyinggung siapapun
6. Variasikan panjang dan gaya pertanyaan agar tidak monoton
7. Buat pertanyaan yang bikin orang mau bercerita panjang
${excludeSnippet}

FORMAT OUTPUT (WAJIB DIIKUTI PERSIS):
- Tulis HANYA daftar pertanyaan, satu per baris
- TANPA nomor, TANPA bullet point, TANPA penjelasan apapun
- TANPA tanda kutip di awal/akhir pertanyaan
- Langsung mulai dengan pertanyaan pertama`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  const questions = text
    .split('\n')
    .map(line => line.trim())
    .filter(line =>
      line.length > 15 &&
      !line.match(/^\d+[\.\)]/) &&
      !line.match(/^[-•*]/) &&
      !line.startsWith('#') &&
      !line.startsWith('Pertanyaan') &&
      !line.startsWith('Topik') &&
      !line.startsWith('Berikut')
    )
    .map(line => line.replace(/^["']|["']$/g, '').trim())
    .filter(line => line.length > 10);

  return questions;
}

// ─── Main API Handler ───────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const { topic = 'kenalan', customPrompt = '', count = 20, exclude = [] } = await request.json();

    const excludeArr: string[] = Array.isArray(exclude) ? exclude.map((s: string) => String(s).trim()) : [];
    const excludeSet = new Set(excludeArr.map(s => s.toLowerCase()));

    const REGULAR_KEYS = ['kenalan', 'absurd', 'deep', 'pasangan', 'nostalgia', 'keluarga', 'whatif', 'karir'];
    const TOD_KEYS = ['tod_truth', 'tod_dare_offline', 'tod_dare_online'];
    const isTodTopic = TOD_KEYS.includes(topic);

    // ToD topics always use static banks (too specific for AI)
    if (isTodTopic) {
      const bank = fisherYatesShuffle(BASE_AI_BANKS[topic] || BASE_AI_BANKS['tod_truth']);
      return NextResponse.json({ success: true, topic, questions: bank.slice(0, count) });
    }

    // ── Try Gemini AI first ────────────────────────────────────────────────────
    try {
      const aiQuestions = await generateWithGemini(topic, customPrompt, count + 5, excludeArr);

      if (aiQuestions.length >= Math.min(count, 5)) {
        // Deduplicate against seen questions
        const fresh = aiQuestions.filter(q => !excludeSet.has(q.toLowerCase()));
        const finalPool = fresh.length >= count ? fresh : [...fresh, ...aiQuestions];
        const unique = Array.from(new Set(finalPool)).slice(0, count);

        return NextResponse.json({ success: true, topic, questions: unique, source: 'gemini' });
      }
    } catch (geminiError) {
      console.warn('[generate-questions] Gemini failed, using static fallback:', geminiError);
    }

    // ── Static bank fallback ───────────────────────────────────────────────────
    let primaryBank: string[] = topic === 'mix'
      ? REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || [])
      : (BASE_AI_BANKS[topic] || BASE_AI_BANKS['kenalan']);

    let available = primaryBank.filter(q => !excludeSet.has(q.toLowerCase()));

    // Strict topic isolation — recycle same bank, NEVER bleed to other topics
    if (available.length < count) {
      const recycled = fisherYatesShuffle(primaryBank);
      available = Array.from(new Set([...available, ...recycled]));
    }

    const shuffled = fisherYatesShuffle(available);
    return NextResponse.json({ success: true, topic, questions: shuffled.slice(0, count), source: 'static' });

  } catch (error) {
    const fallback = fisherYatesShuffle(BASE_AI_BANKS['kenalan'] || []);
    return NextResponse.json({ success: true, topic: 'kenalan', questions: fallback.slice(0, 10), source: 'emergency' });
  }
}
