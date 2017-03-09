/**
 * Author: Geoffrey Golliher
 * brokenway@gmail.com
 */

var context;
var canvas;
var WIDTH = 500;
var HEIGHT = 500;
var radius = 30;
var gravity = 1.2;
var friction = 0.984;
var offset = radius;
var xdamp = 0.5;
var ydamp = 0.7;
var incontainer = false;
var measuresDiv;
var onground = false;
var interval = undefined;

// coordinates object
var c = {
    ex: 1,
    ey: 1,
    pex: 1,
    pey: 1,
    // setters
    setEx: function(x) {
      this.ex = x;
    },
    setEy: function(y) {
      this.ey = y;
    },
    setPex: function() {
      this.pex = this.ex;
    },
    setPey: function() {
      this.pey = this.ey;
    },
    // getters
    getEx: function() {
      return this.ex;
    },
    getEy: function() {
      return this.ey;
    },
    getPex: function() {
      return this.pex;
    },
    getPey: function() {
      return this.pey;
    },
    addEx: function(vx) {
      this.ex += vx;
      return this.ex;
    },
    addEy: function(vy) {
      this.ey += vy;
      return this.ey;
    },
    reset: function() {
      this.ex = 1;
      this.ey = 1;
    }
};

// Velocity and Angle object
var v = {
    speed: 0,
    angle: 0,
    pspeed: 0,
    pangle: 0,
    // setters
    setSpeed: function(s) {
      this.speed = s;
    },
    setAngle: function(a) {
      this.angle = a;
    },
    setPspeed: function(s) {
      this.pspeed = s;
    },
    setPangle: function(a) {
      this.pangle = a;
    },
    // getters
    getSpeed: function() {
      return this.speed;
    },
    getAngle: function() {
      return this.angle;
    },
    getPspeed: function() {
      return this.pspeed;
    },
    getPangle: function() {
      return this.pangle;
    },
    reset: function() {
      this.speed = 0;
      this.angle = 0;
      this.pspeed = 0;
      this.pangle = 0;
    }
};

// bound functions
var svpspeed = v.setPspeed.bind(v);
var svpangle = v.setPangle.bind(v);
var svspeed = v.setSpeed.bind(v);
var svangle = v.setAngle.bind(v);
var gvpspeed = v.getPspeed.bind(v);
var gvpangle = v.getPangle.bind(v);
var gvspeed = v.getSpeed.bind(v);
var gvangle = v.getAngle.bind(v);
var vreset = v.reset.bind(v);

var setx = c.setEx.bind(c);
var sety = c.setEy.bind(c);
var getx = c.getEx.bind(c);
var gety = c.getEy.bind(c);
var setpx = c.setPex.bind(c);
var setpy = c.setPey.bind(c);
var getpx = c.getPex.bind(c);
var getpy = c.getPey.bind(c);
var addx = c.addEx.bind(c);
var addy = c.addEy.bind(c);
var resetxy = c.reset.bind(c);

GamesNamespace = {};

GamesNamespace.extend = function(subClass, baseClass) {
  function inheritance() {}
  inheritance.prototype = baseClass.prototype;

  subClass.prototype = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.baseConstructor = baseClass;
  subClass.superClass = baseClass.prototype;
};

function CanvasHelper(canvas, w, h, x, y) {
  this.canvas = canvas;
  this.width = w;
  this.height = h;
  this.x;
  this.y;
};
  
CanvasHelper.prototype.setContext = function() {
  this.context = this.canvas.getContext('2d');
};

CanvasHelper.prototype.clearCanvas = function() {
  this.context.clearRect(0, 0, this.width, this.height);
};
  
CanvasHelper.prototype.getContext = function() {
  return this.context;
};

CanvasHelper.prototype.addListener = function(l, f) {
  this.canvas.addEventListener(l, f);
};

CanvasEventObject = function(drawer) {
  this.drawer = drawer;
  this.incontainer = false;
  this.x = 30;
  this.y = 470;
  this.px = 0;
  this.py = 0;
  this.speed = 1;
  this.angle = 1;
  this.pspeed = 0;
  this.pangle = 0;
};

CanvasEventObject.prototype.mouseMover = function(e) {
  //alert(this.incontainer);
  if(this.incontainer || this.incontainer == undefined) {
    this.updateCoordinates();
    this.px = this.x;
    this.py = this.y;
    this.x = e.x;
    this.y = e.y;
    this.drawer.drawToFollowMouse(this.x, this.y);
  }
};

