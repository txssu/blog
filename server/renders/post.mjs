import userRender from './user.mjs'
import tagRender from './tag.mjs'

export default function fullRender (post, content) {
  const data = {
    id: post.id,
    title: post.title,
    photos: post.photos,
    createdAt: post.createdAt
  }
  if (post.Author) data.author = userRender(post.Author)
  else data.authorId = post.authorId

  if (post.Tag) data.tag = tagRender(post.Tag)
  else data.tagId = post.tagId

  if (content) data.content = post.content

  return data
}
