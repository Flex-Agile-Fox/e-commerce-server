'use strict';
const fs = require('fs')
const bcrypt = require('bcryptjs')
const dataAdmin = JSON.parse(fs.readFileSync('./databases/UserAdmin.json','utf-8'))
dataAdmin.forEach(e => {
  e.password = bcrypt.hashSync(e.password, bcrypt.genSaltSync(10));
  e.createdAt = new Date()
  e.updatedAt = new Date()  
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', dataAdmin, {});
    await queryInterface.sequelize.query(`SELECT setval('"Users_id_seq"', (SELECT MAX(id)FROM "Users"))`)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
