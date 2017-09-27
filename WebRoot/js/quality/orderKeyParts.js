var extArray = new Array(".xls");
var json_keyParts=null;
$(document).ready(function(){
	initPage();
	$("#btnQuery").on("click",function(){
		ajaxQuery();
	}); 

	$('#nav-search-input').bind('keydown', function(event) {
		if (event.keyCode == "13") {
			window.open("/MES/production/productionsearchbusinfo?bus_number=" + $("#nav-search-input").val());
			return false;
		}
	})
	$(document).on("input","#search_order_no",function(){
		//alert("change");
		$("#search_order_no").attr("order_id","");
	})
	$("#search_order_no").change(function(){
		getOrderConfigSelect($(this).attr("order_id")||"","","#search_order_config","全部","id") ;
	})

})

function initPage(){
	getBusNumberSelect('#nav-search-input');
	getBusTypeSelect('','#search_bus_type','全部','id');
	getOrderNoSelect("#search_order_no","#orderId",null,$('#search_bus_type').val());
	ajaxQuery();
}



function drawKeyPartsTable(tableId,data){
	$(tableId).dataTable({
		paiging:false,
		ordering:false,
		searching: false,
		autoWidth:false,
		destroy: true,
		paginate:false,
		//sScrollY: $(window).height()-250,
		scrollX: true,
		scrollCollapse: false,
		lengthChange:false,
		orderMulti:false,
		info:false,
		language: {
			emptyTable:"",					     
			infoEmpty:"",
			zeroRecords:"请导入关键零部件！"
		},
		columnDefs: [{
            "searchable": false,
            "orderable": false,
            "targets": 0
        }],
		data:data||{},
		columns: [
		            {"title":"物料编码","class":"center","data":"sap_mat","defaultContent": ""},
		            {"title":"零部件编号","class":"center","data":"parts_no","defaultContent": ""},
		            {"title":"零部件名称","class":"center","data": "parts_name","defaultContent": ""},
		            {"title":"材料/规格","class":"center","data":"size","defaultContent": ""},		            	            
		            {"title":"供应商名称","class":"center","data": "vendor","defaultContent": ""},
		            {"title":"装配车间","class":"center","data":"workshop","defaultContent":""},
		            {"title":"工序","class":"center","data":"process","defaultContent": ""},	
		            {"title":"3C件","class":"center","data":"ccc","defaultContent": "","width":"6%"},
		            {"title":"3C编号","class":"center","data":"cccNo","defaultContent": ""},	
		          ]	
	});
}

function ajaxQuery(){
/*	$('#scroll_div').ace_scroll({
		height: $(window).height()-250,
		mouseWheelLock: true,
		alwaysVisible : false
	});*/
	$("#tableResult").DataTable({
		serverSide: true,
		paiging:true,
		ordering:false,
		searching: false,
		bAutoWidth:false,
/*		fixedColumns:   {
            leftColumns: 0,
            rightColumns:1
        },*/
	/*	sDom: 'r<"H"lf><"datatable-scroll"t><"F"ip>',*/
		destroy: true,
		sScrollY: $(window).height()-250,
		scrollX: true,
		pageLength: 20,
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
					"bus_type_id":$("#search_bus_type").val(),
					"order_id":$("#search_order_no").attr("order_id"),
					"order_config_id":$("#search_order_config").val()
				};
            param.length = data.length;//页面显示记录条数，在页面显示每页显示多少项的时候
            param.start = data.start;//开始的记录序号
            param.page = (data.start / data.length)+1;//当前页码

            $.ajax({
                type: "post",
                url: "getOrderKeyPartsList",
                cache: false,  //禁用缓存
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
                    //console.log(returnData);
                    //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                    //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                    callback(returnData);

                }
            });
		
		},
		columns: [
		          	{"title":"车型","class":"center","data":"bus_type","defaultContent": ""},
		            {"title":"订单","class":"center","data":"order_desc","defaultContent": ""},
		            {"title":"配置","class":"center","data":"order_config_name","defaultContent": ""},
		            {"title":"备注","class":"center","data":"memo","defaultContent": ""},
		            {"title":"维护人","class":"center","data": "editor","defaultContent": ""},
		            {"title":"维护时间","class":"center","data":"edit_date","defaultContent": ""},		            	            
		            {"title":"操作","class":"center","data":"order_id","render":function(data,type,row){
		            	return "<i class=\"glyphicon glyphicon-search bigger-130 showbus\" title='查看' onclick = 'showInfoPage(" + JSON.stringify(row)+");' style='color:blue;cursor: pointer;'></i>&nbsp;&nbsp;&nbsp;"+ 
		            	"<i class=\"ace-icon fa fa-upload bigger-130 editorder\" title='导入' onclick = 'showEditPage(" + JSON.stringify(row)+ ");' style='color:green;cursor: pointer;'></i>";
		            	}
		            }
		          ]
	});

}

