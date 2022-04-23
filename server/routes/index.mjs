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
 *    parameters:
 *      limit:
 *        name: limit
 *        in: query
 *        schema:
 *          type: integer
 *      offset:
 *        name: offset
 *        in: query
 *        schema:
 *          type: integer
 */

router.get('/', function (req, res) {
  res.send('Good!')
})

export default router
