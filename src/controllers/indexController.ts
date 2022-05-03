import { Request, Response } from 'express'
import httpStatus from 'http-status'

class IndexController {
  public index = async (req: Request, res: Response) => {
    res.status(httpStatus.OK).send({ name: 'Sergio Rogelio Sandoval' })
  }
}

const indexController = new IndexController()
export default indexController
