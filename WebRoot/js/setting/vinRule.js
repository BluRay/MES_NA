
$(document).ready(function(){

	getFactorySelect();
	getBusType($("#add_busType"));
	getKeysSelect("ORDER_AREA", "", $("#add_area"),"-请选择-","");
	ajaxQuery();
	getKeysSelect("ORDER_AREA", "", $("#search_area"),"全部",""); 
	
	$(".btnQuery").on("click",function(){
		ajaxQuery();
	});
	
	$("#btnDelete").on("click",function(){
		ajaxDelete();
	});
	
	$(document).on("click","#btnAdd",function(){
		$("#add_wmiExtension").attr("readonly",false);
		$("#add_numberSize").attr("readonly",false);
		$("#addForm")[0].reset();
		var dialog = $( "#dialog-add" ).removeClass('hide').dialog({
			width:600,
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 新增工厂</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#addForm")[0].reset();
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#add_busType").val()===""){
							alert("车型不能为空！");
							$("#add_busType").focus();
							return false;
						}
						if($("#add_area").val()===""){
							alert("区域不能为空！");
							$("#add_area").focus();
							return false;
						}
						var vinPrefix=$("#add_vinPrefix").val();
						if(vinPrefix===""){
							alert("VIN前八位不能为空！");
							$("#add_vinPrefix").focus();
							return false;
						}else{
							vinPrefix=vinPrefix.trim();
							if(vinPrefix.length!=8){
								alert("请输入8位字符！");
								$("#add_vinPrefix").focus();
								return false;
							}
							var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
							var rs = "";  
							if(pattern.test(vinPrefix)){     
							    alert("不能输入特殊字符！");  
							    $("#add_vinPrefix").focus();
							    return false;          
							} 
							var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
							if(reg.test(vinPrefix.trim())){     
							    alert("不能输入汉字！"); 
							    $("#add_vinPrefix").focus();
							    return false;          
							}   
							$("#add_vinPrefix").val(vinPrefix.toUpperCase());
						}
						if($("#add_numberSize").val()===""){
							alert("生成序列号位数不能为空！");
							$("#add_numberSize").focus();
							return false;
						}
						
						$.ajax({
						    url: "addVinRule",
						    dataType: "json",
							type: "get",
						    data: {
						    	"busTypeId" : $("#add_busType").val(),
						    	"area" : $("#add_area :selected").attr('keyvalue'),
						    	"vinPrefix" : $("#add_vinPrefix").val(),
						    	"capacity" : $("#addCapacity").val(),
						    	"wmiExtension" : $("#add_wmiExtension").val(),
						    	"numberSize" : $("#add_numberSize").val()
						    },
						    success:function(response){
						    	if(response.success){
						    	$.gritter.add({
									title: '系统提示：',
									text: '<h5>增加VIN生成规则成功！</h5>',
									class_name: 'gritter-info'
								});
						    	$("#addForm")[0].reset();
						    	ajaxQuery();
						    	}else{
						    		$.gritter.add({
										title: '系统提示：',
										text: '<h5>增加VIN生成规则失败！</h5><br>'+response.message,
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
	}); 
	
	$(document).on("click",".editVinRule",function(){
		getKeysSelect("ORDER_AREA", "", $("#edit_area"),"-请选择-","");
		$("#edit_busType").html("");
		getBusType($("#edit_busType"));
		$('#editId').val($(this).closest('tr').find('td').eq(0).find('input').eq(0).val());
		var busTypeId=convertBusType($(this).closest('tr').find('td').eq(1).html(),"1");
		$("#edit_busType option[value="+busTypeId+"]").attr("selected",true);
		var area=convertArea($(this).closest('tr').find('td').eq(2).html(),"1");
		$("#edit_area option[value="+area+"]").attr("selected",true);
		$('#edit_vinPrefix').val($(this).closest('tr').find('td').eq(3).html());
		$('#edit_wmiExtension').val($(this).closest('tr').find('td').eq(4).html());
		$('#edit_numberSize').val($(this).closest('tr').find('td').eq(5).html());
		$("#edit_wmiExtension").attr("readonly",true);
		$("#edit_numberSize").attr("readonly",true);
		var dialog = $( "#dialog-edit" ).removeClass('hide').dialog({
			width:600,
			/*height:500,*/
			modal: true,
			title: '<div class="widget-header"><h4 class="smaller"><i class="ace-icon fa fa-gear green"></i> 编辑VIN生成规则</h4></div>',
			title_html: true,
			buttons: [ 
				{
					text: "取消",
					"class" : "btn btn-minier",
					click: function() {
						$( this ).dialog( "close" ); 
						$("#editForm")[0].reset();
					} 
				},
				{
					text: "确定",
					"class" : "btn btn-primary btn-minier",
					click: function() {
						if($("#edit_busType").val()===""){
							alert("车型不能为空！");
							$("#edit_busType").focus();
							return false;
						}
						if($("#edit_area").val()===""){
							alert("区域不能为空！");
							$("#edit_area").focus();
							return false;
						}
						var vinPrefix=$("#edit_vinPrefix").val();
						if(vinPrefix===""){
							alert("VIN前八位不能为空！");
							$("#edit_vinPrefix").focus();
							return false;
						}else{
							vinPrefix=vinPrefix.trim();
							if(vinPrefix.length!=8){
								alert("请输入8位字符！");
								return false;
							}
							var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
							var rs = "";  
							if(pattern.test(vinPrefix)){     
							    alert("不能输入特殊字符！");  
							    return false;          
							} 
							var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
							if(reg.test(vinPrefix.trim())){     
							    alert("不能输入汉字！");  
							    return false;          
							}   
							
						}
						if($("#edit_numberSize").val()===""){
							alert("生成序列号位数不能为空！");
							$("#edit_numberSize").focus();
							return false;
						}
						
					$.ajax({
					    url: "updateVinRule",
					    dataType: "json",
						type: "get",
					    data: {
					    	"id" : $("#editId").val(),
					    	"busTypeId" : $("#edit_busType").val(),
					    	"area" : $("#edit_area :selected").attr('keyvalue'),
					    	"vinPrefix" : $("#edit_vinPrefix").val(),
					    	"wmiExtension" : $("#edit_wmiExtension").val(),
					    	"numberSize" : $("#edit_numberSize").val()
					    },
					    success:function(response){
					    	if(response.success){
					    	$.gritter.add({
								title: '系统提示：',
								text: '<h5>编辑成功！</h5>',
								class_name: 'gritter-info'
							});
					    	$("#editForm")[0].reset();
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
					$("#editForm")[0].reset();
					} 
				}
			]
		});
	}); 
	$("#add_vinPrefix").blur(function(){
		checkVinPrefix($(this));
	});
	$("#edit_vinPrefix").blur(function(){
		checkVinPrefix($(this));
	});
	function checkVinPrefix(e){
		var vinPrefix=$(e).val();
		if(vinPrefix===""){
			return false;
		}else{
			vinPrefix=vinPrefix.trim();
			if(vinPrefix.length!=8){
				alert("请输入8位字符！");
				$(e).focus();
				return false;
			}
			var pattern = new RegExp("[`~!@#$^&*%()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
			var rs = "";  
			if(pattern.test(vinPrefix)){     
			    alert("不能输入特殊字符！");  
			    $(e).focus();
			    return false;          
			} 
			var reg = new RegExp("[\\u4E00-\\u9FFF]+","g");
			if(reg.test(vinPrefix.trim())){     
			    alert("不能输入汉字！"); 
			    $(e).focus();
			    return false;          
			}   
			$(e).val(vinPrefix.toUpperCase());
		}
	}
	
	$("#add_area").change(function(){
		changeArea($(this),"add");
	});
    $("#edit_area").change(function(){
    	changeArea($(this),"edit");
	});
    function changeArea(param,type){
    	var areaVal=$(param).find("option:selected").text(); 
        if(areaVal=='中国'){  // 中国 WMI扩展代码 默认 为空
    		$("#add_wmiExtension").val("");
    		$("#edit_wmiExtension").val("");
    	}else if(areaVal=='美国'){ // 美国 WMI扩展代码 默认 038
    		$("#edit_wmiExtension").val("038");
    		$("#add_wmiExtension").val("038");
    	}else{
    		$("#add_wmiExtension").val("");
    		$("#edit_wmiExtension").val("");
    	}
    	$("#edit_wmiExtension").attr("readonly",true);
    	$("#add_wmiExtension").attr("readonly",true);
    	$("#add_numberSize").val("6");
		$("#add_numberSize").attr("readonly",true);
		$("#edit_numberSize").val("6");
		$("#edit_numberSize").attr("readonly",true);
    }
});

function ajaxDelete(){
	var ids = '';
	$(":checkbox").each(function(){
		if($(this).prop("checked")){
			if($(this).attr('fid')){
				ids += $(this).attr('fid').split('_')[1] + ',';
			}
		}
	});
	if(ids===''){
		$.gritter.add({
			title: '系统提示：',
			text: '<h5>请至少勾选一个要删除的工厂！</h5>',
			class_name: 'gritter-info'
		});
		return false;
	}
	$.ajax({
	    url: "deleteVinRule",
	    dataType: "json",
		type: "get",
	    data: {
	    	"ids" : ids.substring(0,ids.length-1)
	    },
	    success:function(response){
	    	if(response.success){
	    	$.gritter.add({
				title: '系统提示：',
				text: '<h5>删除成功！</h5>',
				class_name: 'gritter-info'
			});
	    	
	    	ajaxQuery();
	    	}else{
	    		$.gritter.add({
					title: '系统提示：',
					text: '<h5>删除失败！</h5><br>'+response.message,
					class_name: 'gritter-info'
				});
	    	}
	    }
	});
}

function ajaxQuery(){

	$("#tableData").dataTable({
		serverSide: true,
		fixedColumns:   {
            leftColumns: 0,
            rightColumns:0
        },
        paging:false,
		ordering:false,
		searching: false,
		bAutoWidth:false,
		destroy: true,
		sScrollY: document.documentElement.clientHeight-250 + 'px',
		scrollX: "100%",
		/*scrollCollapse: true,*/
		pageLength: 10,
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
				"busTypeId":$("#search_busType").val(),
				"area":$("#search_area :selected").attr('keyvalue'),
			};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getVinRuleList",
                cache: false,  //禁用缓存
                data: param,  //传入组装的参数
                dataType: "json",
                success: function (result) {
                	$.each(result.data,function(index,value){
                		result.data[index].busTypeId=convertBusType(value.busTypeId,"0");
                		result.data[index].area=convertArea(value.area,"0");
                	});
                    //console.log(result);
                	//封装返回数据
                    var returnData = {};
                    returnData.draw = data.draw;//这里直接自行返回了draw计数器,应该由后台返回
                    returnData.recordsTotal = result.recordsTotal;//返回数据全部记录
                    returnData.recordsFiltered = result.recordsTotal;//后台不实现过滤功能，每次查询均视作全部结果
                    returnData.data = result.data;//返回的数据列表
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);
                }
            });
		
		},
		columns: [
		          	{"title":"<input type='checkbox' id='selectAll' onclick='selectAll()'/>","class":"center","data":"id","render": function ( data, type, row ) {
	                    return "<input id='id' value='"+data+"' type='hidden' /><input type='checkbox' fid='cb_"+data+"'>";
	                },"defaultContent": ""},
		            //{"title":"序号","class":"center","data":"","defaultContent": ""},
		            {"title":"车型","class":"center","data":"busTypeId","defaultContent": ""},
		            {"title":"区域","class":"center","data":"area","defaultContent": ""},
		            {"title":"VIN前八位","class":"center","data":"vinPrefix","defaultContent": ""},
		            {"title":"WMI扩展代码","class":"center","data":"wmiExtension","defaultContent": ""},
		            {"title":"生成序列号位数","class":"center","data": "numberSize","defaultContent": ""},
		            {"title":"编辑","class":"center","data":null,"defaultContent": "<i class=\"ace-icon fa fa-pencil bigger-130 editVinRule\" style='color:green;cursor: pointer;'></i>"}
		          ],
		
		
	});
	
}
function getBusType(element){
	$.ajax({
		url: "/IMMS/common/getBusType",
		dataType: "json",
		data: {},
		async: false,
		error: function () {alertError();},
		success: function (response) {
			var options="<option value=''>-请选择-</option>";
			$.each(response.data,function(index,value){
				options += "<option value=" + value.id + ">"+ value.code + "</option>";
			});
			$(element).append(options);
		}
	})
}
/* 车型ID、车型描述相互转换
 * value：传入参数
 * type： 0 ：车型ID转车型描述  【demo： 参数(value)：2 ；返回值(returnValue) : K8】； 
 *       1 ： 车型描述转车型ID 【demo： 参数(value)：K8 ；返回值(returnValue) : 2】； 
 */
function convertBusType(value,type) {
    var returnValue=""; // 返回值
    var readValue="";
    var changeValue="";

    $("#add_busType option").map(function(){
    	if(type=="0"){
        	readValue=$(this).val();
        	changeValue=$(this).text();
        }else{
        	readValue=$(this).text();
        	changeValue=$(this).val();
        }
        if(readValue==value){
        	returnValue=changeValue;
        	return false;
        }
    });
    return returnValue;
}
// 区域代码 转换 区域 描述 【demo 参数(参数)：0 ; 返回值 (returnValue):中国】
function convertArea(value,type) {
    var returnValue="";
    var readValue="";
    var changeValue="";
    $("#add_area option").map(function(){
    	if(type=="0"){
        	readValue=$(this).attr("keyvalue");
        	changeValue=$(this).text();
        }else{
        	readValue=$(this).text();
        	changeValue=$(this).val();
        }
        if(readValue==value){
        	
        	returnValue=changeValue;
        	return false;
        }
    });
    return returnValue;
}
function setInput(value){
	var input="<input type='text' value='"+value+"' />";
	return input;
} 

//复选框全选或反选
function selectAll() {
    if ($("#selectAll").prop("checked")) {
        $(":checkbox").prop("checked", true);
    } else {
        $(":checkbox").prop("checked", false);
    }
}