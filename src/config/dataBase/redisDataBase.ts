
import * as redis from 'redis'

import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

export class RedisDb {
  async start ({ url = Env.REDIS_DB }:{ url?: string } = {}) {
    try {
      const client = redis.createClient({
        socket: {
          port: 6379,
          host: '127.0.0.1'
        }
      })
      winstonLogger.info('[Redis] connected')

      client.on('connect', () => {
        // eslint-disable-next-line no-console
        console.log('conectado redis')
      })
    } catch (error) {
      winstonLogger.error('[Redis] Error connection')
    }
  }
}
