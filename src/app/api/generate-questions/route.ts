import { NextResponse } from 'next/server';

// Rich Deep Dynamic Seed Datasets & AI Combinatorial Synthesis Engine
const TOPIC_TEMPLATES: Record<string, { hooks: string[]; subjects: string[]; twists: string[] }> = {
  kenalan: {
    hooks: [
      "Kalau kamu tiba-tiba diajak nongkrong sama {subject},",
      "Satu kebiasaan paling unik pas kamu {subject} yang belum pernah ada yang tahu,",
      "Hal pertama yang bakal kamu lakuin kalau besok bangun tidur dan {subject},",
      "Kalau hidup kamu disamakan dengan {subject},",
      "Momen paling canggung tapi bikin ngakak pas kamu lagi {subject},"
    ],
    subjects: [
      "pindah ke kota baru sendirian",
      "ketemu teman lama di tempat yang tidak terduga",
      "mencoba hobi baru yang ekstrim",
      "dapat kesempatan liburan gratis sebulan",
      "pesan makanan dan ternyata salah pilih menu"
    ],
    twists: [
      "apa alasan utamanya?",
      "siapa orang pertama yang bakal kamu hubungi?",
      "ceritakan dengan detail!",
      "bagaimana tanggapan kamu?",
      "pilih reaksi paling kocak!"
    ]
  },
  deep: {
    hooks: [
      "Apa penyesalan terbesar atau keputusan sulit saat kamu {subject},",
      "Momen ketika kamu merasa paling rentan dan sadar kalau {subject},",
      "Nasihat hidup terbaik yang mengubah cara pandangmu tentang {subject},",
      "Hal apa dari diri kamu yang paling ingin kamu perbaiki terkait {subject},"
    ],
    subjects: [
      "menghadapi kegagalan di masa lalu",
      "berjuang sendirian demi impian kamu",
      "melepaskan seseorang yang pernah sangat berarti",
      "menyadari bahwa dewasa itu tidak semudah yang dibayangkan"
    ],
    twists: [
      "dan bagaimana cara kamu berdamai dengannya?",
      "apa pelajaran paling berharga yang kamu petik?",
      "siapa yang paling mendukung kamu saat itu?",
      "apa yang akan kamu sampaikan ke diri kamu saat ini?"
    ]
  },
  absurd: {
    hooks: [
      "Kalau kamu bisa bertukar suara dengan {subject},",
      "Seandainya pemerintah membuat hukum baru bahwa setiap orang wajib {subject},",
      "Kalau kamu diberi kekuatan super ajaib tapi cuma bisa dipakai pas {subject},",
      "Pilih mana: harus selalu {subject} atau selamanya tidak bisa {subject},"
    ],
    subjects: [
      "suara ayam jago saat subuh hari",
      "makan mi instan tanpa bumbu asin",
      "tertidur di tengah rapat penting",
      "memakai helm ke mana pun pergi"
    ],
    twists: [
      "bagaimana cara kamu bertahan hidup?",
      "apa nama jurus rahasia kamu?",
      "siapa yang bakal paling emosi sama kamu?",
      "jelaskan skenario paling ngaco menurut kamu!"
    ]
  },
  pasangan: {
    hooks: [
      "Satu kebiasaan kecil aku yang pas pertama ketemu menurut kamu {subject},",
      "Momen apa yang bikin kamu paling yakin kalau kita bisa {subject},",
      "Kalau kita berdua terdampar di pulau kosong dan cuma bisa bawa {subject},",
      "Hal paling romantis tapi agak konyol yang pernah kita lakuin bareng saat {subject},"
    ],
    subjects: [
      "melewati masa-masa tersulit bersama",
      "pilih destinasi liburan impian masa depan",
      "menghadapi perbedaan pendapat yang menguji kesabaran",
      "merencanakan masa depan berdua"
    ],
    twists: [
      "apa yang paling kamu syukuri?",
      "bagaimana perasaan kamu saat itu?",
      "ceritakan dari sudut pandang kamu!",
      "apa janji kamu untuk kita?"
    ]
  }
};

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
    "Kalau kamu jadi pahlawan super tapi kekuatannya cuma bisa bikin orang bersin, gimana cara kamu ngalahin penjahat?",
    "Apa barang teraneh yang pernah kamu temukan di dalam tas atau dompet kamu sendiri?",
    "Kalau kamu dibuatkan patung lilin di museum, gaya atau pose seperti apa yang bakal kamu pilih?",
    "Pilih mana: tidak bisa makan pedas selamanya, atau tidak bisa minum boba dan es kopi selamanya?",
    "Kalau kamu bisa mengubah bunyi bel sekolah atau kantor jadi suara lain, suara apa yang kamu pilih?",
    "Seandainya kamu harus menjalani hidup 1 hari penuh pakai kostum maskot badut, kamu mau pakai di mana?"
  ],
  deep: [
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke teman dekat sekali pun?",
    "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir dan prinsip kamu sampai hari ini?",
    "Kalau kamu bisa kirim satu kalimat pesan singkat ke diri kamu sendiri 10 tahun lalu, apa pesan utamanya?",
    "Menurut pandangan kamu pribadi, definisi 'sukses' yang benar-benar bikin kamu bahagia itu yang kayak gimana?",
    "Kapan momen terakhir kali kamu merasa benar-benar bangga dan lega sama pencapaian diri sendiri?",
    "Pernahkah kamu merasa kesepian banget di tengah keramaian? Kejadian atau momen seperti apa itu?",
    "Hal apa yang paling sulit untuk kamu maatkan, baik dari orang lain maupun dari kesalahan diri kamu sendiri?",
    "Pelajaran berharga apa dari kegagalan masa lalu yang paling membentuk ketahanan mental kamu saat ini?",
    "Apa mimpi atau cita-cita masa kecil kamu yang tanpa sadar sudah berhasil kamu wujudkan hari ini?",
    "Kalau kamu hanya bisa mempertahankan 3 nilai hidup utama dalam perjalanan kamu ke depan, nilai apa saja itu?",
    "Pernahkah kamu berada di titik terendah dan apa hal kecil yang akhirnya bikin kamu bangkit kembali?",
    "Bagaimana pandangan kamu tentang arti sebuah persahabatan sejati yang tulus?",
    "Apa penyesalan kecil yang kalau bisa diulang, ingin kamu perbaiki caranya?",
    "Seberapa besar peran doa atau dukungan keluarga dalam perjalanan karier/kuliah kamu selama ini?",
    "Apa kebiasaan buruk dalam diri kamu yang sedang pelan-pelan kamu usahakan untuk diubah?",
    "Kapan momen terbaik di mana kamu merasa bener-bener dihargai dan dimengerti oleh orang lain?",
    "Apa definisi kebahagiaan sederhana yang menurut kamu paling bikin hati tenang?",
    "Siapa orang yang paling ingin kamu ucapkan terima kasih banyak saat ini dan kenapa?",
    "Hal apa yang paling sering bikin kamu overthinking di malam hari sebelum tidur?",
    "Bagaimana cara kamu menenangkan diri sendiri saat sedang merasa sangat tertekan atau cemas?"
  ],
  pasangan: [
    "Momen manis atau kejadian kecil apa dari kita yang sampai sekarang masih sering bikin kamu tersenyum sendiri?",
    "Satu kebiasaan kecil aku yang diam-diam menurut kamu lucu atau malah bikin kangen kalau lagi jauh?",
    "Apa hal pertama yang bikin kamu yakin buat buka hati dan mendekat ke aku dulu?",
    "Kalau kita punya waktu luang 3 hari bebas tanpa beban pekerjaan, kamu paling ingin kita liburan ke mana?",
    "Hal apa dari aku yang menurut kamu paling bikin kamu merasa nyaman dan aman saat berdua?",
    "Apa harapan atau impian sederhana kamu untuk perjalanan hubungan kita ke depannya?",
    "Momen kencan kita yang mana yang menurut kamu paling berkesan dan ga bakal dilupakan?",
    "Kalau kamu bisa mengubah 1 kebiasaan kecil aku tanpa bikin aku tersinggung, kebiasaan apa itu?",
    "Apa lagu yang kalau kamu dengar langsung bikin kamu teringat sama momen-momen bareng aku?",
    "Hal baru apa yang ingin banget kita coba atau pelajari bareng-bareng di bulan ini?",
    "Satu ucapan atau pujian dari aku yang paling membekas di hati kamu?",
    "Kalau kita harus masak dinner romantis di rumah berdua, menu apa yang paling kamu ingin kita buat?",
    "Apa kejutan manis yang pernah aku buat dan paling bikin kamu tersentuh?",
    "Bagaimana cara favorit kamu buat merayakan momen-momen spesial atau anniversary kita?",
    "Apa ketakutan atau kekhawatiran kamu dalam hubungan ini yang ingin kamu diskusikan santai bareng aku?",
    "Hal kecil apa yang sering aku lakukan yang bikin kamu merasa sangat dicintai?",
    "Kalau kita berdua bikin panggilan sayang yang lucu dan rahasia, nama apa yang kamu usulkan?",
    "Apa foto favorit kamu dari momen kita berdua dan kenapa foto itu spesial?",
    "Sifat atau karakter apa dari aku yang menurut kamu paling melengkapi kepribadian kamu?",
    "Apa impian kencan impian di musim hujan yang paling kamu ingin kita lakukan berdua?"
  ],
  nostalgia: [
    "Lagu jadul atau lagu masa sekolah apa yang kalau diputar langsung bikin kamu flashback ke masa lalu?",
    "Tontonan kartun, anime, atau acara televisi hari Minggu favorit kamu saat masih sekolah SD dulu?",
    "Jajanan SD atau makanan masa kecil apa yang paling kamu kangenin dan susah banget dicari sekarang?",
    "Mainan atau kebiasaan sore hari apa yang dulu paling bikin kamu bahagia sebelum ada smartphone?",
    "Kenangan momen liburan sekolah atau acara kumpul keluarga besar yang paling berkesan waktu kecil?",
    "Momen paling lucu atau tengsin yang pernah kamu alami saat jaman seragam sekolah dulu?",
    "Siapa guru sekolah kamu dulu yang paling galak tapi sebenarnya paling perhatian sama muridnya?",
    "Pernahkah kamu punya cita-cita ajaib pas TK atau SD dulu yang sekarang kalau diingat bikin ketawa?",
    "Game komputer, PS1, atau game HP jadul apa yang paling sering bikin kamu lupa waktu jaman dulu?",
    "Tren baju, gaya rambut, atau pose foto zaman sekolah yang kalau dilihat lagi sekarang bikin tengsin?",
    "Acara jalan-jalan atau study tour sekolah mana yang paling punya banyak cerita unik?",
    "Teman masa kecil mana yang sudah lama ga ketemu tapi paling ingin kamu dengar kabarnya sekarang?",
    "Majalah, komik, atau buku cerita favorit yang paling sering kamu baca di perpustakaan sekolah dulu?",
    "Momen pertama kali kamu punya HP atau media sosial jadul (Friendster/FB/BBM), apa postingan pertama kamu?",
    "Satu makanan olahan ibu atau nenek kamu di rumah yang cita rasanya ga ada tandingannya sampai sekarang?",
    "Permaianan tradisional (seperti kelereng, petak sembunyi, bentengan) mana yang paling kamu jagoin dulu?",
    "Kaset CD atau nada dering HP jadul apa yang pernah kamu pakai dan paling hits di jamannya?",
    "Momen ujian sekolah atau kelulusan mana yang paling bikin deg-degan tapi lega pas selesai?",
    "Uang saku SD kamu dulu berapa dan biasanya cukup buat beli apa saja di kantin sekolah?",
    "Momen kehujanan bareng teman-teman masa kecil pas pulang sekolah yang paling menyenangkan?"
  ],
  keluarga: [
    "Tradisi unik atau kebiasaan lucu apa yang cuma ada dan dilakuin di dalam keluarga kamu?",
    "Nasihat dari orang tua atau sesepuh yang dulu kamu sepelekan, tapi sekarang baru terasa benarnya?",
    "Masakan atau hidangan buatan rumah apa yang paling dikangenin saat sedang jauh dari rumah?",
    "Cerita konyol atau kejadian paling heboh yang pernah terjadi saat kumpul keluarga besar?",
    "Siapa anggota keluarga kamu yang paling sering bikin suasana kumpul jadi ramai dan ceria?",
    "Momen liburan bersama keluarga mana yang punya kenangan paling indah dan berkesan?",
    "Kebiasaan unik ayah atau ibu kamu di rumah yang selalu bikin kangen atau tersenyum sendiri?",
    "Apa masakan andalan keluarga kamu pas momen hari raya atau acara kumpul besar?",
    "Cerita masa kecil kamu dari sudut pandang orang tua yang paling sering diungkit pas kumpul keluarga?",
    "Sifat positif apa dari ayah atau ibu kamu yang paling ingin kamu tiru dan miliki?",
    "Pernahkah kamu bikin salah ke orang tua dan bagaimana cara kamu minta maaf waktu itu?",
    "Pelajaran hidup terpenting apa tentang kejujuran dan kerja keras yang kamu dapat dari keluarga?",
    "Barang atau kenangan bersejarah apa di rumah orang tua kamu yang paling punya nilai sentimental?",
    "Siapa saudara atau sepupu kamu yang paling sering jadi tempat curhat atau teman berbagi cerita?",
    "Momen ketika kamu sadar kalau orang tua kamu sudah mulai beranjak sepuh dan bagaimana perasaan kamu?",
    "Panggilan atau julukan lucu apa yang cuma dipakai di dalam rumah kamu?",
    "Apa kegiatan santai hari Minggu favorit yang paling sering dilakukan keluarga kamu di rumah?",
    "Bagaimana cara keluarga kamu biasanya menyelesaikan perbedaan pendapat atau pertengkaran kecil?",
    "Dukungan terbesar apa dari keluarga yang paling bikin kamu kuat menghadapi cobaan hidup?",
    "Apa harapan atau doa terbaik kamu untuk kesehatan dan kebahagiaan keluarga kamu saat ini?"
  ],
  whatif: [
    "Bagaimana jika kamu mendapat kesempatan mengulang hidup dari umur 10 tahun tapi ingatan tetap utuh?",
    "Bagaimana jika selama 1 minggu penuh seluruh koneksi internet di seluruh dunia mati total?",
    "Bagaimana jika semua manusia di bumi tiba-tiba tidak bisa berbohong dan selalu bicara jujur 100%?",
    "Bagaimana jika kamu mendapat kemampuan membaca pikiran orang lain, siapa orang pertama yang kamu baca?",
    "Bagaimana jika kamu terdampar di pulau terpencil dan hanya boleh membawa 3 barang bawaan?",
    "Bagaimana jika kamu bisa memprediksi masa depan 5 tahun ke depan, apa yang ingin kamu lihat pertama kali?",
    "Bagaimana jika kamu terbangun esok hari dan memiliki saldo rekening tidak terbatas, apa proyek pertama kamu?",
    "Bagaimana jika kamu bisa bertukar posisi kerja dengan bos atau rektor kamu selama sehari?",
    "Bagaimana jika kamu bisa menciptakan satu pintu ajaib Doraemon, tempat pertama yang kamu tuju ke mana?",
    "Bagaimana jika semua hewan di dunia tiba-tiba bisa mengerti bahasa manusia dan bicara?",
    "Bagaimana jika kamu dipaksa hidup di luar negeri tanpa kenal siapa pun selama 1 tahun, kota mana pilihan kamu?",
    "Bagaimana jika kamu bisa menghentikan waktu selama 1 jam setiap hari, apa yang bakal kamu lakukan?",
    "Bagaimana jika kamu bisa menghapus 1 kenangan buruk dalam hidup kamu, kenangan mana yang kamu pilih?",
    "Bagaimana jika kamu ditawari pergi ke planet Mars dan tidak bisa kembali ke bumi lagi, kamu mau?",
    "Bagaimana jika kamu bisa mendesain rumah impian tanpa batas anggaran, fasilitas ajaib apa yang kamu buat?",
    "Bagaimana jika kamu bisa membuat 1 lagu kamu sendiri diputar di seluruh stasiun radio dunia besok?",
    "Bagaimana jika kamu diberi 1 kesempatan bertemu dengan tokoh sejarah mana pun di dunia?",
    "Bagaimana jika kamu bisa memilih 1 makanan ajaib yang tidak pernah bikin gemuk atau sakit?",
    "Bagaimana jika kamu bisa menghidupkan kembali 1 tempat wisata legendaris yang sudah tutup?",
    "Bagaimana jika kamu tiba-tiba menemukan harta karun tersembunyi di pekarangan rumah kamu?"
  ],
  karir: [
    "Apa cita-cita atau mimpi terbesar kamu yang belum sempat diwujudkan sampai sekarang?",
    "Kalau uang bukan lagi masalah dan finansial kamu sudah terjamin 100%, pekerjaan apa yang kamu tekuni?",
    "Pencapaian atau karya apa yang paling membuat kamu merasa puas dalam perjalanan karir atau perkuliahan?",
    "Pelajaran terpenting apa yang paling membentuk mental kamu dalam menghadapi kegagalan atau tekanan?",
    "Siapa sosok mentor atau senior yang paling banyak memberi inspirasi dalam perjalanan karir kamu?",
    "Momen ketika kamu pernah merasa salah jurusan atau salah pilih pekerjaan, dan bagaimana kamu melewatinya?",
    "Apa skill atau keahlian baru yang paling ingin kamu kuasai di tahun ini untuk mendukung karier kamu?",
    "Bagaimana cara kamu biasanya menjaga keseimbangan antara pekerjaan, kuliah, dan kehidupan pribadi?",
    "Proyek atau tantangan tersulit apa yang pernah kamu selesaikan dan bikin kamu bangga?",
    "Apa nasihat karier terbaik yang pernah kamu terima dan selalu kamu ingat sampai sekarang?",
    "Kalau kamu bisa mendirikan perusahaan atau startup sendiri, bidang usaha apa yang ingin kamu bangun?",
    "Bagaimana pandangan kamu tentang arti lingkungan kerja atau lingkungan kampus yang sehat?",
    "Apa milestone atau target terbesar yang ingin kamu capai dalam 3 hingga 5 tahun ke depan?",
    "Pernahkah kamu menghadapi situasi konflik di tempat kerja/organisasi dan bagaimana solusi kamu?",
    "Pengalaman interview kerja atau presentasi penting mana yang paling deg-degan tapi sukses?",
    "Apa pesan motivasi terbaik dari kamu untuk teman-teman di meja ini yang sedang berjuang menata karier?"
  ],
  tod_truth: [
    "Siapa orang yang paling kamu sukai atau taksir secara diam-diam saat masa sekolah dulu?",
    "Apa kebohongan terbesar yang pernah kamu ucapkan ke orang lain dan belum pernah ketahuan?",
    "Pernahkah kamu pura-pura sakit atau sibuk cuma demi kabur dari janji bertemu teman?",
    "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke orang lain?",
    "Siapa orang yang paling sering kamu cari tahu kabarnya atau stalk diam-diam di sosmed?",
    "Ceritakan satu momen paling canggung atau tengsin yang pernah kamu alami dalam hidup!",
    "Hal paling konyol atau impulsif apa yang pernah kamu beli padahal sebenarnya ga berguna?",
    "Sifat siapa di antara teman-teman di sini yang paling sering membuat kamu gemas?",
    "Pernahkah kamu diam-diam membaca chat atau pesan orang lain tanpa izin sama sekali?",
    "Apa rahasia paling konyol yang belum pernah kamu ceritakan ke siapa pun sampai hari ini?",
    "Siapa teman pertama yang bakal kamu hubungi saat kamu tertimpa masalah berat?",
    "Apa hal paling memalukan yang pernah terjadi saat kamu berada di tempat umum?",
    "Pernahkah kamu menyukai mantan teman sendiri secara diam-diam?",
    "Apa alasan teraneh yang pernah kamu pakai untuk menolak ajakan nongkrong?",
    "Hal apa yang paling sering membuat kamu merasa iri secara tidak sengaja?"
  ],
  tod_dare_offline: [
    "Tatap mata teman di sebelah kananmu selama 20 detik penuh tanpa tersenyum sedikit pun!",
    "Tunjukkan foto paling konyol di galeri HP kamu ke semua teman di meja!",
    "Tiru gaya jalan atau gaya bicara salah satu orang di sini dengan mirip!",
    "Perlihatkan wallpaper lockscreen HP kamu ke seluruh teman di meja!",
    "Lakukan gerakan olahraga ringan (seperti 10x jumping jack) sambil sebutkan 5 nama makanan!",
    "Tunjukkan 3 histori pencarian terakhir di aplikasi YouTube kamu ke teman!",
    "Puji 3 kebaikan dari teman di sebelah kanan kamu dengan tulus dan tatap matanya!",
    "Biarkan teman di sebelah kirimu memilih 1 foto di HP kamu untuk ditunjukkan!",
    "Posisikan ekspresi wajah paling konyol dan tahan selama 15 detik di depan semua teman!",
    "Ucapkan terima kasih ke teman di sebelah kamu dengan gaya seperti menerima panggung penghargaan Oscar!",
    "Tiru suara hewan favorit kamu sampai teman-teman di meja ini tertawa ngakak!",
    "Minum 1 teguk minuman dan tahan pose gaya keren seperti bintang iklan di TV!",
    "Minta 1 suapan makanan teman kamu sekarang juga dengan gaya paling memohon!"
  ],
  tod_dare_online: [
    "Kirim pesan singkat ke kontak ke-5 di HP kamu: 'Aku mau bicara sesuatu penting banget.'",
    "Perlihatkan foto paling konyol di galeri HP kamu lewat kamera atau share screen!",
    "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!",
    "Biarkan teman kamu memilih 1 foto di galeri HP kamu untuk diposting di story!",
    "Tunjukkan histori pencarian terakhir di aplikasi YouTube atau Google kamu ke layar!",
    "Reagikan salah satu postingan foto teman di Instagram dengan komentar paling kocak!",
    "Tunjukkan wallpaper lockscreen HP kamu ke kamera seluruh teman di room!",
    "Ganti nama profil WhatsApp atau sosial media kamu jadi nama konyol selama 10 menit!",
    "Kirimkan foto selfie ekspresi paling konyol kamu ke grup chat saat ini juga!",
    "Buka aplikasi belanja online di HP kamu dan tunjukkan keranjang belanjaan kamu ke layar!"
  ]
};

