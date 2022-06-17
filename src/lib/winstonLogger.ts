/* eslint-disable no-unused-vars */
import winston, { format } from 'winston'

export const enum Levels {
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info'
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      )
    }),
    new winston.transports.File({
      filename: `logs/${Levels.DEBUG}.log`,
      level: Levels.DEBUG,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: `logs/${Levels.ERROR}.log`,
      level: Levels.ERROR,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      )
    }),
    new winston.transports.File({
      filename: `logs/${Levels.INFO}.log`,
      level: Levels.INFO,
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD hh:mm:ss A ZZ'
        }),
        winston.format.json()
      )
    })
  ]
})

class WinstonLogger {
  debug (message: string): void {
    logger.debug(message)
  }

  error (message: string | Error): void {
    logger.error(message)
  }

  info (message: string): void {
    logger.info(message)
  }
}

const winstonLogger = new WinstonLogger()
export default winstonLogger
