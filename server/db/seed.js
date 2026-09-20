import { db, initDatabase } from './database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function generateId(prefix = '') {
  return `${prefix}${crypto.randomBytes(8).toString('hex')}`;
}

export async function seed() {
  await initDatabase();
  console.log(`[Database Seed] Initializing with ${db.provider.toUpperCase()} provider...`);

  const now = new Date().toISOString();

  // 1. Seed Administrator User
  const adminEmail = process.env.ADMIN_EMAIL || 'martinssqeel@gmail.com';
  const initialPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe2026!Secure';
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  const existingAdmin = await db.get('SELECT "id" FROM users WHERE "email" = ?', [adminEmail]);
  if (!existingAdmin) {
    const adminId = generateId('usr_');
    await db.run(`
      INSERT INTO users ("id", "email", "passwordHash", "role", "createdAt", "updatedAt")
      VALUES (?, ?, ?, 'admin', ?, ?)
    `, [adminId, adminEmail, passwordHash, now, now]);
    console.log(`[Database Seed] Admin account initialized for: ${adminEmail}`);
  } else {
    console.log(`[Database Seed] Admin account verified: ${adminEmail}`);
  }

  // 2. Seed Real Projects (only if table empty)
  const projectCountRow = await db.get('SELECT COUNT(*) as count FROM projects');
  const projectCount = parseInt(projectCountRow?.count || 0, 10);
  if (projectCount === 0) {
    const insertProjectSql = `
      INSERT INTO projects (
        "id", "title", "slug", "description", "detailedDescription", "technologies",
        "imageUrl", "liveUrl", "githubUrl", "featured", "displayOrder", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Flagship Project 1: Zapdata
    await db.run(insertProjectSql, [
      generateId('prj_'),
      'Zapdata — VTU & Data Selling Platform',
      'zapdata',
      'A live web platform for purchasing mobile data bundles and airtime across Nigerian telecom networks.',
      'Purchasing mobile data through slow USSD codes or bloated banking apps is cumbersome and frequently leads to failed transactions. Zapdata provides a clean, responsive purchase interface with carrier prefix auto-detection (MTN, Airtel, Glo, 9mobile), dynamic plan pricing, and a seamless checkout experience — fully deployed for real users at zapdata.com.ng.',
      JSON.stringify(['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'LocalStorage API']),
      '/assets/projects/zapdata-preview.png',
      'https://www.zapdata.com.ng/',
      '',
      1,  // featured
      1,  // displayOrder
      now,
      now,
    ]);

    // Project 2: Suleman Fashion Store
    await db.run(insertProjectSql, [
      generateId('prj_'),
      'Suleman Fashion Store — E-Commerce Platform',
      'suleman-fashion',
      'A fully deployed e-commerce storefront for a fashion brand, built end-to-end as freelance client work.',
      'Independent fashion brands need a modern, conversion-ready web storefront to present collections, handle product browsing, and drive inquiries. Delivered Suleman Fashion Store as a polished e-commerce interface with product catalog browsing, collection presentation, and a mobile-first shopping experience — live on Netlify.',
      JSON.stringify(['React', 'HTML5', 'CSS3', 'JavaScript', 'Netlify']),
      '/assets/projects/fashion-web-preview.png',
      'https://helpful-lebkuchen-2ce9af.netlify.app/',
      '',
      0,  // featured
      2,  // displayOrder
      now,
      now,
    ]);

    console.log('[Database Seed] Verified real projects seeded.');
  }

  // 3. Seed Verified Skills (only if table empty)
  const skillCountRow = await db.get('SELECT COUNT(*) as count FROM skills');
  const skillCount = parseInt(skillCountRow?.count || 0, 10);
  if (skillCount === 0) {
    const insertSkillSql = `
      INSERT INTO skills ("id", "name", "category", "level", "note", "displayOrder", "createdAt")
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const verifiedSkills = [
      // Core Web
      { name: 'HTML5', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Semantic structure, accessible forms, meta tags', order: 1 },
      { name: 'CSS3', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Flexbox, CSS Grid, media queries, custom properties', order: 2 },
      { name: 'JavaScript (ES6+)', category: 'Core Web Development', level: 'Active Building', note: 'DOM manipulation, event listeners, fetch/async, arrays & objects', order: 3 },
      { name: 'Tailwind CSS', category: 'Core Web Development', level: 'Working Knowledge', note: 'Rapid utility styling, responsive layouts, consistent spacing', order: 4 },
      { name: 'Responsive Web Design', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Mobile-first viewports, touch-friendly navigation', order: 5 },

      // Frameworks & Architecture
      { name: 'React', category: 'Frameworks & Client Architecture', level: 'Actively Building', note: 'Functional components, useState, useEffect, props flow', order: 6 },
      { name: 'Vite', category: 'Frameworks & Client Architecture', level: 'Working Knowledge', note: 'Fast build tooling, local dev server, module bundling', order: 7 },
      { name: 'Web APIs & Fetch', category: 'Frameworks & Client Architecture', level: 'Working Knowledge', note: 'Consuming JSON endpoints, handling loading & error states', order: 8 },

      // Programming
      { name: 'Python', category: 'Programming & Foundations', level: 'Learning & Practicing', note: 'Core syntax, functions, basic data handling and scripts', order: 9 },
      { name: 'Problem Solving & Logic', category: 'Programming & Foundations', level: 'Active Practice', note: 'Conditionals, iterative loops, data formatting', order: 10 },

      // Tools
      { name: 'VS Code', category: 'Developer Tools & Environment', level: 'Primary IDE', note: 'Extensions, debugging, integrated terminal, fast editing', order: 11 },
      { name: 'Git & GitHub', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'Repository tracking, commits, branches, pushing code', order: 12 },
      { name: 'Chrome DevTools', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'Inspecting elements, mobile emulation, console debugging', order: 13 },
      { name: 'Command Line / Bash', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'CLI navigation, npm scripts, file operations', order: 14 },
    ];

    for (const skill of verifiedSkills) {
      await db.run(insertSkillSql, [
        generateId('skl_'),
        skill.name,
        skill.category,
        skill.level,
        skill.note,
        skill.order,
        now,
      ]);
    }
    console.log('[Database Seed] Verified skills catalog seeded.');
  }

  // 4. Seed Builder Journey experience (only if table empty)
  const expCountRow = await db.get('SELECT COUNT(*) as count FROM experience');
  const expCount = parseInt(expCountRow?.count || 0, 10);
  if (expCount === 0) {
    const insertExpSql = `
      INSERT INTO experience (
        "id", "title", "organization", "institution", "description",
        "startDate", "endDate", "contributions", "skillsApplied", "displayOrder", "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 1. Freelance Frontend Developer
    await db.run(insertExpSql, [
      generateId('exp_'),
      'Freelance Frontend Developer',
      'Independent Client & Product Work',
      null,
      'Delivering production frontend work for clients and personal products — from e-commerce storefronts to live VTU platforms — with a focus on responsive UI, clean React architecture, and shipped deployments.',
      '2024',
      'Present',
      JSON.stringify([
        'Built and shipped Suleman Fashion Store, a live e-commerce storefront for a fashion client.',
        'Created and maintain Zapdata, a production VTU and data-selling platform used by real customers.',
        'Delivered mobile-first interfaces with semantic HTML, modern CSS/Tailwind, and React components.',
        'Managed end-to-end delivery: design translation, implementation, deployment, and iteration.'
      ]),
      JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Netlify', 'Git & GitHub']),
      1,
      now,
    ]);

    // 2. Self-Directed Developer
    await db.run(insertExpSql, [
      generateId('exp_'),
      'Self-Directed Developer',
      'Continuous Building & Technical Growth',
      null,
      'Building a strong technical foundation through continuous project work, deliberate practice, and shipping real products rather than tutorial-only learning.',
      '2023',
      'Present',
      JSON.stringify([
        'Practiced modern frontend fundamentals daily: HTML, CSS, JavaScript, and React.',
        'Shipped multiple live products and prototypes to production hosting environments.',
        'Strengthened Git/GitHub workflow, debugging with DevTools, and component-driven architecture.',
        'Expanded problem-solving skills with Python scripting and algorithmic practice.'
      ]),
      JSON.stringify(['React', 'JavaScript', 'Python', 'VS Code', 'Git & GitHub', 'Chrome DevTools']),
      2,
      now,
    ]);

    console.log('[Database Seed] Verified builder journey experience seeded.');
  }

  // 5. Seed Initial Welcome Message (only if table empty)
  const msgCountRow = await db.get('SELECT COUNT(*) as count FROM contact_messages');
  const msgCount = parseInt(msgCountRow?.count || 0, 10);
  if (msgCount === 0) {
    await db.run(`
      INSERT INTO contact_messages ("id", "name", "email", "subject", "message", "status", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, ?, 'read', ?, ?)
    `, [
      generateId('msg_'),
      'System Notice',
      'system@martinsmoses.local',
      'Welcome to Martins Moses CMS',
      'Your full-stack portfolio and Content Management System are operational. Real incoming inquiries submitted via the Contact form will be stored here in PostgreSQL.',
      now,
      now,
    ]);
    console.log('[Database Seed] Welcome message created in CMS.');
  }

  console.log('[Database Seed] Seeding routine completed successfully.');
}

// Allow direct execution: node server/db/seed.js
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed()
    .then(() => {
      console.log('Seed execution finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed execution error:', err);
      process.exit(1);
    });
}
