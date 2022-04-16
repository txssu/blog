module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'Jonh Brown',
        username: 'megabrown',
        password:
          '$2b$04$Oh36RNrwaoYL1betngrXAu7p16bn0Rqy.pJRkO45cYktUc08GAPYW', // 123456789
        admin: false,
        editor: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
}
