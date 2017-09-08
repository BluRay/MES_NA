<!-- <!DOCTYPE html> -->
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%String path = request.getContextPath();String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 订单内部评审</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/jquery.gritter.css" />
<%-- <link rel="stylesheet" href="<%=basePath%>/assets/css/ace.min.css" id="main-ace-style" /> --%>
<link rel="stylesheet" href="<%=basePath%>/snaker/css/style.css" type="text/css" media="all" />
<link rel="stylesheet" href="<%=basePath%>/snaker/css/snaker.css" type="text/css" media="all" />
</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	<!-- 头 -->
	<jsp:include page="../top.jsp" flush="true" />
	<!-- 身 -->
	<div class="main-container" id="main-container">
		<!-- 左边菜单 -->
		<jsp:include page="../left.jsp" flush="true" />
		<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="main-content-inner">
				<div class="breadcrumbs ace-save-state  breadcrumbs-fixed" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">订单导入</a></li>
						<li class="active">内部评审</li>
					</ul>
					<!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon"> <input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div>
					<!-- /.nav-search -->
				</div>

				<div class="page-content">
					<!--  div id="form" class="well form-search">-->
						<table class="table table-striped table-bordered table-hover dataTable no-footer"
				               style="font-size: 14px;" >
							<tr>
								<td>订单编号：</td>
								<td id="orderNo"></td>
								<td>客户：</td>
								<td id="customer"></td>
								<td>生产工厂：</td>
								<td id="factoryName"></td>
							</tr>
							<tr>
								<td>生产数量：</td>
								<td id="productionQty"></td>
								<td>交付日期：</td>
								<td id="deliveryDate"></td>
								<td>产能/天：</td>
								<td id="capacity"></td>
								
							</tr>
						</table>
	                    <div id="snakerflow" style="border: 1px solid #d2dde2; margin-top:8px; margin-left:1px; margin-bottom:8px; width:100%;height:65px">
				        </div>
					<div class="row">
						<div class="col-xs-12">
<!-- 							<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;"> -->
								
<!-- 							</table> -->
<!-- 							<div id="tabs" class="widget-box widget-color-blue2" style="height:420px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto"> -->
<!-- 						        <ul> -->
<!-- 						        </ul> -->
<!-- 						    </div> -->
						    <div class="controls">
								<div style="width: 100%">
									<ul class="nav nav-tabs" id="new_tab" role="tablist">
										<li class="active"><a href="" data-toggle="tab"
										style="font-size: 0px; color: #333">##</a></li>
									</ul>
								</div>
								<div class="tab-content" id="new_accordion">
	
								</div>
							</div>
						</div>
					</div>
                </div>
			</div>
		</div>
		<!-- /.main-container -->
	</div>
	<script src="../../assets/js/jquery-ui.min.js"></script>
	<script src="../../js/jsrender.min.js"></script>
	<script src="../../js/common.js"></script>
	<script src="../../js/browser.js"></script>
