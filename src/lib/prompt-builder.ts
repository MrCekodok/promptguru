import type { BahasaUI, Platform, PromptDraft } from "./types";

const platformLabel: Record<Platform, string> = {
  web: "laman web (responsif untuk komputer dan telefon)",
  telefon: "aplikasi mudah alih / paparan telefon dahulu",
  "kedua-dua": "laman web yang kemas di komputer dan telefon",
  desktop: "aplikasi desktop",
};

const bahasaLabel: Record<BahasaUI, string> = {
  "bahasa-melayu": "Bahasa Melayu",
  english: "English",
  dwibahasa: "dwibahasa (Bahasa Melayu dan English)",
};

function line(label: string, value: string) {
  const trimmed = value.trim();
  return trimmed ? `${label}: ${trimmed}` : null;
}

function bullet(value: string) {
  const trimmed = value.trim();
  return trimmed ? `- ${trimmed}` : null;
}

export function isStepComplete(step: 1 | 2 | 3 | 4, draft: PromptDraft) {
  if (step === 1) return draft.masalah.trim().length >= 12;
  if (step === 2)
    return (
      draft.sasaranPengguna.trim().length >= 8 &&
      draft.matlamatPengguna.trim().length >= 8
    );
  if (step === 3)
    return draft.menuItems.filter((item) => item.name.trim()).length >= 2;
  return (
    draft.namaAplikasi.trim().length >= 2 &&
    Boolean(draft.platform) &&
    Boolean(draft.bahasaUI) &&
    draft.ciriWajib.filter((item) => item.trim()).length >= 1
  );
}

export function missingFields(step: 1 | 2 | 3 | 4, draft: PromptDraft) {
  const missing: string[] = [];
  if (step === 1 && draft.masalah.trim().length < 12) {
    missing.push("Terangkan masalah sekurang-kurangnya dalam satu ayat.");
  }
  if (step === 2) {
    if (draft.sasaranPengguna.trim().length < 8) {
      missing.push("Nyatakan siapa sasaran pengguna.");
    }
    if (draft.matlamatPengguna.trim().length < 8) {
      missing.push("Nyatakan apa yang pengguna mahu capai.");
    }
  }
  if (step === 3) {
    const named = draft.menuItems.filter((item) => item.name.trim()).length;
    if (named < 2) {
      missing.push("Isi sekurang-kurangnya dua menu.");
    }
  }
  if (step === 4) {
    if (draft.namaAplikasi.trim().length < 2) {
      missing.push("Isi nama aplikasi.");
    }
    if (!draft.platform) missing.push("Pilih platform.");
    if (!draft.bahasaUI) missing.push("Pilih bahasa antara muka.");
    if (draft.ciriWajib.filter((item) => item.trim()).length < 1) {
      missing.push("Isi sekurang-kurangnya satu ciri wajib.");
    }
  }
  return missing;
}

export function buildPrompt(draft: PromptDraft, extras: string[] = []) {
  const nama = draft.namaAplikasi.trim() || "aplikasi baharu";
  const platform = draft.platform
    ? platformLabel[draft.platform]
    : "laman web yang berfungsi di komputer dan telefon";
  const bahasa = draft.bahasaUI
    ? bahasaLabel[draft.bahasaUI]
    : "Bahasa Melayu";

  const menu = draft.menuItems
    .filter((item) => item.name.trim())
    .map((item, index) => {
      const desc = item.description.trim();
      return desc
        ? `${index + 1}. ${item.name.trim()} — ${desc}`
        : `${index + 1}. ${item.name.trim()}`;
    })
    .join("\n");

  const ciri = draft.ciriWajib.map(bullet).filter(Boolean).join("\n");

  const masalahBlock = [
    draft.masalah.trim(),
    line("Siapa yang terjejas", draft.siapaTerjejas),
    line("Mengapa ini penting sekarang", draft.mengapaPenting),
  ]
    .filter(Boolean)
    .join("\n");

  const sasaranBlock = [
    line("Sasaran pengguna", draft.sasaranPengguna),
    line("Matlamat mereka", draft.matlamatPengguna),
    line("Bila dan bagaimana mereka guna", draft.konteksPenggunaan),
    line("Hasil yang dijangka", draft.hasilDijangka),
  ]
    .filter(Boolean)
    .join("\n");

  const situasi = [
    line("Nama aplikasi", nama),
    line("Platform", platform),
    line("Bila digunakan", draft.bilaDigunakan),
    line("Tempat penggunaan", draft.tempatPenggunaan),
    line("Bahasa antara muka", bahasa),
    line("Gaya reka bentuk", draft.gayaRekaBentuk),
    line("Data yang perlu disimpan", draft.dataDisimpan),
    line("Kekangan", draft.kekangan),
    line("Jangan bina / di luar skop", draft.diLuarSkop),
  ]
    .filter(Boolean)
    .join("\n");

  return `Bina satu aplikasi lengkap yang boleh digunakan, bukan sekadar rangka atau halaman kosong.

# ${nama}

Anda ialah pembangun aplikasi. Baca keseluruhan brief ini, kemudian bina aplikasi mengikut keutamaan di bawah. Jangan tanya soalan penutup yang menangguhkan kerja — buat andaian yang munasabah dan teruskan.

## Masalah yang perlu diselesaikan

${masalahBlock || "(Tidak dinyatakan — infer dari bahagian lain.)"}

## Sasaran pengguna

${sasaranBlock || "(Tidak dinyatakan.)"}

## Menu dan navigasi

Sediakan navigasi yang jelas untuk menu berikut. Setiap menu mesti ke halaman atau paparan yang benar-benar berfungsi, bukan pautan mati.

${menu || "(Sediakan menu utama yang sesuai dengan masalah dan sasaran.)"}

## Situasi pembinaan

${situasi}

## Ciri wajib (versi pertama)

${ciri || "- Satu aliran utama yang menyelesaikan masalah di atas."}

## Cadangan tambahan yang dipilih

${
  extras.filter((item) => item.trim()).length > 0
    ? extras
        .filter((item) => item.trim())
        .map((item) => `- ${item.trim()}`)
        .join("\n")
    : "- (Tiada cadangan tambahan dipilih.)"
}

## Arahan pelaksanaan

1. Bina ${platform}.
2. Semua salinan antara muka dalam ${bahasa}. Gunakan ayat sebenar, bukan teks placeholder atau lorem ipsum.
3. Selesaikan satu irisan yang boleh digunakan: pengguna boleh masuk, buat tugasan utama, dan nampak hasil.
4. Liputi keadaan kosong, ralat, dan jika perlu, pemuatan. Contoh: tiada rekod lagi, borang tidak lengkap, gagal menyimpan.
5. Susun atur mesti kemas di skrin komputer dan telefon.
6. Jangan tambah log masuk, pangkalan data luar, atau perkhidmatan berbayar melainkan brief ini memintanya. Jika data perlu disimpan, guna storan pelayar (localStorage) atau data semasa sesi.
7. Jangan bina ciri di luar skop. Utamakan menu dan ciri wajib.
8. Namakan aplikasi "${nama}" pada tajuk halaman dan pengepala.
9. Jika brief tidak lengkap pada butiran kecil, pilih pilihan paling mudah yang masih menyelesaikan masalah.

## Hasil yang diharapkan

Aplikasi siap untuk dicuba: navigasi lengkap mengikut menu, aliran utama berjalan, dan reka bentuk sesuai ${draft.gayaRekaBentuk.trim() || "penggunaan seharian yang jelas dan tidak sesak"}.
`;
}

export function slugifyName(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "prompt-aplikasi";
}
