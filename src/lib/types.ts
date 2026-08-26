export type MenuItem = {
  id: string;
  name: string;
  description: string;
};

export type Platform = "web" | "telefon" | "kedua-dua" | "desktop";

export type BahasaUI = "bahasa-melayu" | "english" | "dwibahasa";

export type PromptDraft = {
  masalah: string;
  siapaTerjejas: string;
  mengapaPenting: string;

  sasaranPengguna: string;
  matlamatPengguna: string;
  konteksPenggunaan: string;
  hasilDijangka: string;

  menuItems: MenuItem[];

  namaAplikasi: string;
  platform: Platform | "";
  bilaDigunakan: string;
  tempatPenggunaan: string;
  bahasaUI: BahasaUI | "";
  gayaRekaBentuk: string;
  ciriWajib: [string, string, string];
  diLuarSkop: string;
  dataDisimpan: string;
  kekangan: string;
};

export const emptyDraft = (): PromptDraft => ({
  masalah: "",
  siapaTerjejas: "",
  mengapaPenting: "",
  sasaranPengguna: "",
  matlamatPengguna: "",
  konteksPenggunaan: "",
  hasilDijangka: "",
  menuItems: [
    { id: "menu-1", name: "", description: "" },
    { id: "menu-2", name: "", description: "" },
    { id: "menu-3", name: "", description: "" },
  ],
  namaAplikasi: "",
  platform: "web",
  bilaDigunakan: "",
  tempatPenggunaan: "",
  bahasaUI: "bahasa-melayu",
  gayaRekaBentuk: "",
  ciriWajib: ["", "", ""],
  diLuarSkop: "",
  dataDisimpan: "",
  kekangan: "",
});

export type WizardStep = 0 | 1 | 2 | 3 | 4 | 5;
