import * as crud from '../app/crud.mjs'

export async function auth (req, res, next) {
  const data = req.cookies.usertoken

  if (data) {
    const token = await crud.getTokenByData(data)
    if (token && token.expiresAfter > new Date()) {
      req.auth = token
    }
  }

  next()
}

async function authRequired (req, res, next) {
  if (req.auth) {
    next()
  } else {
    res.status(401).send({ msg: 'Authorization is required' })
  }
}

const authorizedOnly = [auth, authRequired]

export default authorizedOnly
