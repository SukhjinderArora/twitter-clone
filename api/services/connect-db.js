const { PrismaClient } = require('@prisma/client');

const logger = require('../utils/logger');

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  logger.info(`Query: ${e.query}`);
  logger.info(`Duration: ${e.duration} ms`);
});

module.exports = prisma;
