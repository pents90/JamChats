
var users = [];

////

var fs = require('fs');
var httpServer = require('http').createServer(function(req, response){ 
	fs.readFile('index.html', function(err, data) {
	response.writeHead(200, {'Content-Type':'text/html'});
	response.write(data);
	response.end();
	});
});
console.log("( ( T U N E . T A L K ) )");
var port = process.env.PORT || 8080;
httpServer.listen(port);

var nowjs = require("now");
var everyone = nowjs.initialize(httpServer);

nowjs.on('disconnect', function() {
	delete users[this.now.name];
});

everyone.now.join = function(artist) {
	// todo - add artist -> group mapping
	var userid = this.user.clientId;
	// todo - set name on client
	var name = this.now.name;
	console.log("User '" + userid + "' joining with artist '" + artist + "'.");
	// todo - implement client
	this.now.forumInfo(users);
	users.push(name);
	// todo - implement client
	everyone.now.userJoined(name);
}

everyone.now.sendMessage = function(text) {
	var name = this.now.name;
	console.log("User '" + name + "' posts '" + text + "'.");
	// todo - implement client
	everyone.now.receiveMessage(name, text);
}

////