"use strict";
// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'trserver';
// Port where we'll run the websocket server
var webSocketsServerPort = 8080;
// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [ ];
var cusers = [ ];
/**
 * HTTP server
 */
var server = http.createServer(function(request, response) 
{
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
server.listen(webSocketsServerPort, function() 
{
	console.log((new Date()) + " Server is listening on port "
      + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer(
{
	// WebSocket server is tied to a HTTP server. WebSocket
	// request is just an enhanced HTTP request. For more info 
	// http://tools.ietf.org/html/rfc6455#page-6
	httpServer: server
});
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) 
{
	console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');
	// accept connection - you should check 'request.origin' to
	// make sure that client is connecting from your website
	// (http://en.wikipedia.org/wiki/Same_origin_policy)
	var connection = request.accept(null, request.origin); 
	// we need to know client index to remove them on 'close' event
	var index = clients.push(connection) - 1;

	console.log((new Date()) + ' Connection accepted.');
	// user sent some message
	connection.on('message', function(message)
	{
		if (message.type === 'utf8') 
		{ // accept only text
			var components = message.split(" ");
			// first message sent by user is their name
			if (components[0] === "iconn")
			{
				// remember user name
				cusers.push(components[1]);

				console.log((new Date()) + ' User is known as: ' + components[1]
						+ ' with ' + components[2] + ' role.');
			}
			else if(components[0] === "leave")
			{
				// drop from queue
			
				for (var i=0; i < clients.length; i++) 
				{
					clients[i].sendUTF(json);
				}
			}
		}
	});
	// user disconnected
	connection.on('close', function(connection)
	{
		if (userName !== false && userColor !== false)
		{
			console.log((new Date()) + " Peer "
			+ connection.remoteAddress + " disconnected.");
			// remove user from the list of connected clients
		clients.splice(index, 1);
		cusers.splice(index, 1);
		}
	});
});