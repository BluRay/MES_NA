<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Testing Record</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />

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
						<li><a href="#">Quality</a></li>
						<li><a href="#">Testing Record</a></li>
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
					<form id="form" class="well form-search">
						<table>
							<tr>
								<td>Bus Type.：</td>
								<td>
									<select id="search_bus_type" class="input-medium carType" style="height: 30px;width:100px;" ></select>
								</td>
								<td>Bus No.：</td>
								<td>
                                    <input id="search_bus_number" class="input-medium" style="height: 30px;width:120px;" />										</td>
								<td>Project No.：</td>
								<td>
									<input id="search_project_no" class="input-medium" style="height: 30px;width:120px;" />		
								</td>	
								<td>Testing Type：</td>
								<td>
								    <select id="search_test_type_value" class="input-medium carType" style="height: 30px;width:100px;" ></select>
								<td>
								    <input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="Search" style="margin-left: 10px;"></input>						
									<input type="button" class="btn btn-sm btn-success" id="btnAdd" value="Add" style="margin-left: 2px;"></input>
								</td>
							</tr>
						</table>
					</form>
						
					<div class="row" >
					<div class="col-xs-12">
						<table id="tableResult" class="table table-striped table-bordered table-hover  " style="font-size: 12px;" >
						</table>	
					</div>
					</div>
				</div>

				<div id="dialog-config" class="hide" >
				    <div class="form-group">
						<label class="col-sm-2 control-label">*&nbsp;Bus No.：</label>
<!-- 						<div class="col-sm-2"> -->
						<label id="show_bus_number" class="col-sm-3 control-label"></label>
<!-- 							<input id="show_bus_number" type="text" class="input-medium" style="height: 30px;width:80%;" readonly="readonly"></input> -->
					</div>
					<div class="row" style="margin-top:20px;">
						<div class="col-xs-12" id="scroll_div" >
							<table id="tableDetail" class="table table-striped table-bordered table-hover " style="font-size: 12px;width:900px;overflow:auto;text-align:center" >
							</table>	
						</div>
					</div>
				</div>
			</div>		
		
		    <div id="dialog-add" class="hide">
				<form id="addForm" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;Bus No.:</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium" placeholder="" id="bus_number" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="workshop">*&nbsp;Testing Type:</label>
						<div class="col-sm-9">
							<select class="input-medium" id="testing_type_value" ></select>
						</div>
					</div>
					<div class="row" style="margin-top:20px;">
						<div class="col-xs-12">
							<table id="tableAddDetail" class="table table-striped table-bordered table-hover " style="font-size: 12px;width:755px;overflow:auto;text-align:center" >
							</table>	
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/ace-elements.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/alertMessage.js"></script>
	<script src="../js/quality/testingRecord.js"></script>
</body>
</html>