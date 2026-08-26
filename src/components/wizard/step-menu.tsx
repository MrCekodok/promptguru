"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MenuItem, PromptDraft } from "@/lib/types";

const SUGGESTIONS = [
  "Laman utama",
  "Tambah rekod",
  "Senarai",
  "Laporan",
  "Kalendar",
  "Tetapan",
  "Profil",
  "Carian",
];

export function StepMenu({
  draft,
  onChange,
  showErrors,
}: {
  draft: PromptDraft;
  onChange: (patch: Partial<PromptDraft>) => void;
  showErrors: boolean;
}) {
  const namedCount = draft.menuItems.filter((item) => item.name.trim()).length;
  const menuError = showErrors && namedCount < 2;

  function updateItem(id: string, patch: Partial<MenuItem>) {
    onChange({
      menuItems: draft.menuItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  }

  function addItem(name = "") {
    onChange({
      menuItems: [
        ...draft.menuItems,
        { id: crypto.randomUUID(), name, description: "" },
      ],
    });
  }

  function removeItem(id: string) {
    if (draft.menuItems.length <= 1) {
      updateItem(id, { name: "", description: "" });
      return;
    }
    onChange({
      menuItems: draft.menuItems.filter((item) => item.id !== id),
    });
  }

  function addSuggestion(name: string) {
    const exists = draft.menuItems.some(
      (item) => item.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (exists) return;
    const empty = draft.menuItems.find((item) => !item.name.trim());
    if (empty) {
      updateItem(empty.id, { name });
      return;
    }
    addItem(name);
  }

  return (
    <div className="grid gap-5">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Senaraikan menu yang pengguna akan nampak. Setiap menu akan menjadi
        halaman atau paparan dalam aplikasi nanti.
      </p>

      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => addSuggestion(name)}
            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/8"
          >
            + {name}
          </button>
        ))}
      </div>

      {menuError ? (
        <p className="text-xs text-destructive">
          Isi sekurang-kurangnya dua nama menu.
        </p>
      ) : null}

      <ol className="grid gap-3">
        {draft.menuItems.map((item, index) => (
          <li
            key={item.id}
            className="grid gap-2 rounded-xl border border-border bg-background p-3 sm:grid-cols-[2rem_1fr_auto] sm:items-start sm:gap-3"
          >
            <span className="mt-1.5 hidden size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary sm:inline-flex">
              {index + 1}
            </span>
            <div className="grid gap-2">
              <Input
                value={item.name}
                onChange={(event) =>
                  updateItem(item.id, { name: event.target.value })
                }
                placeholder={`Nama menu ${index + 1}, contoh: Laporan`}
                aria-label={`Nama menu ${index + 1}`}
                className="h-9 bg-card"
                aria-invalid={
                  menuError && !item.name.trim() ? true : undefined
                }
              />
              <Textarea
                value={item.description}
                onChange={(event) =>
                  updateItem(item.id, { description: event.target.value })
                }
                placeholder="Apa yang ada pada halaman ini? (pilihan)"
                aria-label={`Keterangan menu ${index + 1}`}
                className="min-h-16 bg-card"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="justify-self-end text-muted-foreground hover:text-destructive"
              onClick={() => removeItem(item.id)}
              aria-label={`Buang menu ${index + 1}`}
            >
              <Trash2Icon />
            </Button>
          </li>
        ))}
      </ol>

      <Button
        type="button"
        variant="outline"
        onClick={() => addItem()}
        className="w-fit"
      >
        <PlusIcon data-icon="inline-start" />
        Tambah menu
      </Button>
    </div>
  );
}
