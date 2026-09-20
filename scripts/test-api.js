/**
 * Comprehensive API Test Suite
 * Tests all public routes, admin authentication, password change, and CMS endpoints.
 */

const BASE_URL = 'http://127.0.0.1:5173';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const { headers = {}, ...rest } = options;
  const res = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function run() {
  console.log('--- Commencing Full-Stack API Test Suite ---');
  let failures = 0;

  function assert(condition, message, detail = '') {
    if (condition) {
      console.log(`✓ ${message}`);
    } else {
      console.error(`✗ FAILED: ${message}${detail ? ` (${JSON.stringify(detail)})` : ''}`);
      failures++;
    }
  }

  try {
    // 1. Health check
    const health = await request('/api/health');
    assert(health.status === 200 && health.data.status === 'healthy', 'GET /api/health returned healthy status', health.data);

    // 2. Public Projects
    const projects = await request('/api/projects');
    assert(projects.status === 200 && Array.isArray(projects.data.data), 'GET /api/projects returns active project list');
    assert(projects.data.data.some(p => p.slug === 'zapdata'), 'Projects catalog includes Zapdata');

    // 3. Public Skills
    const skills = await request('/api/skills');
    assert(skills.status === 200 && skills.data.data.length > 0, `GET /api/skills returns verified skills (${skills.data.data?.length || 0})`);

    // 4. Public Experience
    const exp = await request('/api/experience');
    assert(exp.status === 200 && exp.data.data.length > 0, `GET /api/experience returns experience timeline (${exp.data.data?.length || 0})`);

    // 5. Contact submission
    const contactRes = await request('/api/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Automated Tester',
        email: `test.runner.${Date.now()}@example.com`,
        subject: 'API Verification Inquiry',
        message: 'This is an automated verification message ensuring the contact pipeline works end to end.',
      }),
    });
    assert(contactRes.status === 201 && contactRes.data.success === true, 'POST /api/contact successfully saves messages to DB', contactRes.data);

    // 6. Admin Login with invalid credentials (should fail with 401)
    const badLogin = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'martinssqeel@gmail.com',
        password: 'IncorrectPasswordAttempt',
      }),
    });
    assert(badLogin.status === 401, 'POST /api/admin/login rejects invalid credentials with 401');

    // 7. Admin Login with correct credentials
    const login = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'martinssqeel@gmail.com',
        password: 'ChangeMe2026!Secure',
      }),
    });
    assert(login.status === 200 && Boolean(login.data.token), 'POST /api/admin/login authenticates admin & returns JWT', login.data);
    const token = login.data.token;

    // 8. Authenticated Admin Profile (/api/admin/me)
    const me = await request('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(me.status === 200 && me.data.user.email === 'martinssqeel@gmail.com', 'GET /api/admin/me validates JWT session');

    // 9. Admin Stats
    const stats = await request('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(stats.status === 200 && stats.data.data.totalProjects >= 2, `GET /api/admin/stats returns metrics (projects: ${stats.data.data?.totalProjects})`);

    // 10. Admin Contact Messages List
    const msgs = await request('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(msgs.status === 200 && msgs.data.data.length > 0, `GET /api/admin/messages returns inquiries (${msgs.data.data?.length})`);

    // Find the latest message and mark it read
    if (msgs.data.data && msgs.data.data.length > 0) {
      const targetMsg = msgs.data.data[0];
      const patchRes = await request(`/api/admin/messages/${targetMsg.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: 'read' }),
      });
      assert(patchRes.status === 200, 'PATCH /api/admin/messages/:id updates message status', patchRes.data);
    }

    // 11. Password Change Capability Test
    // Update to temporary password
    const pwdChange1 = await request('/api/admin/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        currentPassword: 'ChangeMe2026!Secure',
        newPassword: 'MyNewTemporaryPassword2026!',
      }),
    });
    assert(pwdChange1.status === 200, 'POST /api/admin/change-password updates password securely', pwdChange1.data);

    // Authenticate with the new password
    const loginNew = await request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'martinssqeel@gmail.com',
        password: 'MyNewTemporaryPassword2026!',
      }),
    });
    assert(loginNew.status === 200 && Boolean(loginNew.data.token), 'Login succeeds with new password');

    // Reset password back to standard
    const pwdChange2 = await request('/api/admin/change-password', {
      method: 'POST',
      headers: { Authorization: `Bearer ${loginNew.data.token}` },
      body: JSON.stringify({
        currentPassword: 'MyNewTemporaryPassword2026!',
        newPassword: 'ChangeMe2026!Secure',
      }),
    });
    assert(pwdChange2.status === 200, 'Reset password back to ChangeMe2026!Secure');

    console.log('\n======================================================');
    if (failures === 0) {
      console.log('✓ ALL API INTEGRATION TESTS PASSED (14/14 SUCCEEDED)');
    } else {
      console.error(`✗ ${failures} TEST(S) FAILED`);
      process.exit(1);
    }
    console.log('======================================================');
  } catch (err) {
    console.error('Fatal API test error:', err);
    process.exit(1);
  }
}

run();
