var http = require('http');

console.log("yooo");

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');


var cat = {
  name: "dog", type:"brown"
    
};


var cat = function(name) {
    
    this.doo = name;

};

cat.prototype.changeName = function(newName) {
    
    this.doo = newName;
    
}

var newCat = new cat("cool");
console.log(cat.doo);
newCat.changeName("cool man");
console.log(newCat.doo);




