import bcrypt from 'bcrypt'
import crypto from 'crypto'

const saltRounds = 1 // TODO: load from config

export async function hashPassword (password) {
  return bcrypt.hash(password, saltRounds)
}
export async function comparePasswords (password, hash) {
  return bcrypt.compare(password, hash)
}
export async function createToken () {
  const token = crypto.randomBytes(48)
  return token.toString('hex')
}
