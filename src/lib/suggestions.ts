import type { PromptDraft } from "./types";

export type PromptSuggestion = {
  id: string;
  title: string;
  detail: string;
  promptLine: string;
};

function blob(draft: PromptDraft) {
  return [
    draft.masalah,
    draft.siapaTerjejas,
    draft.mengapaPenting,
    draft.sasaranPengguna,
    draft.matlamatPengguna,
    draft.konteksPenggunaan,
    draft.hasilDijangka,
    draft.namaAplikasi,
    draft.bilaDigunakan,
    draft.tempatPenggunaan,
    draft.gayaRekaBentuk,
    draft.ciriWajib.join(" "),
    draft.diLuarSkop,
    draft.dataDisimpan,
    draft.kekangan,
    draft.menuItems.map((item) => `${item.name} ${item.description}`).join(" "),
  ]
    .join("\n")
    .toLowerCase();
}

function has(text: string, pattern: RegExp) {
  return pattern.test(text);
}

export function suggestImprovements(draft: PromptDraft): PromptSuggestion[] {
  const text = blob(draft);
  const nama = draft.namaAplikasi.trim() || "aplikasi ini";
  const menus = draft.menuItems
    .map((item) => item.name.trim())
    .filter(Boolean);
  const users = draft.sasaranPengguna.trim() || "pengguna utama";
  const out: PromptSuggestion[] = [];

  function add(item: PromptSuggestion) {
    if (out.some((existing) => existing.id === item.id)) return;
    out.push(item);
  }

  if (!has(text, /kosong|tiada rekod|belum ada/)) {
    add({
      id: "empty",
      title: "Keadaan kosong yang jelas",
      detail: `Pada ${nama}, jika senarai masih kosong, beritahu apa yang patut dibuat seterusnya.`,
      promptLine: `Sediakan keadaan kosong yang jelas pada setiap senarai dalam ${nama}. Jika tiada rekod, nyatakan apa yang ${users} patut buat, bukan halaman putih.`,
    });
  }

  if (!has(text, /ralat|error|tidak lengkap|validasi/)) {
    add({
      id: "errors",
      title: "Ralat borang yang mudah difahami",
      detail: "Tunjuk mesej pendek jika ruangan wajib belum diisi, bukan gagal senyap.",
      promptLine: `Jika borang dalam ${nama} tidak lengkap, paparkan ralat ringkas di sebelah ruangan yang bermasalah dan jangan simpan data separuh siap.`,
    });
  }

  if (
    draft.platform !== "telefon" &&
    !has(text, /telefon|mudah alih|responsif|jari/)
  ) {
    add({
      id: "mobile",
      title: "Susun atur sesuai telefon",
      detail: "Butang dan senarai mesti mudah ditekan dengan jari.",
      promptLine: `Pastikan ${nama} kemas pada skrin telefon: butang cukup besar, teks tidak terpotong, dan kerja utama boleh siap tanpa tatal mendatar.`,
    });
  }

  if (draft.dataDisimpan.trim() && !has(text, /localstorage|pelayar|peranti/)) {
    add({
      id: "storage",
      title: "Simpan data pada pelayar",
      detail: `${draft.dataDisimpan.trim().slice(0, 80)} disimpan secara tempatan, tanpa akaun.`,
      promptLine: `Simpan data berikut pada pelayar (localStorage): ${draft.dataDisimpan.trim()}. Jangan minta log masuk.`,
    });
  } else if (!draft.dataDisimpan.trim()) {
    add({
      id: "storage-generic",
      title: "Simpan kerja pengguna",
      detail: "Rekod yang ditambah tidak hilang apabila halaman dimuat semula.",
      promptLine: `Rekod yang pengguna tambah dalam ${nama} mesti kekal selepas muat semula halaman. Guna storan pelayar.`,
    });
  }

  if (!has(text, /log masuk|login|akaun/) && !has(text, /jangan bina log/)) {
    add({
      id: "no-login",
      title: "Tanpa log masuk",
      detail: "Versi pertama terus boleh digunakan, tanpa daftar akaun.",
      promptLine: `Jangan bina log masuk, daftar, atau e-mel. ${nama} mesti boleh digunakan terus pada peranti ini.`,
    });
  }

  if (menus.length > 0 && menus.length < 3) {
    add({
      id: "menu-laporan",
      title: "Tambah halaman ringkasan",
      detail: `Menu sekarang: ${menus.join(", ")}. Satu halaman ringkasan membantu nampak status cepat.`,
      promptLine: `Selain menu ${menus.join(", ")}, sediakan satu halaman ringkasan di laman utama yang menunjukkan status kerja hari ini dan pintasan ke tugasan utama.`,
    });
  }

  if (has(text, /kehadir|hadir|ponteng|absen/)) {
    add({
      id: "attendance-notice",
      title: "Notis tidak hadir pada hari yang sama",
      detail: "Ibu bapa atau guru penasihat nampak nama murid yang tidak hadir atau lewat.",
      promptLine: "Sediakan paparan notis harian: senaraikan murid yang tidak hadir atau lewat pada tarikh yang dipilih, dengan bahasa yang sesuai dibaca ibu bapa.",
    });
    if (!has(text, /peratus|laporan/)) {
      add({
        id: "attendance-percent",
        title: "Peratus kehadiran setiap murid",
        detail: "Guru boleh nampak siapa yang kerap ponteng tanpa kira manual.",
        promptLine: "Kira peratus kehadiran setiap murid daripada rekod yang sudah ditanda. Lewat dikira hadir; cuti dan tidak hadir tidak dikira hadir.",
      });
    }
  }

  if (has(text, /baca|buku|jurnal|nilam/)) {
    add({
      id: "reading-teacher",
      title: "Paparan guru untuk pantau kelas",
      detail: "Guru nampak bilangan buku setiap murid dan siapa yang belum merekod.",
      promptLine: "Sediakan paparan guru: senarai murid, bilangan buku, dan penanda jelas untuk murid yang belum ada rekod.",
    });
    if (!has(text, /lencana|ganjaran/)) {
      add({
        id: "reading-badge",
        title: "Lencana sasaran bacaan",
        detail: "Ganjaran kecil apabila mencapai 3, 5, atau 10 buku.",
        promptLine: "Tambah lencana mudah berdasarkan bilangan buku (contoh: 3, 5, 10), tanpa sistem mata yang rumit.",
      });
    }
  }

  if (has(text, /tempah|dewan|slot|padang|pertindih/)) {
    add({
      id: "booking-clash",
      title: "Amaran pertindihan slot",
      detail: "Jangan biarkan dua program lulus pada ruang dan masa yang sama.",
      promptLine: "Sebelum menerima tempahan, semak pertindihan ruang, tarikh, dan masa. Jika slot sudah diluluskan, sekat tempahan baharu dan terangkan sebabnya.",
    });
    if (!has(text, /lulus|tolak|kelulusan/)) {
      add({
        id: "booking-approve",
        title: "Lulus atau tolak permohonan",
        detail: "Pentadbir nampak senarai menunggu dan boleh buat keputusan dengan catatan.",
        promptLine: "Sediakan paparan kelulusan: senarai permohonan menunggu, butang lulus/tolak, dan catatan ringkas jika ditolak.",
      });
    }
  }

  if (has(text, /guru|murid|sekolah|kelas/)) {
    add({
      id: "school-plain",
      title: "Bahasa mudah untuk sekolah",
      detail: "Elakkan jargon teknikal. Ayat pendek, sesuai guru dan ibu bapa.",
      promptLine: "Gunakan Bahasa Melayu yang ringkas, sesuai guru, murid, dan ibu bapa. Elakkan istilah teknikal seperti API, CRUD, atau dashboard melainkan perlu.",
    });
  }

  if (draft.kekangan.trim()) {
    add({
      id: "constraints",
      title: "Patuhi kekangan yang sudah ditulis",
      detail: draft.kekangan.trim().slice(0, 120),
      promptLine: `Kekangan ini wajib dipatuhi semasa bina ${nama}: ${draft.kekangan.trim()}`,
    });
  }

  if (draft.ciriWajib.filter((item) => item.trim()).length === 1) {
    add({
      id: "one-flow",
      title: "Sempurnakan satu aliran utama",
      detail: `Utamakan: ${draft.ciriWajib.find((item) => item.trim())}.`,
      promptLine: `Utamakan satu aliran lengkap dahulu: ${draft.ciriWajib.find((item) => item.trim())}. Pengguna mesti boleh mula, siap kerja itu, dan nampak hasil pada skrin.`,
    });
  }

  if (draft.hasilDijangka.trim()) {
    add({
      id: "success",
      title: "Nampak tanda berjaya",
      detail: draft.hasilDijangka.trim().slice(0, 120),
      promptLine: `Selepas tugasan utama, pengguna mesti nampak hasil ini: ${draft.hasilDijangka.trim()}`,
    });
  }

  if (out.length < 5) {
    add({
      id: "seed-data",
      title: "Data contoh untuk dicuba terus",
      detail: `${nama} nampak hidup pada buka pertama, bukan senarai kosong sahaja.`,
      promptLine: `Isi ${nama} dengan data contoh yang munasabah supaya boleh dicuba terus, dan benarkan pengguna menambah atau memadam rekod itu.`,
    });
    add({
      id: "copy",
      title: "Ayat sebenar, bukan lorem ipsum",
      detail: "Semua butang, tajuk, dan mesej dalam bahasa antara muka yang dipilih.",
      promptLine: "Semua salinan antara muka mesti ayat sebenar. Jangan guna lorem ipsum atau placeholder seperti 'Item 1'.",
    });
  }

  return out.slice(0, 10);
}
