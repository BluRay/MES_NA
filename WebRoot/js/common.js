/* ztree树对象变量 */
var zNodes=[];
var zTreeObj={};
var const_email_validate=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
var const_float_validate= /^[0-9]+[0-9]*\.?[0-9]*$/;//浮点数正则表达式
var const_float_validate_one= /^\d*\.?\d?$/;//一位浮点数正则表达式
var const_int_validate = /^[0-9]+[0-9]*$/;//整数正则表达式
/*
 * 填充下拉列表 with id=>value;包括全部选项
 */
function getSelects(data, selectval, element,defaultVal,valName) {	
	var strs ="";
	if(defaultVal!=undefined){
		strs = "<option value=''>"+defaultVal+"</option>";
	}
	$(element).html("");
	$.each(data, function(index, value) {
		if(valName=="name"){
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.name +(value.org_id?(" org_id="+value.org_id):"")+ " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.name +(value.org_id?(" org_id="+value.org_id):"")+ ">" + value.name
						+ "</option>";
			}
		}else{
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.id +(value.org_id?(" org_id="+value.org_id):"")+ " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.id+(value.org_id?(" org_id="+value.org_id):"") + ">" + value.name
						+ "</option>";
			}
		}
	});
	$(element).append(strs);
}
/*
 * 填充下拉列表 with id=>value;不包括全部选项
 */
function getSelects_noall(data, selectval, element,defaultVal,valName) {
	//defaultVal=defaultVal||"";
	var strs ="";
	if(defaultVal!=undefined){
		 strs = "<option value=''>"+defaultVal+"</option>";
	}
	
	$(element).html("");
	$.each(data, function(index, value) {
		if(valName=="name"){
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.name + " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.name + ">" + value.name
						+ "</option>";
			}
		}else{
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.id + " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.id + ">" + value.name
						+ "</option>";
			}
		}
	});
	$(element).append(strs);
}
/*
 * 填充下拉列表 with id=>value;不包括全部选项
 */
function getSelects_empty(data, selectval, element,defaultVal,valName) {
	//var strs = "<option value=''>请选择</option>";
	defaultVal=defaultVal||"";	
	var strs = "<option value=''>请选择</option>";
	$(element).html("");
	$.each(data, function(index, value) {
		if(valName=="name"){
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.name + " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.name + ">" + value.name
						+ "</option>";
			}
		}else{
			if (selectval == value.id || selectval == value.name) {
				strs += "<option value=" + value.id + " selected='selected'" + ">"
						+ value.name + "</option>";
			} else {
				strs += "<option value=" + value.id + ">" + value.name
						+ "</option>";
			}
		}
	});
	$(element).append(strs);
}
/*
 * 订单编号模糊查询 submitId： 用于提交的元素的id
 */
function getOrderNoSelect(elementId, submitId, fn_backcall, bustype,factoryElement,areaflg) {
	areaflg=areaflg||"";
	
	if (!bustype) {
		bustype = "";
	}

	var orderlist;
	//alert($(elementId).next().html())
	$(elementId).typeahead({		
		source : function(input, process) {
			var factory="";
			if(factoryElement){
				if($(factoryElement).find("option:selected").text()=="全部"||$(factoryElement).find("option:selected").text()=="请选择"){
					factory="";
				}else
					factory=$(factoryElement).find("option:selected").text();			
			}
			//alert(factory);
			var data={
					"busType":bustype,
					"orderNo":input,
					"factory":factory
			};		
			return $.ajax({
				url:"/MES_NA/common/getOrderFuzzySelect",
				dataType : "json",
				type : "post",
				data : data,
				async: false,
				success: function (response) { 
					orderlist = response.data;
					var results = new Array();
					$.each(orderlist, function(index, value) {
						//alert(value.id);
						results.push(value.orderNo);
					})
					return process(results);
				}
			});
		},
		items : 15,
		highlighter : function(item) {
			var order_name = "";
			var bus_type = "";
			var order_qty = "";
			$.each(orderlist, function(index, value) {
				if (value.orderNo == item) {
					order_name = value.name;
					bus_type = value.busType;
					order_qty = value.orderQty + "台";
				}
			})
			return item + "  " + order_name + " " + bus_type + order_qty;
		},
		matcher : function(item) {
			if(areaflg!="copy"){//复制粘贴，非选择默认列表第一个项
				return true;
			}
			 //alert(this.query);
			$.each(orderlist, function(index, value) {
				if (value.orderNo == item) {
					selectId = value.id;
					// alert(submitId);
					$(elementId).attr("order_id", selectId);
					$(submitId).val(selectId);
					if (typeof (fn_backcall) == "function") {
						fn_backcall(value);
					}
					return;
				}
			})
			return true;
		},
		updater : function(item) {
			$.each(orderlist, function(index, value) {
				if (value.orderNo == item) {
					selectId = value.id;
					$(elementId).attr("order_id", selectId);
					$(submitId).val(selectId);
					if (typeof (fn_backcall) == "function") {
						fn_backcall(value);
					}
				}
			})
			return item;
		}
	});
}

