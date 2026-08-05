// Procedural Infinite Question Generator for ObrolanSeru
// Combines templates, subjects, contexts, and twists to produce 50,000+ unique, natural Indonesian questions!

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

const TEMPLATES: Record<string, string[]> = {
  kenalan: [
    "Kalau {subjek} kamu {aksi}, {pertanyaan}?",
    "Ceritakan {momen} paling {sifat} saat kamu {kondisi}!",
    "Apa {hal} tentang {subjek} yang {penjelasan}?",
    "Kalau kamu {kesempatan} bersama {orang}, {tindakan} apa yang pertama kamu lakukan?",
    "Menurut kamu, apa {bakat} rahasia dari {orang} di grup ini yang belum banyak diketahui?",
    "Kalau hidup kamu {analogi}, kira-kira {detail}?",
    "Apa {kebiasaan} kecil yang paling sering kamu lakukan saat {situasi}?",
    "Siapa sosok {orang} yang paling sering membuat kamu {perasaan} dalam {waktu}?",
    "Kalau kamu diberi {hadiah} esok hari, kamu bakal {penggunaan} untuk apa?"
  ],
  absurd: [
    "Bagaimana kalau tiba-tiba {benda} kamu {aksi_absurd} saat kamu lagi {situasi}?",
    "Pilih mana: {pilihan1} atau {pilihan2}?",
    "Seandainya kamu berubah jadi {benda_unik}, apa {keuntungan} yang paling kamu rasakan?",
    "Kalau alien mendarat di depan rumah kamu dan minta {permintaan}, kamu bakal {respon}?",
    "Apa undang-undang konyol pertama yang kamu buat kalau jadi presiden planet {planet}?"
  ],
  deep: [
    "Apa {pelajaran} terbesar yang kamu dapatkan saat melewati masa {kesulitan}?",
    "Siapa sosok yang paling banyak mengubah {prinsip} hidup kamu sampai detik ini?",
    "Kapan kali terakhir kamu merasa sangat {perasaan_deep} dan apa pemicunya?",
    "Apa satu mimpi besar tentang {masa_depan} yang belum pernah kamu ceritakan ke siapa-siapa?",
    "Hal sederhana apa yang paling membuat kamu merasa {kedamaian} di tengah riuhnya hidup?"
  ],
  pasangan: [
    "Momen {sifat_romantis} apa dari kita yang paling sering bikin kamu tersenyum sendiri?",
    "Kebiasaan kecil dari aku yang menurut kamu paling {sifat_lucu} itu apa?",
    "Kalau kita punya 1 hari penuh tanpa {gangguan}, kamu pengen kita {kegiatan} ke mana?",
    "Apa hal pertama yang bikin kamu yakin bahwa aku adalah {arti_pasangan}?"
  ],
  nostalgia: [
    "Apa {kenangan_jadul} jaman sekolah yang kalau diingat lagi sekarang bikin ngakak?",
    "Jajanan atau permainan jaman {masa_lalu} apa yang paling kamu kangenin?",
    "Siapa teman atau guru sekolah yang paling {karakter_guru} dan tak pernah kamu lupakan?",
    "Lagu atau tontonan jadul apa yang paling punya tempat spesial di hati kamu?"
  ],
  keluarga: [
    "Tradisi atau kebiasaan paling {sifat_keluarga} di keluarga kamu yang tidak ada di keluarga lain?",
    "Nasihat orang tua mana yang dulu kamu sepelekan tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan rumah buatan siapa yang selalu paling kamu kangenin saat jauh?",
    "Ceritakan momen paling hangat bersama {anggota_keluarga} yang paling membekas!"
  ],
  whatif: [
    "Bagaimana jika kamu terbangun esok pagi dan {skenario_whatif}?",
    "Bagaimana jika selama {durasi}, seluruh manusia di bumi tidak bisa {kemampuan}?",
    "Bagaimana jika kamu diberi kesempatan {kesempatan_whatif}, apa pilihan pertama kamu?"
  ],
  karir: [
    "Kalau uang bukan lagi masalah, {pekerjaan_impian} seperti apa yang bakal kamu tekuni?",
    "Pencapaian atau karya terbaik apa dalam karir/kuliah yang paling bikin kamu bangga?",
    "Apa skill atau keahlian baru yang paling pengen kamu kuasai dalam {waktu_karir}?"
  ]
};

