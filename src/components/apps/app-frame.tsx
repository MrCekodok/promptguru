"use client";

import type { ReactNode } from "react";

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
      <div className="border-b border-[#d7e0ee] bg-white">
        <div className="mx-auto flex w-full max-w-4xl items-baseline justify-between gap-3 px-4 pt-3 sm:px-6">
          <p className="text-sm font-semibold tracking-tight">{name}</p>
          <p className="truncate text-xs text-[#5b6d86]">{tagline}</p>
        </div>
        <div className="mx-auto flex w-full max-w-4xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
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
      </div>
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
