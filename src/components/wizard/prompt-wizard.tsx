"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { RotateCcwIcon, SparklesIcon, WandSparklesIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { CadanganDialog } from "@/components/wizard/cadangan-dialog";
import { StepHasil } from "@/components/wizard/step-hasil";
import { StepMasalah } from "@/components/wizard/step-masalah";
import { StepMenu } from "@/components/wizard/step-menu";
import { StepSasaran } from "@/components/wizard/step-sasaran";
import { StepSituasi } from "@/components/wizard/step-situasi";
import { demoApps } from "@/lib/demo-apps";
import { examples } from "@/lib/examples";
import { buildPrompt, missingFields } from "@/lib/prompt-builder";
import {
  suggestImprovements,
  type PromptSuggestion,
} from "@/lib/suggestions";
import {
  clearSession,
  hasStoredSession,
  loadSession,
  saveSession,
  subscribeSession,
} from "@/lib/storage";
import { emptyDraft, type PromptDraft } from "@/lib/types";
import { cn } from "@/lib/utils";

const SECTIONS = [
  {
    id: "masalah",
    n: "1",
    title: "Masalah",
    caption: "Apa yang patah hari ini, siapa terjejas, dan mengapa perlu diselesaikan.",
  },
  {
    id: "sasaran",
    n: "2",
    title: "Sasaran pengguna",
    caption: "Siapa yang akan guna, apa yang mereka mahu capai, dan hasil yang dijangka.",
  },
  {
    id: "menu",
    n: "3",
    title: "Cadangan menu",
    caption: "Halaman yang pengguna akan buka dalam aplikasi.",
  },
  {
    id: "situasi",
    n: "4",
    title: "Pengisian borang situasi",
    caption: "Isi tempat kosong tentang situasi sebenar untuk pembinaan aplikasi.",
  },
] as const;

