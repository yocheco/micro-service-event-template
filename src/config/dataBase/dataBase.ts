import mongoose from 'mongoose'

import winstonLogger from '../../lib/winstonLogger'
import { Env } from '../env/env'

const options = { keepAlive: true }

export class MongoDb {
  public start = async ({ url = Env.MONGOURI }:{ url?: string } = {}) => {
    try {
      await mongoose.connect(url, options)
      winstonLogger.info('[Mongoose is connected]')
    } catch (error) {
      winstonLogger.error('[Mongoose] error to connected')
    }
  }

  public stop = async () => {
    try {
      mongoose.disconnect()
    } catch (error) {
      winstonLogger.error('[Mongoose] error to desconnected')
    }
  }
}
