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
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    logger.error('Unexpected error detected', { error });
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

main();
