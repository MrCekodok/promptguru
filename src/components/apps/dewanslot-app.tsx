"use client";

import { useMemo, useState } from "react";

import { AppFrame, EmptyNote, StatCard } from "@/components/apps/app-frame";
import {
  formatMsDate,
  shiftIso,
  todayIso,
  usePersistentState,
} from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";

type Status = "menunggu" | "lulus" | "tolak";

type Space = { id: string; name: string; note: string };

type Booking = {
  id: string;
  spaceId: string;
  date: string;
  start: string;
  end: string;
  purpose: string;
  people: number;
  requester: string;
  status: Status;
  note: string;
};

type Store = {
  spaces: Space[];
  bookings: Booking[];
  me: string;
};

const NAV = [
  { id: "kalendar", label: "Kalendar" },
  { id: "tempah", label: "Tempah" },
  { id: "saya", label: "Permohonan saya" },
  { id: "kelulusan", label: "Kelulusan" },
  { id: "ruang", label: "Ruang" },
];

const STATUS_LABEL: Record<Status, string> = {
  menunggu: "Menunggu",
  lulus: "Lulus",
  tolak: "Ditolak",
};

function seed(): Store {
  const today = todayIso();
  return {
    me: "Pn. Laila",
    spaces: [
      { id: "dewan", name: "Dewan Utama", note: "300 orang, pentas dan PA." },
      { id: "padang", name: "Padang", note: "Sukan dan perhimpunan." },
      { id: "muzik", name: "Bilik Muzik", note: "40 orang, piano." },
      {
        id: "makmal",
        name: "Makmal Komputer",
        note: "32 komputer, perlu kunci dari PK HEM.",
      },
    ],
    bookings: [
      {
        id: "k1",
        spaceId: "dewan",
        date: today,
        start: "08:00",
        end: "10:00",
        purpose: "Perhimpunan khas NILAM",
        people: 220,
        requester: "En. Hafiz",
        status: "lulus",
        note: "",
      },
      {
        id: "k2",
        spaceId: "padang",
        date: shiftIso(today, 1),
        start: "07:30",
        end: "09:00",
        purpose: "Latihan sukan tahunan",
        people: 80,
        requester: "Cik Sabrina",
        status: "lulus",
        note: "",
      },
      {
        id: "k3",
        spaceId: "dewan",
        date: shiftIso(today, 2),
        start: "14:00",
        end: "16:30",
        purpose: "Majlis anugerah kokurikulum",
        people: 180,
        requester: "Pn. Laila",
        status: "menunggu",
        note: "",
      },
    ],
  };
}

function overlaps(a: Booking, b: Booking) {
  if (a.spaceId !== b.spaceId || a.date !== b.date) return false;
  if (a.status === "tolak" || b.status === "tolak") return false;
  return a.start < b.end && b.start < a.end;
}

