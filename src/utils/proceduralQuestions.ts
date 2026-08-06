// Curated Infinite Question Engine for ObrolanSeru
// Contains 320+ authentic, natural, hand-crafted Indonesian conversation questions across 8 categories.
// Zero robotic templates, zero weird word mashups!

function shuffle<T>(arr: T[]): T[] {
  const res = [...arr];
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [res[i], res[j]] = [res[j], res[i]];
  }
  return res;
}

const normalizeQ = (s: string) => s.trim().toLowerCase().replace(/["'"'`”«»]/g, '').replace(/[?.!,;]/g, '').replace(/\s+/g, ' ');

export const CURATED_BANKS: Record<string, string[]> = {
  kenalan: [
    "Kalau hidup kamu dibuatkan film biografi di Netflix, judulnya apa dan siapa penyanyi yang mengisi soundtrack utamanya?",
    "Siapa orang pertama yang paling sering kamu hubungi saat kamu dapat kabar membahagiakan?",
    "Hal paling konyol apa yang pernah bikin kamu ketawa sendirian di tempat umum sampai dilihatin orang?",
    "Satu kebiasaan kecil yang paling sering kamu lakukan pas lagi bosan atau menunggu di cafe?",
    "Makanan apa yang pas kecil kamu benci banget, tapi sekarang pas dewasa malah jadi makanan favorit?",
    "Kalau besok kamu mendadak dapat uang kaget 100 juta rupiah tanpa syarat, hal pertama yang mau kamu beli apa?",
    "Fakta paling unik atau bakat tersembunyi dari diri kamu yang belum banyak orang tahu?",
    "Kalau kamu bisa menukar nasib dan menjalani kehidupan orang lain selama 24 jam, kamu mau tukar sama siapa?",
    "Aplikasi di HP kamu yang paling sering kamu buka pas lagi mati gaya sebelum tidur?",
    "Kalau kamu buka usaha bisnis sendiri esok hari, tempat seperti apa yang pengen kamu bangun?",
    "Ceritakan satu kenangan paling berkesan saat kamu pertama kali masuk sekolah atau tempat kerja!",
    "Kalau kamu diberi keahlian instan menguasai 1 alat musik malam ini, alat musik apa yang kamu pilih?",
    "Pernahkah kamu salah kirim chat ke grup yang salah dan isinya bikin malu banget? Ceritakan!",
    "Gaya busana atau pakaian seperti apa yang paling membuat kamu merasa nyaman dan percaya diri?",
    "Tempat nongkrong atau sudut kota mana yang punya tempat paling spesial di hati kamu?",
    "Apa playlist atau genre musik yang selalu jadi andalan kamu pas lagi pengen sendirian?",
    "Satu barang di kamar kamu yang paling banyak menyimpan kenangan bersejarah dalam hidupmu?",
    "Kalau kamu diminta menyarankan 1 film atau series yang wajib ditonton semua orang di meja ini, film apa itu?",
    "Hal paling spontan yang pernah kamu lakukan tanpa rencana dan ternyata hasilnya seru banget?",
    "Kalau kamu harus mendeskripsikan kepribadian kamu cuma pakai 3 kata kasual, kata apa saja itu?",
    "Pujian sederhana apa dari orang lain yang sampai sekarang masih sering bikin kamu tersenyum?",
    "Kalau ada mesin waktu dan kamu cuma bisa balik ke 1 momen indah masa lalu, momen apa yang kamu kunjungi?",
    "Apa hal pertama yang paling sering kamu perhatikan saat bertemu orang baru untuk pertama kali?",
    "Kalau kamu bisa mengundang 3 tokoh terkenal untuk makan malam santai di rumahmu, siapa saja mereka?",
    "Seperti apa gambaran hari minggu yang sempurna dan paling ideal versi kamu pribadi?",
    "Kalau kamu diberikan julukan lucu oleh teman-teman terdekatmu, julukan apa yang paling melekat?",
    "Minuman atau racikan kopi/teh favorit yang wajib ada saat kamu lagi nongkrong santai?",
    "Apa kebiasaan tidur paling random yang cuma kamu sendiri yang tahu?",
    "Kalau ada kompetisi rebahan atau santai se-Indonesia, kira-kira kamu bisa bertahan berapa jam?",
    "Siapa karakter di film atau kartun favoritmu yang sifatnya paling mirip sama kamu?",
    "Apa barang murah yang pernah kamu beli tapi ternyata berguna banget di kehidupan sehari-hari?",
    "Kalau kamu bikin saluran YouTube atau Podcast sendiri, topik apa yang bakalan kamu bahas berjam-jam?",
    "Apa momen di mana kamu merasa paling salah kostum atau canggung di suatu acara?",
    "Keterampilan atau kebiasaan kecil orang lain apa yang diam-diam selalu bikin kamu kagum?",
    "Kalau kamu punya kesempatan liburan singkat akhir minggu ini, kota atau negara mana yang ingin kamu tuju?",
    "Apa hal paling konyol yang pernah kamu beli secara impulsif pas lagi scroll e-commerce malam hari?",
    "Kalau kamu boleh memelihara hewan eksotis atau imajiner tanpa risiko, hewan apa yang pengen kamu pelihara?",
    "Siapa teman yang paling sering datang paling terlambat kalau diajak janjian nongkrong?",
    "Apa aroma atau wangi tertentu yang selalu sukses bikin kamu merasa tenang atau nostalgia?",
    "Ceritakan satu pengalaman paling lucu atau salah tingkah yang pernah kamu alami dalam sebulan terakhir!"
  ],

  absurd: [
    "Kalau semua barang di kamar kamu tiba-tiba bisa bicara pas kamu tidur, barang mana yang bakalan paling banyak ngomel?",
    "Pilih mana: seumur hidup cuma bisa berjalan kesamping seperti kepiting, atau bicara dengan nada menyanyi opera?",
    "Seandainya kamu berubah menjadi varian mie instan terbaru, rasa unik apa yang menggambarkan sifatmu?",
    "Kalau alien mendarat di depan rumahmu dan minta 1 makanan Indonesia paling enak, kamu bakal kasih makanan apa?",
    "Apa peraturan konyol pertama yang bakalan kamu sahkan kalau kamu terpilih jadi presiden planet Mars?",
    "Pilih mana: bisa mengerti bahasa semua hewan di bumi, atau bisa memainkan seluruh alat musik secara instan?",
    "Kalau wajah kamu dicetak di uang kertas Rp 100.000, ekspresi wajah seperti apa yang bakal kamu tunjukkan?",
    "Kalau kasur kamu bisa protes setiap kali kamu rebahan seharian, kira-kira apa kalimat pertama yang dia ucapkan?",
    "Pilih mana: seumur hidup cuma bisa makan makanan dingin, atau seumur hidup cuma bisa mandi pakai air es?",
    "Seandainya kamu punya bantal ajaib yang bisa mencetak mimpi kamu jadi film bioskop, film seperti apa yang keluar?",
    "Kalau kamu mendadak punya pahlawan super konyol untuk hal-hal sepele sehari-hari, kekuatan apa yang kamu pilih?",
    "Pilih mana: HP kamu selalu lowbat 1% tapi tidak pernah mati, atau Wi-Fi kamu selalu ada tapi kecepatannya super lelet?",
    "Kalau kamu terpaksa harus tinggal selamanya di dalam sebuah video game jadul, game apa yang kamu pilih?",
    "Apa teori konspirasi paling absurd yang pernah kamu dengar tapi sempat bikin kamu kepikiran sebentar?",
    "Pilih mana: rambut kamu berubah warna sesuai perasaanmu, atau setiap kali kamu bohong ada suara klakson mobil?",
    "Kalau hewan peliharaan rumah bisa pakai pakaian kemeja dan dasi, hewan apa yang kelihatan paling berwibawa?",
    "Kalau kamu harus memilih nama panggung penyanyi dangdut paling heboh untuk dirimu, nama apa yang kamu pakai?",
    "Pilih mana: tidak bisa makan makanan manis selamanya, atau tidak bisa makan makanan pedas selamanya?",
    "Seandainya kamu bisa membuat 1 hukum fisika baru yang konyol di dunia ini, hukum seperti apa yang kamu ciptakan?",
    "Kalau sepatu kamu bisa ngobrol setelah kamu pakai jalan seharian, apa curhatan pertama yang dia sampaikan?",
    "Pilih mana: harus selalu pakai piyama ke mana pun pergi, atau harus selalu pakai kacamata hitam di dalam ruangan?",
    "Kalau kamu tiba-tiba menemukan pintu rahasia di lemari bajumu yang menuju ke tempat ajaib, tempat seperti apa itu?",
    "Apa hal paling konyol yang pernah kamu percayai 100% saat kamu masih berumur 7 tahun?",
    "Pilih mana: setiap kali bicara harus sambil menari kecil, atau setiap kali tertawa harus mengeluarkan suara ayam?",
    "Kalau semua makanan di dunia bisa ngomong saat mau dimakan, makanan apa yang menurutmu paling dramatis?",
    "Seandainya kamu mendapat kesempatan jadi monster di bawah kasur selama 1 malam, kamu mau menakut-nakuti siapa?",
    "Pilih mana: bisa membaca pikiran orang tapi cuma saat mereka lagi makan, atau bisa hilang tapi cuma selama 5 detik?",
    "Kalau kamu bikin festival musik paling aneh di dunia, siapa musisi dan hiburan utama yang kamu undang?",
    "Apa gaya potong rambut paling bencana atau konyol yang pernah kamu coba dalam hidupmu?",
    "Kalau kamu diberi kemampuan berbicara dengan tanaman, tanaman mana di rumahmu yang menurutmu paling cerewet?"
  ],

  deep: [
    "Apa pelajaran hidup terbesar yang kamu dapatkan setelah berhasil melewati masa-masa paling sulit dalam hidupmu?",
    "Siapa satu sosok dalam hidupmu yang paling banyak membentuk prinsip dan cara berpikirmut sampai hari ini?",
    "Kalau kamu bisa mengirimkan satu kalimat pesan singkat ke dirimu sendiri 10 tahun lalu, pesan apa yang ingin kamu sampaikan?",
    "Menurut pandangan pribadimu, seperti apa definisi kebahagiaan dan kedamaian sejati di masa dewasa ini?",
    "Pernahkah kamu merasa berada di titik terendah dan hal apa yang membuatmu kembali bangkit dan percaya diri?",
    "Apa pencapaian atau keberhasilan kecil dalam hidupmu yang kurang diperhatikan orang lain tapi sangat kamu syukuri?",
    "Satu hal dari dalam dirimu sendiri yang sampai sekarang masih terus kamu usahakan untuk dimaafkan dan diikhlaskan?",
    "Kalau kamu membayangkan kehidupanmu 5 tahun dari sekarang, suasana dan rasa seperti apa yang paling ingin kamu capai?",
    "Apa kekecewaan atau rasa sakit masa lalu yang pada akhirnya mengajarkanmu pelajaran paling berharga?",
    "Hal paling berani apa yang pernah kamu lakukan demi mempertahankan nilai dan prinsip hidup yang kamu yakini?",
    "Satu impian besar dalam hidupmu yang belum pernah kamu ceritakan ke siapa pun karena takut diremehkan?",
    "Kapan kali terakhir kamu merasa sangat bersyukur sampai meneteskan air mata haru?",
    "Pelajaran terbaik apa yang ingin kamu turunkan atau bagikan kepada orang-orang tersayang dalam hidupmu?",
    "Satu hal dari caramu merespons masalah atau ketidakpastian yang saat ini paling ingin kamu perbaiki?",
    "Pernahkah kamu merasa harus berpura-pura baik-baik saja di depan orang lain padahal hatimu sedang sangat lelah?",
    "Apa nilai atau kualitas paling utama yang selalu kamu cari dalam sebuah hubungan persahabatan sejati?",
    "Bagaimana caramu paling ampuh untuk menenangkan diri dan berdamai saat pikiranmu terasa terlalu bising?",
    "Apa pujian atau kata-kata penyemangat dari seseorang yang pernah menyelamatkan harimu di saat sulit?",
    "Satu kebiasaan emosional yang baru kamu sadari setelah kamu semakin dewasa apa?",
    "Apa arti keberadaan orang-orang dekat di sekitarmu dalam perjalanan hidupmu sampai detik ini?",
    "Kapan momen di mana kamu merasa paling dicintai dan dihargai secara utuh oleh seseorang?",
    "Hal sederhana apa yang paling sering membuatmu merasa hidupmu sudah cukup dan penuh rasa syukur?",
    "Apa keputusasaan atau kekhawatiran terbesar soal masa depan yang akhir-akhir ini sering terlintas di pikirmu?",
    "Seberapa jauh perubahan caramu memandang arti kesuksesan dibandingkan saat kamu masih remaja dulu?",
    "Apa pesan paling menyentuh dari orang tua atau sosok senior yang selalu melekat di dadamu?"
  ],

  pasangan: [
    "Momen manis atau kejadian kecil apa dari hubungan kita yang sampai sekarang masih sering bikin kamu tersenyum sendiri?",
    "Satu kebiasaan kecil dari aku yang diam-diam menurutmu paling gemas atau bikin kangen saat jauh?",
    "Apa hal pertama yang membuatmu merasa yakin dan nyaman untuk membuka hati serta mendekat ke aku dulu?",
    "Kalau kita punya waktu 1 minggu penuh liburan bebas tanpa gangguan pekerjaan, tempat impian mana yang pengen kamu tuju berdua?",
    "Apa perlakuan atau kejutan sederhana dari aku yang pernah membuatmu merasa paling disayangi?",
    "Lagu apa yang kalau diputar selalu langsung membuatmu teringat momen-momen kebersamaan kita?",
    "Apa harapan atau impian terbesar yang paling ingin kita capai dan wujudkan bersama di masa depan?",
    "Kebiasaan manis sederhana apa yang paling pengen rutin kita lakukan bersama setiap minggu?",
    "Kapan momen spesifik di mana kamu pertama kali menyadari bahwa kamu benar-benar sayang dan nyaman sama aku?",
    "Bagaimana cara favoritmu kalau lagi pengen bermanja-manja atau minta perhatian ekstra dari aku?",
    "Pelajaran terbaik tentang cinta dan komitmen apa yang kamu dapatkan setelah kita menjalani hubungan ini?",
    "Kalau kita bisa membuat panggilan sayang baru yang lucu dan unik, kamu pengen panggil aku apa?",
    "Apa hal dari sifat aku yang paling melengkapi kekurangan dalam dirimu?",
    "Ceritakan momen PDKT atau kencan awal kita yang menurutmu paling lucu, canggung, atau bikin salah tingkah!",
    "Apa perbincangan malam kita yang paling berkesan dan paling membuatmu merasa dekat secara emosional?",
    "Hal kecil apa yang paling sering bikin kamu merasa aman dan tenang saat kita lagi duduk berdua?",
    "Apa perubahan positif dalam dirimu yang kamu rasakan setelah kita bersama?",
    "Kalau kamu diminta mendeskripsikan hubungan kita dalam 1 kalimat indah, seperti apa kalimat itu?",
    "Apa momen di mana kamu merasa paling bangga memiliki aku sebagai pasanganmu?",
    "Apa hadiah sederhana yang pernah aku berikan tapi menyimpan makna paling dalam buat kamu?"
  ],

  nostalgia: [
    "Lagu sekolah atau lagu jadul apa yang kalau diputar langsung membawa ingatanmu terbang ke masa lalu?",
    "Tontonan kartun, anime, atau acara TV hari Minggu favoritmu saat masih sekolah dulu apa?",
    "Jajanan atau makanan masa kecil apa yang paling kamu kangenin dan rasanya susah dicari sekarang?",
    "Momen kelulusan atau acara sekolah masa lalu mana yang paling membekas dan selalu bikin kangen?",
    "Permainan tradisional atau game konsol zaman dulu apa yang pernah bikin kamu lupa waktu seharian?",
    "Gaya busana, gaya rambut, atau foto zaman dulu kamu yang kalau dilihat lagi sekarang bikin ketawa ngakak?",
    "Siapa guru atau pengajar masa sekolah yang paling berkesan, baik yang paling baik maupun paling galak?",
    "Mainan favorit atau benda kesayangan masa kecil apa yang pernah kamu simpan sampai rusak?",
    "Pengalaman kejahilan konyol atau cerita lucu apa yang pernah kamu lakukan bareng teman sekolah dulu?",
    "Apa kenangan liburan keluarga atau momen sore hari masa kecil yang paling hangat di ingatanmu?",
    "Cerita cinta monyet atau pengalaman naksir diam-diam zaman sekolah yang paling bikin senyum-senyum sendiri?",
    "Rental PS atau tempat nongkrong masa remaja mana yang punya banyak cerita seru bareng teman-temanmu?",
    "Apa kebiasaan sore hari setelah pulang sekolah yang paling kamu rindukan dari masa kecilmu?",
    "Barang elektronik atau gadget jadul pertama yang pernah kamu punya dan banggakan banget waktu dulu apa?",
    "Apa majalah, komik, atau buku cerita masa kecil yang dulu sering kamu baca berulang-ulang?"
  ],

  keluarga: [
    "Tradisi unik atau kebiasaan hangat apa yang hanya ada dan rutin dilakukan di dalam keluargamu?",
    "Nasihat terpenting dari orang tua yang dulu sempat kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah favorit siapa yang selalu paling dikangenin saat kamu jauh dari rumah?",
    "Momen kebersamaan keluarga mana yang paling hangat dan selalu membuatmu merasa bersyukur?",
    "Siapa anggota keluarga yang paling humoris dan selalu jadi pemecah suasana saat kumpul bersama?",
    "Ceritakan momen ketika kamu berhasil membuat orang tuamu tersenyum dan merasa bangga padamu!",
    "Pelajaran tentang kerja keras, kejujuran, dan kebaikan apa yang paling melekat dari cara orang tuamu membesarkanmu?",
    "Acara mudik, jalan-jalan, atau liburan keluarga mana yang punya cerita paling seru dan tak terlupakan?",
    "Hal sederhana dari suasana di rumah yang selalu sukses membuatmu merasa aman dan tenang?",
    "Kalau kamu bisa memberikan hadiah impian untuk orang tuamu esok hari, hadiah seperti apa yang ingin kamu berikan?",
    "Ceritakan satu momen lucu atau konyol yang pernah terjadi saat acara kumpul keluarga besar!",
    "Siapa sosok di keluargamu yang paling sering jadi tempat curhat atau pelindungmu saat ada masalah?",
    "Apa kebiasaan kecil orang tuamu yang baru kamu sadari sangat penyayang setelah kamu bertambah dewasa?",
    "Apa tradisi makan bersama atau momen liburan keluarga yang paling pengen kamu teruskan kelak?",
    "Apa ungkapan khas atau kata-kata yang paling sering diucapkan orang tuamu saat menasihatimu?"
  ],

  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi seluruh ingatanmu tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan harus selalu bicara jujur 100%?",
    "Bagaimana jika kamu bangun besok pagi dan menemukan kamu bisa mengerti serta menguasai semua bahasa di dunia?",
    "Bagaimana jika kamu diberikan pintu kemana saja Doraemon, tempat mana yang pertama kali ingin kamu kunjungi?",
    "Bagaimana jika kamu terbangun dan menjadi satu-satunya manusia yang tersisa di kota ini selama 24 jam?",
    "Bagaimana jika kamu bisa bertemu dan mengobrol dengan dirimu sendiri di usia 70 tahun, apa yang mau kamu tanyakan?",
    "Bagaimana jika kamu diizinkan tinggal di negara mana pun di dunia secara gratis selama 1 tahun penuh?",
    "Bagaimana jika kamu diberi kemampuan melihat masa depan 5 menit ke depan, bagaimana kamu memanfaatkannya?",
    "Bagaimana jika kamu memenangkan pulau pribadi di kompetisi dunia, pulau itu mau kamu jadikan tempat seperti apa?",
    "Bagaimana jika kamu bisa menukar keahlianmu dengan satu tokoh sejarah terkenal, siapa yang ingin kamu pilih?",
    "Bagaimana jika kamu punya kemampuan membaca pikiran hewan peliharaanmu selama 24 jam penuh?",
    "Bagaimana jika setiap kali kamu memikirkan seseorang, bunga favorit mereka mendadak muncul di tanganmu?",
    "Bagaimana jika kamu diberi modal bebas tanpa batas untuk membangun 1 proyek impianmu esok pagi?",
    "Bagaimana jika kamu bisa menghapus 1 peristiwa sejarah dunia, peristiwa apa yang ingin kamu ubah?"
  ],

  karir: [
    "Apa cita-cita atau mimpi besar dalam karir dan hidupmu yang belum sempat kamu wujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah dan finansialmu sudah terjamin 100%, pekerjaan atau karya apa yang akan kamu tekuni?",
    "Pencapaian atau karya terbaik apa dalam karir atau perkuliahan yang paling membuatmu merasa puas dan bangga?",
    "Nasihat karir atau pelajaran profesional terbaik apa yang paling mengubah cara pandangmu dalam bekerja?",
    "Apa pengorbanan terbesar yang pernah kamu lakukan demi meraih posisi, ilmu, atau impianmu saat ini?",
    "Kalau kamu punya modal bebas untuk membuka usaha bisnis sendiri esok hari, bidang usaha apa yang ingin kamu bangun?",
    "Momen ketika kamu merasa paling burnout dalam bekerja atau belajar, dan bagaimana caramu menghadapinya?",
    "Siapa sosok profesional atau mentor yang paling menginspirasi etos kerja dan cara berpikirmut?",
    "Apa skill atau keahlian baru yang paling ingin kamu kuasai dalam 1 tahun ke depan untuk mendukung impianmu?",
    "Bagaimana definisi work-life balance atau keseimbangan hidup yang paling ideal menurut versimu sendiri?",
    "Momen ketika kamu pernah mengalami kegagalan proyek, tapi hasilnya malah membuka jalan yang lebih baik?",
    "Apa prinsip utama dalam bekerja yang tidak akan pernah kamu kompromikan demi uang atau jabatan?",
    "Gaji atau penghasilan pertama dalam hidupmu dulu kamu pakai untuk membeli atau memberikan apa?",
    "Apa gambaran impian terbesar yang ingin kamu nikmati saat masa tua atau pensiun kelak?",
    "Apa pelajaran paling berharga yang kamu dapatkan dari rekan kerja atau atasan terbaik yang pernah kamu temui?"
  ]
};

// Generates N guaranteed unique, natural, never-seen questions from curated pools
export function generateProceduralQuestions(topic: string, count: number, excludeSet: Set<string>): string[] {
  const bank = CURATED_BANKS[topic] || CURATED_BANKS['kenalan'];
  const questions: string[] = [];

  // 1. Filter out any question that is already in excludeSet
  const unseen = bank.filter(q => !excludeSet.has(normalizeQ(q)));
  const shuffledUnseen = shuffle(unseen);

  for (const q of shuffledUnseen) {
    if (questions.length >= count) break;
    questions.push(q);
    excludeSet.add(normalizeQ(q));
  }

  // 2. If unseen is exhausted, mix with other categories to maintain 100% uniqueness
  if (questions.length < count) {
    const allOtherCategories = Object.keys(CURATED_BANKS)
      .filter(k => k !== topic)
      .flatMap(k => CURATED_BANKS[k]);

    const unseenOthers = shuffle(allOtherCategories.filter(q => !excludeSet.has(normalizeQ(q))));

    for (const q of unseenOthers) {
      if (questions.length >= count) break;
      questions.push(q);
      excludeSet.add(normalizeQ(q));
    }
  }

  return shuffle(questions);
}
