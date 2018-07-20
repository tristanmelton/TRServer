var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

	
var tops = [];
var jungles = [];
var mids = [];
var adcs = [];
var supports = [];

var gameMaker = setInterval(function() {
	if(tops.length > 1 && jungles.length > 1 && mids.length > 1 && adcs.length > 1 && supports.length > 1)
	{
		tops = shuffle(tops);
		jungles = shuffle(jungles);
		mids = shuffle(mids);
		bots = shuffle(bots);
		supports = shuffle(supports);
		var red = tops[0].name + ", " + jungles[0].name + ", " + mids[0].name + ", " + bots[0].name + ", " + supports[0].name;
		var blue = tops[1].name + ", " + jungles[1].name + ", " + mids[1].name + ", " + bots[0].name + ", " + supports[1].name;
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
	console.log('user connected');
	socket.on('disconnect', function()
	{
		console.log('user disconnected');
	});
	socket.on('enterqueue', function(msg)
	{
		var splitted = msg.split(" ");
		console.log(splitted[0] + ' wants to join the queue with role ' + splitted[1]);
		
		if(splitted[1] === "Tops" && tops.map(function(e) {return e.name;}).indexOf(splitted[0]) === -1)
			tops.push({"name": splitted[0], "socket": socket});
		else if(splitted[1] === "Jungles" && jungles.map(function(e) {return e.name;}).indexOf(splitted[0]) === -1)
			jungles.push({"name": splitted[0], "socket": socket});
		else if(splitted[1] === "Mids" && mids.map(function(e) {return e.name;}).indexOf(splitted[0]) === -1)
			mids.push({"name": splitted[0], "socket": socket});
		else if(splitted[1] === "Bots" && bots.map(function(e) {return e.name;}).indexOf(splitted[0]) === -1)
			bots.push({"name": splitted[0], "socket": socket});
		else if (splitted[1] === "Supports" && supports.map(function(e) {return e.name;}).indexOf(splitted[0]) === -1)
			supports.push({"name": splitted[0], "socket": socket});
		else
		{
			socket.emit('inqueue', "");
			console.log('Already in queue!!!');
		}
		console.log(tops.length);
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

