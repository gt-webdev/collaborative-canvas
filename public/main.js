(function() {
  function startup() {
    // Drawing stuff
    var clickX = [], clickY = [], clickDrag = [];
    var canvasData = {};
    var paint = false;
    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');

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
    function addClick(x, y, dragging, userId) {
      userId = userId || "me";

      if (!canvasData[userId]) {
        canvasData[userId] = {
          clickX: [],
          clickY: [],
          clickDrag: []
        }
      }

      canvasData[userId].clickX.push(x);
      canvasData[userId].clickY.push(y);
      canvasData[userId].clickDrag.push(dragging);

      // If we are drawing and we are in a room, send drawing to server
      if (userId == "me" && socket) {
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
      
      var users = Object.keys(canvasData);

      for (var j = 0; j < users.length; j++) {
        var clickX = canvasData[users[j]].clickX;
        var clickY = canvasData[users[j]].clickY;
        var clickDrag = canvasData[users[j]].clickDrag;

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
    }

    // Join the room
    socket = io.connect(location.origin);
    if (socket) {
      socket.on('initCanvas', function(data) {
        canvasData = {};

        for (var i = 0; i < data.clickX.length; i++) {
          if (!canvasData[data.user]) {
            canvasData[data.user] = {
              clickX: [],
              clickY: [],
              clickDrag: []
            }
          }

          canvasData[data.user].clickX.push(data.clickX[i]);
          canvasData[data.user].clickY.push(data.clickY[i]);
          canvasData[data.user].clickDrag.push(data.clickDrag[i]);
        }

        redraw();
      });

      socket.on('draw', function(data) {
        addClick(data.x, data.y, data.dragging, data.user);
        redraw();
      });
    }
  }
  
  window.addEventListener('load', startup);
})();

