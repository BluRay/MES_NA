var pageSize=1;
var table;
var dt;
$(document).ready(function(){
	
	ajaxQuery();
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	}); 
	$(document).on("click","#btnAdd",function(){
		
		var dialog = $( "#dialog_add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 新增车型</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						ajaxAdd();
					} 
				}
			]
		});
	}); 
});

function ajaxQuery(){
	dt=$("#tableData").DataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 2,
            rightColumns:1
        },
        serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		/*scrollCollapse: true,*/
		pageLength: 12,
		pagingType:"full_numbers",
		lengthChange:false,
		orderMulti:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: {
			  first:"首页",
		      previous: "上一页",
		      next:"下一页",
		      last:"尾页",
		      loadingRecords: "请稍等,加载中...",		     
			}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"busTypeCode":$("#search_busTypeCode").val()
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getBusTypeList",
                cache: true,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    callback(returnData);
                }
            });
		
		},
		columns: [
            {"title":"车型编号","class":"center","data":"busTypeCode","defaultContent": ""},
            {"title":"车型内部名称","class":"center","data":"internalName","defaultContent": ""},
            {"title":"品牌","class":"center","data":"brand","defaultContent": ""},
            {"title":"制造商","class":"center","data":"manufacturer","defaultContent": ""},
            //{"title":"车辆类型","class":"center","data": "busVehicleTypeId","defaultContent": ""},
            {"title":"车辆型号","class":"center","data":"vehicleModel","defaultContent": ""},		            
            {"title":"底盘型号","class":"center","data":"chassisModel","defaultContent": ""},		            
            {"title":"车辆长度","class":"center","data": "vehicleLength","defaultContent": ""},
            {"title":"轴距","class":"center","data":"wheelbase","defaultContent": ""},
            {"title":"最大允许总质量","class":"center","data":"maxWeight","defaultContent": ""},		            
            {"title":"额定载客数量","class":"center","data": "passengerNum","defaultContent": ""},
            //{"title":"燃料类型","class":"center","data":"fuelType","defaultContent": ""},
            {"title":"驱动电机","class":"center","data": "driveMotor","defaultContent": ""},
            {"title":"电机型号","class":"center","data":"motorModel","defaultContent": ""},		            
            {"title":"电机最大功率","class":"center","data":"motorPower","defaultContent": ""},		            
            {"title":"电池型号","class":"center","data": "batteryModel","defaultContent": ""},
            {"title":"电池容量","class":"center","data":"batteryCapacity","defaultContent": ""},
            {"title":"额定电压","class":"center","data":"ratedVoltage","defaultContent": ""},	
            {"title":"最高车速","class":"center","data":"maxSpeed","defaultContent": ""},	
            {"title":"灯光下倾值","class":"center","data":"lightDowndip","defaultContent": ""},	
            {"title":"维护人","class":"center","data": "editor","defaultContent": ""},
            {"title":"维护时间","class":"center","data":"editDate","defaultContent": ""},
            //{"title":"编辑","class":"center","data":null,"defaultContent": "<i onclick = 'ajaxEdit(" + row.id+ ");' class=\"ace-icon fa fa-pencil bigger-130 editBusType\" style='color:green;cursor: pointer;'></i>"}
            {"title":"编辑","class":"center","data":null,"render":function(data,type,row){
            	return "<i class=\"ace-icon fa fa-pencil bigger-130 editorder\" onclick = 'ajaxEdit(" + row.id+ ");' style='color:green;cursor: pointer;'></i>"},
            	"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editBusType\" style='color:green;cursor: pointer;'></i>"}
          ],
	});

}

