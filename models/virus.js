   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var Virus = sequelize.define('viruses', {
        
        virus_type_id: {
            field: 'virus_type_id',
            type: Sequelize.INTEGER
        },
        detail: {
             field: 'detail',
             type: Sequelize.STRING
        },
        latitude: {
             field: 'latitude',
             type: Sequelize.STRING
        },
        longitude: {
             field: 'longitude',
             type: Sequelize.STRING
        },
        location: {
             field: 'location',
             type: Sequelize.STRING
        },        
        photo: {
             field: 'photo',
             type: Sequelize.BLOB
        },
        date: {
            field: 'date',
            type: Sequelize.DATE  
        },
        user_id: {
            field: 'user_id',
            type: Sequelize.INTEGER
        }

     }, {timestamps: false});
     
     
    module.exports = Virus;




