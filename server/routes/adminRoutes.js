import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'martins-portfolio-jwt-secret-key-replace-in-production-2026';

// -------------------------------------------------------------
// Authentication Routes
// -------------------------------------------------------------

// POST /api/admin/login
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
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials.',
      });
    }

    // Update lastLoginAt
    const now = new Date().toISOString();
    db.prepare('UPDATE users SET lastLoginAt = ?, updatedAt = ? WHERE id = ?').run(now, now, user.id);

    // Sign JWT token (24-hour expiration)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set secure httpOnly cookie (and also return in JSON for client flexibility)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        lastLoginAt: now,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({
      success: false,
      error: 'An unexpected error occurred during authentication.',
    });
  }
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// POST /api/admin/change-password - Secure password update for administrator
router.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password and new password are required.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters long.',
      });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found.' });
    }

    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect.',
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    const now = new Date().toISOString();

    db.prepare('UPDATE users SET passwordHash = ?, updatedAt = ? WHERE id = ?').run(newHash, now, user.id);

    res.json({
      success: true,
      message: 'Password successfully updated.',
    });
  } catch (err) {
    console.error('Password change error:', err);
    res.status(500).json({ success: false, error: 'Failed to update password.' });
  }
});

// GET /api/admin/me - Verify current session
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
      lastLoginAt: req.user.lastLoginAt,
    },
  });
});

// -------------------------------------------------------------
// Admin Dashboard Stats
// -------------------------------------------------------------

// GET /api/admin/stats - Real database metrics
router.get('/stats', requireAdmin, (req, res) => {
  try {
    const totalProjects = db.prepare('SELECT COUNT(*) as c FROM projects').get().c;
    const featuredProjects = db.prepare('SELECT COUNT(*) as c FROM projects WHERE featured = 1').get().c;
    const totalMessages = db.prepare('SELECT COUNT(*) as c FROM contact_messages').get().c;
    const unreadMessages = db.prepare("SELECT COUNT(*) as c FROM contact_messages WHERE status = 'unread'").get().c;
    const totalSkills = db.prepare('SELECT COUNT(*) as c FROM skills').get().c;

    const recentMessages = db.prepare(`
      SELECT id, name, email, subject, status, createdAt
      FROM contact_messages
      ORDER BY createdAt DESC
      LIMIT 5
    `).all();

    res.json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        totalMessages,
        unreadMessages,
        totalSkills,
        recentMessages,
      },
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, error: 'Could not calculate statistics.' });
  }
});

// -------------------------------------------------------------
// Contact Messages Management
// -------------------------------------------------------------

// GET /api/admin/messages
router.get('/messages', requireAdmin, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM contact_messages';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY createdAt DESC';
    const messages = db.prepare(query).all(...params);

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve messages.' });
  }
});

// PATCH /api/admin/messages/:id - Update status (read, unread, archived)
router.patch('/messages/:id', requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['unread', 'read', 'archived'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value.' });
    }

    const now = new Date().toISOString();
    const result = db.prepare(`
      UPDATE contact_messages
      SET status = ?, updatedAt = ?
      WHERE id = ?
    `).run(status, now, req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({
      success: true,
      message: `Message status updated to ${status}.`,
    });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ success: false, error: 'Failed to update message.' });
  }
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', requireAdmin, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM contact_messages WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ success: false, error: 'Failed to delete message.' });
  }
});

// -------------------------------------------------------------
// Projects Management
// -------------------------------------------------------------

