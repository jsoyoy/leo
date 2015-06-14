$.fn.tab=function(json){
	json=json || {};
	json.sEvent=json.sEvent || 'click';
	json.auto=json.auto || false;
	json.time=json.time || 2000;
	
	var iNow=0;
	var timer=null;
	this.each(function(index,element){
		var aBtn=$(this).find('input');
		var aDiv=$(this).find('div');	
		aBtn[json.sEvent](function(){
			iNow=$(this).index();
			tab();
		});	
		
		function tab(){
			aBtn.removeClass('active');	
			aBtn.eq(iNow).addClass('active');
			aDiv.hide();
			aDiv.eq(iNow).show();	
		}
		function next(){
			iNow++;
			if(iNow==aBtn.length)iNow=0;
			tab();	
		}
		
		if(json.auto){
			timer=setInterval(next,json.time);
			
			$(this).mouseover(function(){
				clearInterval(timer);	
			});	
			
			$(this).mouseout(function(){
				timer=setInterval(next,json.time);	
			});	
		}
	});
};