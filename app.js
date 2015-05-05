var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var server = require('http').Server(app);
var request = require('request');
var path = require('path');
var ejs = require('ejs');
var Song = require('./models/Song');
var DVD = require('./models/DVD');
var User = require('./models/user');
var Virus = require('./models/virus');
var Virus_Type = require('./models/virus_type');
var Comment = require('./models/comment');
var NodeCache = require( "node-cache" );
var myCache = new NodeCache();

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



app.get('/', function(req, res) {
   
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
       title: 'Home 1', message: req.flash('message'), usernameLogin: req.flash('username-login'), passwordLogin: req.flash('password-login'),
       usernameSignup: req.flash('username-signup'), passwordSignup: req.flash('password-signup'), passwordSignupRepeat:req.flash('password-signup-repeat'),
       selector: req.flash('selector')
    });    
});



app.get('/globe', function(req, res) {
   
    cachedViruses = myCache.get( "viruses" );
    cachedCurrentUser = myCache.get( "currentUser" );
    
    if(cachedCurrentUser && cachedViruses)
    {
    console.log("cache succeess");  
    console.log(cachedCurrentUser); 
    
    res.render('index', {
        user: cachedCurrentUser, viruses: cachedViruses
    });
    }
    else {
        
         res.redirect('/');  
        
    }
  
});


app.get('/globe/api.json', function(req, res) {
    
    User.hasMany(Virus, {foreignKey: 'user_id'});
    Virus.belongsTo(User, {foreignKey: 'user_id'});
    Virus_Type.hasMany(Virus, {foreignKey: 'virus_type_id'});
    Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});

    Virus.findAll({
        include: [{model: User, required: true}, {model:Virus_Type, required: true}],
        order:'date DESC'

    }).then(function(viruses)
    {

        var measles_array = [];
        var ebola_array = [];
        var malaria_array = [];

        for(i = 0; i < viruses.length; i++)
        {
            console.log(viruses[i].virus_type.virus_type);
            if(viruses[i].virus_type.virus_type == "Ebola")
            {
                if(viruses[i].latitude && viruses[i].longitude)
                {
                    ebola_array.push(Math.round(viruses[i].latitude));
                    ebola_array.push(Math.round(viruses[i].longitude));
                    ebola_array.push(0.5);
                    console.log("ebola array" + ebola_array);
                }

            }
            else if(viruses[i].virus_type.virus_type == "Malaria")
            {   
                if(viruses[i].latitude && viruses[i].longitude)
                {
                    malaria_array.push(Math.round(viruses[i].latitude));
                    malaria_array.push(Math.round(viruses[i].longitude));
                    malaria_array.push(0.5);
                    console.log("malaria array" + malaria_array);
                }

            }
            else if(viruses[i].virus_type.virus_type == "Measles")
            {
                if(viruses[i].latitude && viruses[i].longitude)
                {
                    measles_array.push(Math.round(viruses[i].latitude));
                    measles_array.push(Math.round(viruses[i].longitude));
                    measles_array.push(0.5);
                    console.log("measles array" + measles_array);
                }

            }
        }

        var virus_array = [["Ebola", ebola_array], ["Malaria", malaria_array], ["Measles", measles_array]];
        console.log('virus array' + virus_array);

        for(i = 0; i < virus_array.length; i++)
        {
            console.log(virus_array[i]);

        }     
        
        res.json(virus_array);
 
});
});  
    
