/**
 * Stupid things for coordinates and velocity.
 */

// coordinates object
var c = {
  ex : 1,
  ey : 1,
  pex : 1,
  pey : 1,
  sx: 0,
  sy: 0,
  startc: function(e) {
	this.sx = e.x;
	this.sy = e.y;
  },
  getsc: function() {
	return {x: this.sx, y: this.sy};
  },
  // setters
  setEx : function(x) {
	this.ex = x;
  },
  setEy : function(y) {
	this.ey = y;
  },
  setPex : function() {
	this.pex = this.ex;
  },
  setPey : function() {
	this.pey = this.ey;
  },
  // getters
  getEx : function() {
	return this.ex;
  },
  getEy : function() {
	return this.ey;
  },
  getPex : function() {
	return this.pex;
  },
  getPey : function() {
	return this.pey;
  },
  addEx : function(vx) {
	this.ex += vx;
	return this.ex;
  },
  addEy : function(vy) {
	this.ey += vy;
	return this.ey;
  },
  reset : function() {
	this.ex = 1;
	this.ey = 1;
  }
};

// Velocity and Angle object
var v = {
  speed : 0,
  angle : 0,
  pspeed : 0,
  pangle : 0,
  // setters
  setSpeed : function(s) {
	this.speed = s;
  },
  setAngle : function(a) {
	this.angle = a;
  },
  setPspeed : function(s) {
	this.pspeed = s;
  },
  setPangle : function(a) {
	this.pangle = a;
  },
  // getters
  getSpeed : function() {
	return this.speed;
  },
  getAngle : function() {
	return this.angle;
  },
  getPspeed : function() {
	return this.pspeed;
  },
  getPangle : function() {
	return this.pangle;
  },
  reset : function() {
	this.speed = 0;
	this.angle = 0;
	this.pspeed = 0;
	this.pangle = 0;
  }
};

// Object to record mouse movements
rxy = {
  xarray: new Array(),
  yarray: new Array(),

  reset: function() {
	this.xarray = new Array();
	this.yarray = new Array();
  },
  
  xpush: function(x) {
	this.xarray.push(x);
  },

  ypush: function(y) {
	this.yarray.push(y);
  },
  
  maxx: function() {
	return Math.max.apply(Math, this.xarray);
  },
  
  maxy: function() {
	return Math.max.apply(Math, this.yarray);
  },
  
  minx: function() {
	return Math.min.apply(Math, this.xarray);
  },
  
  miny: function() {
	return Math.min.apply(Math, this.yarray);
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

var startc = c.startc.bind(c);
var getsc = c.getsc.bind(c);
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

var rx = rxy.xpush.bind(rxy);
var ry = rxy.ypush.bind(rxy);
var xmin = rxy.minx.bind(rxy);
var ymin = rxy.miny.bind(rxy);
var xmax = rxy.maxx.bind(rxy);
var ymax = rxy.maxy.bind(rxy);
var rxyReset = rxy.reset.bind(rxy);