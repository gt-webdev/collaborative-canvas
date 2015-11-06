var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Store canvas on server to download canvas when a client connects
var clickX = [], clickY = [], clickDrag = [];

io.sockets.on('connection', function(socket) {
  socket.emit('initCanvas', {
  	clickX: clickX,
  	clickY: clickY,
  	clickDrag, clickDrag
  });

  socket.on('addClick', function(data) {
  	clickX.push(data.x);
  	clickY.push(data.y);
  	clickDrag.push(data.dragging);

    socket.broadcast.emit('draw', {
      x: data.x,
      y: data.y,
      dragging: data.dragging
    });
  });
});

app.use(express.static('public/'));

http.listen(8080, function() {
  console.log('listening on *:8080');
});
