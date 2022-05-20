import { Env } from './config/env'
import indexCreatedReciveBus from './events/recieve/userService/index.created'
import { Server } from './server'

export class App {
  server?: Server

  async start () {
    const port = Env.PORT
    this.server = new Server(port)
    // Index created start
    if(Env.NODE_ENV !== 'test') await indexCreatedReciveBus.start()
    return this.server.listen()
  }

  get httpServer () {
    return this.server?.getHTTPServer()
  }

  async stop () {
    // Index created stop
    if(Env.NODE_ENV !== 'test') await indexCreatedReciveBus.stop()
    return this.server?.stop()
  }
}
