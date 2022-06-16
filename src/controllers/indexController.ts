import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'

import indexBusSend from '../events/send/index/indexBusSend'
import winstonLogger from '../lib/WinstonLogger'
import { Iindex } from '../models'
import { ApiError } from '../shared/errors/apiError'
import { IApiResponse } from '../shared/interfaces/apiResponse'
import { ISendController } from '../shared/interfaces/rmq/sendRmqController'
import { HttpStatusCode } from '../shared/types/http.model'

class IndexController implements ISendController<Iindex> {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create model index
      const index: Iindex = {
        name: 'Sergio'
      }
      const n = Math.floor(Math.random() * 10)

      if (n > 5) throw new ApiError('[IndexController] Error Auth no enviado')

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
      res.status(500).send(responseError)
    }
  }

  public reciveRMQ = (index: Iindex): void => {
    // eslint-disable-next-line no-console
    console.log({ index })
  }
}

const indexController = new IndexController()
export default indexController
