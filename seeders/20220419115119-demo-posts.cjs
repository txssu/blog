'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Jonh 42',
        username: 'mega42',
        password:
          '$2b$04$Oh36RNrwaoYL1betngrXAu7p16bn0Rqy.pJRkO45cYktUc08GAPYW', // 123456789
        admin: false,
        editor: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    )

    const usersRows = users[0]

    await queryInterface.bulkInsert('Tags', [
      {
        title: 'Ulta Post!!!',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])

    const tags = await queryInterface.sequelize.query(`SELECT id from "Tags";`)

    const tagsRows = tags[0]

    return queryInterface.bulkInsert('Posts', [
      {
        title: 'MEGA TITLE!!!',
        authorId: usersRows[0].id,
        tagId: tagsRows[0].id,
        content: 'Lorem ipsum idk what to write',
        posted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {})
    await queryInterface.bulkDelete('Tags', null, {})
    return queryInterface.bulkDelete('Posts', null, {})
  }
}
