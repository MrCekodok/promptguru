"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { slugifyName } from "@/lib/prompt-builder";
import type { PromptDraft } from "@/lib/types";

export function StepHasil({
  prompt,
  draft,
  onPromptChange,
  onRestart,
}: {
  prompt: string;
  draft: PromptDraft;
  onPromptChange: (value: string) => void;
  onRestart: () => void;
}) {
  const [copyState, setCopyState] = useState<{
    prompt: string;
    ok: boolean;
    error: string;
  } | null>(null);
  const copied = copyState?.prompt === prompt && copyState.ok;
  const copyError =
    copyState?.prompt === prompt && !copyState.ok ? copyState.error : "";

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopyState({ prompt, ok: true, error: "" });
      window.setTimeout(() => {
        setCopyState((current) =>
          current?.prompt === prompt && current.ok ? null : current
        );
      }, 2000);
    } catch {
      setCopyState({
        prompt,
        ok: false,
        error:
          "Tidak dapat menyalin secara automatik. Sila pilih teks dan salin sendiri.",
      });
    }
  }

  function downloadPrompt() {
    const blob = new Blob([prompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugifyName(draft.namaAplikasi)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!prompt.trim()) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Prompt belum dapat dijana. Kembali dan lengkapkan borang dahulu.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5">
      <div className="rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm leading-relaxed text-foreground">
        Prompt ini sudah disusun sebagai brief untuk AI (Cursor, ChatGPT, Claude,
        dan seumpamanya). Salin, kemudian tampal sebagai mesej pertama apabila
        anda minta AI membina aplikasi.
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={copyPrompt} className="h-9 px-3">
          {copied ? (
            <CheckIcon data-icon="inline-start" />
          ) : (
            <CopyIcon data-icon="inline-start" />
          )}
          {copied ? "Sudah disalin" : "Salin prompt"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={downloadPrompt}
          className="h-9 px-3"
        >
          <DownloadIcon data-icon="inline-start" />
          Muat turun .md
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={onRestart}
          className="h-9 px-3"
        >
          <RotateCcwIcon data-icon="inline-start" />
          Mula semula
        </Button>
      </div>

      {copyError ? (
        <p className="text-xs text-destructive">{copyError}</p>
      ) : null}

      <Textarea
        value={prompt}
        onChange={(event) => onPromptChange(event.target.value)}
        aria-label="Prompt yang dijana"
        className="min-h-[28rem] bg-background font-mono text-[0.8rem] leading-relaxed md:text-[0.8rem]"
      />

      <p className="text-xs text-muted-foreground">
        Anda boleh sunting prompt di atas sebelum menyalin. Perubahan ini tidak
        mengubah jawapan pada langkah sebelumnya.
      </p>
    </div>
  );
}
