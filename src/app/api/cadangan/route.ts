import { NextResponse } from "next/server";

import { draftToBrief, sanitizeDraft } from "@/lib/draft-brief";
import { geminiApiKey, geminiModel } from "@/lib/gemini-env";
import type { PromptSuggestion } from "@/lib/suggestions";

const SYSTEM_PROMPT = `Anda penganalisis produk. Tugas anda: cadangkan idea TAMBAHAN untuk web app yang MERAWAT MASALAH yang pengguna tulis.

Keutamaan mutlak:
1. Baca "MASALAH UTAMA" dahulu. Setiap cadangan mesti menjawab masalah itu secara langsung.
2. Jangan beri nasihat UX generik (keadaan kosong, susun atur telefon, lorem ipsum, tanpa log masuk) melainkan ia jelas merawat masalah yang ditulis.
3. Jika idea tidak dapat dihubung dengan masalah pengguna dalam satu ayat, buang idea itu.
4. Gunakan butiran lain (menu, sasaran, kekangan) hanya sebagai konteks, bukan untuk menukar topik.

Peraturan:
- Bahasa Melayu, ayat pendek.
- 6 idea. Setiap idea khusus kepada masalah ini.
- Jangan ulang menu atau ciri wajib yang sudah ada.
- Hormati "di luar skop" dan kekangan.

Setiap idea:
- id: slug pendek
- title: 3–8 patah perkataan, berkaitan masalah
- detail: 1–2 ayat. Ayat pertama mesti nyatakan bagaimana idea ini merawat masalah pengguna.
- promptLine: SATU arahan bina yang merujuk masalah tersebut, sedia tampal ke prompt pembangun

Pulangkan JSON sahaja berbentuk {"suggestions":[...]}`;

function parseSuggestions(raw: unknown): PromptSuggestion[] {
  const list = Array.isArray(raw)
    ? raw
    : raw &&
        typeof raw === "object" &&
        Array.isArray((raw as { suggestions?: unknown }).suggestions)
      ? (raw as { suggestions: unknown[] }).suggestions
      : [];

  const seen = new Set<string>();
  const out: PromptSuggestion[] = [];

  for (const [index, item] of list.entries()) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const title = String(row.title ?? "").trim();
    const detail = String(row.detail ?? "").trim();
    const promptLine = String(row.promptLine ?? "").trim();
    if (!title || !detail || !promptLine) continue;
    const id =
      String(row.id ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9-]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 48) || `idea-${index + 1}`;
    const unique = seen.has(id) ? `${id}-${index + 1}` : id;
    seen.add(unique);
    out.push({
      id: unique,
      title: title.slice(0, 80),
      detail: detail.slice(0, 280),
      promptLine: promptLine.slice(0, 500),
    });
    if (out.length >= 8) break;
  }

  return out;
}

function extractText(payload: {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  error?: { message?: string };
}) {
  return (
    payload.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? "")
      .join("")
      .trim() ?? ""
  );
}

function friendlyGeminiError(message?: string) {
  const text = message?.trim() ?? "";
  if (/api key|api_key|permission|unauthenticated|invalid/i.test(text)) {
    return "Kunci Gemini tidak sah atau tidak dibenarkan. Semak GEMINI_API_KEY.";
  }
  if (/quota|billing|resource exhausted/i.test(text)) {
    return "Kuota Gemini sudah habis. Cuba semula kemudian.";
  }
  return text || "Gemini tidak dapat menganalisis borang sekarang.";
}

export async function POST(request: Request) {
  const apiKey = geminiApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Kunci Gemini belum disediakan." },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Borang tidak sah." }, { status: 400 });
  }

  const draft = sanitizeDraft(
    body && typeof body === "object"
      ? (body as { draft?: unknown }).draft ?? body
      : null
  );
  if (!draft) {
    return NextResponse.json({ error: "Borang tidak sah." }, { status: 400 });
  }

  const model = geminiModel();
  const brief = draftToBrief(draft);

  try {
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Cadangkan idea yang MERAWAT masalah utama di bawah. Jangan lari topik.\n\n${brief}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const payload = (await geminiResponse.json()) as {
      error?: { message?: string };
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };

    if (!geminiResponse.ok) {
      return NextResponse.json(
        { error: friendlyGeminiError(payload.error?.message) },
        { status: 502 }
      );
    }

    const content = extractText(payload);
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = null;
    }

    const suggestions = parseSuggestions(parsed);
    if (suggestions.length === 0) {
      return NextResponse.json(
        { error: "Gemini tidak memulangkan cadangan yang boleh digunakan." },
        { status: 502 }
      );
    }

    return NextResponse.json({ suggestions, source: "gemini" });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghubungi Gemini." },
      { status: 502 }
    );
  }
}
