/**
 * Author: Geoffrey Golliher
 * brokenway@gmail.com
 */

// not so happy with the global namespace .. try to use CartoonNamespace :)
var WIDTH = 900;
var HEIGHT = 600;
var canvasHelper;
var colors = new Array('red', 'blue', 'green', 'orange', 'black', 'white');
var shapes = new Array('rays', 'square', 'circle', 'triangle', 'burst', 'star', 'line', 'heart');
var lines = new Array('1', '2', '3', '4', '5', '6');
var next = undefined;
var toffset = 30;
var oType = 'line';
var tdata = new Array();
var fps = 33;

CartoonNamespace = {};

CartoonNamespace.extend = function(subClass, baseClass) {
  function inheritance() {}
  inheritance.prototype = baseClass.prototype;

  subClass.prototype = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.baseConstructor = baseClass;
  subClass.superClass = baseClass.prototype;
};

function CanvasHelper(ca, parent) {
  this.canvi = ca;
  this.context = undefined;
  this.canvas = undefined;
  this.tcontext = undefined;
  this.tcanvas = undefined;
  this.width = undefined;
  this.height = undefined;
  this.px;
  this.py;
  this.interval = undefined;
  addListener = this.addListener;
  this.cnum = 0;
  this.parent = parent;
  this.lineWidth = 1;
  this.cartoonDiv = undefined;
  this.pcolor = 'black';
};

CanvasHelper.prototype.canvasStorage = function(w, h) {
  this.tcanvas = document.createElement('canvas');
  this.tcanvas.setAttribute('id', 'tcanvas');
  this.tcanvas.setAttribute('width', w);
  this.tcanvas.setAttribute('height', h);
  this.tcanvas.setAttribute('style', 'visibility:hidden;');
  this.tcontext = this.tcanvas.getContext('2d');
  return this.tcanvas;
};

CanvasHelper.prototype.createCanvas = function(w, h) {
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('id', 'canvas' + this.canvi.length);
  this.canvas.setAttribute('width', w);
  this.canvas.setAttribute('height', h);
  this.canvas.setAttribute('style', 'position:absolute;top:2px;left:2px;border:1px solid;');
  this.canvasStorage(w, h);
  this.context = this.canvas.getContext('2d');
  if(this.cnum > 0) {
    this.canvi.push(this.canvas);
    var oc = this.canvi[this.cnum - 1];
    this.setCurrentCanvas(this.canvas);
    oc.setAttribute('style', 'position:absolute;top:2px;left:2px;opacity:0.25');
    this.canvas.setAttribute('style', 'position:absolute;top:2px;left:2px;border:1px solid');
    if(this.cnum > 1) {
      var on = this.parent.firstChild;
      this.parent.removeChild(on);
    }
    this.parent.appendChild(this.canvas);
  } else {
    this.parent.appendChild(this.canvas);
    this.parent.appendChild(this.tcanvas);
    this.canvi.push(this.canvas);
  }
  
  this.width = w;
  this.height = h;
  this.cnum += 1;
  return this.parent;
};

CanvasHelper.prototype.shuffleCanvases = function() {
  // transfer the old canvas' properties here!
  var np = canvasHelper.createCanvas(canvasHelper.canvi[0].width,
                                     canvasHelper.canvi[0].height);
  canvasHelper.createKeyFrame();

  init();
  
};

// figuring this out is going to take some time.  Probably need to have objects in js.
// These objects can be moved about on the canvas.  Creating a new keyframe will create buffer
// frames with auto-tween/movement.  Objects created on the stage have to have a movement
// history for each one ... yikes.  Will need to have a context menu for the object.  The
// menu will have an option displayed to start recording the position change.

// Object library will need to exist to collect stage objects.

// Also, should think about a visual representation of frames and keyframes.  And ability to put
// the physics engine into the cartoon maker.
CanvasHelper.prototype.createKeyFrame = function() {
  var min = getsc().x;
  var max = xmax();
  var miny = getsc().y;
  var maxy = ymax();
};
  
CanvasHelper.prototype.setContext = function() {
  this.context = this.canvas.getContext('2d');
};

CanvasHelper.prototype.getCurrentContext = function() {
  return this.context;
};

CanvasHelper.prototype.setCurrentCanvas = function(cObject) {
  this.canvas = cObject;
};

CanvasHelper.prototype.pushCurrentCanvas = function() {
  this.canvi.push(this.canvas);
};

