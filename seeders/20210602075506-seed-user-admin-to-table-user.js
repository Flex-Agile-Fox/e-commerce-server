'use strict';
const fs = require('fs')
const dataAdmin = JSON.parse(fs.readFileSync('./databases/UserAdmin.json','utf-8'))
dataAdmin.forEach(e => {
  e.createdAt = new Date()
  e.updatedAt = new Date()  
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', dataAdmin, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
