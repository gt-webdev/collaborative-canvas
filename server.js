var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.sockets.on('connection', function(socket) {
  socket.on('addClick', function(data) {
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