// Generates 100% Fresh, Non-Repetitive AI Question Pool Dynamically
export async function POST(request: Request) {
  try {
    const { topic = 'kenalan', count = 10, exclude = [] } = await request.json();
    const bank = BASE_AI_BANKS[topic] || BASE_AI_BANKS['kenalan'];
    
    // Filter out previously seen/used questions
    const excludeSet = new Set<string>(Array.isArray(exclude) ? exclude : []);
    const availablePool = bank.filter(q => !excludeSet.has(q));

    // Shuffle available base questions
    const shuffled = [...availablePool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, Math.min(count, shuffled.length));

    // Synthesize fresh AI questions dynamically if needed
    const templates = TOPIC_TEMPLATES[topic] || TOPIC_TEMPLATES['kenalan'];
    let attempts = 0;
    while (selectedQuestions.length < count && attempts < 100) {
      attempts++;
      const hook = templates.hooks[Math.floor(Math.random() * templates.hooks.length)];
      const subject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      const twist = templates.twists[Math.floor(Math.random() * templates.twists.length)];
      const generated = `${hook.replace('{subject}', subject)} ${twist}`;

      if (!excludeSet.has(generated) && !selectedQuestions.includes(generated)) {
        selectedQuestions.push(generated);
      }
    }

    // Fallback if set is depleted: reshuffle full bank
    if (selectedQuestions.length < count) {
      const remainingShuffled = [...bank].sort(() => Math.random() - 0.5);
      for (const q of remainingShuffled) {
        if (selectedQuestions.length >= count) break;
        if (!selectedQuestions.includes(q)) selectedQuestions.push(q);
      }
    }

    return NextResponse.json({
      success: true,
      topic,
      questions: selectedQuestions,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate questions' }, { status: 500 });
  }
}
