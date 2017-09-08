<%@ page contentType="text/html;charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html lang="en">
	<head>
		<title>流程状态</title>
		<link rel="stylesheet" href="${ctx}/snaker/css/style.css" type="text/css" media="all" />
		<link rel="stylesheet" href="${ctx}/snaker/css/snaker.css" type="text/css" media="all" />
		<script src="${ctx}/snaker/raphael-min.js" type="text/javascript"></script>
		<script src="${ctx}/snaker/jquery-ui-1.8.4.custom/js/jquery.min.js" type="text/javascript"></script>
		<script src="${ctx}/snaker/jquery-ui-1.8.4.custom/js/jquery-ui.min.js" type="text/javascript"></script>
		<script src="${ctx}/snaker/snaker.designer.js" type="text/javascript"></script>
		<script src="${ctx}/snaker/snaker.model.js" type="text/javascript"></script>
		<script src="${ctx}/snaker/snaker.editors.js" type="text/javascript"></script>

<script type="text/javascript">
    function addTaskActor(taskName) {
        var url = '${ctx}/snaker/task/actor/add?orderId=${orderId}&taskName=' + taskName;
        var returnValue = window.showModalDialog(url,window,'dialogWidth:1000px;dialogHeight:600px');
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
	}
</script>
</head>
	<body>
		<table class="properties_all" align="center" border="1" cellpadding="0" cellspacing="0" style="margin-top: 0px">
			<div id="snakerflow" style="border: 1px solid #d2dde2; margin-top:10px; margin-left:10px; margin-bottom:10px; width:98%;">
			</div>
		</table>
		<script type="text/javascript">
		$.ajax({
				type:'GET',
				url:"${ctx}/snaker/process/json",
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
		</script>
	</body>
</html>
