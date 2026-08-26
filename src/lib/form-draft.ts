import type { BahasaUI, Platform, PromptDraft } from "./types";
import { emptyDraft } from "./types";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

export function draftFromFormData(formData: FormData): PromptDraft {
  const names = formData.getAll("menuName").map((value) => String(value));
  const descriptions = formData
    .getAll("menuDescription")
    .map((value) => String(value));
  const menuItems =
    names.length > 0
      ? names.map((name, index) => ({
          id: `menu-${index + 1}`,
          name,
          description: descriptions[index] ?? "",
        }))
      : emptyDraft().menuItems;

  const platform = text(formData, "platform") as Platform | "";
  const bahasaUI = text(formData, "bahasaUI") as BahasaUI | "";

  return {
    masalah: text(formData, "masalah"),
    siapaTerjejas: text(formData, "siapaTerjejas"),
    mengapaPenting: text(formData, "mengapaPenting"),
    sasaranPengguna: text(formData, "sasaranPengguna"),
    matlamatPengguna: text(formData, "matlamatPengguna"),
    konteksPenggunaan: text(formData, "konteksPenggunaan"),
    hasilDijangka: text(formData, "hasilDijangka"),
    menuItems,
    namaAplikasi: text(formData, "namaAplikasi"),
    platform: platform || "web",
    bilaDigunakan: text(formData, "bilaDigunakan"),
    tempatPenggunaan: text(formData, "tempatPenggunaan"),
    bahasaUI: bahasaUI || "bahasa-melayu",
    gayaRekaBentuk: text(formData, "gayaRekaBentuk"),
    ciriWajib: [
      text(formData, "ciri0"),
      text(formData, "ciri1"),
      text(formData, "ciri2"),
    ],
    diLuarSkop: text(formData, "diLuarSkop"),
    dataDisimpan: text(formData, "dataDisimpan"),
    kekangan: text(formData, "kekangan"),
  };
}
