var User = require('../models/user');
var expect = require('expect.js');
var assert = require("assert");
var express = require('../app.js');
var supertest = require('supertest');
var api = supertest('http://localhost:3000');
/*
it('should return a 200 response', function(done) {
    api.get('/globe/api.json').set('Accept', 'application/json').expect(200, done);
    
    
});
*/
it('The globe API should return the right data', function(done) {
    api.get('/globe/api.json').set('Accept', 'application/json').expect(200).end(
            function(err, res) {
                expect(res.body.measles);
                expect(res.body.ebola);
                expect(res.body.malaria);
                done();
            });
});

it('The api should get comment', function(done) {
    api.get('/globe/get_comments?virus_id=98').set('Accept', 'application/json').expect(200).end(
            function(err, res) {
                expect(res.body[0]);
                done();
            });
});

describe("Save new user test", function(){  

    var savedUser;
    var newUser = User.build();
    newUser.username = "bob";
    newUser.password = "bob";
    newUser.save().then(function(success) {
        savedUser = success;
    }).catch(function(error) {
    
    });
  
    beforeEach(function(done){     
        setTimeout(function(){            
        done();     
        }, 500);   
    });   
   
    it("The saved user should have username: bob and password: bob", function(){
        
        assert(savedUser.username === "bob");
        assert(savedUser.password === "bob");
        
    });
  
});

describe("User find test", function(){  

  var expectedUser;
  User.find({
    where: {
        username: "tom",
        password: "tom"
               }
    }).then(function(loggedInUser) { 
        expectedLoggedInUser = loggedInUser;
        expectedUser = loggedInUser;
    });
  
  beforeEach(function(done){     
     setTimeout(function(){            
       done();     
     }, 500);   
  });   
   
  it("The returned user should have username: tom", function(){    
    assert(expectedUser.username === "tom");
  });
  
});
