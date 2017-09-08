<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>等待工时维护</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../css/zTreeStyle/metro.css"
	type="text/css">
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
							href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li><a href="#">等待工时维护</a></li>
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
					<div class="row">
						<div id="zztree" class="col-xs-2" style="position: relative; left: 0; float: left; border: 1px solid #ccebf8; overflow: auto;color:#616161">
							<ul id="workGroupTree" class="ztree" style="padding-left:0px;"></ul>
						</div>
						<div class="col-xs-10">
							<div class="row">
								<form id="form" class="well form-search " style="margin-left: 12px;">
									 <table>
										<tr>
											<td>等待日期：</td>
											<td><input id="wait_date" placeholder="开始时间..." style="height: 30px;width:100px" type="text" onClick="WdatePicker({el:'wait_date',dateFmt:'yyyy-MM-dd'});"></td>
											<td>&nbsp;等待原因：</td>
											<td>
											    <select id="waitReason" class="input-small" style='width:100px;height: 30px;'>
													<option value="">请选择</option>
													<option value="停线">停线</option>
													<option value="其他">其他</option>
											    </select>
											</td>
											<td>&nbsp;具体原因：</td>
											<td><input id="reason_detail" style="height:30px;width:120px" placeholder="" class="col-sm-6" type="text"></td>
											<td>&nbsp;责任部门：</td>
											<td><input id="duty_unit" style="height:30px;width:120px" placeholder="" class="col-sm-6" type="text"></td>
										</tr>
										<tr>
											<td>等待类别：</td>
											<td>
												<select id="search_wait_hour_type" style='width:100px;height: 30px;' class="input-small carSeries">
												</select>
											</td>
											<td>&nbsp;等待工时：</td>
											<td><input id="workhour" style="height: 30px; width:100px;" type="text" class="input-medium revise workhour" placeholder="" /></td>
											<td>&nbsp;人员去向：</td>
											<td><input id="whereabouts" style="height:30px;width:120px" placeholder="" class="col-sm-6" type="text"></td>
											<td id="workhourtotal">&nbsp;&nbsp;已录工时：</td>
											<td></td>
											<td>&nbsp;&nbsp;<input type="button" class="btn btn-sm btn-info" id="btnSave" value="保存" style="margin-left: 2px;"></input></td>
											
										</tr>
									</table>
								</form>
							</div>
							<div class="row" >
								<div class="col-xs-12"  id="tableReusltDiv" style="padding-right:0px;">
									<table id="tableResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:936px;overflow:auto;">
									</table>
								</div>
							</div>
						</div>
					</div>
					<div id="dialog-edit" class="hide" style="align:center;width:1200px;height:600px">
						<form id="newRecordForm" class="form-horizontal" method="post">
							<input type="hidden" id="select_start_date">
							<input type="hidden" id="select_finish_date">
							<table>
								<tr>
									<td width='70px'>生产订单：</td>
									<td width='100px'><input style="height: 30px;"
										class="input-medium" placeholder="订单..." id="search_order_no"
										type="text"></td>
									<td width='80px'>&nbsp;&nbsp;停线时间：</td>
									<td><input style="width: 120px" class="input-medium"
										placeholder="开始日期..." id="pause_date_start"
										onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});"
										type="text"> -<input style="width: 120px"
										class="input-medium" placeholder="截止日期..." id="pause_date_end"
										onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});"
										type="text"></td>
								</tr>
								<tr>
									<td width='70px'>停线原因：</td>
									<td width='100px'><select name="" id="search_reason_type"
										class="input-medium">
											
									</select></td>
									<td width='80px'>&nbsp;&nbsp;恢复时间：</td>
									<td><input style="width: 120px" class="input-medium"
										placeholder="开始日期..." id="ok_date_start"
										onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});"
										type="text"> -<input style="width: 120px"
										class="input-medium" placeholder="截止日期..." id="ok_date_end"
										onclick="WdatePicker({dateFmt:'yyyy-MM-dd HH:mm'});"
										type="text"> <input type="button"
										class="btn btn btn-primary" id="btnQueryReason" value="查询"
										style="margin-left: 2px;"></input></td>

								</tr>
							</table>

						</form>
						<div class = "div-dialog">
							<form id="form_edit">
								<table id="tableDataDetail" class="table table-striped table-bordered table-hover dataTable no-footer"
							            style="font-size: 12px;" role="grid" aria-describedby="tableDataDetail_info">
								</table>
							</form>
						</div>
					</div>
				</div>
           
			</div>
			<!-- /.main-container -->
		</div>

		<script src="../js/datePicker/WdatePicker.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/ztree/jquery.ztree.core-3.5.min.js"></script>
		<script src="../js/jquery.form.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/production/waitWorkTimeMtn.js"></script>
</body>

</html>
