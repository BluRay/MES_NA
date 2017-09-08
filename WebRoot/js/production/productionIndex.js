var workshopAuthList=[];// 当前用户员工信息 
$(document).ready(function () {
	initPage();
	setInterval(function () {
		ajaxQuery();
	},1000*60*5);
	
	$("#search_factory").bind("change",function(){
		ajaxQuery();
	});
	
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getFactorySelect("production/index","","#search_factory",null,"id");
		getWorkshopAuthList();
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
})


/**
	 * 点击车间判断是否有该车间的扫描权限，有就跳转到对应车间生产执行页面
	 */
	function executionFoward(workshop){
		if(workshopAuthList!=null && workshopAuthList.indexOf(workshop)>=0){
			window.location.href='executionindex?workshop='+workshop;
		}else{
			alert("对不起，您没有该车间扫描权限！");
		}
	}

	function getWorkshopAuthList(){
		$.ajax({
			url : "/BMS/common/getWorkshopSelectAuth",
			dataType : "json",
			data : {"function_url":'production/index',"factory":$("#search_factory :selected").text()},
			async : false,
			error : function(response) {
				alert(response.message)
			},
			success : function(response) {
				$.each(response.data,function(index,workshop){
					workshopAuthList.push(workshop.name);
				});
			}
		});
	}

	function imgFoward(name,workshop){
		
		if(name=='VIN'){
			window.location.href='/BMS/production/showVinPrint';
		}
		if(name=='铭牌'){
			window.location.href='/BMS/production/nameplatePrint';
		}
		if(name=='合格证'){
			window.location.href='/BMS/production/certificationPrint';
		}
		if(name=='发车'){
			window.location.href='/BMS/plan/busDispatch';
		}
		if(name=='车身号'){
			window.location.href='/BMS/production/showBusNoPrint';
		}
		if(name=='在制'){
			window.location.href="productionsearch?workshop="+workshop+"&factory="+$("#search_factory").val();
		}
		
	}

	/**
	 *	监控图页面跳转
	 */
	function monitorFoward(workshop){
		window.location.href='monitorBoard?workshop='+workshop+'&factory='+$("#search_factory").val()
		+'&factory_name='+$("#search_factory :selected").text();
	}
	
	function ajaxQuery(){
		$("#node-online-w-a").html("");
		$("#node-online-w-b").html("");
		$("#node-offline-w-a").html("");
		$("#node-offline-w-b").html("");
		$("#node-online-p").html("");
		$("#node-offline-p").html("");
		$("#node-online-b-a").html("");
		$("#node-online-b-b").html("");
		$("#node-offline-b-a").html("");
		$("#node-offline-b-b").html("");
		$("#node-online-a-a").html("");
		$("#node-online-a-b").html("");
		$("#node-offline-a-a").html("");
		$("#node-offline-a-b").html("");
		$("#node-warehouse").html("");
		$("#node-prod-w").html("");
		$("#node-prod-p").html("");
		$("#node-prod-b").html("");
		$("#node-prod-a").html("");
		$("#node-wip-1").html("");
		$("#node-wip-2").html("");
		$("#node-wip-3").html("");
	
		var factoryId=$("#search_factory").val();
		$.ajax({
			type : "get",// 使用get方法访问后台
			dataType : "json",// 返回json格式的数据
			url : "/BMS/common/getProductionIndexData",
			async :false,
			data : {
				"factoryId" : factoryId,
			},
			success : function(response) {
				if(response.data){
					$.each(response.data,function(i,data){
						
						if(data.process_node=='焊装上线'){
							if(data.line.indexOf('A')>=0){
								$("#node-online-w-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-online-w-b").html(data.process_num);
							}
						}
						if(data.process_node=='焊装下线'){
							if(data.line.indexOf('A')>=0){
								$("#node-offline-w-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-offline-w-b").html(data.process_num);
							}
						}
						
						if(data.process_node=='涂装上线'){
							if(data.line.indexOf('A')>=0){
								$("#node-online-p").html(data.process_num);
							}
							/*if(data.line.indexOf('B')>=0){
								$("#node-online-p").html(data.process_num);
							}*/
						}
						if(data.process_node=='涂装下线'){
							if(data.line.indexOf('A')>=0){
								$("#node-offline-p").html(data.process_num);
							}
							/*if(data.line.indexOf('B')>=0){
								$("#node-offline-p-b").html(data.process_num);
							}*/
						}
						
						if(data.process_node=='底盘上线'){
							if(data.line.indexOf('A')>=0){
								$("#node-online-b-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-online-b-b").html(data.process_num);
							}
						}
						if(data.process_node=='底盘下线'){
							if(data.line.indexOf('A')>=0){
								$("#node-offline-b-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-offline-b-b").html(data.process_num);
							}
						}
						
						if(data.process_node=='总装上线'){
							if(data.line.indexOf('A')>=0){
								$("#node-online-a-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-online-a-b").html(data.process_num);
							}
						}
						if(data.process_node=='总装下线'){
							if(data.line.indexOf('A')>=0){
								$("#node-offline-a-a").html(data.process_num);
							}
							if(data.line.indexOf('B')>=0){
								$("#node-offline-a-b").html(data.process_num);
							}
						}
						
						if(data.process_node=='入库'){
							$("#node-warehouse").html(data.process_num);
						}
						
						if(data.process_node=='焊装在制'){
							$("#node-prod-w").html(data.process_num);
						}
						
						if(data.process_node=='涂装在制'){
							$("#node-prod-p").html(data.process_num);
						}
						
						if(data.process_node=='底盘在制'){
							$("#node-prod-b").html(data.process_num);
						}
						
						if(data.process_node=='总装在制'){
							$("#node-prod-a").html(data.process_num);
						}
						
						if(data.process_node=='WIP_WP'){
							$("#node-wip-1").html(data.process_num);
						}
						
						if(data.process_node=='WIP_PC'){
							$("#node-wip-2").html(data.process_num);
						}
						
						if(data.process_node=='WIP_CA'){
							$("#node-wip-3").html(data.process_num);
						}
					})
				}
			}
		});
	}
