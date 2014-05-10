var express = require('express')
	, app = express()
  	, server = require('http').createServer(app)
  	, io = require('socket.io').listen(server,{ log: false });

var port = 5566;

//static files
app.use(express.static(__dirname+"/client/js"));
app.use(express.static(__dirname+"/client/assets"));
app.use(express.static(__dirname+"/client/css"));

//server
server.listen(port);

//send game index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/gameclient.html');
});

io.sockets.on('connection', function (socket) {

	//show all clients
	//console.log(io.sockets.clients());

	//connect success message and all players data
  	socket.emit('clientConnect', { message: 'connect success!' });

  	//broadcast(except current socket) to add player
  	socket.broadcast.emit('newClientConnect', { id:socket.id,message: 'new client connect!' });

  	socket.on('clientStateChange', function (data) {
  		//broadcast(except current socket) to update players states
  		socket.broadcast.emit('otherClientStateChange', { id:socket.id,state:data });
  	});

    socket.on('clientDialogChange',function(data)
    {
       socket.broadcast.emit('otherClientDialogChange', { id:socket.id,state:data });

    });

    socket.on('clientSendInstruction', function (data) {
      //broadcast(except current socket) to update players instruction
      socket.broadcast.emit('otherClientSendInstruction', { id:socket.id,state:data });
    });

  	//disconnect
  	socket.on('disconnect',function(){
  		console.log(socket.id+' disconnect!');
  		socket.broadcast.emit('newClientDisconnect', { id:socket.id,message: "one client disconnect!"});
  	});

});
