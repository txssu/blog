import { auth } from './auth.mjs'

async function adminRequired (req, res, next) {
  if (req.auth && req.auth.User.admin) {
    next()
  } else {
    res.status(404).send({ msg: 'Not found' })
  }
}

const adminOnly = [auth, adminRequired]

export default adminOnly
