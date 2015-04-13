   var Sequelize = require('sequelize');
   var sequelize = require('./../config/Sequelize');
   
   var Song = sequelize.define('song', {
      
        title: {
            field: 'title',
            type: Sequelize.STRING
        },

        playCount: {
             type: Sequelize.INTEGER,
             field: 'play_count'
        }

     }, {timestamps: false});
     
     
    module.exports = Song;

