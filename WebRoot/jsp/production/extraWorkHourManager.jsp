<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 额外工时库维护</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
						href="/BMS/index">首页</a></li>
					<li><a href="#">生产执行</a></li>
					<li class="active">额外工时库维护</li>
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
							<td>车型：</td>
							<td><select name="" id="search_bus_type" class="input-small"></select></td>
							<td>订单编号：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="订单编号..." value=""
								id="search_order_no" /></td>
							<td>派工类型：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="派工类型..." value=""
								id="search_order_type" /></td>
							<td>作业内容/原因：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="作业内容/原因..." value=""
								id="search_reason_content" /></td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询"
								style="margin-left: 2px;"></input>
								<button id='btnBulkAdd' class="btn btn-sm btn-success">导入</button>
								<button id='btnDelete' class="btn btn-sm btn-delete">删除</button>
							</td>
						</tr>
					</table>
				</div>
                <div id="divBulkAdd" class="well" style="display:none;">
				    <button id="btnBulkHide" type="button" class="close"><i class="ace-icon fa fa-times"></i></button>
					<form id="uploadMasterPlanForm" action="#" enctype="multipart/form-data" method="post">
					<table>
						<tr>
							<td><input id="file" type="file" name="file" accept="*.xls"/></td>
							<td><input id="btn_upload" type="button" class="btn btn-sm btn-primary" value="上传并导入" onclick="javascript:return LimitAttach(this.form, this.form.file.value)"/></td>
							<td></td><td><a href="../docs/extraWorkHourManager.xls">下载批导模板</a></td>
						</tr>
					</table>
					</form>
				</div>
				<div class="row"  >
					<div class="col-xs-12"  style="width:100%">
						<table id="tableData" 
							class="table table-striped table-bordered table-hover"
							style="font-size: 12px;overflow-x:auto" >
						</table>
					</div>
				</div>
			</div>

			<div id="dialog-edit" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;临时派工类型</label>
							<div class="col-sm-8">
							    <input type="hidden" id="editId" />
								<input type="text" class="input-medium" id="edit_tmp_order_type" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label  class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;编号</label>
							<div class="col-sm-8">
								<input type="text" class="input-medium" id="edit_no" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;车型</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_bus_type" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;订单编号</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_order_no" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;时间</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_time" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newDriveMotor">*&nbsp;名称</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_tmp_name" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;作业原因/内容</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_reason_content" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;说明</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_description" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;单工时</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_single_hour" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;派工类型</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_order_type" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;工时评估人</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_assesor" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;工时评估审核人</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_assess_verifier" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;责任部门</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_duty_unit" style="width: 355px"></input>
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div>
							<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right">*&nbsp;备注</label>
							<div class="col-sm-8">
								<input class="input-medium" id="edit_memo" style="width: 355px"></input>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>	
		<!-- /.main-container -->
	</div>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	
	 <script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>
	<script src="../assets/js/buttons.flash.js"></script> 
	
	<script src="../js/jquery.form.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/production/extraWorkHourManager.js"></script>
	
</body>

</html>
