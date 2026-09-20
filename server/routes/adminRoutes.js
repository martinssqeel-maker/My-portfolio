import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();

function generateId(prefix = '') {
  return `${prefix}${crypto.randomBytes(8).toString('hex')}`;
}

// -------------------------------------------------------------
// POST /api/admin/login
// -------------------------------------------------------------
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await db.get('SELECT * FROM users WHERE "email" = ?', [cleanEmail]);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    // Update last login
    const now = new Date().toISOString();
    await db.run('UPDATE users SET "lastLoginAt" = ?, "updatedAt" = ? WHERE "id" = ?', [now, now, user.id]);

    // Issue JWT
    const secret = process.env.JWT_SECRET || 'martins-portfolio-jwt-secret-key-replace-in-production-2026';
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      secret,
      { expiresIn: '7d' }
    );

    // Set secure HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'An internal error occurred during authentication.',
    });
  }
});

// -------------------------------------------------------------
// POST /api/admin/logout
// -------------------------------------------------------------
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// -------------------------------------------------------------
// GET /api/admin/me
// -------------------------------------------------------------
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      createdAt: req.user.createdAt,
      lastLoginAt: req.user.lastLoginAt,
    },
  });
});

// -------------------------------------------------------------
// POST /api/admin/change-password
// -------------------------------------------------------------
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are both required.',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long.',
      });
    }

    // Verify current user password
    const user = await db.get('SELECT * FROM users WHERE "id" = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      });
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect current password.',
      });
    }

    // Hash new password and persist
    const newHash = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();
    await db.run('UPDATE users SET "passwordHash" = ?, "updatedAt" = ? WHERE "id" = ?', [newHash, now, user.id]);

    res.json({
      success: true,
      message: 'Password successfully updated.',
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to update password at this time.',
    });
  }
});

// -------------------------------------------------------------
// GET /api/admin/stats
// -------------------------------------------------------------
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const totalProjectsRow = await db.get('SELECT COUNT(*) as c FROM projects');
    const featuredProjectsRow = await db.get('SELECT COUNT(*) as c FROM projects WHERE "featured" = 1');
    const totalMessagesRow = await db.get('SELECT COUNT(*) as c FROM contact_messages');
    const unreadMessagesRow = await db.get("SELECT COUNT(*) as c FROM contact_messages WHERE \"status\" = 'unread'");
    const totalSkillsRow = await db.get('SELECT COUNT(*) as c FROM skills');

    const recentMessages = await db.all(`
      SELECT "id", "name", "email", "subject", "status", "createdAt"
      FROM contact_messages
      ORDER BY "createdAt" DESC
      LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        totalProjects: parseInt(totalProjectsRow?.c || 0, 10),
        featuredProjects: parseInt(featuredProjectsRow?.c || 0, 10),
        totalMessages: parseInt(totalMessagesRow?.c || 0, 10),
        unreadMessages: parseInt(unreadMessagesRow?.c || 0, 10),
        totalSkills: parseInt(totalSkillsRow?.c || 0, 10),
        recentMessages,
      },
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to load dashboard statistics.',
    });
  }
});

// -------------------------------------------------------------
// Contact Messages Management
// -------------------------------------------------------------

// GET /api/admin/messages
router.get('/messages', requireAuth, async (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE "status" = ?';
      params.push(status);
    }

    query += ' ORDER BY "createdAt" DESC';

    const messages = await db.all(query, params);

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({
      success: false,
      error: 'Unable to retrieve messages.',
    });
  }
});

// PATCH /api/admin/messages/:id - update message status
router.patch('/messages/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['unread', 'read', 'archived', 'replied'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be unread, read, archived, or replied.',
      });
    }

    const now = new Date().toISOString();
    const result = await db.run(`
      UPDATE contact_messages
      SET "status" = ?, "updatedAt" = ?
      WHERE "id" = ?
    `, [status, now, req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found.',
      });
    }

    res.json({
      success: true,
      message: `Message marked as ${status}.`,
    });
  } catch (err) {
    console.error('Error updating message status:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update message status.',
    });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', requireAuth, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM contact_messages WHERE "id" = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Message not found.',
      });
    }

    res.json({
      success: true,
      message: 'Message permanently deleted.',
    });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message.',
    });
  }
});

// -------------------------------------------------------------
// Projects Management
// -------------------------------------------------------------

// POST /api/admin/projects
router.post('/projects', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      detailedDescription,
      technologies,
      imageUrl,
      liveUrl,
      githubUrl,
      featured,
      displayOrder,
    } = req.body;

    if (!title || !slug || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, slug, and description are required.',
      });
    }

    const id = generateId('prj_');
    const now = new Date().toISOString();
    const techs = Array.isArray(technologies) ? JSON.stringify(technologies) : JSON.stringify([technologies].filter(Boolean));

    await db.run(`
      INSERT INTO projects (
        "id", "title", "slug", "description", "detailedDescription", "technologies",
        "imageUrl", "liveUrl", "githubUrl", "featured", "displayOrder", "createdAt", "updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title.trim(),
      slug.trim().toLowerCase(),
      description.trim(),
      detailedDescription || '',
      techs,
      imageUrl || '',
      liveUrl || '',
      githubUrl || '',
      featured ? 1 : 0,
      parseInt(displayOrder || 0, 10),
      now,
      now,
    ]);

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      id,
    });
  } catch (err) {
    console.error('Error creating project:', err);
    if (err.message && err.message.includes('UNIQUE')) {
      return res.status(409).json({
        success: false,
        error: 'A project with this slug already exists.',
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create project.',
    });
  }
});

