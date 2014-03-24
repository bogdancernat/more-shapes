var canvas
  , context
  , objects    = []
  , noObj      = 3
  , golden     = 1.618033988749895
  , canvasBg   = (new RColor).get(false, 0.15, 0.90)
  , lastPos    = {x: null, y: null}
  , visionBase = []
  , play       = true
  ;

function getRadians (angle) {
  return angle * Math.PI/180;
}

function distAB (x1,y1,x2,y2) {
  return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}

function getCoordsAngleDist (angle, distance){
  var rad = getRadians(angle)
    , c
    ;
  c = {
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance
    }
  return c;
}

var simpleObj = function(){
  var o = {
    points: [], /* el: {x:val, y:val, angle: val} */
    center: {x: null, y: null}, /* center of circle containing  */
    radius: null,
    color: []
  };
  return o;
};

function animate(){
  requestAnimFrame(animate);
  draw();
}

function clear(){
  context.fillStyle = 'rgba('+canvasBg[0]+','+canvasBg[1]+','+canvasBg[2]+', 0.6)';
  context.fillRect(0, 0, canvas.width,canvas.height);
}

function draw(){
  clear();
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    context.beginPath(); 
    context.fillStyle = 'rgba('+obj.color[0]+','+obj.color[1]+','+obj.color[2]+',0.4)';
    for (var j = 0; j < obj.points.length; j++) {
      var x = obj.center.x+ obj.points[j].x
        , y = obj.center.y+ obj.points[j].y
        ;
      if (j==0) {
        context.moveTo(x,y);
      } else {
        context.lineTo(x,y);
      } 
    };
    context.closePath();
    context.fill();
    context.stroke();
  };

  updateObjects();
}

function mouseMoving(e){
  // console.log(e);
  lastPos.x = e.offsetX;
  lastPos.y = e.offsetY;
  for (var i = 0; i < objects.length; i++) {
    var o = objects[i]
      , tri_base = o.radius*2
      , tri_height = distAB(lastPos.x, lastPos.y, o.center.x, o.center.y)
      , tri_lat = Math.sqrt(Math.pow(tri_height,2)+ Math.pow(o.radius,2))
      ;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(o.center.x,o.center.y);
    context.lineTo(lastPos.x, lastPos.y);
    context.stroke();

    context.beginPath();
    context.arc(o.center.x,
                o.center.y,
                o.radius,
                0,
                Math.PI*2,
                true);
    context.stroke();

  };
  if(!play){
    draw();
  }
}

function updateObjects(){
  for (var i = 0; i < objects.length; i++) {
    var o = objects[i];
    rotateObject(o, o.rotSpeed);
  };
}

function rotateObject (obj, rotation){
  for (var i = 0; i < obj.points.length; i++) {
    var angle = (obj.points[i].angle + rotation) % 360
      ;
    var c = getCoordsAngleDist(angle, obj.radius);
    obj.points[i].x = c.x;
    obj.points[i].y = c.y;
    obj.points[i].angle = angle;
  };
}

function createObjects(){
  for (var i = 0; i < noObj; i++) {
    var cont   = 0
      , max    = 9
      , o      = simpleObj()
      , radius = Math.random() * 175 + 30  
      ;
    o.center = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    };
    // console.log(o.center);
    while(cont<max){
      var slice = 360/max
        , angle = Math.random()*(slice/3) + slice*cont
        , c     = getCoordsAngleDist(angle, radius)
        , point = {
          x: c.x, 
          y: c.y,
          angle: angle
        }
      o.points.push(point);
      cont++;
    }
    o.radius   = radius;
    o.color    = (new RColor).get(false, 0.75, 0.93);
    o.rotSpeed = Math.random();
    objects.push(o);
  };
} 


function canvasResize(){
  canvas.height = window.innerHeight-4;
  canvas.width  = window.innerWidth;
}


function init(){
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
            };
  })();
  canvas  = document.querySelector('#canvas');
  canvasResize();
  context = canvas.getContext('2d');
  createObjects();
  window.onresize = canvasResize;
  window.addEventListener('mousemove', mouseMoving);
  if(play){
    animate();
  } else {
    draw();
  }
}

window.onload = init;
