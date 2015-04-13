   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var DVD = sequelize.define('dvd', {
      
        title: {
            field: 'title',
            type: Sequelize.STRING
        },

        award: {
             type: Sequelize.STRING,
             field: 'award'
        }

     }, {timestamps: false});
     
     
    module.exports = DVD;




