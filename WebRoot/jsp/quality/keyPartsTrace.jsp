<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Bus Trace Initials</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet"
			href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet"
			href="../assets/css/fixedColumns.dataTables.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="../top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
				<ul class="breadcrumb">
					<li><i class="ace-icon fa fa-home home-icon"></i><a href="/MES/index">Index</a></li>
					<li><a href="#">Quality</a></li>
					<li class="active">Bus Trace Initials</li>
				</ul>
				<div class="nav-search" id="nav-search">
					<form class="form-search">
						<span class="input-icon">
							<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
						</span>
					</form>
				</div>
			</div>	
			<div class="page-content">
				<div class="page-content-area">
					<div class="well">
						<table>
							<tr>
								<td>Bus Type：</td>
								<td><select name="" id="search_bus_type" class="input-small carType"></select></td>
								<td>&nbsp;Project No.：</td>
								<td><input id="search_project_no"  style="width:120px" type="text" ></td>
<!-- 								<td>&nbsp;Plant：</td> -->
<!-- 								<td><select id="search_factory" class="form-control" style="width:100px"></select></td> -->
								<td>&nbsp;Bus No.：</td>
								<td><input id="search_busNumber"  style="width:150px" type="text" > </td>
								<td>
								    <input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="Search" style="margin-left: 10px;"></input>
								</td>
							</tr>
						</table>	
					</div>
					<div class="row" >
						<div class="col-xs-12 " id="scroll_div">
							<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
							</table>
						</div>
					</div>
				</div>
			</div>
			<div id="dialog-edit" class="hide" style="align:center;width:900px;height:600px">
				<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right" for="" >&nbsp;Bus No.：</label>
						<label id="bus_number" class="col-sm-4  no-padding-left"  style="margin-left:5px;"></label>
					</div>
				<div class = "div-dialog">
					<form id="form_edit">
						<table id="tableDataDetail" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 12px;" role="grid" aria-describedby="tableData_info">
						</table>
					</form>
				</div>
			</div>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div>
	</div>
	</body>
    <script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/ace-elements.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/alertMessage.js"></script>
	<script src="../js/quality/keyPartsTrace.js"></script>
</html>
