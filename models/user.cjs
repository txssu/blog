'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {}
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { notEmpty: true }
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: { len: [3, 16], isAlphanumeric: true }
      },
      password: {
        type: DataTypes.STRING,
        validate: { len: [8, 20] }
      },
      admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      editor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        afterValidate: async (user, options) => {
          if (user.password) {
            user.password = 'hash' // TODO: Make password hashing
          }
        }
      }
    }
  )
  return User
}
