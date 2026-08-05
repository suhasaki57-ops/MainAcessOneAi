import app from './app.js';
import env from './config/env.js';
import { checkDatabaseConnection } from './supabase/connection.js';

const startServer = async () => {
  try {
    await checkDatabaseConnection();

    app.listen(env.port, () => {
      console.log(`🚀 ascess-1-ai Backend Server running on port ${env.port} [${env.nodeEnv}]`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
