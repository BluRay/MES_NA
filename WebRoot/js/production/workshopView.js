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
var ctx_s=cvs_stations.getContext("2d");
var shine_timer_list=[] ;
var shine_station_list=[];

$(document).ready(function(){
	initPage();
	//document.onmousemove=function(e){e=e? e:window.event;$("#nav-search-input").val("X:"+e.screenX+"Y:"+e.screenY);}
	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("../production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	setInterval(function(){
		var workshop=$("#stations").html().substring(0,$("#stations").html().length-1);
		var tobj=ajaxGetWorkshopStock($("#search_factory :selected").text(),$("#search_factory").val());		
		drawWorkshopView(tobj);		
		/**
		 * 工位canvas
		 */
		var line_stations=ajaxGetLinStationList($("#search_factory :selected").text(),workshop);	
		drawStationLine(workshop,line_stations);
		
		var bus_list=ajaxGetBusList(workshop);	
		drawBusDetails(bus_list);
		$('.carousel').carousel();
		
	},1000*60)
	
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
		var workshop=rect.name;
		var station="";
		if(rect.name=="Pre-Paint"||rect.name=="Painting"||rect.name=="Post-Paint"){
			workshop="Painting";
		}
		if(rect.name=="Testing"){
			workshop="Assembly";
			station="Test";
		}
		
		/**
		 * 工位canvas
		 */
		var line_stations=ajaxGetLinStationList($("#search_factory :selected").text(),workshop);	
		drawStationLine(workshop,line_stations);
		
		/**
		 * 显示车辆明细
		 */
		var bus_list=ajaxGetBusList(workshop,station);	
		drawBusDetails(bus_list);
		$('.carousel').carousel();
	}
	/**
	 * 工位canvas鼠标悬停
	 */
	cvs_stations.onmouseover=function(e){
		this.style.cursor = 'pointer';
	}
	/**
	 * 工位canvas鼠标点击事件，查询点击工位下车辆明细列表
	 */
	cvs_stations.onclick=function(e){
		var p=getEventPosition(e);
		//alert(p.x+"/"+p.y);
		var x=p.x;
		var y=p.y;
		
		var rect=getStationRect(x,y,station_rect_list,cvs_stations);
		
		/**
		 * 显示车辆明细
		 */
		var workshop=$("#stations").html().substring(0,$("#stations").html().length-1);
		var bus_list=ajaxGetBusList(workshop,rect.name,rect.station_id);	
		drawBusDetails(bus_list);
		$('.carousel').carousel();
	}
	
	
})

function initPage(){	
	getFactorySelect("","","#search_factory",null,"id");
	getBusNumberSelect('#nav-search-input');
	var tobj=ajaxGetWorkshopStock($("#search_factory :selected").text(),$("#search_factory").val());
	
	drawWorkshopView(tobj);
	
	/**
	 * 工位canvas
	 */
	var line_stations=ajaxGetLinStationList($("#search_factory :selected").text(),"Welding");	
	drawStationLine('Welding',line_stations);
	
	var bus_list=ajaxGetBusList('Welding');	
	drawBusDetails(bus_list);
	$('.carousel').carousel();
}

function drawWorkshopView(tobj){
	ctx.clearRect(btw,btw,canvas_w,canvas_h)
	//焊装
	ctx.beginPath();
	ctx.fillStyle ='#058DC7';
	ctx.fillRect(btw, btw, recw_welding, rech_welding);
	ctx.stroke();
	ctx.closePath();
	drawRectText(tobj['Welding_text'],btw,btw,recw_welding,rech_welding);
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
	drawRectText(tobj['Pre-Paint_text'],btw*2+recw_welding,btw,recw_paint,rech_paint);
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
	drawRectText(tobj['Painting_text'],btw*2+recw_welding,btw*2+rech_paint,recw_paint,rech_paint);
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
	drawRectText(tobj['Post-Paint_text'],btw*2+recw_welding,btw*3+rech_paint*2,recw_paint,rech_paint);
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
	drawRectText(tobj['Chassis_text'],btw,btw*2+rech_welding,recw_welding,rech_welding);
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
	drawRectText(tobj['Assembly_text'],btw,btw*3+rech_welding*2,recw_assembly,rech_welding);
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
	drawRectText(tobj['Testing_text'],btw*3+recw_welding+recw_paint,btw*2+rech_outgoing,recw_testing,rech_testing);
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
	drawRectText(tobj['Outgoing_text'],btw*3+recw_welding+recw_paint,btw,recw_outgoing,rech_outgoing);
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
	shine_station_list=[];
	$.each(shine_timer_list,function(i,shine_timer){
		clearInterval(shine_timer);
	})
	
	$("#stations").html(workshop+":");
	//var cvs=document.getElementById('canvas_stations');
	//var ctx_s=cvs.getContext("2d");
	var s_width=60;
	var s_height=40;
	var btw=15;//station 间隙
	var color='rgb(150, 200, 150)';
	var y_s=btw;
	var x_s=btw;
	caculateCanvasHeigth(line_stations);
	var cvs_w=cvs_stations.width;
	var cvs_h=cvs_stations.height;
	//alert(cvs_w+"/"+cvs_h)
	ctx_s.clearRect(0,0,cvs_w,cvs_h);
	
	
	$.each(line_stations,function(i,line){
		var yi_s=btw;
		var xi_s=btw;
		var line_name=line.line_name;
		var stations=JSON.parse(line.process_list);
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
			
			if(station.status=='abnormal'){
				shine_station_list.push(station)
			}
			
			xi++;
		})
		//alert(y_s+"/"+line_name)
		y_s+=btw+s_height;
		
	})
	
	$.each(shine_station_list,function(i,station){
		var shine_timer=shineStation(station,'start');
		shine_timer_list.push(shine_timer);
	})

}

