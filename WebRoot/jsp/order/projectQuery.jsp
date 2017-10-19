<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Project Query</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<!-- <link rel="stylesheet" href="../css/bootstrap.3.2.css">	 -->
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<!-- <link rel="stylesheet" href="../css/bootstrap-table.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css"> -->
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css"  >
<link rel="stylesheet" href="../assets/css/buttons.dataTables.css" /> 

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
				<div class="breadcrumbs ace-save-state" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a
							href="/BMS/index">Index</a></li>
						<li class="active">Project Management</li>
						<li class="active">Search</li>
					</ul>
					<!-- /.breadcrumb -->

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div>
					<!-- /.nav-search -->
				</div>

				<div class="page-content">
					<div id="form" class="well form-search">
						<table>
							<tr>
								<td>Project No.：</td>
								<td>
									<input type="text" style="height: 30px;" class="input-medium revise" value="" id="search_project_no" />
								</td>
								<td>Status：</td>
								<td>
									<select name="" id="search_status" class="input-small">
										<option value="">All</option>
										<option value="0">Created</option>
										<option value="1">In Process</option>
										<option value="2">Completed</option>
									</select>
								</td>
								<td>Year：</td>
								<td>
									<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({el:'search_productive_year',dateFmt:'yyyy'});" type="text">
								</td>
								<td>Plant：</td>
								<td>
									<select name="" id="search_plant" class="input-small"></select>
								</td>
								<td>
									<input type="button" class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search" style="margin-left: 2px;"></input>
								</td>
							</tr>
						</table>
					</div>

					<div class="row">
						<div class="col-xs-12" style="width: calc(100vw + 20px)">
							<table id="tableOrder" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1900px;overflow-x:auto;padding-right: 20px;table-layout:fixed">
						</table>
						</div>
					</div>
				</div>

				<div id="dialog-config" class="hide" > <!-- style="width: calc(100vw + 10px)" -->
				    <table id="tableBom" style="font-size: 12px;width:1100px;overflow-x:auto" class="table table-bordered table-striped">
					</table>
				</div>
				<div id="dialog-message" class="hide">   <!-- style="width: calc(100vw + 10px)"-->
					<table id="tableBusNumber" style="font-size: 12px;width:1100px;overflow-x:auto" class="table table-bordered table-striped">
					</table>
				</div>
				
				
			</div>
			<!-- /.main-container -->
		</div>
	</div>	
	<script>
		var $table = $('#table'),$remove = $('#remove'),selections = [];
	</script>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>
	<script src="../assets/js/jszip.min.js"></script>
	<script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>
<!-- 	<script src="../assets/js/buttons.flash.js"></script>  -->
	<!-- <script src="../js/bootstrap-table.js"></script> -->
	<script src="../js/common.js"></script>
	<!-- <script src="../js/bootstrapInit.js"></script>	 -->
	<script src="../js/order/projectQuery.js"></script>

<style type="text/css">
.table{
    table-layout: fixed;
}
.fixed-table-toolbar .bs-bars, .fixed-table-toolbar .search, .fixed-table-toolbar .columns {
    position: absolute;
	margin-top: -8px;
	right: 15px;
	top: -45px;
}
.btn-default {
	height:35px;
	background-color: transparent;
	border-color: transparent;

}
.bootstrap-table .btn{
		color:#393939;
}

/* .table > thead > tr > th {
    vertical-align: bottom;
    border-bottom: 1px solid #ddd;
} */
.btn-group > .btn > .caret {
	margin-top: 0px;
	border-width: 0px;
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 0px;
    vertical-align: middle;
    border-top: 4px solid;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
}
</style>
</body>

</html>
