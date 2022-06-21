import { Env } from './config/env/env'
import { recivers } from './recivers'
import { Server } from './server'

export class App {
  server?: Server

  async start () {
    const port = Env.PORT
    this.server = new Server(port)
    // init Rmq reciver
    if (Env.ENV !== 'test') await recivers.start()
    return this.server.listen()
  }

  get httpServer () {
    return this.server?.getHTTPServer()
  }

  async stop () {
    // Index created stop
    if (Env.ENV !== 'test') await recivers.stop()
    return this.server?.stop()
  }
}
