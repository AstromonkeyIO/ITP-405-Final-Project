var express = require('express');
var ejs = require('ejs');
var Song = require('./models/Song');


var DVD = require('./models/DVD');

var app = express();

app.set('view engine', 'ejs');


app.get('/', function(req, res) {
    
    console.log("index rednered T");
    res.render('index', {
       title: 'Home 1'  
    });
    //res.write("hello");
    //res.end();
    
});

/*
app.get('/songs', function(req, res) {
   
    console.log(req.query.title);
    
     Song.findAll({
        where: {
            title: {
                like: '%' + req.query.title + '%',
                playCount: { gt: 0}
            }
        },
        order: 'playCount DESC'
         
     }).then(function(results) { 

         res.render('songs', {
            songs: results
            
        });         
     });
    
});
*/

app.get('/dvds', function(req, res) {
   
    console.log(req.query.title); 
    
     DVD.findAll({
        where: {
            title: {
                like: '%' + req.query.title + '%'//,
                //playCount: { gt: 0}
            },
            
            award: {
                like: '%' + req.query.award + '%'
            }
        },
        order: 'title DESC'
         
     }).then(function(results) { 

         res.render('dvds', {
            dvds: results
        });         
     });
    
});

app.listen(3000, function() {
    
    console.log('listening on localhost:3000');
    
});
