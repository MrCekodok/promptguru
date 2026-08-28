import { emptyDraft, type PromptDraft } from "./types";

function clip(value: unknown, max = 2000) {
  if (typeof value !== "string") return "";
  return value.slice(0, max);
}

export function sanitizeDraft(input: unknown): PromptDraft | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Record<string, unknown>;
  const base = emptyDraft();
  const menus = Array.isArray(raw.menuItems) ? raw.menuItems : [];
  const ciri = Array.isArray(raw.ciriWajib) ? raw.ciriWajib : [];

  return {
    ...base,
    masalah: clip(raw.masalah),
    siapaTerjejas: clip(raw.siapaTerjejas),
    mengapaPenting: clip(raw.mengapaPenting),
    sasaranPengguna: clip(raw.sasaranPengguna),
    matlamatPengguna: clip(raw.matlamatPengguna),
    konteksPenggunaan: clip(raw.konteksPenggunaan),
    hasilDijangka: clip(raw.hasilDijangka),
    menuItems:
      menus.length > 0
        ? menus.slice(0, 12).map((item, index) => {
            const row =
              item && typeof item === "object"
                ? (item as Record<string, unknown>)
                : {};
            return {
              id: clip(row.id, 80) || `menu-${index + 1}`,
              name: clip(row.name, 120),
              description: clip(row.description, 400),
            };
          })
        : base.menuItems,
    namaAplikasi: clip(raw.namaAplikasi, 80),
    platform: clip(raw.platform, 40) as PromptDraft["platform"],
    bilaDigunakan: clip(raw.bilaDigunakan, 400),
    tempatPenggunaan: clip(raw.tempatPenggunaan, 400),
    bahasaUI: clip(raw.bahasaUI, 40) as PromptDraft["bahasaUI"],
    gayaRekaBentuk: clip(raw.gayaRekaBentuk, 400),
    ciriWajib: [
      clip(ciri[0], 400),
      clip(ciri[1], 400),
      clip(ciri[2], 400),
    ],
    diLuarSkop: clip(raw.diLuarSkop),
    dataDisimpan: clip(raw.dataDisimpan),
    kekangan: clip(raw.kekangan),
  };
}

export function draftToBrief(draft: PromptDraft) {
  const menu = draft.menuItems
    .filter((item) => item.name.trim())
    .map((item, index) => {
      const desc = item.description.trim();
      return desc
        ? `${index + 1}. ${item.name.trim()} — ${desc}`
        : `${index + 1}. ${item.name.trim()}`;
    })
    .join("\n");

  const ciri = draft.ciriWajib
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- ${item}`)
    .join("\n");

  return `Nama aplikasi: ${draft.namaAplikasi.trim() || "(belum diisi)"}
Platform: ${draft.platform || "(belum dipilih)"}
Bahasa antara muka: ${draft.bahasaUI || "(belum dipilih)"}

Masalah:
${draft.masalah.trim() || "(kosong)"}
Siapa terjejas: ${draft.siapaTerjejas.trim() || "(kosong)"}
Mengapa penting: ${draft.mengapaPenting.trim() || "(kosong)"}

Sasaran pengguna: ${draft.sasaranPengguna.trim() || "(kosong)"}
Matlamat pengguna: ${draft.matlamatPengguna.trim() || "(kosong)"}
Konteks penggunaan: ${draft.konteksPenggunaan.trim() || "(kosong)"}
Hasil dijangka: ${draft.hasilDijangka.trim() || "(kosong)"}

Menu:
${menu || "(tiada menu)"}

Bila digunakan: ${draft.bilaDigunakan.trim() || "(kosong)"}
Tempat penggunaan: ${draft.tempatPenggunaan.trim() || "(kosong)"}
Gaya reka bentuk: ${draft.gayaRekaBentuk.trim() || "(kosong)"}

Ciri wajib:
${ciri || "(tiada)"}

Di luar skop: ${draft.diLuarSkop.trim() || "(kosong)"}
Data yang disimpan: ${draft.dataDisimpan.trim() || "(kosong)"}
Kekangan: ${draft.kekangan.trim() || "(kosong)"}`;
}