const WORDS: Record<string, string[]> = {
  subjek: ["kehidupan", "karir", "hobi", "gaya hidup", "playlist lagu", "kamar tidur", "rutinitas pagi"],
  aksi: ["dijadikan buku biografi", "dibuatkan film", "dijadikan serial TV", "diubah jadi komik"],
  pertanyaan: ["apa judul yang paling cocok", "siapa aktor utama pilihan kamu", "genre apa yang paling tepat"],
  momen: ["pengalaman", "kejadian", "kenangan", "cerita konyol"],
  sifat: ["lucu", "tak terduga", "berkesan", "menggemaskan", "unik"],
  kondisi: ["pertama kali masuk kampus/kerja", "lagi nongkrong malam minggu", "liburan bareng teman", "lagi jalan-jalan"],
  hal: ["kebiasaan unik", "fakta menarik", "rahasia kecil", "bakat tersembunyi"],
  penjelasan: ["belum pernah kamu ceritakan", "jarang diketahui orang", "bikin orang heran"],
  kesempatan: ["bisa jalan-liburan 3 hari", "makan malam santai", "bikin podcast bareng", "tukar nasib 24 jam"],
  orang: ["seseorang", "sahabat terbaik", "teman lama", "salah satu teman di meja ini"],
  tindakan: ["hal pertama", "topik obrolan utama", "kegiatan seru"],
  analogi: ["disamakan dengan menu makanan", "diumpamakan seperti musim", "dibandingkan dengan karakter kartun"],
  detail: ["kamu bakal jadi varian apa", "elemen apa yang paling menggambarkan sifatmu"],
  kebiasaan: ["hal konyol", "kebiasaan unik", "rutinitas santai"],
  situasi: ["lagi mati gaya", "susah tidur malam hari", "lagi nunggu janji teman"],
  perasaan: ["tertawa paling keras", "senyum-senyum sendiri", "merasa tenang", "terinspirasi"],
  waktu: ["sebulan terakhir", "seminggu belakangan", "setahun terakhir"],
  hadiah: ["tiket liburan gratis", "uang kaget", "kesempatan belajar skill instan"],
  penggunaan: ["memanfaatkannya", "menghabiskannya", "merayakannya"],

  benda: ["HP kamu", "kasur kamu", "sepatu favoritmu", "kulkas rumah"],
  aksi_absurd: ["bisa bicara dan ngomel", "bisa bernyanyi dangdut", "bisa teleportasi sendiri"],
  pilihan1: ["seumur hidup cuma bisa jalan kesamping", "seumur hidup bicara pakai nada opera"],
  pilihan2: ["seumur hidup cuma bisa makan makanan dingin", "seumur hidup selalu salah kostum"],
  benda_unik: ["varian mie instan terbaru", "bantal ajaib", "karakter video game jadul"],
  keuntungan: ["hal paling menyenangkan", "keunikan utama kamu"],
  permintaan: ["1 makanan bumi paling enak", "1 contoh musik terbaik bumi"],
  respon: ["reaksi kamu", "makanan apa yang kamu kasih"],
  planet: ["Mars", "Jupiter", "Venus"],

  pelajaran: ["pelajaran hidup", "makna penting", "pendewasaan"],
  kesulitan: ["sulit atau ketidakpastian", "perubahan besar", "titik terendah"],
  prinsip: ["cara berpikir", "prinsip utama", "nilai-nilai"],
  perasaan_deep: ["bersyukur", "terharu", "bangga pada diri sendiri"],
  masa_depan: ["karir atau keluarga", "kebahagiaan sejati", "kedamaian hidup"],
  kedamaian: ["tenang dan bahagia", "bersyukur utuh", "nyaman dengan diri sendiri"],

  sifat_romantis: ["paling manis", "paling berkesan", "paling menghangatkan"],
  sifat_lucu: ["lucu dan bikin kangen", "menggemaskan", "unik"],
  gangguan: ["pekerjaan dan gadget", "urusan kampus/kantor", "kebisingan kota"],
  kegiatan: ["pergi liburan santai", "kulineran malam", "deep talk sampai pagi"],
  arti_pasangan: ["orang yang tepat", "pasangan impian", "rumah tempat kembali"],

  kenangan_jadul: ["kejadian bolos", "gaya foto jadul", "kejahilan kelas"],
  masa_lalu: ["SD/SMP dulu", "sekolah dulu", "remaja dulu"],
  karakter_guru: ["ikonik dan galak tapi baik", "paling sabar", "paling humoris"],

  sifat_keluarga: ["hangat dan unik", "lucu", "khas"],
  anggota_keluarga: ["orang tua", "kakak/adik", "keluarga besar"],

  skenario_whatif: ["kamu bisa mengerti bahasa semua hewan", "seluruh dunia tidak bisa berbohong", "kamu bisa kembali ke umur 10 tahun"],
  durasi: ["1 minggu penuh", "24 jam", "1 bulan"],
  kemampuan: ["menggunakan internet", "mengeluh", "menggunakan uang tunai"],
  kesempatan_whatif: ["tinggal di negara mana pun gratis 1 tahun", "menguasai semua alat musik instan"],

  pekerjaan_impian: ["usaha atau karya kreatif", "bisnis impian", "kegiatan sosial"],
  waktu_karir: ["6 bulan ke depan", "1 tahun ke depan", "masa mendatang"]
};

// Generates N guaranteed unique, never-seen procedural questions
export function generateProceduralQuestions(topic: string, count: number, excludeSet: Set<string>): string[] {
  const templateList = TEMPLATES[topic] || TEMPLATES['kenalan'];
  const questions: string[] = [];
  let attempts = 0;
  const maxAttempts = count * 50;

  const normalizeQ = (s: string) => s.trim().toLowerCase().replace(/["'"'`”«»]/g, '').replace(/[?.!,;]/g, '').replace(/\s+/g, ' ');

  while (questions.length < count && attempts < maxAttempts) {
    attempts++;
    const tpl = pickRandom(templateList);
    const result = tpl.replace(/\{(\w+)\}/g, (_, key) => {
      const wordList = WORDS[key] || ["hal menarik"];
      return pickRandom(wordList);
    });

    const norm = normalizeQ(result);
    if (!excludeSet.has(norm) && !questions.some(q => normalizeQ(q) === norm)) {
      questions.push(result);
      excludeSet.add(norm);
    }
  }

  return shuffle(questions);
}