function showEditPage(row){
		$("#order").html(row.order_desc);
		$("#order_config").html(row.order_config_name);
		var bus_type_id=row.bus_type_id;
		var order_id=row.id;
		var order_config_id=row.config_id;
		
		drawKeyPartsTable("#keyPartsTable");
		var dialog = $( "#dialog-config" ).removeClass('hide').dialog({
			width:1100,
			height:550,
			modal: true,
			title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 订单关键零部件导入</h4></div>",
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
						ajaxAdd(order_id,order_config_id,bus_type_id); 
					} 
				}
			]
		});
}

function showInfoPage(row){
	$("#order_view").html(row.order_desc);
	$("#order_config_view").html(row.order_config_name);
	var bus_type_id=row.bus_type_id;
	var order_id=row.id;
	var order_config_id=row.config_id;
	var param={};
	param.order_id=order_id;
	param.order_config_id=order_config_id;
	param.bus_type_id=bus_type_id;
	
	$.ajax({
		type: "post",
        url: "getKeyPartsList",
        cache: false,  //禁用缓存
        data: param,  //传入组装的参数
        dataType: "json",
        success: function (response) {
        	drawKeyPartsTable("#keyPartsTable_view",response.data);
        }
	});
	
	//show dialog
	var dialog = $( "#dialog-config-view" ).removeClass('hide').dialog({
		width:1100,
		height:550,
		modal: true,
		title: "<div class='widget-header widget-header-small'><h4 class='smaller'><i class='ace-icon glyphicon glyphicon-list-alt' style='color:green'></i> 订单关键零部件查看</h4></div>",
		title_html: true,
		buttons: [ 
			/*{
				text: "取消",
				"class" : "btn btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			},*/
			{
				text: "关闭",
				"class" : "btn btn-primary btn-minier",
				click: function() {
					$( this ).dialog( "close" ); 
				} 
			}
		]
	});
}
/**
 * 上传导入
 */
function upload(form,file){
	if (file == "") {
		alert("请选择文件！");
		return false;
	}
	allowSubmit = false;
	if (!file)
		return;
	while (file.indexOf("\\") != -1)
		file = file.slice(file.indexOf("\\") + 1);
		ext = file.slice(file.indexOf(".")).toLowerCase();
	for (var i = 0; i < extArray.length; i++) {
		if (extArray[i] == ext) {
			allowSubmit = true;
			break;
		}
	}
	if (allowSubmit) {
		$("#uploadForm").ajaxSubmit({
			dataType : "json",
			type : 'post', // 提交方式 get/post
			url : 'uploadKeyPartsFile', // 需要提交的 url
			data : {
				
			},
			success : function(response) {
				//alert(response.data);
				json_keyParts=response.data;
				if(response.success){
					drawKeyPartsTable("#keyPartsTable",response.data);
				}else{
					alert(response.message)
				}
				$("#uploadForm").resetForm();
			}
		})	
	}
}

function ajaxAdd(order_id,order_config_id,bus_type_id){
	if(json_keyParts.length==0){
		alert("请上传关键零部件明细！");
		return false;
	}
	
	$.ajax({
		url:"saveKeyParts",
		type:"post",
		dataType:"json",
		data:{
			order_id:order_id,
			order_config_id:order_config_id,
			bus_type_id:bus_type_id,
			parts_detail:JSON.stringify(json_keyParts)
		},
		success:function(response){
			if(response.success){
				alert(response.message);
				ajaxQuery();
				$( "#dialog-config" ).dialog("close");
			}else{
				alert(response.message);
			}
		}
	})
}; 

