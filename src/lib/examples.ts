import type { PromptDraft } from "./types";

export type ExamplePreset = {
  id: string;
  title: string;
  blurb: string;
  draft: PromptDraft;
};

function menu(
  prefix: string,
  items: { name: string; description: string }[]
): PromptDraft["menuItems"] {
  return items.map((item, index) => ({
    id: `${prefix}-${index + 1}`,
    ...item,
  }));
}

export const examples: ExamplePreset[] = [
  {
    id: "kehadiran",
    title: "Kehadiran kelas",
    blurb: "Guru merekod kehadiran murid dan ibu bapa dapat notis.",
    draft: {
      masalah:
        "Guru masih merekod kehadiran murid dalam buku kertas. Data hilang, susah dikira, dan ibu bapa hanya tahu anak ponteng selepas laporan akhir bulan.",
      siapaTerjejas:
        "Guru kelas sekolah rendah, pengetua yang perlukan laporan, dan ibu bapa murid.",
      mengapaPenting:
        "Kehadiran perlu direkod setiap hari. Jika lewat atau hilang, sekolah tidak dapat campur tangan awal apabila murid kerap tidak hadir.",
      sasaranPengguna:
        "Guru kelas (pengguna utama) dan ibu bapa (melihat status anak sendiri).",
      matlamatPengguna:
        "Guru mahu tanda hadir/tidak hadir dalam 2 minit. Ibu bapa mahu tahu status kehadiran anak pada hari itu juga.",
      konteksPenggunaan:
        "Digunakan semasa daftar masuk di bilik darjah, pada telefon atau komputer guru. Kadang-kadang rangkaian sekolah perlahan.",
      hasilDijangka:
        "Rekod harian tersimpan, peratus kehadiran kelihatan, dan guru boleh cetak atau muat turun laporan bulanan.",
      menuItems: menu("kehadiran", [
        {
          name: "Laman utama",
          description: "Ringkasan kehadiran hari ini dan kelas yang perlu direkod.",
        },
        {
          name: "Kehadiran",
          description: "Tanda hadir, tidak hadir, lewat, atau cuti mengikut tarikh dan kelas.",
        },
        {
          name: "Murid",
          description: "Senarai murid, kelas, dan maklumat ringkas.",
        },
        {
          name: "Laporan",
          description: "Peratus kehadiran, murid kerap ponteng, dan eksport.",
        },
        {
          name: "Tetapan",
          description: "Nama kelas, sesi, dan pilihan paparan.",
        },
      ]),
      namaAplikasi: "HadirKu",
      platform: "kedua-dua",
      bilaDigunakan: "setiap pagi semasa daftar masuk kelas",
      tempatPenggunaan: "bilik darjah dan bilik guru",
      bahasaUI: "bahasa-melayu",
      gayaRekaBentuk: "ringkas, terang, mudah dibaca dari jauh",
      ciriWajib: [
        "Tanda kehadiran murid mengikut tarikh dan kelas",
        "Lihat peratus kehadiran dan rekod harian",
        "Muat turun laporan ringkas",
      ],
      diLuarSkop:
        "Jangan bina log masuk, pembayaran, atau aplikasi sembang. Data cukup disimpan pada peranti / pelayar buat masa ini.",
      dataDisimpan:
        "Nama murid, kelas, tarikh, status kehadiran (hadir, tidak hadir, lewat, cuti).",
      kekangan:
        "Mesti mudah digunakan dengan jari pada telefon. Elakkan halaman yang sesak. Boleh digunakan walaupun internet kadang-kadang terputus (sekurang-kurangnya rekod semasa tidak hilang).",
    },
  },
  {
    id: "bacaan",
    title: "Jurnal bacaan murid",
    blurb: "Murid merekod buku yang dibaca dan guru memantau kemajuan.",
    draft: {
      masalah:
        "Murid diminta simpan jurnal bacaan di buku latihan, tetapi banyak yang hilang atau tidak lengkap. Guru susah nampak siapa yang rajin membaca.",
      siapaTerjejas: "Murid sekolah rendah, guru Bahasa Melayu, dan ibu bapa.",
      mengapaPenting:
        "Program NILAM / tabiat membaca perlu bukti yang teratur, bukan sekadar kiraan halaman yang tidak disemak.",
      sasaranPengguna:
        "Murid (mengisi rekod sendiri) dan guru (menyemak serta memberi komen ringkas).",
      matlamatPengguna:
        "Murid mahu catat buku dengan cepat. Guru mahu lihat senarai bacaan kelas dan murid yang ketinggalan.",
      konteksPenggunaan:
        "Di rumah selepas membaca, atau semasa waktu perpustakaan di sekolah.",
      hasilDijangka:
        "Setiap murid ada senarai buku, jumlah buku semasa, dan guru boleh semak tanpa kumpul buku kertas.",
      menuItems: menu("bacaan", [
        {
          name: "Buku saya",
          description: "Senarai buku yang sudah direkod oleh murid.",
        },
        {
          name: "Tambah bacaan",
          description: "Borang tajuk, penulis, tarikh, dan ulasan ringkas.",
        },
        {
          name: "Kelas",
          description: "Paparan guru: kemajuan setiap murid.",
        },
        {
          name: "Lencana",
          description: "Ganjaran kecil apabila mencapai sasaran bilangan buku.",
        },
      ]),
      namaAplikasi: "BacaLaju",
      platform: "web",
      bilaDigunakan: "selepas selesai membaca, atau semasa waktu perpustakaan",
      tempatPenggunaan: "rumah, perpustakaan sekolah, dan makmal komputer",
      bahasaUI: "bahasa-melayu",
      gayaRekaBentuk: "ceria, warna lembut, sesuai kanak-kanak",
      ciriWajib: [
        "Murid tambah rekod buku (tajuk, penulis, tarikh, ulasan)",
        "Senarai bacaan dan kiraan buku setiap murid",
        "Paparan guru untuk pantau kelas",
      ],
      diLuarSkop:
        "Jangan bina kedai buku, imbasan ISBN, atau sistem ganjaran rumit. Tiada akaun media sosial.",
      dataDisimpan: "Nama murid, kelas, tajuk buku, penulis, tarikh siap, ulasan 1–3 ayat.",
      kekangan:
        "Borang mesti pendek. Teks besar. Elakkan jargon. Sesuai skrin telefon ibu bapa jika murid pinjam peranti.",
    },
  },
  {
    id: "tempahan",
    title: "Tempahan dewan sekolah",
    blurb: "Staf semak slot dewan dan elak pertindihan program.",
    draft: {
      masalah:
        "Tempahan dewan dan padang dibuat melalui WhatsApp dan kertas. Dua program kerap bertindih pada tarikh yang sama.",
      siapaTerjejas:
        "Guru aktiviti, penolong kanan kokurikulum, dan staf pejabat.",
      mengapaPenting:
        "Program sekolah ramai pada penggal yang sama. Pertindihan memalukan dan membuang masa persiapan.",
      sasaranPengguna:
        "Guru yang mahu menempah ruang, dan pentadbir yang meluluskan tempahan.",
      matlamatPengguna:
        "Nampak tarikh yang kosong, hantar tempahan, dan terima ya/tidak tanpa berborang berulang kali.",
      konteksPenggunaan:
        "Di pejabat sekolah semasa merancang program, atau di rumah pada waktu petang.",
      hasilDijangka:
        "Kalendar ruang kelihatan, status tempahan jelas (menunggu, lulus, tolak), dan pertindihan dapat dielak.",
      menuItems: menu("tempahan", [
        {
          name: "Kalendar",
          description: "Lihat tempahan mengikut tarikh dan ruang.",
        },
        {
          name: "Tempah",
          description: "Borang tarikh, masa, ruang, tujuan, dan bilangan peserta.",
        },
        {
          name: "Permohonan saya",
          description: "Status tempahan yang dihantar.",
        },
        {
          name: "Kelulusan",
          description: "Untuk pentadbir: lulus atau tolak dengan catatan.",
        },
        {
          name: "Ruang",
          description: "Senarai dewan, padang, dan bilik khas.",
        },
      ]),
      namaAplikasi: "DewanSlot",
      platform: "web",
      bilaDigunakan: "semasa merancang program mingguan atau kehadiran mesyuarat",
      tempatPenggunaan: "pejabat sekolah dan di rumah guru",
      bahasaUI: "bahasa-melayu",
      gayaRekaBentuk: "formal, kemas, seperti papan kenyataan digital",
      ciriWajib: [
        "Kalendar tempahan mengikut ruang",
        "Borang tempahan baharu",
        "Lulus atau tolak permohonan",
      ],
      diLuarSkop:
        "Jangan bina pembayaran sewa, inventori peralatan, atau notifikasi e-mel sebenar. Simpan data lokal sahaja.",
      dataDisimpan:
        "Nama pemohon, ruang, tarikh, masa mula/tamat, tujuan, status (menunggu/lulus/tolak).",
      kekangan:
        "Mesti nampak jelas pada skrin komputer pejabat. Warna status mudah dibezakan. Elakkan overlapping tanpa amaran.",
    },
  },
];
