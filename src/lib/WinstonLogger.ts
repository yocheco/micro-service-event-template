import winston from 'winston'

export enum Levels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info'
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `logs/${Levels.DEBUG}.log`, level: Levels.DEBUG }),
    new winston.transports.File({ filename: `logs/${Levels.ERROR}.log`, level: Levels.ERROR }),
    new winston.transports.File({ filename: `logs/${Levels.INFO}.log`, level: Levels.INFO })
  ]
})

class WinstonLogger {
  debug (message: string) {
    logger.debug(message)
  }

  error (message: string | Error) {
    logger.error(message)
  }

  info (message: string) {
    logger.info(message)
  }
}

const winstonLogger = new WinstonLogger()
export default winstonLogger
