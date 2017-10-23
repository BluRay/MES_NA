var canvas = document.getElementById('canvas_wv');
var ctx = canvas.getContext("2d");
var canvas_w = canvas.width;
var canvas_h = canvas.height;
var btw=5;//矩形间隙
var recw_welding = Math.floor((canvas_w-4*btw)/2);//Welding矩形的宽
var rech_welding = Math.floor((canvas_h-4*btw)/3);//Welding矩形高
var recw_paint=Math.floor((canvas_w-4*btw)/4);//Paint 矩形的宽
var rech_paint=Math.floor((rech_welding*2-btw)/3);//Paint 矩形的高
var recw_outgoing=Math.floor((canvas_w-4*btw)/4);//Outgoing 矩形的宽
var rech_outgoing=Math.floor((rech_welding*2+btw))//Outgoing 矩形的高
var recw_chassis=recw_welding;//Chassis 矩形的宽
var rech_chassis = rech_welding;//Chassis矩形高	
var recw_assembly=recw_welding+recw_paint+btw;//Assembly 矩形的宽
var rech_assembly = rech_welding;//Assembly矩形高
var recw_testing = recw_paint; //Testing 矩形的宽
var rech_testing = rech_welding; //Testing矩形高
var station_rect_list=[];
var workshop_rect_list=[];
var cvs_stations=document.getElementById('canvas_stations');

$(document).ready(function(){
	initPage();
	document.onmousemove=function(e){e=e? e:window.event;$("#nav-search-input").val("X:"+e.screenX+"Y:"+e.screenY);}
	
	canvas.onmouseover=function(e){
		this.style.cursor = 'pointer';
	}
	canvas.onclick=function(e){
		var p=getEventPosition(e);
		//alert(p.x+"/"+p.y);
		var x=p.x;
		var y=p.y;
		
		var rect=getRect(x,y,workshop_rect_list);
		//alert(rect.x+"/"+rect.y);
		//alert(rect.name);
		var workshop=rect.name;
		if(rect.name=="Pre-Paint"||rect.name=="Painting"||rect.name=="Post-Paint"){
			workshop="Painting";
		}
		
	/**
	 * for example,线别列表
	 */
	var line_stations=[];
	var line_1={line:'Line I',stations:[{'code':'P-1','name':'P-1'},{'code':'P-2','name':'P-2'},{'code':'P-3','name':'P-3'},{'code':'P-4','name':'P-4'}
	,{'code':'P-5','name':'P-5'},{'code':'P-6','name':'P-6'},{'code':'P-7','name':'P-7'},{'code':'P-8','name':'P-8'},{'code':'P-9','name':'P-9'}]};
	line_stations.push(line_1);
	var line_2={line:'Line II',stations:[{'code':'P21','name':'P21'},{'code':'P22','name':'P22'},{'code':'P23','name':'P23'}]};
	line_stations.push(line_2)

	drawStationLine(workshop,line_stations);
		
	}
	
	cvs_stations.onmouseover=function(e){
		this.style.cursor = 'pointer';
	}
	cvs_stations.onclick=function(e){
		var p=getEventPosition(e);
		//alert(p.x+"/"+p.y);
		var x=p.x;
		var y=p.y;
		
		var rect=getStationRect(x,y,station_rect_list,cvs_stations);
		//alert(rect.x+"/"+rect.y);
		//alert(rect.name);		
		shineStation(rect,'start')
		
	}
	
	
	var tobj={};
	tobj.welding_text='Welding(20)';
	tobj.pre_paint_text='Pre-Paint(28)';
	tobj.painting_text='Painting(11)';
	tobj.post_paint_text='Post-Paint(20)';
	tobj.chassis_text='Chassis(22)';
	tobj.assembly_text='Assembly(28)';
	tobj.outgoing_text='Outgoing(20)';
	tobj.testing_text='Testing(18)';
	drawWorkshopView(tobj);
	
})