CanvasEventObject.prototype.updateCoordinates = function() {
  this.pspeed = this.getSpeed();
  this.pangle = this.getAngle();
  this.speed = this.getx();
  this.angle = this.gety();
};

CanvasEventObject.prototype.startDrag = function() {
  if(this.interval != undefined) {
    this.clearInterval(interval);
  }
  this.incontainer = true;
  this.drawer.canvas.addEventListener('mousemove', this.mouseMover, false);
  this.drawer.canvas.addEventListener('mouseup', this.stopDrag, false);
};
  
CanvasEventObject.prototype.stopDrag = function() {
  this.incontainer = false;
  this.drawer.canvas.removeEventListener('mousemove');
  this.drawer.canvas.removeEventListener('mouseup');
  Transforms.dropBall();
};

CanvasEventObject.prototype.getx = function() {
  return this.x;
};

CanvasEventObject.prototype.gety = function() {
  return this.y;
};
  
CanvasEventObject.prototype.getpx = function() {
  return this.px;
};
  
CanvasEventObject.prototype.getpy = function() {
  return this.py;
};
  
CanvasEventObject.prototype.getSpeed = function() {
  return this.speed;
};
  
CanvasEventObject.prototype.getAngle = function() {
  return this.angle;
};
  
CanvasEventObject.prototype.getPspeed = function() {
  return this.pspeed;
};
  
CanvasEventObject.prototype.getPangle = function() {
  return this.pangle;
};

//GamesNamespace.extend(EventObject, CanvasHelper);

DrawObject = function(canvas, w, h) {
  DrawObject.baseConstructor.call(this, canvas, w, h);
  DrawObject.superClass.setContext.call(this);
  this.canvas = canvas;
  
  this.circle = function(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, 0, Math.PI*2, true);
    this.context.closePath();
    this.context.fillStyle = "#FF1C0A";
    this.context.fill();
  };
  this.drawToFollowMouse = function(x, y) {
    this.clearCanvas();
    this.circle(x, y, this.radius);
  };
};

GamesNamespace.extend(DrawObject, CanvasHelper);

Transforms = function(event_helper) {
  interval = undefined;
  canvas = undefined;
  radius = 30;
  xdamp = 6;
  ydamp = 5;
  gravity = 1.2;
  friction = 0.984;
  speed = 0;
  angle = 0;
  offset = 0;
  
  setVelocityAndDirection = function() {
    this.angle = this.getx();
    var vx = this.getx() - this.getPspeed(); //v.pspeed;
    var vy = this.gety() - this.getPangle(); // v.pangle;
    this.speed = Math.sqrt((vx * vx) + (vy * vy));
    this.angle = this.radToDeg(Math.atan2(vy, vx));
  };
  degToRad = function(angle) {
    return ((angle*Math.PI) / 180);
  };
  radToDeg = function(angle) {
    return ((angle*180) / Math.PI);
  };
  dropObject = function() {
    this.setVelocityAndDirection();
    //check gravity here.
    this.interval = setInterval(this.drawDropWithGravity, 10);
    return interval;
  };
  dampenByBounds = function(vx, vy) {
    return  
  };
  drawDropWithGravity = function() {
    this.canvas.clearCanvas();
    var x = this.getx();
    var y = this.gety();
    var radius = this.radius;

    this.drawObject.circle(x, y, radius);

    this.px = this.getx();
    this.py = this.gety();
    
    var vx = this.speed * Math.cos(this.degToRad(this.angle));
    var vy = this.speed * Math.sin(this.degToRad(this.angle));
    
    if((x <= 0 + offset && vx <= 0) || (x >= this.canvas.width - this.canvas.offset && vx >= 0)) {
      vx *= -this.xdamp;
    }
    if((y <= 0 + offset && vy <= 0) || (y >= this.canvas.height - offset && vy >= 0)) {
      vy *= -this.ydamp;
    }
  
    // Allow object to roll to a stop.
    if(y < this.canvas.height - offset) {
      vy += this.gravity;
    } else {
      vx *= this.friction; // Object is on the ground so apply friction.
    }

    this.speed = Math.sqrt((vx * vx) + (vy * vy));
    this.angle = this.radToDeg(Math.atan2(vy, vx));
  
    //slowing things down ... slowly
    if(this.speed >= 0.959) {
      this.canvas.eventObject.x += vx;
      this.canvas.eventObject.y += vy;
    } else if ((this.speed / gravity) >= 0.4290) { // on the ground rolling
      this.x += vx * this.friction;
      this.y += vy;
    } else if((x == px) && (py / y) == 1) { // not moving anymore
      this.x = x;
      this.y = y;
    }
  };
};

