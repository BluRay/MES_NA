$(document).ready(function(){
	
	initPage();
//	$("#btnQuery").click(function(){
//		ajaxQuery();
//	});
	$("input[type='radio']").change(function(){
		getPlanRateDate();
		ajaxQuery();
	});
	$("#btnQuery").on("click",function () {
		$("input[name='xx']").attr('checked',false);
		ajaxQuery();
	});
})

function initPage(){
	getFactorySelect("report/workshopRateReport","","#search_factory",null,"id");
	getPlanRateDate();
	ajaxQuery();
}
function ajaxQuery(){
	$("#containerReport").html('');
	var start = $("#start_date").val();
	var end = $("#end_date").val();
	if(start.trim()==''){
		alert('必须输入起始日期！');
		return;
	}
	if(end.trim()==''){
		alert('必须输入结束日期！');
		return;
	}
	$.ajax({
	    url: "getWorkshopRateData",
	    type:'get',
		dataType:'json',
		cache:false,
		async:false,
	    data: {
	    	'factory_id':$("#search_factory").val(),
	    	'start_date':$("#start_date").val(),
	    	'end_date': $("#end_date").val()
	    },
	    success:function(response){	
			var title = "车间计划达成率 ";
			var subtitle = $("#start_date").val()+"至"+$("#end_date").val()+"达成率";
	        var yAxis = [
	        { // Primary yAxis
	        	min: 0,
	            labels: {
	                format: '{value} %',
	                style: {
	                    color: Highcharts.getOptions().colors[2]
	                }
	            },
	            title: {
	                text: '百分比',
	                style: {
	                    color: Highcharts.getOptions().colors[2]
	                }
	            }
	        }, { // Secondary yAxis
	        	min: 0,
	            title: {
	                text: '车辆数',
	                style: {
	                    color: Highcharts.getOptions().colors[0]
	                }
	            },
	            labels: {
	                format: '{value} 台数',
	                style: {
	                    color: Highcharts.getOptions().colors[0]
	                }
	            },
	            opposite: true
	        }];
	        var categories = ['自制件','部件','焊装','涂装','底盘','总装','入库'];
	        var plotOptions = {
	            column: {
	                pointPadding: 0.2,
	                borderWidth: 0
	            }
	        };
	        var tooltip = {
	                headerFormat: '<span style="font-size:12px;padding-bottom: 10px;">{point.key}</span><table>',
	                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: &nbsp;&nbsp;</td>' +
	                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
	                footerFormat: '</table>',
	                shared: true,
	                useHTML: true
	            };
			var series = [];
			var dataLabels = {
	                enabled: true,
	                rotation: 0,
	                color: '#black',
	                align: 'center',
	                x: 0,
	                y: 0,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, Microsoft YaHei'
	                    //textShadow: '0 0 3px black'
	                }
	            };
			
			var plan_qty_array = [0,0,0,0,0,0,0];
			var real_qty_array = [0,0,0,0,0,0,0];
			var rate_array = [null,null,null,null,null,null,null];
			
			$.each(response.data, function(index, value) {
				var workshop = value.key_name;
				if(workshop!='入库') workshop = workshop.substring(0,workshop.length-2);
				plan_qty_array[categories.indexOf(workshop)] = Number(value.plan_qty);
				real_qty_array[categories.indexOf(workshop)] = Number(value.real_qty);
				rate_array[categories.indexOf(workshop)] = Number(value.rate);
/*				plan_qty_array.push(value.plan_qty);
				real_qty_array.push(value.real_qty);
				rate_array.push(value.rate);*/
			});	
			var planData = {};
			planData.name = '计划数';
			planData.type = 'column';
			planData.yAxis = 1;
			planData.data = plan_qty_array;
			planData.tooltip = { valueSuffix: ' 台'};
			planData.dataLabels = dataLabels;
			series.push(planData);
			
			var realData = {};
			realData.color = 'red';
			realData.name = '完成数';
			realData.type = 'column';
			realData.yAxis = 1;
			realData.data = real_qty_array;
			realData.tooltip = { valueSuffix: ' 台'};
			realData.dataLabels = dataLabels;
			series.push(realData);
			
			var rateData = {};
			rateData.name = '达成率';
			rateData.color = 'green';
			rateData.type = 'spline';
			rateData.data = rate_array;
			rateData.tooltip = { valueSuffix: ' %'};
			
			rateData.dataLabels = {
	                enabled: true,
	                rotation: 0,
	                color: '#black',
	                align: 'center',
	                x: 0,
	                y: 0,
	                style: {
	                    fontSize: '13px',
	                    fontFamily: 'Verdana, Microsoft YaHei'
	                    //textShadow: '0 0 3px black'
	                },
                    formatter: function () {
                        return this.y + '%';
                    }
	            };
			rateData.marker = {
	                lineWidth: 2,
	                lineColor: Highcharts.getOptions().colors[3],
	                fillColor: 'white'
	            };
			series.push(rateData);
			drawChart("#containerReport",null,title,subtitle,tooltip,categories,yAxis,series,plotOptions);
	    },

	    error: function(XMLHttpRequest, textStatus, errorThrown) {
        },
        complete:function(XMLHttpRequest, textStatus){
        }
	});
}
function getPlanRateDate(){
	var type = $("input[type='radio']:checked").val();
	if(type == 'W'){
		//周
		//当前周日期
		var weekStartDate = getWeekStartDate();
		var weekEndDate = getWeekEndDate();
		
        $("#start_date").val(weekStartDate);
        $("#end_date").val(weekEndDate);
	}else if(type == 'M'){
		//当前月日期
		var weekStartDate = getMonthStartDate();
		var weekEndDate = getMonthEndDate();
		
        $("#start_date").val(weekStartDate);
        $("#end_date").val(weekEndDate);
	}else if(type == 'Y'){
		var now = new Date(); //当前日期 
		var nowYear = now.getYear(); //当前年 
		var myyear = now.getFullYear(); 
        $("#start_date").val(myyear+"-01-01");
        $("#end_date").val(myyear+"-12-31");
	}
}

