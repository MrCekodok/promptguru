"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Blank, Field } from "@/components/wizard/field";
import { cn } from "@/lib/utils";
import type { BahasaUI, Platform, PromptDraft } from "@/lib/types";

const selectClass = cn(
  "h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm text-foreground outline-none",
  "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
);

export function StepSituasi({
  draft,
  onChange,
  showErrors,
}: {
  draft: PromptDraft;
  onChange: (patch: Partial<PromptDraft>) => void;
  showErrors: boolean;
}) {
  const namaError = showErrors && draft.namaAplikasi.trim().length < 2;
  const ciriError =
    showErrors && draft.ciriWajib.filter((item) => item.trim()).length < 1;

  function setCiri(index: 0 | 1 | 2, value: string) {
    const next: PromptDraft["ciriWajib"] = [...draft.ciriWajib];
    next[index] = value;
    onChange({ ciriWajib: next });
  }

  return (
    <div className="grid gap-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Lengkapkan ayat di bawah. Ini membantu AI faham situasi sebenar
        sebelum membina aplikasi.
      </p>

      <div className="rounded-lg border border-primary/20 bg-accent p-4 sm:p-5">
        <p className="mb-3 text-xs font-medium tracking-wide text-primary uppercase">
          Lembaran situasi
        </p>
        <p className="text-[1.05rem] leading-9 text-foreground">
          Aplikasi ini bernama
          <Blank
            value={draft.namaAplikasi}
            onChange={(namaAplikasi) => onChange({ namaAplikasi })}
            placeholder="nama aplikasi"
            ariaLabel="Nama aplikasi"
            className="min-w-[12rem]"
          />
          . Pengguna akan menggunakannya
          <Blank
            value={draft.bilaDigunakan}
            onChange={(bilaDigunakan) => onChange({ bilaDigunakan })}
            placeholder="bila, contoh: setiap pagi"
            ariaLabel="Bila digunakan"
            className="min-w-[14rem]"
          />
          di
          <Blank
            value={draft.tempatPenggunaan}
            onChange={(tempatPenggunaan) => onChange({ tempatPenggunaan })}
            placeholder="tempat, contoh: bilik darjah"
            ariaLabel="Tempat penggunaan"
            className="min-w-[12rem]"
          />
          . Reka bentuknya kelihatan
          <Blank
            value={draft.gayaRekaBentuk}
            onChange={(gayaRekaBentuk) => onChange({ gayaRekaBentuk })}
            placeholder="contoh: ringkas dan ceria"
            ariaLabel="Gaya reka bentuk"
            className="min-w-[14rem]"
          />
          .
        </p>
        {namaError ? (
          <p className="mt-3 text-xs text-destructive">
            Isi nama aplikasi pada ruang kosong pertama.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Platform" required>
          <select
            className={selectClass}
            value={draft.platform || "web"}
            onChange={(event) =>
              onChange({ platform: event.target.value as Platform })
            }
          >
            <option value="web">Laman web</option>
            <option value="telefon">Telefon / mudah alih</option>
            <option value="kedua-dua">Web yang sesuai di telefon juga</option>
            <option value="desktop">Desktop</option>
          </select>
        </Field>

        <Field label="Bahasa antara muka" required>
          <select
            className={selectClass}
            value={draft.bahasaUI || "bahasa-melayu"}
            onChange={(event) =>
              onChange({ bahasaUI: event.target.value as BahasaUI })
            }
          >
            <option value="bahasa-melayu">Bahasa Melayu</option>
            <option value="english">English</option>
            <option value="dwibahasa">Dwibahasa</option>
          </select>
        </Field>
      </div>

      <div className="grid gap-3">
        <Label className="text-[0.92rem]">
          Tiga ciri yang wajib ada pada versi pertama
        </Label>
        {([0, 1, 2] as const).map((index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-5 text-sm font-medium text-muted-foreground">
              {index + 1}.
            </span>
            <Input
              value={draft.ciriWajib[index]}
              onChange={(event) => setCiri(index, event.target.value)}
              placeholder={
                index === 0
                  ? "Contoh: Tanda kehadiran mengikut tarikh"
                  : index === 1
                    ? "Contoh: Lihat laporan ringkas"
                    : "Contoh: Simpan rekod pada pelayar"
              }
              aria-label={`Ciri wajib ${index + 1}`}
              className="h-9 bg-background"
              aria-invalid={ciriError && index === 0 ? true : undefined}
            />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Tulis kerja yang pengguna mesti boleh buat, bukan nama butang.
        </p>
      </div>

      <Field
        label="Perkara yang tidak perlu dibina sekarang"
        htmlFor="skop"
        hint="Elakkan AI menambah log masuk, bayaran, atau ciri besar yang belum perlu."
      >
        <Textarea
          id="skop"
          value={draft.diLuarSkop}
          onChange={(event) => onChange({ diLuarSkop: event.target.value })}
          placeholder="Contoh: Jangan bina log masuk, e-mel, atau pembayaran. Data cukup disimpan pada pelayar."
          className="min-h-20 bg-background"
        />
      </Field>

      <Field label="Data yang perlu disimpan" htmlFor="data">
        <Textarea
          id="data"
          value={draft.dataDisimpan}
          onChange={(event) => onChange({ dataDisimpan: event.target.value })}
          placeholder="Contoh: Nama murid, kelas, tarikh, status kehadiran."
          className="min-h-20 bg-background"
        />
      </Field>

      <Field
        label="Kekangan yang perlu diingat"
        htmlFor="kekangan"
        hint="Peranti, internet, masa, umur pengguna, atau dasar sekolah."
      >
        <Textarea
          id="kekangan"
          value={draft.kekangan}
          onChange={(event) => onChange({ kekangan: event.target.value })}
          placeholder="Contoh: Mesti mudah pada telefon. Internet kadang-kadang terputus."
          className="min-h-20 bg-background"
        />
      </Field>
    </div>
  );
}
