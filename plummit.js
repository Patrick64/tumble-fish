String.prototype.replaceAt = function(index, char) {
	return this.substr(0, index) + char + this.substr(index + char.length);
};
var $ = function(a, b) {
	a = a.match(/^(\W)?(.*)/);
	return (b || document)["getElement"
			+ (a[1] ? a[1] == "#" ? "ById" : "sByClassName" : "sByTagName")]
			(a[2])
};

function go(isMobile) {
	var app = new Game(isMobile);
}

var Game = function(isMobile) {
	$('#myCanvas').style.display = 'block';
	$('#intro').style.display = 'none';
	$('#nosleep').play();
	var self = this;
	var app = this;
	var pyth = function(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	};
	this.LR = 0;
	this.FB = 0;
	this.DIR = 0;
	var fps = 30;
	var sensitivity = 0.5;
	this.c = document.getElementById("myCanvas");

	this.viewportwidth = window.innerWidth;
	this.viewportheight = window.innerHeight;
	this.c.style.height = this.viewportheight + 'px';
	this.c.style.width = this.viewportwidth + 'px';
	this.width = 400;

	var w20 = this.width / 20;
	var w40 = this.width / 40;
	var canvasHeight, canvasWidth;
	if (isMobile) {
		canvasWidth = this.width;
		canvasHeight = (this.viewportheight / this.viewportwidth) * this.width;
		this.height = (this.viewportheight / this.viewportwidth) * this.width;
	} else {
		canvasWidth = this.viewportwidth;
		canvasHeight = this.viewportheight;
		this.height = this.viewportheight;
		// this.height = (this.viewportheight / this.viewportwidth) *
		// this.width;
	}

	this.c.setAttribute('width', canvasWidth);
	this.c.setAttribute('height', canvasHeight);
	var ctx = self.c.getContext("2d");
	this.centerX = this.width / 2;
	this.centerY = this.height / 2;
	var lastFrameTime = new Date().getTime();
	var frameLapse = 0;
	var levelComplete = true;
	var playerDead = false;
	var curLevIndex = -1;
	var curLev = null;
	var unit = 0;
	var sec = 0;
	// var levelStartTime = 0;
	var mouseOrigin = {
		x : 0,
		y : 0
	};
	var LROrigin = 0;
	var isMouseDown = false;
	var cameraY = 0;
	var pulse = 0;
	var pulse2 = 0;
	var pulse3 = 0;
	var gameData = [

			{
				wallMap : '\
			        .....\
			        .....\
			        .....\
			        .....\
			        .....\
			        ____g\
					',
				itemMap : '\
			        .....\
			        .....\
				.....\
				.....\
				.....\
				p....\
			      ',
				'width' : 5
			},

			{
				wallMap : '\
			        .....\
			        ..__I\
			        ._...\
			        .._..\
			        ..._.\
			        ____g\
					',
				itemMap : '\
					...p',
				width : 5
			},

			{
				'wallMap' : '\
			        _....__.\
			        .____I..\
			        ___.....\
			        ..._....\
			        ...._...\
			        g_______\
			        ',
				'itemMap' : '\
			        p.....p.\
			        ........\
			      ',
				'width' : 8
			},

			{
				'wallMap' : '\
			        _.I__.____\
			        ._I____.._\
			        ___...____\
			        ._______..\
			        _..I_..___\
			        ._........\
			        .._.......\
			        ..._......\
			        ________g_\
			        ',
				'itemMap' : '\
			        p......p..\
			        ....p.....\
			      ',
				'width' : 10
			},
			{
				wallMap : '\
			        ........\
			        _..._..I\
			        ....|..|\
			        ....|..I\
			        ....|..|\
			        __ssI_gI\
			        ....|..|\
			        ....|...\
			        ',
				itemMap : '\
			        p...p...\
					',
				width : 8
			},
			{
				wallMap : '\
			      .I____.|\
			      I__..._.\
			      |.__._I.\
			      .__..|..\
			      _...._g_\
			      I___.|..\
			      |..|.|..\
			      |..I_I..\
			      I_.IsI__\
			      ',
				itemMap : '\
			      .....b..\
			      .p......\
			      ',
				width : 8
			},

			{
				wallMap : '\
			      I_...._I.\
			      .........\
			      _.___g__.\
			      .........\
			      .........\
			      sssssssss\
			      ',
				itemMap : '\
			      .b....b..\
			      .........\
			      ........b\
			      ....p....\
			      ',
				width : 9
			},
			{
				wallMap : '\
					..__.....\
					__..__...\
					.....I_g.\
					________.\
					.......|.\
					.......|.\
					.......|s\
					.......||\
					s.s.s.s||\
					IsIsIsIII\
			      ',
				itemMap : '\
					...b.....\
					.........\
					.........\
					.........\
					.........\
					.........\
					....p....\
			      ',
				width : 9
			},

			{
				wallMap : '\
      			      __._...|..\
			      |..._..|..\
      			      |...._.|..\
     			      I._____I__\
      			      g_________\
      			      ',
				itemMap : '\
			      w..p......\
			      ..........\
			      ..........\
			      ..........\
			      .........w\
			      ',
				width : 10
			},

			{
				wallMap : '\
      ...__I___..\
      _g__....___\
      ...I____I..\
      ...........\
      ___________\
      ',
				itemMap : '\
			      ..www.pww..\
					...........\
			      ',
				width : 11
			},

			{
				wallMap : '\
					_____\
					_R__.\
					...|.\
					._.rg\
					_....\
					._...\
					__.t_\
					__s__\
				      ',
				itemMap : '\
					.....\
					p....\
					.....\
					.p...\
					.....\
					.....\
					.....\
					.....\
      					',
				width : 5
			},

			{
				wallMap : '\
					.R_T__\
					_R__R.\
					__._r_\
					.r__R.\
					.|..|.\
					_I__I_\
					.|..|.\
					_I__Ig\
      ',
				itemMap : '\
					..p..w\
					b.....\
					......\
					......\
					......\
      ',
				width : 6
			},

			{
				wallMap : '\
					__...\
					.....\
					.....\
					...cc\
					.....\
					_c_..\
					.....\
					.....\
					...c.\
					.|...\
					.|.__\
					.|.|.\
					.|s|.\
					c....\
					.....\
					_..__\
					.....\
					.....\
					.cc..\
					...._\
					_....\
					g_c__\
					',
				itemMap : '\
						p....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						',
				width : 5

			},

			{
				wallMap : '\
					_____\
					.....\
					.....\
					.....\
					.Tcc.\
					.....\
					....S\
					.....\
					...S.\
					.....\
					..S..\
					.....\
					.S...\
					.....\
					S..cc\
					.....\
					sscc.\
					gR___\
					',
				itemMap : '\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						p....\
						.....\
						.....\
						',
				width : 5

			},
			{
				wallMap : '\
					.........___\
					ccccccc__r_.\
					........|.|.\
					........|.|.\
					.cc...._R_I.\
					..........|.\
					s____.____I.\
					_________..c\
					_g__R_t_r__.\
					',
				itemMap : '\
					............\
					............\
					............\
					............\
					.........p..\
					............\
					.........w..\
					.....f......\
					',
				width : 12
			},
			{
				wallMap : '\
					._____.\
					.grR_I.\
					.......\
					....ccc\
					_...___\
					t___rt.\
					.......\
					',
				itemMap : '\
					...w...\
					....p..\
					.....m.\
					.......\
					.......\
					.......\
					',
				width : 7

			},
			{
				wallMap : '\
					.........\
					.........\
					.|.|.|.|.\
					.|.|.|.|.\
					.|.|.|.|.\
					.|.|.|.|.\
					.|.|.|.|.\
					sIsIsIsIs\
					',
				itemMap : '\
					........p\
					......p..\
					....p....\
					..p......\
					p........\
					',
				width : 9
			} ];

	var swapWallMap = function(level, rx, swaps) {
		level.wallMap = level.wallMap.replace(rx, function(m) {
			return swaps[m];
		});
	};

	var getMouseXY = function(e) {
		var tempX, tempY;
		if (e.targetTouches && e.targetTouches[0]) {
			tempX = e.targetTouches[0].pageX;
			tempY = e.targetTouches[0].pageY;
		} else {
			tempX = e.pageX || e.clientX + document.body.scrollLeft;
			tempY = e.pageY || e.clientY + document.body.scrollTop;
		}
		return {
			x : tempX,
			y : tempY
		};
	};

	this.setupEvents = function() {
		var i, m, obj;
		if (isMobile) {
			if (window.DeviceOrientationEvent) {
				console.log("DeviceOrientation is supported");
				window.addEventListener('deviceorientation',
						function(eventData) {
							self.LR = eventData.gamma * sensitivity;
							self.FB = eventData.beta;
							self.DIR = eventData.alpha;
							// deviceOrientationHandler(LR, FB, DIR);
						}, false);
			} else {
				alert("Not supported on your device or browser.  Sorry.");
			}
			$('#myCanvas').addEventListener(
					'touchstart',
					function(e) {
						m = getMouseXY(e);
						curLev.click(m.x * (app.width / app.viewportwidth)
								/ unit, (m.y
								* (app.height / app.viewportheight) / unit)
								+ cameraY);
						// alert(self.level.items.length);

					}, false);
		} else {
			$('#myCanvas').addEventListener('mousedown', function(e) {
				isMouseDown = true;
				mouseOrigin = getMouseXY(e);
				LROrigin = self.LR;
				e.stopPropagation();
			}, false);
			$('#myCanvas').addEventListener('mouseup', function(e) {
				isMouseDown = false;
				e.stopPropagation();
			}, false);
			$('#myCanvas').addEventListener(
					'mousemove',
					function(e) {
						if (isMouseDown) {
							var m = getMouseXY(e);
							self.LR = LROrigin + (m.x - mouseOrigin.x) * 0.2
									* sensitivity;
						}
						e.stopPropagation();
					}, false);
			$('#restart').style.display = 'block';
			$('#restart').addEventListener('click', function(e) {
				playerDead = true;
			});

		}
	};
	this.setupEvents();

	var Item = Class
			.extend({
				init : function(x, y, level, itemIndex) {
					this.momentum = {
						x : 0,
						y : 0
					};
					this.itemIndex = itemIndex;
					this.level = level;
					this.nearWall = '';
					this.aboveWall = '';
					this.x = x;
					this.y = y;
					this.tilt = 0.8;
					this.friction = 1;
					this.active = true;
					this.blockedLeft = false;
					this.blockedRight = false;
					this.isStatic = false;
				},
				process : function(sec) {

					if (this.active) {
						if (!this.isStatic) {
							this.blockedRight = false;
							this.blockedLeft = false;
							this.newWall = false;

							this.momentum.x = this.momentum.x
									* (1 - (sec * 3 * this.friction));
							this.momentum.x += (sec * (app.LR)) * this.tilt;

							var mapX = Math.floor(this.x + 0.5);
							var mapY = Math.floor(this.y + 0.5);
							mapX = mapX < 0 ? 0
									: mapX >= this.level.width ? this.level.width - 1
											: mapX;
							mapY = mapY < 0 ? 0 : mapY;
							if (this.mapX != mapX || this.mapY != mapY)
								this.newWall = true;
							this.mapX = mapX;
							this.mapY = mapY;

							this.nearWall = '.';
							if (this.level.wallMap[mapX
									+ (mapY * this.level.width)]) {
								this.nearWall = this.level.wallMap[mapX
										+ (mapY * this.level.width)];
							}
							this.aboveWall = '.';
							if (this.level.wallMap[mapX
									+ ((mapY - 1) * this.level.width)])
								this.aboveWall = this.level.wallMap[mapX
										+ ((mapY - 1) * this.level.width)];

							if ('.|'.indexOf(this.nearWall) > -1)
								this.momentum.y += sec * 40;
							// spring
							if ('Ss'.indexOf(this.nearWall) > -1
									&& this.momentum.y > 5) {
								this.momentum.y = (-this.momentum.y * 1.2) - 2;
								if (this.momentum.y < -20)
									this.momentum.y = -20;
							}
							// ground
							if ('_gIsTtRr'.indexOf(this.nearWall) !== -1) {
								if (this.y >= mapY && this.momentum.y >= 0) {
									this.y = mapY;
									if (this.momentum.y > 10)
										this.dropped(mapX, mapY);
									this.momentum.y = 0;
								} else {
									this.momentum.y += sec * 40;
								}
							}
							// clouds
							if ('Sc'.indexOf(this.nearWall) !== -1) {
								if (this.y >= mapY && this.momentum.y >= 0) {
									this.y = mapY;
									this.momentum.y = 0;
								} else {
									this.momentum.y += sec * 40;
								}
							}
							// roof
							if ('_gIsTt'.indexOf(this.aboveWall) !== -1) {
								if (this.momentum.y < 0 && this.y < mapY) {
									this.momentum.y = 0;
								}
							}
							// walls
							if ('I|R'.indexOf(this.nearWall) !== -1) {

								if (this.x < mapX && this.momentum.x > 0) {
									this.blockedRight = true;

								} else if (this.x > mapX && this.momentum.x < 0) {
									this.blockedLeft = true;

								}
								if (this.x >= mapX - 0.5 && this.x < mapX)
									this.x = mapX - 0.51;
								else if (this.x < mapX + 0.5 && this.x > mapX)
									this.x = mapX + 0.5;

							}

							if (this.nearWall == 't' && this.newWall
									&& this.momentum.x > 0) {
								// @todo
								swapWallMap(this.level, /[tTrR]/g, {
									't' : 'T',
									'T' : 't',
									'r' : 'R',
									'R' : 'r'
								});
								// var swap = {'t':'T','T':'t','r':'R','R':'r'};
								// var rx= /[tTrR]/g;
								// this.level.wallMap =
								// this.level.wallMap.replace(
								// 'r', 'R');
								// this.level.wallMap =
								// this.level.wallMap.replace(
								// 't', 'T');
							} else if (this.nearWall == 'T' && this.newWall
									&& this.momentum.x < 0) {
								// this.level.wallMap =
								// this.level.wallMap.replace(
								// 'R', 'r');
								// this.level.wallMap =
								// this.level.wallMap.replace(
								// 'T', 't');
								swapWallMap(this.level, /[tTrR]/g, {
									't' : 'T',
									'T' : 't',
									'r' : 'R',
									'R' : 'r'
								});
							}

							if (this.x < 0)
								this.blockedLeft = true;
							if (this.x > this.level.width - 1)
								this.blockedRight = true;
						}

						for ( var i = 0; i < this.level.items.length; i++) {
							if (i != this.itemIndex
									&& this.level.items[i].active)
								this.interact(this.level.items[i]);
						}
						if (!this.isStatic) {
							if (this.blockedLeft && this.momentum.x < 0)
								this.momentum.x = 0;
							if (this.blockedRight && this.momentum.x > 0)
								this.momentum.x = 0;

							if (this.momentum.y > 20)
								this.momentum.y = 20;
							if (this.momentum.x > 50)
								this.momentum.x = 50;
							if (this.momentum.x < -50)
								this.momentum.x = -50;

							if (this.x < -1)
								this.x = this.level.width;
							if (this.x > this.level.width + 1)
								this.x = -1;

							this.x += this.momentum.x * sec;
							this.y += this.momentum.y * sec;
						}
					}

				},

				draw : function() {

				},
				dropped : function(mapX, mapY, obj) {
					if (obj instanceof Player)
						obj.dying = true;
				},
				interact : function(obj) {
					this.avoid(obj);
				},
				avoid : function(obj) {
					if (pyth(this.x, this.y, obj.x, obj.y) < 0.95) {
						if (obj.y > this.y && this.momentum.y > 0) {
							if (this.momentum.y > 10)
								this.dropped(this.mapX, this.mapY, obj);
							this.momentum.y = 0;
						}
						if ((this.x > obj.x && this.momentum.x < 0)
								|| (this.x < obj.x && this.momentum.x > 0)) {
							this.pushAgainst(obj);

						}
					}
				},
				pushAgainst : function(obj) {
					if (this.y >= obj.y - 0.5) {
						if (this.momentum.x < 0)
							this.blockedLeft = true;
						if (this.momentum.x > 0)
							this.blockedRight = true;

						obj.momentum.x += this.momentum.x;
						this.momentum.x = 0;
					} else {
						this.momentum.y -= sec * 40;
					}

				}

			});

	var shape = function(x, y, a, stroke, fill, lineWidth) {
		ctx.beginPath();
		ctx.moveTo(x * unit, y * unit);
		for ( var i = 0; i < a.length - 1; i = i + 2) {
			ctx.lineTo((x + a[i]) * unit, (y + a[i + 1]) * unit);
		}
		fillStroke(stroke, fill, lineWidth);
	};

	var fillStroke = function(stroke, fill, lineWidth) {
		if (fill) {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		if (stroke) {
			ctx.lineWidth = lineWidth ? lineWidth * unit : unit / 10;
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}
	};

	var circle = function(x, y, a, stroke, fill, lineWidth) {
		ctx.beginPath();
		for ( var i = 0; i < a.length; i = i + 1) {
			ctx.arc((a[i][0] + x) * unit, (a[i][1] + y) * unit, a[i][2] * unit,
					a[i][3] * Math.PI * 2, a[i][4] * Math.PI * 2);
		}
		fillStroke(stroke, fill, lineWidth);
	};

	var Player = Item.extend({
		init : function(x, y, level) {
			this.deathAnim = 1;
			this.dying = false;
			this._super(x, y, level);
		},
		process : function(sec) {
			if (this.dying) {

				if (this.deathAnim <= 0.1)
					playerDead = true;
				else
					this.deathAnim -= sec;
			} else {
				this._super(sec);
			}
			// goal!!
			if (this.nearWall == 'g')
				this.active = false;
			if (this.y > this.level.height)
				this.dying = true;
		},
		draw : function() {
			if (this.active) {
				ctx.fillStyle = "blue";
				// ctx.fillRect(x * level.unit, y * level.unit, level.unit,
				// level.unit);
				ctx.save();
				ctx.translate((this.x + 0.5) * unit, (this.y + 0.5) * unit);
				ctx.save();
				ctx.rotate(-(self.LR * 1) * Math.PI / 180);
				// water
				ctx.beginPath();
				ctx.arc(0, 0, unit / 2, (0.5 - (0.6 * this.deathAnim))
						* Math.PI, (0.5 + (0.6 * this.deathAnim)) * Math.PI,
						false);
				ctx.fillStyle = "rgba(1,1,255,0.7);"; // #8ED6FF";
				ctx.fill();
				// fish
				ctx.translate(0, (0.1 * (pulse3 * pulse3)) * unit);
				if (this.momentum.y > 0)
					ctx.translate(0, -this.momentum.y * unit * 0.05);
				if (this.momentum.x > 0)
					ctx.scale(-0.5, 0.2);
				else
					ctx.scale(0.5, 0.2);

				shape(-0.25, 0, [ 0.2, -0.5, 0.6, 0.3, 0.6, -0.3, 0.2, 0.5, 0,
						0 ], false, '#FF6600');
				ctx.restore();
				ctx.beginPath();
				ctx.arc(0, 0, unit / 2, -1, 1.3 * Math.PI, false);

				ctx.strokeStyle = "#bbf";
				ctx.stroke();
				if (this.dying) {
					shape(0, 0.5,
							[ 0.2, -0.2, -0.3, -0.3, 0.25, -0.4, 0, -0.65 ]);
					ctx.stroke();
				}
				ctx.restore();
				// ctx.font = "50px arial";
				// ctx.fillText(cameraY, 0, 50);
				// ctx.fillText(this.momentum.y, 0, 100);
			}

		},
		dropped : function(mapX, mapY) {
			this.dying = true;
		}

	});

	var Bomb = Item.extend({
		init : function(x, y, level) {

			this._super(x, y, level);
		},
		process : function(sec) {

			this._super(sec);

		},
		draw : function() {
			if (this.active) {
				ctx.save();
				ctx.translate((this.x + 0.5) * unit, (this.y + 0.5) * unit);
				ctx.save();
				ctx.rotate(this.x * Math.PI);
				ctx.beginPath();
				ctx.fillStyle = "#444"; // #8ED6FF";
				ctx.arc(0, 0, unit * 0.5, 0 * Math.PI, 2 * Math.PI, false);
				ctx.fill();
				ctx.beginPath();
				ctx.fillStyle = "#f00"; // #8ED6FF";
				ctx.fillRect(-unit / 4, -unit * 0.6, unit / 2, unit * 0.2);
				ctx.fill();
				shape(0, -0.5, [ 0.1, -0.3 ], '#fff');

				ctx.restore();
				ctx.restore();
			}
		},
		dropped : function(mapX, mapY, obj) {
			this._super(mapX, mapY, obj);
			this.level.wallMap = this.level.wallMap.replaceAt(mapX
					+ (mapY * this.level.width), '.');
			this.active = false;
		}
	});

	var Weight = Item
			.extend({
				init : function(x, y, level) {

					this._super(x, y, level);
					// this.friction = 2;
				},
				draw : function() {
					if (this.active) {

						// shape(this.x,this.y,[0.2,0.1, 0.8,0.1, 1,1, 0,1,
						// 0.2,0.1],'#333','#888');
						ctx.save();
						ctx.translate((this.x + 0.5) * unit, (this.y + 0.5)
								* unit);
						ctx.save();
						ctx.rotate(this.x * Math.PI);
						ctx.beginPath();
						ctx.fillStyle = "#d00"; // #8ED6FF";
						ctx.arc(0, 0, unit * 0.5, 0 * Math.PI, 2 * Math.PI,
								false);
						ctx.fill();
						ctx.beginPath();
						ctx.fillStyle = "#333"; // #8ED6FF";
						ctx.arc(-unit * 0.1, -unit * 0.3, unit * 0.05,
								0 * Math.PI, 2 * Math.PI, false);
						ctx.arc(unit * 0.1, -unit * 0.3, unit * 0.05,
								0 * Math.PI, 2 * Math.PI, false);
						ctx.arc(0, -unit * 0.2, unit * 0.05, 0 * Math.PI,
								2 * Math.PI, false);
						ctx.fill();
						ctx.restore();
						ctx.beginPath();
						ctx.fillStyle = "rgba(255,255,255,0.5)"; // #8ED6FF";
						ctx.arc(-unit * 0.2, -unit * 0.2, unit * 0.2,
								0 * Math.PI, 2 * Math.PI, false);
						ctx.fill();
						ctx.restore();
					}
				},
				pushAgainst : function(obj) {
					if (obj instanceof Player
							&& ((obj.blockedLeft && this.momentum.x < 0) || (obj.blockedRight && this.momentum.x > 0)))
						obj.dying = true;
					this._super(obj);

				}
			});

	var Monkey = Item
			.extend({
				init : function(x, y, level) {

					this._super(x, y, level);
					this.tilt = 0;
				},
				draw : function() {
					if (this.active) {
						// legs
						shape(this.x, this.y + 1, [ 0.1, 0, 0.5, -0.5, 0.9, 0,
								1, 0 ], '#CD6839');

						ctx.save();
						ctx.translate((this.x + 0.5) * unit, (this.y + 0.5)
								* unit);
						ctx.rotate(-(self.LR * 1) * Math.PI / 180);
						// arms
						shape(-0.5, -0.25, [ 0.5, 0.25, 1, 0 ], '#CD6839');
						ctx.beginPath();
						// body
						ctx.arc(0, 0.2 * unit, unit * 0.3, 0 * Math.PI,
								2 * Math.PI, false);
						// head
						ctx.arc(0, -0.25 * unit, unit * 0.2, 0 * Math.PI,
								2 * Math.PI, false);
						ctx.fillStyle = "#CD6839"; // #8ED6FF";
						ctx.fill();
						ctx.beginPath();
						ctx.fillStyle = "#FF7D40"; // #8ED6FF";
						ctx.arc(0, -0.25 * unit, unit * 0.15, 0 * Math.PI,
								2 * Math.PI, false);
						ctx.fill();
						circle(0, 0.2, [ [ 0, 0, 0.2, 0, 2 ] ], '#FF7D40');
						circle(0, -0.3, [ [ -0.05, 0, 0.02, 0, 1 ],
								[ 0.05, 0, 0.02, 0, 1 ] ], false, '#000');
						circle(0, -0.2, [ [ 0, 0, 0.05, 0, 1 ] ], '#000',
								false, 0.025);

						ctx.restore();
					}
				},
				pushAgainst : function(obj) {
					if (obj instanceof Player
							&& ((obj.blockedLeft && this.momentum.x < 0) || (obj.blockedRight && this.momentum.x > 0)))
						obj.dying = true;
					this._super(obj);

				}
			});

	var Fan = Item.extend({
		init : function(x, y, level) {

			this._super(x, y, level);
			this.isStatic = true;
			// this.friction = 2;
		},

		draw : function() {
			if (this.active) {

				// shape(this.x,this.y,[0.2,0.1, 0.8,0.1, 1,1, 0,1,
				// 0.2,0.1],'#333','#888');
				ctx.save();
				ctx.translate((this.x + 0.5) * unit, (this.y + 0.5) * unit);
				ctx.scale(1, 0.3);
				ctx.rotate(pulse2 * Math.PI * 2);

				shape(-0.5, 0, [ 1, 0 ], '#ff0', false, 0.3);
				shape(0, -0.5, [ 0, 1 ], '#ff0', false, 0.3);
				ctx.restore();
			}
		},
		interact : function(obj) {
			var dist = pyth(this.x, this.y, obj.x, obj.y);
			if (!obj.isStatic && obj.x - this.x < 2 && obj.x - this.x > -2
					&& dist < 5 && obj.y < this.y) {
				obj.momentum.y -= sec * (40 + (5 - dist));
			}
		}
	});

	var Level = function(levelData) {
		unit = app.width / levelData.width;
		this.levelData = levelData;
		this.width = levelData.width;
		this.wallMap = levelData.wallMap.replace(/\s|\n/g, "");
		var itemMap = levelData.itemMap.replace(/\s|\n/g, "");
		this.startTime = new Date().getTime();
		this.runTime = 0;
		this.height = Math.max(
				Math.floor(this.wallMap.length / this.width) + 1, app.height
						/ unit - 1);
		this.items = [];
		cameraY = null;
		var self = this;
		if (!isMobile) {
			app.LR = 0;
			isMouseDown = false;
		}
		for ( var i = 0; i < itemMap.length; i++) {
			x = i % levelData.width;
			y = Math.floor(i / levelData.width);
			if (itemMap[i] == 'p')
				this.items.push(new Player(x, y, this, i));
			if (itemMap[i] == 'b')
				this.items.push(new Bomb(x, y, this, i));
			if (itemMap[i] == 'w')
				this.items.push(new Weight(x, y, this, i));
			if (itemMap[i] == 'f')
				this.items.push(new Fan(x, y, this, i));
			if (itemMap[i] == 'm')
				this.items.push(new Monkey(x, y, this, i));

		}

		var x, y, wall;

		this.processLevel = function(sec) {

			var activePlayers = 0;
			var playerY = 0;
			this.runTime = new Date().getTime() - this.startTime;
			for ( var i = 0; i < this.items.length; i++) {
				this.items[i].process(sec);
				if (this.items[i] instanceof Player && this.items[i].active) {
					activePlayers++;
					playerY += this.items[i].y + 1;
				}
			}
			if (activePlayers == 0)
				levelComplete = true;
			if (cameraY == null)
				cameraY = (((playerY / activePlayers) - ((app.height / unit) / 2)));
			else
				cameraY += (((playerY / activePlayers) - ((app.height / unit) / 2)) - cameraY)
						* sec * 10;
			if (cameraY < 0)
				cameraY = 0;
			if (cameraY > this.height - (app.height / unit))
				cameraY = this.height - (app.height / unit);
		}

		this.drawLevel = function() {
			ctx.lineWidth = unit / 10;
			ctx.save();
			ctx.translate(0, (-cameraY) * unit);
			pulse2 = (new Date().getTime() % 1000) / 1000;
			pulse3 = (new Date().getTime() % 4000) / 2000;
			pulse3 = pulse3 > 1 ? pulse3 = 1 - (pulse3 - 1) : pulse3;
			pulse = (new Date().getTime() % 2000) / 1000;
			pulse = pulse > 1 ? pulse = 1 - (pulse - 1) : pulse;

			for ( var i = 0; i < self.wallMap.length; i++) {
				x = i % levelData.width;
				y = Math.floor(i / levelData.width);
				wall = self.wallMap[i];
				ctx.fillStyle = "white";
				if ('_IsgtTrR'.indexOf(wall) > -1)
					ctx.fillRect(x * unit, y * unit + unit, unit, (unit / 10));
				if (wall == 'I' || wall == '|')
					ctx.fillRect(x * unit + unit * 0.45, y * unit, unit / 10,
							unit);
				if (wall == 'g') {

					shape(x + 0.5, y, [ -0.5, 0.5, -0.5, 1, 0.5, 1, 0.5, 0.5,
							0, 0 ], '', 'rgb(' + Math.floor(pulse * 255)
							+ ',255,' + Math.floor(pulse * 255) + ')');
					// ctx.fill();

				}
				if ('Ss'.indexOf(wall) > -1) {
					shape(x + 0.5, y + 0.5, [ -0.45, 0, 0.45, 0, 0, 0, -0.3,
							0.1, 0.3, 0.2, -0.3, 0.3, 0.3, 0.4, -0.3, 0.5 ]);
					ctx.strokeStyle = "#f33";
					ctx.stroke();
				}

				if ('Sc'.indexOf(wall) > -1) {
					ctx.beginPath();
					ctx.fillStyle = "rgba(255,255,255,0.7)"; // #8ED6FF";
					ctx.arc((x + 0.2) * unit, (y + 1) * unit, unit * 0.2,
							0 * Math.PI, 2 * Math.PI, false);
					ctx.arc((x + 0.8) * unit, (y + 1) * unit, unit * 0.2,
							0 * Math.PI, 2 * Math.PI, false);
					ctx.arc((x + 0.5) * unit, (y + 0.9) * unit, unit * 0.3,
							0 * Math.PI, 2 * Math.PI, false);
					ctx.fill();
				}

				if (wall == 'R')
					shape(x + 0.5, y, [ 0, 1 ], 'rgba(255,0,0,1)');
				if (wall == 'r')
					shape(x + 0.5, y, [ -0.5, 0.5 ], 'rgba(255,0,0,0.5)');
				if (wall == 't')
					shape(x + 0.5, y + 1, [ -0.25, -0.5, -0.35, -0.45 ],
							'rgba(255,0,0,1)');
				if (wall == 'T')
					shape(x + 0.5, y + 1, [ 0.25, -0.5, 0.15, -0.55 ],
							'rgba(255,0,0,1)');

			}
			for ( var i = 0; i < this.items.length; i++) {
				this.items[i].draw();
			}
			ctx.restore();
			// show floor number for 2 seconds or permanantly if on last level
			if (this.runTime < 2000 || curLevIndex == gameData.length - 1) {
				ctx.font = Math.floor(app.width / 10)
						+ "px ‘Lucida Sans Unicode’, ‘Lucida Grande’, sans-serif";
				var alpha = 1;
				if (this.runTime > 1000 && curLevIndex < gameData.length - 1)
					alpha = (1 - (this.runTime % 1000) / 1000);
				ctx.fillStyle = "rgba(255,100,0," + alpha + ")";
				// if not last level
				if (curLevIndex < gameData.length - 1)
					ctx.fillText("Floor "
							+ ((gameData.length - curLevIndex - 1)),
							app.width * 0.3325, app.height
									* (0.2 + alpha * 0.2));
				else {
					ctx.fillText("Ground Floor ", app.width * 0.2,
							app.height * (0.1));
					ctx.fillText("All fishes saved", app.width * 0.17,
							app.height * (0.8));
					ctx.fillText("Game complete! ", app.width * 0.15,
							app.height * (0.9));
				}

			}
		};
		this.click = function(x, y) {
			app.touchX = x;
			app.touchY = y;
			for ( var i = 0; i < this.items.length; i++) {
				obj = this.items[i];
				// ctx.arc(x,y,5*unit,2*Math.PI);
				// ctx.fill();

				// alert(pyth(m.x*(app.width/app.viewportwidth)/unit,m.y*(app.width/app.viewportheight)/unit,obj.x,obj.y));
				// alert(pyth(x,y,obj.x,obj.y));
				if (obj instanceof Player
						&& pyth(x, y, obj.x + 0.5, obj.y + 0.5) < 1)
					obj.dying = true;
			}
		};
	};

	window.setInterval(function() {
		var i;
		if (levelComplete)
			curLevIndex++;
		if (levelComplete || playerDead) {
			curLev = new Level(gameData[curLevIndex]);
			levelComplete = false;
			playerDead = false;
		}

		frameLapse = new Date().getTime() - lastFrameTime;
		lastFrameTime = new Date().getTime();
		// process 100th of a second
		sec = 10 / 1000;
		for (i = 0; i < frameLapse - 10; i = i + 10) {
			curLev.processLevel(10 / 1000);
		}
		sec = (frameLapse - i) / 1000;
		curLev.processLevel((frameLapse - i) / 1000);

		self.setupCanvas();
		self.drawBackground();
		curLev.drawLevel();
		self.finishCanvas();

	}, 1000 / fps);

	this.setupCanvas = function() {
		ctx.save();
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = "#000";
		// ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		if (!isMobile) {
			ctx.translate((canvasWidth / 2), canvasHeight / 2);
			ctx.rotate((self.LR * 1) * Math.PI / 180)
			ctx.scale(0.9, 0.9);
			ctx.translate(-self.width / 2, -canvasHeight / 2);
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, self.width, self.height);

			ctx.globalCompositeOperation = 'source-atop';

		}
		ctx.lineCap = 'round';
	};

	this.finishCanvas = function() {
		ctx.globalCompositeOperation = 'source-over';
		if (!isMobile) {
			ctx.strokeStyle = '#888';
			ctx.lineWidth = unit / 5;
			ctx.strokeRect(-unit / 10, -unit / 10, self.width + unit / 5,
					self.height + unit / 5);
		}
		ctx.restore();
	}

	this.drawBackground = function() {
		//

		ctx.save();
		ctx.translate(self.width / 2, 0);
		ctx.rotate(-(self.LR * 1) * Math.PI / 180);
		ctx.translate(-(self.width / 2), -self.height / 4);

		var step = w20;
		for ( var i = 0; i < 255; i = i + 20) {
			ctx.fillStyle = "rgb(" + ((255 - i) * 1) + "," + ((255 - i))
					+ ",0)"; // .toString(16)+"0000";;
			// ctx.fillRect(self.viewportwidth*0.1,0,self.LR,75);
			ctx.fillRect(-self.width, (i / 256) * (self.height),
					self.width * 3, (22 / 256) * (self.height));
		}
		ctx.restore();

		// ctx.beginPath();
		// ctx.arc(self.centerX, self.height*3.75, self.height*3, 0, 2 *
		// Math.PI, false);
		// ctx.fillStyle = "rgba(100,255,100,0.3);"; // #8ED6FF";
		// ctx.fill();

	};

};