import { Router } from 'express'
import indexController from '../controllers/indexController'
const router: Router = Router()

// test
router.get('/', indexController.index)

export default router
