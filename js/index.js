
window.onload =function(){
	var oMindBox =document.getElementById('mind_box');
	var oOl =document.getElementById('js_tabbtn');
	var oUl =document.getElementById('js_tabbox');
	var aBtn=oOl.children;
	var aBox=oUl.children;
	var oHomePage =document.getElementById('js_index_word');
	var oEnter =oHomePage.getElementsByTagName('p')[0];
	var iNow =-1;
	var zIndex =0;
	//首页欢迎语
	;(function(){
		welWord();
		oEnter.onclick =function(){
			oHomePage.style.display ='none';
			aBtn[0].className ='active';
			aBox[0].style.zIndex =100;
			move(aBox[0],{opacity:0.8},{duration:1000})
		};
		function welWord(){	
			var indexWord ="Welcome To Leo's Home";
			for(i=0;i<indexWord.length;i++){
				var oLeo =document.createElement('span');
				oLeo.innerHTML =indexWord.charAt(i);
				oHomePage.appendChild(oLeo);
			}
			var aLeo =oHomePage.children;
			var timer =null;
			var j=0;
			timer =setInterval(function(){
				move(aLeo[j],{opacity:1})
				j++;
				if(j == aLeo.length){
					clearInterval(timer);
				}
			},100)
		};
	})();
	
	

	//选项卡；
	for(var i=0;i<aBtn.length;i++){
		(function(index){
			aBtn[i].onclick =function(){
				iNow=index;
				tab();
				oBarMove();
			};
		})(i)
	};
	
	//封装选项卡
	function tab(){
		for(var i=0;i<aBtn.length;i++){
			aBtn[i].className ='';
			aBox[i].style.zIndex =1;
			move(aBox[i],{opacity:0});
		}
		aBtn[iNow%aBtn.length].className ='active';
		aBox[iNow%aBtn.length].style.zIndex =zIndex++;
		move(aBox[iNow%aBtn.length],{opacity:0.8},{duration:1000})
	};
	//下拉切换
	function next(){
		iNow++;
		tab();
		oBarMove();
	};
	//上拉切换
	function prev(){
		iNow--;
		if(iNow<0){
			iNow=aBtn.length-1
		}
		tab();
		oBarMove();
	};
	
	//滚轮切换
	addWheel(document,function(bDOwn){		
		if(bDOwn){
			next();
			oHomePage.style.display ='none';
		}else{
			prev();
			oHomePage.style.display ='none';
		}
	});
	
	//读条效果
	function oBarMove(){ 
		var oBar =document.getElementById('js_bar');
		var oLi  =oBar.children;
		var oBarbox =oBar.getElementsByTagName('div');
		var oBarline=oBar.getElementsByTagName('span');	
		for(var i=0;i<oLi.length;i++){
			(function(index){
				var W =0;
				clearInterval(timer);
				var timer=setInterval(function(){
					W+=10;
					if(W>440-(index*20)){
						clearInterval(timer)
					}
					move(oBarline[index],{width:W});
				},50)
			})(i)
		}
	};

};

//封装滚轮事件；bDOWN
function addWheel(obj,fn){
	function fnWheel(ev){
		var oEvent = ev||event;
		var bDown = true;//true  向下   false   向上
		if(oEvent.wheelDelta){
			//wheelDelta
			if(oEvent.wheelDelta>0){
				bDown=false;
			}else{
				bDown=true;
			}
		}else{
			//detail
			if(oEvent.detail<0){
				bDown=false;
			}else{
				bDown=true;
			}
		}
		fn(bDown);
		oEvent.preventDefault&&oEvent.preventDefault();
		return false;
	}
	if(window.navigator.userAgent.indexOf('Firefox')!=-1){
		//DOMMouseScroll
		obj.addEventListener('DOMMouseScroll',fnWheel,false);
	}else{
		//onmousewheel
		obj.onmousewheel=fnWheel;
	}
}

//封装运动框架
function move(obj,json,options){
	options=options || {};
	options.duration=options.duration || 300;
	options.easing=options.easing || 'ease-out';
	
	var count=Math.ceil(options.duration/30);
	var start={};
	var dis={};
	for(var name in json){
		start[name]=parseFloat(getStyle(obj,name));
		
		if(isNaN(start[name])){
			switch(name){
				case 'left':
					start[name]=obj.offsetLeft;
					break;
				case 'top':
					start[name]=obj.offsetTop;
					break;
				case 'width':
					start[name]=obj.offsetWidth;
					break;
				case 'height':
					start[name]=obj.offsetHeight;
					break;
				case 'opacity':
					start[name]=1;
					break;
				case 'fontSize':
					start[name]=12;
					break;
				//.....
			}
		}
		
		dis[name]=json[name]-start[name];
	}
	
	var n=0;
	
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
		n++;
		
		for(var name in json){
			
			switch(options.easing){
				case 'linear':
					var a=n/count;
					var cur=start[name]+dis[name]*a;
					break;
				case 'ease-in':
					var a=n/count;
					var cur=start[name]+dis[name]*Math.pow(a,3);
					break;
				case 'ease-out':
					var a=1-n/count;
					var cur=start[name]+dis[name]*(1-Math.pow(a,3));
					break;
			}
			
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		
		if(n==count){
			clearInterval(obj.timer);
			options.complete && options.complete();
		}
	},30);
}

//获取非行间样式
function getStyle(obj,name){
	return (obj.currentStyle || getComputedStyle(obj,false))[name];
}