function initPage(){	
	$('.carousel').carousel();
	var tobj={};
	tobj.welding_text='Welding(10)';
	tobj.pre_paint_text='Pre-Paint(18)';
	tobj.painting_text='Painting(11)';
	tobj.post_paint_text='Post-Paint(10)';
	tobj.chassis_text='Chassis(12)';
	tobj.assembly_text='Assembly(18)';
	tobj.outgoing_text='Outgoing(10)';
	tobj.testing_text='Testing(8)';
	
	drawWorkshopView(tobj);
	/**
	 * for example,线别列表
	 */
	var line_stations=[];
	var line_1={line:'Line I',stations:[{'code':'W-1','name':'W-1'},{'code':'W-2','name':'W-2'},{'code':'W-3','name':'W-3'},{'code':'W-4','name':'W-4'}
	,{'code':'W-5','name':'W-5'},{'code':'W-6','name':'W-6'},{'code':'W-7','name':'W-7'},{'code':'W-8','name':'W-8'},{'code':'W-9','name':'W-9'}
	/*,{'code':'W-10','name':'W-10'},{'code':'W-11','name':'W-11'},{'code':'W-12','name':'W-12'},{'code':'W-13','name':'W-13'},{'code':'W-14','name':'W-14'}
	,{'code':'W-15','name':'W-15'},{'code':'W-16','name':'W-16'}*/]};
	line_stations.push(line_1);
	var line_2={line:'Line II',stations:[{'code':'W21','name':'W21'},{'code':'W22','name':'W22'},{'code':'W23','name':'W23'}]};
	line_stations.push(line_2)
	var line_3={line:'Line III',stations:[{'code':'W31','name':'W31'},{'code':'W32','name':'W32'},{'code':'W33','name':'W33'}]};
	line_stations.push(line_3)
	
	drawStationLine('Welding',line_stations);

}

function drawWorkshopView(tobj){
	ctx.clearRect(btw,btw,canvas_w,canvas_h)
	//焊装
	ctx.beginPath();
	ctx.fillStyle ='#058DC7';
	ctx.fillRect(btw, btw, recw_welding, rech_welding);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.welding_text,btw,btw,recw_welding,rech_welding);
	var rect_w={};
	rect_w.x=btw;
	rect_w.y=btw;
	rect_w.name='Welding';
	rect_w.btw=btw;
	rect_w.recw=recw_welding;
	rect_w.rech=rech_welding;
	workshop_rect_list.push(rect_w);
	//涂装
	ctx.beginPath();
	ctx.fillStyle ='#D7E0E8';
	ctx.fillRect(btw*2+recw_welding, btw, recw_paint, rech_paint);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.pre_paint_text,btw*2+recw_welding,btw,recw_paint,rech_paint);
	var rect_pp={};
	rect_pp.x=btw*2+recw_welding;
	rect_pp.y=btw;
	rect_pp.name='Pre-Paint';
	rect_pp.btw=btw;
	rect_pp.recw=recw_paint;
	rect_pp.rech=rech_paint;
	workshop_rect_list.push(rect_pp);
	
	ctx.beginPath();
	ctx.fillStyle ='#D7E0E8';
	ctx.fillRect(btw*2+recw_welding, 2*btw+rech_paint, recw_paint, rech_paint);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.painting_text,btw*2+recw_welding,btw*2+rech_paint,recw_paint,rech_paint);
	var rect_p={};
	rect_p.x=btw*2+recw_welding;
	rect_p.y=2*btw+rech_paint;
	rect_p.name='Painting';
	rect_p.btw=btw;
	rect_p.recw=recw_paint;
	rect_p.rech=rech_paint;
	workshop_rect_list.push(rect_p);
	
	ctx.beginPath();
	ctx.fillStyle ='#D7E0E8';
	ctx.fillRect(btw*2+recw_welding, (3*btw+rech_paint*2), recw_paint, rech_paint);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.post_paint_text,btw*2+recw_welding,btw*3+rech_paint*2,recw_paint,rech_paint);
	var rect_pop={};
	rect_pop.x=btw*2+recw_welding;
	rect_pop.y=3*btw+rech_paint*2;
	rect_pop.name='Post-Paint';
	rect_pop.btw=btw;
	rect_pop.recw=recw_paint;
	rect_pop.rech=rech_paint;
	workshop_rect_list.push(rect_pop);
	
	//底盘 #3DE4FE
	ctx.beginPath();
	ctx.fillStyle ='#3DE4FE';
	ctx.fillRect(btw, (btw*2+rech_welding), recw_chassis, rech_chassis);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.chassis_text,btw,btw*2+rech_welding,recw_welding,rech_welding);
	var rect_dp={};
	rect_dp.x=btw;
	rect_dp.y=btw*2+rech_welding;
	rect_dp.name='Chassis';
	rect_dp.btw=btw;
	rect_dp.recw=recw_chassis;
	rect_dp.rech=rech_chassis;
	workshop_rect_list.push(rect_dp);
	
	//总装 #9FDABF
	ctx.beginPath();
	ctx.fillStyle ='#9FDABF';
	ctx.fillRect(btw, (btw*3+rech_welding+rech_chassis), recw_assembly, rech_assembly);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.assembly_text,btw,btw*3+rech_welding*2,recw_assembly,rech_welding);
	var rect_zz={};
	rect_zz.x=btw;
	rect_zz.y=btw*3+rech_welding+rech_chassis;
	rect_zz.name='Assembly';
	rect_zz.btw=btw;
	rect_zz.recw=recw_assembly;
	rect_zz.rech=rech_assembly;
	workshop_rect_list.push(rect_zz);
	
	//检测线 #7DFE8B
	ctx.beginPath();
	ctx.fillStyle ='#7DFE8B';
	ctx.fillRect((btw*3+recw_welding+recw_paint), (btw*2+rech_outgoing), recw_testing, rech_testing);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.testing_text,btw*3+recw_welding+recw_paint,btw*2+rech_outgoing,recw_testing,rech_testing);
	var rect_jcx={};
	rect_jcx.x=btw*3+recw_welding+recw_paint;
	rect_jcx.y=btw*2+rech_outgoing;
	rect_jcx.name='Testing';
	rect_jcx.btw=btw;
	rect_jcx.recw=recw_testing;
	rect_jcx.rech=rech_testing;
	workshop_rect_list.push(rect_jcx);
	
	//仓库 #FFAF6E
	ctx.beginPath();
	ctx.fillStyle ='#FFAF6E';
	ctx.fillRect((btw*3+recw_welding+recw_paint), btw, recw_outgoing, rech_outgoing);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj.outgoing_text,btw*3+recw_welding+recw_paint,btw,recw_outgoing,rech_outgoing);
	var rect_rk={};
	rect_rk.x=btw*3+recw_welding+recw_paint;
	rect_rk.y=btw;
	rect_rk.name='Outgoing';
	rect_rk.btw=btw;
	rect_rk.recw=recw_outgoing;
	rect_rk.rech=rech_outgoing;
	workshop_rect_list.push(rect_rk);
}

