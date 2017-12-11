var task_all_list={};
var workshop_list=[];
$(document).ready(function(){
	getBusNumberSelect('#bus_number');
//	getFactorySelect("tech/followingUpPage","","#exec_factory",null,"id");
//	 $("#exec_factory").attr("disabled",true)
	$('#bus_number').focus();
	//输入回车，发ajax进行校验；成功则显示并更新车辆信息
    $('#bus_number').bind('keydown', function(event) {
       if($(this).attr("disabled") == "disabled")
            return false;      
        if (event.keyCode == "13"){	
            if($(this).val().trim().length>0){
                ajaxGetTechTaskList();
            }
            
            return false;
        }  
    });

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	
    $("#btn_save").click(function(){
        var item_bus_id_array=new Array(); 
        var item_id_array=new Array(); 
        $('input[name="check_task"]:checked').each(function(){  
        	item_bus_id_array.push($(this).attr("bus_item_id"));//向数组中添加元素
            item_id_array.push($(this).attr("item_id"));
        });  
        
        if(item_id_array.length==0){
        	fadeMessageAlert(null,Warn['P_techFollowMobile_01'],'gritter-warning');
        	return false;
        }
        var itembusidstr=item_bus_id_array.join(',');
        var itemidstr=item_id_array.join(',');//将数组元素连接起来以构建一个字符串  
        //alert(idstr);  

    	$.ajax({
    		url:"followTechTaskByBus",
    		type:"post",
    		dataType:"json",
    		data:{
    			"bus_number":$("#bus_number").val(),
    			"status":'2',
    			"item_ids":itemidstr,
    			"item_bus_ids":itembusidstr
    		},
    		success:function(response){
    			if(response.success){
    				fadeMessageAlert(null,Warn['P_common_03'],'gritter-success');
    				$("#bus_number").val("");
    				$("#task_content").html("");
    			}else{
    				fadeMessageAlert(null,Warn['P_common_04'],'gritter-error');
    			}  			
    		}
    	});	
    });
    
/*	 $("#workshop").on("change",function(){
	    	var workshop=$(this).val();
	    	var task_list=task_all_list[workshop];
			var html="";
			$.each(task_list,function(i,task){
				html+="<div class=\"col-xs-12\"><label class=\"col-xs-3 control-label no-padding-right\"></label>"+
				 "<div class=\"col-xs-9\" style=\"margin-bottom: 0;padding-top: 3px;color: #657ba0;\">"+
				 "<input type=\"radio\" name=\"check_task\" item_id="+task.id+">";
				html+=task.task_content;
				html+="</input></div></div>";
			})
	    	
	    	$("#task_content").html(html);
	    })*/
})

function ajaxGetTechTaskList(){
	$.ajax({
		url:"getTechtaskListByBus",
		type:"post",
		dataType:"json",
		data:{
			"bus_number":$("#bus_number").val()
		},
		success:function(response){
			var detail_list=response.data;
			if(detail_list.length==0){
				fadeMessageAlert(null,Warn['P_techFollowMobile_02'],'gritter-warning');
				return false;
			}
//			var factory=detail_list[0].factory;
//			 if(factory.indexOf(getAllFromOptions("#exec_factotry","name"))<0){
//             	fadeMessageAlert(null,'抱歉，该车辆属于'+factory+'，您没有操作权限！','gritter-error');
//             	$("#bus_number").val("");
//             	return false;
//             }
//			 $("#exec_factory").find("option:contains('"+factory+"')").attr("selected",true)
			 
		/*	var workshop="";
			var task_list=[];
			$.each(detail_list,function(i,value){
				var obj={};
				obj.task_content=value.task_content;
				obj.workshop=value.workshop;
				obj.id=value.id;
				
				if(workshop!=value.workshop){
					workshop_list.push(value.workshop);
					task_list=[];
					task_list.push(obj);
					task_all_list[value.workshop]=task_list;
				}else{
					task_all_list[value.workshop].push(obj);
				}

				workshop=value.workshop;

			})
			var workshop_html="";
			$.each(workshop_list,function(i,workshop){
				workshop_html += "<option value='" + workshop + "'>" + workshop+ "</option>";
			})
			
			$("#workshop").html(workshop_html);
			
			var task_list=task_all_list[workshop_list[0]];*/
			var task_html="";
			$.each(detail_list,function(i,task){
					task_html+="<div class=\"col-xs-12\"><label class=\"col-xs-3 control-label no-padding-right\"></label>"+
					 "<div class=\"col-xs-9\" style=\"margin-bottom: 0;padding-top: 3px;color: #657ba0;\">"+
					 "<input type=\"checkbox\" name=\"check_task\" bus_item_id="+task.bus_item_id+" item_id="+task.item_id+">";
					//task_html+="（"+task.workshop+"）";
					task_html+=task.items;
					task_html+="</input></div></div>";
				})
				
				$("#task_content").html(task_html);
		}
	})
}