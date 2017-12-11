<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>MES</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../css/bootstrap.3.2.css">
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../css/bootstrap-table.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css">
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../css/common.css">
<style type="text/css" media="screen">
/* .myselect {
	border: 0px none;
	-moz-appearance: none;
	-webkit-appearance: none;
	font-size: 100%;
	margin-bottom: 3px;
	color: #555;
	background-color: #f5f5f5;
	width: 56px;
	padding: 0px;
	height: 27px;
	cursor: pointer;
	margin-left: -8px;
}

.header {
	padding-left: 12px;
	margin-top: 10px;
	margin-bottom: 0px;
	border-bottom: none;
} */
label {
    font-weight: 400;
    font-size: 13px;
    text-align:right;
}
</style>
<jsp:include page="../common.jsp"></jsp:include>
</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	<!-- 头 -->
	<%-- <jsp:include page="../top.jsp" flush="true" /> --%>
	<!-- 身 -->
	<div class="main-container" id="main-container" style="height:100%">
		<!-- 左边菜单 -->
		<%-- <jsp:include page="../left.jsp" flush="true" /> --%>
		<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
				<div class="breadcrumbs breadcrumbs-fixed" id="breadcrumbs">
					<ul class="breadcrumb" style="font-size:14px;">
					<li><a href="/MES/index_mobile"><i class="ace-icon fa fa-home home-icon bigger-160"></i>MES</a></li>
						<li><a href="#">Bus trace</a></li>
					</ul>
					<!-- /.breadcrumb -->
					<div class="nav-search" id="nav-search" style="margin-top: 5px;margin-right:10px;">
						<i id="btn_clear" class="ace-icon fa fa-refresh  red bigger-160" style="cursor:pointer;margin-right:20px;"></i>
						<i id="btn_save" class="ace-icon fa fa-floppy-o green bigger-160" style="cursor:pointer"></i>
					</div>
				</div>

				<div class="page-content" style="position:fixed;top:38px;bottom:10px;width:100%;overflow-y:auto;padding-left: 0px;padding-right:12px;">
					<form class="form-horizontal" id="scan_form">
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Bus No.:</label>
							<div class="col-xs-9">
								<!-- <input id="vinText"  type="text" class="input-medium" style="width:100%;height:30px;"/> -->
								<span class="input-icon input-icon-right" style="width: 100%;">
										<input id="bus_number" type="text" class="input-medium" style="width:100%;height:30px;">
										
								</span>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Plant:</label>
							<div class="col-xs-9">
								<select id="exec_factory" class="input-medium" style="width:100%" >
									<!-- <option value=''>请选择</option> -->
								</select>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Workshop:</label>
							<div class="col-xs-9">
								<select id="exec_workshop" class="input-medium" style="width:100%">
									<!-- <option value=''>请选择</option> -->
								</select>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right" style="text-align:right">Station:</label>
							<div class="col-xs-9">
								<select id="exec_station" class="input-medium" style="width:100%">
									<!-- <option value=''>请选择</option> -->
								</select>								
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Parts:</label>
							<div class="col-xs-9">
								<select id="key_parts" class="input-medium" style="width:100%">
									<!-- <option value=''>请选择</option> -->
								</select>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Part No:</label>
							<div class="col-xs-9">
								<input id="parts_no" type="text" class="input-medium" style="width:100%;height:30px;" disabled/>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">SAP No:</label>
							<div class="col-xs-9">
								<input id="sap_mat" type="text" class="input-medium" style="width:100%;height:30px;" disabled/>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Vendor:</label>
							<div class="col-xs-9">
								<input id="vendor" type="text" class="input-medium" style="width:100%;height:30px;" disabled/>
							</div>
						</div>
						
						<div class="form-group">
							<label class="col-xs-3 control-label no-padding-right">Batch:</label>
							<div class="col-xs-9">
								<input id="batch" type="text" class="input-medium" style="width:100%;height:30px;" />
							</div>
						</div>		
									
					</form>
				</div>
			<!-- /.main-container -->
		</div>
		
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/jquery.form.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/alertMessage.js"></script>
		<script src="../js/production/busTrace_Mobile.js"></script>
</div>
</body>
</html>