app.post('/globe', function(req, res) {

    if(req.body.formType == "login")
    {
 
     if(!req.body.username || !req.body.password)
     { 
        req.flash('message', 'Please fill out everything!');
        req.flash('username-login', req.body.username);
        req.flash('password-login', req.body.password);  
        res.redirect('/');  
         
     }
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
                include: [{model: User, required: true}, {model:Virus_Type, required: true}],
                order:'date DESC'
                
            }).then(function(viruses){
            
                console.log("viruses");
                console.log(viruses);
            
            success = myCache.set( "viruses", viruses, 6000);
            myCache.set("currentUser", loggedInUser, 6000);
            res.render('index', {
                user: loggedInUser, viruses: viruses
            });       
                         


                      
        });
        }
        else
        {
            
            req.flash('message', 'Login Failed!');
            req.flash('username-login', req.body.username);
            req.flash('password-login', req.body.password);
            res.redirect('/');           

        }
     });
        
    }
    else if(req.body.formType == "signUp")
    {
    
    //console.log(req.body.newUsername);
    if(!req.body.newUsername || !req.body.newPassword || !req.body.newPasswordRepeat)
    {
        
        req.flash('message', 'Please fill out all the form');
        req.flash('username-signup', req.body.newUsername);
        req.flash('password-signup', req.body.newPassword);
        req.flash('password-signup-repeat', req.body.newPasswordRepeat);
        req.flash('selector', 'signup');
        res.redirect('/'); 
        
    }
    else if(req.body.newPassword != req.body.newPasswordRepeat)
    {
      
        req.flash('message', 'Passwords don not match!');
        req.flash('username-signup', req.body.newUsername);
        req.flash('password-signup', req.body.newPassword);
        req.flash('password-signup-repeat', req.body.newPasswordRepeat);
        req.flash('selector', 'signup');
        res.redirect('/');
        
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
                    
                    req.flash('message', 'User already exists!');
                    req.flash('username-signup', req.body.newUsername);
                    req.flash('password-signup', req.body.newPassword);
                    req.flash('password-signup-repeat', req.body.newPasswordRepeat);                    
                    res.redirect('/');
                    
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
                        include: [{model: User, required: true},{model:Virus_Type, required: true}],
                        order:'date DESC'
                    }).then(function(viruses){
                    console.log(viruses);

                    //res.send(viruses);
                    myCache.set( "viruses", viruses, 6000);
                    myCache.set("currentUser", newUser, 6000);
                    //res.send({'viruses': viruses});
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

app.get('/globe/api/get_comments', function(req, res) {
   

        console.log(req);
        User.hasMany(Comment, {foreignKey: 'id_user'});
        Comment.belongsTo(User, {foreignKey: 'id_user'});
        //Virus.hasMany(Virus_type, {foreignKey: 'virus_type_id'});
        //Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});
        //Virus.hasMany(Comment, {foreignKey: 'virus_id'});
        //Comment.belongsTo(Virus, {foreignKey: 'virus_id'});
        virus_id = req.query.virus_id;
        Comment.findAll({ 
        where: {
          virus_id: virus_id
        },include: [{model: User, required: true}],
        }).then(function(comments) {
            res.json(comments);
        });
});

app.get('/globe/api/send_comment', function(req, res) {
   
    var newComment = Comment.build();
    newComment.comment = req.query.comment;
    newComment.virus_id = req.query.virus_id;
    newComment.id_user = req.query.user_id;
    newComment.save().then(function(newUser) { 
    User.hasMany(Comment, {foreignKey: 'id_user'});
    Comment.belongsTo(User, {foreignKey: 'id_user'});        
    Comment.findAll({ 
        where: {
          virus_id: req.query.virus_id
        },include: [{model: User, required: true}]
        }).then(function(comments) {
            res.json(comments);
        });
    });
});

app.get('/globe/api/remove_user', function(req, res) {
   
    cachedCurrentUser = myCache.get( "currentUser" );

    if(cachedCurrentUser)
    {
        console.log(req);

        user_id = req.query.user_id;

        User.destroy({ 
        where: {
          id: user_id
        }
        }).then(function(succcess) {

        });
    }
});

app.get('/globe/admin', function(req, res) {
    
    User.hasMany(Virus, {foreignKey: 'user_id'});
   
    Virus.belongsTo(User, {foreignKey: 'user_id'});
    Virus_Type.hasMany(Virus, {foreignKey: 'virus_type_id'});
    Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});
    
    User.findAll({
        //include: [{model: User, required: true}, {model:Virus_Type, required: true}],
        order:'username ASC'

    }).then(function(users)
    {

    res.render('admin', {
        users: users
    });                  
 
    });
    
});

app.get('/send', function(req, res) {
   
    res.redirect('/globe');    
    
});


app.post('/send', function(req, res){ // Specifies which URL to listen for

    cachedCurrentUser = myCache.get( "currentUser" );
    //if(cachedCurrentUser)
    //{
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
    tempLat = Math.round(req.body.latitude);
    newVirus.latitude = tempLat.toString();
    tempLng = Math.round(req.body.longitude);
    newVirus.longitude = tempLng.toString();
    newVirus.location = req.body.location;    
    newVirus.user_id = req.body.userId;
    newVirus.date = currentDate;
    newVirus.save().then(function() {
        
        //console.log(cachedCurrentUser); 
            User.hasMany(Virus, {foreignKey: 'user_id'});
            Virus.belongsTo(User, {foreignKey: 'user_id'});
            Virus_Type.hasMany(Virus, {foreignKey: 'virus_type_id'});
            Virus.belongsTo(Virus_Type, {foreignKey: 'virus_type_id'});
            
            Virus.findAll({
                include: [{model: User, required: true}, {model:Virus_Type, required: true}],
                order:'date DESC'
                
            }).then(function(viruses){
            console.log("viruses");
            console.log(viruses);
            
            //success = myCache.set( "viruses", viruses, 6000);
            //myCache.set("currentUser", loggedInUser, 1000);
            console.log(success);
            res.render('index', {
                user: cachedCurrentUser, viruses: viruses
            }); 
                      
        });   
        
        
    });
    
    //}
    //else {
        
         //res.redirect('/');  
         
    //} 

});

app.listen(3000, function() {
    
    console.log('listening on localhost:3000');
    
});