// POST /api/admin/projects - Create a project
router.post('/projects', requireAdmin, (req, res) => {
  try {
    const { title, slug, description, detailedDescription, technologies, imageUrl, liveUrl, githubUrl, featured, displayOrder } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, error: 'Title and description are required.' });
    }

    const cleanSlug = (slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    const id = `prj_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    const techString = Array.isArray(technologies) ? JSON.stringify(technologies) : (technologies || '[]');

    db.prepare(`
      INSERT INTO projects (
        id, title, slug, description, detailedDescription, technologies,
        imageUrl, liveUrl, githubUrl, featured, displayOrder, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      cleanSlug,
      description.trim(),
      detailedDescription ? detailedDescription.trim() : null,
      techString,
      imageUrl || null,
      liveUrl || null,
      githubUrl || null,
      featured ? 1 : 0,
      displayOrder || 0,
      now,
      now
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully.',
      id,
    });
  } catch (err) {
    if (err.message && err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ success: false, error: 'A project with this slug already exists.' });
    }
    console.error('Error creating project:', err);
    res.status(500).json({ success: false, error: 'Failed to create project.' });
  }
});

// PATCH /api/admin/projects/:id - Edit a project
router.patch('/projects/:id', requireAdmin, (req, res) => {
  try {
    const { title, slug, description, detailedDescription, technologies, imageUrl, liveUrl, githubUrl, featured, displayOrder } = req.body;

    const existing = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }

    const now = new Date().toISOString();
    const updatedTitle = title !== undefined ? title.trim() : existing.title;
    const updatedSlug = slug !== undefined ? slug.trim() : existing.slug;
    const updatedDesc = description !== undefined ? description.trim() : existing.description;
    const updatedDetail = detailedDescription !== undefined ? detailedDescription : existing.detailedDescription;
    const updatedTech = technologies !== undefined
      ? (Array.isArray(technologies) ? JSON.stringify(technologies) : technologies)
      : existing.technologies;
    const updatedImage = imageUrl !== undefined ? imageUrl : existing.imageUrl;
    const updatedLive = liveUrl !== undefined ? liveUrl : existing.liveUrl;
    const updatedGithub = githubUrl !== undefined ? githubUrl : existing.githubUrl;
    const updatedFeatured = featured !== undefined ? (featured ? 1 : 0) : existing.featured;
    const updatedOrder = displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder;

    db.prepare(`
      UPDATE projects SET
        title = ?, slug = ?, description = ?, detailedDescription = ?,
        technologies = ?, imageUrl = ?, liveUrl = ?, githubUrl = ?,
        featured = ?, displayOrder = ?, updatedAt = ?
      WHERE id = ?
    `).run(
      updatedTitle,
      updatedSlug,
      updatedDesc,
      updatedDetail,
      updatedTech,
      updatedImage,
      updatedLive,
      updatedGithub,
      updatedFeatured,
      updatedOrder,
      now,
      req.params.id
    );

    res.json({ success: true, message: 'Project updated successfully.' });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ success: false, error: 'Failed to update project.' });
  }
});

// DELETE /api/admin/projects/:id
router.delete('/projects/:id', requireAdmin, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Project not found.' });
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ success: false, error: 'Failed to delete project.' });
  }
});

// -------------------------------------------------------------
// Skills Management
// -------------------------------------------------------------

