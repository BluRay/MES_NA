var test_item_list=[];
var test_standard_list={};
var workshop_list=null;
var workgroup_list=[];

$(document).ready(function(){
	initPage();
	
	$('#fuelux-wizard-container').ace_wizard({
		//step: 2 //optional argument. wizard will jump to step "2" at first
		//buttons: '.wizard-actions:eq(0)'
	})	.on('change' , function(e, info){
		//alert(info.direction)
		if(info.step == 1&&info.direction=='next') {//第二步获取检验项目
			$("#save").attr("disabled","disabled");
			
			var bus_number=$("#bus_number").val();
			var check_node=$("#check_node :selected").text();
			if(bus_number.trim().length==0){
				fadeMessageAlert(null,'请输入有效车号！','gritter-warning');
				return false;
			}
			if(check_node.trim()=='请选择'){
				fadeMessageAlert(null,'请选择检验节点！','gritter-warning');
				return false;
			}
			if($("#test_date").val().trim().length==0){
				fadeMessageAlert(null,'请输入检验日期！','gritter-warning');
				return false;
			}
				
		}
		if(info.step == 2&&info.direction=='next') {
			//$(".btn-next").css("visibility","hidden");
			//$("#save").css("visibility","visible");
			var standard=$('input:radio[name="check_strd"]:checked').val();
			if(standard==null){
				fadeMessageAlert(null,'请选择检验标准！','gritter-warning');
				return false;
			}
			getWorkshopSelect('',$("#factory :selected").text(),"","#workshop","","id");
			var workshop_all=getAllFromOptions("#workshop","name");
			getWorkgroupSelectAll(workshop_all);
			$(".btn-next").attr("disabled","disabled");
			$("#save").removeAttr("disabled","");
		}else if(info.step == 2&&info.direction=='previous'){
			//$(".btn-next").css("visibility","visible");
			//$("#save").css("visibility","visible");
			$(".btn-next").removeAttr("disabled","");
			$("#save").removeAttr("disabled","");
		}else{
			//$("#save").css("visibility","hidden");
			//$(".btn-next").css("visibility","visible");
			$("#save").attr("disabled","disabled");
			$(".btn-next").removeAttr("disabled","");
		}
	})
	.on('finished', function(e) {
		
	}).on('stepclick', function(e){
	});	
	
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#bus_number').bind('keydown', function(event) {
       if($(this).attr("disabled") == "disabled")
            return false;      
        if (event.keyCode == "13"){	
            if(jQuery.trim($('#bus_number').val()) != ""){
                ajaxValidate();
                //输入有效车号以后，如何选择了检验节点则更新检验项目和标准
                if($("#check_node").val().trim().length>0){
                	ajaxGetStandard();
                }
            }
            
            return false;
        }  
    });
	
    $("#test_item").on("change",function(){
    	var test_item=$(this).val();
    	var standard_list=test_standard_list[test_item];
		var strd_html="";
		$.each(standard_list,function(i,standard){
			strd_html+="<div class=\"col-xs-12\"><label class=\"col-xs-3 control-label no-padding-right\"></label>"+
			 "<div class=\"col-xs-9\" style=\"margin-bottom: 0;padding-top: 3px;color: #657ba0;\">"+
			 "<input type=\"radio\" name=\"check_strd\" tpl_detail_id="+standard.id+
			 " tpl_head_id="+standard.test_card_template_id+">";
			strd_html+=standard.test_standard;
			strd_html+="</input></div></div>";
		})
    	
    	$("#test_standard_list").html(strd_html);
    })
    
    $("#test_result").on("input",function(){
    	$(this).attr("fault_id","");
    	$("#fault_type").html("");
		$("#fault_level").html("")
    });
   
    $('#bus_number').on("input",function(){
    	$(this).attr("order_id","")
    	$(this).attr("order_config_id","")
    })
    
	$(document).on("change","#workshop",function(e){
		var element=$("#workgroup");
		var workshop=$(this).find("option:selected").text();
		//alert(JSON.stringify(workgroup_list[workshop]))
		getSelects(workgroup_list[workshop], "", element,"","id");
	});
	/**
	 * 改变检验节点，如何已输入有效车号则更新检验项目和标准
	 */
    $(document).on("change","#check_node",function(e){
    	 if($("#bus_number").val().trim().length>0){
         	ajaxGetStandard();
         }
	});
    
	$("#save").on("click",function(){
		ajaxSave();
	})
})

