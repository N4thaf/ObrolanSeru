import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateProceduralQuestions } from '@/utils/proceduralQuestions';
import { MASTER_QUESTION_BANKS } from '@/utils/masterQuestionBank';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Vercel: allow up to 60s for Gemini to respond

// ─── Fallback Static Banks (used when Gemini API is unavailable) ───────────────
const BASE_AI_BANKS: Record<string, string[]> = {
  ...MASTER_QUESTION_BANKS,
  tod_truth: [
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
  ],
  tod_dare_offline: [
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
  ],
  tod_dare_online: [
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
    const normalizeStr = (s: string) => s.trim().toLowerCase().replace(/["'"'`”«»]/g, '').replace(/[?.!,;:]/g, '').replace(/\s+/g, ' ');
    const excludeSet = new Set(excludeArr.map(s => normalizeStr(String(s))));

    const REGULAR_KEYS = ['kenalan', 'absurd', 'deep', 'pasangan', 'nostalgia', 'keluarga', 'whatif', 'karir'];
    const TOD_KEYS = ['tod_truth', 'tod_dare_offline', 'tod_dare_online'];
    const isTodTopic = TOD_KEYS.includes(topic);

    // ToD topics always use static banks (too specific for AI)
    if (isTodTopic) {
      const bank = fisherYatesShuffle(BASE_AI_BANKS[topic] || BASE_AI_BANKS['tod_truth']);
      const filteredBank = bank.filter(q => !excludeSet.has(normalizeStr(q)));
      const poolToUse = filteredBank.length >= count ? filteredBank : bank;
      return NextResponse.json({ success: true, topic, questions: fisherYatesShuffle(poolToUse).slice(0, count) });
    }

    // ── Try Gemini AI first ────────────────────────────────────────────────────
    try {
      const aiQuestions = await generateWithGemini(topic, customPrompt, count + 15, excludeArr);

      if (aiQuestions.length >= Math.min(count, 5)) {
        // Deduplicate against seen questions using fuzzy normalization
        const fresh = aiQuestions.filter(q => !excludeSet.has(normalizeStr(q)));
        let finalPool = [...fresh];

        // If fresh is less than count, fill strictly from master bank (NEVER reuse excluded)
        if (finalPool.length < count) {
          const needed = count - finalPool.length;
          const procedural = generateProceduralQuestions(topic, needed + 5, excludeSet);
          for (const q of procedural) {
            const norm = normalizeStr(q);
            if (!excludeSet.has(norm)) {
              excludeSet.add(norm);
              finalPool.push(q);
            }
            if (finalPool.length >= count) break;
          }
        }

        const unique = Array.from(new Set(finalPool)).slice(0, count);
        return NextResponse.json({ success: true, topic, questions: fisherYatesShuffle(unique), source: 'gemini' });
      }
    } catch (geminiError) {
      console.warn('[generate-questions] Gemini failed, using static fallback:', geminiError);
    }

    // ── Procedural & Static bank fallback ─────────────────────────────────────
    let primaryBank: string[] = topic === 'mix'
      ? REGULAR_KEYS.flatMap(k => BASE_AI_BANKS[k] || [])
      : (BASE_AI_BANKS[topic] || BASE_AI_BANKS['kenalan']);

    let available = primaryBank.filter(q => !excludeSet.has(normalizeStr(q)));

    // Generate procedural questions if static bank is exhausted
    if (available.length < count && !isTodTopic) {
      const needed = count - available.length;
      const procedural = generateProceduralQuestions(topic, Math.max(needed, 10), excludeSet);
      available = Array.from(new Set([...available, ...procedural]));
    }

    const shuffled = fisherYatesShuffle(available);
    return NextResponse.json({ success: true, topic, questions: shuffled.slice(0, count), source: 'procedural' });

  } catch (error) {
    const proceduralFallback = generateProceduralQuestions('kenalan', 10, new Set());
    return NextResponse.json({ success: true, topic: 'kenalan', questions: proceduralFallback, source: 'emergency' });
  }
}
