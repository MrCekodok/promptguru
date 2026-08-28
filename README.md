# PromptBina

Aplikasi web untuk membantu pengguna menyusun **prompt AI** sebelum membina aplikasi lain.

Isi empat bahagian:

1. **Masalah** — apa yang patah hari ini
2. **Sasaran pengguna** — siapa yang akan guna dan apa yang mereka mahu capai
3. **Cadangan menu** — halaman atau laluan dalam aplikasi
4. **Lembaran situasi** — isi tempat kosong tentang nama, platform, masa, tempat, ciri wajib, dan kekangan

PromptBina menukar jawapan itu kepada brief yang sedia disalin ke Cursor, ChatGPT, Claude, atau pembantu AI yang lain.

Tiga aplikasi contoh ada di [Halaman contoh](/contoh):

- [HadirKu](/contoh/hadirku) — kehadiran kelas
- [BacaLaju](/contoh/bacalaju) — jurnal bacaan murid
- [DewanSlot](/contoh/dewanslot) — tempahan dewan sekolah

Jana prompt berlaku pada pelayar. Draf dan data aplikasi contoh disimpan pada `localStorage`. Tiada akaun. Jika JavaScript tidak berjalan, borang PromptBina dihantar ke halaman hasil pada aplikasi yang sama.

## Jalankan secara tempatan

Keperluan: Node.js 20 atau lebih baharu.

```bash
npm install
npm run dev
```

Buka [http://localhost:47281](http://localhost:47281).

## Skrip

| Perintah | Kegunaan |
| --- | --- |
| `npm run dev` | Pelayan pembangunan pada port 47281 |
| `npm run build` | Binaan pengeluaran |
| `npm run start` | Jalankan binaan pengeluaran |
| `npm run lint` | Semakan ESLint |

## Teknologi

Next.js, TypeScript, Tailwind CSS, dan shadcn/ui.