// PATCH /api/admin/projects/:id
router.patch('/projects/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM projects WHERE "id" = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Project not found.',
      });
    }

    const {
      title,
      slug,
      description,
      detailedDescription,
      technologies,
      imageUrl,
      liveUrl,
      githubUrl,
      featured,
      displayOrder,
    } = req.body;

    const now = new Date().toISOString();
    const techs = technologies !== undefined
      ? (Array.isArray(technologies) ? JSON.stringify(technologies) : JSON.stringify([technologies]))
      : existing.technologies;

    await db.run(`
      UPDATE projects SET
        "title" = ?,
        "slug" = ?,
        "description" = ?,
        "detailedDescription" = ?,
        "technologies" = ?,
        "imageUrl" = ?,
        "liveUrl" = ?,
        "githubUrl" = ?,
        "featured" = ?,
        "displayOrder" = ?,
        "updatedAt" = ?
      WHERE "id" = ?
    `, [
      title !== undefined ? title.trim() : existing.title,
      slug !== undefined ? slug.trim().toLowerCase() : existing.slug,
      description !== undefined ? description.trim() : existing.description,
      detailedDescription !== undefined ? detailedDescription : existing.detailedDescription,
      techs,
      imageUrl !== undefined ? imageUrl : existing.imageUrl,
      liveUrl !== undefined ? liveUrl : existing.liveUrl,
      githubUrl !== undefined ? githubUrl : existing.githubUrl,
      featured !== undefined ? (featured ? 1 : 0) : existing.featured,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
      now,
      req.params.id,
    ]);

    res.json({
      success: true,
      message: 'Project updated successfully.',
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update project.',
    });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', requireAdmin, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM projects WHERE "id" = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Project not found.',
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete project.',
    });
  }
});

// -------------------------------------------------------------
// Skills Management
// -------------------------------------------------------------

