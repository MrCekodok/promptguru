"use client";

import { useMemo, useState } from "react";

import { AppFrame, EmptyNote, StatCard } from "@/components/apps/app-frame";
import { todayIso, usePersistentState } from "@/lib/use-persistent-state";
import { cn } from "@/lib/utils";

type Book = {
  id: string;
  studentId: string;
  title: string;
  author: string;
  finishedOn: string;
  review: string;
};

type Student = { id: string; name: string };

type Store = {
  me: string;
  students: Student[];
  books: Book[];
};

const NAV = [
  { id: "saya", label: "Buku saya" },
  { id: "tambah", label: "Tambah bacaan" },
  { id: "kelas", label: "Kelas" },
  { id: "lencana", label: "Lencana" },
];

function seed(): Store {
  const students: Student[] = [
    { id: "m1", name: "Ahmad Faiz" },
    { id: "m2", name: "Nur Aisyah" },
    { id: "m3", name: "Muhammad Harith" },
    { id: "m4", name: "Siti Zulaikha" },
    { id: "m5", name: "Aina Sofea" },
  ];
  return {
    me: "m2",
    students,
    books: [
      {
        id: "b1",
        studentId: "m2",
        title: "Kisah Sang Kancil",
        author: "Cerita rakyat",
        finishedOn: shiftDays(-6),
        review: "Kancil bijak. Saya suka bahagian dia tipu buaya.",
      },
      {
        id: "b2",
        studentId: "m2",
        title: "Nenek Bestari",
        author: "Fatimah Busu",
        finishedOn: shiftDays(-2),
        review: "Nenek baik hati. Ayatnya mudah dibaca.",
      },
      {
        id: "b3",
        studentId: "m1",
        title: "Robot di Taman",
        author: "A. Samad Said",
        finishedOn: shiftDays(-4),
        review: "Robot tolong jaga taman. Lucu sikit.",
      },
      {
        id: "b4",
        studentId: "m4",
        title: "Bulan di Jendela",
        author: "Siti Hajar",
        finishedOn: shiftDays(-1),
        review: "Cerita tentang rindu nenek.",
      },
    ],
  };
}

function shiftDays(days: number) {
  const now = new Date();
  now.setDate(now.getDate() + days);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}

function badgeFor(count: number) {
  if (count >= 10) return { name: "Juara NILAM", detail: "10 buku" };
  if (count >= 5) return { name: "Pembaca Bintang", detail: "5 buku" };
  if (count >= 3) return { name: "Pembaca Rajin", detail: "3 buku" };
  return null;
}

