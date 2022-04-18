'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Tags', [
      {
        title: 'Programming languages',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'OOP languages',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'FP languages',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'JavaScript',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Elixir',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Tags', null, {})
  }
}