//得到点击的坐标  
function getEventPosition(event){  
    var x, y;  

    var e = event || window.event;
    var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
    var x = e.pageX || e.clientX + scrollX;
    var y = e.pageY || e.clientY + scrollY;
    
    return {x: x, y: y};  
}

//判断在哪个矩形中
function getRect(x,y,rect_list,cvs){
	cvs=cvs||canvas;
	var sidebar=$(".sidebar")[0];
	var cvs_left=$(sidebar).width();
	mTop = $(cvs).offset().top;
    sTop = $(window).scrollTop();
    var cvs_top = mTop - sTop;
    //alert("cvs_left:"+cvs_left+"/mTop:"+mTop+"/sTop:"+sTop);

    var r={};
	$.each(rect_list,function(i,rect){
		if(x>=(rect.x+cvs_left+20)&&x<=(rect.x+cvs_left+20)+rect.recw&&y>=(rect.y+cvs_top+sTop)&&y<=(rect.y+cvs_top+sTop)+rect.rech){
			 r=rect;
			 return;
		}
	});
	//alert(JSON.stringify(r))
	return r;
}
/**
 * 获取station 矩形框
 * @param x
 * @param y
 * @param rect_list
 * @param cvs
 * @returns {___anonymous8489_8490}
 */
function getStationRect(x,y,rect_list,cvs){
	var sidebar=$(".sidebar")[0];
	var cvs_left=$(sidebar).width();
	mTop = $(cvs).offset().top;
    sTop = $(window).scrollTop();
    var cvs_top = mTop - sTop;
    //alert("cvs_left:"+cvs_left+"/mTop:"+mTop+"/sTop:"+sTop);

    var r={};
	$.each(rect_list,function(i,rect){
		if(x>=(rect.x+cvs_left+20)&&x<=(rect.x+cvs_left+20)+rect.recw&&y>=(rect.y+cvs_top+sTop)&&y<=(rect.y+cvs_top+sTop)+rect.rech){
			 r=rect;
			 r.index=i;
			 return;
		}
	});
	//alert(JSON.stringify(r))
	return r;
}

function drawRectText(text,x_s,y_s,recw,rech,font){
	font=font||16;
	var text_width=ctx.measureText(text).width;
	var text_height=ctx.measureText(text).height;
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.font = font+"px Arial";
	ctx.fillText(text,
			(Math.floor((recw -(font/2 * text.length)) / 2)  + x_s),
			(y_s+Math.floor(rech/2)+font/2));
	ctx.closePath();
}

