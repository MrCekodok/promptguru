import { BacaLajuApp } from "@/components/apps/bacalaju-app";
import { DewanSlotApp } from "@/components/apps/dewanslot-app";
import { HadirKuApp } from "@/components/apps/hadirku-app";
import { SiteNav } from "@/components/site-nav";
import { PromptWizard } from "@/components/wizard/prompt-wizard";
import { examples } from "@/lib/examples";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; contoh?: string }>;
}) {
  const { app, contoh } = await searchParams;
  const showWizard = app === "bina" || Boolean(contoh);
  const active = showWizard
    ? "bina"
    : app === "bacalaju" || app === "dewanslot"
      ? app
      : "hadirku";
  const example = examples.find((item) => item.id === contoh);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteNav active={active} />
      {active === "hadirku" ? <HadirKuApp /> : null}
      {active === "bacalaju" ? <BacaLajuApp /> : null}
      {active === "dewanslot" ? <DewanSlotApp /> : null}
      {showWizard ? (
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
          <PromptWizard
            key={contoh ?? "kosong"}
            initialDraft={example?.draft}
            contohId={contoh}
          />
        </main>
      ) : null}
    </div>
  );
}
