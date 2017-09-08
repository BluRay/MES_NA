var pageSize=1;
var table;
var table_height = $(window).height()-250;
var vinList;
var buslist=[];
$(document).ready(function(){
	window.onafterprint=function(){
		 ajaxUpdatePrint(vinList);
	}
	initPage();
	function initPage(){
		getBusNumberSelect('#nav-search-input');
		getOrderNoSelect("#search_order","#orderId");
		var buslist=[];
		ajaxQuery();
	}

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/BMS/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$("#btnQuery").click (function () {
		ajaxQuery();
	});
	//打印
	$('body').on('click', '.btnPrint',function(e){
		$("#printarea").html("");
		var printFlag=true;
		vinList="";//获取要打印的车号列表
		var tr=$(e.target).parent("td").parent("tr");
		
		var printhtml="<div class=\"printConfigure printable toPrint\" style=\"padding-top:10px;padding-bottom:10px;line-height:40px;\" ><table border=0><tr ><td style=\"text-align:right; font-size:26px;font-weight:bold; height:35px; padding-left:0px\">订单：</td>"
			+"<td style=\"text-align:left; font-size:26px;font-weight:bold; width:270px;height:35px \">"+$(tr).find(".orderCodeDesc").text()+"</td></tr>"+
			"<tr><td style=\"text-align:right; font-size:26px; font-weight:bold;height:35px; padding-left:0px;\">车号：</td>"
			+"<td style=\"text-align:left; font-size:26px; font-weight:bold;width:270px;height:35px;\">"+$(tr).find(".busNumber").text()+"</td></tr>"+
			"<tr><td style=\"text-align:right; font-size:26px;font-weight:bold;height:35px;padding-left:0px\">VIN：</td>"
			+"<td style=\"text-align:left; font-size:26px;font-weight:bold ;width:270px;height:35px; \">"+$(tr).find(".vin").val()+"</td></tr></table>"
			+"<div id=\"bcTarget"+"\" style=\"width:300px; height:70px;margin-left:10px;margin-top:10px\"></div></div>";
		$("#printarea").append(printhtml);
		$("#bcTarget").barcode($(tr).find(".vin").val(), "code128",{barWidth:2, barHeight:70,showHRI:false});
		/*vinList=vinList.substring(0,vinList.length-1); $(tr).data("vin").trim() */
		if($(tr).find(".vin").val().trim().length==0){
			printFlag=false;
		}else
		vinList=$(tr).find(".vin").val();
		 setTimeout(function (){
			 if(printFlag){
				 window.print();
			 }else{
				 alert("VIN为空，请先绑定车号和VIN!");
			 }
						       				
			},0);
	});
	$('body').on('focus', ".vin,.leftMotor,.rightMotor",function(event){
		var tds=$(this).parent("td").siblings();
		var className=$(this).attr("class");
		var classHide="."+className+"Hide";
		//alert(classHide);
		var placeHolder=className=="vin"?"请扫描VIN编码！":(className=='leftMotor'?"请扫描左电机号！":"请扫描右电机号！");
		
		$(this).parent("td").find(classHide).val("");
		if(!$(this).attr("readonly")){
			$(this).val("");
			$(this).css("border","1px solid").attr("placeHolder",placeHolder);
		}
		$(this).blur();
		$(this).parent("td").find(classHide).focus();
		
	});
	$(document).on('keydown', ".vinHide,.leftMotorHide,.rightMotorHide",function(event){
		
		var classHide=$(this).attr("class");

		var className="."+classHide.substring(0,classHide.indexOf('Hide'));
		
		if (event.keyCode == "13") {
			if(className==".vin"){
				if($(this).val().trim().length==17){
					$(this).parent("td").find(className).css("border","0px").val($(this).val().toUpperCase());	
				}else{
					$(this).parent("td").find(className).css("border","0px").val("");
					alert("请扫描VIN编码！");	
				}				
				
			}else{
				if($(this).val().trim().length>9){
					$(this).parent("td").find(className).css("border","0px").val($(this).val().substr(-9).toUpperCase());	
				}else{
					$(this).parent("td").find(className).css("border","0px").val("");
					alert("请扫描电机号！");	
				}				
				
			}
				
		}
		
	});
	
	//左右电机号扫描后光标自动移动到另外一个电机号输入框
	$('body').on('keydown', ".leftMotor,.rightMotor",function(event){
		if (event.keyCode == "13") {
			var index=($(this).attr("id").split("_"))[1];
			if($(this).attr("class")=='leftMotor'){
				$("#rightMotor_"+index).focus();
			}
			if($(this).attr("class")=='rightMotor'){
				$("#leftMotor_"+index).focus();
			}
			return false;
		}
	});
	//vin码扫描后跳入左电机号输入框
	$('body').on('keydown',".vin",function(event){
		var tr=$(this).parent("td").parent("tr");
		var leftMotorInput=$(tr).find(".leftMotor").eq(0);
		if (event.keyCode == "13") {
			//alert($(leftMotorInput).val());
			$(leftMotorInput).focus();
		}
		
	});
	//vin输入框change事件
	$('body').on('change',".vin",function(e){
		var vin=$(e.target).val();
		var busNumber=$(e.target).parent("td").parent("tr").find(".busNumber").val();
		var leftMotorNumber=$(e.target).parent("td").parent("tr").find(".leftMotor").val();
		var rightMotorNumber=$(e.target).parent("td").parent("tr").find(".rightMotor").val();
		var busList=ajaxValidateBusVin(vin,busNumber);
		if(vin.trim().length>0&&!ajaxValidateVin(vin)){
			alert("请输入有效VIN码！");
			$(e.target).val("");
			$(e.target).focus();
		}else if(busList.length>0){
			if(busList[0].bus_number!=busNumber){
				alert("该VIN码已经绑定了一个车号，不能重复绑定！");
				$(e.target).val("");
				$(e.target).focus();
			}				
		}else if(isContain(vin,buslist)&&vin.trim().length>0){
			alert("VIN码不能重复绑定！");
			$(e.target).focus();
		}
	});
	
	$("#btnSave").click(function(){
		var trs=$("#tableData tbody").find("tr");
		var ids = '';
		$(":checkbox").each(function(){
			if($(this).prop("checked")){
				if($(this).attr('fid')){
					ids += $(this).attr('fid').split('_')[1] + ',';
				}
			}
		});
		if(ids===''){
			alert("请至少勾选一条记录");
			return false;
		}
		var msg="确认保存？";
		var saveFlag = true;
		var addbuslist=[];
		$.each(trs,function(i,tr){
			if($(tr).find(".check").prop("checked")){
				var busNumber=$(tr).find(".busNumber").text();
				var vin=$(tr).find(".vin").val();
				var leftMotorNumber=$(tr).find(".leftMotor").val();
				var rightMotorNumber=$(tr).find(".rightMotor").val();
				if(leftMotorNumber.trim().length==0 && rightMotorNumber.trim().length==0){
					alert("请至少输入一个左电机或者右电机，再保存！");
					saveFlag = false;
					return false;
				}else{
					if(leftMotorNumber.trim().length==0){
						leftMotorNumber = '/';
					}
					if(rightMotorNumber.trim().length==0){
						rightMotorNumber = '/';
					}
					if(vin.trim().length==0/*||leftMotorNumber.trim().length==0||rightMotorNumber.trim().length==0*/){
						msg="VIN码未填写的无法保存,是否确认保存？"
					}else{
						var obj={};
						obj.bus_number=busNumber;
						obj.vin=vin;
						obj.left_motor_number=leftMotorNumber;
						obj.right_motor_number=rightMotorNumber;
						addbuslist.push(obj);
					}
				}
			}
		});
		console.log("addbuslist",addbuslist);
		if(saveFlag){
			if(confirm(msg)){
				if(addbuslist.length>0){
					$.ajax({
						url:"saveMotorNumber",
						type: "post",
						dataType:"json",
						data:{"conditions":JSON.stringify(addbuslist)},
						success:function(response){
							alert(response.message);	
							if(response.success){
								ajaxQuery();
							}					
						}		
					});
				}else{
					alert("没有填写需要绑定的VIN码和左右电机号！");
				}
				
			}
		}
	});
	
});
function ajaxQuery(){
	$("#tableData").dataTable({
		serverSide: true,paiging:true,ordering:false,searching: false,bAutoWidth:false,
		destroy: true,sScrollY: table_height,sScrollX:true,orderMulti:false,
		pageLength: 25,pagingType:"full_numbers",lengthChange:false,
		language: {
			emptyTable:"抱歉，未查询到数据！",
			info:"共计 _TOTAL_ 条，当前第 _PAGE_ 页 共 _PAGES_ 页",
			infoEmpty:"",
			paginate: { first:"首页",previous: "上一页",next:"下一页",last:"尾页",loadingRecords: "请稍等,加载中..."}
		},
		ajax:function (data, callback, settings) {
			var param ={
				"draw":1,
				"busNumber" : $("#search_busNumber").val(),
				"orderNo" : $("#search_order").val()
			};
            param.length = data.length;					//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;					//开始的记录序号
            param.page = (data.start / data.length)+1;	//当前页码

            $.ajax({
                type: "post",
                url: "getVinPrintList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;						//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;		//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;	//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;						//返回的数据列表
                    callback(returnData);
                }
            });
		},
		columns: [
			{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"bus_number","render": function ( data, type, row ) {
			    return "<input id='id' type='hidden' /><input class='check' type='checkbox' fid='cb_"+data+"'>";
			},"defaultContent": ""},
            {"title":"订单描述","class":"center orderCodeDesc","data":"order_desc","defaultContent": ""},
            {"title":"车号","class":"center busNumber","data":"bus_number","defaultContent": ""},
            {"title":"VIN","class":"center","data":"vin","defaultContent": "","render":function(data,type,row){
            	return (data==undefined || data==null || data=='')? "<input style='border:0;width:98%;text-align:center;background-color:white;' class='vin' " +
						" value=''/><input class='vinHide' style='width:0px;position:absolute;margin-top:-2000px' />": 
							"<input style='border:0;width:98%;text-align:center;background-color:white;' class='vin' " +
						" value='"+data+"' readonly='true'/>"}

			},
			{"title":"左电机号","class":"center","data":"left_motor_number","defaultContent": "","render":function(data,type,row,meta){ // margin-top:-2000px
				return "<input id=leftMotor_"+(meta.row + meta.settings._iDisplayStart + 1)+" style='border:0;width:98%;text-align:center;background-color:white;' class='leftMotor' " +
						" value='"+((data!=undefined && data!=null && data!='') ? data : '')+"'/><input class='leftMotorHide' style='width:0px;position:absolute; margin-top:-2000px' />";
			}
			},
			{"title":"右电机号","class":"center","data":"right_motor_number","defaultContent": "","render":function(data,type,row,meta){
				//alert(data);
				var right_motor_number=((data!=undefined && data!=null && data!='') ? data : '');
				
				
				var str= "<input id=rightMotor_"+(meta.row + meta.settings._iDisplayStart + 1)+" style='border:0;width:98%;text-align:center;background-color:white;' class='rightMotor' " +
						" value='"+right_motor_number+"'/><input type='text' class='rightMotorHide' style='width:0px;position:absolute;margin-top:-2000px' />";
				//console.log("strstr = ",str);
				return str;
			}
			}/*,
            {"title":"打印状态","class":"center","data":"print_sign","defaultContent": ""},
            {"title":"最近打印人","class":"center","data":"printer","defaultContent": ""},
            {"title":"最近打印日期","class":"center","data":"print_date","defaultContent": ""},
            {"title":"打印次数","class":"center","data":"print_times","defaultContent": ""},
            {"title":"操作","class":"center","data":"","render":function(data,type,row){
            	return "<i class=\"glyphicon glyphicon-print bigger-130 btnPrint\" title=\"打印\" style='color:blue;cursor: pointer;'></i>";		            		
            	} 
            }*/
          ],
	});
}
//打印后更新打印信息
function ajaxUpdatePrint(busNoList){
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		url : "afterVinPrint",
		data : {
			"conditions" : vinList
		},
		success:function(response){
			if(response.success){
				//alert("打印成功！");
				 setTimeout(function (){
					 ajaxQuery();				
					},1000);
			}
		}
	});
}
//检查vin码是否绑定了车号
function ajaxValidateBusVin(vin,busNumber){
	var busList;
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		async : false,
		url : "getBusNumberByVin",
		data : {
			"vin" : vin
		},
		success:function(response){		
			busList=response.data;	
		}
	});

	return busList;
}
//检查vin码是否有效
function ajaxValidateVin(vin){
	var flag=false;
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		async : false,
		url : "validateVin",
		data : {
			"vin" : vin
		},
		success:function(response){	
			if(response.data.length>0){
				flag=true;	
			}
			
		}
	});
	return flag;
}
function isContain(vin,vinList){
	var flag=false;
	$.each(vinList,function(index,obj){
		if(vin==obj.vin){
			flag=true;
			return;
		}
	})
	return flag;
}
//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}
