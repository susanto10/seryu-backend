# seryu-backend

`seryu-backend` adalah RESTful API backend yang dibangun menggunakan **Node.js**, **TypeScript**, dan **Express**. Proyek ini menyediakan endpoint terkait perhitungan gaji supir serta dokumentasi API menggunakan Swagger UI.

## 🧱 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **PostgreSQL** + **Knex**
- **Swagger UI** untuk dokumentasi API
- **dotenv** untuk konfigurasi environment
- **Nodemon** & **Concurrently** untuk development

## 📦 Instalasi

1. **Clone repository**

   ```bash
   git clone https://github.com/your-username/seryu-backend.git
   cd seryu-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Konfigurasi environment**

   Buat file `.env` di root dengan isi seperti berikut:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name
   ```

## 🔧 Perintah Penting

| Perintah           | Deskripsi                                        |
|--------------------|--------------------------------------------------|
| `npm run dev`       | Menjalankan server dengan watch mode (development) |
| `npm run build`     | Compile TypeScript ke JavaScript                |
| `npm start`         | Menjalankan server dari hasil build (`dist`)     |
| `npm run db:migrate`| Menjalankan migrasi database                    |
| `npm run db:seed`   | Menjalankan seeder untuk database               |

## 📁 Struktur Folder

```
src/
├── api/
│   └── v1/
│       └── routes/
│           └── salaryRoutes.ts
├── config/
│   └── db.ts
├── scripts/
│   ├── migrate.ts
│   └── seed.ts
├── swagger/
│   └── (swagger config & spec)
└── server.ts
```

## 📚 Dokumentasi API

Swagger UI tersedia di:

```
http://localhost:3000/api-docs
```

## 🔌 Endpoint Utama

- `GET /health` — Mengecek status server
- `GET /api/v1/salary/...` — Endpoint terkait gaji supir (lihat dokumentasi Swagger untuk detail)

## 🐞 Error Handling

API ini memiliki error handler global untuk:

- **404 Not Found**
- **500 Internal Server Error**

## 📝 Lisensi

Proyek ini menggunakan lisensi **ISC**.
