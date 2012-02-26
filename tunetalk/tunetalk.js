
var users = {};

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

function removeUserFromList(name, groupName) {
	if (groupName) {
		var group = nowjs.getGroup(groupName);
		group.now.userLeft(name);
	}
	var userList = users[groupName];
	if (userList) {
		var index = userList.indexOf(name);
        if (index >= 0) {
            userList.splice(index, 1);
        }
	}
}

everyone.now.usernames = [{"bogus": "bogus"}];

nowjs.on('disconnect', function() {
	var groupName = this.now.group;
	var name = this.now.name;
	console.log("User '" + name + "' left.");
	removeUserFromList(name, groupName);
	console.log("Users now:");
	console.log(users);
});

everyone.now.join = function(artist) {
	var group = nowjs.getGroup(artist);	
	var userid = this.user.clientId;
	var name = this.now.name;
	console.log("User '" + userid + "' joining with artist '" + artist + "'.");
	if (artist == this.now.group) {
		// Already in this group
		return;
	} else if (!(typeof this.now.group === "undefined")) {
		removeUserFromList(name, this.now.group);
		console.log(" (Removing from '" + this.now.group + "' first)");
		nowjs.getGroup(this.now.group).removeUser(userid);
	}
	group.addUser(userid);
	var groupList = users[artist];
	if (!groupList) {
		groupList = [];
	}
	group.now.forumInfo(groupList);
	groupList.push(this.now.name);
	users[artist] = groupList;
	this.now.group = artist;
	group.now.userJoined(name);
	console.log("Users now:");
	console.log(users);
}

everyone.now.sendMessage = function(text) {
	var name = this.now.name;
	console.log("User '" + everyone.now.usernames[name] + "' posts '" + text + "'.");
	var groupName = this.now.group;
	var group = nowjs.getGroup(groupName);
	if (group) {
		group.now.receiveMessage(everyone.now.usernames[name], text);
	}
}

everyone.now.setUsername = function(username) {
	console.log(this.now.name+" is now known as "+username);
	this.now.username = username;
	this.now.nameUpdate(this.now.name, username);
	everyone.now.usernames[this.now.name] = username;
	console.log("Name array says: "+everyone.now.usernames[this.now.name]);
}

////