CanvasHelper.prototype.clearCanvas = function() {
  var ctx = canvasHelper.getCurrentContext();
  ctx.clearRect(0, 0, canvasHelper.width, canvasHelper.height);
};
  
CanvasHelper.prototype.getContext = function() {
  return this.context;
};

CanvasHelper.prototype.getInterval = function() {
  return this.interval;
};

CanvasHelper.prototype.setLineColor = function(c) {
  canvasHelper.pcolor = this.value;
  canvasHelper.context.strokeStyle = this.value;
  canvasHelper.context.fillStyle = this.value;
};

CanvasHelper.prototype.setLineSize = function(w) {
  var size = this.value.split(' ');
  canvasHelper.context.lineWidth = size[1];
};

CanvasHelper.prototype.setShape = function(e) {
  oType = this.value;
};

CanvasHelper.prototype.drawRays = function() {
  this.context.beginPath();
  this.context.moveTo(getsc().x, getsc().y);
 
  grad = this.context.createRadialGradient(getsc().x, getsc().y, 2, getx(), gety(), 10);
  mdiv = document.getElementById('measures');
  this.context.lineCap = "round";
  mdiv.innerHTML = 'start x: ' + getsc().x + ' start y: ' + getsc().y + ' x: ' + getx() + ' y: ' + gety();
  grad.addColorStop(0, canvasHelper.pcolor);
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.50)');
  this.context.strokeStyle = grad;
  this.context.lineTo(getx(), gety());
  this.context.stroke();
  this.context.strokeStyle = canvasHelper.pcolor;
  this.context.closePath();
};

CanvasHelper.prototype.drawLine = function() {
  this.context.beginPath();
  this.context.lineCap = "round";
  this.context.moveTo(getpx(), getpy());
  this.context.lineTo(getx(), gety());
  this.context.stroke();
  this.context.closePath();
};

CanvasHelper.prototype.drawSquare = function() {
  this.context.putImageData(tdata, 0, 0);
  this.context.beginPath();
  this.context.fillRect(getsc().x, getsc().y, getx() - getsc().x, gety() - getsc().y);
  //this.context.fillStyle = 
  this.context.closePath();
};

CanvasHelper.prototype.drawCircle = function () {
  this.context.putImageData(tdata, 0, 0);
  var X = Math.max(getsc().x, getx()) - Math.abs(getsc().x - getx())/2;
  var Y = Math.max(getsc().y ,gety()) - Math.abs(getsc().y - gety())/2;
  var R = Math.sqrt(Math.pow(getsc().x - getx(), 2) + Math.pow(getsc().y - gety(), 2));
  
  this.context.beginPath();
  this.context.arc(X, Y, R, 0, Math.PI*2, true);
  this.context.closePath();
  this.context.stroke();
};

CanvasHelper.prototype.drawHeart = function() {
  var n = 0;
  var dx = 0;
  var dy = 0;
  var cx = 0;
  var cy = 0;
  
  angle = 180;
  
  ctx = this.context;
  ctx.putImageData(tdata, 0, 0);
  
  inner = (Math.sqrt(Math.pow(getsc().x - getx(), 2) + Math.pow(getsc().y - gety(), 2))) / 2;
  outer = Math.sqrt(Math.pow(getsc().x - getx(), 2) + Math.pow(getsc().y - gety(), 2));
  
  dx = Math.abs(getsc().x * Math.sin(getsc().y)^3);
  dy = Math.abs((getsc().y * Math.cos(getsc().x) - 5 *
	  Math.cos(2*getsc().x) - 2 * Math.cos(3*getsc().x) -
	  Math.cos(4*getsc().x)));
  
  start = (angle / 180) * Math.PI;
  ctx.beginPath();
  ctx.moveTo(getx() + (Math.cos(start) * outer), 
      gety() - (Math.sin(start) * outer));
  
  cx = getx() + Math.cos(start);
  cy = gety() - Math.sin(start);
  
//  ctx.quadraticCurveTo(cx, cy, dx, dy);
//  ctx.quadraticCurveTo(dx, dy, cx, cy);
  ctx.bezierCurveTo(75,37,70,25,50,25);
  ctx.bezierCurveTo(20,25,20,62.5,20,62.5);
  ctx.bezierCurveTo(20,80,40,102,75,120);
  ctx.bezierCurveTo(110,102,130,80,130,62.5);
  ctx.bezierCurveTo(130,62.5,130,25,100,25);
  ctx.bezierCurveTo(85,25,75,37,75,40);
  
  // smilie face
//  ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
//  ctx.moveTo(110,75);
//  ctx.arc(75,75,35,0,Math.PI,false);   // Mouth
//  ctx.moveTo(65,65);
//  ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
//  ctx.moveTo(95,65);
//  ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
  //ctx.stroke();

  mdiv = document.getElementById('measures');
  mdiv.innerHTML = 'inner: ' + inner + ' outer: ' + outer + 'dx: ' + dx + ' dy: ' + dy;
  
  ctx.closePath(); 
  ctx.stroke();
};


