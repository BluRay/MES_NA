<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
	<meta charset="utf-8"/>
		<title>流程展现</title>
		<link rel="stylesheet" href="../../snaker/css/snaker.css" type="text/css" media="all" />
		<script src="../../snaker/raphael-min.js" type="text/javascript"></script>
		<script src="../../snaker/jquery-ui-1.8.4.custom/js/jquery.min.js" type="text/javascript"></script>
		<script src="../../snaker/jquery-ui-1.8.4.custom/js/jquery-ui.min.js" type="text/javascript"></script>
		<script src="../../snaker/snaker.designer.js" type="text/javascript"></script>
		<script src="../../snaker/snaker.model.js" type="text/javascript"></script>
		<script src="../../snaker/snaker.editors.js" type="text/javascript"></script>
		<script type="text/javascript">
			$(function() {
				var json="${process }";
				var model;
				if(json) {
					//json.replace(new RegExp("@@","gm"), "\"")
					model=eval("(" + json + ")");
				} else {
					model="";
				}
				$('#snakerflow').snakerflow({
					basePath : "../../snaker/",
                    ctxPath : "",
					restore : model,
                    formPath : "forms/",
					tools : {
						save : {
							onclick : function(data) {
								saveModel(data);
							}
						}
					}
				});
			});
			
			function saveModel(data) {
				var processId = "${processId}";
				alert(data);
				$.ajax({
					type:'POST',
					url:"deployXml",
					data:{"model":encodeURIComponent(data),
						"id":	processId},
					dataType:"json",
					async: false,
					globle:false,
					error: function(){
						alert('数据处理错误！');
						return false;
					},
					success: function(data){
						if(data == true) {
							window.location.href = "list";
						} else {
							alert('数据处理错误！');
						}
					}
				});
			}
		</script>					
</head>
<body>
<div id="toolbox">
<div id="toolbox_handle">工具集</div>
<div class="node" id="save"><img src="../../snaker/images/save.gif" />&nbsp;&nbsp;保存</div>
<div>
<hr />
</div>
<div class="node selectable" id="pointer">
    <img src="../../snaker/images/select16.gif" />&nbsp;&nbsp;Select
</div>
<div class="node selectable" id="path">
    <img src="../../snaker/images/16/flow_sequence.png" />&nbsp;&nbsp;transition
</div>
<div>
<hr/>
</div>
<div class="node state" id="start" type="start"><img
	src="../../snaker/images/16/start_event_empty.png" />&nbsp;&nbsp;start</div>
<div class="node state" id="end" type="end"><img
	src="../../snaker/images/16/end_event_terminate.png" />&nbsp;&nbsp;end</div>
<div class="node state" id="task" type="task"><img
	src="../../snaker/images/16/task_empty.png" />&nbsp;&nbsp;task</div>
<div class="node state" id="task" type="custom"><img
	src="../../snaker/images/16/task_empty.png" />&nbsp;&nbsp;custom</div>
<div class="node state" id="task" type="subprocess"><img
	src="../../snaker/images/16/task_empty.png" />&nbsp;&nbsp;subprocess</div>
<div class="node state" id="fork" type="decision"><img
	src="../../snaker/images/16/gateway_exclusive.png" />&nbsp;&nbsp;decision</div>
<div class="node state" id="fork" type="fork"><img
	src="../../snaker/images/16/gateway_parallel.png" />&nbsp;&nbsp;fork</div>
<div class="node state" id="join" type="join"><img
	src="../../snaker/images/16/gateway_parallel.png" />&nbsp;&nbsp;join</div>
</div>

<div id="properties">
<div id="properties_handle">属性</div>
<table class="properties_all" cellpadding="0" cellspacing="0">
</table>
<div>&nbsp;</div>
</div>

<div id="snakerflow"></div>
</body>
</html>
