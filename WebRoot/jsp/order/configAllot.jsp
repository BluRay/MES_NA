<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>配置分配</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
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
						<li class="active">配置分配</li>
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
								<td>订单编号：</td>
								<td><input type="text" style="height: 30px;"
									class="input-medium revise" placeholder="请输入订单编号..." value=""
									id="search_order_no" /></td>
								<td>订单名称：</td>
								<td><input type="text" style="height: 30px;"
									class="input-medium revise" placeholder="请输入订单名称..." value=""
									id="search_order_name" /></td>
								<td>生产年份：</td>
								<td><!-- <select name="" id="search_productive_year"
									class="input-small"> -->
									<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({el:'search_productive_year',dateFmt:'yyyy'});" type="text">
								</select></td>
								<td>生产工厂：</td>
								<td><select name="" id="search_factory" class="input-small">
								</select></td>
								<td><input type="button"
									class="btn btn-sm btn-primary btnQuery" id="btnQuery"
									value="查询" style="margin-left: 2px;"></input></td>
							</tr>
						</table>
					</div>

					<div class="row">
						<div class="col-xs-12">
							<table id="tableOrder"
								class="table table-striped table-bordered table-hover"
								style="font-size: 12px;">
							</table>
						</div>
					</div>
				</div>

				<div id="dialog-config" class="hide">
					<form id="configForm" class="form-horizontal">
						<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="order">订单：</label>
						<div class="col-sm-8">
							<input type="text"  class="input-medium" style="width:100%"  id="order"  disabled/>
							<input type="text" style="display:none" id="order_id" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="configName">生产工厂：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" id="factory"  disabled/>
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="configQty">生产数量：</label>
						<div class="col-sm-3">
							<input type="text" class="input-medium" style="width:100%" id="productionQty" disabled/>
						</div>
					</div>
						<!-- <h5 style="width: 550px; margin: 0 auto;">&nbsp;&nbsp;配置信息</h5> -->
						<br />
						<table style="margin-top: -10px; margin-bottom: -10px" class="table table-striped  table-hover" id="configAllot_table">
						<!-- 	<tr height="40px">
								<td width="80px">配置编号</td>
								<td width="160px">配置简称</td>
								<td width="100px">生产序号</td>
								<td width="100px">生产数量</td>
								<td width="100px">已上线数量</td>
							</tr>
							<tbody id="editOrderConfig_parameters" >
							</tbody> -->
						</table>
						<br /> <input type="text" style="display: none;" id="configStr"
							name="configStr"></input> <input type="text"
							style="display: none;" id="order_id" name="order_id"> <input
							type="text" style="display: none;" id="factory_id"
							name="factory_id">
					</form>


				</div>
			</div>
			<!-- /.main-container -->
		</div>
		<script src="../js/datePicker/WdatePicker.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
		<script src="../assets/js/dataTables.rowGroup.js"></script>

		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/jquery.form.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/order/configAllot.js"></script>
</body>

</html>