export function DewanSlotApp() {
  const [tab, setTab] = useState("kalendar");
  const [filter, setFilter] = useState("semua");
  const [store, setStore] = usePersistentState("dewanslot-v1", seed);
  const [form, setForm] = useState({
    spaceId: "dewan",
    date: todayIso(),
    start: "10:00",
    end: "12:00",
    purpose: "",
    people: "40",
  });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const spacesById = useMemo(() => {
    return new Map(store.spaces.map((space) => [space.id, space]));
  }, [store.spaces]);

  const upcoming = [...store.bookings].sort((a, b) =>
    `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)
  );

  const mine = upcoming.filter((row) => row.requester === store.me);
  const pending = upcoming.filter((row) => row.status === "menunggu");
  const visible = upcoming.filter(
    (row) => filter === "semua" || row.spaceId === filter
  );

  const clash = useMemo(() => {
    const draft: Booking = {
      id: "draft",
      spaceId: form.spaceId,
      date: form.date,
      start: form.start,
      end: form.end,
      purpose: form.purpose,
      people: Number(form.people) || 0,
      requester: store.me,
      status: "menunggu",
      note: "",
    };
    return store.bookings.filter((row) => overlaps(draft, row));
  }, [form, store.bookings, store.me]);

  function submitBooking() {
    if (form.purpose.trim().length < 4) {
      setError("Tulis tujuan tempahan.");
      setOk("");
      return;
    }
    if (form.end <= form.start) {
      setError("Masa tamat mesti selepas masa mula.");
      setOk("");
      return;
    }
    if (clash.some((row) => row.status === "lulus")) {
      setError(
        "Slot ini sudah diluluskan untuk program lain. Pilih masa atau ruang lain."
      );
      setOk("");
      return;
    }
    setStore((current) => ({
      ...current,
      bookings: [
        {
          id: `k-${Date.now()}`,
          spaceId: form.spaceId,
          date: form.date,
          start: form.start,
          end: form.end,
          purpose: form.purpose.trim(),
          people: Number(form.people) || 0,
          requester: current.me,
          status: "menunggu",
          note: "",
        },
        ...current.bookings,
      ],
    }));
    setError("");
    setOk("Permohonan dihantar. Menunggu kelulusan pentadbir.");
    setForm((current) => ({ ...current, purpose: "" }));
    setTab("saya");
  }

  function setStatus(id: string, status: Status, note = "") {
    setStore((current) => ({
      ...current,
      bookings: current.bookings.map((row) =>
        row.id === id ? { ...row, status, note } : row
      ),
    }));
  }

  return (
    <AppFrame
      name="DewanSlot"
      tagline="Papan kenyataan tempahan ruang"
      accentClass="bg-[#0f766e]"
      nav={NAV}
      active={tab}
      onNav={setTab}
    >
      {tab === "kalendar" ? (
        <div className="grid gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Kalendar</h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              Status berwarna: hijau lulus, kuning menunggu, merah ditolak.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Lulus"
              value={store.bookings.filter((row) => row.status === "lulus").length}
            />
            <StatCard label="Menunggu" value={pending.length} />
            <label className="rounded-lg border border-[#d7e0ee] bg-white p-4 text-sm">
              <span className="text-xs tracking-wide text-[#5b6d86] uppercase">
                Tapisan ruang
              </span>
              <select
                className="mt-2 h-9 w-full rounded-md border border-[#c5d4ea] px-2"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              >
                <option value="semua">Semua ruang</option>
                {store.spaces.map((space) => (
                  <option key={space.id} value={space.id}>
                    {space.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {visible.length === 0 ? (
            <EmptyNote>Tiada tempahan untuk tapisan ini.</EmptyNote>
          ) : (
            <ol className="grid gap-2">
              {visible.map((row) => (
                <BookingCard
                  key={row.id}
                  row={row}
                  space={spacesById.get(row.spaceId)?.name ?? row.spaceId}
                />
              ))}
            </ol>
          )}
        </div>
      ) : null}

      {tab === "tempah" ? (
        <form
          className="grid max-w-lg gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submitBooking();
          }}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Tempahan baharu
            </h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              Pemohon: {store.me}. Pertindihan dengan slot lulus akan ditahan.
            </p>
          </div>
          <label className="grid gap-1 text-sm">
            <span>Ruang</span>
            <select
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              value={form.spaceId}
              onChange={(event) =>
                setForm((current) => ({ ...current, spaceId: event.target.value }))
              }
            >
              {store.spaces.map((space) => (
                <option key={space.id} value={space.id}>
                  {space.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Tarikh</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) =>
                setForm((current) => ({ ...current, date: event.target.value }))
              }
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-sm">
              <span>Mula</span>
              <input
                type="time"
                value={form.start}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    start: event.target.value,
                  }))
                }
                className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              />
            </label>
            <label className="grid gap-1 text-sm">
              <span>Tamat</span>
              <input
                type="time"
                value={form.end}
                onChange={(event) =>
                  setForm((current) => ({ ...current, end: event.target.value }))
                }
                className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              />
            </label>
          </div>
          <label className="grid gap-1 text-sm">
            <span>Tujuan</span>
            <input
              value={form.purpose}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  purpose: event.target.value,
                }))
              }
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              placeholder="Contoh: Mesyuarat PIBG"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Bilangan peserta</span>
            <input
              type="number"
              min={1}
              value={form.people}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  people: event.target.value,
                }))
              }
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
            />
          </label>
          {clash.length > 0 ? (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">
              Ada {clash.length} tempahan pada slot yang sama.
              {clash.some((row) => row.status === "lulus")
                ? " Sekurang-kurangnya satu sudah diluluskan."
                : " Semuanya masih menunggu — pentadbir akan pilih satu."}
            </div>
          ) : null}
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          {ok ? <p className="text-sm text-emerald-700">{ok}</p> : null}
          <button
            type="submit"
            className="h-10 w-fit rounded-lg bg-[#0f766e] px-4 text-sm font-medium text-white"
          >
            Hantar tempahan
          </button>
        </form>
      ) : null}

      {tab === "saya" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Permohonan saya
          </h1>
          {mine.length === 0 ? (
            <EmptyNote>Anda belum menghantar tempahan.</EmptyNote>
          ) : (
            <ol className="grid gap-2">
              {mine.map((row) => (
                <BookingCard
                  key={row.id}
                  row={row}
                  space={spacesById.get(row.spaceId)?.name ?? row.spaceId}
                />
              ))}
            </ol>
          )}
        </div>
      ) : null}

      {tab === "kelulusan" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Kelulusan</h1>
          <p className="text-sm text-[#3d5273]">
            Untuk pentadbir. Lulus atau tolak dengan catatan ringkas.
          </p>
          {pending.length === 0 ? (
            <EmptyNote>Tiada permohonan menunggu.</EmptyNote>
          ) : (
            <ol className="grid gap-3">
              {pending.map((row) => (
                <li
                  key={row.id}
                  className="rounded-lg border border-[#d7e0ee] bg-white p-4"
                >
                  <BookingBody
                    row={row}
                    space={spacesById.get(row.spaceId)?.name ?? row.spaceId}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus(row.id, "lulus")}
                      className="h-9 rounded-md bg-[#0f766e] px-3 text-sm text-white"
                    >
                      Lulus
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setStatus(row.id, "tolak", "Slot bertindih / tidak sesuai.")
                      }
                      className="h-9 rounded-md border border-[#c5d4ea] px-3 text-sm"
                    >
                      Tolak
                    </button>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : null}

      {tab === "ruang" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Ruang</h1>
          <ul className="grid gap-3 sm:grid-cols-2">
            {store.spaces.map((space) => (
              <li
                key={space.id}
                className="rounded-lg border border-[#d7e0ee] bg-white p-4"
              >
                <p className="font-medium">{space.name}</p>
                <p className="mt-1 text-sm text-[#3d5273]">{space.note}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </AppFrame>
  );
}

function BookingCard({ row, space }: { row: Booking; space: string }) {
  return (
    <li className="rounded-lg border border-[#d7e0ee] bg-white p-4">
      <BookingBody row={row} space={space} />
    </li>
  );
}

function BookingBody({ row, space }: { row: Booking; space: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium">{row.purpose}</p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-xs",
            row.status === "lulus" && "bg-emerald-100 text-emerald-800",
            row.status === "menunggu" && "bg-amber-100 text-amber-900",
            row.status === "tolak" && "bg-rose-100 text-rose-800"
          )}
        >
          {STATUS_LABEL[row.status]}
        </span>
      </div>
      <p className="mt-1 text-sm text-[#3d5273]">
        {space} · {formatMsDate(row.date)} · {row.start}–{row.end} · {row.people}{" "}
        orang · {row.requester}
      </p>
      {row.note ? (
        <p className="mt-2 text-sm text-[#9a4a24]">{row.note}</p>
      ) : null}
    </div>
  );
}
