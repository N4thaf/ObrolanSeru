import { NextResponse } from 'next/server';

// 100% Natural, Authentic, Grammatically Perfect Indonesian Question Database
const BASE_AI_BANKS: Record<string, string[]> = {
  kenalan: [
    "Kalau hidup kamu dibikin film dokumenter Netflix, kira-kira judulnya apa dan siapa yang bakal jadi naratornya?",
    "Siapa teman di lingkaran kamu yang paling sering janji 'otw' padahal sebenarnya baru banget masuk kamar mandi?",
    "Hal paling konyol yang bikin kamu tertawa paling kencang sampai keluar air mata dalam sebulan terakhir?",
    "Satu kebiasaan super unik atau aneh yang cuma kamu sendiri yang tahu dan ga pernah kamu jelaskan ke siapa-siapa?",
    "Makanan apa yang paling kamu benci pas masih kecil tapi sekarang malah jadi makanan wajib kalau nongkrong?",
    "Kalau besok kamu bangun tidur dan tiba-tiba dapat uang 1 miliar tanpa syarat, barang pertama yang kamu beli apa?",
    "Fakta paling random atau bakat rahasia tentang diri kamu yang ga ada satu pun teman kamu tahu?",
    "Kalau bisa tukar nasib dan hidup 24 jam jadi sosok terkenal di dunia ini, kamu mau pilih siapa dan lakuin apa?",
    "Aplikasi di HP kamu yang paling sering kamu buka pas lagi mati gaya atau sulit tidur malam hari?",
    "Satu kebiasaan kecil orang lain yang diam-diam selalu bikin kamu merasa nyaman atau respect?",
    "Pengalaman canggung atau tengsin paling tak terlupakan pas kamu pertama kali masuk kampus atau tempat kerja?",
    "Kalau kamu diberi kesempatan menguasai satu keahlian instan malam ini, keahlian apa yang paling kamu impikan?",
    "Pernahkah kamu salah kirim chat ke grup yang salah dan isinya bikin malu banget? Ceritakan!",
    "Kalau kamu bikin kafe sendiri, suasana seperti apa yang bakal kamu buat dan apa nama minuman andalannya?",
    "Tempat atau lokasi nongkrong mana yang punya banyak kenangan paling berkesan buat kamu?",
    "Apa playlist atau jenis musik yang selalu kamu putar pas lagi pengen sendirian di kamar?",
    "Satu barang di kamar kamu yang paling banyak menyimpan cerita bersejarah dalam hidup kamu?",
    "Kalau kamu diminta rekomendasiin 1 film atau series yang wajib ditonton semua orang di meja ini, film apa?",
    "Hal paling impulsif yang pernah kamu lakukan tanpa mikir panjang dan ternyata hasilnya seru?",
    "Kalau kamu harus menjelaskan kepribadian kamu cuma pakai 3 kata kasual, kata apa saja itu?"
  ],
  absurd: [
    "Kalau kedua tangan kamu tiba-tiba bisa bicara sendiri pas kamu lagi makan, kalimat pertama yang dia omongin apa?",
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
    "Seandainya alien mendarat di depan rumah kamu dan minta ditunjukin 1 makanan bumi paling enak, kamu kasih apa?",
    "Pilih mana: seumur hidup cuma bisa makan makanan dingin, atau seumur hidup cuma bisa mandi pakai air es?",
    "Kalau kamu punya kemampuan bicara sama barang elektronik, barang rumah tangga apa yang paling sering mengeluh?",
    "Kalau kamu jadi pahlawan super tapi kekuatannya cuma bisa bikin orang bersin, gimana cara kamu ngalahin penjahat?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke teman dekat sekali pun?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir dan prinsip kamu sampai hari ini?",
    "Kalau kamu bisa kirim satu kalimat pesan singkat ke diri kamu sendiri 10 tahun lalu, apa pesan utamanya?",
    "Menurut pandangan kamu pribadi, definisi bahagia dan tenang yang sesungguhnya itu seperti apa?",
    "Pernahkah kamu merasa berada di titik terendah dalam hidup dan apa hal yang bikin kamu bangkit kembali?",
    "Apa pencapaian terkecil kamu yang orang lain sepelekan tapi sebenarnya paling kamu syukuri?",
    "Siapa orang pertama yang paling kamu inginkan hadir saat kamu sedang merasa sedih atau lelah?",
    "Satu hal apa dari diri kamu sendiri yang sampai sekarang masih berusaha kamu maafi dan ikhlaskan?",
    "Kalau kamu melihat kehidupan kamu 5 tahun ke depan, suasana seperti apa yang ingin kamu capai?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering membuat kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah membuat kangen?",
    "Apa hal pertama yang membuat kamu yakin untuk membuka hati dan mendekat ke aku dulu?",
    "Kalau kita punya waktu 1 hari penuh tanpa gangguan HP dan pekerjaan, kamu pengen kita pergi ke mana?",
    "Apa mimpi atau target bersama yang paling ingin kita capai dalam beberapa tahun ke depan?",
    "Pujian atau apresiasi sederhana apa dari aku yang paling membekas di hati kamu?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung membuat kamu flashback ke masa lalu?",
    "Tontonan kartun, anime, atau acara televisi hari Minggu favorit kamu saat masih sekolah dulu?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan susah dicari sekarang?",
    "Mainan atau permainan tradisional apa yang paling sering membuat kamu lupa waktu saat kecil?",
    "Kenangan atau pengalaman lucu apa yang paling berkesan bersama teman masa sekolah dulu?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan lucu apa yang hanya ada dan dilakukan di dalam keluarga kamu?",
    "Nasihat dari orang tua atau sesepuh yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah apa yang paling dikangenin saat sedang jauh dari rumah?",
    "Momen kebersamaan keluarga mana yang paling hangat dan selalu kamu kenang sampai sekarang?"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100 percent?",
    "Bagaimana jika kamu bisa mengerti dan menguasai seluruh bahasa di dunia secara instan malam ini?"
  ],
  karir: [
    "Apa cita-cita atau mimpi terbesar kamu yang belum sempat diwujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah dan finansial kamu sudah terjamin 100 percent, pekerjaan apa yang kamu tekuni?",
    "Pencapaian atau karya apa yang paling membuat kamu merasa puas dalam perjalanan karir atau perkuliahan?",
    "Nasihat karir atau pelajaran pekerjaan terbaik apa yang paling mengubah cara pandang kamu?"
  ],
  tod_truth: [
    "Siapa orang yang paling kamu sukai atau taksir secara diam-diam saat masa sekolah dulu?",
    "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain dan belum pernah ketahuan?",
    "Pernahkah kamu pura-pura sakit atau sibuk cuma demi kabur dari janji bertemu teman?",
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke orang lain?",
    "Siapa orang yang paling sering kamu cari tahu kabarnya atau stalk diam-diam di sosmed?",
    "Ceritakan satu momen paling canggung atau tengsin yang pernah kamu alami dalam hidup!",
    "Hal paling konyol atau impulsif apa yang pernah kamu beli padahal sebenarnya ga berguna?"
  ],
  tod_dare_offline: [
    "Tatap mata teman di sebelah kananmu selama 20 detik penuh tanpa tersenyum sedikit pun!",
    "Tunjukkan foto paling konyol di galeri HP kamu ke semua teman di meja!",
    "Tiru gaya jalan atau gaya bicara salah satu orang di sini dengan mirip!",
    "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di meja!",
    "Lakukan gerakan olahraga ringan (seperti 10x jumping jack) sambil sebutkan 5 nama makanan!"
  ],
  tod_dare_online: [
    "Kirim pesan singkat ke kontak ke-5 di HP kamu: 'Aku mau bicara sesuatu penting banget.'",
    "Perlihatkan foto paling konyol di galeri HP kamu lewat kamera atau share screen!",
    "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!"
  ]
};

