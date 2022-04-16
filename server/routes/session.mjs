import express from 'express'

import auth, {authRequired} from '../middleware/auth.mjs'

import * as crud from '../app/crud.mjs'
const router = express.Router()

router.use(auth)

/**
 *  @openapi
 *  components:
 *    schemas:
 *      LoginData:
 *        type: object
 *        properties:
 *          username:
 *            required: true
 *            type: string
 *          password:
 *            required: true
 *            type: string
 */

/**
 *  @openapi
 *  /session:
 *    post:
 *      description: Log in
 *      requestBody:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                user:
 *                  $ref: '#/components/schemas/LoginData'
 *      responses:
 *        200:
 *          description: Set usertoken cookie to the newly created token
 *          headers:
 *            Set-Cookie:
 *              description: Authorizes on behalf of the token owner
 *              schema:
 *                type: string
 *        403:
 *          description: Wrong username or password
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        409:
 *          description: You're already authorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
router.post('/', async function (req, res) {
  if (req.auth) {
    res.status(409).send({ msg: "You're already authorized" })
    return
  }

  const user = await crud.loginUser(req.body.user)

  if (user) {
    const token = await crud.createToken(user)
    res.cookie('usertoken', token.data, {
      maxAge: 30 * 24 * 60 * 60,
      httpOnly: true
    })
    res.end()
  } else {
    res.status(403).send({ msg: 'Wrong username or password' })
  }
})

/**
 *  @openapi
 *  /session:
 *    delete:
 *      description: Log out
 *      responses:
 *        200:
 *          description: Token deleted
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 *        401:
 *          description: You need token to delete
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Error'
 *        500:
 *          $ref: '#/components/responses/ServerError'
 */
 router.delete('/', authRequired, async function (req, res) {
  await req.auth.destroy()
  res.clearCookie("usertoken");
  res.end()
})

export default router
