/* eslint-disable no-console */

import { RedisClientType } from '@redis/client'
import * as redis from 'redis'

import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

let client:RedisClientType

export class RedisDb {
  async start ({ url = Env.REDIS_DB }:{ url?: string } = {}) {
    try {
      client = redis.createClient({
        socket: {
          port: Env.REDIS_PORT,
          host: Env.REDIS_HOSTNAME,
          connectTimeout: Env.REDIS_MS_CONNECTION
        }
      })
      await client.connect()
      winstonLogger.info('[Redis] connected')

      client.on('connect', () => {
        console.log('conectado redis')
      })

      client.on('ready', () => {
        console.log('Client connected to redis and ready to use...')
      })

      client.on('error', (err) => {
        console.log(err.message)
      })
    } catch (error) {
      winstonLogger.error('[Redis] Error connection')
    }
  }

  async stop () {
    client.quit()
  }
}
