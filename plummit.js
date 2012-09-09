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
		//this.height = (this.viewportheight / this.viewportwidth) * this.width;
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
	var curLevIndex = 6;
	var curLev = null;
	var unit = 0;
	var sec = 0;
	var levelTime = 0;
	var mouseOrigin = {x:0,y:0};
	var LROrigin = 0;
	var isMouseDown = false;
	var cameraY = 0;
	var gameData = [
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
			        _.I__.____\
			        ._I____.._\
			        ___...____\
			        ._______..\
			        _..I_..___\
			        ._........\
			        .._.......\
			        ..._......\
			        ________g_\
			        0000000000',
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
			      _.......\
			      I__.._g_\
			      |.|..|..\
			      |.I__I..\
			      I_IssI__\
			      ',
				itemMap : '\
			      .....b..\
			      .p......\
			      ',
				width : 8
			},
			{
				wallMap : '\
      ......._I\
      .I_......\
      .__......\
      .__..._g.\
      .___g____\
      .........\
      .........\
      .ssssssss\
      ',
				itemMap : '\
			      ..p....b.\
			      .......g.\
			      ..w......\
			      ..w......\
			      ..w......\
			      ',
				width : 9
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
			}, {
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
			} ,
			{
				wallMap:'\
					.....\
					g_...\
					.....\
					.....\
					..ss.\
					.....\
					.....\
					...ss\
					.....\
					__...\
					.....\
					.....\
					sssss\
					',
					itemMap:'\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						.....\
						wp...\
						.....\
						.....\
						.....\
						',
						width:5
						
			}];

	var swapWallMap = function(level,rx,swaps) {
		level.wallMap = level.wallMap.replace(rx, function(m){
			return swaps[m];
		});
	};
	
	var getMouseXY = function(e) {
		var tempX,tempY;
		if (e.targetTouches && e.targetTouches[0]) {
			tempX = e.targetTouches[0].pageX;
			tempY = e.targetTouches[0].pageY;
		} else {
			tempX =  e.pageX || e.clientX + document.body.scrollLeft;
			tempY = e.pageY || e.clientY + document.body.scrollTop;
		}
    	return {x:tempX,y:tempY};
    };
	
    this.setupEvents = function() {
    	var i,m,obj;
	if (isMobile) {
		if (window.DeviceOrientationEvent) {
			console.log("DeviceOrientation is supported");
			window.addEventListener('deviceorientation', function(eventData) {
				self.LR = eventData.gamma * sensitivity;
				self.FB = eventData.beta;
				self.DIR = eventData.alpha;
				// deviceOrientationHandler(LR, FB, DIR);
			}, false);
		} else {
			alert("Not supported on your device or browser.  Sorry.");
		}
		$('#myCanvas').addEventListener('touchstart',function(e) {
			m = getMouseXY(e);
			curLev.click(m.x*(app.width/app.viewportwidth)/unit,(m.y*(app.height/app.viewportheight)/unit)+cameraY);
			//alert(self.level.items.length);
			
		});
	}
	else {
		$('#myCanvas').addEventListener('mousedown',function(e) {
			isMouseDown = true;
			mouseOrigin = getMouseXY(e);
			LROrigin = self.LR;
		});
		$('#myCanvas').addEventListener('mouseup',function(e) {
			isMouseDown = false;
		});
		$('#myCanvas').addEventListener('mousemove',function(e) {
			if (isMouseDown) {
				var m = getMouseXY(e);
				self.LR = LROrigin + (m.x-mouseOrigin.x)*0.2*sensitivity;
			}
		});
		$('#restart').style.display='block';
		$('#restart').addEventListener('click',function(e) {
			playerDead=true;
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
				},
				process : function(sec) {

					if (this.active) {
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
						if (this.level.wallMap[mapX + (mapY * this.level.width)]) {
							this.nearWall = this.level.wallMap[mapX
									+ (mapY * this.level.width)];
						}
						this.aboveWall = '.';
						if (this.level.wallMap[mapX + ((mapY-1) * this.level.width)]) 
							this.aboveWall = this.level.wallMap[mapX + ((mapY-1) * this.level.width)];
							
						if ('.|'.indexOf(this.nearWall) > -1)
							this.momentum.y += sec * 40;
						if (this.nearWall == 's' && this.momentum.y > 0)
							this.momentum.y = -this.momentum.y * 1.2;
						if ('_gIsTt'.indexOf(this.nearWall) !== -1) {
							if (this.y >= mapY && this.momentum.y >= 0) {
								this.y = mapY;
								if (this.momentum.y > 10)
									this.dropped(mapX, mapY);
								this.momentum.y = 0;
							} else {
								this.momentum.y += sec * 40;
							}
						}
						if ('_gIsTt'.indexOf(this.aboveWall) !== -1) {
							if (this.momentum.y<0 && this.y<mapY) {
								this.momentum.y=0;
							}
						}
						if ('I|R'.indexOf(this.nearWall) !== -1) {

							if (this.x < mapX && this.momentum.x > 0) {
								this.blockedRight = true;
								
							} else if (this.x > mapX && this.momentum.x < 0) {
								this.blockedLeft = true;
								
							}
							if (this.x>mapX-0.5 && this.x<mapX)
								this.x=mapX-0.5;
							else if (this.x<mapX+0.5 && this.x>mapX)
								this.x=mapX+0.5;
								
								
						}
						

						if (this.nearWall == 't' && this.newWall
								&& this.momentum.x > 0) {
							// @todo
							swapWallMap(this.level, /[tTrR]/g, {'t':'T','T':'t','r':'R','R':'r'});
							//var swap = {'t':'T','T':'t','r':'R','R':'r'};
							//var rx= /[tTrR]/g;
							//this.level.wallMap = this.level.wallMap.replace(
							//		'r', 'R');
							//this.level.wallMap = this.level.wallMap.replace(
							//		't', 'T');
						} else if (this.nearWall == 'T' && this.newWall
								&& this.momentum.x < 0) {
							//this.level.wallMap = this.level.wallMap.replace(
							//		'R', 'r');
							//this.level.wallMap = this.level.wallMap.replace(
							//		'T', 't');
							swapWallMap(this.level, /[tTrR]/g, {'t':'T','T':'t','r':'R','R':'r'});
						}

						if (this.x < 0)
							this.blockedLeft = true;
						if (this.x > this.level.width - 1)
							this.blockedRight = true;

						for ( var i = 0; i < this.level.items.length; i++) {
							if (i != this.itemIndex
									&& this.level.items[i].active)
								this.interact(this.level.items[i]);
						}

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

				},

				draw : function() {

				},
				dropped : function() {

				},
				interact : function(obj) {
					this.avoid(obj);
				},
				avoid : function(obj) {
					if (pyth(this.x, this.y, obj.x, obj.y) < 0.95) {
						if (obj.y > this.y && this.momentum.y > 0) {
							if (this.momentum.y > 10)
								this.dropped(this.mapX, this.mapY);
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

	var shape = function(x, y, a, stroke, fill) {
		ctx.beginPath();
		ctx.moveTo(x * unit, y * unit);
		for ( var i = 0; i < a.length - 1; i = i + 2) {
			ctx.lineTo((x + a[i]) * unit, (y + a[i + 1]) * unit);
		}
		if (fill) {
			ctx.fillStyle = fill;
			ctx.fill();
		}
		if (stroke) {
			ctx.lineWidth = unit / 10;
			ctx.strokeStyle = stroke;
			ctx.stroke();
		}

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
			if (this.y>this.level.height)
				this.dying=true;
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
				ctx.beginPath();
				ctx.arc(0, 0, unit / 2, (0.5 - (0.6 * this.deathAnim))
						* Math.PI, (0.5 + (0.6 * this.deathAnim)) * Math.PI,
						false);
				ctx.fillStyle = "rgba(1,1,255,0.7);"; // #8ED6FF";
				ctx.fill();
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
				ctx.font = "50px arial";
				ctx.fillText(cameraY, 0, 50);
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
		dropped : function(mapX, mapY) {
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

	var Level = function(levelData) {
		unit = app.width / levelData.width;
		this.levelData = levelData;
		this.width = levelData.width;
		this.wallMap = levelData.wallMap.replace(/\s|\n/g, "");
		var itemMap = levelData.itemMap.replace(/\s|\n/g, "");
		this.height = Math.max(Math.floor(this.wallMap.length/this.width)+1,app.height/unit-1);
		this.items = [];
		cameraY=null;
		var self = this;
		if (!isMobile) {
			app.LR = 0;
			isMouseDown=false;
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

		}

		var x, y, wall;

		this.processLevel = function(sec) {
			
			var activePlayers = 0;
			var playerY =0;
			for ( var i = 0; i < this.items.length; i++) {
				this.items[i].process(sec);
				if (this.items[i] instanceof Player && this.items[i].active) {
					activePlayers++;
					playerY += this.items[i].y;
				}
			}
			if (activePlayers == 0)
				levelComplete = true;
			if (cameraY == null) 
				cameraY = (((playerY/activePlayers) - ((app.height/unit)/2)));
			else
				cameraY += (((playerY/activePlayers) - ((app.height/unit)/2)) - cameraY) * sec;	
			if (cameraY<0) cameraY=0;
			if (cameraY>this.height-(app.height/unit)) cameraY=this.height-(app.height/unit);
		}

		this.drawLevel = function() {
			ctx.lineWidth=unit/10;
			var pulse = (new Date().getTime() % 2000) / 1000;
			pulse = pulse > 1 ? pulse = 1 - (pulse - 1) : pulse;
			ctx.save();
			ctx.translate(0,(-cameraY)*unit);
			
			
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
				if (wall == 's') {
					shape(x + 0.5, y + 0.5, [ -0.45, 0, 0.45, 0, 0, 0, -0.3,
							0.1, 0.3, 0.2, -0.3, 0.3, 0.3, 0.4, -0.3, 0.5 ]);
					ctx.strokeStyle = "#f33";
					ctx.stroke();
				}
				if (wall == 'R')
					shape(x + 0.5, y, [ 0, 1 ], 'rgba(255,0,0,1)');
				if (wall == 'r')
					shape(x + 0.5, y, [ -0.5, 0.5 ], 'rgba(255,0,0,0.5)');
				if (wall == 't')
					shape(x + 0.5, y + 1, [ -0.25, -0.5, -0.35, -0.45  ], 'rgba(255,0,0,1)');
				if (wall == 'T')
					shape(x + 0.5, y + 1, [ 0.25, -0.5, 0.15, -0.55 ], 'rgba(255,0,0,1)');

			}
			for ( var i = 0; i < this.items.length; i++) {
				this.items[i].draw();
			}
			ctx.restore();
		};
		this.click = function(x,y) {
			app.touchX=x;
			app.touchY=y;
			for (var i=0;i<this.items.length;i++) {
				obj = this.items[i];
				//ctx.arc(x,y,5*unit,2*Math.PI);
				//ctx.fill();
				
				//alert(pyth(m.x*(app.width/app.viewportwidth)/unit,m.y*(app.width/app.viewportheight)/unit,obj.x,obj.y));
				//alert(pyth(x,y,obj.x,obj.y));
				if (obj instanceof Player && pyth(x,y,obj.x+0.5,obj.y+0.5)<1)
					obj.dying=true;
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
		//ctx.fillRect(0, 0, canvasWidth, canvasHeight);
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		if (!isMobile) {
		ctx.translate((canvasWidth/2),canvasHeight/2);
		ctx.rotate((self.LR * 1) * Math.PI / 180)
		ctx.scale(0.9,0.9);
		ctx.translate(-self.width/2,-canvasHeight/2);
		ctx.fillStyle = "#000";
	    ctx.fillRect(0,0,self.width,self.height);
	    
		ctx.globalCompositeOperation = 'source-atop';
		
		}
	};
	
	this.finishCanvas = function() {
		ctx.globalCompositeOperation = 'source-over';
		if (!isMobile) {
			ctx.strokeStyle='#888';
		    ctx.lineWidth=unit/5;
		    ctx.strokeRect(-unit/10,-unit/10,self.width+unit/5,self.height+unit/5);
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
		
		//ctx.beginPath();
		//ctx.arc(self.centerX, self.height*3.75, self.height*3, 0, 2 * Math.PI, false);
		//ctx.fillStyle = "rgba(100,255,100,0.3);"; // #8ED6FF";
		//ctx.fill();
		
		
	};


};