import { Model } from 'sequelize'
import * as hashing from '../server/app/hashing.mjs'

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      User.hasMany(models.Token, {
        foreignKey: 'userId'
      })
    }
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
            user.password = await hashing.hashPassword(user.password)
          }
        }
      }
    }
  )
  return User
}
