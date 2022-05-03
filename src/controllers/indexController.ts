import { Request, Response } from 'express'
import httpStatus from 'http-status'

class IndexController {
  public index = async (req: Request, res: Response) => {
    res.status(httpStatus.OK).send({ indexController: true })
  }
}

const indexController = new IndexController()
export default indexController
