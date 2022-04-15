import express from 'express'

import * as crud from '../app/crud.mjs'
import renderUser from '../renders/user.mjs'
import * as helpers from '../app/helpers.mjs'
const router = express.Router()

/**
 *  @openapi
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *          username:
 *            type: string
 *          createdAt:
 *            type: string
 *            format: date
 *          isAdmin:
 *            type: boolean
 *          isEditor:
 *            type: boolean
 *    parameters:
 *      userId:
 *        name: userId
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 */

/**
 *  @openapi
 *  /users:
 *    get:
 *      description: Get all users
 *      responses:
 *        200:
 *          description: Returns array of users
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/User'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.get('/', async function (req, res) {
  const users = await crud.getAllUsers()
  res.send(users.map(renderUser))
})

/**
 *  @openapi
 *  /users/{userId}:
 *    get:
 *      description: Get user info by his id
 *      parameters:
 *        - $ref: '#/components/parameters/userId'
 *      responses:
 *        200:
 *          description: Returns user
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        404:
 *          description: There is no user with this ID
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.get('/:userId', async function (req, res) {
  const { userId } = req.params

  try {
    const user = await crud.getUserById(userId)
    if (user === null) {
      res.status(404).send({ msg: 'User not found' })
    } else {
      res.send(renderUser(user))
    }
  } catch (e) {
    console.log(e)
    helpers.sendServerError(res)
  }
})

export default router