function drawStationLine(workshop,line_stations){
	$("#stations").html(workshop+":");
	var cvs=document.getElementById('canvas_stations');
	var ctx_s=cvs.getContext("2d");
	var s_width=60;
	var s_height=40;
	var btw=15;//station 间隙
	var color='rgb(150, 200, 150)';
	var y_s=btw;
	var x_s=btw;
	caculateCanvasHeigth(line_stations);
	var cvs_w=cvs.width;
	var cvs_h=cvs.height;
	
	ctx_s.clearRect(0,0,cvs_w,cvs_h);
	
	
	$.each(line_stations,function(i,line){
		var yi_s=btw;
		var xi_s=btw;
		var line_name=line.line;
		var stations=line.stations;
		//draw 线别名称
		ctx_s.font = "16px Arial";
		ctx_s.fillStyle='black'
		ctx_s.fillText(line_name, btw, y_s+(s_height/2)+8);
		
		var xi = 1;
		var yi = 1;
		$.each(stations,function(i,station){
			//alert((xi_s+s_width+btw+s_width)+"/"+cvs_w+"/"+station.code)
			if ((xi_s+s_width+btw+s_width)>cvs_w) {
				xi = 1;
				yi++;					
			}
			xi_s = btw+60 + (s_width + btw) * (xi - 1);
			yi_s = y_s;
			if ((xi_s+s_width+btw+s_width)>cvs_w) {
				y_s+=btw+s_height;				
			}
			//alert(yi_s)
			station.x=xi_s;
			station.y=yi_s;
			drawStation(station);
			
			xi++;
		})
		//alert(y_s+"/"+line_name)
		y_s+=btw+s_height;
		
	})
}

function drawStation(station){
	
	var cvs=document.getElementById('canvas_stations');
	var ctx_s=cvs.getContext("2d");
	var s_width=60;
	var s_height=40;
	var btw=15;//station 间隙
	color=station.color||'rgb(150, 200, 150)';
	//alert(xi_s+"/"+yi_s)
	
	ctx_s.beginPath();
	ctx_s.fillStyle =color;
	ctx_s.fillRect(station.x, station.y, s_width, s_height);
	ctx_s.stroke();
	var rect={};
	rect.code=station.code;
	rect.x=station.x;
	rect.y=station.y;
	rect.name=station.name;
	rect.stationId=station.id;
	rect.workshop=station.workshopId;
	rect.line=station.line;
	rect.factory=station.factory;
	rect.btw=btw;
	rect.recw=s_width;
	rect.rech=s_height;
	rect.color=color;

	station_rect_list.push(rect);
	ctx_s.closePath();

	
	ctx_s.beginPath();
	ctx_s.fillStyle = "black";
	ctx_s.font = "14px Arial";
	ctx_s.fillText(station.code,
			(Math.floor((s_width -(7* station.code.length)) / 2)  + station.x),
			(station.y+Math.floor(s_height/2)+7));
	
	ctx_s.closePath();
	
	
}

function caculateCanvasHeigth(line_stations){
	var cvs=document.getElementById('canvas_stations');
	var ctx_s=cvs.getContext("2d");
	var cvs_w=cvs.width;
	var s_width=70;
	var s_height=40;
	var btw=15;//station 间隙
	var y_s=btw;
	var x_s=btw;
	
	
	$.each(line_stations,function(i,line){
		var yi_s=btw;
		var xi_s=btw;
		var xi = 1;
		var yi = 1;
		var stations=line.stations;
		$.each(stations,function(i,station){
			if ((xi_s+s_width+btw+s_width)>cvs_w) {
				xi = 1;
				yi++;
				y_s+=btw+s_height;
			}
			xi_s = btw+60 + (s_width + btw) * (xi - 1);
			yi_s = y_s;			
			xi++;
		})
		y_s+=btw+s_height;
	})	
	$(cvs).attr("height",y_s);
}

function shineStation(rect,flag){
	if(flag=='start'){
		setInterval(function(){
			if(rect.color=='red'){
				rect.color='rgb(150, 200, 150)';
				drawStation(rect);
			}else{
				rect.color='red';
				drawStation(rect);
			}
		},500)
	}else{
		rect.color='rgb(150, 200, 150)';
		drawStation(rect);
	}

}