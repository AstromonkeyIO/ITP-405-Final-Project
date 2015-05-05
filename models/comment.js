   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var Comment = sequelize.define('comments', {
        id_user: {
            field: 'id_user',
            type: Sequelize.INTEGER
        },

        comment: {
             field: 'comment',
             type: Sequelize.STRING
        },
        
        virus_id: {
             field: 'virus_id',
             type: Sequelize.INTEGER
        }        

     }, {timestamps: false});
     
     
    module.exports = Comment;

