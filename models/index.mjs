'use strict'

import fs from 'fs'
import path, { dirname } from 'path'
import Sequelize from 'sequelize'

import { fileURLToPath } from 'url'

import config from 'config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

const dbConfig = config.get('Database')

const db = {}

let sequelize
if (dbConfig.useEnvVariable) {
  sequelize = new Sequelize(process.env[dbConfig.env], dbConfig)
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    dbConfig
  )
}

await Promise.all(
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-4) === '.mjs'
      )
    })
    .map(async file => {
      const model = await import(path.join(__dirname, file))
      const loadedModel = model.default(sequelize, Sequelize.DataTypes)
      db[loadedModel.name] = loadedModel
    })
)

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
