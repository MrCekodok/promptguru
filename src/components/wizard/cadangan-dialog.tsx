"use client";

import { useEffect } from "react";

import type { PromptSuggestion } from "@/lib/suggestions";

export function CadanganDialog({
  open,
  suggestions,
  selected,
  onToggle,
  onToggleAll,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  suggestions: PromptSuggestion[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onCancel]);

  if (!open) return null;

  const allOn = suggestions.length > 0 && selected.size === suggestions.length;

  return (
    <div
      role="presentation"
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        background: "rgba(18, 32, 58, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cadangan-title"
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "36rem",
          maxHeight: "90vh",
          overflow: "auto",
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #d7e0ee",
          boxShadow: "0 16px 40px rgba(18, 32, 58, 0.18)",
        }}
      >
        <div style={{ padding: "1.25rem 1.25rem 0.75rem" }}>
          <h2
            id="cadangan-title"
            style={{ margin: 0, fontSize: "1.25rem", fontWeight: 650 }}
          >
            Cadangan penambahbaikan
          </h2>
          <p style={{ margin: "0.5rem 0 0", color: "#3d5273", lineHeight: 1.5 }}>
            Berdasarkan butiran borang. Tanda cadangan yang mahu dimasukkan ke
            dalam prompt.
          </p>
          <button
            type="button"
            onClick={onToggleAll}
            style={{
              marginTop: "0.75rem",
              background: "none",
              border: 0,
              padding: 0,
              color: "#1d4ed8",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            {allOn ? "Nyahpilih semua" : "Pilih semua"}
          </button>
        </div>

        {suggestions.length === 0 ? (
          <p style={{ padding: "0 1.25rem 1rem", color: "#3d5273" }}>
            Tiada cadangan tambahan. Anda boleh jana prompt seperti yang diisi.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: "0.25rem 1rem 1rem",
            }}
          >
            {suggestions.map((item) => {
              const checked = selected.has(item.id);
              return (
                <li key={item.id} style={{ margin: "0.35rem 0" }}>
                  <label
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "flex-start",
                      padding: "0.75rem",
                      borderRadius: 10,
                      border: checked
                        ? "1px solid #1d4ed8"
                        : "1px solid #d7e0ee",
                      background: checked ? "#eff4ff" : "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(item.id)}
                      style={{
                        width: "1.1rem",
                        height: "1.1rem",
                        marginTop: "0.15rem",
                        flexShrink: 0,
                      }}
                    />
                    <span>
                      <span
                        style={{
                          display: "block",
                          fontWeight: 600,
                          color: "#12203a",
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          display: "block",
                          marginTop: "0.2rem",
                          fontSize: "0.9rem",
                          color: "#3d5273",
                          lineHeight: 1.45,
                        }}
                      >
                        {item.detail}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem",
            justifyContent: "flex-end",
            padding: "0.85rem 1.25rem 1.25rem",
            borderTop: "1px solid #e7eef6",
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              height: 40,
              padding: "0 1rem",
              borderRadius: 8,
              border: "1px solid #c5d4ea",
              background: "#fff",
              color: "#12203a",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              height: 40,
              padding: "0 1rem",
              borderRadius: 8,
              border: 0,
              background: "#1d4ed8",
              color: "#fff",
              cursor: "pointer",
              font: "inherit",
              fontWeight: 600,
            }}
          >
            Jana prompt
            {selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
