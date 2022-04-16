import * as crud from '../app/crud.mjs'

export default async function auth (req, res, next) {
  const data = req.cookies.usertoken

  if (data) {
    const token = await crud.getTokenByData(data)
    if (token.expiresAfter > new Date()) {
      req.auth = token
    }
  }

  next()
}

export async function authRequired (req, res, next) {
  const auth = req.auth
  if (auth) {
    next()
  } else {
    res.status(401).send({ msg: 'Authorization is required' })
  }
}
