"use client";

import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/wizard/field";
import type { PromptDraft } from "@/lib/types";

export function StepMasalah({
  draft,
  onChange,
  showErrors,
}: {
  draft: PromptDraft;
  onChange: (patch: Partial<PromptDraft>) => void;
  showErrors: boolean;
}) {
  const masalahError = showErrors && draft.masalah.trim().length < 12;

  return (
    <div className="grid gap-6">
      <Field
        label="Apakah masalah yang mahu diselesaikan?"
        htmlFor="masalah"
        required
        error={masalahError}
        hint={
          masalahError
            ? "Tulis sekurang-kurangnya satu ayat yang jelas."
            : "Terangkan halangan sebenar, bukan nama aplikasi. Contoh: rekod hilang, kerja berulang, maklumat lambat sampai."
        }
      >
        <Textarea
          id="masalah"
          value={draft.masalah}
          aria-invalid={masalahError || undefined}
          onChange={(event) => onChange({ masalah: event.target.value })}
          placeholder="Contoh: Guru merekod kehadiran dalam buku kertas. Data susah dikira dan ibu bapa hanya tahu anak ponteng di akhir bulan."
          className="min-h-28 bg-background"
        />
      </Field>

      <Field
        label="Siapa yang terjejas?"
        htmlFor="siapa"
        hint="Guru, murid, ibu bapa, staf pejabat, pelanggan, dan sebagainya."
      >
        <Textarea
          id="siapa"
          value={draft.siapaTerjejas}
          onChange={(event) => onChange({ siapaTerjejas: event.target.value })}
          placeholder="Contoh: Guru kelas dan ibu bapa murid tahun 4."
          className="min-h-20 bg-background"
        />
      </Field>

      <Field
        label="Mengapa masalah ini penting sekarang?"
        htmlFor="mengapa"
        hint="Apa yang berlaku jika dibiarkan? Bila masalah ini muncul?"
      >
        <Textarea
          id="mengapa"
          value={draft.mengapaPenting}
          onChange={(event) => onChange({ mengapaPenting: event.target.value })}
          placeholder="Contoh: Kehadiran perlu direkod setiap pagi. Jika lewat, sekolah tidak sempat campur tangan."
          className="min-h-20 bg-background"
        />
      </Field>
    </div>
  );
}
