import Link from "next/link";
import { PromptWizard } from "@/components/wizard/prompt-wizard";
import { examples } from "@/lib/examples";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ contoh?: string }>;
}) {
  const { contoh } = await searchParams;
  const example = examples.find((item) => item.id === contoh);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-card/95 backdrop-blur">
        <div className="h-1 bg-primary" />
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-semibold tracking-tight text-primary-foreground">
              P
            </span>
            <div>
              <p className="text-sm font-semibold tracking-tight">PromptBina</p>
              <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
                Penjana brief aplikasi
              </p>
            </div>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
        <PromptWizard
          key={contoh ?? "kosong"}
          initialDraft={example?.draft}
          contohId={contoh}
        />
      </main>

      <footer className="border-t border-border bg-card">
        <p className="mx-auto max-w-3xl px-4 py-4 text-xs text-muted-foreground sm:px-6">
          PromptBina tidak menghantar data ke pelayan. Draf disimpan pada
          pelayar anda sahaja.
        </p>
      </footer>
    </div>
  );
}
