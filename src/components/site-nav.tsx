import Link from "next/link";

const TABS = [
  { id: "hadirku", href: "/", label: "HadirKu" },
  { id: "bacalaju", href: "/?app=bacalaju", label: "BacaLaju" },
  { id: "dewanslot", href: "/?app=dewanslot", label: "DewanSlot" },
  { id: "bina", href: "/?app=bina", label: "Jana prompt" },
] as const;

export function SiteNav({ active }: { active: string }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        background: "#fff",
        borderBottom: "1px solid #d7e0ee",
      }}
    >
      <div style={{ height: 4, background: "#1d4ed8" }} />
      <div
        style={{
          maxWidth: "56rem",
          margin: "0 auto",
          padding: "0.75rem 1rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <strong>PromptBina</strong>
          <span
            style={{
              display: "block",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#5b6d86",
            }}
          >
            Aplikasi sekolah
          </span>
        </Link>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {TABS.map((tab) => {
            const current = tab.id === active;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                style={{
                  background: current ? "#1d4ed8" : "#eef3f9",
                  color: current ? "#fff" : "#12203a",
                  textDecoration: "none",
                  borderRadius: 8,
                  padding: "0.35rem 0.75rem",
                  fontSize: 14,
                  fontWeight: current ? 600 : 500,
                }}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
