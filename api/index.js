import app from '../server/app.js';
import { initDatabase } from '../server/db/database.js';
import { seed } from '../server/db/seed.js';

let isReady = false;

async function bootstrap() {
  if (!isReady) {
    try {
      await initDatabase();
      await seed();
    } catch (err) {
      console.error('Cold start database notice:', err.message);
    }
    isReady = true;
  }
}

export default async function handler(req, res) {
  await bootstrap();
  return app(req, res);
}