<!--     <script src="../../assets/js/ace-elements.min.js"></script> -->
    <script src="<%=basePath%>/snaker/raphael-min.js" type="text/javascript"></script>
	<script src="<%=basePath%>/snaker/snaker.designer.js" type="text/javascript"></script>
	<script src="<%=basePath%>/snaker/snaker.model.js" type="text/javascript"></script>
	<script type="text/javascript">
	//$(document).ready(function(){
		var tabs;
	    var taskName = "${task.taskName}";
	    var orderNo="${orderNo}";
	    var factoryId="${factoryId}";
	    // 加载订单明细
	    $.ajax({
			type:'GET',
			url:"/BMS/snaker/process/json",
			data:"processId=${processId}&orderId=${orderId}",
			async: false,
			globle:false,
			error: function(){
				alert('数据处理错误！');
				return false;
			},
			success: function(data){
				data = eval("(" + data + ")");
				display(data.process, data.active);
			}
		});
	    queryOrderInfo(orderNo,factoryId);
	    $.ajax({
			type:'GET',
			url:"/BMS/snaker/flow/node",
			data:{"processId":"${processId}"},
			async: false,
			globle:false,
			error: function(){
				alert('数据处理错误！');
				return false;
			},
			success: function(data) {
				data = eval(data);
				var curTab; 
				var iscurrent = false;
				for(var i = 0; i < data.length; i++) {
 					var node = data[i];
					var iframeUrl = '/BMS'+node.form + '?processId=${processId}&orderId=${orderId}&reviewOrderId=${reviewOrderId}&factoryId=${factoryId}&reviewResultId=${reviewResultId}&taskName=' + node.name;
		
					if(taskName == node.name || (taskName == '' && i == 0)) {
						iscurrent = true;
						iframeUrl += '&taskId=${taskId}&readonly=1';
					} else {
						iscurrent = false;
						iframeUrl += '&readonly=0';
					}
                    if(iscurrent) {
		            	curTab = "new_task"+i;
		            }
					$("#new_tab").find("li").removeClass("active");
					$("#new_accordion").find("div").removeClass("active");
					
					var tabli="<li class='new_task"+i+"'><a href='#new_task"+i+"' data-toggle='tab' style='font-size: 14px; color: #333;display:inline-block'><span>"+node.displayName+"</span>"
					+"</a></li>";
					
					$("#new_tab li:eq("+i+")").before(tabli);
					
					var tabContent="<div class=\"tab-pane\" role=\"tabpanel\" style=\"height:300px\" id=\"new_task"+i+"\">";
					tabContent+="<iframe src="+iframeUrl+" style=\"width:100%;height:100%;frameborder:no;border:0;scrolling:no\"></iframe>";
					tabContent+="</div>";
	
					$(tabContent).appendTo($("#new_accordion"));
					
				}
				$("#"+curTab).addClass("active");
				$("."+curTab).addClass("active");
			}
		});
	    
	    $('#loading-btn').on(ace.click_event, function () {
			var btn = $(this);
			btn.button('loading')
			setTimeout(function () {
				btn.button('reset')
			}, 2000)
		});
	
		$('#id-button-borders').attr('checked' , 'checked').on('click', function(){
				$('#default-buttons .btn').toggleClass('no-border');
		});
	//});
	function queryOrderInfo(orderNo,factoryId){
		$.ajax({
			type:'GET',
			url:"/BMS/order/review/showOrderDetailList",
			data:{
				"search_order_no":orderNo,
				"search_factory":factoryId
				},
			async: false,
			dataType: "json",
			error: function(){
				alert('数据处理错误！');
				return false;
			},
			success: function(response) {
			
				$.each(response.data,function(index,value){
		
					if(index==0){
						$("#orderNo").text(value.order_no+" "+value.order_name);
						$("#factoryName").text(value.factory_name);
						$("#productionQty").text(value.production_qty);
						$("#deliveryDate").text(value.delivery_date);
						$("#capacity").text(value.capacity);
						$("#customer").text(value.customer);
					}
				});
			}
		});
	}
	function addTaskActor(taskName) {
    	alert("qq");
        var url = '${ctx}/snaker/task/actor/add?orderId=${orderId}&taskName=' + taskName;
        var returnValue = window.showModalDialog(url,window,'dialogWidth:500px;dialogHeight:300px');
        if(returnValue) {
            $('#currentActorDIV').append(',' + returnValue);
        }
    }
	function display(process, active) {
		/** view*/
		$('#snakerflow').snakerflow($.extend(true,{
			basePath : "${ctx}/snaker/",
            ctxPath : "${ctx}",
            orderId : "${orderId}",
			restore : eval('(' + process + ')')
			,
			editable : false
			},eval("(" + active + ")")
		));
		$("svg").attr("width",1100);
		$("svg").attr("height",350);
	}
	</script>
</body>

</html>
