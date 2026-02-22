import type { Server } from 'http';

import app from './app.js';
import logger from './common/utils/logger.js';
import config from './config/index.js';

async function main() {
  const server: Server = app.listen(config.port, () => {
    logger.info(
      `🚀 Server is running on port http://localhost:${config.port}`,
      {
        port: config.port,
        env: process.env.NODE_ENV,
      }
    );
  });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  const unexpectedErrorHandler = (error: unknown) => {
    logger.error('Unexpected error detected', { error });
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  const gracefulShutdown = (signal: string) => {
    logger.info(`${signal} received`);
    if (server) {
      server.close(() => {
        logger.info('Server closed gracefully');
        process.exit(0);
      });

      // Force close after 10s
      setTimeout(() => {
        logger.error(
          'Could not close connections in time, forcefully shutting down'
        );
        process.exit(1);
      }, 10000);
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

main().catch((err) => {
  logger.error('Critical failure during startup', { error: err });
  process.exit(1);
});