// defaults to a triangle
CanvasHelper.prototype.drawBurst = function(msides, type) {
  // init vars
  var step = 0;
  var halfStep = 0;
  var qtrStep = 0;
  var start = 0;
  var n = 0;
  var dx = 0;
  var dy = 0;
  var cx = 0;
  var cy = 0;
  var sides = 3;
  var size;

  if (msides > 3) {
	sides = msides;
  }
  angle = 90;
  inner = (Math.sqrt(Math.pow(getsc().x - getx(), 2)
	  + Math.pow(getsc().y - gety(), 2))) / 2;
  outer = Math.sqrt(Math.pow(getsc().x - getx(), 2)
	  + Math.pow(getsc().y - gety(), 2));

  ctx = this.context;
  ctx.putImageData(tdata, 0, 0);
  
  // calculate length of sides
  step = (Math.PI * 2) / sides;
  halfStep = step / 2;
  qtrStep = step / 4;

  // calculate starting angle in radians
  start = (angle / 180) * Math.PI;
  ctx.beginPath();
  ctx.moveTo(getx() + (Math.cos(start) * outer), gety()
	  - (Math.sin(start) * outer));
 
 // draw curves or lines 
  for (n = 1; n <= sides; n++) {
	if (type == "burst") {
	  cx = getx() + Math.cos(start + (step * n) - (qtrStep * 3))
		  * (inner / Math.cos(qtrStep));
	  cy = gety() - Math.sin(start + (step * n) - (qtrStep * 3))
		  * (inner / Math.cos(qtrStep));
	}
	dx = getx() + Math.cos(start + (step * n) - halfStep) * inner;
	dy = gety() - Math.sin(start + (step * n) - halfStep) * inner;
	if (type == "burst") {
	  ctx.quadraticCurveTo(cx, cy, dx, dy);
	} else {
	  ctx.lineTo(dx, dy);
	}

	if (type == "burst") {
	  cx = getx() + Math.cos(start + (step * n) - qtrStep)
		  * (inner / Math.cos(qtrStep));
	  cy = gety() - Math.sin(start + (step * n) - qtrStep)
		  * (inner / Math.cos(qtrStep));
	}
	dx = getx() + Math.cos(start + (step * n)) * outer;
	dy = gety() - Math.sin(start + (step * n)) * outer;
	
	if (type == "burst") {
	  ctx.quadraticCurveTo(cx, cy, dx, dy);
	} else {
	  ctx.lineTo(dx, dy);
	}
  } 
  ctx.closePath(); 
  ctx.stroke();
};

CanvasHelper.prototype.addListener = function(l, f) {
  return this.canvas.addEventListener(l, f);
};

CanvasHelper.prototype.startDraw = function(e) {
  tdata = canvasHelper.context.getImageData(0, 0, canvasHelper.width, canvasHelper.height);
  startc(e);
  setx(e.x);
  sety(e.y);
  this.addEventListener('mousemove', canvasHelper.drawAttach);
};

CanvasHelper.prototype.stopDraw = function(e) {
  this.removeEventListener('mousemove', canvasHelper.drawAttach);
};

CanvasHelper.prototype.drawAttach = function(e) {
  setpx();
  setpy();
  setx(e.x);
  sety(e.y);
  
  switch (oType) {
    case 'heart':
      canvasHelper.drawHeart();
    break;
    case 'rays':
      canvasHelper.drawRays();
    break;
    case 'line':
      canvasHelper.drawLine();
    break;
    case 'circle':
      canvasHelper.drawCircle();
    break;
    case 'burst':
      canvasHelper.drawBurst(8, oType);
    break;
    case 'star':
      canvasHelper.drawBurst(5, oType);
    break;
    case 'triangle':
      canvasHelper.drawBurst();
    break;
    case 'square':
      canvasHelper.drawSquare();
    break;
  }
};

