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

type Status = "hadir" | "tidak-hadir" | "lewat" | "cuti";

type Student = { id: string; name: string };

type RecordRow = { date: string; studentId: string; status: Status };

type Store = {
  className: string;
  students: Student[];
  records: RecordRow[];
};

const STATUSES: { id: Status; label: string; className: string }[] = [
  { id: "hadir", label: "Hadir", className: "bg-emerald-100 text-emerald-800" },
  { id: "lewat", label: "Lewat", className: "bg-amber-100 text-amber-900" },
  { id: "cuti", label: "Cuti", className: "bg-sky-100 text-sky-900" },
  {
    id: "tidak-hadir",
    label: "Tidak hadir",
    className: "bg-rose-100 text-rose-800",
  },
];

function seed(): Store {
  const students: Student[] = [
    { id: "s1", name: "Ahmad Faiz" },
    { id: "s2", name: "Nur Aisyah" },
    { id: "s3", name: "Muhammad Harith" },
    { id: "s4", name: "Siti Zulaikha" },
    { id: "s5", name: "Adam Hakim" },
    { id: "s6", name: "Aina Sofea" },
    { id: "s7", name: "Iman Danish" },
    { id: "s8", name: "Puteri Balqis" },
    { id: "s9", name: "Rayyan Hakim" },
    { id: "s10", name: "Hana Maisarah" },
  ];
  const yesterday = shiftIso(todayIso(), -1);
  const yesterdayPattern: Status[] = [
    "hadir",
    "hadir",
    "lewat",
    "hadir",
    "hadir",
    "cuti",
    "hadir",
    "tidak-hadir",
    "hadir",
    "hadir",
  ];
  return {
    className: "4 Bestari",
    students,
    records: students.map((student, index) => ({
      date: yesterday,
      studentId: student.id,
      status: yesterdayPattern[index],
    })),
  };
}

const NAV = [
  { id: "utama", label: "Laman utama" },
  { id: "kehadiran", label: "Kehadiran" },
  { id: "murid", label: "Murid" },
  { id: "laporan", label: "Laporan" },
  { id: "tetapan", label: "Tetapan" },
];