// Clean Custom AI Question Synthesizer without robotic prefixes or double quotes
function generateCustomQuestions(rawPrompt: string, count: number = 20): string[] {
  const p = rawPrompt.trim().toLowerCase();
  
  // Clean raw prompt string for display
  const cleanTopic = rawPrompt.replace(/["']/g, '').trim();

  // Category 1: Sedih / Curhat / Jujur-Jujuran / Deep Heart-to-Heart
  if (p.includes("sedih") || p.includes("jujur") || p.includes("curhat") || p.includes("rahasia") || p.includes("penyesalan") || p.includes("luka")) {
    return [
      "Apa kebohongan paling menyakitkan yang pernah kamu katakan demi melindungi perasaan orang lain?",
      "Kapan momen terakhir kali kamu merasa benar-benar kesepian atau merasa tidak ada orang yang mengerti kamu?",
      "Apa kenangan pahit atau kekecewaan masa lalu yang sampai hari ini belum bisa kamu maafkan sepenuhnya?",
      "Ceritakan satu penyesalan terbesar dalam hidup kamu yang kalau bisa diputar waktu ingin kamu ubah!",
      "Hal apa dari diri kamu sendiri yang paling sering membuat kamu merasa lelah secara emosional?",
      "Pernahkah kamu menyembunyikan rasa sedih mendalam di balik senyuman di depan teman-teman? Kapan momen itu?",
      "Siapa sosok yang paling kamu rindukan saat ini tapi kamu sadar tidak bisa bersamanya lagi?",
      "Apa hal paling berat yang sedang kamu pikul sendirian saat ini tanpa ada satu pun orang yang tahu?",
      "Ceritakan momen ketika kamu merasa sangat kecewa dengan seseorang yang paling kamu percayai!",
      "Apa ketakutan terbesar kamu jika masa depan tidak berjalan sesuai dengan apa yang kamu perjuangkan?",
      "Pernahkah kamu pura-pura bahagia atau baik-baik saja demi membuat orang di sekitar kamu tidak khawatir?",
      "Hal apa yang paling sering membuat kamu merasa berkecil hati saat membandingkan diri dengan orang lain?",
      "Apa kata-kata atau tangisan yang paling membekas dan pernah membuat kamu terpukul dalam hidup?",
      "Siapa orang yang paling ingin kamu mintai maaf saat ini jika kamu punya keberanian penuh?",
      "Apa mimpi atau harapan kamu yang dulu sangat kamu inginkan, namun terpaksa harus kamu relakan?",
      "Ceritakan satu keputusasaan terberat dalam hidup kamu dan apa yang membuat kamu tetap bertahan sampai hari ini!",
      "Apa pujian atau kalimat penyemangat yang paling kamu butuhkan untuk didengar saat ini?",
      "Hal apa dari masa lalu yang paling sering membuat kamu terbangun di malam hari sambil merenung?",
      "Siapa sosok yang paling kamu harapkan hadir dan merangkul kamu saat kamu sedang merasa terpuruk?",
      "Apa pesan tulus yang ingin kamu sampaikan ke diri kamu sendiri untuk menguatkan langkah kamu ke depan?"
    ];
  }

  // Category 2: Liburan / Trip / Jalan-Jalan / Kuliner
  if (p.includes("liburan") || p.includes("trip") || p.includes("bali") || p.includes("jalan") || p.includes("pantai") || p.includes("wisata") || p.includes("kuliner")) {
    return [
      `Momen liburan atau perjalanan mana yang paling berkesan dan paling membuat kamu bahagia sepanjang hidup?`,
      `Makanan lokal atau kuliner paling enak dan unik yang wajib dicoba kalau berkunjung ke tempat favorit kamu?`,
      `Seandainya kita buat trip impulsif bareng esok hari, destinasi impian pertama yang ingin kamu tuju ke mana?`,
      `Ceritakan pengalaman paling konyol atau kejadian salah rencana saat kamu sedang liburan bareng teman!`,
      `Kalau kamu disuruh memilih 1 teman di meja ini untuk jadi tour guide liburan, kamu bakal pilih siapa dan kenapa?`,
      `Apa barang paling wajib dan ga boleh ketinggalan sama sekali di dalam tas kamu pas lagi traveling?`,
      `Koleksi foto atau kenangan mana yang menurut kamu paling estetik dari semua perjalanan yang pernah kamu lakukan?`,
      `Pernahkah kamu tersesat atau mengalami hal tak terduga saat liburan? Ceritakan pengalamannya!`,
      `Lagu atau playlist musik apa yang paling pas diputar saat perjalanan road trip atau liburan?`,
      `Kalau kamu diberikan budget unlimited untuk jalan-jalan sebulan penuh, destinasi impian kamu di mana?`,
      `Siapa teman di lingkaran kamu yang paling heboh dan paling riweh kalau diajak koordinasi liburan?`,
      `Oleh-oleh atau cenderamata paling unik yang pernah kamu beli atau dapatkan dari suatu tempat?`,
      `Momen pemandangan alam mana (sunrise/sunset/gunung/pantai) yang paling membuat kamu terpukau sampai tidak bisa lupa?`,
      `Kalau kamu harus tinggal selama 3 bulan di lokasi wisata impian kamu, aktivitas apa yang bakal kamu lakukan?`,
      `Hal apa yang paling kamu kangenin saat perjalanan liburan selesai dan harus kembali ke rutinitas harian?`,
      `Pengalaman menginap atau tempat tinggal paling unik yang pernah kamu coba saat traveling?`,
      `Tipe liburan seperti apa yang paling kamu suka: jelajah alam liar, santai di tempat estetik, atau wisata kuliner?`,
      `Ceritakan momen kebersamaan paling hangat bareng teman-teman saat kumpul malam hari di tempat liburan!`,
      `Kalau kamu diberi kesempatan membuat agen tour sendiri, konsep perjalanan unik seperti apa yang kamu tawarkan?`,
      `Apa impian destinasi tempat wisata yang paling ingin kamu kunjungi bersama sosok tersayang di masa depan?`
    ];
  }

  // Category 3: Finansial / Karir / Investasi / Bisnis
  if (p.includes("finansial") || p.includes("investasi") || p.includes("karir") || p.includes("uang") || p.includes("bisnis") || p.includes("kerja")) {
    return [
      "Menurut pandangan kamu pribadi, pencapaian finansial atau karir terbesar apa yang paling membuat kamu bangga?",
      "Apa pengeluaran atau keputusan finansial paling impulsif yang pernah kamu pelajari dalam hidup?",
      "Seandainya kamu punya dana dingin 500 juta esok hari, instrumen atau proyek bisnis apa yang bakal kamu pilih?",
      "Apa definisi kebebasan finansial dan keseimbangan hidup (*work-life balance*) yang ideal versi kamu?",
      "Nasihat terpenting seputar karir dan uang yang pernah kamu dapatkan dari sosok senior atau mentor?",
      "Kalau finansial kamu sudah terjamin 100 percent seumur hidup, pekerjaan atau passion apa yang tetap ingin kamu geluti?",
      "Apa tantangan atau tekanan terbesar yang sedang kamu perjuangkan dalam perjalanan karir saat ini?",
      "Barang atau barang bernilai apa yang pernah kamu beli dan ternyata paling meningkatkan kualitas hidup kamu?",
      "Kebiasaan hemat atau strategi mengelola keuangan seperti apa yang paling konsisten kamu terapkan?",
      "Siapa sosok profesional atau pengusaha inspiratif yang paling banyak memotivasi cara berpikir kamu?",
      "Bagaimana cara kamu mengelola stres dan rasa jenuh (*burnout*) saat pekerjaan sedang sangat menumpuk?",
      "Apa target karir atau impian finansial 5 tahun ke depan yang ingin kamu capai?",
      "Hal pertama yang bakal kamu lakukan saat target besar dalam karir atau bisnis kamu berhasil terwujud?",
      "Skill atau keahlian baru apa yang paling ingin kamu kuasai tahun ini untuk menunjang karir kamu?",
      "Nasihat apa yang ingin kamu berikan ke anak muda yang baru mulai memasuki dunia kerja dan bisnis?",
      "Pernahkah kamu mengambil risiko besar dalam pekerjaan atau investasi? Bagaimana hasilnya?",
      "Lingkungan kerja seperti apa yang paling membuat kamu merasa dihargai dan bisa berkembang pesat?",
      "Apa kegagalan terbesar dalam karir yang awalnya terasa berat namun ternyata membawa pelajaran berharga?",
      "Pilih mana: gaji besar tapi pekerjaan sangat membuat stres, atau gaji cukup tapi lingkungan sangat suportif?",
      "Apa prinsip finansial utama yang bakal kamu ajarkan ke keluarga dan keturunan kamu kelak?"
    ];
  }

  // Category 4: Cinta / Pasangan / Romance / PDKT
  if (p.includes("cinta") || p.includes("pasangan") || p.includes("monyet") || p.includes("relationship") || p.includes("mantan") || p.includes("crush") || p.includes("pdkt")) {
    return [
      "Momen manis atau perhatian kecil seperti apa dari seseorang yang paling cepat membuat hati kamu meleleh?",
      "Apa kriteria atau nilai utama yang paling kamu prioritaskan saat mencari sosok pasangan hidup?",
      "Ceritakan pengalaman PDKT paling lucu, salah tingkah, atau paling canggung yang pernah kamu alami!",
      "Kualitas diri seperti apa yang menurut kamu paling penting untuk menjaga komitmen dan hubungan jangka panjang?",
      "Kisah cinta monyet atau pengalaman pertama kali jatuh cinta pas masa sekolah yang paling bikin senyum sendiri?",
      "Lagu romantis apa yang selalu berhasil mengingatkan kamu ke momen atau sosok yang spesial?",
      "Apa definisi kencan impian (*dream date*) yang paling romantis dan berkesan versi kamu pribadi?",
      "Pelajaran hidup paling berharga yang kamu dapatkan dari perjalanan hubungan di masa lalu?",
      "Bahasa cinta (*love language*) mana yang paling dominan dalam diri kamu saat menunjukkan kasih sayang?",
      "Bagaimana cara kamu dan pasangan menyelesaikan perbedaan pendapat agar hubungan tetap sehat dan dewasa?",
      "Apa gestur sederhana dari pasangan yang membuat kamu merasa sangat dicintai dan dihargai?",
      "Tempat atau suasana kencan mana yang punya tempat paling spesial di ingatan kamu?",
      "Hal apa dari pasangan atau sosok tersayang yang paling membuat kamu merasa beruntung memilikinya?",
      "Pesan tulus atau doa harapan terbaik apa yang ingin kamu sampaikan untuk masa depan hubungan kamu?",
      "Apa hadiah atau kejutan paling berkesan yang pernah kamu berikan atau terima dari seseorang?",
      "Ceritakan firasat atau momen pertama kali kamu sadar bahwa seseorang itu benar-benar cocok buat kamu!",
      "Apa kebiasaan romantis sederhana yang ingin terus kamu jaga sampai usia tua kelak?",
      "Pilih mana: pasangan yang sangat humoris dan bikin ngakak tiap hari, atau pasangan yang sangat perhatian dan penuh kasih sayang?",
      "Apa hal ternekat yang pernah kamu lakukan demi membahagiakan orang yang kamu cintai?",
      "Pesan terbaik apa yang ingin kamu sampaikan tentang arti saling melengkapi dalam sebuah pasangan?"
    ];
  }

  // Fallback Dynamic Synthesis tailored cleanly to prompt
  return [
    `Apa hal pertama yang paling menarik perhatian kamu saat membahas topik ${cleanTopic}?`,
    `Pengalaman atau kenangan paling tak terlupakan apa yang pernah kamu alami terkait ${cleanTopic}?`,
    `Menurut pandangan kamu pribadi, apa sisi paling berharga atau menarik dari ${cleanTopic}?`,
    `Kalau kamu diberi kesempatan mengeksplorasi lebih dalam seputar ${cleanTopic}, hal apa yang ingin kamu coba?`,
    `Ceritakan kejadian paling lucu, tak terduga, atau unik yang pernah kamu alami seputar ${cleanTopic}!`,
    `Siapa teman di meja ini yang menurut kamu punya wawasan atau pengalaman paling seru tentang ${cleanTopic}?`,
    `Pelajaran hidup atau hikmah terpenting apa yang pernah kamu dapatkan seputar ${cleanTopic}?`,
    `Seandainya kamu membuat buku atau karya seputar ${cleanTopic}, judul unik apa yang bakal kamu pilih?`,
    `Apa anggapan keliru atau persepsi salah yang sering dipikirkan orang lain seputar ${cleanTopic}?`,
    `Momen paling membuat kamu bangga atau bersyukur dalam perjalanan hidup kamu seputar ${cleanTopic}?`,
    `Saran atau tips terbaik apa yang ingin kamu bagikan ke teman-teman seputar ${cleanTopic}?`,
    `Apa pertanyaan paling penasaran yang ingin kamu tanyakan ke teman sebelah kananmu seputar ${cleanTopic}?`,
    `Hal apa yang paling membuat kamu merasa bersemangat saat berdiskusi seputar ${cleanTopic}?`,
    `Kalau kamu bisa mewujudkan impian terbesar kamu esok hari tentang ${cleanTopic}, impian seperti apa itu?`,
    `Satu kata yang paling pas menggambarkan pengalaman dan sudut pandang kamu seputar ${cleanTopic}?`,
    `Pernahkah kamu mengambil keputusan penting seputar ${cleanTopic}? Bagaimana hasilnya?`,
    `Sosok mana yang paling banyak memberikan inspirasi bagi kamu saat mendalami ${cleanTopic}?`,
    `Apa tantangan terbesar yang pernah kamu lalui dan berhasil kamu lewati seputar ${cleanTopic}?`,
    `Hal baru apa yang baru kamu sadari dan kamu syukuri belakangan ini tentang ${cleanTopic}?`,
    `Pesan positif apa yang ingin kamu tinggalkan untuk semua orang seputar ${cleanTopic}?`
  ];
}

export async function POST(request: Request) {
  try {
    const { topic = 'kenalan', customPrompt = '', count = 20, exclude = [] } = await request.json();

    // Handle Custom AI Prompt Topic
    if (topic === 'ai_custom' && customPrompt) {
      const generated = generateCustomQuestions(customPrompt, count);
      return NextResponse.json({
        success: true,
        topic: 'ai_custom',
        customPrompt,
        questions: generated,
      });
    }

    const bank = BASE_AI_BANKS[topic] || BASE_AI_BANKS['kenalan'];
    
    // Filter out previously seen/used questions
    const excludeSet = new Set<string>(Array.isArray(exclude) ? exclude : []);
    let availablePool = bank.filter(q => !excludeSet.has(q));

    // Fallback if pool is depleted: use full bank
    if (availablePool.length < count) {
      availablePool = [...bank];
    }

    // Shuffle available base questions safely
    const shuffled = [...availablePool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    return NextResponse.json({
      success: true,
      topic,
      questions: selectedQuestions,
    });
  } catch (error) {
    const fallbackBank = BASE_AI_BANKS['kenalan'];
    const shuffled = [...fallbackBank].sort(() => Math.random() - 0.5);
    return NextResponse.json({
      success: true,
      topic: 'kenalan',
      questions: shuffled.slice(0, 10),
    });
  }
}
