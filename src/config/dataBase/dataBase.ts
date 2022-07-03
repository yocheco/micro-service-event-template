import mongoose from 'mongoose'

import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

const options = {
  keepAlive: true,
  serverSelectionTimeoutMS: Env.MONGO_MS_CONNECTION
}

export class MongoDb {
  public start = async ({ url = Env.MONGO_URI }:{ url?: string } = {}) => {
    try {
      await mongoose.connect(url, options)
      winstonLogger.info('[Mongoose is connected]')
    } catch (error) {
      winstonLogger.error('[Mongoose] error to connected')
      this.retryConnection({ url })
    }
  }

  public stop = async () => {
    try {
      mongoose.disconnect()
    } catch (error) {
      winstonLogger.error('[Mongoose] error to desconnected')
    }
  }

  public retryConnection ({ url }:{url?: string} = {}) {
    winstonLogger.info('[Mongoose/retryConnection] Retry connection to Mongo')
    const calculateBackOffDelayMs = (backoffTime: number) => 1000 * (backoffTime + Math.random())
    setTimeout(() => {
      this.start({ url })
    }, calculateBackOffDelayMs(20))
  }
}
