// ============================================
// Hero Animated Background
// Self-contained — injects its own canvas
// No HTML changes required
// ============================================
(function () {
    "use strict";
  
    var hero = document.querySelector(".hero");
    if (!hero) return;
  
    // Create and inject canvas
    var canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;";
    hero.insertBefore(canvas, hero.firstChild);
  
    var ctx = canvas.getContext("2d");
    var width, height;
    var nodes = [];
    var NODE_COUNT = 50;
    var CONNECT_DIST = 130;
    var rafId;
  
    // Grid cells config
    var CELL_SIZE = 60;
    var gridOpacity = 0.025;
  
    function resize() {
      width = canvas.width = hero.offsetWidth;
      height = canvas.height = hero.offsetHeight;
    }
  
    function initNodes() {
      nodes = [];
      var count = width < 768 ? 30 : NODE_COUNT;
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.8 + 0.6,
          alpha: Math.random() * 0.35 + 0.1,
        });
      }
    }
  
    function drawGrid() {
      ctx.strokeStyle = "rgba(255,255,255," + gridOpacity + ")";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (var x = 0; x < width; x += CELL_SIZE) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (var y = 0; y < height; y += CELL_SIZE) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
  
    function drawNodes() {
      // Connections
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var dx = nodes[i].x - nodes[j].x;
          var dy = nodes[i].y - nodes[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            var opacity = (1 - dist / CONNECT_DIST) * 0.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = "rgba(255,255,255," + opacity + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
  
      // Dots
      for (var k = 0; k < nodes.length; k++) {
        var n = nodes[k];
        n.x += n.vx;
        n.y += n.vy;
  
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
  
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255," + n.alpha + ")";
        ctx.fill();
      }
    }
  
    function frame() {
      ctx.clearRect(0, 0, width, height);
      drawGrid();
      drawNodes();
      rafId = requestAnimationFrame(frame);
    }
  
    // Init
    resize();
    initNodes();
    frame();
  
    // Resize handling
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        initNodes();
      }, 300);
    });
  
    // Pause when tab not visible
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        frame();
      }
    });
  })();