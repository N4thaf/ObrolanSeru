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
    "Perlihatkan foto paling konyol yang ada di galeri HP kamu lewat kamera / share screen!",
    "Kirimkan voice note menyapa teman kamu di WhatsApp dengan suara paling menggemaskan!"
  ]
};

// Natural Custom AI Question Synthesizer (Zero robotic prefixes)
function generateCustomQuestions(rawPrompt: string, count: number = 20): string[] {
  const p = rawPrompt.trim().toLowerCase();

  // Intent 1: Konyol / Lucu / Receh / Teman Lama / Sekolah / Alumni / Reuni / Aib / Memalukan
  if (p.includes("konyol") || p.includes("lucu") || p.includes("receh") || p.includes("aib") || p.includes("memalukan") || p.includes("teman lama") || p.includes("sekolah") || p.includes("alumni") || p.includes("reuni") || p.includes("gokil") || p.includes("ngakak")) {
    return [
      "Siapa teman lama di sini yang paling sering janji 'otw' padahal sebenarnya baru banget bangun tidur?",
      "Foto jaman sekolah atau gaya rambut masa lalu mana yang kalau kamu lihat lagi sekarang bikin tengsin setengah mati?",
      "Hal paling konyol atau bodoh yang pernah kalian lakukan bareng pas bolos sekolah atau nongkrong dulu?",
      "Siapa teman yang paling sering pura-pura mengerti pelajaran di kelas padahal otaknya kosong sama sekali?",
      "Ceritakan pengalaman paling memalukan atau salah tingkah yang pernah kamu alami di depan gebetan jaman sekolah!",
      "Siapa orang pertama di antara kalian yang paling sering kena marah guru atau kedapatan ketiduran di kelas?",
      "Hal paling konyol atau tidak berguna apa yang pernah kamu beli pas pertama kali pegang uang sendiri?",
      "Ceritakan momen ketika kamu salah kirim pesan ke grup yang salah dan isinya bikin malu banget!",
      "Siapa teman yang dari dulu sampai sekarang gaya bicaranya paling heboh dan tidak pernah berubah?",
      "Apa kebohongan receh jaman sekolah yang dulu kamu percayai 100% tapi ternyata cuma gosip konyol?",
      "Pengalaman salah kostum atau salah pakai baju paling kocak yang pernah kamu alami saat menghadiri acara?",
      "Siapa teman yang paling sering lupa bawa dompet atau pura-pura ga punya uang pas jam makan siang?",
      "Hal teraneh atau kebiasaan konyol apa yang cuma teman dekat kamu yang tahu dan ga pernah kamu ceritakan ke orang lain?",
      "Siapa yang paling sering punya julukan konyol jaman sekolah dan dari mana asal-usul nama julukan itu?",
      "Ceritakan saat kamu tertawa paling kencang sampai keluar air mata karena kelakuan konyol teman kamu!",
      "Kalau kalian semua terdampar di pulau terpencil, siapa teman di sini yang bakal panik duluan dan paling heboh?",
      "Gaya joget atau gerakan kocak seperti apa yang pernah kamu lakukan saat lagi bahagia banget?",
      "Siapa teman yang paling jago bikin alasan ngaco kalau diajak kumpul tapi malas keluar rumah?",
      "Apa barang paling aneh atau barang bekas konyol yang sampai sekarang masih kamu simpan di kamar?",
      "Kalau ada lomba kelakuan paling receh, siapa di antara kalian yang pasti menang juara 1?"
    ];
  }

  // Intent 2: Sedih / Galau / Emosional / Tangis / Duka / Patah Hati / Kesepian / Kecewa
  if (p.includes("sedih") || p.includes("galau") || p.includes("emosional") || p.includes("tangis") || p.includes("duka") || p.includes("patah hati") || p.includes("kecewa") || p.includes("sepi") || p.includes("kesepian") || p.includes("luka") || p.includes("nangis")) {
    return [
      "Apa momen dalam hidup kamu yang paling membuat kamu menangis sesenggukan dan merasa sangat terpukul?",
      "Kapan kali terakhir kamu merasa benar-benar kesepian dan merasa tidak ada satu orang pun yang mengerti perasaanmu?",
      "Apa kekecewaan atau rasa sakit masa lalu yang sampai hari ini masih sering membekas di hati kamu?",
      "Siapa sosok yang paling kamu rindukan saat ini, namun kamu sadar kamu tidak bisa memeluknya lagi?",
      "Hal paling berat apa yang sedang kamu pikul sendirian saat ini tanpa ada satu orang pun yang tahu?",
      "Pernahkah kamu menyembunyikan rasa sedih di balik senyuman saat sedang kumpul bersama teman-teman?",
      "Apa penyesalan terbesar dalam hidup kamu yang kalau waktu bisa diputar balik ingin sekali kamu perbaiki?",
      "Ceritakan momen ketika kamu merasa sangat kecewa dengan seseorang yang sangat kamu percayai!",
      "Apa kalimat atau perkataan orang lain yang pernah membuat kamu sangat terluka dan teringat sampai sekarang?",
      "Hal apa dari diri kamu sendiri yang paling sering membuat kamu merasa lelah secara emosional?",
      "Pernahkah kamu merasa berada di titik terendah sampai bingung harus melangkah ke mana lagi?",
      "Apa kebohongan paling menyakitkan yang pernah kamu ucapkan demi melindungi perasaan orang lain?",
      "Siapa orang yang paling kamu harapkan hadir dan merangkul kamu saat kamu sedang merasa hancur?",
      "Apa ketakutan terbesar kamu jika masa depan tidak berjalan sesuai dengan apa yang kamu impikan?",
      "Hal apa yang paling sering membuat kamu merasa berkecil hati saat membandingkan diri dengan orang lain?",
      "Ceritakan satu mimpi atau harapan besar kamu yang terpaksa harus kamu kubur dan kamu relakan!",
      "Apa pujian atau kalimat penguatan yang paling ingin kamu dengar saat ini saat sedang lelah?",
      "Pernahkah kamu menangis sendirian di kamar malam hari tanpa ingin siapapun mendengar? Kapan itu?",
      "Satu hal apa dari masa lalu kamu yang sampai sekarang masih berusaha kamu maafkan dan ikhlaskan?",
      "Apa pesan tulus yang ingin kamu sampaikan ke diri sendiri agar tetap kuat menghadapi hari esok?"
    ];
  }

  // Intent 3: Horor / Mistis / Takut / Angker / Hantu / Gaib
  if (p.includes("horor") || p.includes("mistis") || p.includes("takut") || p.includes("angker") || p.includes("hantu") || p.includes("gaib") || p.includes("seram") || p.includes("setan")) {
    return [
      "Pernahkah kamu mengalami kejadian mistis atau melihat penampakan aneh secara langsung? Ceritakan!",
      "Tempat atau lokasi mana yang pernah kamu datangi dan punya aura paling merinding dan angker?",
      "Mimpi buruk atau kejadian tindihan (*sleep paralysis*) paling seram yang pernah bikin kamu kebangun panik?",
      "Hal ghaib atau mitos lokal apa yang sampai sekarang paling bikin kamu takut dan merinding?",
      "Pernahkah kamu mendengar suara bisikan atau langkah kaki aneh saat kamu sedang sendirian di rumah?",
      "Kalau kamu terpaksa harus menginap sendirian di rumah tua angker selama 1 malam, barang apa yang kamu bawa?",
      "Pengalaman paling seram apa yang pernah terjadi saat kamu lagi perjalanan malam atau camping?",
      "Siapa teman di sini yang penakut banget dan paling gampang teriak kalau dikagetin hal mistis?",
      "Film horor mana yang paling sukses bikin kamu ga berani tidur sendirian atau ga berani ke kamar mandi malam hari?",
      "Pernahkah kamu merasa seperti ada yang memperhatikan kamu dari sudut kamar saat lampu dimatikan?",
      "Ceritakan kisah horor paling terkenal di sekolah, kampus, atau lingkungan tempat tinggal kamu!",
      "Apa yang bakal kamu lakukan pertama kali kalau tiba-tiba lampu mati dan ada sosok berdiri di ujung lorong?",
      "Pilih mana: ketemu hantu di dalam kamar sendiri, atau tersesat di hutan angker jam 2 malam?",
      "Pernahkah kamu punya barang antik atau benda tua yang tiba-tiba bergeser atau berbunyi sendiri?",
      "Kejadian aneh apa yang pernah bikin kamu kapok dan ga mau lagi melewati jalanan sepi malam hari?",
      "Ceritakan pengalamaan teman atau keluarga kamu yang pernah ketempelan atau mengalami hal gaib!",
      "Suara atau bau aneh apa yang paling bikin kamu merinding saat lewat tempat sepi?",
      "Kalau kamu disuruh menjelajahi bangunan tua terbengkalai malam hari, kamu mau ajak siapa dari meja ini?",
      "Apa reaksi kamu kalau tiba-tiba HP kamu berbunyi dan ada pesan dari nomor misterius tanpa nama?",
      "Hal horor apa yang menurut kamu paling menakutkan: hantu visual, suara ghaib, atau teror psikologis?"
    ];
  }

  // Intent 4: Romantis / Cinta / Couple / Pacar / Gebetan / PDKT / Crush
  if (p.includes("romantis") || p.includes("cinta") || p.includes("couple") || p.includes("pacar") || p.includes("gebetan") || p.includes("pdkt") || p.includes("crush") || p.includes("pasangan")) {
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

  // Intent 5: Deep Talk / Rahasia / Pribadi / Filosofis / Kehidupan
  if (p.includes("deep") || p.includes("rahasia") || p.includes("pribadi") || p.includes("filosofis") || p.includes("hidup") || p.includes("prinsip") || p.includes("mindset")) {
    return [
      "Apa ketakutan terbesar dalam hidup kamu yang jarang banget kamu ceritakan ke teman dekat sekali pun?",
      "Siapa satu sosok dalam hidup kamu yang paling banyak membentuk cara berpikir dan prinsip kamu sampai hari ini?",
      "Kalau kamu bisa kirim satu kalimat pesan singkat ke diri kamu sendiri 10 tahun lalu, apa pesan utamanya?",
      "Menurut pandangan kamu pribadi, definisi bahagia dan tenang yang sesungguhnya itu seperti apa?",
      "Pernahkah kamu merasa berada di titik terendah dalam hidup dan apa hal yang bikin kamu bangkit kembali?",
      "Apa pencapaian terkecil kamu yang orang lain sepelekan tapi sebenarnya paling kamu syukuri?",
      "Siapa orang pertama yang paling kamu inginkan hadir saat kamu sedang merasa sedih atau lelah?",
      "Satu hal apa dari diri kamu sendiri yang sampai sekarang masih berusaha kamu maafi dan ikhlaskan?",
      "Kalau kamu melihat kehidupan kamu 5 tahun ke depan, suasana seperti apa yang ingin kamu capai?",
      "Apa nilai kebaikan atau prinsip hidup yang tidak akan pernah kamu kompromikan demi apapun?"
    ];
  }

  // Intent 6: Liburan / Trip / Traveling / Pantai / Gunung / Jalan-Jalan
  if (p.includes("liburan") || p.includes("trip") || p.includes("traveling") || p.includes("pantai") || p.includes("gunung") || p.includes("jalan") || p.includes("wisata") || p.includes("kuliner")) {
    return [
      "Momen liburan atau perjalanan mana yang paling berkesan dan paling membuat kamu bahagia sepanjang hidup?",
      "Makanan lokal atau kuliner paling enak dan unik yang wajib dicoba kalau berkunjung ke tempat favorit kamu?",
      "Seandainya kita buat trip impulsif bareng esok hari, destinasi impian pertama yang ingin kamu tuju ke mana?",
      "Ceritakan pengalaman paling konyol atau kejadian salah rencana saat kamu sedang liburan bareng teman!",
      "Kalau kamu disuruh memilih 1 teman di meja ini untuk jadi tour guide liburan, kamu bakal pilih siapa dan kenapa?",
      "Apa barang paling wajib dan ga boleh ketinggalan sama sekali di dalam tas kamu pas lagi traveling?",
      "Koleksi foto atau kenangan mana yang menurut kamu paling estetik dari semua perjalanan yang pernah kamu lakukan?",
      "Pernahkah kamu tersesat atau mengalami hal tak terduga saat liburan? Ceritakan pengalamannya!",
      "Lagu atau playlist musik apa yang paling pas diputar saat perjalanan road trip atau liburan?",
      "Kalau kamu diberikan budget unlimited untuk jalan-jalan sebulan penuh, destinasi impian kamu di mana?",
      "Siapa teman di lingkaran kamu yang paling heboh dan paling riweh kalau diajak koordinasi liburan?",
      "Oleh-oleh atau cenderamata paling unik yang pernah kamu beli atau dapatkan dari suatu tempat?",
      "Momen pemandangan alam mana (sunrise/sunset/gunung/pantai) yang paling membuat kamu terpukau sampai tidak bisa lupa?",
      "Kalau kamu harus tinggal selama 3 bulan di lokasi wisata impian kamu, aktivitas apa yang bakal kamu lakukan?",
      "Hal apa yang paling kamu kangenin saat perjalanan liburan selesai dan harus kembali ke rutinitas harian?"
    ];
  }

  // Intent 7: Karir / Uang / Bisnis / Kerja / Finansial / Masa Depan
  if (p.includes("karir") || p.includes("uang") || p.includes("bisnis") || p.includes("kerja") || p.includes("finansial") || p.includes("masa depan") || p.includes("investasi")) {
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
      "Siapa sosok profesional atau pengusaha inspiratif yang paling banyak memotivasi cara berpikir kamu?"
    ];
  }

  // Universal Fallback: Clean Natural Subject Questions (Zero "seputar pertanyaan..." prefixes)
  const cleanSubject = rawPrompt.replace(/["']/g, '').trim();
  return [
    `Apa momen paling tak terlupakan yang pernah kamu alami saat membahas tentang ${cleanSubject}?`,
    `Menurut sudut pandang kamu pribadi, apa hal paling menarik dari ${cleanSubject}?`,
    `Kalau kamu diberi kesempatan bebas menjelajahi ${cleanSubject}, hal pertama yang ingin kamu lakukan apa?`,
    `Ceritakan pengalaman paling lucu atau tak terduga yang pernah kamu alami terkait ${cleanSubject}!`,
    `Siapa orang di meja ini yang menurut kamu punya pengalaman paling seru tentang ${cleanSubject}?`,
    `Pelajaran hidup atau hikmah terpenting apa yang pernah kamu dapatkan dari ${cleanSubject}?`,
    `Seandainya kamu membuat buku atau karya tentang ${cleanSubject}, judul unik apa yang bakal kamu pilih?`,
    `Apa persepsi salah atau anggapan keliru yang sering dipikirkan orang lain tentang ${cleanSubject}?`,
    `Momen paling membuat kamu bangga atau bersyukur dalam hidup kamu terkait ${cleanSubject}?`,
    `Saran atau tips terbaik apa yang ingin kamu bagikan ke teman-teman tentang ${cleanSubject}?`,
    `Apa hal yang paling sering membuat kamu merasa bersemangat saat berdiskusi tentang ${cleanSubject}?`,
    `Kalau kamu bisa mewujudkan impian terbesar kamu esok hari tentang ${cleanSubject}, impian seperti apa itu?`,
    `Satu kata yang paling pas menggambarkan pengalaman dan pandangan kamu tentang ${cleanSubject}?`,
    `Pernahkah kamu mengambil keputusan besar terkait ${cleanSubject}? Bagaimana hasilnya?`,
    `Sosok mana yang paling banyak memberikan inspirasi bagi kamu saat mendalami ${cleanSubject}?`,
    `Apa tantangan terbesar yang pernah kamu lalui dan berhasil kamu lewati terkait ${cleanSubject}?`,
    `Hal baru apa yang baru kamu sadari dan kamu syukuri belakangan ini tentang ${cleanSubject}?`,
    `Pesan positif apa yang ingin kamu tinggalkan untuk semua orang tentang ${cleanSubject}?`
  ];
}

// Fisher-Yates Shuffle algorithm for true uniform randomness across all accounts & devices
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

    // Handle Custom AI Prompt Topic
    if (topic === 'ai_custom' && customPrompt) {
      const generated = generateCustomQuestions(customPrompt, count);
      const shuffledCustom = fisherYatesShuffle(generated);
      return NextResponse.json({
        success: true,
        topic: 'ai_custom',
        customPrompt,
        questions: shuffledCustom,
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

    // Shuffle available base questions with true Fisher-Yates algorithm
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
