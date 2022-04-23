import db from '../../models/index.mjs'
import * as hashing from './hashing.mjs'

const { Op } = db.Sequelize

const defaultLimit = 10

export async function getAllUsers (limit = defaultLimit, offset = 0) {
  return db.User.findAll({
    order: [['id', 'ASC']],
    limit: limit || defaultLimit,
    offset: offset || 0
  })
}
export async function getUserById (userId) {
  return db.User.findByPk(userId)
}

export async function updateUsername (userId, { username, email }) {
  return db.User.update(
    { username, email },
    {
      where: {
        id: userId
      }
    }
  )
}

export async function createUser ({ username, name, isEditor }) {
  const password = await hashing.randomPassword()
  return {
    user: await db.User.create({ username, password, name, editor: isEditor }),
    password
  }
}

export async function loginUser ({ username, password }) {
  const user = await db.User.findOne({ where: { username } })
  const match = await hashing.comparePasswords(password, user?.password || '')
  if (match) {
    return user
  } else {
    return null
  }
}

export async function getTokenByData (data) {
  return db.Token.findOne({
    where: { data },
    include: db.User
  })
}

export async function createToken (user) {
  const data = await hashing.createToken()
  return user.createToken({ data })
}

export async function getAllTags (limit = defaultLimit, offset = 0) {
  return db.Tag.findAll({
    order: [['id', 'ASC']],
    limit: limit || defaultLimit,
    offset: offset || 0
  })
}

export async function getTagById (tagId) {
  const tag = await db.Tag.findByPk(tagId, {
    include: {
      model: db.Tag,
      as: 'ChildrenTags'
    }
  })
  await getParentsTreeUp(tag)
  return tag
}

async function getParentsTreeUp (tag) {
  if (tag && tag.parentTagId) {
    tag.ParentTag = await tag.getParentTag()
    await getParentsTreeUp(tag.ParentTag)
  }
}

export async function updateTag (tagId, { title, parentTagId }) {
  return db.Tag.update(
    { title, parentTagId },
    {
      where: {
        id: tagId
      }
    }
  )
}

export async function getAllPosts (
  { createdAt, createdUntil, createdSince, author, tagId, search, searchIn },
  limit = defaultLimit,
  offset = 0
) {
  const where = {}

  if (createdAt) {
    const dayAt = new Date(createdAt)
    const dayStart = dayAt.setHours(0, 0, 0, 0)
    const dayEnd = dayAt.setHours(23, 59, 59, 999)
    where.createdAt = {
      [Op.gt]: dayStart,
      [Op.lt]: dayEnd
    }
  }

  if (createdUntil) {
    const date = new Date(createdUntil)
    where.createdAt = {
      [Op.lt]: date
    }
  }

  if (createdSince) {
    const date = new Date(createdSince)
    where.createdAt = {
      [Op.gt]: date
    }
  }

  if (author) {
    Object.assign(where, {
      '$Author.username$': author
    })
  }

  if (tagId) {
    where.tagId = tagId
  }

  if (search && searchIn) {
    const places = searchIn.split(',')
    const conds = {}

    if (places.includes('post')) {
      conds.content = { [Op.substring]: search }
      conds.title = { [Op.substring]: search }
    }
    if (places.includes('author')) {
      Object.assign(conds, { '$Author.name$': { [Op.substring]: search } })
    }
    if (places.includes('tag')) {
      Object.assign(conds, { '$Tag.title$': { [Op.substring]: search } })
    }

    console.log(conds)
    Object.assign(where, { [Op.or]: conds })
  }

  where.posted = true

  const posts = await db.Post.findAll({
    include: [
      { model: db.User, as: 'Author' },
      { model: db.Tag, as: 'Tag' }
    ],
    where,

    order: [['id', 'ASC']],
    limit: limit,
    offset: offset
  })
  for (const post of posts) {
    await getParentsTreeUp(post.Tag)
  }
  return posts
}

export async function getPostById (postId) {
  const post = await db.Post.findByPk(postId, {
    include: [
      { model: db.User, as: 'Author' },
      { model: db.Tag, as: 'Tag' }
    ]
  })
  if (post) await getParentsTreeUp(post.Tag)
  return post
}

export async function createPost (
  user,
  { title, tagId, content, photos, posted }
) {
  return user.createPost({ title, tagId, content, photos, posted })
}

export async function updatePost (
  id,
  { title, tagId, content, photos, posted }
) {
  return db.Post.update(
    { title, tagId, content, photos, posted },
    { where: { id } }
  )
}
