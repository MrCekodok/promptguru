"use client";

import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/wizard/field";
import type { PromptDraft } from "@/lib/types";

export function StepSasaran({
  draft,
  onChange,
  showErrors,
}: {
  draft: PromptDraft;
  onChange: (patch: Partial<PromptDraft>) => void;
  showErrors: boolean;
}) {
  const sasaranError = showErrors && draft.sasaranPengguna.trim().length < 8;
  const matlamatError = showErrors && draft.matlamatPengguna.trim().length < 8;

  return (
    <div className="grid gap-6">
      <Field
        label="Siapakah sasaran pengguna?"
        htmlFor="sasaran"
        required
        error={sasaranError}
        hint={
          sasaranError
            ? "Nyatakan kumpulan pengguna utama."
            : "Siapa yang akan buka aplikasi ini setiap hari? Jika ada dua kumpulan, nyatakan kedua-duanya."
        }
      >
        <Textarea
          id="sasaran"
          name="sasaranPengguna"
          value={draft.sasaranPengguna}
          aria-invalid={sasaranError || undefined}
          onChange={(event) => onChange({ sasaranPengguna: event.target.value })}
          placeholder="Contoh: Guru kelas sebagai pengguna utama; ibu bapa hanya melihat status anak sendiri."
          className="min-h-24 bg-background"
        />
      </Field>

      <Field
        label="Apa yang mereka mahu capai?"
        htmlFor="matlamat"
        required
        error={matlamatError}
        hint={
          matlamatError
            ? "Tulis matlamat pengguna dalam satu ayat."
            : "Fokus pada kerja yang mahu siap, bukan pada teknologi."
        }
      >
        <Textarea
          id="matlamat"
          name="matlamatPengguna"
          value={draft.matlamatPengguna}
          aria-invalid={matlamatError || undefined}
          onChange={(event) =>
            onChange({ matlamatPengguna: event.target.value })
          }
          placeholder="Contoh: Guru mahu tanda kehadiran dalam 2 minit. Ibu bapa mahu tahu status anak pada hari itu juga."
          className="min-h-24 bg-background"
        />
      </Field>

      <Field
        label="Dalam situasi apa mereka gunakan aplikasi ini?"
        htmlFor="konteks"
        hint="Masa, tempat, dan tekanan. Contoh: pagi-pagi di bilik darjah, rangkaian lambat."
      >
        <Textarea
          id="konteks"
          name="konteksPenggunaan"
          value={draft.konteksPenggunaan}
          onChange={(event) =>
            onChange({ konteksPenggunaan: event.target.value })
          }
          placeholder="Contoh: Digunakan semasa daftar masuk, pada telefon guru. Internet sekolah kadang-kadang terputus."
          className="min-h-20 bg-background"
        />
      </Field>

      <Field
        label="Apakah hasil yang dijangka selepas menggunakannya?"
        htmlFor="hasil"
        hint="Bagaimana nampak 'berjaya'? Rekod tersimpan, laporan siap, tempahan tidak bertindih..."
      >
        <Textarea
          id="hasil"
          name="hasilDijangka"
          value={draft.hasilDijangka}
          onChange={(event) => onChange({ hasilDijangka: event.target.value })}
          placeholder="Contoh: Rekod harian tersimpan dan guru boleh muat turun laporan bulanan."
          className="min-h-20 bg-background"
        />
      </Field>
    </div>
  );
}
