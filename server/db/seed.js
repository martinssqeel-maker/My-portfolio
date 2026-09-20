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
      'Zapdata — VTU & Airtime/Data-Selling Web Application',
      'zapdata',
      'A streamlined web platform for purchasing mobile data bundles and airtime across Nigerian telecom networks.',
      'Purchasing mobile data through slow USSD codes or bloated banking apps is cumbersome and frequently leads to failed transactions. Zapdata provides a clean, responsive purchase interface with carrier prefix auto-detection (MTN, Airtel, Glo, 9mobile), dynamic plan pricing, and instant top-up simulation.',
      JSON.stringify(['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'LocalStorage API']),
      '/assets/projects/zapdata-preview.png',
      '', // [MANUAL ACTION REQUIRED: Provide live hosted URL when deployed]
      '', // [MANUAL ACTION REQUIRED: Provide repository URL when ready]
      1,  // featured
      1,  // displayOrder
      now,
      now,
    ]);

    // Project 2: Campus Marketplace
    await db.run(insertProjectSql, [
      generateId('prj_'),
      'Campus Marketplace — Student Peer-to-Peer Exchange',
      'campus-marketplace',
      'A localized marketplace enabling university students to buy, sell, and exchange textbooks, dorm essentials, and calculators.',
      'University students constantly buy and sell textbooks, rechargeable fans, and calculators, but rely on chaotic WhatsApp class groups where listings get buried. Campus Marketplace provides an organized, searchable catalog of campus listings with category filters and direct click-to-chat WhatsApp communication.',
      JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'Responsive Design']),
      '/assets/projects/campus-market-preview.png',
      '', // [MANUAL ACTION REQUIRED: Provide live URL when hosted]
      '', // [MANUAL ACTION REQUIRED: Provide repository URL when ready]
      0,  // featured
      2,  // displayOrder
      now,
      now,
    ]);

    // Project 3: Fashion Web Showcase
    await db.run(insertProjectSql, [
      generateId('prj_'),
      'Fashion & Apparel Web Showcase',
      'fashion-web',
      'A modern lookbook and apparel catalog designed for bespoke fashion collections and streetwear brands.',
      'Independent Nigerian fashion designers and streetwear brands need a modern, visually striking web showcase to present lookbook collections, fabric details, and sizing specifications without paying expensive SaaS fees.',
      JSON.stringify(['React', 'HTML5', 'CSS3', 'JavaScript']),
      '/assets/projects/fashion-web-preview.png',
      '', // [MANUAL ACTION REQUIRED: Provide live URL when hosted]
      '', // [MANUAL ACTION REQUIRED: Provide repository URL when ready]
      0,  // featured
      3,  // displayOrder
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

  // 4. Seed Verified Experience & Practical SIWES (only if table empty)
  const expCountRow = await db.get('SELECT COUNT(*) as count FROM experience');
  const expCount = parseInt(expCountRow?.count || 0, 10);
  if (expCount === 0) {
    const insertExpSql = `
      INSERT INTO experience (
        "id", "title", "organization", "institution", "description",
        "startDate", "endDate", "contributions", "skillsApplied", "displayOrder", "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // 1. SIWES Practical Attachment
    await db.run(insertExpSql, [
      generateId('exp_'),
      'Frontend Engineering Intern / SIWES Trainee',
      '[MANUAL ACTION REQUIRED: Your SIWES Company / IT Firm Name]',
      '[MANUAL ACTION REQUIRED: Your University / Polytechnic Name]',
      'Completed the Students Industrial Work Experience Scheme (SIWES) practical training, gaining direct hands-on experience working on real-world software tasks, user interface debugging, and collaborative development.',
      'Industrial Training Period',
      'Completed',
      JSON.stringify([
        'Built and maintained responsive web layouts using semantic HTML5, modern CSS3, and JavaScript.',
        'Collaborated with senior developers to diagnose interface bugs and optimize viewport scaling for mobile devices.',
        'Applied Git version control fundamentals (branching, commits, pull requests) to manage daily codebase changes.',
        'Tested web pages across different mobile browsers to ensure consistent user experience under varying network speeds.'
      ]),
      JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub', 'Responsive Design', 'Cross-Browser Testing']),
      1,
      now,
    ]);

    // 2. Personal Practical Products (Zapdata & Campus Marketplace)
    await db.run(insertExpSql, [
      generateId('exp_'),
      'Practical Product Developer',
      'Personal Software Projects (Zapdata & Campus Marketplace)',
      null,
      'Designed and implemented functional web applications from scratch, translating practical everyday user problems into working software products.',
      '2024',
      'Present',
      JSON.stringify([
        'Architected Zapdata, implementing telecom carrier prefix auto-detection and data bundle selection.',
        'Developed Campus Marketplace, structuring student category filters and direct WhatsApp seller communication.',
        'Practiced clean component structuring in React and rapid layout development with Tailwind CSS.'
      ]),
      JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'UI Layouts', 'State Management']),
      2,
      now,
    ]);

    // 3. Academic Foundations
    await db.run(insertExpSql, [
      generateId('exp_'),
      'Student & Self-Taught Developer',
      'Computer Science / Technical Studies',
      '[MANUAL ACTION REQUIRED: Higher Institution Name]',
      'Pursuing foundational computer science and technical coursework, reinforcing core programming logic, algorithms, and systematic software engineering principles.',
      'Undergraduate Studies',
      'In Progress',
      JSON.stringify([
        'Studied foundational computing principles, procedural logic, and web architecture.',
        'Actively practiced software fundamentals outside the lecture hall through daily hands-on coding and project building.',
        'Participated in peer technical discussions, code reviews, and academic team assignments.'
      ]),
      JSON.stringify(['Logic & Problem Solving', 'Web Architecture', 'Python Basics', 'Computer Science Fundamentals']),
      3,
      now,
    ]);

    console.log('[Database Seed] Verified experience timeline seeded.');
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
