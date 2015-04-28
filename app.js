var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');


//var session = require('express-session');
//var cookieParser = require('cookie-parser');
//var flash = require('express-flash');
//var cookieParser = require('cookie-parser');
var path = require('path');
var ejs = require('ejs');
var Song = require('./models/Song');
var DVD = require('./models/DVD');
var User = require('./models/user');
var Virus = require('./models/virus');
var Virus_Type = require('./models/virus_type');

var NodeCache = require( "node-cache" );
var myCache = new NodeCache();

var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(result){
    console.log("socket ");
    console.log(result);

});
//server.listen(3000);

var app = express();
app.use(cookieParser('secret'));
app.use(session({cookie: { maxAge: 60000 }}));
app.use(flash());


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));





/*
app.configure(function() {
	app.use(express.cookieDecoder());
	app.use(express.session());
});*/
//app.use(express.bodyParser({uploadDir:'./uploads'}));

app.get('/', function(req, res) {
    
    /*
    console.log("index rednered T");
    res.render('index', {
       title: 'Home 1'  
    });
    //res.write("hello");
    //res.end();
    */
   
    var array = [56,56,56,56,56,78,78,89];
    obj = {variable: array };
    success = myCache.set( "myKey", obj, 100 ); 
    console.log(success);
    //alert(success);

    value = myCache.get( "myKey" );
    //alert(value);
    console.log(value);
    if ( value == undefined ){
      //alert('undefined');
      console.log('undefined');
    }
    
    
    console.log("index rednered T");
    res.render('login', {
       title: 'Home 1', message: req.flash('info')  
    });
    
    
});


app.post('/globe', function(req, res) {
    //console.log(req);
    console.log("yoo");
     req.flash('info', 'hello!');
     console.log(('info', 'hello!'));
     
    if(req.body.formType == "login")
    {
 
     User.find({
        where: {
            username: req.body.username,
            password: req.body.password
            }
     }).then(function(loggedInUser) { 
        console.log(loggedInUser);
        if(loggedInUser)
        {
            User.hasMany(Virus, {foreignKey: 'user_id'});
            Virus.belongsTo(User, {foreignKey: 'user_id'});
            Virus_Type.hasMany(Virus, {foreignKey: 'virus_type_id'});
            Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});
            
            Virus.findAll({
                include: [{model: User, required: true}, {model:Virus_Type, required: true}]
                
            }).then(function(viruses){
            console.log("viruses");
            console.log(viruses);
            
            
            console.log(loggedInUser);
            res.render('index', {
                user: loggedInUser, viruses: viruses
            }); 
                      
        });
        }
        else
        {

            //res.send(JSON.stringify(req.flash('test')));
            
            res.redirect('/');
            res.render('login', {
                message: 'Login Failed'
            });             

        }
     });
        
    }
    else if(req.body.formType == "signUp")
    {
    
    //console.log(req.body.newUsername);
    if(!req.body.newUsername || !req.body.newPassword || !req.body.newPasswordRepeat)
    {
        
        console.log("not filled out");
        res.redirect('/');
        res.render('login', {
                message: 'Login Failed'
        }); 
        
    }
    else if(req.body.newPassword != req.body.newPasswordRepeat)
    {
        console.log("password not mathed");
        res.redirect('/');
        /*
        res.render('login', {
                            message: 'failed'  
                    });*/
    }
    else
    {
    
        User.find({
            where: {
            username: req.body.newUsername,
            password: req.body.newPassword
            }
            }).then(function(existingUser) {
                
                if(existingUser)
                {   
                    
                    res.render('login', {
                            message: 'failed'  
                    });
                    
                }
                else
                {
                    
                    var newUser = User.build();
                    newUser.username = req.body.newUsername;
                    newUser.password = req.body.password;
                    newUser.save().then(function(newUser) { 
                    User.hasMany(Virus, {foreignKey: 'user_id'});
                    Virus.belongsTo(User, {foreignKey: 'user_id'});
                    Virus_Type.hasMany(Virus, {foreignKey: 'virus_type_id'});
                    Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});

                    Virus.findAll({
                        include: [{model: User, required: true},{model:Virus_Type, required: true}] 
                    }).then(function(viruses){
                    console.log(viruses);
                    //res.send(viruses);
                    
                    res.send({'viruses': viruses});
                    
                    
                
                    res.render('index', {
                        user: newUser, viruses: viruses
                        }); 
                      
                        });    
                    });
                }
            }); 
         
        }
    }
    console.log("index rednered T");
    
});
/*
app.post('/login', function(req, res) {
   
    console.log(req.query.username); 
    
     User.find({
        where: {
            username: req.body.username,
            password: req.body.password
            }
     }).then(function(loggedInUser) { 
        console.log(loggedInUser);
        if(loggedInUser)
        {
        User.hasMany(Virus, {foreignKey: 'user_id'})
        Virus.belongsTo(User, {foreignKey: 'user_id'})

        Virus.findAll({
            include: [{model: User, required: true}] 
        }).then(function(viruses){
            console.log(viruses);
            console.log(loggedInUser);
            res.render('index', {
                user: loggedInUser, viruses: viruses
            }); 
                      
        });
        }
        else
        {
            res.render('login', {
                message: 'Login Failed'
            }); 
 
        }
     });
     
    
});
*/
app.post('/Send', function(req, res){ // Specifies which URL to listen for

    console.log("yo");
    console.log(req.body.diseaseType);
    console.log("user id" + req.body.userId);
    console.log("lat" + req.body.latitude);
    console.log("long" + req.body.longitude);
    var t = new Date();
    var YYYY = t.getFullYear();
    var MM = ((t.getMonth() + 1 < 10) ? '0' : '') + (t.getMonth() + 1);
    var DD = ((t.getDate() < 10) ? '0' : '') + t.getDate();
    var HH = ((t.getHours() < 10) ? '0' : '') + t.getHours();
    var mm = ((t.getMinutes() < 10) ? '0' : '') + t.getMinutes();
    var ss = ((t.getSeconds() < 10) ? '0' : '') + t.getSeconds();
    var currentDate = YYYY+'-'+MM+'-'+DD+' '+HH+':'+mm+':'+ss;   
    
    var newVirus = Virus.build();
    newVirus.virus_type_id = req.body.diseaseTypeId;
    newVirus.detail = req.body.detail;
    newVirus.latitude = req.body.latitude;
    newVirus.longitude = req.body.longitude;
    newVirus.location = req.body.location;    
    newVirus.user_id = req.body.userId;
    newVirus.date = currentDate;
    newVirus.save().then(function() {
        
    });

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

/*
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
*/

app.listen(3000, function() {
    
    console.log('listening on localhost:3000');
    
});
