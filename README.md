# Martins — Full-Stack Personal Developer Portfolio & CMS

A complete, production-structured full-stack personal developer portfolio built for **Martins** (`martinssqeel-maker`). The application couples a modern frontend showcasing verified projects (Zapdata, Campus Marketplace, Fashion Lookbook) and practical SIWES training with an Express.js backend, a persistent SQLite database, and an authenticated administrative dashboard for content and message management.

---

## ⚡ System Architecture

```
[ Visitor / Admin Browser ]
            │
            ▼
    [ Vite Dev / Proxy ]  (Port 5173)
            │  (/api/*)
            ▼
  [ Express.js REST API ] (Port 5000)
    ├── Security: Helmet/CORS, Rate Limiting, Input Sanitization
    ├── Auth: bcrypt password hashing + signed JWT (24h)
    └── Database Driver: better-sqlite3 with WAL mode
            │
            ▼
 [ SQLite Persistent Database ] (data/portfolio.db)
    ├── users (admin credentials)
    ├── projects (portfolio applications)
    ├── contact_messages (visitor inquiries)
    ├── skills (verified technical stack)
    └── experience (SIWES & practical journey)
```

---

## 📦 Database Tables & Entities

| Table | Primary Key | Description | Key Fields |
|---|---|---|---|
| `users` | `id` (TEXT) | Administrative accounts | `email`, `passwordHash`, `role`, `createdAt`, `lastLoginAt` |
| `projects` | `id` (TEXT) | Real portfolio projects | `title`, `slug`, `description`, `detailedDescription`, `technologies`, `liveUrl`, `githubUrl`, `featured`, `displayOrder` |
| `contact_messages` | `id` (TEXT) | Real visitor inquiries | `name`, `email`, `subject`, `message`, `status` (`unread`/`read`/`archived`), `createdAt` |
| `skills` | `id` (TEXT) | Verified technical skills | `name`, `category`, `level`, `note`, `displayOrder` |
| `experience` | `id` (TEXT) | SIWES & practical journey | `title`, `organization`, `institution`, `description`, `startDate`, `endDate`, `contributions`, `skillsApplied` |

---

## 🔌 API Endpoints

### Public Endpoints
- `GET  /api/health` — API status and timestamp
- `GET  /api/projects` — Retrieve all projects sorted by display order
- `GET  /api/projects/:slug` — Retrieve single project details
- `GET  /api/skills` — Retrieve skills list and categorized grouping
- `GET  /api/experience` — Retrieve SIWES and practical journey records
- `POST /api/contact` — Submit a message (validated, trimmed, rate-limited, stored in SQLite)

### Protected Admin Endpoints (`Authorization: Bearer <token>`)
- `POST   /api/admin/login` — Authenticate admin, returns signed JWT
- `POST   /api/admin/logout` — Invalidate session
- `GET    /api/admin/me` — Verify current authenticated user profile
- `GET    /api/admin/stats` — Real database counts (projects, featured, total messages, unread)
- `GET    /api/admin/messages?status=all|unread|read|archived` — View inbox
- `PATCH  /api/admin/messages/:id` — Update message status (`unread`, `read`, `archived`)
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

## 🔐 Security Measures

1. **Password Hashing:** Passwords hashed with `bcryptjs` (salt rounds: 10). Plaintext passwords are never saved.
2. **JWT Authentication:** Tokens signed with secret key and set with 24-hour expiration.
3. **Role-Based Authorization:** `requireAdmin` middleware checks user role directly from database on every protected endpoint.
4. **Spam & Brute-Force Rate Limiting:**
   - Contact form limited to 10 submissions per 15 minutes per IP (`contactLimiter`).
   - Admin login limited to 10 attempts per 15 minutes per IP (`loginLimiter`).
5. **Duplicate Message Filtering:** Prevents repeated identical submissions from the same email within 60 seconds.
6. **Payload Size Limit:** JSON body parser capped at 1 MB to prevent memory exhaustion attacks.
7. **Clean Error Handling:** API never leaks internal database stack traces or SQL syntax errors to clients.

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Environment Configuration
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Default development credentials:
- **Email:** `martinssqeel@gmail.com`
- **Initial Password:** `ChangeMe2026!Secure`

### 3. Seed Database with Real Portfolio Data
```bash
npm run seed
```

### 4. Start Full-Stack Development Server
```bash
npm run dev
```
- **Backend API:** `http://localhost:5000`
- **Frontend App:** `http://localhost:5173` (with `/api` proxied to backend)

### 5. Accessing the Admin Console
- **Via UI:** Click the lock icon in the top navigation bar or the "Admin Console" link in the footer.
- **Via Keyboard:** Press `Ctrl + Shift + A` (or `Cmd + Shift + A` on Mac).
- **Via URL:** Navigate to `http://localhost:5173/#admin` or `/admin`.

---

## 🧪 Testing the Complete System

Run the automated integration test:
```bash
node -e "
import('./server/db/database.js').then(({ db }) => {
  console.log('Projects in DB:', db.prepare('SELECT count(*) as c FROM projects').get().c);
  console.log('Messages in DB:', db.prepare('SELECT count(*) as c FROM contact_messages').get().c);
  console.log('Admin user:', db.prepare('SELECT email FROM users').get().email);
});"
```
