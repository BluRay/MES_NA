var chart1;
var chart2;
var chart3;
var colors=[  '#a8ef9d','#24CBE5','#629b58', '#058DC7', '#FF9655','#50B432', '#FFF263','#ED561B', '#DDDF00', '#6AF9C4'];
$(document).ready(function() {				
			//初始化页面
			initPage();
			$('#nav-search-input').bind('keydown', function(event) {
				if (event.keyCode == "13") {
					window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
					return false;
				}
			})
/*			$(".ui-sortable").bind('sortstop', function(event, ui) { 
				//alert(ui.item.context.clientWidth);
				var widget=$(ui.item[0]).find(".widget-body");
				//alert(widget.attr("id"))
				chart_id=widget.attr("id");
				if(chart_id=='chart1'){
					chart1.setSize(ui.item.context.clientWidth-20,190)
				}
				if(chart_id=='chart2'){
					chart2.setSize(ui.item.context.clientWidth-20,190)
				}
				if(chart_id=='chart3'){
					chart3.setSize(ui.item.context.clientWidth-20,190)
				}
			});*/
			
			setInterval(function () {										
				ajaxGetOrderChartData();		
				drawFactoryOrderChart();
				drawOutputChart();				
			},1000*60*60);
			
			setInterval(function () {
				drawFactoryDailyChart();
				//drawFactoryException();			
			},1000*60*10);
			
		$("#search_factory").change(function(){
			drawFactoryDailyChart();
			drawFactoryOrderChart();
			//drawFactoryException();
		})
		
		//$('.factory_act_order').eq(0).siblings().hide();
		var interval_1=setInterval("moveActOrderChart()",100)	
		
		var interval_2=setInterval("moveExceptionChart()",200)	
		
		$("#factory_act_order").mouseover(function(){
			if(interval_1){
		        clearInterval(interval_1);
		        interval_1 = null;
		    }
		}).mouseout(function(){
			 if(interval_1){
			        clearInterval(interval_1);
			        interval_1 = null;
			    }
			 interval_1 = setInterval("moveActOrderChart()",100)
		});
		
		$("#exception").mouseover(function(){
			if(interval_2){
		        clearInterval(interval_2);
		        interval_2 = null;
		    }
		}).mouseout(function(){
			if(interval_2){
		        clearInterval(interval_2);
		        interval_2 = null;
		    }
		 interval_2 = setInterval("moveExceptionChart()",200)
		})

	})
	
	function initPage(){
	getFactorySelect("","","#search_factory",null,"id");
	ajaxGetOrderChartData();	
	drawFactoryOrderChart();
	drawOutputChart();
	drawFactoryDailyChart();
	//drawFactoryException();
	//drawStaffCountChart();
	getBusNumberSelect('#nav-search-input');
	$('.widget-container-col').sortable({
		connectWith : '.widget-container-col',
		items : '> .widget-box',
		handle : ace.vars['touch'] ? '.widget-header' : false,
		cancel : '.fullscreen',
		opacity : 0.8,
		revert : true,
		forceHelperSize : true,
		placeholder : 'widget-placeholder',
		forcePlaceholderSize : true,
		tolerance : 'pointer',
		start : function(event, ui) {
			ui.item.parent().css({
				'min-height' : ui.item.height()
			})
		},
		update : function(event, ui) {
			ui.item.parent({
				'min-height' : ''
			})
		}
	});
	
	$('.page-content').ace_scroll({
		size: $(window).height()*0.85
    });
	
	}
	
	function ajaxGetOrderChartData(){
		var bar_series=[0,0,0,0];
		var pie_series=[0,0,0,0];
		$.ajax({
			url:'common/getIndexOrderData',
			type:'get',
			dataType:'json',
			cache:false,
			//async:false,
			data:{},
			success:function(response){
				var data=response.data;
				var total=data.warehouse_qty+data.producting_qty+data.unstart_qty+data.dispatch_qty;
				bar_series=[data.unstart_qty,data.producting_qty,data.warehouse_qty,data.dispatch_qty];
				pie_series=[Number((data.unstart_qty/total*100).toFixed(2)),Number((data.producting_qty/total*100).toFixed(2)),
				            Number((data.warehouse_qty/total*100).toFixed(2)),Number((data.dispatch_qty/total*100).toFixed(2))]
			
				if(data){
					drawOrderChart(bar_series,pie_series);
				}				
			}
		})
	}
	
				
	function drawOrderChart(bar_series,pie_series){
	chart1=Highcharts.chart("container",
			{
				credits: 
				{
			            enabled: false
			    },
			    width: 300,
				title : null,
				chart : {
					type : 'bar',
					height : 190
				},
				legend : {
					enabled : false,
					title : {
						text : ""
					}
				},
				colors: colors,
				tooltip:{
					enabled:false
				},
				xAxis : {
					categories : [ 'Not started', 'In line', 'Outgoing','Delivery' ]
				},
				yAxis : {
					title:{
						text:null
					},
					 visible: false
				},
				plotOptions: {
					series: {
			            colorByPoint: true
			        },
		            bar: {
		                dataLabels: {
		                    enabled: true,
		                    allowOverlap: true,
		                	inside:true
		                }
		            },
		            pie: {
		                dataLabels: {
		                    enabled: true,
		                    allowOverlap: true,
		                	inside:true,
		                	distance: 5
		                }
		            }
		        },
				labels : {
					/*items : [ {
						html : '水果消耗',
						style : {
							left : '350',
							top : '18',
							color : (Highcharts.theme && Highcharts.theme.textColor)
									|| 'black'
						}
					} ]*/
				},
				series : [ {
					type : 'bar',
					data : bar_series,					
				}, {
					type : 'pie',
					center:['80%','40%'],
					size:'75%',
					dataLabels: {
		                enabled: true,
		                format: '{y} %',
		                color:'black',
		               inside:false
		            },
					data : pie_series
				} ],
				 responsive: {
					 rules:[{
			                condition: {
			                    maxWidth: 1000,
			                    minWidth:200
			                }
					 }]
				 }
		
			});
}

