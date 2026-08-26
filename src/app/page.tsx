import { PromptWizard } from "@/components/wizard/prompt-wizard";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-border/80 bg-card/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
              P
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">PromptBina</p>
              <p className="text-[0.7rem] text-muted-foreground">
                Prompt untuk membina aplikasi
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <PromptWizard />
      </main>

      <footer className="border-t border-border/80">
        <p className="mx-auto max-w-3xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          PromptBina tidak menghantar data ke pelayan. Draf disimpan pada
          pelayar anda sahaja.
        </p>
      </footer>
    </div>
  );
}
