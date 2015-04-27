   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var Virus_Type = sequelize.define('virus_types', {
        
        virus_type: {
             field: 'virus_type',
             type: Sequelize.STRING
        }

     }, {timestamps: false});
     
    module.exports = Virus_Type;





