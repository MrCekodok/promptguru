import { redirect } from "next/navigation";

import { PromptWizard } from "@/components/wizard/prompt-wizard";
import { examples } from "@/lib/examples";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ app?: string; contoh?: string }>;
}) {
  const { app, contoh } = await searchParams;

  if (app === "hadirku") redirect("/contoh/hadirku");
  if (app === "bacalaju") redirect("/contoh/bacalaju");
  if (app === "dewanslot") redirect("/contoh/dewanslot");

  const example = examples.find((item) => item.id === contoh);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10">
      <PromptWizard
        key={contoh ?? "kosong"}
        initialDraft={example?.draft}
        contohId={contoh}
      />
    </main>
  );
}