//格局化日期：yyyy-MM-dd 
function formatDate(date) { 
	var myyear = date.getFullYear(); 
	var mymonth = date.getMonth()+1; 
	var myweekday = date.getDate();

	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	if(myweekday < 10){ 
		myweekday = "0" + myweekday; 
	} 
	return (myyear+"-"+mymonth + "-" + myweekday); 
}

//获得本周的开端日期 
function getWeekStartDate() { 
	var now = new Date(); //当前日期 
	var nowDayOfWeek = now.getDay(); //今天本周的第几天 
	var nowDay = now.getDate(); //当前日 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek); 
	return formatDate(weekStartDate); 
}

//获得本周的停止日期 
function getWeekEndDate() { 
	var now = new Date(); //当前日期 
	var nowDayOfWeek = now.getDay(); //今天本周的第几天 
	var nowDay = now.getDate(); //当前日 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek)); 
	return formatDate(weekEndDate); 
}

//获得本月的开端日期 
function getMonthStartDate(){
	var now = new Date(); //当前日期 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	var monthStartDate = new Date(nowYear, nowMonth, 1); 
	return formatDate(monthStartDate); 
}

//获得本月的停止日期 
function getMonthEndDate(){ 
	var now = new Date(); //当前日期 
	var nowMonth = now.getMonth(); //当前月 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	var monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth)); 
	return formatDate(monthEndDate); 
}
//获得某月的天数 
function getMonthDays(myMonth){
	var now = new Date(); //当前日期 
	var nowYear = now.getYear(); //当前年 
	nowYear += (nowYear < 2000) ? 1900 : 0; //
	var monthStartDate = new Date(nowYear, myMonth, 1); 
	var monthEndDate = new Date(nowYear, myMonth + 1, 1); 
	var days = (monthEndDate - monthStartDate)/(1000 * 60 * 60 * 24); 
	return days; 
}
function drawChart(container, type, title, subtitle, tooltip, categories,
		yAxis, series, plotOptions) {
	$(container)
			.highcharts(
					{
						// HighCharts中chart属性配置
						chart : {
							type : type || 'line',// 图表类型

							/** ****************以下chart配置可选***************** */
							backgroundColor : null,// "#EAF7FF"图表背景色
							borderWidth : 0,// 图表边框宽度
							borderRadius : 15,// 图表边框圆角角度
							plotBackgroundColor : null,// "#6DBFBB"主图表区背景颜色
							plotBorderColor : "#d0e0ec",// 主图表边框颜色
							plotBorderWidth : 1,// 主图表边框宽度
							//shadow : true,// 是否设置阴影
							zoomType : 'xy'// 拖动鼠标放大图表的方向
						},
						// 图表标题
						title : {
							text : title,
							useHTML : true
						},
						// 图表标题
						subtitle : {
							text : subtitle,
							useHTML : true
						},
						// 图表版权信息。默认情况下，highcharts图表的右下方会放置一个包含链接的版权信息。
						credits : {
							enabled : true,// 不显示highCharts版权信息,默认就为true,可以不配置
							// ，如果想要去除版权（也就是不显示），只需要设置enable:false即可
							text : '', // 文字
							href : '',// 链接地址
							position : { // 文字的位置
								x : -30,
								y : -30
							},
							style : { // 文字的样式
								color : 'red',
								fontWeight : 'bold'
							}
						},
						/*******************************************************
						 * *Colors-颜色属性为可选配置 *通过配置配置colors，可以轻松的设置数据列的颜色
						 * 1、颜色代码可以是十六进制，也可以是英文单词， 还可以是RGB，如同css
						 * 2、默认是从第一个数据列起调用第一个颜色代码， 有多少个数据列调用相应数量的颜色
						 * 3、当数据列大于默认颜色数量时，重复从第一个 颜色看是调用
						 ******************************************************/
						colors : [ '#7cb5ec', '#ff33cc', '#90ed7d', '#f7a35c',
								'#8085e9', '#f15c80', '#e4d354', '#8085e8',
								'#8d4653', '#91e8e1' ],
						// 导出配置
						/*
						 * exporting: {
						 * enabled:true,//默认为可用，当设置为false时，图表的打印及导出功能失效
						 * buttons:{ //配置按钮选项 printButton:{ //配置打印按钮 width:50,
						 * symbolSize:20, borderWidth:2, borderRadius:0,
						 * hoverBorderColor:'red', height:30, symbolX:25,
						 * symbolY:15, x:-100, y:20 }, exportButton:{ //配置导出按钮
						 * width:50, symbolSize:20, borderWidth:2,
						 * borderRadius:0, hoverBorderColor:'red', height:30,
						 * symbolX:25, symbolY:15, x:-150, y:20 } },
						 * filename:'download',//导出的文件名
						 * type:'image/png',//导出的文件类型 width:800 //导出的文件宽度 },
						 */
						// 配置可以放置在图表中任意位置的Html标签。
						labels : {
							/*
							 * items:[{ //标签代码（html代码） html:'<p style="font-size:20">Copyright ©
							 * 2015 </p><a href=" "
							 * style="font-size:20;text-decoration:
							 * underline;">BMS</a>', style:{ //设置标签位置
							 * left:'100px', top:'50px' } }],
							 */
							style : { // 设置标签颜色
								color : 'rgb(0,0,255)'
							}
						},
						// 图例说明 包含图表中数列标志和名称的容器。
						legend : {
							layout : 'vertical',
							align : 'right',
							verticalAlign : 'middle',
							borderWidth : 0
						},
						// 数据提示框。当鼠标悬停在某点上时，以框的形式提示该点的数据，比如该点的值，数据单位等。数据提示框内提示的信息完全可以通过格式化函数动态指定。
						tooltip : tooltip
								|| {
									formatter : function() {
										if (type == 'column') {
											return '<b>' + this.x + '</b><br/>'
													+ this.series.name + ': '
													+ this.y + '<br/>'
													+ 'Total: '
													+ this.point.stackTotal;
										} else if (type == 'line') {
											return '<b>' + this.series.name
													+ '</b><br/>' + this.x
													+ ': ' + this.y + '%<br/>';
										} else {
											var s;
											if (this.series.type == 'pie') { // the
												// pie
												// chart
												s = '' + this.point.name + ': '
														+ '<b>'
														+ this.point.percentage
														+ '%</b>';
											} else if (this.series.type == 'spline') {
												s = '' + this.x + ': ' + this.y
														+ '%<br/>';
											} else {
												s = '' + this.x + ': ' + this.y
														+ '<br/>';
											}
											return s;
										}
									},
									backgroundColor : {
										linearGradient : [ 0, 0, 0, 60 ],
										stops : [ [ 0, '#FFFFFF' ],
												[ 1, '#E0E0E0' ] ]
									},
									borderWidth : 1,
									borderColor : '#AAA',
									pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
								},
						plotOptions : plotOptions
								|| {
									column : {
										stacking : 'normal',
										dataLabels : {
											enabled : true,
											color : (Highcharts.theme && Highcharts.theme.dataLabelsColor)
													|| 'white'
										}
									},
									pie : {
										allowPointSelect : true,
										cursor : 'pointer',
										dataLabels : {
											enabled : true,
											color : '#000000',
											connectorColor : '#000000',
											formatter : function() {
												return '<b>' + this.point.name
														+ '</b>: '
														+ this.percentage
														+ ' %';
											}
										}
									}
								},
						xAxis : {
							categories : categories,
							lineWidth : 1,
							labels : {
								autoRotationLimit:40
							}
						},
						yAxis : yAxis,
						series : series
					});

}