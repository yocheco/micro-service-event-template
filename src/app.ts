
import { MongoDb } from './config/dataBase/mongoDataBase'
import { RedisDb } from './config/dataBase/redisDataBase'
import { Env } from './config/env/env'
import { recivers } from './recivers'
import { Server } from './server'

// MongoseDb
const mongoDb = new MongoDb()
// RedisDb
const redisDb = new RedisDb()

export class App {
  server?: Server

  async start () {
    const port = Env.PORT
    this.server = new Server(port)

    // init mongo db
    await mongoDb.start()
    await redisDb.start()
    // init Rmq reciver
    if (Env.ENV !== 'test') await recivers.start()
    return this.server.listen()
  }

  get httpServer () {
    return this.server?.getHTTPServer()
  }

  async stop () {
    // stop mongo db
    await mongoDb.stop()
    // stop redis db
    await redisDb.stop()
    // stop Rmq reciver
    if (Env.ENV !== 'test') await recivers.stop()
    return this.server?.stop()
  }
}