function initPage(){
	$("#bus_number").val("");
	$("#tester").val("");
	$("#test_result").val("");
	$("#workshop").val("");
	$("#workgroup").val("");
	$("#save").removeAttr("disabled","");
	getFactorySelect("quality/prdRcdIn","","#factory","请选择","id")
	$(".btn-next").show();
	
	$("#test_result").typeahead({
			source : function(input, process) {
				$.get("/BMS/quality/getFaultListFuzzy", {
					"bug" : input
				}, function(response) {
					faultlist = response.data;
					var results = new Array();
					$.each(response.data, function(index, value) {
						results.push(value.bug);
					})
					return process(results);
				}, 'json');
			},
			matcher : function(item) {
				return true;
				
			},
			items : 20,
			updater : function(item) {
				var selectId = "";
				var bugType="";
				var faultLevel="";
				$.each(faultlist, function(index, value) {
					if (value.bug == item) {
						selectId = value.id;		
						bugType=value.bugType;
						faultLevel=value.faultLevel;
					}
				})

				// alert(selectId);
				$("#test_result").attr("fault_id", selectId);
				$("#fault_type").html(bugType||"");
				$("#fault_level").html(faultLevel||"")
				return item;
			}
		});
	
	getKeysSelect("CHECK_NODE", "", "#check_node","请选择","id");
}

/**
 * 查询成品记录表模板明细
 */
function ajaxGetStandard(){
	var detail=null;
	var flag=true;
	$.ajax({
		url:"getPrdRcdOrderTpl",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":$("#bus_number").val(),
			"test_node":$("#check_node :selected").text()
		},
		success:function(response){
			$("#test_item").html("");
			$("#test_standard_list").html("");
			test_standard_list={};
			
			if(response.success){
				detail=response.data;
				var item_html="";
				var test_item="";
				var strd_list=[];
				test_item_list=[];
				$.each(detail,function(i,value){
					var obj={};
					obj.test_standard=value.test_standard;
					obj.test_card_template_id=value.test_card_template_id;
					obj.id=value.id;
					
					if(test_item!=value.test_item){
						test_item_list.push(value.test_item);
						strd_list=[];
						strd_list.push(obj);
						test_standard_list[value.test_item]=strd_list;
					}else{
						test_standard_list[value.test_item].push(obj);
					}

					test_item=value.test_item;
				})
				
				$.each(test_item_list,function(i,item){
					item_html += "<option value='" + item + "'>" + item+ "</option>";
				})
				$("#test_item").html(item_html);
				var standard_list=test_standard_list[test_item_list[0]];
				var strd_html="";
				$.each(standard_list,function(i,standard){
					strd_html+="<div class=\"col-xs-12\"><label class=\"col-xs-3 control-label no-padding-right\"></label>"+
					 "<div class=\"col-xs-9\" style=\"margin-bottom: 0;padding-top: 3px;color: #657ba0;\">"+
					 "<input type=\"radio\" name=\"check_strd\" tpl_detail_id="+standard.id+
					 " tpl_head_id="+standard.test_card_template_id+">";
					strd_html+=standard.test_standard;
					strd_html+="</input></div></div>";
				})
				
				$("#test_standard_list").html(strd_html);
			}else{
				fadeMessageAlert(null,response.message,'gritter-error');
				flag= false;
			}

		}
	})
	return flag;
}

function ajaxValidate (){
	$.ajax({
        type: "post",
        dataType: "json",
        url : "/BMS/production/getBusInfo",
        async:false,
        data: {
        	"bus_number": $('#bus_number').val(),
        },
        success: function(response){               
                var bus=response.businfo;
                if(bus == ""||bus==null){
                	fadeMessageAlert(null,'该车号不存在！','gritter-error');
                	$("#bus_number").val("");
                	return false;
                }else if(bus.factory_name.indexOf(getAllFromOptions("#factotry","name"))<0){
                	fadeMessageAlert(null,'抱歉，该车辆属于'+bus.factory_name+'，您没有操作权限！','gritter-error');
                	$("#bus_number").val("");
                	$("#bus_number").attr("order_id","");
            		$("#bus_number").attr("order_config_id","");
                	return false;
                }else{           		
            		//选中工厂、车间、线别、工序
            		$("#factory").val(bus.factory_id).attr("disabled",true);
            		$("#bus_number").attr("order_id",bus.order_id);
            		$("#bus_number").attr("order_config_id",bus.order_config_id);
            		$("#order").html(bus.order_desc);
                }
        },
        error:function(){alertError();}
   });
}

