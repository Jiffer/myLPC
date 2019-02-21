// HTTP PORTION

var http = require('http');
var fs = require('fs');
var httpServer = http.createServer(requestHandler);
var url = require('url');
httpServer.listen(8000);

// keep track of how many people are on
var clients = 0;

function requestHandler(req, res) {

	var parsedUrl = url.parse(req.url);
	console.log("The Request is: " + parsedUrl.pathname);
		
	fs.readFile(__dirname + parsedUrl.pathname, 
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end('Error loading ' + parsedUrl.pathname);
			}
			res.writeHead(200);
			res.end(data);
  		}
  	);
}


// WEBSOCKET PORTION

var io = require('socket.io').listen(httpServer);

io.sockets.on('connection', 

	function (socket) {
		console.log('A user connected');
		clients++;

		socket.emit('newclientconnect',{ description: 'Heyo, welcome!', voices: clients}); // tell the new guy how many voices are neededgonna
		socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
		socket.on('disconnect', function () {
			clients--;
			socket.broadcast.emit('clientleft',{ description: clients + ' clients connected!'})
		});
	
		console.log("We have a new client: " + socket.id);
		
		///MY SOCKET EVENTS HERE
		//listen for 'drawing' event from client
		socket.on('drawing', function(data){
			//console log to make sure we're getting data
			// console.log(data);

			//send this drawing data to EVERYONE
			//don't need to send back to the client it came from
			socket.broadcast.emit('otherdrawing', data);
		});



		// 
		socket.on('disconnect', function() {
			console.log("Client has disconnected " + socket.id);
			
		});
	}
);