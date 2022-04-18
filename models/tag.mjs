import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate (models) {
      Tag.belongsTo(models.Tag, {
        as: 'ParentTag',
        foreignKey: 'parentTagId',
        onDelete: 'CASCADE'
      })
      Tag.hasMany(models.Tag, {
        as: 'ChildrenTags',
        foreignKey: 'parentTagId'
      })
    }
  }
  Tag.init(
    {
      parentTagId: DataTypes.INTEGER,
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: 'Tag'
    }
  )
  return Tag
}
