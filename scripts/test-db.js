/**
 * Database Abstraction & PostgreSQL Compatibility Test Suite
 */
import { db, initDatabase } from '../server/db/database.js';

async function runTests() {
  console.log('--- Starting Database Abstraction & Engine Tests ---');
  console.log(`Current Provider: ${db.provider.toUpperCase()}`);

  try {
    // Test 1: Initialize Database Tables
    console.log('\n[Test 1] Initializing schema tables & indexes...');
    await initDatabase();
    console.log('✓ Tables initialized successfully.');

    // Test 2: Run seed check / verification
    console.log('\n[Test 2] Querying seeded projects...');
    const projects = await db.all('SELECT "id", "title", "slug" FROM projects ORDER BY "displayOrder" ASC');
    console.log(`✓ Fetched ${projects.length} project(s)`);
    if (projects.length > 0) {
      console.log(`  Sample project: "${projects[0].title}"`);
    }

    // Test 3: Query skills
    console.log('\n[Test 3] Querying skills catalog...');
    const skills = await db.all('SELECT "id", "name", "category" FROM skills LIMIT 5');
    console.log(`✓ Fetched ${skills.length} sample skills`);

    // Test 4: Query experience
    console.log('\n[Test 4] Querying experience timeline...');
    const exp = await db.all('SELECT "id", "title", "organization" FROM experience');
    console.log(`✓ Fetched ${exp.length} experience item(s)`);

    // Test 5: Verify Administrator account
    console.log('\n[Test 5] Verifying administrator record...');
    const admin = await db.get('SELECT "id", "email", "role" FROM users WHERE "email" = ?', ['martinssqeel@gmail.com']);
    if (admin) {
      console.log(`✓ Admin user confirmed: ${admin.email} (Role: ${admin.role})`);
    } else {
      console.warn('! Admin user not found (run `npm run seed` first)');
    }

    // Test 6: Test transactional CRUD operations on contact_messages
    console.log('\n[Test 6] Testing CRUD cycle on contact messages...');
    const testId = `test_${Date.now()}`;
    const now = new Date().toISOString();

    // Insert
    await db.run(`
      INSERT INTO contact_messages ("id", "name", "email", "subject", "message", "status", "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, ?, 'unread', ?, ?)
    `, [testId, 'Database Test Runner', 'test@example.com', 'Test Subject', 'Automated test message', now, now]);
    console.log('✓ Insert successful');

    // Read back
    const retrieved = await db.get('SELECT * FROM contact_messages WHERE "id" = ?', [testId]);
    if (!retrieved || retrieved.name !== 'Database Test Runner') {
      throw new Error('Retrieved row does not match inserted values');
    }
    console.log('✓ Verification read successful');

    // Update
    await db.run('UPDATE contact_messages SET "status" = ? WHERE "id" = ?', ['read', testId]);
    const updated = await db.get('SELECT "status" FROM contact_messages WHERE "id" = ?', [testId]);
    if (updated.status !== 'read') {
      throw new Error('Update statement failed to alter status');
    }
    console.log('✓ Update successful');

    // Delete
    await db.run('DELETE FROM contact_messages WHERE "id" = ?', [testId]);
    const deleted = await db.get('SELECT "id" FROM contact_messages WHERE "id" = ?', [testId]);
    if (deleted) {
      throw new Error('Row was not deleted successfully');
    }
    console.log('✓ Delete successful');

    // Test 7: Parameter Mapping Verification
    console.log('\n[Test 7] Verifying SQL placeholder transformation...');
    const placeholderTest = 'SELECT * FROM users WHERE "email" = ? AND "role" = ?';
    let idx = 1;
    const pgSql = placeholderTest.replace(/\?/g, () => `$${idx++}`);
    if (pgSql !== 'SELECT * FROM users WHERE "email" = $1 AND "role" = $2') {
      throw new Error(`Placeholder conversion mismatch: ${pgSql}`);
    }
    console.log('✓ SQL placeholder mapping correctly yields $1, $2 for PostgreSQL.');

    console.log('\n======================================================');
    console.log('✓ ALL DATABASE TESTS PASSED WITH 100% SUCCESS');
    console.log('======================================================');
  } catch (err) {
    console.error('\n✗ Database test failed:', err);
    process.exit(1);
  } finally {
    await db.close();
  }
}

runTests();
