/* eslint-disable no-console */

import { RedisClientType } from '@redis/client'
import * as redis from 'redis'

import { backOff } from '../../lib/backOff'
import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

export let client: RedisClientType

export class RedisDb {
  async start ({ port = Env.REDIS_PORT }:{ port?: number } = {}) {
    try {
      client = redis.createClient({
        socket: {
          port,
          host: Env.REDIS_HOSTNAME,
          connectTimeout: Env.REDIS_MS_CONNECTION

        }
      })
      await client.connect()
      winstonLogger.info('[Redis] connected')
    } catch (error) {
      winstonLogger.error('[Redis] Error connection')
      this.retryConnection({ port })
    }
  }

  async retryConnection ({ port = Env.REDIS_PORT }:{ port?: number } = {}) {
    winstonLogger.info('[Redis] Retry connection to redis')

    setTimeout(() => {
      this.start({ port })
    }, backOff.calculateBackOffDelayMs(20))
  }

  async stop () {
    client.quit()
  }
}
