"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
  WandSparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepHasil } from "@/components/wizard/step-hasil";
import { StepMasalah } from "@/components/wizard/step-masalah";
import { StepMenu } from "@/components/wizard/step-menu";
import { StepSasaran } from "@/components/wizard/step-sasaran";
import { StepSituasi } from "@/components/wizard/step-situasi";
import { examples } from "@/lib/examples";
import { buildPrompt, isStepComplete, missingFields } from "@/lib/prompt-builder";
import { clearSession, hasStoredSession, loadSession, saveSession, subscribeSession } from "@/lib/storage";
import { emptyDraft, type PromptDraft, type WizardStep } from "@/lib/types";

function isFormStep(step: WizardStep): step is 1 | 2 | 3 | 4 {
  return step === 1 || step === 2 || step === 3 || step === 4;
}

const STEPS: { id: WizardStep; title: string; caption: string }[] = [
  { id: 0, title: "Mula", caption: "Pengenalan" },
  { id: 1, title: "Masalah", caption: "Apa yang patah" },
  { id: 2, title: "Sasaran", caption: "Untuk siapa" },
  { id: 3, title: "Menu", caption: "Laluan pengguna" },
  { id: 4, title: "Situasi", caption: "Isi tempat kosong" },
  { id: 5, title: "Prompt", caption: "Siap salin" },
];

