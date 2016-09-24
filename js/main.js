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
			alert('up');
		}else if(touchUp.pageY < touchDown.pageY){
			alert('down');
		}else{
			alert('click');
		}
	});

	setTimeout(function(){
		$('.bg-color').addClass('section-in');
	}, 2000)

});