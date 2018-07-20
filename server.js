var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

	
var tops = [];
var jungles = [];
var mids = [];
var bots = [];
var supports = [];

var gameMaker = setInterval(function() {
	if(tops.length > 1 && jungles.length > 1 && mids.length > 1 && bots.length > 1 && supports.length > 1)
	{
		tops = shuffle(tops);
		jungles = shuffle(jungles);
		mids = shuffle(mids);
		bots = shuffle(bots);
		supports = shuffle(supports);
		var red = tops[0].name + ", " + jungles[0].name + ", " + mids[0].name + ", " + bots[0].name + ", " + supports[0].name;
		var blue = tops[1].name + ", " + jungles[1].name + ", " + mids[1].name + ", " + bots[1].name + ", " + supports[1].name;
		for(var i = 0; i < 2; i++)
		{
			tops[i].socket.emit("teams", red + ":" + blue);
			jungles[i].socket.emit("teams", red + ":" + blue);
			mids[i].socket.emit("teams", red + ":" + blue);
			bots[i].socket.emit("teams", red + ":" + blue);
			supports[i].socket.emit("teams", red + ":" + blue);
		}
		tops.splice(0, 2);
		jungles.splice(0, 2);
		mids.splice(0, 2);
		bots.splice(0, 2);
		supports.splice(0, 2);
	}
}, 15*1000);


app.get('/', function(req, res)
{
  res.sendFile(__dirname + '/index.html');
});

http.listen(8080, function()
{
	console.log('listening on *:8080');
});
io.on('connection', function(socket)
{
	var name = "";
	var role = "";
	console.log('user connected');
	socket.on('disconnect', function()
	{
		if(name != "" && role != "")
		{
			if(role === "Tops")
			{
				var index = tops.map(function(e) {return e.name;}).indexOf(name);
				if(index != -1)
					tops.splice(index, 1);
			}
			else if(splitted[1] === "Jungles")
			{
				var index = jungles.map(function(e) {return e.name;}).indexOf(name);
				if(index != -1)
					jungles.splice(index, 1);
			}
			else if(splitted[1] === "Mids")
			{
				var index = mids.map(function(e) {return e.name;}).indexOf(name);
				if(index != -1)
					mids.splice(index, 1);
			}
			else if(splitted[1] === "Bots")
			{
				var index = bots.map(function(e) {return e.name;}).indexOf(name);
				if(index != -1)
					bots.splice(index, 1);
			}
			else if(splitted[1] === "Supports")
			{
				var index = supports.map(function(e) {return e.name;}).indexOf(name);
				if(index != -1)
					supports.splice(index, 1);
			}
		}
		console.log('user disconnected');
	});
	socket.on('enterqueue', function(msg)
	{
		var splitted = msg.split(" ");
		name = splitted[0];
		role = splitted[1];
		console.log(name + ' wants to join the queue with role ' + role);
		
		if(role === "Tops" && tops.map(function(e) {return e.name;}).indexOf(name) === -1)
			tops.push({"name": name, "socket": socket});
		else if(role === "Jungles" && jungles.map(function(e) {return e.name;}).indexOf(name) === -1)
			jungles.push({"name": name, "socket": socket});
		else if(role === "Mids" && mids.map(function(e) {return e.name;}).indexOf(name) === -1)
			mids.push({"name": name, "socket": socket});
		else if(role === "Bots" && bots.map(function(e) {return e.name;}).indexOf(name) === -1)
			bots.push({"name": name, "socket": socket});
		else if (role === "Supports" && supports.map(function(e) {return e.name;}).indexOf(name) === -1)
			supports.push({"name": name, "socket": socket});
		else
		{
			socket.emit('inqueue', "");
			console.log('Already in queue!!!');
		}
	});
	socket.on('exitqueue', function(msg)
	{
		var splitted = msg.split(" ");
		console.log(splitted[0] + ' wants to leave the queue.');
		if(splitted[1] === "Tops")
		{
			var index = tops.map(function(e) {return e.name;}).indexOf(splitted[0]);
			if(index != -1)
				tops.splice(index, 1);
			else
				socket.emit('nqueue', "You aren't in queue!");
		}
		else if(splitted[1] === "Jungles")
		{
			var index = jungles.map(function(e) {return e.name;}).indexOf(splitted[0]);
			if(index != -1)
				jungles.splice(index, 1);
			else
				socket.emit('nqueue', "You aren't in queue!");
		}
		else if(splitted[1] === "Mids")
		{
			var index = mids.map(function(e) {return e.name;}).indexOf(splitted[0]);
			if(index != -1)
				mids.splice(index, 1);
			else
				socket.emit('nqueue', "You aren't in queue!");
		}
		else if(splitted[1] === "Bots")
		{
			var index = bots.map(function(e) {return e.name;}).indexOf(splitted[0]);
			if(index != -1)
				bots.splice(index, 1);
			else
				socket.emit('nqueue', "You aren't in queue!");
		}
		else if(splitted[1] === "Supports")
		{
			var index = supports.map(function(e) {return e.name;}).indexOf(splitted[0]);
			if(index != -1)
				supports.splice(index, 1);
			else
				socket.emit('nqueue', "You aren't in queue!");
		}
	});
	socket.on('error', function(err) 
	{
		console.log(err);
	});

});
//Helper function
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

