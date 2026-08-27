"use client";

import { useCallback, useSyncExternalStore } from "react";

const cache = new Map<string, unknown>();
const serverCache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function read<T>(key: string, initial: () => T): T {
  if (cache.has(key)) return cache.get(key) as T;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as T;
      cache.set(key, parsed);
      return parsed;
    }
  } catch {
    // keep seed
  }
  const fallback = initial();
  cache.set(key, fallback);
  return fallback;
}

function write<T>(key: string, value: T) {
  cache.set(key, value);
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota
  }
  emit(key);
}

export function usePersistentState<T>(key: string, initial: () => T) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(onChange);
      const onStorage = (event: StorageEvent) => {
        if (event.key !== key) return;
        cache.delete(key);
        onChange();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(onChange);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => read(key, initial), [key, initial]);
  const getServerSnapshot = useCallback(() => {
    if (!serverCache.has(key)) serverCache.set(key, initial());
    return serverCache.get(key) as T;
  }, [key, initial]);
  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (update: T | ((current: T) => T)) => {
      const current = read(key, initial);
      const next =
        typeof update === "function"
          ? (update as (current: T) => T)(current)
          : update;
      write(key, next);
    },
    [key, initial]
  );

  return [value, setValue] as const;
}

export function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatMsDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return new Intl.DateTimeFormat("ms-MY", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(year, month - 1, day));
}

export function shiftIso(iso: string, days: number) {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day + days);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

export function clearPersistent(key: string) {
  cache.delete(key);
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
  emit(key);
}