function drawOutputChart(){
	var series=[];
	var factory_data_list=[];	
	
	$.ajax({
		url:'common/getIndexOutputData',
		type:'get',
		dataType:'json',
		cache:false,
		//async:false,
		data:{
		},
		success:function(response){
			series=response.series;
			factory_data_list=response.factory_data;
			var quarter_1=0;
			var quarter_2=0;
			var quarter_3=0;
			var quarter_4=0;
			$.each(series,function(i,serie){
				var data=serie.data;
				quarter_1+=Number(data[0])+Number(data[1])+Number(data[2]);
				quarter_2+=Number(data[3])+Number(data[4])+Number(data[5]);
				quarter_3+=Number(data[6])+Number(data[7])+Number(data[8]);
				quarter_4+=Number(data[9])+Number(data[10])+Number(data[11]);
			})
			
			chart2=Highcharts.chart("container2",
					{
						credits: 
						{
					            enabled: false
					    },
					    title:{
					    	text:null
					    },
					    subtitle : {
							text: '<b>first quarter：</b><span style="color: green">'+quarter_1+'</sapn>'+'   <b>second quarter：</b><span style="color: green">'+quarter_2+'</span>'+
							'   <b>third quater：</b><span style="color: green">'+quarter_3+'</span>   <b>fourth quarter：</b><span style="color: green">'+quarter_4+'</span>'
						},
						chart : {
							type : 'column',
							height : 200					
						},
						colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
						 legend: {
					            align: 'center',
					            x: 0,
					            verticalAlign: 'bottom',
					            y: 25,
					            floating: true,
					            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
					            borderColor: '#CCC',
					            borderWidth: 0,
					            shadow: false
						 },
						tooltip:{
							style:{
								whiteSpace:'inherit'
							},
							formatter: function () {
				                var s= '' 
				                var total=0;
				                $.each(this.points, function () {
				                    s += '<b>' + this.series.name + '</b>: ' +
				                        this.y +' ';
				                    total+=Number(this.y);
				                });
				                s+='<br/>';
				                factory_data_list[this.x-1];
				                var fdl=factory_data_list[this.x-1];
				                $.each(fdl.split(","),function(i,data){
				                	//alert(data)
				                	var d='';
				  
				                	if((i+1)%2==0){
				                		d=data+'<br />';
				                	}
				                	if((i+1)%2!=0&&data!=''){
				                		d=data+' ';	
				                	}		                	
				                	s+=d;		
				                })
				              //  alert(s)
				                return s;
				            },
				            shared: true
						},
						xAxis : {
							   categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
						},
						yAxis : {
							title:{
								text:null
							},
							 visible: true,
							 stackLabels: {
					                enabled: true,
					                style: {
					                    fontWeight: 'bold',
					                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
					                }
					            }
						},
						plotOptions: {
							column: {
				                stacking: 'normal',
				                /*dataLabels: {
				                    enabled: true,
				                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
				                    style: {
				                        textShadow: '0 0 3px black'
				                    }
				                }*/
				            }
				        },
						labels : {

						},
						series : series,
						 responsive: {
							 rules:[{
					                condition: {
					                    maxWidth: 1000,
					                    minWidth:200
					                }
							 }]
						 }
				
					});
		}
	});
}

	function drawFactoryDailyChart(){

		$.ajax({
			url:'common/getIndexFactoryDailyData',
			type:'get',
			dataType:'json',
			cache:false,
			//async:false,
			data:{
				factory_id:$("#search_factory").val()
			},
			success:function(response){
				var data=response.data;
				var welding_plan_done="0/0";
				var welding_percent=0;
				var painting_plan_done="0/0";
				var painting_percent=0;
				var chassis_plan_done="0/0";
				var chassis_percent=0;
				var assembly_plan_done="0/0";
				var assembly_percent=0;
				
				$.each(response.data,function(i,data){
					if(data.key_name=='welding online'){
						welding_plan_done=(data.finished_qty+"/"+data.plan_qty);
						if(data.plan_qty==0||data.plan_qty==undefined){
							welding_percent=1
						}else
						welding_percent=data.finished_qty/data.plan_qty||0
					}
					if(data.key_name=='painting online'){
						painting_plan_done=(data.finished_qty+"/"+data.plan_qty);
						if(data.plan_qty==0||data.plan_qty==undefined){
							painting_percent=1
						}else
						painting_percent=data.finished_qty/data.plan_qty||0
					}
					if(data.key_name=='chassis online'){
						chassis_plan_done=(data.finished_qty+"/"+data.plan_qty);
						if(data.plan_qty==0||data.plan_qty==undefined){
							chassis_percent=1
						}else
						chassis_percent=data.finished_qty/data.plan_qty||0
					}
					if(data.key_name=='assembly offline'){
						assembly_plan_done=(data.finished_qty+"/"+data.plan_qty);
						if(data.plan_qty==0||data.plan_qty==undefined){
							assembly_percent=1
						}else
						assembly_percent=data.finished_qty/data.plan_qty||0
					}
				})
				$("#welding_plan_done").html(welding_plan_done);
				$("#welding_percent").attr("data-percent",(welding_percent*100).toFixed(1));
				$("#welding_percent").find(".percent").html((welding_percent*100).toFixed(1));
				
				$("#painting_plan_done").html(painting_plan_done);
				$("#painting_percent").attr("data-percent",(painting_percent*100).toFixed(1));
				$("#painting_percent").find(".percent").html((painting_percent*100).toFixed(1));
				
				$("#chassis_plan_done").html(chassis_plan_done);
				$("#chassis_percent").attr("data-percent",(chassis_percent*100).toFixed(1));
				$("#chassis_percent").find(".percent").html((chassis_percent*100).toFixed(1));
				
				$("#assembly_plan_done").html(assembly_plan_done);
				$("#assembly_percent").attr("data-percent",(assembly_percent*100).toFixed(1));
				$("#assembly_percent").find(".percent").html((assembly_percent*100).toFixed(1));
			}
		})
	
		$('.easy-pie-chart.percentage').each(function(){
			$(this).easyPieChart({
				barColor: $(this).data('color'),
				trackColor: '#EEEEEE',
				scaleColor: false,
				lineCap: 'butt',
				lineWidth: 6,
				animate: ace.vars['old_ie'] ? false : 1000,
				size:65
			}).css('color', $(this).data('color'));
		});
	}
	
	function drawFactoryOrderChart(){
		$("#factory_act_order").html("");
		$.ajax({
			url:'common/getIndexFactoryPrdOrdData',
			type:'get',
			dataType:'json',
			cache:false,
			//async:false,
			data:{
				factory_id:$("#search_factory").val()
			},
			success:function(response){
				var data=response.data;
				$.each(data,function(i,forder){
					var div_factory_order=$("<div class=\"factory_act_order\" />");
					var div_order_desc=$("<div class=\"row\"/>").html("<label class=\"col-xs-12 \" style=\"margin-left:100px;font-weight:bold\">"+forder.order_desc+"</label>");
					$(div_factory_order).append(div_order_desc);
					var rate_order=forder.order_rate;
					var factory_rate_list=JSON.parse("["+forder.factory_rate_list+"]");				
					
					var div_rate_f=$("<div class=\"row\">");
					var div_left=$("<div class=\"col-xs-8 \" >");
					$.each(factory_rate_list,function(i,obj){
					/*	var obj=JSON.parse(rate_f);*/
						var rate_f_html="<div class='row'><label class='col-xs-4 control-label no-padding-right'>"+obj.factory_name+"：</label>"+
													"<div class='progress pos-rel' data-percent='"+obj.factory_rate+"%'>"+
													"<div class='progress-bar progress-bar-success' style='width:"+obj.factory_rate+"%;'></div></div></div>";
						$(div_left).append($(rate_f_html));								
					})
					
					$(div_rate_f).append(div_left);
					var rate_o_html="<div class='col-xs-4  center'><div class='easy-pie-chart percentage' data-percent='"+rate_order+
					"' data-color='#D15B47' style='top:20%'>"+"<span class='percent'>"+rate_order+"</span>% </div> </div>";
					//alert(rate_o_html);
					$(div_rate_f).append(rate_o_html);	
					$(div_factory_order).append(div_rate_f);
					$("#factory_act_order").append(div_factory_order);
				})
				$('.easy-pie-chart.percentage').each(function(){
					$(this).easyPieChart({
						barColor: $(this).data('color'),
						trackColor: '#EEEEEE',
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: 6,
						animate: ace.vars['old_ie'] ? false : 1000,
						size:70
					}).css('color', $(this).data('color'));
				});
			}
			});
	}
	
	function drawFactoryException(){
		$("#exception").html("");
		$.ajax({
			url:'common/getIndexExceptionData',
			type:'get',
			dataType:'json',
			cache:false,
			//async:false,
			data:{
				factory:$("#search_factory :selected").text()
			},
			success:function(response){
				$.each(response.data,function(i,value){
					$("<li style='color:red'>").html(value.message).appendTo($("#exception"))
				})
			}
			})
	}
	
	function moveActOrderChart(){
		$("#factory_act_order").animate({
			marginTop: '-=1'
		},10,function(){
			var s = Math.abs(parseInt($(this).css("margin-top")));
			var c_height=$(this).find(".factory_act_order").eq(0).outerHeight(true);
			if(s>c_height){
				//alert(c_height)
				$(this).find(".factory_act_order").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
	}
	
	function moveExceptionChart(){
		$("#exception").animate({
			marginTop: '-=1'
		},20,function(){
			var s = Math.abs(parseInt($(this).css("margin-top")));
			var c_height=$(this).find("li").eq(0).outerHeight(true);
			if(s>c_height){
				//alert(c_height)
				$(this).find("li").slice(0, 1).appendTo($(this));
				$(this).css("margin-top", 0);
			}
		});
	}
	
function drawStaffCountChart(){

	var series=[];
	var factory_data_list=[];
	$.ajax({
		url:'common/getIndexStaffCountData',
		type:'get',
		dataType:'json',
		cache:false,
		//async:false,
		data:{
		},
		success:function(response){
			$.each(response.series,function(i,data){
				var arr=[data.plant_org,data.staff_count]
				series.push(arr);
			})
			factory_data_list=response.factory_data;
			
			chart3=Highcharts.chart("container3",
					{
						credits: 
						{
					            enabled: false
					    },
					    title:{
					    	text:null
					    },
		/*			    subtitle : {
							text: '<b>一季度：</b><span style="color: green">20</sapn>'+'   <b>二季度：</b><span style="color: green">30  </span>'+
							'<b>三季度：</b><span style="color: green">50  </span><b>四季度：</b><span style="color: green">50  </span>'+
							'<b>年度：</b><span style="color: green">150</span>'
						},*/
						chart : {
							type : 'column',
							height : 190					
						},
						colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
						tooltip:{
							formatter: function () {
								var plant_org=this.points[0].key;
								var staff_count_detail;
				                var s= '<b>' + plant_org+ '</b><br/>' 
				                $.each(factory_data_list,function(i,detail){
				                	if(detail.plant_org==plant_org){
				                		staff_count_detail=detail.staff_count_detail;
				                		return false;
				                	}			                	 
				                })
				                staff_count_detail=staff_count_detail||"";
				                $.each(staff_count_detail.split(","),function(i,data){
					                	var d='';				  
					                	if((i+1)%2==0){
					                		d=data+'<br />';
					                	}
					                	if((i+1)%2!=0&&data!=''){
					                		d=data+'   ';	
					                	}		                	
					                	s+=d;		
						          })
				                return s;
				            },
				            shared: true
						},
						legend: {
					            enabled: false
					     },
						xAxis : {
							 type: 'category',
					            labels: {
					                rotation: -45,
					                style: {
					                    fontSize: '11px',
					                    fontFamily: 'Verdana, sans-serif'
					                }
					            }
						},
						yAxis : {
							title:{
								text:null
							}
						},
						series : [
						          {
						        	  data:series,
						        	  dataLabels:{
							                enabled: true,
							                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray',
							                align: 'center',
							                format: '{point.y}', // one decimal
							                y: 10, // 10 pixels down from the top
							                style: {
							                    fontSize: '11px',
							                    fontFamily: 'Verdana, sans-serif'
							                }
							            }  
						          }
						          
						 ],
						 responsive: {
							 rules:[{
					                condition: {
					                    maxWidth: 1000,
					                    minWidth:200
					                }
							 }]
						 }
				
					});
		}
	});
}

function reload(flag){
	//alert(flag);
	if(flag=='1'){
		drawFactoryDailyChart();
	}
	if(flag=='2'){
		ajaxGetOrderChartData();				
	}
	if(flag=='3'){
		drawFactoryOrderChart();
	}
	if(flag=='4'){
		drawOutputChart();	
	}
	if(flag=='5'){
		drawFactoryException();
	}
	if(flag=='6'){
		drawStaffCountChart();
	}
}

function reportFoward(url){
	var factory_id=$("#search_factory").val();
	if(url){
		url+="?factory_id="+factory_id;
		window.open(url,'_self');
	}
	
}