$.widget("ui.dialog", $.extend({}, $.ui.dialog.prototype, {
	_title: function(title) {
		var $title = this.options.title || '&nbsp;'
		if( ("title_html" in this.options) && this.options.title_html == true )
			title.html($title);
		else title.text($title);
	}
}));


function select_selectOption(elementId,value){
	var options=$(elementId).find("option");
	$.each(options,function(i,option){
		if($(option).text()==value||$(option).attr("value")==value){
			$(elementId).find("option").eq(i).attr("selected", "selected");
		}
	})
}

/*
 * 弹性建下拉选项
 */
function getKeysSelect(keyCode, selectval, element,selectType,valueItem) {
	$.ajax({
		url : "/MES_NA/common/getKeysSelect",
		dataType : "json",
		data : {
			keyCode : keyCode
		},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			var strs ="";
			if(selectType!=undefined){
				strs = "<option value=''>"+selectType+"</option>";
			}
			$(element).html("");
			$.each(response.data, function(index, value) {
				if (selectval == value.id || selectval == value.key_name) {
					if(valueItem=='keyName'){
						strs += "<option value=" + value.key_name + " keyValue="
						+ value.value + " selected='selected'>"
						+ value.key_name + "</option>";
					}else
					strs += "<option value=" + value.id + " keyValue="
							+ value.value + " selected='selected'>"
							+ value.key_name + "</option>";
				} else {
					if(valueItem=='keyName'){
						strs += "<option value=" + value.key_name + " keyValue="
						+ value.value + ">" + value.key_name + "</option>";
					}else
					strs += "<option value=" + value.id + " keyValue="
							+ value.value + ">" + value.key_name + "</option>";
				}
			});
			$(element).append(strs);
		}
	})
}

function generatekeys(keyCode, list) {
	$.ajax({
		url : "/MES_NA/common/getKeysSelect",
		dataType : "json",
		data : {
			keyCode : keyCode
		},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			$.each(response.data, function(index, value) {
				/*
				 * if (input == value.id) { returnValue = value.key_name }
				 */
				var obj = {
					"id" : value.id,
					"key_name" : value.key_name
				};
				list.push(obj);
			});
		}
	});
}

/**
 * 工厂选择下拉列表（包括权限控制）
 * url:权限控制url
 * selectval:选中的值
 * selectId:下拉框组件id
 * selectType:下拉框组件类型：==全部==、==请选择==、== ==
 * valName:option value值:id/name
 */

