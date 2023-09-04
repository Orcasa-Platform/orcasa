const pino = require('pino');

const logger = pino({
  browser: {},
  level: process.env.LOG_LEVEL || 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
    },
  },
});

module.exports = logger;