//GamesNamespace.extend(Transforms, CanvasEventObject);

window.addEventListener('load', function() {
  canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  canvas.setAttribute('width', WIDTH);
  canvas.setAttribute('height', HEIGHT);
  canvas.setAttribute('style', 'border: 1px solid;');
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  
  //now draw a small div to catch vars
  measuresDiv = document.createElement('div');
  measuresDiv.setAttribute('id', 'measures');
  measuresDiv.setAttribute('style', 'border: 1px solid;');
  document.body.appendChild(measuresDiv);
  init();
});

function init_test() {
  
  drawer = new DrawObject(canvas, 500, 300);
  event_helper = new CanvasEventObject(drawer);
  transformer = new Transforms(event_helper);
  drawer.circle(30, 470, 30);
  drawer.addListener('mousedown', event_helper.startDrag());
}

function init() {
  clear();
  circle(radius, HEIGHT - radius, radius);
  canvas.addEventListener('mousedown', startDrag);
}

function degToRad(angle) {
  return ((angle*Math.PI) / 180);
}

function radToDeg(angle) {
  return ((angle*180) / Math.PI);
}

function clear() {
  context.clearRect(0,0,WIDTH,HEIGHT);
}

function circle(x, y, r) {
  context.beginPath();
  context.arc(x, y, r, 0, Math.PI*2, true);
  context.closePath();
  context.fillStyle = "#FF1C0A";
  //context.fillStyle = "rgba(0, 0, 200, 0.25)";
  context.fill();
}

function updateCoordinates() {
  svpspeed(gvspeed());
  svpangle(gvangle());
  svspeed(getx());
  svangle(gety());
}

function mouseMover(e) {
  if(incontainer) {
    updateCoordinates();
    setpx();
    setpy();
    setx(e.x);
    sety(e.y);
    drawToFollowMouse();
  }
}

function startDrag(e) {
  if(interval != undefined) {
    clearInterval(interval);
  }
  incontainer = true;
  canvas.addEventListener('mousemove', mouseMover, false);
  canvas.addEventListener('mouseup', stopDrag, false);
}

function stopDrag() {  
  incontainer = false;
  canvas.removeEventListener('mousemove');
  canvas.removeEventListener('mouseup');
  dropBall();
}

function setVelocityAndDirection() {
  svangle(gety());
  var vx = getx() - gvpspeed(); //v.pspeed;
  var vy = gety() - gvpangle(); // v.pangle;
  svspeed(Math.sqrt((vx * vx) + (vy * vy)));
  svangle(radToDeg(Math.atan2(vy, vx)));
}

function dropBall() {
  setVelocityAndDirection();
  //check gravity here.
  interval = setInterval(drawDropWithGravity, 10);
  return interval;
}

function drawToFollowMouse() {
  clear();
  circle(getx(), gety(), radius);
}

function drawDropWithGravity() {
  clear();
  circle(getx(), gety(), radius);

  setpx();
  setpy();

  var vx = gvspeed() * Math.cos(degToRad(gvangle()));
  var vy = gvspeed() * Math.sin(degToRad(gvangle()));
    
  if((getx() <= 0 + offset && vx <= 0) || (getx() >= WIDTH - offset && vx >= 0)) {
    vx *= -xdamp;
  }
  if((gety() <= 0 + offset && vy <= 0) || (gety() >= HEIGHT - offset && vy >= 0)) {
    vy *= -ydamp;
  }
  
  // Allow object to roll to a stop.
  if(gety() < HEIGHT - offset) {
    vy += gravity;
  } else {
    vx *= friction; // Object is on the ground so apply friction.
  }

  svspeed(Math.sqrt((vx * vx) + (vy * vy)));
  svangle(radToDeg(Math.atan2(vy, vx)));
  
  //slowing things down ... slowly
  if(gvspeed() >= 0.959) {
    setx(addx(vx));
    sety(addy(vy));
  } else if ((gvspeed() / gravity) >= 0.4290) { // on the ground rolling
    setx(addx(vx * friction));
    sety(addy(vy));
  } else if((getx() == getpx()) && (getpy() / gety()) == 1) { // not moving anymore
    setx(getx());
    sety(gety());
  }
}