function drawStation(station){
	var s_width=60;
	var s_height=40;
	var btw=15;//station 间隙
	color=station.color||'rgb(150, 200, 150)';
	//alert(xi_s+"/"+yi_s)
	ctx_s.clearRect(station.x,station.y,s_width,s_height)
	
	ctx_s.beginPath();
	ctx_s.fillStyle =color;
	ctx_s.fillRect(station.x, station.y, s_width, s_height);
	ctx_s.stroke();
	var rect={};
	rect.code=station.code;
	rect.x=station.x;
	rect.y=station.y;
	rect.name=station.name;
	rect.station_id=station.id;
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
	//var cvs=document.getElementById('canvas_stations');
	//var ctx_s=cvs.getContext("2d");
	var cvs_w=cvs_stations.width;
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
		var stations=JSON.parse(line.process_list);
		
		$.each(stations,function(i,station){
			if ((xi_s+s_width+btw+s_width)>cvs_w) {
				xi = 1;
				yi++;
				y_s+=(btw+s_height);
			}
			xi_s = btw+60 + (s_width + btw) * (xi - 1);
			yi_s = y_s;			
			xi++;
		})
		y_s+=(btw+s_height);
	})	

	$(cvs_stations).attr("height",y_s);
}

function shineStation(rect,flag){
	var shine_timer="";
	if(flag=='start'){
		shine_timer=setInterval(function(){
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
	return shine_timer;
}

function drawBusDetails(bus_list){
	$("#myCarousel").find(".carousel-inner").eq(0).html("");
	if(bus_list.length==0){
		$("#myCarousel").find(".carousel-inner").eq(0).html("<div style='text-align:center;margin-top:20%;font-size:16px;color:red'>"+Warn.W_20+"</div>");
	}
	$.each(bus_list,function(i,bus){
		var cp_item= $('#bus_item_temp').clone(true);
		$(cp_item).removeClass("hidden");
		if(i==0){
			$(cp_item).addClass("active");			
		}
		$(cp_item).find(".station").html(bus.station);
		$(cp_item).find(".status").html((bus.abnormal_cause!=undefined)?("<sapn style='color:red'>"+bus.abnormal_cause+"</span>"):"Normal");
		$(cp_item).find(".bus_no").html((bus.abnormal_cause!=undefined)?("<sapn style='color:red'>"+bus.bus_number+"</span>"):bus.bus_number);
		$(cp_item).find(".vin").html(bus.VIN.trim().length==0?"("+Warn.W_22+")":bus.VIN);
		$(cp_item).find(".project").html(bus.project_name);
		$(cp_item).find(".punch_list").html(bus.punch_open+" in Open &"+bus.punch_closed+" in Closed");
		$(cp_item).find(".ecn").html(bus.ecn_open+" in Open &"+bus.ecn_closed+" in Closed");
		$(cp_item).find(".pagesec").html((i+1)+"/"+bus_list.length);
		$(cp_item).attr("id","item_"+i)
		$("#myCarousel").find(".carousel-inner").eq(0).append(cp_item);
	})
	
}

function ajaxGetWorkshopStock(factory,factory_id){
	var tobj={};
	$.ajax({
		url:'getWorkshopStock',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			factory:factory,
			factory_id:factory_id
		},
		success:function(response){
			tobj=response.data;

		}
	})
	
	return tobj;
}

function ajaxGetLinStationList(factory,workshop){
	var conditions={factory:factory,workshop:workshop};
	
	var line_stations=[];
	$.ajax({
		url:'getLineProcessList',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			conditions:JSON.stringify(conditions)
		},
		success:function(response){
			line_stations=response.dataList;
		}
	})
	
	return line_stations;
}

function ajaxGetBusList(workshop,station,station_id){
	var bus_list=[];
	$.ajax({
		url:'getMonitorBusList',
		type:'post',
		dataType:'json',
		async:false,
		data:{
			factory:$("#search_factory :selected").text(),
			factory_id:$("#search_factory").val(),
			workshop:workshop,
			station:station,
			station_id:station_id
		},
		success:function(response){
			bus_list=response.data;
		}
	})
	return bus_list;
}