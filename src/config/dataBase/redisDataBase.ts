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
      // lisent connection [Redis]
      client.on('connect', () => {
        console.log('[Redis] Client connected to redis...')
      })

      client.on('ready', () => {
        console.log('[Redis] Client connected to redis and ready to use...')
      })

      client.on('error', (err) => {
        console.log('[Redis] ' + err.message)
      })

      client.on('end', () => {
        console.log('[Redis] Client disconnected from redis')
      })
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
