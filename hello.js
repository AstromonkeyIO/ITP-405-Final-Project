function hello() {

	console.log("hello");

}

module.exports = {

	hello: function() {
		return 'hello';
	},

	goodBye: function() {
		return 'goodBye';
	}

}