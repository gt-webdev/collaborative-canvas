(function() {
  function startup() {
    // Drawing stuff
    var clickX = [], clickY = [], clickDrag = [];
    var paint = false;
    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');

    // Join room form
    var roomUrlInput = document.getElementById('room-url');
    var joinButton = document.getElementById('join-button');

    // Socket.io
    var socket;
    
    canvas.setAttribute("width", 600);
    canvas.setAttribute("height", 600);
    
    // Start drawing when clicked
    canvas.addEventListener('mousedown', function(e) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      
      paint = true;
      addClick(mouseX, mouseY);
      redraw();
    });
    
    // Keep drawing when dragged
    canvas.addEventListener('mousemove', function(e) {
      if (paint) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        
        addClick(mouseX, mouseY, true);
        redraw();
      }
    });
    
    // Stop drawing when released
    canvas.addEventListener('mouseup', function() {
      paint = false;
    });

    // Stop drawing when pointer leaves canvas
    canvas.addEventListener('mouseleave', function() {
      paint = false;
    });
    
    // Record a pixel
    function addClick(x, y, dragging, fromServer) {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);

      // If we are in a room, send drawing to server
      if (!fromServer && socket) {
        socket.emit('addClick', {
          x: x,
          y: y,
          dragging: dragging
        });
      }
    }
    
    // Draw entire screen
    function redraw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;
      
      for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
          context.moveTo(clickX[i-1], clickY[i-1]);
        } else {
          context.moveTo(clickX[i]-1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
      }
    }

    // Join the room
    socket = io.connect(location.origin);
    if (socket) {
      socket.on('initCanvas', function(data) {
        clickX = data.clickX;
        clickY = data.clickY;
        clickDrag = data.clickDrag;
        redraw();
      });

      socket.on('draw', function(data) {
        addClick(data.x, data.y, data.dragging, true);
        redraw();
      });
    }
  }
  
  window.addEventListener('load', startup);
})();

