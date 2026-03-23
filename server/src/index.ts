import app from './app';
import { config } from './config';

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`
  ╔══════════════════════════════════════════╗
  ║   🔍 Lost & Found API Server             ║
  ║                                          ║
  ║   Environment : ${config.nodeEnv.padEnd(23)}║
  ║   Port        : ${String(config.port).padEnd(23)}║
  ║   Health      : http://localhost:${config.port}/health ║
  ╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