function getWorkgroupSelectAll(workshop_list){
	workgroup_list=[];
	$.ajax({
		url:"/BMS/common/getWorkgroupSelectAll",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"factory":$("#factory :selected").text(),
			"workshop_list":workshop_list
		},
		success:function(response){
			//workgroup_list=response.data
			$.each(response.data,function(index,value){
				var item=JSON.parse(value.workgroup_list);
				workgroup_list[item.workshop]=item.workgroup_list
			})
		}
	})	
}

function ajaxSave(){
	if(JSON.stringify(test_standard_list) == "{}"){
		fadeMessageAlert(null,'抱歉未匹配到模板！','gritter-error');
		return false;
	}
	var standard_default=test_standard_list[test_item_list[0]][0];
	var detail_list_submit=[];
	var test_result=$("#test_result").val();
	var result=$("#result").val();
	var fault_id=$("#test_result").attr("fault_id");
	var test_card_template_detail_id=$('input:radio[name="check_strd"]:checked').attr("tpl_detail_id");
	var test_card_template_head_id=standard_default.test_card_template_id/*$('input:radio[name="check_strd"]:checked').attr("tpl_head_id");*/
	var order_id=$("#bus_number").attr("order_id");
	var test_node_id=$("#check_node").val();
	var test_date=$("#test_date").val();
	var tester=$("#tester").val();
	var workshop_id=$("#workshop").val();
	var workgroup_id=$("#workgroup").val();

	
	if(order_id==null||order_id==""){
		fadeMessageAlert(null,'请输入有效车号！','gritter-error');
		return false;
	}
	if(test_node_id==null||test_node_id==""){
		fadeMessageAlert(null,'请选择检验节点！','gritter-error');
		return false;
	}
	if(test_date.trim().length==0){
		fadeMessageAlert(null,'请输入检验日期！','gritter-error');
		return false;
	}
	if(tester.trim().length==0&&fault_id>0){
		fadeMessageAlert(null,'请输入检验员！','gritter-error');
		return false;
	}
	if(result.trim().length==0&&fault_id>0){
		fadeMessageAlert(null,'请输入检验结果！','gritter-error');
		return false;
	}
	if((workshop_id==null||workshop_id=="")&&test_result.trim().length>0){
		workshop_id=0;
		fadeMessageAlert(null,'请选择责任车间！','gritter-error');
		return false;
	}
	if((workgroup_id==null||workgroup_id=="")&&test_result.trim().length>0){
		workgroup_id=0;
		fadeMessageAlert(null,'请选择责任班组！','gritter-error');
		return false;
	}
	
	
	var obj={};
	obj.test_card_template_detail_id=test_card_template_detail_id;
	obj.test_card_template_head_id=test_card_template_head_id||$('input:radio[name="check_strd"] :eq(0)').attr("tpl_head_id");;
	obj.test_date=test_date;
	obj.bus_number=$("#bus_number").val();
	obj.factory_id=$("#factory").val();
	obj.order_id=$("#bus_number").attr("order_id");
	obj.order_config_id=$("#bus_number").attr("order_config_id");
	obj.test_node_id=test_node_id;
	obj.test_node=$("#check_node :selected").text();
	obj.result=result;
	obj.fault_id=fault_id;
	obj.test_result=test_result;
	obj.result_judge=$("#judge").val();
	obj.rework=$("#rework").val();
	obj.tester=tester;
	obj.workshop_id=workshop_id;
	obj.workgroup_id=workgroup_id;

	
	detail_list_submit.push(obj);
	
	$.ajax({
		url:"saveProductRecord",
		async:false,
		type:"post",
		dataType:"json",
		data:{
			"bus_number":$("#bus_number").val(),
			"test_node":$("#check_node :selected").text(),
			"test_card_template_detail_id":test_card_template_detail_id||"",
			"test_card_template_head_id":test_card_template_head_id||"",
			"record_detail":JSON.stringify(detail_list_submit)
		},
		success:function(response){
			fadeMessageAlert(null,response.message,'gritter-success');
			var wizard = $('#fuelux-wizard-container').data('wizard');
			if(wizard.currentStep==3){
				wizard.currentStep = 2;
				$("#save").attr("disabled","disabled");
				$(".btn-next").removeAttr("disabled","");
			}
			
			wizard.setState();
			
		}
	})	
}