function getFactorySelect(url,selectval,selectId,selectType,valName,orgKind){
	orgKind=orgKind||'1';
	$.ajax({
		url : "/MES_NA/common/getFactorySelectAuth",
		dataType : "json",
		data : {"function_url":url,"org_kind":orgKind},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}

/**
 * 车间选择下拉列表（包括权限控制）
 * url:权限控制url
 * selectval:选中的值
 * selectId:下拉框组件id
 * selectType:下拉框组件类型：==全部==、==请选择==、== ==
 * valName:option value值:id/name
 */

function getWorkshopSelect(url,factory,selectval,selectId,selectType,valName,orgKind){
	orgKind=orgKind==undefined?'1':orgKind;
	$.ajax({
		url : "/MES_NA/common/getWorkshopSelectAuth",
		dataType : "json",
		data : {"function_url":url,"factory":factory,"org_kind":orgKind},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}
/**
 * 班组选择下拉列表
 * selectval:选中的值
 * selectId:下拉框组件id
 * selectType:下拉框组件类型：==全部==、==请选择==、== ==
 * valName:option value值:id/name
 */

function getWorkgroupSelect(factory,workshop,selectval,selectId,selectType,valName){
	$.ajax({
		url : "/MES_NA/common/getWorkgroupSelect",
		dataType : "json",
		data : {"factory":factory,"workshop":workshop},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}
/**
 * 小班组选择下拉列表
 * selectval:选中的值
 * selectId:下拉框组件id
 * selectType:下拉框组件类型：==全部==、==请选择==、== ==
 * valName:option value值:id/name
 */

function getTeamSelect(factory,workshop,workgroup,selectval,selectId,selectType,valName){
	$.ajax({
		url : "/MES_NA/common/getTeamSelect",
		dataType : "json",
		data : {"factory":factory,"workshop":workshop,"workgroup":workgroup},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}
/**
 * 根据工厂、车间获取线别下拉列表
 * @param factory
 * @param workshop
 */
function getLineSelect(factory,workshop,selectval,selectId,selectType,valName) {
	$.ajax({
		url : "/MES_NA/common/getLineSelectAuth",
		dataType : "json",
		data : {
				factory:factory,
				workshop:workshop
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}

/**
 * 
 * @param name
 * @returns
 */
function getLineSelectStandard(selectval,selectId,selectType,valName){
	$.ajax({
		url : "/MES_NA/common/getLineSelect",
		dataType : "json",
		data : {
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}


function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null) return decodeURI(r[2]); return null; 
} 

/**格局化日期：yyyy-MM-dd */
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

/**
 * 权限控制的下拉组件，当选择全部选项时，获取该组件下所有的选项以逗号分隔返回,否则返回选择的选项
 * elementId:下拉组件id
 * valName:name表示获取下拉选项text，val表示获取下拉选项value值
 * return 
 */
function getAllFromOptions(elementId,valName){
	var selectVal="";
	var selectVal_ALL="";
	var selectName=$(elementId+" :selected").text();
	$(elementId+" option").each(function(){
		if(valName=="name"){
			selectVal_ALL+=$(this).text()+",";
		}else
			selectVal_ALL+=$(this).val()+",";		
	});
	if(valName=="name"){
		selectVal=(selectName=="全部"||selectName=="请选择"||selectName=="")?selectVal_ALL:$(elementId+" :selected").text();
	}else
		selectVal=$(elementId).val()==""?selectVal_ALL:$(elementId).val();
	
	return selectVal;
	
}

//自动隐藏的信息提示框
function fadeMessageAlert(title,message, alertClass) {
	alertClass=alertClass|| 'gritter-info';
	title=title||'系统提示：';
	/*$("#messageAlert").removeClass("alert-error alert-success").addClass(
			alertClass);
	$("#messageAlert").html(message);
	$("#messageAlert").show(500, function() {
		setTimeout(function() {
			$("#messageAlert").hide(1000);
		}, 5000);
	});*/
	$.gritter.add({
		title: title,
		time: 1000,  
	    speed:500,
		text: '<h5>'+message+'</h5>',
		class_name: alertClass
	});
}

//表格下复选框全选、反选;checkall:true全选、false反选
function check_All_unAll(tableId, checkall) {
	if (checkall) {
		$(tableId + " tbody :checkbox").not(':disabled').prop("checked", true);
		//alert("选中");
	} else {
		$(tableId + " tbody :checkbox ").prop("checked",false);
	}
}

/**
 * 车型下拉列表
 * @param selectval
 * @param selectId
 * @param selectType
 * @param valName
 */
function getBusTypeSelect(selectval,selectId,selectType,valName){
	$.ajax({
		url : "/MES_NA/common/getBusType",
		dataType : "json",
		data : {},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}

/**
 * 零部件模糊查询
 * @param elementId
 * @param submitId  :用于提交的元素的id
 * @param fn_backcall
 */
function getPartsSelect(elementId, submitId, fn_backcall) {
	var partslist;
	$(elementId).typeahead({
		source : function(input, process) {
			$.get("/MES_NA/common/getPartsSelect", {
				"parts" : input
			}, function(response) {
				partslist = response.data;
				var results = new Array();
				$.each(response.data, function(index, value) {
					results.push(value.name);
				})
				return process(results);
			}, 'json');
		},
		matcher : function(item) {
			var selectId = "";
			$.each(partslist, function(index, value) {
				if (value.name == item) {
					selectId = value.id;
					if (typeof (fn_backcall) == "function") {
						fn_backcall(value);
					}
				}
			})

			// alert(selectId);
			$(elementId).attr("parts_id", selectId);
			$(submitId).val(selectId);
			return true;
			
		},
		items : 15,
		updater : function(item) {
			var selectId = "";
			$.each(partslist, function(index, value) {
				if (value.name == item) {
					selectId = value.id;
					if (typeof (fn_backcall) == "function") {
						fn_backcall(value);
					}
				}
			})

			// alert(selectId);
			$(elementId).attr("parts_id", selectId);
			$(submitId).val(selectId);
			return item;
		}
	});
}

/*
 * 根据零部件输入值获取零部件ID
 */
function getPartsId(parts) {
	var partsId = "0";
	$.ajax({
		url : "/MES_NA/common/getPartsSelect",
		dataType : "json",
		data : {
			"parts" : parts
		},
		async : false,
		error : function() {
			alertError();
		},
		success : function(response) {
			if (response.data.length > 0) {
				partsId = response.data[0].id;
			}
		}
	})
	return partsId;
}

/**
 * 根据订单id获取订单配置下拉列表
 * @param order_id
 */
function getOrderConfigSelect(order_id,selectval,selectId,selectType,valName) {
	$.ajax({
		url : "/MES_NA/common/getOrderConfigSelect",
		dataType : "json",
		data : {
				order_id:order_id
			},
		async : false,
		error : function(response) {
			alert(response.message)
		},
		success : function(response) {
			getSelects(response.data,selectval,selectId,selectType, valName);	
		}
	});
}

/*
 * 查号模糊查询 submitId： 用于提交的元素的id
 */
function getBusNumberSelect(elementId, submitId, fn_backcall) {
	var busNumberlist;
	$(elementId).typeahead({
		source : function(input, process) {
			$.get("/MES_NA/common/getBusNumberFuzzySelect", {
				"bus_input" : input
			}, function(response) {
				var data=response.data;
				busNumberlist = data;
				var results = new Array();
				$.each(data, function(index, value) {
					results.push(value.bus_number);
				})
				return process(results);
			}, 'json');
		},
		items : 15,
		matcher : function(item) {
			
			return true;
		},
		updater : function(item) {
			$.each(busNumberlist, function(index, value) {
				if (value.bus_number == item) {
					orderId = value.order_id;
					orderConfigId=value.order_config_id;
					$(elementId).attr("order_id", orderId);
					$(elementId).attr("order_config_id", orderConfigId);
					if (typeof (fn_backcall) == "function") {
						fn_backcall(value);
					}
				}
			})
			return item;
		}
	});
}

function getUserInfoByCard(cardId){
	var user;
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		async : false,
		url : "/MES_NA/common/getUserInfoByCard",
		data : {
			"card_no" : cardId
		},
		success : function(response) {
			var list = response.data;
			if (list.length > 0) {
				user = list[0];
			}
		}
	})
	return user;
}
// 根据url解析参数
function getUrlParams() {
    var search = window.location.search;
    var tmparray = search.substr(1, search.length).split("&");
    var paramsArray = new Array;
    if (tmparray !== null) {
        for (var i = 0; i < tmparray.length; i++) {
            var reg = /[=|^==]/; // 用=进行拆分，但不包括== 
            var set1 = tmparray[i].replace(reg, '&');
            var tmpStr2 = set1.split('&');
            var array = new Array;
            array[tmpStr2[0]] = tmpStr2[1];
            paramsArray.push(array);
        }
    }
    // 将参数数组进行返回 
    return paramsArray;
}

// 根据参数名称获取参数值 
function getParamValue(name) {
    var paramsArray = getUrlParams();
    if (paramsArray !== null) {
        for (var i = 0; i < paramsArray.length; i++) {
            for (var j in paramsArray[i]) {
                if (j === name) {
                    return decodeURI(paramsArray[i][j]);
                }
            }
        }
    }
    return null;
}

/**
function EnterPress(e){ //传入 event 
	var e = e || window.event; 
	if(e.keyCode == 13){ 
		console.log("EnterPress");
		//alert("-->EnterPress!!!" + $("#bus-search-input").val());
		//window.open("/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
		window.open("/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val(), '_blank').location;
		return false;
	} 
}**/

/**
 * 获取组织结构权限树树
 * treeId: ulid   <ul id="treeId" class="ztree"></ul>
 * level:设置第几层展开
 * orgType  组织结构类型
 * orgKind  
 */
function getOrgAuthTree(treeId,url,orgType,orgKind,level,nodeName_default){
	/*  ztree 配置信息 */
	// zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
	var setting = {
		data: {
			simpleData: {   // 简单的数据源，一般开发中都是从数据库里读取，API有介绍，这里只是本地的
			    enable: true,  
			    idKey: "id",  // id和pid，这里不用多说了吧，树的目录级别
			    pIdKey: "pId",  
			    rootPId: 0   // 根节点
			}
		},
		view: {
			fontCss : {
			}
		},
		callback: {
			beforeClick: zTreeBeforeClick,
			onClick: zTreeOnClick
		}
	};
	/*  ztree 配置信息 */
	if(!treeId){
		return null;
	}
	
	level = level || 1;
	orgType = orgType||"1,2,3,4,5,6";
	orgKind = orgKind||"0,1";
	
	zNodes=[];
	zTreeObj=null;
	$.ajax({
		url: "/MES_NA/common/getOrgAuthTree",
	    dataType: "json",
	    async: false,
	    type: "get",
	    data: {
	    	"orgType":orgType,
	    	"orgKind":orgKind,
	    	"url":url
	    },
	    success:function(response){
	    		//zNodes.push({id:1,pId:null,name:'第十九事业部'});
	    		if(response.data.length>0){
	    		    $.each(response.data, function (index, dept) {
	                    zNodes.push(
	                    		{id:dept.id,pId:dept.parent_id,name:dept.name,is_customer:dept.is_customer,org_type:dept.org_type,org_kind:dept.org_kind,displayName:dept.name}
	                    );
	                });
	                zTreeObj = $.fn.zTree.init(treeId, setting, zNodes);
	                var nodes = zTreeObj.getNodes();
	                var select_node=null;
	                if (nodes.length>0) {
	                	if(nodeName_default!=undefined&&nodeName_default.trim().length>0){
	                		select_node = zTreeObj.getNodeByParam("name", nodeName_default);
	                	}else{
	                		select_node=nodes[0];
	                	}
	                	zTreeObj.selectNode(select_node);
	                }
	                //zTreeObj.expandNode(nodes[0], true, false, true);
	                //zTreeObj.expandAll(true);
	                //ajaxQuery(nodes[0].id);
	                expandLevel(zTreeObj,select_node,level); 
	    		}else{
	    		      zNodes.push(
	                    		{id:0,pId:0,name:'无数据权限'}
	                    );
	    		      zTreeObj = $.fn.zTree.init(treeId, setting, zNodes);
	                  var nodes = zTreeObj.getNodes();
		                if (nodes.length>0) {
		                	zTreeObj.selectNode(nodes[0]);
		                }
	    		}
               
	    }
	});
}
/**
 * 设置展开树的按层次展开节点的方法
 * @param treeObj 树对象
 * @param node 树的跟节点
 * @param level 需要展开的层级
 */
function expandLevel(treeObj,node,level){  
    var childrenNodes = node.children;  
    if(level==1){
    	treeObj.expandNode(node, true, false, false);  
    	return false;
    }
    if(childrenNodes!=undefined&&childrenNodes.length>0){
    	for(var i=0;i<childrenNodes.length;i++)  
        {  
            treeObj.expandNode(childrenNodes[i], true, false, false);  
            level=level-1;  
            if(level>0)  
            {  
                expandLevel(treeObj,childrenNodes[i],level);  
            }  
        } 
    } 
}
/**
 * js 两个数字相加减消除进度损失
 * @param num1
 * @param num2
 * @returns
 */
function numAdd(num1, num2) {
	var baseNum, baseNum1, baseNum2;
	try {
	baseNum1 = num1.toString().split(".")[1].length;
	} catch (e) {
	baseNum1 = 0;
	}
	try {
	baseNum2 = num2.toString().split(".")[1].length;
	} catch (e) {
	baseNum2 = 0;
	}
	baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
	
	//alert((num1 * baseNum +"+"+ num2 * baseNum));
	return ((num1 * baseNum + num2 * baseNum) / baseNum).toFixed(2);
	}; 
	/**
	 * 判断staff是否已经在staff列表中存在 for ：工时维护时判断使用
	 */
	function isContain(staff,staffarr){
		var flag=false;
		$.each(staffarr,function(index,obj){
			if(obj.staff_number==staff.staff_number){
				flag=true;
				return;
			}
		})
		return flag;
	}
	
	function checkSalarySubmit(factory,workshop,month){
		var submit_flg="";
		$.ajax({
			url : "/MES_NA/common/getSubmitSalary",
			dataType : "json",
			data : {
				"factory":factory,
				"workshop":workshop,
				"month":month
			},
			type:"post",
			async:false,
			error : function(response) {
				//alert(response.message)
			},
			success : function(response) {
				if(response.data.length>0){
					submit_flg= "true";
				}else{
					submit_flg= "false";
				}
			}
		})
		return submit_flg;
	}
	
	function getChildOrgSelect(elementId,parentId,selectVal,selectType){
		$.ajax({
			url : "/MES_NA/common/getChildOrgList",
			dataType : "json",
			data : {
				"parentId" : parentId
			},
			async : false,
			error : function() {
				alertError();
			},
			success : function(response) {
				if (selectType == 'noall') {
					getSelects_noall(response.data, selectVal, elementId,"");
				} else if (selectType == 'empty') {
					getSelects_empty(response.data, selectVal, elementId,"");
				} else {
					getSelects(response.data, selectVal, elementId,"");
				}
			}
		})
	}
	
function getStaffInfo(staffNum){
	var staff;
	$.ajax({
		type : "get",// 使用get方法访问后台
		dataType : "json",// 返回json格式的数据
		async : false,
		url : "/MES_NA/common/getStaffInfo",
		data : {
			"staffNum" : staffNum
		},
		success : function(response) {
			var list = response.data;
			if (list.length > 0) {
				staff = list[0];
			}
		}
	})
	return staff;
}

function check_All_unAll(tableId, checkall) {
	if (checkall) {
		$(tableId + " tbody :checkbox").prop("checked", true);
		$(tableId + " tbody :disabled").prop("checked", false);
	} else {
		$(tableId + " tbody :checkbox").prop("checked", false);
	}
}

//使用公用邮箱发送邮件	
function sendEmail(mailTo,cc,title,thead,tbdatalist,content){
		$.ajax({
			url : "/MES_NA/common/sendEmail",
			dataType : "json",
			data : {
				"mailTo":mailTo,
				"cc":cc,
				"title":title,
				"thead":thead,
				"tbdatalist":tbdatalist,
				"content":content
			},
			type:"post",
			error : function(response) {
				//alert(response.message)
			},
			success : function(response) {
				
			}
		})
	}

function getRoleList(){
	var role_list=[];
	$.ajax({
		url : "/MES_NA/common/getRoleListAuth",
		dataType : "json",
		async:false,
		data : {
			
		},
		type:"post",
		error : function(response) {
			//alert(response.message)
		},
		success : function(response) {
			//alert(response.data.length)
			$.each(response.data,function(i,role){
				role_list.push(role.role_name);
			})
			
		}
	})
	return role_list;
}

	