CanvasHelper.prototype.playCartoon = function(e) {
  canvi = canvasHelper.canvi;
  this.cartoonDiv = document.createElement('div');
  this.cartoonDiv.setAttribute('id', 'cartoon');
  this.cartoonDiv.setAttribute('style', 'position:absolute;top:2px;left:' + WIDTH + 'px;border:1px solid');
  document.body.appendChild(this.cartoonDiv);
  next = 0;
  setInterval(canvasHelper.cartoonLoop, 50);
};

CanvasHelper.prototype.cartoonLoop = function() {
  var target = document.getElementById('cartoon');
  if(next > 0 && next < this.canvi.length) {
	canvi[next].setAttribute('style', 'opacity:1;');
	target.replaceChild(canvi[next], canvi[next-1]);
  } else if (next == 0) {
	canvi[next].setAttribute('style', 'opacity:1;');
    target.appendChild(canvi[next]);
  }
  if(next > this.canvi.length) {
	clearInterval(canvasHelper.cartoonLoop);
	return;
  }
  next += 1;
};

function addColorButtons(parent) {
  for(i=0;i<colors.length;++i) {
	var tmp = document.createElement('input');
	tmp.setAttribute('type', 'button');
	tmp.setAttribute('value', colors[i]);
	tmp.setAttribute('style', 'color:' + colors[i] + ';border:1px solid');
	tmp.addEventListener('mousedown', canvasHelper.setLineColor);
	parent.appendChild(tmp);
  }
}

function addLineButtons(parent) {
  for(i=0;i<lines.length;++i) {
	var tmp = document.createElement('input');
	tmp.setAttribute('type', 'button');
	tmp.setAttribute('value', 'size: ' + lines[i]);
	tmp.setAttribute('style', 'border:1px solid');
	tmp.addEventListener('mousedown', canvasHelper.setLineSize);
	parent.appendChild(tmp);
  }
}

function addShapeButtons(parent) {
  for(i=0;i<shapes.length;++i) {
	var tmp = document.createElement('input');
	tmp.setAttribute('type', 'button');
	tmp.setAttribute('value', shapes[i]);
	tmp.setAttribute('style', 'border:1px solid');
	tmp.addEventListener('mousedown', canvasHelper.setShape);
	parent.appendChild(tmp);
  }
}

function init() {
  canvasHelper.addListener('mousedown', canvasHelper.startDraw);
  canvasHelper.addListener('mouseup', canvasHelper.stopDraw);
}

window.addEventListener('load', function() {

  // now create a div to collect the canvases
  canvasCollectionDiv = document.createElement('div');
  canvasCollectionDiv.setAttribute('id', 'canvi');
  canvasCollectionDiv.setAttribute('style', 'position:absolute;top:2px;left:2px;');
  canvasHelper = new CanvasHelper(new Array(), canvasCollectionDiv);
  clearDiv = document.createElement('input');
  clearDiv.setAttribute('type', 'button');
  clearDiv.setAttribute('value', 'clear');
  clearDiv.setAttribute('style', 'font:bold;border:1px solid;margin:5px;');
  
  layerDiv = document.createElement('input');
  layerDiv.setAttribute('type', 'button');
  layerDiv.setAttribute('value', 'newLayer');
  
  flipDiv = document.createElement('input');
  flipDiv.setAttribute('type', 'button');
  flipDiv.setAttribute('value', 'Flip!');
  
  var cc = canvasHelper.createCanvas(WIDTH, HEIGHT);
  
  clearDiv.addEventListener('mousedown', canvasHelper.clearCanvas);
  layerDiv.addEventListener('mousedown', canvasHelper.shuffleCanvases);
  flipDiv.addEventListener('mousedown', canvasHelper.playCartoon);
  
  document.body.appendChild(cc);
  
  controlsDiv = document.createElement('div');
  controlsDiv.setAttribute('id', 'controls');
  controlsDiv.setAttribute('style', 'position:absolute;top:2px;left:2px;');
  
  addColorButtons(controlsDiv);
  addLineButtons(controlsDiv);
  addShapeButtons(controlsDiv);
  
  controlsDiv.appendChild(clearDiv);
  controlsDiv.appendChild(layerDiv);
  controlsDiv.appendChild(flipDiv);
  document.body.appendChild(controlsDiv);
  measures = document.createElement('div');
  measures.setAttribute('id', 'measures');
  measures.setAttribute('style', 'position:absolute;top:500px;left:5px;');
  document.body.appendChild(measures);
  
  init();
});

