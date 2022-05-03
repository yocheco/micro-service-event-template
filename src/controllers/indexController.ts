import { Request, Response, NextFunction } from 'express'
import httpStatus from 'http-status'
import { Iindex } from '../models'
import { BaseError } from '../shared/errors/base'
import { ApiResponse } from '../shared/interfaces/apiResponse'
import { HttpStatusCode } from '../shared/types/http.model'
import { ApiError } from '../shared/errors/apiError'

class IndexController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Create model index
      const index: Iindex = {
        name: 'Sergio'
      }
      const n = Math.floor(Math.random() * 10)

      if (n > 5) throw new ApiError('Error Auth no enviado', 'index', HttpStatusCode.UNAUTHORIZED)

      // Create response
      const responseOk: ApiResponse<Iindex> = {
        status: true,
        code: HttpStatusCode.OK,
        data: index
      }
      res.status(httpStatus.OK).send(responseOk)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Generic error for user'
      const responseError: ApiResponse<any> = {
        status: false,
        code: HttpStatusCode.UNAUTHORIZED,
        message
      }
      res.status((<BaseError>err)?.httpCode || 500).send(responseError)
      next(err)
    }
  }
}

const indexController = new IndexController()
export default indexController
