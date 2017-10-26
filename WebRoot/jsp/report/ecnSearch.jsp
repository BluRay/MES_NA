<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
String staff_number=(String)session.getAttribute("staff_number");
String user_name=(String)session.getAttribute("display_name");
%>	
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>ECN Search</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../css/bootstrap-multiselect.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/buttons.dataTables.css" /> 
<style>
	.multiselect {
	height:30px;
	font-size:13px;
	}
</style>
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
							href="/MES/index">Index</a></li>
						<li><a href="#">Report</a></li>
						<li><a href="#">ECN Search</a></li>
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
								<td>ECN No.：</td>
								<td>
									<input style="height: 30px;width:120px;" type="text" class="input-medium revise" id="search_ecn_no" />
								</td>
								<td>&nbsp;Items.：</td>
								<td>
									<input style="height: 30px;width:150px;" type="text" class="input-medium revise" id="search_items" />
								</td>
								<td>&nbsp;Status：</td>
								<td>
									<select id="search_status" class="input-medium" style="height: 30px;width:90px;" >
										<option value='All'>All</option>
										<option value='1'>Created</option>
										<option value='2'>In Process</option>
										<option value='3'>Completed</option>
									</select>
								</td>
<!-- 								<td>Date：</td> -->
<!-- 								<td> -->
<!-- 									<input id="search_date_start" class="input-medium" style="width:90px" onclick="WdatePicker({language:'en_us',dateFmt:'yyyy-MM-dd'})" type="text">	 -->
<!-- 									- -->
<!-- 									<input id="search_date_end" class="input-medium" style="width:90px" onclick="WdatePicker({language:'en_us',dateFmt:'yyyy-MM-dd'})" type="text">						 -->
<!-- 								</td>							 -->
								<td>
									<input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="Search" style="margin-left: 2px;"></input>											
								</td>
							</tr>

						</table>
					</form>
						
					<div class="row">
					<div class="col-xs-12">
						<table id="tableResult"
							class="table table-striped table-bordered table-hover" style="font-size: 12px;overflow-x:auto ">
						</table>	
					</div>
					</div>
				</div>

			<div id="dialog-config_confirm" class="hide">
				<div id="config_form" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="">ECN NO.：</label>
						<div class="col-sm-8">						
							<input disabled="disabled" class="input-medium" style="width:100%;height:30px;" id="ecn_no" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="">Items：</label>
						<div class="col-sm-8">						
							<textarea disabled="disabled" class="input-medium" style="width:100%;resize: none;" id="items" rows="1" >
							</textarea>
						</div>
					</div>
					<div class="form-group">					
						<div class="col-sm-12">
							<table id='tb_bus_list' class="table table-striped table-bordered"></table>
						</div>
					</div>	
				</div>					
			</div>
			<input type='hidden' id='staff_number' value="<%=staff_number%>" />
			<input type='hidden' id='user_name' value="<%=user_name%>" />
		</div>
		
		</div>
			<!-- /.main-container -->
		</div>
	
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../js/bootstrap-multiselect.min.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>
	<script src="../assets/js/jszip.min.js"></script>
	<script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/report/ecnSearch.js"></script>
</body>

</html>
