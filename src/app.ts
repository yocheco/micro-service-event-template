import indexCreatedReciveBus from './events/recieve/userService/index.created'
import { Server } from './server'

export class App {
  server?: Server

  async start () {
    const port = process.env.PORT || '5000'
    this.server = new Server(port)
    await indexCreatedReciveBus.start()
    return this.server.listen()
  }

  get httpServer () {
    return this.server?.getHTTPServer()
  }

  async stop () {
    return this.server?.stop()
  }
}
