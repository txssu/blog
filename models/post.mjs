import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {
  class Post extends Model {
    static associate (models) {
      Post.belongsTo(models.User, {
        foreignKey: 'authorId',
        onDelete: 'CASCADE',
        as: 'Author'
      })
      Post.belongsTo(models.Tag, {
        foreignKey: 'tagId',
        onDelete: 'CASCADE',
        as: 'Tag'
      })
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      tagId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false
      },
      photos: DataTypes.ARRAY(DataTypes.STRING),
      posted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: 'Post'
    }
  )
  return Post
}
