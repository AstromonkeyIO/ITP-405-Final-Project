   var Sequelize = require('sequelize');
    
   
   var sequelize = new Sequelize('dvd', 'student', 'ttrojan', {
          
           dialect: 'mysql',
           host: 'itp460.usc.edu'
       
   });
   
   module.exports = sequelize;

