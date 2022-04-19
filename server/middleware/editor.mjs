import { auth } from './auth.mjs'

async function editorRequired (req, res, next) {
  if (req.auth && req.auth.User.editor) {
    next()
  } else {
    res.status(401).send({ msg: 'You must be editor' })
  }
}

const editorOnly = [auth, editorRequired]

export default editorOnly
