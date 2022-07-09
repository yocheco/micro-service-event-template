import mongoose, { ConnectOptions } from 'mongoose'

import { backOff } from '../../lib/backOff'
import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

const options: ConnectOptions = {
  keepAlive: true,
  serverSelectionTimeoutMS: Env.MONGO_MS_CONNECTION
}

export class MongoDb {
  public start = async ({ url = Env.MONGO_URI }:{ url?: string } = {}) => {
    try {
      await mongoose.connect(url, options)
      winstonLogger.info('[Mongoose] connected')
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
    winstonLogger.info('[Mongoose] Retry connection to Mongo')
    setTimeout(() => {
      this.start({ url })
    }, backOff.calculateBackOffDelayMs(20))
  }
}
