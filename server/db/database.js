import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine database engine based on environment configuration
const rawDbUrl = (process.env.DATABASE_URL || '').trim();
const isPostgresUrl = rawDbUrl.startsWith('postgres://') || rawDbUrl.startsWith('postgresql://') || Boolean(process.env.PGHOST);

// Global connection state (cached for serverless execution)
let pgPool = null;
let sqliteDb = null;

/**
 * Returns a pooled PostgreSQL client instance
 */
function getPgPool() {
  if (!pgPool) {
    const isLocal = rawDbUrl.includes('localhost') || rawDbUrl.includes('127.0.0.1');
    const sslOption = process.env.DATABASE_SSL === 'false' || isLocal
      ? false
      : { rejectUnauthorized: false };

    pgPool = new Pool({
      connectionString: rawDbUrl,
      ssl: sslOption,
      max: process.env.PG_MAX_CONNECTIONS ? parseInt(process.env.PG_MAX_CONNECTIONS, 10) : 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pgPool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client pool:', err);
    });
  }
  return pgPool;
}

/**
 * Returns a SQLite connection instance (used for local dev / offline fallback)
 */
async function getSqliteDb() {
  if (!sqliteDb) {
    const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, '../../data/portfolio.db');
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const { default: Database } = await import('better-sqlite3');
    sqliteDb = new Database(dbPath);
    sqliteDb.pragma('journal_mode = WAL');
    sqliteDb.pragma('foreign_keys = ON');
  }
  return sqliteDb;
}

/**
 * Helper to convert standard '?' positional placeholders to PostgreSQL '$1, $2, ...'
 */
function convertPlaceholders(sql) {
  let paramIndex = 1;
  return sql.replace(/\?/g, () => `$${paramIndex++}`);
}

/**
 * Unified Database Abstraction Layer
 * Provides seamless async API across PostgreSQL and SQLite
 */
export const db = {
  get provider() {
    return isPostgresUrl ? 'postgres' : 'sqlite';
  },

  isPostgres() {
    return isPostgresUrl;
  },

  /**
   * Execute query and return full result metadata (rows and rowCount)
   */
  async query(sql, params = []) {
    if (isPostgresUrl) {
      const pool = getPgPool();
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return {
        rows: res.rows,
        rowCount: res.rowCount,
      };
    } else {
      const sDb = await getSqliteDb();
      const stmt = sDb.prepare(sql);
      const trimmed = sql.trim().toUpperCase();
      if (trimmed.startsWith('SELECT')) {
        const rows = stmt.all(...params);
        return { rows, rowCount: rows.length };
      } else {
        const res = stmt.run(...params);
        return { rows: [], rowCount: res.changes, changes: res.changes };
      }
    }
  },

  /**
   * Fetch a single row matching the query (or null)
   */
  async get(sql, params = []) {
    if (isPostgresUrl) {
      const pool = getPgPool();
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return res.rows[0] || null;
    } else {
      const sDb = await getSqliteDb();
      const stmt = sDb.prepare(sql);
      const row = stmt.get(...params);
      return row || null;
    }
  },

  /**
   * Fetch all rows matching the query
   */
  async all(sql, params = []) {
    if (isPostgresUrl) {
      const pool = getPgPool();
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return res.rows;
    } else {
      const sDb = await getSqliteDb();
      const stmt = sDb.prepare(sql);
      return stmt.all(...params);
    }
  },

  /**
   * Execute an INSERT, UPDATE, or DELETE statement
   */
  async run(sql, params = []) {
    if (isPostgresUrl) {
      const pool = getPgPool();
      const pgSql = convertPlaceholders(sql);
      const res = await pool.query(pgSql, params);
      return {
        changes: res.rowCount || 0,
        rowCount: res.rowCount || 0,
      };
    } else {
      const sDb = await getSqliteDb();
      const stmt = sDb.prepare(sql);
      const res = stmt.run(...params);
      return {
        changes: res.changes,
        rowCount: res.changes,
        lastInsertRowid: res.lastInsertRowid,
      };
    }
  },

  /**
   * Execute multi-statement SQL script (DDL schemas)
   */
  async exec(sql) {
    if (isPostgresUrl) {
      const pool = getPgPool();
      await pool.query(sql);
    } else {
      const sDb = await getSqliteDb();
      sDb.exec(sql);
    }
  },

  /**
   * Gracefully close connections
   */
  async close() {
    if (pgPool) {
      await pgPool.end();
      pgPool = null;
    }
    if (sqliteDb) {
      sqliteDb.close();
      sqliteDb = null;
    }
  },
};

/**
 * Initialize database tables and indexes (compatible with PostgreSQL and SQLite)
 */
export async function initDatabase() {
  const schemaSql = `
    CREATE TABLE IF NOT EXISTS users (
      "id" VARCHAR(255) PRIMARY KEY,
      "email" VARCHAR(255) UNIQUE NOT NULL,
      "passwordHash" TEXT NOT NULL,
      "role" VARCHAR(50) NOT NULL DEFAULT 'admin',
      "createdAt" VARCHAR(255) NOT NULL,
      "updatedAt" VARCHAR(255) NOT NULL,
      "lastLoginAt" VARCHAR(255)
    );

    CREATE TABLE IF NOT EXISTS projects (
      "id" VARCHAR(255) PRIMARY KEY,
      "title" VARCHAR(255) NOT NULL,
      "slug" VARCHAR(255) UNIQUE NOT NULL,
      "description" TEXT NOT NULL,
      "detailedDescription" TEXT,
      "technologies" TEXT NOT NULL,
      "imageUrl" TEXT,
      "liveUrl" TEXT,
      "githubUrl" TEXT,
      "featured" INTEGER DEFAULT 0,
      "displayOrder" INTEGER DEFAULT 0,
      "createdAt" VARCHAR(255) NOT NULL,
      "updatedAt" VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      "id" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "email" VARCHAR(255) NOT NULL,
      "subject" VARCHAR(255) DEFAULT 'Portfolio Inquiry',
      "message" TEXT NOT NULL,
      "status" VARCHAR(50) DEFAULT 'unread',
      "createdAt" VARCHAR(255) NOT NULL,
      "updatedAt" VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS skills (
      "id" VARCHAR(255) PRIMARY KEY,
      "name" VARCHAR(255) NOT NULL,
      "category" VARCHAR(100) NOT NULL,
      "level" VARCHAR(100) DEFAULT 'Working Knowledge',
      "note" TEXT,
      "displayOrder" INTEGER DEFAULT 0,
      "createdAt" VARCHAR(255) NOT NULL
    );

    CREATE TABLE IF NOT EXISTS experience (
      "id" VARCHAR(255) PRIMARY KEY,
      "title" VARCHAR(255) NOT NULL,
      "organization" VARCHAR(255) NOT NULL,
      "institution" VARCHAR(255),
      "description" TEXT NOT NULL,
      "startDate" VARCHAR(100),
      "endDate" VARCHAR(100),
      "contributions" TEXT,
      "skillsApplied" TEXT,
      "displayOrder" INTEGER DEFAULT 0,
      "createdAt" VARCHAR(255) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects("slug");
    CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("displayOrder");
    CREATE INDEX IF NOT EXISTS idx_messages_status ON contact_messages("status");
    CREATE INDEX IF NOT EXISTS idx_skills_category ON skills("category");
    CREATE INDEX IF NOT EXISTS idx_experience_order ON experience("displayOrder");
  `;

  await db.exec(schemaSql);
}