export function PromptWizard({
  initialDraft,
  contohId,
}: {
  initialDraft?: PromptDraft;
  contohId?: string;
}) {
  const [draft, setDraft] = useState<PromptDraft>(
    () => initialDraft ?? emptyDraft()
  );
  const [prompt, setPrompt] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const hasSaved = useSyncExternalStore(
    subscribeSession,
    hasStoredSession,
    () => false
  );

  useEffect(() => {
    const hasContent =
      draft.masalah.trim() ||
      draft.sasaranPengguna.trim() ||
      draft.namaAplikasi.trim() ||
      draft.menuItems.some((item) => item.name.trim());
    if (!hasContent) return;
    saveSession({ draft, step: 1 });
  }, [draft]);

  useEffect(() => {
    if (!prompt) return;
    document.getElementById("bahagian-hasil")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [prompt]);

  const issues = useMemo(
    () => ([1, 2, 3, 4] as const).flatMap((step) => missingFields(step, draft)),
    [draft]
  );

  function patchDraft(patch: Partial<PromptDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function applyExample(id: string) {
    const example = examples.find((item) => item.id === id);
    if (!example) return;
    setDraft(example.draft);
    setPrompt("");
    document.getElementById("bahagian-masalah")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function resume() {
    const saved = loadSession();
    if (!saved) return;
    setDraft(saved.draft);
    document.getElementById("bahagian-masalah")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function restart() {
    clearSession();
    setDraft(emptyDraft());
    setPrompt("");
  }

  function openCadangan(event?: { preventDefault: () => void }) {
    event?.preventDefault();
    const next = suggestImprovements(draft);
    setSuggestions(next);
    setSelected(new Set());
    setDialogOpen(true);
  }

  function toggleSuggestion(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllSuggestions() {
    setSelected((current) => {
      if (current.size === suggestions.length) return new Set();
      return new Set(suggestions.map((item) => item.id));
    });
  }

  function confirmGenerate() {
    const extras = suggestions
      .filter((item) => selected.has(item.id))
      .map((item) => item.promptLine);
    setPrompt(buildPrompt(draft, extras));
    setDialogOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {prompt ? (
        <div className="mb-8" id="hasil-prompt">
          <StepHasil key={prompt.slice(0, 48)} prompt={prompt} draft={draft} />
        </div>
      ) : null}

      <section className="grid gap-4">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold tracking-wide text-primary uppercase">
          <SparklesIcon className="size-3.5" />
          Penjana prompt untuk bina aplikasi
        </p>
        <h1 className="font-heading max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Isi empat bahagian ini. Kami susun menjadi prompt AI.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Pilih contoh, atau taip sendiri. Kemudian tekan Jana prompt. Pilih
          cadangan penambahbaikan jika mahu, lalu salin hasilnya ke Cursor,
          ChatGPT, atau Claude.
        </p>
        <div className="flex flex-wrap gap-2">
          {hasSaved ? (
            <Button
              type="button"
              variant="outline"
              onClick={resume}
              className="h-10 px-4"
            >
              Muat draf tersimpan
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={restart}
            className="h-10 px-4"
          >
            <RotateCcwIcon data-icon="inline-start" />
            Kosongkan borang
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Isi dengan contoh</h2>
          <p className="text-sm text-muted-foreground">
            Klik satu kad untuk isi borang. Cuba aplikasi sedia ada melalui
            pautan di bawah kad, atau buka Halaman contoh.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {examples.map((example) => {
            const active = contohId === example.id;
            const demo = demoApps.find((app) => app.contoh === example.id);
            return (
              <div
                key={example.id}
                className={cn(
                  "rounded-lg border bg-card p-4 text-left shadow-sm",
                  active
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border"
                )}
              >
                <a
                  href={`/?contoh=${example.id}#bahagian-masalah`}
                  onClick={(event) => {
                    event.preventDefault();
                    applyExample(example.id);
                  }}
                  className="block"
                >
                  <p className="font-medium">{example.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {example.blurb}
                  </p>
                </a>
                {demo ? (
                  <a
                    href={demo.href}
                    className="mt-3 inline-flex text-sm font-medium text-primary hover:underline"
                  >
                    Cuba {demo.name}
                  </a>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <form
        method="post"
        action="/hasil"
        className="mt-8 grid gap-6 pb-24"
        onSubmit={openCadangan}
      >
        <FormSection {...SECTIONS[0]}>
          <StepMasalah
            draft={draft}
            onChange={patchDraft}
            showErrors={false}
          />
        </FormSection>
        <FormSection {...SECTIONS[1]}>
          <StepSasaran
            draft={draft}
            onChange={patchDraft}
            showErrors={false}
          />
        </FormSection>
        <FormSection {...SECTIONS[2]}>
          <StepMenu
            draft={draft}
            onChange={patchDraft}
            showErrors={false}
          />
        </FormSection>
        <FormSection {...SECTIONS[3]}>
          <StepSituasi
            draft={draft}
            onChange={patchDraft}
            showErrors={false}
          />
        </FormSection>

        <div className="sticky bottom-3 z-10 rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur sm:flex sm:items-center sm:justify-between sm:gap-4 sm:p-4">
          <p className="mb-2 text-sm text-muted-foreground sm:mb-0">
            {issues.length > 0
              ? "Anda boleh jana sekarang. Ruangan kosong akan diisi dengan andaian mudah."
              : "Tekan Jana prompt. Cadangan penambahbaikan akan dipaparkan dahulu."}
          </p>
          <button
            type="submit"
            className={cn(buttonVariants(), "h-10 w-full px-4 sm:w-auto")}
            style={{ background: "#1d4ed8", color: "#fff" }}
            onClick={openCadangan}
          >
            <WandSparklesIcon data-icon="inline-start" />
            Jana prompt
          </button>
        </div>
      </form>

      <CadanganDialog
        open={dialogOpen}
        suggestions={suggestions}
        selected={selected}
        onToggle={toggleSuggestion}
        onToggleAll={toggleAllSuggestions}
        onCancel={() => setDialogOpen(false)}
        onConfirm={confirmGenerate}
      />
    </div>
  );
}

function FormSection({
  id,
  n,
  title,
  caption,
  children,
}: {
  id: string;
  n: string;
  title: string;
  caption: string;
  children: ReactNode;
}) {
  return (
    <section
      id={`bahagian-${id}`}
      className="scroll-mt-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6"
    >
      <header className="mb-5 flex items-start gap-3 border-b border-border pb-4">
        <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
          {n}
        </span>
        <div>
          <p className="text-xs font-semibold tracking-wide text-primary uppercase">
            Bahagian {n} / 4
          </p>
          <h2 className="font-heading mt-0.5 text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {caption}
          </p>
        </div>
      </header>
      {children}
    </section>
  );
}
