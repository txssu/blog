import db from '../../models/index.mjs'
import * as hashing from './hashing.mjs'

export async function getAllUsers () {
  return db.User.findAll()
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
