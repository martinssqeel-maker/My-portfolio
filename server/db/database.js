import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure db directory or file path exists
const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/portfolio.db');
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database tables
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      lastLoginAt TEXT
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      detailedDescription TEXT,
      technologies TEXT NOT NULL,
      imageUrl TEXT,
      liveUrl TEXT,
      githubUrl TEXT,
      featured INTEGER DEFAULT 0,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT DEFAULT 'Portfolio Inquiry',
      message TEXT NOT NULL,
      status TEXT DEFAULT 'unread',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      level TEXT DEFAULT 'Working Knowledge',
      note TEXT,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS experience (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      institution TEXT,
      description TEXT NOT NULL,
      startDate TEXT,
      endDate TEXT,
      contributions TEXT,
      skillsApplied TEXT,
      displayOrder INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
    CREATE INDEX IF NOT EXISTS idx_projects_order ON projects(displayOrder);
    CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages(status);
    CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
    CREATE INDEX IF NOT EXISTS idx_experience_order ON experience(displayOrder);
  `);
}
