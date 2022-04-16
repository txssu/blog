'use strict'

import fs from 'fs'
import path, { dirname } from 'path'
import Sequelize from 'sequelize'

import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const basename = path.basename(__filename)

import config from 'config'

const dbConfig = config.get('Database')

const db = {}

let sequelize
if (dbConfig.useEnvVariable) {
  sequelize = new Sequelize(process.env[dbConfig.env], dbConfig.options)
} else {
  sequelize = new Sequelize(
    dbConfig.connection.database,
    dbConfig.connection.username,
    dbConfig.connection.password,
    dbConfig.options
  )
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-4) === '.mjs'
    )
  })
  .forEach(async file => {
    const model = await import(path.join(__dirname, file))
    const loadedModel = model.default(sequelize, Sequelize.DataTypes)
    db[loadedModel.name] = loadedModel
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
