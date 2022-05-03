import { Request, Response } from 'express'
import httpStatus from 'http-status'
import { Iindex } from '../models'
import { ApiResponse } from '../shared/interfaces/apiResponse'
import { HttpStatusCode } from '../shared/types/http.model'

class IndexController {
  public index = async (req: Request, res: Response) => {
    // Create model index
    const index: Iindex = {
      name: 'Sergio'
    }

    // Create response
    const responseObj: ApiResponse<Iindex> = {
      status: HttpStatusCode.OK,
      data: index
    }
    res.status(httpStatus.OK).send(responseObj)
  }
}

const indexController = new IndexController()
export default indexController
