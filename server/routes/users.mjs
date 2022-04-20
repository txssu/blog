import express from 'express'
import asyncHandler from 'express-async-handler'

import * as crud from '../app/crud.mjs'
import renderUser from '../renders/user.mjs'
import requireField from '../middleware/fields.mjs'
import adminOnly from '../middleware/admin.mjs'
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
 *      NewUser:
 *        type: object
 *        properties:
 *          name:
 *            type: string
 *            required: true
 *          username:
 *            type: string
 *            required: true
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
router.get(
  '/',
  asyncHandler(async function (req, res) {
    const { limit, offset } = req.query
    const users = await crud.getAllUsers(limit, offset)
    res.send(users.map(renderUser))
  })
)

/**
 *  @openapi
 *  /users:
 *    post:
 *      description: Create user. Admin only.
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/NewUser'
 *      responses:
 *        200:
 *          description: Returns new user with his password
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  user:
 *                    $ref: '#/components/schemas/User'
 *                  password:
 *                    type: string
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.post(
  '/',
  adminOnly,
  requireField('name', 'username'),
  asyncHandler(async function (req, res) {
    const userData = req.body
    const { user, password } = await crud.createUser(userData)
    res.send({ user: renderUser(user), password })
  })
)

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
router.get(
  '/:userId',
  asyncHandler(async function (req, res) {
    const { userId } = req.params

    const user = await crud.getUserById(userId)
    if (user === null) {
      res.status(404).send({ msg: 'User not found' })
    } else {
      res.send(renderUser(user))
    }
  })
)

export default router
