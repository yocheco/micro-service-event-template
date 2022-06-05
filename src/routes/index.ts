import { Router } from 'express'

import indexController from '../controllers/indexController'

const router: Router = Router()

/**
 * @swagger
 * /:
 *  get:
 *    tags:
 *      - Test route
 *    summary: Only test swagger
 *    description: This is one test
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/index"
 */
router.get('/', indexController.index)

export default router