export function HadirKuApp() {
  const [tab, setTab] = useState("utama");
  const [date, setDate] = useState(todayIso);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [store, setStore] = usePersistentState("hadirku-v1", seed);

  const marks = useMemo(() => {
    const map = new Map<string, Status>();
    for (const row of store.records) {
      if (row.date === date) map.set(row.studentId, row.status);
    }
    return map;
  }, [store.records, date]);

  function setStatus(studentId: string, status: Status) {
    setStore((current) => ({
      ...current,
      records: [
        ...current.records.filter(
          (row) => !(row.date === date && row.studentId === studentId)
        ),
        { date, studentId, status },
      ],
    }));
  }

  function addStudent() {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError("Tulis nama murid sekurang-kurangnya dua huruf.");
      return;
    }
    setStore((current) => ({
      ...current,
      students: [
        ...current.students,
        { id: `s-${Date.now()}`, name: trimmed },
      ],
    }));
    setName("");
    setError("");
  }

  const counts = {
    hadir: 0,
    lewat: 0,
    cuti: 0,
    "tidak-hadir": 0,
    belum: 0,
  };
  for (const student of store.students) {
    const status = marks.get(student.id);
    if (!status) counts.belum += 1;
    else counts[status] += 1;
  }

  const notices = store.students.filter((student) => {
    const status = marks.get(student.id);
    return status === "tidak-hadir" || status === "lewat";
  });

  return (
    <AppFrame
      name="HadirKu"
      tagline={`${store.className} · kehadiran kelas`}
      accentClass="bg-[#1d4ed8]"
      nav={NAV}
      active={tab}
      onNav={setTab}
    >
      {tab === "utama" ? (
        <div className="grid gap-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {formatMsDate(date)}
            </h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              {counts.belum > 0
                ? `${counts.belum} murid belum direkod. Tanda kehadiran sebelum tamat daftar masuk.`
                : "Semua murid sudah direkod untuk tarikh ini."}
            </p>
          </div>
          <label className="grid max-w-xs gap-1 text-sm">
            <span className="text-[#5b6d86]">Tarikh</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-9 rounded-lg border border-[#c5d4ea] px-2.5"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Hadir" value={counts.hadir} />
            <StatCard label="Lewat" value={counts.lewat} />
            <StatCard label="Tidak hadir" value={counts["tidak-hadir"]} />
            <StatCard label="Belum direkod" value={counts.belum} />
          </div>
          <section className="rounded-lg border border-[#d7e0ee] bg-white p-4">
            <h2 className="font-medium">Notis ibu bapa</h2>
            {notices.length === 0 ? (
              <p className="mt-2 text-sm text-[#5b6d86]">
                Tiada notis. Murid yang lewat atau tidak hadir akan muncul di
                sini pada hari itu juga.
              </p>
            ) : (
              <ul className="mt-3 grid gap-2">
                {notices.map((student) => (
                  <li
                    key={student.id}
                    className="rounded-md bg-[#fff7ed] px-3 py-2 text-sm"
                  >
                    <span className="font-medium">{student.name}</span>
                    {" — "}
                    {marks.get(student.id) === "lewat"
                      ? "lewat ke kelas."
                      : "tidak hadir hari ini."}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <button
            type="button"
            onClick={() => setTab("kehadiran")}
            className="h-10 w-fit rounded-lg bg-[#1d4ed8] px-4 text-sm font-medium text-white"
          >
            Rekod kehadiran
          </button>
        </div>
      ) : null}

      {tab === "kehadiran" ? (
        <div className="grid gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Tanda kehadiran
            </h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              {store.className} · {formatMsDate(date)}. Satu ketikan cukup.
            </p>
          </div>
          <label className="grid max-w-xs gap-1 text-sm">
            <span className="text-[#5b6d86]">Tarikh</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className="h-9 rounded-lg border border-[#c5d4ea] px-2.5"
            />
          </label>
          <ol className="grid gap-2">
            {store.students.map((student, index) => {
              const current = marks.get(student.id);
              return (
                <li
                  key={student.id}
                  className="rounded-lg border border-[#d7e0ee] bg-white p-3 sm:flex sm:items-center sm:justify-between sm:gap-3"
                >
                  <p className="mb-2 text-sm font-medium sm:mb-0">
                    {index + 1}. {student.name}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUSES.map((status) => (
                      <button
                        key={status.id}
                        type="button"
                        onClick={() => setStatus(student.id, status.id)}
                        className={cn(
                          "rounded-md px-2.5 py-1 text-xs",
                          current === status.id
                            ? status.className
                            : "bg-[#f4f7fb] text-[#3d5273]"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}

      {tab === "murid" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Senarai murid
          </h1>
          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              addStudent();
            }}
          >
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Nama murid baharu"
              aria-label="Nama murid baharu"
              className="h-10 flex-1 rounded-lg border border-[#c5d4ea] px-3"
            />
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#1d4ed8] px-4 text-sm font-medium text-white"
            >
              Tambah murid
            </button>
          </form>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          {store.students.length === 0 ? (
            <EmptyNote>Tiada murid lagi. Tambah nama pertama di atas.</EmptyNote>
          ) : (
            <ul className="grid gap-2">
              {store.students.map((student) => (
                <li
                  key={student.id}
                  className="flex items-center justify-between rounded-lg border border-[#d7e0ee] bg-white px-3 py-2 text-sm"
                >
                  <span>{student.name}</span>
                  <span className="text-[#5b6d86]">
                    {percentHadir(store.records, student.id)}% hadir
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "laporan" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Laporan kehadiran
          </h1>
          <p className="text-sm text-[#3d5273]">
            Peratus dikira daripada hari yang sudah direkod. Lewat dikira
            hadir. Cuti dan tidak hadir tidak dikira hadir.
          </p>
          {store.records.length === 0 ? (
            <EmptyNote>
              Belum ada rekod. Tanda kehadiran dahulu untuk nampak laporan.
            </EmptyNote>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#d7e0ee] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#eff4ff] text-[#3d5273]">
                  <tr>
                    <th className="px-3 py-2 font-medium">Murid</th>
                    <th className="px-3 py-2 font-medium">Hadir</th>
                    <th className="px-3 py-2 font-medium">Lewat</th>
                    <th className="px-3 py-2 font-medium">Tidak hadir</th>
                    <th className="px-3 py-2 font-medium">Peratus</th>
                  </tr>
                </thead>
                <tbody>
                  {store.students.map((student) => {
                    const rows = store.records.filter(
                      (row) => row.studentId === student.id
                    );
                    const hadir = rows.filter((row) => row.status === "hadir")
                      .length;
                    const lewat = rows.filter((row) => row.status === "lewat")
                      .length;
                    const absent = rows.filter(
                      (row) => row.status === "tidak-hadir"
                    ).length;
                    return (
                      <tr key={student.id} className="border-t border-[#e7eef6]">
                        <td className="px-3 py-2">{student.name}</td>
                        <td className="px-3 py-2">{hadir}</td>
                        <td className="px-3 py-2">{lewat}</td>
                        <td className="px-3 py-2">{absent}</td>
                        <td className="px-3 py-2 font-medium">
                          {percentHadir(store.records, student.id)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {tab === "tetapan" ? (
        <div className="grid max-w-md gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Tetapan</h1>
          <label className="grid gap-1 text-sm">
            <span>Nama kelas</span>
            <input
              value={store.className}
              onChange={(event) =>
                setStore((current) => ({
                  ...current,
                  className: event.target.value,
                }))
              }
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
            />
          </label>
          <p className="text-sm text-[#5b6d86]">
            Data disimpan pada pelayar ini sahaja. Tiada log masuk.
          </p>
          <button
            type="button"
            onClick={() => {
              setStore(seed());
              setDate(todayIso());
            }}
            className="h-10 w-fit rounded-lg border border-[#c5d4ea] bg-white px-4 text-sm"
          >
            Pulihkan data contoh
          </button>
        </div>
      ) : null}
    </AppFrame>
  );
}

function percentHadir(records: RecordRow[], studentId: string) {
  const rows = records.filter((row) => row.studentId === studentId);
  if (rows.length === 0) return 0;
  const present = rows.filter(
    (row) => row.status === "hadir" || row.status === "lewat"
  ).length;
  return Math.round((present / rows.length) * 100);
}
