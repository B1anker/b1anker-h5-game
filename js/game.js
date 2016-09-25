/**
 * Created by b1anker on 16/9/24.
 */

(function($){

	var GamePage = function(ele, options){
		this.settings = $.extend(true, {
			canvas: 'game'
		}, options);
		this.ele = ele;
		this.init();
		this.canvas = this.ele.get(0);
		this.canvas.width = $(document).width();
		this.canvas.height = $(document).height();
	};


	GamePage.prototype.randomNumber = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};


	var monsters = {};

	GamePage.prototype.createMonster = {
		mon1: function (option) {
			var img = new Image();
			img.src = 'images/monster-1.png';
			img.onload = function () {
				jc.start(option.canvas, true);
				monsters[option.id] = jc.image(img, -100, -100, 109, 114).id(option.id).level(2);
				jc.start(option.canvas);
			};
		},
		mon2: function (option) {
			var img = new Image();
			img.src = 'images/monster-2.png';
			img.onload = function () {
				jc.start(option.canvas, true);
				monsters[option.id] = jc.image(img, -100, -100, 109, 113).id(option.id).level(2);
				jc.start(option.canvas);
			};
		},
		mon3: function (option) {
			var img = new Image();
			img.src = 'images/monster-3.png';
			img.onload = function () {
				jc.start(option.canvas, true);
				monsters[option.id] = jc.image(img, -100, -100, 107, 129).id(option.id).level(2);
				jc.start(option.canvas);
			};
		},
		mon4: function (option) {
			var img = new Image();
			img.src = 'images/monster-4.png';
			img.onload = function () {
				jc.start(option.canvas, true);
				monsters[option.id] = jc.image(img, -100, -100, 125, 110).id(option.id).level(2);
				jc.start(option.canvas);
			};
		}
	};

	GamePage.prototype.die = [[180, 138],[146, 84],[103, 94],[92, 107]];


	GamePage.prototype.createMonsterQuantity = function(){
		var self = this;
		for (var i = 0; i < self.level; i++) {
			self.monsterStore.push(self.level);
		}
		if (i < 30) {
			self.level++;
			self.createMonsterQuantity();
		} else {
			//console.log(self.monsterStore);
		}
	};

	GamePage.prototype.drawMonsters = function(){
		var self = this;
		var i = 0;
		var timer = null;
		clearInterval(timer);
		timer = setInterval(function(){
			var id = 'mon' + i + self.turns;
			new self.createMonster['mon' + self.randomNumber(1,4)]({
				canvas: self.settings.canvas,
				id: id
			});
			self.monsterMove(id);
			i++;
			if(i >= self.monsterStore[self.turns]){
				clearInterval(timer);
			}
		}, 300);
	};


	GamePage.prototype.generatePosition = function(){
		var self = this;
		var x,y;
		var second = self.randomNumber(0, 1);
		if(self.randomNumber(0, 1)){
			if(second){
				//left
				x = self.min.x;
				y = self.randomNumber(self.min.y, self.max.y);
			}else{
				//right
				x = self.max.x;
				y = self.randomNumber(self.min.y, self.max.y);
			}
		}else{
			if(second){
				//top
				y = self.min.y;
				x = self.randomNumber(self.min.x, self.max.x);
			}else{
				//bottom
				y = self.max.y;
				x = self.randomNumber(self.min.x, self.max.x);
			}
		}
		return {x:x,y:y};
	};

	GamePage.prototype.run = function(position, id, radiu, angle){
		var self = this;
		if(position.x <= self.max.x && position.x > self.min.x && position.y == self.min.y){
			//top
			position.x -= self.step;
			if(position.x < self.min.x){
				position.x = self.min.x;
			}
		}else if(position.y < self.max.y&& position.x == self.min.x){
			//left
			position.y += self.step;
			if(position.y > self.max.y){
				position.y = self.max.y;
			}
		}else if(position.x < self.max.x&& position.y == self.max.y){
			//bottom
			position.x += self.step;
			if(position.x > self.max.x){
				position.x = self.max.x ;
			}
		}else if(position.y <= self.max.y&& position.x == self.max.x){
			//right
			position.y -= self.step;
			if(position.y < self.min .y){
				position.y = self.min.y ;
			}
		}
		var x = position.x + radiu * Math.cos(angle * Math.PI / 180);
		var y = position.y + radiu * Math.sin(angle * Math.PI / 180);
		jc('#' + id).animate({x:x,y:y}, 1);
		self.position[id] = [];
		self.position[id][0]= x;
		self.position[id][1] = y;
		return {x:x,y:y};
	};



	GamePage.prototype.killMonster = function(id, timer, pX, pY){
		clearInterval(timer);
		var self = this;
		if(monsters[id]){
			var num = monsters[id]._img.src.match(/monster\-(\d)/)[1];
			var img = new Image(),
				width = self.die[num - 1][0],
				height = self.die[num - 1][1];
			img.src = 'images/monster-'+ num + '-die.png';
			img.onload = function () {
				jc.start('game', true);
				jc.image(img, pX, pY, width, height).id('die' + id).level(1);
				jc.start('game');
			};
			//点击怪物死亡
			jc('#' + id).del();
			//死亡图片消失特效
			var disappear = 1;
			var disappearTimer = setInterval(function(){
				disappear -= 1/60;
				if(disappear <= 0){
					clearInterval(disappearTimer);
					jc('#die' + id).del();
				}
				jc('#die' + id).opacity(disappear);
			},30);
			monsters[id] = undefined;
		}
		for(var i in monsters){
			if(monsters[i]){
				return false;
			}
		}
		self.turns++;
		self.next();
	};

	GamePage.prototype.next = function(){
		var self = this;
		monsters = {};
		self.position = {};
		$(document).off('touchstart');
		self.interval();
		self.drawMonsters();
	};

	GamePage.prototype.interval = function(){
		var self = this;
		var leftTime = self.time;
		clearTimeout(self.gameOverTimer);
		clearInterval(self.timeTimer);
		self.timeTimer = setInterval(function(){
			leftTime--;
			$('.time').html(leftTime + 'S');
		}, 1000);

		self.gameOverTimer = setTimeout(function(){
			clearInterval(self.timeTimer);
			clearTimeout(self.gameOverTimer);
			for(var a in monsters){
				jc('#' + a).del();
				monsters[a] = null;
			}
			self.score = 0;
			self.turns = 0;
			monsters = {};
			self.position = {};
			$(document).off('touchstart');
			$('.final-score').html('你消灭了' + $('.score').html().match(/\d+/)[0] + '只怪物!');
			$('.alert').show('slow');
			$('#again').on('touchstart', function(){
				$('.alert').hide('slow');
				self.next();
			});
		}, self.time * 1000);
	};


	GamePage.prototype.bindTouch = function(id, timer){
		var self = this;
			$(document).on('touchstart', function(e){
				if(self.position[id]) {
					e = e || window.event;
					var touchPosition = e.originalEvent.changedTouches[0],
						tX = touchPosition.pageX,
						tY = touchPosition.pageY,
						pX = self.position[id][0],
						pY = self.position[id][1];
					if ((pX <= tX - 10) && tX <= (pX + 120) && (pY - 10) <= tY && tY <= (pY + 120)) {
						self.killMonster(id, timer, pX, pY);
						self.score++;
						$('.score').html('X' + self.score);
					}else{
						$('.bg-color').addClass('shake');
						setTimeout(function(){
							$('.bg-color').removeClass('shake');
						}, 1000);
					}
				}
			});
	};

	GamePage.prototype.monsterMove = function(id){
		var self = this;
		var position = self.generatePosition();
		var radiu = self.randomNumber(100, 200);
		var angle = self.randomNumber(0, 360);
		var lastLocation;
		var timer = setInterval(function(){
			angle += self.speed;
			if(angle >= 360){
				angle = 0;
			}
			lastLocation = self.run(position, id, radiu ,angle);
		}, self.timerSpeed);

		self.bindTouch(id, timer);
	};


	//初始化插件
	GamePage.prototype.init = function(){
		var self = this;
		self.monsterStore = [];
		self.level = 1;
		self.turns = 0;
		self.score = 0;
		self.width = $(document).width();
		self.height = $(document).height();
		self.min = {
			x: 50,
			y: 50
		};
		self.max = {
			x: self.width - 120,
			y: self.height - 160
		};
		self.time = 5;
		self.roundTime = 10000;
		self.timerSpeed = 30;
		self.speed = 6;
		self.position = {};
		self.distance = (self.max.x - self.min.x + self.max.y - self.min.y) * 2;
		self.step = self.distance / (self.roundTime / self.timerSpeed);
		self.createMonsterQuantity();
		self.drawMonsters();
		self.interval();
	};

	//扩展jQuery
	$.fn.GamePage = function(options){
		return this.each(function(){
			var self = $(this),
				instance = self.data("GamePage");
			if(!instance){
				self.data("GamePage", (instance = new GamePage(self, options)));
			}
			if($.type(options) === "string") return instance[options]();
		});

	};

})(jQuery);


$(document).ready(function(){

	$(document.body).css('height', $(document).height());
	$('#music').on('touchstart', function () {
		var $audio = $('audio');
		var audio = $audio.get(0);
		if (audio.paused) {
			audio.play();
			$('#music').removeClass('stop').addClass('play');
		} else {
			audio.pause();
			$('#music').removeClass('play').addClass('stop');
		}
	});


	$('#game').GamePage();
});


