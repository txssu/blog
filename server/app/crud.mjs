import db from '../../models/index.cjs'

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

export async function deleteUser (userId) {
  return db.User.destroy({
    where: {
      id: userId
    }
  })
}
