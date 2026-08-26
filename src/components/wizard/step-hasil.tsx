"use client";

import { useRef, useState } from "react";
import { CheckIcon, CopyIcon, DownloadIcon } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { slugifyName } from "@/lib/prompt-builder";
import type { PromptDraft } from "@/lib/types";

export function StepHasil({
  prompt,
  draft,
}: {
  prompt: string;
  draft: PromptDraft;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState(prompt);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  async function copyPrompt() {
    const value = textareaRef.current?.value || text;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 2000);
      return;
    } catch {
      // fall through
    }
    const node = textareaRef.current;
    if (!node) {
      setCopyError("Sila pilih teks prompt dan tekan Ctrl+C atau Cmd+C.");
      return;
    }
    node.focus();
    node.select();
    const ok = document.execCommand("copy");
    if (ok) {
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyError("Sila pilih teks prompt dan tekan Ctrl+C atau Cmd+C.");
    }
  }

  function downloadPrompt() {
    const value = textareaRef.current?.value || text;
    const blob = new Blob([value], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugifyName(draft.namaAplikasi)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (!prompt.trim()) return null;

  return (
    <section
      id="bahagian-hasil"
      className="scroll-mt-24 rounded-lg border-2 border-primary bg-card p-4 shadow-sm sm:p-6"
    >
      <h2 className="font-heading text-2xl font-semibold tracking-tight">
        Prompt siap
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Salin teks ini, kemudian tampal ke Cursor, ChatGPT, Claude, atau
        pembantu AI yang lain untuk membina aplikasi.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" onClick={copyPrompt} className="h-10 px-4">
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
          className="h-10 px-4"
        >
          <DownloadIcon data-icon="inline-start" />
          Muat turun .md
        </Button>
        <a
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`}
          download={`${slugifyName(draft.namaAplikasi)}.txt`}
          className={cn(buttonVariants({ variant: "ghost" }), "h-10 px-4")}
        >
          Muat turun .txt
        </a>
      </div>

      {copyError ? (
        <p className="mt-2 text-xs text-destructive">{copyError}</p>
      ) : null}

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        aria-label="Prompt yang dijana"
        className="mt-4 min-h-[22rem] w-full resize-y rounded-lg border border-input bg-background p-3 font-mono text-[0.8rem] leading-relaxed text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </section>
  );
}
