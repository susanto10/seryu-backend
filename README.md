# seryu-backend

`seryu-backend` is a RESTful API backend built with **Node.js**, **TypeScript**, and **Express**. This project provides endpoints related to truck driver salary calculations along with API documentation using Swagger UI.

## 🧱 Tech Stack

- **Node.js + Express**
- **TypeScript**
- **PostgreSQL** + **Knex**
- **Swagger UI** for API documentation
- **dotenv** for environment configuration
- **Nodemon** & **Concurrently** for development

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/seryu-backend.git
   cd seryu-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory with the following content:

   ```env
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/db_name
   ```

## 🔧 Useful Commands

| Command              | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`        | Run the server in watch mode (development)       |
| `npm run build`      | Compile TypeScript to JavaScript                 |
| `npm start`          | Run the server from the compiled output (`dist`) |
| `npm run db:migrate` | Run database migrations                          |
| `npm run db:seed`    | Run database seeders                             |

## 📁 Project Structure

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

## 📚 API Documentation

Swagger UI is available at:

```
http://localhost:3000/api-docs
```

## 🔌 Main Endpoints

- `GET /health` — Check server status
- `GET /api/v1/salary/...` — Salary-related endpoints (see Swagger docs for details)

## 🐞 Error Handling

This API includes a global error handler for:

- **404 Not Found**
- **500 Internal Server Error**
