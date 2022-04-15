import express from 'express'
const router = express.Router()

/**
 *  @openapi
 *  components:
 *    schemas:
 *      Error:
 *        type: object
 *        properties:
 *          msg:
 *            type: string
 *    responses:
 *      ServerError:
 *        description: Something unexpected happened
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Error'
 */

router.get('/', function (req, res) {
  res.send('Good!')
})

export default router
