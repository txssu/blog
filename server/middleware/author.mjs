import * as crud from '../app/crud.mjs'
import auth from './auth.mjs'

async function authorRequired (req, res, next) {
  const { postId } = req.params
  const post = postId ? await crud.getPostById(postId) : undefined

  if (
    (post && post.posted) ||
    (post && req.auth.User.id === post.Author.id) ||
    req.auth.User.admin
  ) {
    next()
  } else {
    res.status(403).send({ msg: 'You must be author of this post' })
  }
}

const authorOnly = [auth, authorRequired]

export default authorOnly
