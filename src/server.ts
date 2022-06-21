/* eslint-disable no-console */
import bodyParser from 'body-parser'
import compress from 'compression'
import errorHandler from 'errorhandler'
import express, { Request, Response } from 'express'
import Router from 'express-promise-router'
import helmet from 'helmet'
import * as http from 'http'
import httpStatus from 'http-status'
import morgan from 'morgan'
import SwaggerUi from 'swagger-ui-express'

import swaggerJSDoc from './lib/swagger'
import winstonLogger from './lib/winstonLogger'
import indexRoutes from './routes/index'

export class Server {
  private port: number
  private express: express.Express
  private httpServer?: http.Server

  constructor (port: number) {
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

    // Error handling
    router.use((err: Error, req: Request, res: Response, next: Function) => {
      console.log('Error no controlado!!!!')
      winstonLogger.error(err)

      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
    })
  }

  async listen (): Promise<void> {
    return new Promise(resolve => {
      this.httpServer = this.express.listen(this.port, () => {
        winstonLogger.info(`[Server] running at http://localhost:${this.port} in ${this.express.get('env')} mode`)
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
