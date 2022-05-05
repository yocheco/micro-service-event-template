import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Iindex } from '../models'
import { BaseError } from '../shared/errors/baseError'
import { IApiResponse } from '../shared/interfaces/apiResponse'
import { HttpStatusCode } from '../shared/types/http.model'
import { ApiError } from '../shared/errors/apiError'
import indexBusSend from '../events/send/index/indexBusSend'
import winstonLogger from '../lib/WinstonLogger'

class IndexController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create model index
      const index: Iindex = {
        name: 'Sergio'
      }
      const n = Math.floor(Math.random() * 10)

      if (n > 5) throw new ApiError('Error Auth no enviado', 'index', HttpStatusCode.UNAUTHORIZED)

      // Send event
      indexBusSend.userAdd(index)

      // Create response
      const responseOk: IApiResponse<Iindex> = {
        status: true,
        code: HttpStatusCode.OK,
        data: index
      }
      res.status(httpStatus.OK).send(responseOk)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Generic error for user'
      const responseError: IApiResponse<any> = {
        status: false,
        code: HttpStatusCode.UNAUTHORIZED,
        message
      }
      winstonLogger.error(message)
      res.status((<BaseError>err)?.httpCode || 500).send(responseError)
      // next(err)
    }
  }

  public tetsRMQ = async (message:any) => {
    try {
      console.log('init controller')
      const content = JSON.parse(message.content.toString())
      console.log(content)
      console.log('finish controller')
    } catch (error) {

    }
  }
}

const indexController = new IndexController()
export default indexController
