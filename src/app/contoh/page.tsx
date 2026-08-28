import Link from "next/link";

import { demoApps } from "@/lib/demo-apps";

export const metadata = {
  title: "Halaman contoh — PromptBina",
};

export default function HalamanContohPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
        Halaman contoh
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
        Tiga aplikasi sekolah yang dibina daripada contoh PromptBina. Buka
        satu, cuba alirannya, kemudian kembali ke Jana prompt untuk salin
        brief.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {demoApps.map((app) => (
          <article
            key={app.id}
            className="flex flex-col overflow-hidden rounded-xl border border-[#d7e0ee] bg-white shadow-sm"
          >
            <div className={`h-1.5 ${app.accent}`} />
            <div className={`${app.soft} px-4 py-5`}>
              <p className="text-xs font-semibold tracking-wide uppercase">
                {app.name}
              </p>
              <div className="mt-3 rounded-lg border border-white/80 bg-white p-3 shadow-sm">
                <div className="mb-2 h-2 w-16 rounded bg-black/10" />
                <div className="space-y-1.5">
                  <div className="h-2 w-full rounded bg-black/10" />
                  <div className="h-2 w-4/5 rounded bg-black/10" />
                  <div className="h-8 rounded-md bg-black/5" />
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <h2 className="text-lg font-semibold tracking-tight">
                {app.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {app.blurb}
              </p>
              <p className="text-xs text-muted-foreground">{app.audience}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                <Link
                  href={app.href}
                  className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white"
                  style={{ color: "#fff" }}
                >
                  Papar Contoh
                </Link>
                <Link
                  href={`/?contoh=${app.contoh}`}
                  className="inline-flex h-10 items-center rounded-lg border border-border px-4 text-sm"
                >
                  Jana prompt
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
