import app from './app.js';
import { initDatabase } from './db/database.js';
import { seed } from './db/seed.js';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await initDatabase();
    await seed();
  } catch (err) {
    console.error('Database startup notice:', err.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`  Portfolio Full-Stack API Server Online`);
    console.log(`  Port: ${PORT} (0.0.0.0:${PORT})`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`===============================================`);
  });
}

bootstrap();
