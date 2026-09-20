import { db, initDatabase } from './database.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

function generateId(prefix = '') {
  return `${prefix}${crypto.randomBytes(8).toString('hex')}`;
}

export async function seed() {
  initDatabase();
  console.log('Seeding portfolio database with verified data...');

  const now = new Date().toISOString();

  // 1. Seed Administrator User
  const adminEmail = process.env.ADMIN_EMAIL || 'martinssqeel@gmail.com';
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'ChangeMe2026!Secure';
  const passwordHash = await bcrypt.hash(initialPassword, 10);

  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
  if (!existingAdmin) {
    const adminId = generateId('usr_');
    db.prepare(`
      INSERT INTO users (id, email, passwordHash, role, createdAt, updatedAt)
      VALUES (?, ?, ?, 'admin', ?, ?)
    `).run(adminId, adminEmail, passwordHash, now, now);
    console.log(`Admin user created: ${adminEmail}`);
  } else {
    console.log(`Admin user already exists: ${adminEmail}`);
  }

  // 2. Seed Real Projects
  const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get().count;
  if (projectCount === 0) {
    const insertProject = db.prepare(`
      INSERT INTO projects (
        id, title, slug, description, detailedDescription, technologies,
        imageUrl, liveUrl, githubUrl, featured, displayOrder, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Flagship Project 1: Zapdata
    insertProject.run(
      generateId('prj_'),
      'Zapdata — VTU & Airtime/Data-Selling Web Application',
      'zapdata',
      'A streamlined web platform for purchasing mobile data bundles and airtime across Nigerian telecom networks.',
      'Purchasing mobile data through slow USSD codes or bloated banking apps is cumbersome and frequently leads to failed transactions. Zapdata provides a clean, responsive purchase interface with carrier prefix auto-detection (MTN, Airtel, Glo, 9mobile), dynamic plan pricing, and instant top-up simulation.',
      JSON.stringify(['React', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / CSS3', 'LocalStorage API']),
      '/assets/projects/zapdata-preview.png',
      'https://zapdata.example.com', // [MANUAL ACTION REQUIRED: Provide live hosted URL if deployed]
      'https://github.com/martinssqeel-maker/zapdata',
      1, // featured
      1, // displayOrder
      now,
      now
    );

    // Project 2: Campus Marketplace
    insertProject.run(
      generateId('prj_'),
      'Campus Marketplace — Student Peer-to-Peer Exchange',
      'campus-marketplace',
      'A localized marketplace enabling university students to buy, sell, and exchange textbooks, dorm essentials, and calculators.',
      'University students constantly buy and sell textbooks, rechargeable fans, and calculators, but rely on chaotic WhatsApp class groups where listings get buried. Campus Marketplace provides an organized, searchable catalog of campus listings with category filters and direct click-to-chat WhatsApp communication.',
      JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'Responsive Design']),
      '/assets/projects/campus-market-preview.png',
      'https://campus-market.example.com', // [MANUAL ACTION REQUIRED: Provide live URL if deployed]
      'https://github.com/martinssqeel-maker/campus-marketplace',
      0,
      2,
      now,
      now
    );

    // Project 3: Fashion Web Showcase
    insertProject.run(
      generateId('prj_'),
      'Fashion & Apparel Web Showcase',
      'fashion-web',
      'A modern lookbook and apparel catalog designed for bespoke fashion collections and streetwear brands.',
      'Independent Nigerian fashion designers and streetwear brands need a modern, visually striking web showcase to present lookbook collections, fabric details, and sizing specifications without paying expensive SaaS fees.',
      JSON.stringify(['React', 'HTML5', 'CSS3', 'JavaScript']),
      '/assets/projects/fashion-web-preview.png',
      'https://fashion-showcase.example.com', // [MANUAL ACTION REQUIRED: Provide live URL if deployed]
      'https://github.com/martinssqeel-maker/fashion-web',
      0,
      3,
      now,
      now
    );

    console.log('Seeded 3 real projects (Zapdata, Campus Marketplace, Fashion Web Showcase).');
  }

  // 3. Seed Verified Skills
  const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get().count;
  if (skillCount === 0) {
    const insertSkill = db.prepare(`
      INSERT INTO skills (id, name, category, level, note, displayOrder, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const skillsData = [
      // Core Web Development
      { name: 'HTML5', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Semantic structure, accessible forms, meta tags', order: 1 },
      { name: 'CSS3', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Flexbox, CSS Grid, media queries, custom properties', order: 2 },
      { name: 'JavaScript (ES6+)', category: 'Core Web Development', level: 'Active Building', note: 'DOM manipulation, event listeners, fetch/async, arrays & objects', order: 3 },
      { name: 'Tailwind CSS', category: 'Core Web Development', level: 'Working Knowledge', note: 'Rapid utility styling, responsive layouts, consistent spacing', order: 4 },
      { name: 'Responsive Web Design', category: 'Core Web Development', level: 'Strong Working Knowledge', note: 'Mobile-first viewports, touch-friendly navigation', order: 5 },

      // Frameworks & Client Architecture
      { name: 'React', category: 'Frameworks & Client Architecture', level: 'Actively Building', note: 'Functional components, useState, useEffect, props flow', order: 6 },
      { name: 'Vite', category: 'Frameworks & Client Architecture', level: 'Working Knowledge', note: 'Fast build tooling, local dev server, module bundling', order: 7 },
      { name: 'Web APIs & Fetch', category: 'Frameworks & Client Architecture', level: 'Working Knowledge', note: 'Consuming JSON endpoints, handling loading & error states', order: 8 },

      // Programming & Foundations
      { name: 'Python', category: 'Programming & Foundations', level: 'Learning & Practicing', note: 'Core syntax, functions, basic data handling and scripts', order: 9 },
      { name: 'Problem Solving & Logic', category: 'Programming & Foundations', level: 'Active Practice', note: 'Conditionals, iterative loops, data formatting', order: 10 },

      // Developer Tools & Environment
      { name: 'VS Code', category: 'Developer Tools & Environment', level: 'Primary IDE', note: 'Extensions, debugging, integrated terminal, fast editing', order: 11 },
      { name: 'Git & GitHub', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'Repository tracking, commits, branches, pushing code', order: 12 },
      { name: 'Chrome DevTools', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'Inspecting elements, mobile emulation, console debugging', order: 13 },
      { name: 'Command Line / Bash', category: 'Developer Tools & Environment', level: 'Working Knowledge', note: 'CLI navigation, npm scripts, file operations', order: 14 }
    ];

    skillsData.forEach((s) => {
      insertSkill.run(generateId('skl_'), s.name, s.category, s.level, s.note, s.order, now);
    });
    console.log(`Seeded ${skillsData.length} verified technical skills.`);
  }

  // 4. Seed Verified Experience / SIWES
  const expCount = db.prepare('SELECT COUNT(*) as count FROM experience').get().count;
  if (expCount === 0) {
    const insertExp = db.prepare(`
      INSERT INTO experience (
        id, title, organization, institution, description,
        startDate, endDate, contributions, skillsApplied, displayOrder, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // SIWES Practical Training
    insertExp.run(
      generateId('exp_'),
      'Frontend Engineering Intern / SIWES Trainee',
      '[MANUAL ACTION REQUIRED: Your SIWES Company / IT Firm Name]',
      '[MANUAL ACTION REQUIRED: Your University / Polytechnic Name]',
      'Completed the Students Industrial Work Experience Scheme (SIWES) practical training, gaining direct hands-on experience working on real-world software tasks, user interface debugging, and collaborative development.',
      'SIWES Attachment Period',
      'Present',
      JSON.stringify([
        'Built and maintained responsive web layouts using semantic HTML5, modern CSS3, and JavaScript.',
        'Collaborated with senior developers to diagnose interface bugs and optimize viewport scaling for mobile devices.',
        'Applied Git version control fundamentals (branching, commits, pull requests) to manage daily codebase changes.',
        'Tested web pages across different mobile browsers to ensure consistent user experience under varying network speeds.'
      ]),
      JSON.stringify(['HTML5', 'CSS3', 'JavaScript', 'Git & GitHub', 'Responsive Design', 'Cross-Browser Testing']),
      1,
      now
    );

    // Product Development
    insertExp.run(
      generateId('exp_'),
      'Practical Product Developer',
      'Personal Software Projects (Zapdata & Campus Marketplace)',
      null,
      'Designed and implemented functional web applications from scratch, translating practical everyday user problems into working software products.',
      '2025',
      'Present',
      JSON.stringify([
        'Architected Zapdata, implementing telecom carrier prefix auto-detection and data bundle selection.',
        'Developed Campus Marketplace, structuring student category filters and direct WhatsApp seller communication.',
        'Practiced clean component structuring in React and rapid layout development with Tailwind CSS.'
      ]),
      JSON.stringify(['React', 'JavaScript', 'Tailwind CSS', 'UI Layouts', 'State Management']),
      2,
      now
    );

    // Academic & Foundations
    insertExp.run(
      generateId('exp_'),
      'Student & Self-Taught Developer',
      'Computer Science / Technical Studies',
      '[MANUAL ACTION REQUIRED: Your Institution Name]',
      'Building a solid academic and technical foundation in computational thinking, programming logic, and modern web development standards.',
      'Foundations',
      'Active',
      JSON.stringify([
        'Practicing Python programming for logic building, scripts, and algorithmic problem-solving.',
        'Studying software engineering fundamentals, database concepts, and internet protocols.',
        'Consistently tracking learning projects and version control on GitHub using VS Code.'
      ]),
      JSON.stringify(['Python', 'Algorithms & Logic', 'Web Fundamentals', 'VS Code', 'GitHub']),
      3,
      now
    );

    console.log('Seeded 3 verified experience records.');
  }

  // 5. Seed a test contact message so the inbox isn't empty in dev
  const msgCount = db.prepare('SELECT COUNT(*) as count FROM contact_messages').get().count;
  if (msgCount === 0) {
    db.prepare(`
      INSERT INTO contact_messages (id, name, email, subject, message, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      generateId('msg_'),
      'Tunde Balogun',
      'tunde@example.com',
      'Frontend Developer Collaboration',
      'Hi Martins, I saw your Zapdata VTU project and would like to speak regarding a web contract opportunity.',
      'unread',
      now,
      now
    );
    console.log('Seeded initial sample message for inbox testing.');
  }

  console.log('Database seeding complete.');
}

// Allow running directly via CLI `node server/db/seed.js`
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seed().then(() => process.exit(0)).catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
