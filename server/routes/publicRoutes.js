import { Router } from 'express';
import { db } from '../db/database.js';
import { contactLimiter } from '../middleware/rateLimit.js';
import crypto from 'crypto';

const router = Router();

// GET /api/projects - Retrieve active projects
router.get('/projects', (req, res) => {
  try {
    const projects = db.prepare(`
      SELECT id, title, slug, description, detailedDescription, technologies,
             imageUrl, liveUrl, githubUrl, featured, displayOrder, createdAt
      FROM projects
      ORDER BY displayOrder ASC, createdAt DESC
    `).all();

    // Parse JSON technologies array
    const formatted = projects.map((p) => {
      let techs = [];
      try {
        techs = JSON.parse(p.technologies);
      } catch {
        techs = p.technologies ? p.technologies.split(',').map((t) => t.trim()) : [];
      }
      return {
        ...p,
        featured: Boolean(p.featured),
        technologies: techs,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve projects at this time.',
    });
  }
});

// GET /api/projects/:slug - Retrieve single project
router.get('/projects/:slug', (req, res) => {
  try {
    const project = db.prepare(`
      SELECT * FROM projects WHERE slug = ? OR id = ?
    `).get(req.params.slug, req.params.slug);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found.',
      });
    }

    let techs = [];
    try {
      techs = JSON.parse(project.technologies);
    } catch {
      techs = project.technologies ? project.technologies.split(',').map((t) => t.trim()) : [];
    }

    res.json({
      success: true,
      data: {
        ...project,
        featured: Boolean(project.featured),
        technologies: techs,
      },
    });
  } catch (err) {
    console.error('Error fetching project:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve project details.',
    });
  }
});

// GET /api/skills - Retrieve verified skills
router.get('/skills', (req, res) => {
  try {
    const skills = db.prepare(`
      SELECT id, name, category, level, note, displayOrder, createdAt
      FROM skills
      ORDER BY displayOrder ASC, name ASC
    `).all();

    // Group by category for convenience
    const grouped = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.json({
      success: true,
      data: skills,
      grouped,
    });
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve skills list.',
    });
  }
});

// GET /api/experience - Retrieve verified experience & SIWES
router.get('/experience', (req, res) => {
  try {
    const experiences = db.prepare(`
      SELECT id, title, organization, institution, description,
             startDate, endDate, contributions, skillsApplied, displayOrder, createdAt
      FROM experience
      ORDER BY displayOrder ASC, createdAt DESC
    `).all();

    const formatted = experiences.map((exp) => {
      let contributions = [];
      let skillsApplied = [];

      try {
        contributions = exp.contributions ? JSON.parse(exp.contributions) : [];
      } catch {
        contributions = [];
      }

      try {
        skillsApplied = exp.skillsApplied ? JSON.parse(exp.skillsApplied) : [];
      } catch {
        skillsApplied = [];
      }

      return {
        ...exp,
        contributions,
        skillsApplied,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (err) {
    console.error('Error fetching experience:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve experience timeline.',
    });
  }
});

// POST /api/contact - Real contact message submission with validation & rate limit
router.post('/contact', contactLimiter, (req, res) => {
  try {
    let { name, email, subject, message } = req.body;

    // 1. Validation & trimming
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, error: 'Name is required.' });
    }
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ success: false, error: 'Email address is required.' });
    }
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message content is required.' });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    subject = (subject && typeof subject === 'string') ? subject.trim() : 'Portfolio Inquiry';
    message = message.trim();

    // 2. Length limits
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ success: false, error: 'Name must be between 2 and 100 characters.' });
    }
    if (subject.length > 200) {
      return res.status(400).json({ success: false, error: 'Subject must not exceed 200 characters.' });
    }
    if (message.length < 5 || message.length > 5000) {
      return res.status(400).json({ success: false, error: 'Message must be between 5 and 5000 characters.' });
    }

    // 3. Email format regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // 4. Duplicate prevention (prevent identical message in last 60 seconds)
    const recentDuplicate = db.prepare(`
      SELECT id FROM contact_messages
      WHERE email = ? AND message = ? AND createdAt > datetime('now', '-1 minute')
    `).get(email, message);

    if (recentDuplicate) {
      return res.status(429).json({
        success: false,
        error: 'Duplicate message detected. Please wait before submitting again.',
      });
    }

    // 5. Store message in database
    const id = `msg_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO contact_messages (id, name, email, subject, message, status, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'unread', ?, ?)
    `).run(id, name, email, subject, message, now, now);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({
      success: false,
      error: 'Something went wrong while processing your message. Please try again.',
    });
  }
});

export default router;
