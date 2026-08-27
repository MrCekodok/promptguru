"use client";

import type { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function AppFrame({
  name,
  tagline,
  accentClass,
  nav,
  active,
  onNav,
  children,
}: {
  name: string;
  tagline: string;
  accentClass: string;
  nav: { id: string; label: string }[];
  active: string;
  onNav: (id: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-[#f4f7fb]">
      <header className="sticky top-0 z-20 border-b border-[#d7e0ee] bg-white">
        <div className={cn("h-1", accentClass)} />
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <p className="text-sm font-semibold tracking-tight">{name}</p>
            <p className="truncate text-[0.7rem] tracking-wide text-[#5b6d86] uppercase">
              {tagline}
            </p>
          </div>
          <nav className="flex shrink-0 items-center gap-3 text-sm">
            <Link href="/aplikasi" className="text-[#1d4ed8] hover:underline">
              Semua aplikasi
            </Link>
            <Link href="/" className="text-[#5b6d86] hover:underline">
              PromptBina
            </Link>
          </nav>
        </div>
        <div className="mx-auto flex w-full max-w-4xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNav(item.id)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm whitespace-nowrap",
                active === item.id
                  ? cn("font-medium text-white", accentClass)
                  : "text-[#3d5273] hover:bg-[#eef3f9]"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-[#d7e0ee] bg-white p-4">
      <p className="text-xs tracking-wide text-[#5b6d86] uppercase">{label}</p>
      <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[#5b6d86]">{hint}</p> : null}
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-[#c5d4ea] bg-white px-4 py-6 text-sm text-[#3d5273]">
      {children}
    </p>
  );
}