function ajaxAdd (argument) {
	if($("#add_busTypeCode").val()===""){
		alert("车辆型号不能为空！");
		$("#add_busTypeCode").focus();
		return false;
	}
	if($("#add_internalName").val()===""){
		alert("车辆内部名称不能为空！");
		$("#add_internalName").focus();
		return false;
	}
//	if($("#add_vehicleModel").val()===""){
//		alert("车辆类型不能为空！");
//		$("#add_vehicleModel").focus();
//		return false;
//	}
//	if($("#add_driveMotor").val()===""){
//		alert("驱动电机不能为空！");
//		$("#add_driveMotor").focus();
//		return false;
//	}
//	
//	if($("#add_chassisModel").val()===""){
//		alert("底盘型号不能为空！");
//		$("#add_chassisModel").focus();
//		return false;
//	}
//	if($("#add_motorModel").val()===""){
//		alert("电机型号不能为空！");
//		$("#add_motorModel").focus();
//		return false;
//	}
//	
//	if($("#add_vehicleLength").val()===""){
//		alert("车辆长度不能为空！");
//		$("#add_vehicleLength").focus();
//		return false;
//	}
//	if($("#add_motorPower").val()===""){
//		alert("电机最大功率不能为空！");
//		$("#add_motorPower").focus();
//		return false;
//	}
//	if($("#add_wheelbase").val()===""){
//		alert("轴距不能为空！");
//		$("#add_wheelbase").focus();
//		return false;
//	}
//	if($("#add_batteryModel").val()===""){
//		alert("电池型号不能为空！");
//		$("#add_batteryModel").focus();
//		return false;
//	}
//	if($("#add_passengerNum").val()===""){
//		alert("乘员数不能为空！");
//		$("#add_passengerNum").focus();
//		return false;
//	}
//	if($("#add_maxWeight").val()===""){
//		alert("最大允许质量不能为空！");
//		$("#add_maxWeight").focus();
//		return false;
//	}
//	
//	if($("#add_maxSpeed").val()===""){
//		alert("最大车速不能为空！");
//		$("#add_maxSpeed").focus();
//		return false;
//	}
//	if($("#add_lightDowndip").val()===""){
//		alert("灯光倾下值不能为空！");
//		$("#add_lightDowndip").focus();
//		return false;
//	}
    $.ajax({
		type: "post",
		dataType: "json",
		url: "/IMMS/setting/addBusType",
	    data: {
			"busTypeCode":$("#add_busTypeCode").val(),
			"internalName":$("#add_internalName").val(),
			"brand":$("#add_brand").val(),
			"manufacturer":$("#add_manufacturer").val(),
			"vehicleModel":$("#add_vehicleModel").val(),
			"driveMotor":$("#add_driveMotor").val(),
			"chassisModel":$("#add_chassisModel").val(),
			"motorModel":$("#add_motorModel").val(),
			"vehicleLength":$("#add_vehicleLength").val(),
			"motorPower":$("#add_motorPower").val(),
			"wheelbase":$("#add_wheelbase").val(),
			"batteryModel":$("#add_batteryModel").val(),
			"batteryCapacity":$("#add_batteryCapacity").val(),
			"ratedVoltage":$("#add_ratedVoltage").val(),
			"passengerNum":$("#add_passengerNum").val(),
			"maxWeight":$("#add_maxWeight").val(),
			"lightDowndip":$("#add_lightDowndip").val(),
			"maxSpeed":$("#add_maxSpeed").val()
		},
		async: false,
	    success:function (response) {
	    	
	    	if (response.success) {
	    		$( "#dialog_add" ).dialog( "close" ); 
	    		ajaxQuery();
	    	} else {
	    		alert(response.message);
	    	}
	    },
	    error:function(){alert();}
	});
	
}

