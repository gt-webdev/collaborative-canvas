// Code goes here
(function() {
  function startup() {
    var clickX = [], clickY = [], clickDrag = [];
    var paint = false;
    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');
    
    canvas.setAttribute("width", 300);
    canvas.setAttribute("height", 300);
    
    canvas.addEventListener('mousedown', function(e) {
      var mouseX = e.pageX - this.offsetLeft;
      var mouseY = e.pageY - this.offsetTop;
      
      paint = true;
      addClick(mouseX, mouseY);
      redraw();
    });
    
    canvas.addEventListener('mousemove', function(e) {
      if (paint) {
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        
        addClick(mouseX, mouseY, true);
        redraw();
      }
    });
    
    canvas.addEventListener('mouseup', function() {
      paint = false;
    });
    
    canvas.addEventListener('mouseleave', function() {
      paint = false;
    });
    
    function addClick(x, y, dragging) {
      clickX.push(x);
      clickY.push(y);
      clickDrag.push(dragging);
    }
    
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
  }
  
  window.addEventListener('load', startup);
})();

