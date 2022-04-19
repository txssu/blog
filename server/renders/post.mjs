import userRender from './user.mjs'
import tagRender from './tag.mjs'

export default function fullRender (post, content) {
  const data = {
    id: post.id,
    title: post.title,
    author: userRender(post.Author),
    tag: tagRender(post.Tag),
    photos: post.photos,
    createdAt: post.createdAt
  }
  if (content) {
    data.content = post.content
  }
  return data
}