function ajaxEdit(id){

	//查询订单信息
	$.ajax({
		url: "/IMMS/setting/getBusTypeById",
		dataType: "json",
		data: {"id" : id},
		async: false,
		error: function () {alert();},
		success: function (response) {			
			$('#editId').val(id);
			$('#edit_busTypeCode').val(response.data.busTypeCode);
			$('#edit_internalName').val(response.data.internalName);
			$('#edit_vehicleModel').val(response.data.vehicleModel);
			$('#edit_chassisModel').val(response.data.chassisModel);
			$('#edit_vehicleLength').val(response.data.vehicleLength);
			$('#edit_wheelbase').val(response.data.wheelbase);
			$('#edit_maxWeight').val(response.data.maxWeight);
			$('#edit_passengerNum').val(response.data.passengerNum);
			$('#edit_motorModel').val(response.data.motorModel);
			$('#edit_motorPower').val(response.data.motorPower);
			$('#edit_batteryModel').val(response.data.batteryModel);
			$('#edit_batteryCapacity').val(response.data.batteryCapacity);
			$('#edit_ratedVoltage').val(response.data.ratedVoltage);
			$('#edit_driveMotor').val(response.data.driveMotor);
			$('#edit_maxSpeed').val(response.data.maxSpeed);
			$('#edit_lightDowndip').val(response.data.lightDowndip);

			var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
				width:600,
				height:520,
				modal: true,
				title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i>编辑车型</h4></div>",
				title_html: true,
				buttons: [ 
					{
						text: "取消",
						"class" : "btn btn-minier",
						click: function() {
							$( this ).dialog( "close" ); 
						} 
					},
					{
						text: "确定",
						"class" : "btn btn-primary btn-minier",
						click: function() {
							if($("#edit_busTypeCode").val()===""){
								alert("车辆型号不能为空！");
								$("#edit_busTypeCode").focus();
								return false;
							}
							if($("#edit_internalName").val()===""){
								alert("车辆内部名称不能为空！");
								$("#edit_internalName").focus();
								return false;
							}
							
//							if($("#edit_vehicleModel").val()===""){
//								alert("车辆类型不能为空！");
//								$("#edit_vehicleModel").focus();
//								return false;
//							}
//							if($("#edit_driveMotor").val()===""){
//								alert("驱动电机不能为空！");
//								$("#edit_driveMotor").focus();
//								return false;
//							}
//							
//							if($("#edit_chassisModel").val()===""){
//								alert("底盘型号不能为空！");
//								$("#edit_chassisModel").focus();
//								return false;
//							}
//							if($("#edit_motorModel").val()===""){
//								alert("电机型号不能为空！");
//								$("#edit_motorModel").focus();
//								return false;
//							}
//							if($("#edit_vehicleLength").val()===""){
//								alert("车辆长度不能为空！");
//								$("#edit_vehicleLength").focus();
//								return false;
//							}
//							if($("#edit_motorPower").val()===""){
//								alert("电机最大功率不能为空！");
//								$("#edit_motorPower").focus();
//								return false;
//							}
//							if($("#edit_wheelbase").val()===""){
//								alert("轴距不能为空！");
//								$("#edit_wheelbase").focus();
//								return false;
//							}
//							if($("#edit_batteryModel").val()===""){
//								alert("电池型号不能为空！");
//								$("#edit_batteryModel").focus();
//								return false;
//							}
//							if($("#edit_passengerNum").val()===""){
//								alert("乘员数不能为空！");
//								$("#edit_passengerNum").focus();
//								return false;
//							}
//							if($("#edit_maxWeight").val()===""){
//								alert("最大允许质量不能为空！");
//								$("#edit_maxWeight").focus();
//								return false;
//							}
//							
//							if($("#edit_maxSpeed").val()===""){
//								alert("最大车速不能为空！");
//								$("#edit_maxSpeed").focus();
//								return false;
//							}
//							if($("#edit_lightDowndip").val()===""){
//								alert("灯光倾下值不能为空！");
//								$("#edit_lightDowndip").focus();
//								return false;
//							}
						
							$.ajax({
							    url: "updateBusType",
							    dataType: "json",
								type: "get",
							    data: {
							    	"id" : $("#editId").val(),
							    	"busTypeCode":$("#edit_busTypeCode").val(),
									"internalName":$("#edit_internalName").val(),
									"brand":$("#edit_brand").val(),
									"manufacturer":$("#edit_manufacturer").val(),
									"vehicleModel":$("#edit_vehicleModel").val(),
									"driveMotor":$("#edit_driveMotor").val(),
									"chassisModel":$("#edit_chassisModel").val(),
									"motorModel":$("#edit_motorModel").val(),
									"vehicleLength":$("#edit_vehicleLength").val(),
									"motorPower":$("#edit_motorPower").val(),
									"wheelbase":$("#edit_wheelbase").val(),
									"batteryModel":$("#edit_batteryModel").val(),
									"batteryCapacity":$("#edit_batteryCapacity").val(),
									"ratedVoltage":$("#edit_ratedVoltage").val(),
									"passengerNum":$("#edit_passengerNum").val(),
									"maxWeight":$("#edit_maxWeight").val(),
									"lightDowndip":$("#edit_lightDowndip").val(),
									"maxSpeed":$("#edit_maxSpeed").val()
							    },
							    success:function(response){
							    	if(response.success){
							    	$.gritter.add({
										title: '系统提示：',
										text: '<h5>编辑成功！</h5>',
										class_name: 'gritter-info'
									});
							    	ajaxQuery();
							    	}else{
							    		$.gritter.add({
											title: '系统提示：',
											text: '<h5>编辑失败！</h5><br>'+response.message,
											class_name: 'gritter-info'
										});
							    	}
							    }
							});
							$( this ).dialog( "close" );
						} 
					}
				]
			});
		}
	})
}
