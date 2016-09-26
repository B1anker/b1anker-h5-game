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

	//随机产生指定范围的整数
	GamePage.prototype.randomNumber = function(min, max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	};

	//怪物存放
	var monsters = {};


	//创建怪物对象
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

	//怪物死亡图片的大小
	GamePage.prototype.die = [[180, 138],[146, 84],[103, 94],[92, 107]];


	//创建每关怪物的数量
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



	//绘制怪物
	GamePage.prototype.drawMonsters = function(){
		var self = this;
		var i = 0;
		var timer = null;

		timer = setInterval(function(){
			if(i >= self.monsterStore[self.turns] || self.gameOver){
				clearInterval(timer);
			}else{
				//console.log('第' + (self.turns + 1) + '关-第' + (i + 1) +'只怪怪物');
				var id = 'mon' + i + self.turns;
				new self.createMonster['mon' + self.randomNumber(1,4)]({
					canvas: self.settings.canvas,
					id: id
				});

				self.monsterMove(id);
				i++;
			}
		}, 300);
	};

	//生成每次怪物运动的位置
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


	//怪物运动
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


	//杀死怪物
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
			monsters[id] = undefined;
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
		}
		for(var i in monsters){
			if(monsters[i]){
				return false;
			}
		}
		if(!self.gameOver){
			self.turns++;
			self.next();
		}
	};


	//下一关
	GamePage.prototype.next = function(){
		var self = this;
		if(!self.gameOver){
			self.position = {};
			$(document).off('touchstart');
			self.interval();
			self.drawMonsters();
		}
	};


	//计时,每关X秒,通过重置时间
	GamePage.prototype.interval = function(){
		var self = this,
			leftTime = self.time;
		clearTimeout(self.gameOverTimer);
		clearInterval(self.timeTimer);
		self.timeTimer = setInterval(function(){
			leftTime--;
			$('.time').html(leftTime + 'S');
		}, 1000);
		//游戏结束
		self.gameOverTimer = setTimeout(function(){
			self.gameOver = true;
			clearInterval(self.timeTimer);
			for(var a in monsters){
				delete a;
			}
			self.score = 0;
			self.turns = 0;
			monsters = {};
			self.position = {};
			$(document).off('touchstart');
			$('.final-score').html('你消灭了' + $('.score').html().match(/\d+/)[0] + '只怪物!');
			$('.score').html('X0');
			$('.time').html('10S');
			$('.alert').show('slow');
			$('#again').on('touchstart', function(e){
				$('.alert').hide('slow');
				self.gameOver = false;
				self.next();
				$('#again').off('touchstart');
			});
		}, self.time * 1000);
	};

	//给document绑定click事件来模拟点击怪物
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


	//怪物移动
	GamePage.prototype.monsterMove = function(id){
		var self = this;
		var position = self.generatePosition();
		var radiu = self.randomNumber(100, 200);
		var angle = self.randomNumber(0, 360);
		var lastLocation;
		var timer = setInterval(function(){
			if(self.gameOver){
				jc('#' + id).del();
				clearInterval(timer);
			}else{
				angle += self.speed;
				if(angle >= 360){
					angle = 0;
				}
				lastLocation = self.run(position, id, radiu ,angle);
			}
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
		self.time = 10;
		self.roundTime = 10000;
		self.timerSpeed = 30;
		self.speed = 6;
		self.position = {};
		self.gameOver = false;
		self.distance = (self.max.x - self.min.x + self.max.y - self.min.y) * 2;
		self.step = self.distance / (self.roundTime / self.timerSpeed);
		self.createMonsterQuantity();
		$('#begin').on('touchstart', function(){
			$('.active').hide('slow');
			self.drawMonsters();
			self.interval();
		});

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


