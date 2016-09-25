/**
 * Created by b1anker on 16/9/23.
 */

$(document).ready(function(){
	$(document.body).css('height', $(document).height());


	var touchDown,touchUp;
	$(document).on('touchstart', function(e){
		e = e || window.event;
		touchDown = e.originalEvent.changedTouches[0];
	}).on('touchend', function(e){
		e = e || window.event;
		touchUp = e.originalEvent.changedTouches[0];
		if(touchUp.pageY > touchDown.pageY){
			//alert('up');
		}else if(touchUp.pageY < touchDown.pageY){
			$('.bg-color').removeClass('section-in').addClass('section-out');
		}else{
			//alert('click');
		}
	});

	$('#music').on('touchstart', function(){
		var $audio = $('audio');
		var audio = $audio.get(0);
		if(audio.paused){
			audio.play();
			$('#music').removeClass('stop').addClass('play');
		}else{
			audio.pause();
			$('#music').removeClass('play').addClass('stop');
		}
	});

	var loadingArr = [
		'images/alert.png',
		'images/arrow.png',
		'images/game-icon-share.png',
		'images/human-1.png',
		'images/human-2.png',
		'images/human-3.png',
		'images/human-4.png',
		'images/human-5.png',
		'images/human-6.png',
		'images/lighthouse.png',
		'images/miaov.png',
		'images/monster-1.png',
		'images/monster-2.png',
		'images/monster-3.png',
		'images/monster-4.png',
		'images/monster-1-die.png',
		'images/monster-2-die.png',
		'images/monster-3-die.png',
		'images/monster-4-die.png',
		'images/music-play.png',
		'images/music-stop.png',
		'images/pirate-1.png',
		'images/pirate-2.png',
		'images/planet-1.png',
		'images/planet-2.png',
		'images/planet-3.png',
		'images/planet-4.png',
		'images/planet-5.png',
		'images/rocket-1.png',
		'images/rocket-2.png',
		'images/rocket-3.png',
		'images/share-icon-01.png',
		'images/smork-1.png',
		'images/smork-2.png',
		'images/smork-3.png',
		'images/smork-4.png',
		'images/star.png',
		'images/star-game.png',
		'images/star-line.png',
		'images/star-round.png',
		'images/star-small.png',
		'images/start.png',
		'images/sun.png',
		'images/text-1.png',
		'images/text-2.png',
		'images/text-3.png',
		'images/time.png',
		'images/withyou.png'
	];

	var loadNum = 0;
	for(var i = 0; i < loadingArr.length; i++){
		var oImg = $('<img src=""></img>');
		oImg.eq(0)[0].src = loadingArr[i];
		oImg.on('load', function () {
			loadNum++;
			$('.loading span').css('width', Math.floor(loadNum/loadingArr.length) * 100 + '%');
			if(i == loadingArr.length){
				$('.loading').hide('slow');
			}
		})
	}
});