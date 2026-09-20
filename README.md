# Martins Moses — Full-Stack Personal Developer Portfolio & CMS

A production-ready full-stack developer portfolio and Content Management System built for **Martins Moses** (`martinssqeel-maker`). The application couples a modern, mobile-responsive React frontend showcasing verified real-world projects (Zapdata, Campus Marketplace, Fashion Lookbook) and practical SIWES industrial training with a serverless-compatible Express.js API, PostgreSQL database abstraction (with SQLite fallback for local development), and an authenticated administrative CMS for real-time content and message management.

---

## ⚡ System Architecture

```
[ Visitor / Admin Browser / Mobile Phone ]
                    │
                    ▼
          [ Vercel Edge / CDN ]
        ┌───────────┴───────────┐
        ▼                       ▼
  [ Static Frontend ]     [ Serverless API ] (api/index.js)
   (React 19 + Vite)      (Express 5 + JWT + Rate Limiting)
                                │
                                ▼
                   [ PostgreSQL Database ]
               (Supabase / Neon / AWS RDS / Railway)
                  ├── users (admin credentials)
                  ├── projects (portfolio applications)
                  ├── contact_messages (visitor inquiries)
                  ├── skills (technical stack)
                  └── experience (SIWES & practical journey)
```

---

## 📦 Database Abstraction & PostgreSQL Compatibility

The database layer (`server/db/database.js`) provides a unified asynchronous abstraction supporting both cloud PostgreSQL and local SQLite:

- **Production (Vercel)**: Automatically activates when `DATABASE_URL` (starting with `postgres://` or `postgresql://`) is configured. Uses connection pooling (`pg.Pool`), SSL encryption, and parameterized queries (`$1, $2, ...`).
- **Development (Local / Offline)**: Seamlessly falls back to `better-sqlite3` when `DATABASE_URL` is unset or points to a local file.
- **Unified Query API**: `db.get()`, `db.all()`, `db.run()`, `db.exec()`, and `db.query()`.

### Tables & Entities

| Table | Primary Key | Description | Key Fields |
|---|---|---|---|
| `users` | `"id"` (VARCHAR) | Admin authentication | `"email"`, `"passwordHash"`, `"role"`, `"createdAt"`, `"lastLoginAt"` |
| `projects` | `"id"` (VARCHAR) | Real portfolio projects | `"title"`, `"slug"`, `"description"`, `"detailedDescription"`, `"technologies"`, `"liveUrl"`, `"githubUrl"`, `"featured"`, `"displayOrder"` |
| `contact_messages` | `"id"` (VARCHAR) | Real visitor inquiries | `"name"`, `"email"`, `"subject"`, `"message"`, `"status"` (`unread`/`read`/`archived`), `"createdAt"` |
| `skills` | `"id"` (VARCHAR) | Verified skills catalog | `"name"`, `"category"`, `"level"`, `"note"`, `"displayOrder"` |
| `experience` | `"id"` (VARCHAR) | SIWES & practical timeline | `"title"`, `"organization"`, `"institution"`, `"description"`, `"startDate"`, `"endDate"`, `"contributions"`, `"skillsApplied"` |

---

## 🔌 API Endpoints

### Public Endpoints
- `GET  /api/health` — API health check and timestamp
- `GET  /api/projects` — Retrieve all projects sorted by display order
- `GET  /api/projects/:slug` — Retrieve single project details
- `GET  /api/skills` — Retrieve skills list with categorized grouping
- `GET  /api/experience` — Retrieve SIWES and practical journey records
- `POST /api/contact` — Submit a message (validated, rate-limited, stored in database)

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
- `POST   /api/admin/login` — Authenticate admin, returns signed JWT
- `POST   /api/admin/logout` — Clear session
- `GET    /api/admin/me` — Verify current authenticated user profile
- `POST   /api/admin/change-password` — Change administrator password
- `GET    /api/admin/stats` — Real-time metrics (projects, messages, skills)
- `GET    /api/admin/messages?status=all|unread|read|archived` — View visitor messages
- `PATCH  /api/admin/messages/:id` — Update message status
- `DELETE /api/admin/messages/:id` — Delete message
- `POST   /api/admin/projects` — Create new project
- `PATCH  /api/admin/projects/:id` — Update existing project
- `DELETE /api/admin/projects/:id` — Delete project
- `POST   /api/admin/skills` — Add new skill
- `PATCH  /api/admin/skills/:id` — Update skill
- `DELETE /api/admin/skills/:id` — Delete skill
- `POST   /api/admin/experience` — Add experience/training record
- `PATCH  /api/admin/experience/:id` — Update experience record
- `DELETE /api/admin/experience/:id` — Delete experience record

---

## 🚀 Vercel Deployment Instructions

1. **Push your repository** to GitHub (`my portfolio`).
2. **Create a Free PostgreSQL Database**:
   - Go to [Supabase](https://supabase.com) or [Neon](https://neon.tech) and create a free project.
   - Copy the PostgreSQL connection string (`DATABASE_URL`).
3. **Deploy on Vercel**:
   - Log into Vercel and import your existing GitHub repository (`My-portfolio`).
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Configure Environment Variables in Vercel Project Settings**:
   - `DATABASE_URL`: Your Supabase/Neon PostgreSQL connection URI.
   - `DATABASE_SSL`: `true`
   - `JWT_SECRET`: A long random string (e.g. 64 characters).
   - `ADMIN_EMAIL`: `martinssqeel@gmail.com`
   - `ADMIN_PASSWORD`: Your private administrator password.
   - `NODE_ENV`: `production`
5. **Cold-Start Auto-Init**:
   - On the first API call, the serverless handler automatically runs `initDatabase()` and seeds default content into your PostgreSQL database.

---

## 🛠️ Local Development & Testing

```bash
# Install dependencies
npm install

# Run dev server (Express backend on 5000 + Vite on 5173 with proxy)
npm run dev

# Run comprehensive database abstraction test
npm run test:db

# Run full API and authentication test suite
npm run test:api

# Run linter
npm run lint

# Production build check
npm run build
```

---

## 👤 Portfolio Owner

- **Name**: Martins Moses
- **Positioning**: Frontend Developer & Practical Web Product Builder
- **GitHub**: [https://github.com/martinssqeel-maker](https://github.com/martinssqeel-maker)
- **Email**: [martinssqeel@gmail.com](mailto:martinssqeel@gmail.com)
