   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var User = sequelize.define('users', {
        username: {
            field: 'username',
            type: Sequelize.STRING
        },

        password: {
             field: 'password',
             type: Sequelize.STRING
        }

     }, {timestamps: false});
     
     
    module.exports = User;