// POST /api/admin/skills
router.post('/skills', requireAdmin, async (req, res) => {
  try {
    const { name, category, level, note, displayOrder } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        error: 'Skill name and category are required.',
      });
    }

    const id = generateId('skl_');
    const now = new Date().toISOString();

    await db.run(`
      INSERT INTO skills ("id", "name", "category", "level", "note", "displayOrder", "createdAt")
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      name.trim(),
      category.trim(),
      level || 'Working Knowledge',
      note || '',
      parseInt(displayOrder || 0, 10),
      now,
    ]);

    res.status(201).json({
      success: true,
      message: 'Skill added successfully.',
      id,
    });
  } catch (err) {
    console.error('Error adding skill:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create skill.',
    });
  }
});

// PATCH /api/admin/skills/:id
router.patch('/skills/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM skills WHERE "id" = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found.',
      });
    }

    const { name, category, level, note, displayOrder } = req.body;

    await db.run(`
      UPDATE skills SET
        "name" = ?,
        "category" = ?,
        "level" = ?,
        "note" = ?,
        "displayOrder" = ?
      WHERE "id" = ?
    `, [
      name !== undefined ? name.trim() : existing.name,
      category !== undefined ? category.trim() : existing.category,
      level !== undefined ? level : existing.level,
      note !== undefined ? note : existing.note,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
      req.params.id,
    ]);

    res.json({
      success: true,
      message: 'Skill updated successfully.',
    });
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update skill.',
    });
  }
});

// DELETE /api/admin/skills/:id
router.delete('/skills/:id', requireAdmin, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM skills WHERE "id" = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Skill not found.',
      });
    }

    res.json({
      success: true,
      message: 'Skill deleted successfully.',
    });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete skill.',
    });
  }
});

// -------------------------------------------------------------
// Experience Management
// -------------------------------------------------------------

// POST /api/admin/experience
router.post('/experience', requireAdmin, async (req, res) => {
  try {
    const {
      title,
      organization,
      institution,
      description,
      startDate,
      endDate,
      contributions,
      skillsApplied,
      displayOrder,
    } = req.body;

    if (!title || !organization || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title, organization, and description are required.',
      });
    }

    const id = generateId('exp_');
    const now = new Date().toISOString();

    const contribs = Array.isArray(contributions) ? JSON.stringify(contributions) : '[]';
    const skills = Array.isArray(skillsApplied) ? JSON.stringify(skillsApplied) : '[]';

    await db.run(`
      INSERT INTO experience (
        "id", "title", "organization", "institution", "description",
        "startDate", "endDate", "contributions", "skillsApplied", "displayOrder", "createdAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      title.trim(),
      organization.trim(),
      institution || null,
      description.trim(),
      startDate || '',
      endDate || '',
      contribs,
      skills,
      parseInt(displayOrder || 0, 10),
      now,
    ]);

    res.status(201).json({
      success: true,
      message: 'Experience entry added.',
      id,
    });
  } catch (err) {
    console.error('Error adding experience:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create experience entry.',
    });
  }
});

// PATCH /api/admin/experience/:id
router.patch('/experience/:id', requireAdmin, async (req, res) => {
  try {
    const existing = await db.get('SELECT * FROM experience WHERE "id" = ?', [req.params.id]);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Experience entry not found.',
      });
    }

    const {
      title,
      organization,
      institution,
      description,
      startDate,
      endDate,
      contributions,
      skillsApplied,
      displayOrder,
    } = req.body;

    const contribs = contributions !== undefined
      ? (Array.isArray(contributions) ? JSON.stringify(contributions) : existing.contributions)
      : existing.contributions;

    const skills = skillsApplied !== undefined
      ? (Array.isArray(skillsApplied) ? JSON.stringify(skillsApplied) : existing.skillsApplied)
      : existing.skillsApplied;

    await db.run(`
      UPDATE experience SET
        "title" = ?,
        "organization" = ?,
        "institution" = ?,
        "description" = ?,
        "startDate" = ?,
        "endDate" = ?,
        "contributions" = ?,
        "skillsApplied" = ?,
        "displayOrder" = ?
      WHERE "id" = ?
    `, [
      title !== undefined ? title.trim() : existing.title,
      organization !== undefined ? organization.trim() : existing.organization,
      institution !== undefined ? institution : existing.institution,
      description !== undefined ? description.trim() : existing.description,
      startDate !== undefined ? startDate : existing.startDate,
      endDate !== undefined ? endDate : existing.endDate,
      contribs,
      skills,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
      req.params.id,
    ]);

    res.json({
      success: true,
      message: 'Experience entry updated.',
    });
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update experience entry.',
    });
  }
});

// DELETE /api/admin/experience/:id
router.delete('/experience/:id', requireAdmin, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM experience WHERE "id" = ?', [req.params.id]);

    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        error: 'Experience entry not found.',
      });
    }

    res.json({
      success: true,
      message: 'Experience entry deleted.',
    });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete experience entry.',
    });
  }
});

export default router;