export function BacaLajuApp() {
  const [tab, setTab] = useState("saya");
  const [store, setStore] = usePersistentState("bacalaju-v1", seed);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [finishedOn, setFinishedOn] = useState(todayIso());
  const [review, setReview] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const me = store.students.find((student) => student.id === store.me);
  const myBooks = store.books
    .filter((book) => book.studentId === store.me)
    .sort((a, b) => b.finishedOn.localeCompare(a.finishedOn));

  const classRows = useMemo(
    () =>
      store.students
        .map((student) => ({
          ...student,
          count: store.books.filter((book) => book.studentId === student.id)
            .length,
        }))
        .sort((a, b) => b.count - a.count),
    [store.books, store.students]
  );

  function addBook() {
    if (title.trim().length < 2) {
      setError("Isi tajuk buku.");
      setSaved(false);
      return;
    }
    if (author.trim().length < 2) {
      setError("Isi nama penulis atau tulis 'tidak diketahui'.");
      setSaved(false);
      return;
    }
    setStore((current) => ({
      ...current,
      books: [
        {
          id: `b-${Date.now()}`,
          studentId: current.me,
          title: title.trim(),
          author: author.trim(),
          finishedOn,
          review: review.trim(),
        },
        ...current.books,
      ],
    }));
    setTitle("");
    setAuthor("");
    setReview("");
    setFinishedOn(todayIso());
    setError("");
    setSaved(true);
    setTab("saya");
  }

  return (
    <AppFrame
      name="BacaLaju"
      tagline="Jurnal bacaan · 4 Bestari"
      accentClass="bg-[#c2410c]"
      nav={NAV}
      active={tab}
      onNav={setTab}
    >
      {tab === "saya" ? (
        <div className="grid gap-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Buku {me?.name ?? "saya"}
            </h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              {myBooks.length} buku sudah direkod. Sasaran kelas: 10 buku
              seminggu penggal.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Buku saya" value={myBooks.length} />
            <StatCard
              label="Lencana"
              value={badgeFor(myBooks.length)?.name ?? "Belum ada"}
              hint={
                myBooks.length < 3
                  ? `${3 - myBooks.length} lagi untuk Pembaca Rajin`
                  : undefined
              }
            />
            <label className="rounded-lg border border-[#d7e0ee] bg-white p-4 text-sm">
              <span className="text-xs tracking-wide text-[#5b6d86] uppercase">
                Saya login sebagai
              </span>
              <select
                className="mt-2 h-9 w-full rounded-md border border-[#c5d4ea] px-2"
                value={store.me}
                onChange={(event) =>
                  setStore((current) => ({ ...current, me: event.target.value }))
                }
              >
                {store.students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {myBooks.length === 0 ? (
            <EmptyNote>
              Belum ada buku. Tekan Tambah bacaan selepas selesai membaca.
            </EmptyNote>
          ) : (
            <ul className="grid gap-3">
              {myBooks.map((book) => (
                <li
                  key={book.id}
                  className="rounded-lg border border-[#f3d5c4] bg-[#fffaf6] p-4"
                >
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-[#9a4a24]">
                    {book.author} · siap {book.finishedOn}
                  </p>
                  {book.review ? (
                    <p className="mt-2 text-sm leading-relaxed text-[#3d5273]">
                      {book.review}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "tambah" ? (
        <form
          className="grid max-w-lg gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            addBook();
          }}
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Tambah bacaan
            </h1>
            <p className="mt-1 text-sm text-[#3d5273]">
              Empat ruangan sahaja. Ulasan cukup 1–3 ayat.
            </p>
          </div>
          <label className="grid gap-1 text-sm">
            <span>Tajuk buku</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              placeholder="Contoh: Kisah Sang Kancil"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Penulis</span>
            <input
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
              placeholder="Nama penulis"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Tarikh siap</span>
            <input
              type="date"
              value={finishedOn}
              onChange={(event) => setFinishedOn(event.target.value)}
              className="h-10 rounded-lg border border-[#c5d4ea] px-3"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Ulasan ringkas (pilihan)</span>
            <textarea
              value={review}
              onChange={(event) => setReview(event.target.value)}
              rows={4}
              className="rounded-lg border border-[#c5d4ea] px-3 py-2"
              placeholder="Apa yang kamu suka? Siapa watak utama?"
            />
          </label>
          {error ? <p className="text-sm text-rose-700">{error}</p> : null}
          {saved ? (
            <p className="text-sm text-emerald-700">
              Buku sudah disimpan dalam Buku saya.
            </p>
          ) : null}
          <button
            type="submit"
            className="h-10 w-fit rounded-lg bg-[#c2410c] px-4 text-sm font-medium text-white"
          >
            Simpan bacaan
          </button>
        </form>
      ) : null}

      {tab === "kelas" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">
            Kemajuan kelas
          </h1>
          <p className="text-sm text-[#3d5273]">
            Paparan guru. Murid yang belum ada buku kelihatan di bawah.
          </p>
          <ul className="grid gap-2">
            {classRows.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-[#d7e0ee] bg-white px-3 py-3"
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium">{row.name}</span>
                  <span>{row.count} buku</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f4e7dc]">
                  <div
                    className={cn(
                      "h-full rounded-full bg-[#c2410c]",
                      row.count === 0 && "bg-[#d7e0ee]"
                    )}
                    style={{ width: `${Math.min(100, row.count * 10)}%` }}
                  />
                </div>
                {row.count === 0 ? (
                  <p className="mt-2 text-xs text-[#9a4a24]">
                    Belum ada rekod — perlu diingatkan.
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {tab === "lencana" ? (
        <div className="grid gap-4">
          <h1 className="text-2xl font-semibold tracking-tight">Lencana</h1>
          <p className="text-sm text-[#3d5273]">
            Ganjaran kecil mengikut bilangan buku, bukan halaman.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { n: 3, name: "Pembaca Rajin" },
              { n: 5, name: "Pembaca Bintang" },
              { n: 10, name: "Juara NILAM" },
            ].map((item) => {
              const unlocked = myBooks.length >= item.n;
              return (
                <div
                  key={item.n}
                  className={cn(
                    "rounded-lg border p-4",
                    unlocked
                      ? "border-[#f3d5c4] bg-[#fff4ed]"
                      : "border-[#d7e0ee] bg-white opacity-70"
                  )}
                >
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="mt-1 text-xs text-[#5b6d86]">{item.n} buku</p>
                  <p className="mt-2 text-sm">
                    {unlocked ? "Sudah dibuka" : "Belum dibuka"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </AppFrame>
  );
}