// POST /api/admin/skills
router.post('/skills', requireAdmin, (req, res) => {
  try {
    const { name, category, level, note, displayOrder } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, error: 'Name and category are required.' });
    }

    const id = `skl_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO skills (id, name, category, level, note, displayOrder, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name.trim(),
      category.trim(),
      level ? level.trim() : 'Working Knowledge',
      note ? note.trim() : null,
      displayOrder || 0,
      now
    );

    res.status(201).json({ success: true, message: 'Skill added.', id });
  } catch (err) {
    console.error('Error creating skill:', err);
    res.status(500).json({ success: false, error: 'Failed to add skill.' });
  }
});

// PATCH /api/admin/skills/:id
router.patch('/skills/:id', requireAdmin, (req, res) => {
  try {
    const { name, category, level, note, displayOrder } = req.body;
    const existing = db.prepare('SELECT * FROM skills WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Skill not found.' });
    }

    db.prepare(`
      UPDATE skills SET
        name = ?, category = ?, level = ?, note = ?, displayOrder = ?
      WHERE id = ?
    `).run(
      name !== undefined ? name.trim() : existing.name,
      category !== undefined ? category.trim() : existing.category,
      level !== undefined ? level.trim() : existing.level,
      note !== undefined ? note.trim() : existing.note,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
      req.params.id
    );

    res.json({ success: true, message: 'Skill updated successfully.' });
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ success: false, error: 'Failed to update skill.' });
  }
});

// DELETE /api/admin/skills/:id
router.delete('/skills/:id', requireAdmin, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Skill not found.' });
    }
    res.json({ success: true, message: 'Skill deleted successfully.' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ success: false, error: 'Failed to delete skill.' });
  }
});

// -------------------------------------------------------------
// Experience Management
// -------------------------------------------------------------

// POST /api/admin/experience
router.post('/experience', requireAdmin, (req, res) => {
  try {
    const { title, organization, institution, description, startDate, endDate, contributions, skillsApplied, displayOrder } = req.body;

    if (!title || !organization || !description) {
      return res.status(400).json({ success: false, error: 'Title, organization, and description are required.' });
    }

    const id = `exp_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    const contribString = Array.isArray(contributions) ? JSON.stringify(contributions) : (contributions || '[]');
    const skillsString = Array.isArray(skillsApplied) ? JSON.stringify(skillsApplied) : (skillsApplied || '[]');

    db.prepare(`
      INSERT INTO experience (
        id, title, organization, institution, description,
        startDate, endDate, contributions, skillsApplied, displayOrder, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      title.trim(),
      organization.trim(),
      institution ? institution.trim() : null,
      description.trim(),
      startDate || null,
      endDate || null,
      contribString,
      skillsString,
      displayOrder || 0,
      now
    );

    res.status(201).json({ success: true, message: 'Experience record added.', id });
  } catch (err) {
    console.error('Error creating experience:', err);
    res.status(500).json({ success: false, error: 'Failed to add experience record.' });
  }
});

// PATCH /api/admin/experience/:id
router.patch('/experience/:id', requireAdmin, (req, res) => {
  try {
    const { title, organization, institution, description, startDate, endDate, contributions, skillsApplied, displayOrder } = req.body;
    const existing = db.prepare('SELECT * FROM experience WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Experience record not found.' });
    }

    const contribString = contributions !== undefined
      ? (Array.isArray(contributions) ? JSON.stringify(contributions) : contributions)
      : existing.contributions;
    const skillsString = skillsApplied !== undefined
      ? (Array.isArray(skillsApplied) ? JSON.stringify(skillsApplied) : skillsApplied)
      : existing.skillsApplied;

    db.prepare(`
      UPDATE experience SET
        title = ?, organization = ?, institution = ?, description = ?,
        startDate = ?, endDate = ?, contributions = ?, skillsApplied = ?,
        displayOrder = ?
      WHERE id = ?
    `).run(
      title !== undefined ? title.trim() : existing.title,
      organization !== undefined ? organization.trim() : existing.organization,
      institution !== undefined ? institution : existing.institution,
      description !== undefined ? description.trim() : existing.description,
      startDate !== undefined ? startDate : existing.startDate,
      endDate !== undefined ? endDate : existing.endDate,
      contribString,
      skillsString,
      displayOrder !== undefined ? parseInt(displayOrder, 10) : existing.displayOrder,
      req.params.id
    );

    res.json({ success: true, message: 'Experience record updated successfully.' });
  } catch (err) {
    console.error('Error updating experience:', err);
    res.status(500).json({ success: false, error: 'Failed to update experience record.' });
  }
});

// DELETE /api/admin/experience/:id
router.delete('/experience/:id', requireAdmin, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM experience WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Experience record not found.' });
    }
    res.json({ success: true, message: 'Experience record deleted successfully.' });
  } catch (err) {
    console.error('Error deleting experience:', err);
    res.status(500).json({ success: false, error: 'Failed to delete experience record.' });
  }
});

export default router;
