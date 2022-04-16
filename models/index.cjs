'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const config = require('config')

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
      file.indexOf('.') !== 0 && file !== basename && file.slice(-4) === '.cjs'
    )
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    )
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
