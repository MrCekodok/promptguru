import { NextRequest, NextResponse } from "next/server";

import { draftFromFormData } from "@/lib/form-draft";
import { buildPrompt } from "@/lib/prompt-builder";

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/", request.url));
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const draft = draftFromFormData(formData);
  const prompt = buildPrompt(draft);
  const escaped = prompt
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  const title = (draft.namaAplikasi.trim() || "Prompt aplikasi")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  const html = `<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — PromptBina</title>
  <style>
    :root { color-scheme: light; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #f4f7fb; color: #12203a; }
    header { background: #fff; border-bottom: 1px solid #d7e0ee; }
    header .bar { height: 4px; background: #1d4ed8; }
    main, .wrap { max-width: 48rem; margin: 0 auto; padding: 1.25rem; }
    h1 { font-size: 1.5rem; margin: 0 0 .5rem; }
    p { line-height: 1.5; color: #3d5273; }
    .actions { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1rem 0; }
    button, a.btn { background: #1d4ed8; color: #fff; border: 0; border-radius: 8px; padding: .6rem 1rem; font-size: .95rem; cursor: pointer; text-decoration: none; display: inline-block; }
    a.btn.secondary { background: #fff; color: #1d4ed8; border: 1px solid #c5d4ea; }
    textarea { width: 100%; min-height: 28rem; box-sizing: border-box; font-family: ui-monospace, monospace; font-size: .85rem; line-height: 1.5; padding: .9rem; border: 1px solid #c5d4ea; border-radius: 8px; background: #fff; }
    .ok { color: #166534; font-weight: 600; }
  </style>
</head>
<body>
  <header>
    <div class="bar"></div>
    <div class="wrap">PromptBina</div>
  </header>
  <main>
    <h1>Prompt siap</h1>
    <p>Salin teks di bawah, kemudian tampal ke Cursor, ChatGPT, Claude, atau pembantu AI yang lain.</p>
    <div class="actions">
      <button type="button" id="salin">Salin prompt</button>
      <a class="btn secondary" href="/">Kembali ke borang</a>
    </div>
    <p id="status"></p>
    <textarea id="prompt" readonly>${escaped}</textarea>
  </main>
  <script>
    const button = document.getElementById("salin");
    const box = document.getElementById("prompt");
    const status = document.getElementById("status");
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(box.value);
        status.textContent = "Sudah disalin. Tampal ke aplikasi AI anda.";
        status.className = "ok";
      } catch {
        box.focus();
        box.select();
        status.textContent = "Teks sudah dipilih. Tekan Ctrl+C atau Cmd+C untuk salin.";
      }
    });
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
