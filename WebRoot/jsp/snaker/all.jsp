<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ include file="../common.jsp"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>模板</title>

		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

		<!-- bootstrap & fontawesome -->
		<link rel="stylesheet" href="${ctx}/assets/css/bootstrap.min.css" />
		<link rel="stylesheet" href="${ctx}/assets/css/font-awesome.min.css" />

		<!-- page specific plugin styles -->

		<!-- text fonts -->
		<link rel="stylesheet" href="${ctx}/assets/css/ace-fonts.css" />

		<!-- ace styles -->
		<link rel="stylesheet" href="${ctx}/assets/css/ace.min.css" id="main-ace-style" />

		<!--[if lte IE 9]>
			<link rel="stylesheet" href="assets/css/ace-part2.min.css" />
		<![endif]-->
		<link rel="stylesheet" href="${ctx}/assets/css/ace-skins.min.css" />
		<link rel="stylesheet" href="${ctx}/assets/css/ace-rtl.min.css" />

		<!--[if lte IE 9]>
		  <link rel="stylesheet" href="assets/css/ace-ie.min.css" />
		<![endif]-->

		<!-- inline styles related to this page -->

		<!-- ace settings handler -->
		<script src="${ctx}/assets/js/ace-extra.min.js"></script>

		<!-- HTML5shiv and Respond.js for IE8 to support HTML5 elements and media queries -->

		<!--[if lte IE 8]>
		<script src="assets/js/html5shiv.min.js"></script>
		<script src="assets/js/respond.min.js"></script>
		<![endif]-->
	
		<link rel="stylesheet" href="${ctx}/snaker/css/style.css" type="text/css" media="all" />
    	<link rel="stylesheet" href="${ctx}/snaker/CleverTabs/context/themes/base/style.css" type="text/css" />
    	<link rel="stylesheet" href="${ctx}/snaker/CleverTabs/context/themes/base/jquery-ui.css" type="text/css" />
	    <script src="${ctx}/snaker/CleverTabs/scripts/jquery.js" type="text/javascript"></script>
	    <script src="${ctx}/snaker/CleverTabs/scripts/jquery-ui.js" type="text/javascript"></script>
	    <script src="${ctx}/snaker/CleverTabs/scripts/jquery.contextMenu.js" type="text/javascript"></script>
	    <script src="${ctx}/snaker/CleverTabs/scripts/jquery.cleverTabs.js" type="text/javascript"></script>
		
	<script type="text/javascript">
        var tabs;
        var taskName = "${task.taskName}";
        $(function () {
            tabs = $('#tabs').cleverTabs();
            $(window).bind('resize', function () {
                tabs.resizePanelContainer();
            });
            var diagramTab = tabs.add({
            	url: '${ctx}/snaker/process/diagram?processId=${processId}&orderId=${orderId}',
            	label: '流程图',
            	locked: true
            });
            diagramTab.activate();
            $.ajax({
				type:'GET',
				url:"${ctx}/snaker/flow/node",
				data:"processId=${processId}",
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
						var iframeUrl = '${ctx}' + node.form + '?processId=${processId}&orderId=${orderId}&taskName=' + node.name;
						if(taskName == node.name || (taskName == '' && i == 0)) {
							iscurrent = true;
							iframeUrl += '&taskId=${taskId}&readonly=1';
						} else {
							iscurrent = false;
							iframeUrl += '&readonly=0';
						}
			            var tab = tabs.add({
			                url: iframeUrl,
			                label: node.displayName,
			                locked: true
			            });
			            tab.activate();
			            if(iscurrent) {
			            	curTab = tab;
			            	tab.mark();
			            }
					}
					if(curTab) curTab.activate();
				}
			});
        });
    	</script>
	</head>

	<body class="no-skin">
		<!-- 头 -->
		<jsp:include page="../top.jsp" flush="true"/>

		<!-- 身 -->
		<div class="main-container" id="main-container">
			<script type="text/javascript">
				try{ace.settings.check('main-container' , 'fixed')}catch(e){}
			</script>

			<!-- #section:basics/sidebar -->
			<div id="sidebar" class="sidebar                  responsive">
				<script type="text/javascript">
					try{ace.settings.check('sidebar' , 'fixed')}catch(e){}
				</script>

				<div class="sidebar-shortcuts" id="sidebar-shortcuts">
					<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
						<button class="btn btn-success">
							<i class="ace-icon fa fa-signal"></i>
						</button>

						<button class="btn btn-info">
							<i class="ace-icon fa fa-pencil"></i>
						</button>

						<!-- #section:basics/sidebar.layout.shortcuts -->
						<button class="btn btn-warning">
							<i class="ace-icon fa fa-users"></i>
						</button>

						<button class="btn btn-danger">
							<i class="ace-icon fa fa-cogs"></i>
						</button>

						<!-- /section:basics/sidebar.layout.shortcuts -->
					</div>

					<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
						<span class="btn btn-success"></span>

						<span class="btn btn-info"></span>

						<span class="btn btn-warning"></span>

						<span class="btn btn-danger"></span>
					</div>
				</div><!-- /.sidebar-shortcuts -->

				<!-- 左边菜单 -->
				<jsp:include page="../left.jsp" flush="true"/>

				<!-- #section:basics/sidebar.layout.minimize -->
				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>

				<!-- /section:basics/sidebar.layout.minimize -->
				<script type="text/javascript">
					try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
				</script>
			</div>

			<!-- 主体 -->
			<div class="main-content">
			
			<!-- <jsp:include page="../path.jsp" flush="true"/> -->
				
				<div class="page-content">
							<jsp:include page="../settings.jsp" flush="true"/>
		
							<!-- /section:settings.box -->
							<div class="page-content-area">
							
							<!-- 东西放这里！ -->
				<table border="0" width=100% align="center">
		    		<tr>
		        		<td align="center" class="snaker_title">${process.displayName }
		        			<hr width=100% size=2 color="#71B2CF">
		        		</td>
		    		</tr>
				</table>
				<c:if test="${order != null }">
				<table border="0" width=98% align="center" style="margin-top:5">
		    		<tr>
		        		<td align="left">
		        			<font color="blue">编号：</font><font color="#800080">${order.orderNo }</font> &nbsp;
		        			<font color="blue">派单时间：</font><font color="#800080">${order.createTime }</font>&nbsp;
						</td>
					</tr>
				</table>
				</c:if>
			    <div id="tabs" style="margin: 0px;height: 100%">
			        <ul>
			        </ul>
			    </div>
			    
			    
					
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<!-- <jsp:include page="../footer.jsp" flush="true"/> -->
			
		</div><!-- /.main-container -->
		</div>
		<!-- basic scripts -->

		<!--[if !IE]> -->
		<script type="text/javascript">
			window.jQuery || document.write("<script src='${ctx}/assets/js/jquery.min.js'>"+"<"+"/script>");
		</script>

		<!-- <![endif]-->

		<script type="text/javascript">
			if('ontouchstart' in document.documentElement) document.write("<script src='${ctx}/assets/js/jquery.mobile.custom.min.js'>"+"<"+"/script>");
		</script>
		<script src="${ctx}/assets/js/bootstrap.min.js"></script>

		<!-- page specific plugin scripts -->

		<!-- ace scripts -->
		<script src="${ctx}/assets/js/ace-elements.min.js"></script>
		<script src="${ctx}/assets/js/ace.min.js"></script>

		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {
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
			})
		</script>
	</body>
</html>
