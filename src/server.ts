import express, { Request, Response } from 'express'
import compress from 'compression'
import bodyParser from 'body-parser'
import Router from 'express-promise-router'
import httpStatus from 'http-status'
import * as http from 'http'
import helmet from 'helmet'
import errorHandler from 'errorhandler'
import indexRoutes from './routes/index'
import morgan from 'morgan'
import SwaggerUi from 'swagger-ui-express'
import swaggerJSDoc from './lib/swagger'
import indexCreatedReciveBus from './events/recieve/userService/index.created'
import winstonLogger from './lib/WinstonLogger'

export class Server {
  private port: string
  private express: express.Express
  private httpServer?: http.Server

  constructor (port: string) {
    this.port = port
    this.express = express()
    // Body
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    // Helmet
    this.express.use(helmet.xssFilter())
    this.express.use(helmet.noSniff())
    this.express.use(helmet.hidePoweredBy())
    this.express.use(helmet.frameguard({ action: 'deny' }))
    // Morgan
    // dev or common
    this.express.use(morgan('dev'))
    // Compress
    this.express.use(compress())
    // Router
    const router = Router()
    router.use(errorHandler())
    this.express.use(router)

    // Route  /health-check
    router.get('/health-check', function (req, res) {
      res.status(httpStatus.OK).send()
    })

    // 🔀 Routes
    // index
    router.use('/', indexRoutes)

    // Swagger
    router.use('/doc', SwaggerUi.serve, SwaggerUi.setup(swaggerJSDoc))

    indexCreatedReciveBus.start()

    // Error handling
    router.use((err: Error, req: Request, res: Response, next: Function) => {
      console.log('Error no controlado')
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    })
  }

  async listen (): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        winstonLogger.info(`Server is running at http://localhost:${this.port} in ${this.express.get('env')} mode`)
        console.log('  Press CTRL-C to stop\n')
        resolve()
      })
    })
  }

  getHTTPServer () {
    return this.httpServer
  }

  async stop (): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close(error => {
          if (error) {
            return reject(error)
          }
          return resolve()
        })
      }

      return resolve()
    })
  }
}
