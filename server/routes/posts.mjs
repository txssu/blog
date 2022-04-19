import express from 'express'
import asyncHandler from 'express-async-handler'

import * as crud from '../app/crud.mjs'
import renderPost from '../renders/post.mjs'
import requireField from '../middleware/fields.mjs'
import editorOnly from '../middleware/editor.mjs'
const router = express.Router()

router.get(
  '/',
  asyncHandler(async function (req, res) {
    const posts = await crud.getAllPosts()
    res.send(posts.map(renderPost))
  })
)

router.get(
  '/:postId',
  asyncHandler(async function (req, res) {
    const { postId } = req.params

    const post = await crud.getPostById(postId)
    if (!post) {
      res.status(404).send({ msg: 'Post not found' })
    } else {
      res.send(renderPost(post, true))
    }
  })
)

export default router
