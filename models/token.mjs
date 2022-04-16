import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Token extends Model {
    static associate (models) {
      Token.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE'
      })
    }
  }
  Token.init(
    {
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER
      },
      data: {
        allowNull: false,
        type: DataTypes.STRING
      },
      expiresAfter: {
        allowNull: false,
        type: DataTypes.STRING
      }
    },
    {
      sequelize,
      modelName: 'Token',
      updatedAt: false,
      hooks: {
        beforeValidate: async (token, options) => {
          const now = new Date()
          token.expiresAfter = new Date(
            now.setDate(now.getDate() + 30)
          ).toISOString()
        }
      }
    }
  )
  return Token
}
