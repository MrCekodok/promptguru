import { emptyDraft, type PromptDraft, type WizardStep } from "./types";

const KEY = "promptbina-draft-v1";

export type SavedSession = {
  draft: PromptDraft;
  step: WizardStep;
};

function isDraft(value: unknown): value is PromptDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as PromptDraft;
  return (
    typeof draft.masalah === "string" &&
    Array.isArray(draft.menuItems) &&
    Array.isArray(draft.ciriWajib)
  );
}

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeSession(onChange: () => void) {
  listeners.add(onChange);
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onChange);
  }
  return () => {
    listeners.delete(onChange);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onChange);
    }
  };
}

export function loadSession(): SavedSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedSession>;
    if (!isDraft(parsed.draft)) return null;
    const step = parsed.step;
    const safeStep: WizardStep =
      step === 0 ||
      step === 1 ||
      step === 2 ||
      step === 3 ||
      step === 4 ||
      step === 5
        ? step
        : 0;
    return { draft: { ...emptyDraft(), ...parsed.draft }, step: safeStep };
  } catch {
    return null;
  }
}

export function saveSession(session: SavedSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
    notify();
  } catch {
    // ignore quota errors
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  notify();
}

export function hasStoredSession() {
  if (typeof window === "undefined") return false;
  try {
    return Boolean(localStorage.getItem(KEY));
  } catch {
    return false;
  }
}
