"use client";

import type { ReactNode } from "react";
import { useActionState, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { RotateCcwIcon, SparklesIcon, WandSparklesIcon } from "lucide-react";

import Link from "next/link";
import { janaPrompt } from "@/app/actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { StepHasil } from "@/components/wizard/step-hasil";
import { StepMasalah } from "@/components/wizard/step-masalah";
import { StepMenu } from "@/components/wizard/step-menu";
import { StepSasaran } from "@/components/wizard/step-sasaran";
import { StepSituasi } from "@/components/wizard/step-situasi";
import { examples } from "@/lib/examples";
import { missingFields } from "@/lib/prompt-builder";
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
  const router = useRouter();
  const [draft, setDraft] = useState<PromptDraft>(
    () => initialDraft ?? emptyDraft()
  );
  const [state, formAction, pending] = useActionState(janaPrompt, null);
  const prompt = state?.prompt ?? "";
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
    router.push("/");
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      {prompt ? (
        <div className="mb-8">
          <StepHasil
            key={prompt.slice(0, 48)}
            prompt={prompt}
            draft={draft}
          />
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
          Pilih contoh, atau taip sendiri. Kemudian tekan Jana prompt. Salin
          hasilnya ke Cursor, ChatGPT, atau Claude.
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
            Klik satu kad. Borang akan diisi, kemudian tekan Jana prompt.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {examples.map((example) => {
            const active = contohId === example.id;
            return (
              <Link
                key={example.id}
                href={`/?contoh=${example.id}#bahagian-masalah`}
                className={cn(
                  "rounded-lg border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/50 hover:bg-accent",
                  active ? "border-primary ring-2 ring-primary/20" : "border-border"
                )}
              >
                <p className="font-medium">{example.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {example.blurb}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <form action={formAction} className="mt-8 grid gap-6 pb-24">
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
              : "Tekan Jana prompt, kemudian salin brief ke aplikasi AI."}
          </p>
          <button
            type="submit"
            disabled={pending}
            className={cn(
              buttonVariants(),
              "h-10 w-full px-4 sm:w-auto disabled:opacity-60"
            )}
          >
            <WandSparklesIcon data-icon="inline-start" />
            {pending ? "Menjana…" : "Jana prompt"}
          </button>
        </div>
      </form>
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
