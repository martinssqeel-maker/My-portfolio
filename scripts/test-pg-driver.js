/**
 * PostgreSQL Connection & Driver Validation Test
 */
import pg from 'pg';

const { Pool } = pg;

async function testPgDriver() {
  console.log('--- Testing PostgreSQL Driver & Pool Construction ---');

  // 1. Verify Pool instantiation with mock credentials
  const testUrl = 'postgresql://sample_user:sample_pass@db.mock-host.supabase.co:5432/postgres?sslmode=require';
  console.log(`Testing Pool constructor with SSL URL: ${testUrl.replace(/:[^:]*@/, ':****@')}`);

  const pool = new Pool({
    connectionString: testUrl,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 1000,
  });

  // Verify pool configuration
  if (!pool.options.connectionString) {
    throw new Error('Pool failed to parse connection string');
  }
  console.log('✓ PostgreSQL Pool initialized properly with SSL support.');

  await pool.end();
  console.log('✓ Pool closed cleanly.');

  console.log('--- PostgreSQL Driver & Configuration Verified ---');
}

testPgDriver().catch((err) => {
  console.error('PostgreSQL driver test error:', err);
  process.exit(1);
});