export function PromptWizard() {
  const [draft, setDraft] = useState<PromptDraft>(emptyDraft);
  const [step, setStep] = useState<WizardStep>(0);
  const [showErrors, setShowErrors] = useState(false);
  const [prompt, setPrompt] = useState("");
  const hasSaved = useSyncExternalStore(
    subscribeSession,
    hasStoredSession,
    () => false
  );

  useEffect(() => {
    if (step === 0) return;
    saveSession({ draft, step });
  }, [draft, step]);

  const generated = useMemo(() => buildPrompt(draft), [draft]);

  function patchDraft(patch: Partial<PromptDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  function goTo(next: WizardStep) {
    setShowErrors(false);
    setStep(next);
    if (next === 5) {
      setPrompt(buildPrompt(draft));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function next() {
    if (step === 0) {
      goTo(1);
      return;
    }
    if (isFormStep(step)) {
      if (!isStepComplete(step, draft)) {
        setShowErrors(true);
        return;
      }
      goTo((step + 1) as WizardStep);
    }
  }

  function back() {
    if (step === 0) return;
    goTo((step - 1) as WizardStep);
  }

  function applyExample(id: string) {
    const example = examples.find((item) => item.id === id);
    if (!example) return;
    setDraft(example.draft);
    goTo(1);
  }

  function resume() {
    const saved = loadSession();
    if (!saved) return;
    setDraft(saved.draft);
    goTo(saved.step === 0 ? 1 : saved.step);
  }

  function startFresh() {
    clearSession();
    setDraft(emptyDraft());
    setPrompt("");
    goTo(1);
  }

  function restart() {
    clearSession();
    setDraft(emptyDraft());
    setPrompt("");
    goTo(0);
  }

  const progressValue =
    step === 0 ? 0 : step === 5 ? 100 : Math.round(((step - 1) / 4) * 100);
  const current = STEPS[step];
  const issues = isFormStep(step) ? missingFields(step, draft) : [];

  return (
    <div className="mx-auto w-full max-w-3xl">
      {step > 0 ? (
        <div className="mb-6 grid gap-3">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                Langkah {Math.min(step, 4)} / 4
              </p>
              <h2 className="font-heading text-2xl font-semibold tracking-tight">
                {current.title}
              </h2>
              <p className="text-sm text-muted-foreground">{current.caption}</p>
            </div>
            <p className="text-xs text-muted-foreground tabular-nums">
              {progressValue}%
            </p>
          </div>
          <Progress value={progressValue} className="gap-0">
            <span className="sr-only">Kemajuan {progressValue} peratus</span>
          </Progress>
          <ol className="hidden gap-1 sm:grid sm:grid-cols-5">
            {STEPS.slice(1).map((item) => {
              const active = item.id === step || (step === 5 && item.id === 5);
              const done = item.id < step;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (item.id < step || (step === 5 && item.id <= 5)) {
                        goTo(item.id);
                      }
                    }}
                    className={`w-full rounded-lg px-2 py-1.5 text-left text-xs ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : done
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {step === 0 ? (
        <Intro
          hasSaved={hasSaved}
          onStart={startFresh}
          onResume={resume}
          onExample={applyExample}
        />
      ) : null}

      {step === 1 ? (
        <StepMasalah
          draft={draft}
          onChange={patchDraft}
          showErrors={showErrors}
        />
      ) : null}
      {step === 2 ? (
        <StepSasaran
          draft={draft}
          onChange={patchDraft}
          showErrors={showErrors}
        />
      ) : null}
      {step === 3 ? (
        <StepMenu draft={draft} onChange={patchDraft} showErrors={showErrors} />
      ) : null}
      {step === 4 ? (
        <StepSituasi
          draft={draft}
          onChange={patchDraft}
          showErrors={showErrors}
        />
      ) : null}
      {step === 5 ? (
        <StepHasil
          prompt={prompt || generated}
          draft={draft}
          onPromptChange={setPrompt}
          onRestart={restart}
        />
      ) : null}

      {step > 0 ? (
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="ghost" onClick={back} className="h-9 px-3">
            <ArrowLeftIcon data-icon="inline-start" />
            Kembali
          </Button>
          {step < 5 ? (
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              {showErrors && issues.length > 0 ? (
                <p className="text-xs text-destructive">{issues[0]}</p>
              ) : null}
              <Button type="button" onClick={next} className="h-9 px-3">
                {step === 4 ? (
                  <>
                    <WandSparklesIcon data-icon="inline-start" />
                    Jana prompt
                  </>
                ) : (
                  <>
                    Seterusnya
                    <ArrowRightIcon data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => goTo(4)}
              className="h-9 px-3"
            >
              Sunting borang
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}

function Intro({
  hasSaved,
  onStart,
  onResume,
  onExample,
}: {
  hasSaved: boolean;
  onStart: () => void;
  onResume: () => void;
  onExample: (id: string) => void;
}) {
  return (
    <div className="grid gap-8">
      <section className="grid gap-4">
        <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <SparklesIcon className="size-3.5" />
          Penjana prompt untuk bina aplikasi
        </p>
        <h1 className="font-heading max-w-xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Tulis niat anda. Kami susun menjadi prompt AI yang boleh dibina.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
          Isi masalah, sasaran pengguna, cadangan menu, dan lembaran situasi.
          PromptBina akan menukar jawapan itu kepada brief yang sedia ditampal
          ke Cursor, ChatGPT, atau Claude.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={onStart} className="h-10 px-4">
            Mula dari kosong
            <ArrowRightIcon data-icon="inline-end" />
          </Button>
          {hasSaved ? (
            <Button
              type="button"
              variant="outline"
              onClick={onResume}
              className="h-10 px-4"
            >
              Sambung draf tersimpan
            </Button>
          ) : null}
        </div>
      </section>

      <ol className="grid gap-3 sm:grid-cols-2">
        {[
          {
            n: "1",
            t: "Masalah",
            d: "Apa yang patah hari ini, siapa terjejas, dan mengapa perlu diselesaikan.",
          },
          {
            n: "2",
            t: "Sasaran pengguna",
            d: "Siapa yang akan guna, apa yang mereka mahu siap, dan hasil yang dijangka.",
          },
          {
            n: "3",
            t: "Cadangan menu",
            d: "Halaman yang pengguna akan buka: laman utama, rekod, laporan, tetapan.",
          },
          {
            n: "4",
            t: "Lembaran situasi",
            d: "Isi tempat kosong: nama, platform, bila, di mana, ciri wajib, dan kekangan.",
          },
        ].map((item) => (
          <li
            key={item.n}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <p className="text-xs font-medium text-primary">Langkah {item.n}</p>
            <p className="mt-1 font-medium">{item.t}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {item.d}
            </p>
          </li>
        ))}
      </ol>

      <section className="grid gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Atau mula dengan contoh</h2>
          <p className="text-sm text-muted-foreground">
            Contoh akan mengisi semua ruangan. Anda boleh sunting sebelum menjana prompt.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {examples.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => onExample(example.id)}
              className="rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <p className="font-medium">{example.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {example.blurb}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
