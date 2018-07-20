var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

	
var tops = [];
var jungles = [];
var mids = [];
var adcs = [];
var supports = [];

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
	console.log(socket.id + ' connected');
	socket.on('disconnect', function()
	{
		console.log(socket.id + ' disconnected');
	});
	socket.on('enterqueue', function(msg)
	{
		console.log(socket.id + ' joined queue with name and role ' + msg);
		var splitted = msg.split(" ");
		if(splitted[1] === "Tops" && tops.indexOf(splitted[0]) > -1)
			tops.push(splitted[0]);
		else if(splitted[1] === "Jungles" && jungles.indexOf(splitted[0]) > -1)
			jungles.push(splitted[0]);
		else if(splitted[1] === "Mids" && mids.indexOf(splitted[0]) > -1)
			mids.push(splitted[0]);
		else if(splitted[1] === "Bots" && bots.indexOf(splitted[0]) > -1)
			bots.push(splitted[0]);
		else if (splitted[1] === "Supports" && supports.indexOf(splitted[0] > -1)
			supports.push(splitted[0]);
		else
			socket.emit("error", "You are already in queue or chose an invalid role!");
	});

});

