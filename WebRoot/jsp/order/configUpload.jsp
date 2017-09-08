<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>配置导入</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
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
						href="/BMS/index">首页</a></li>
					<li class="active">配置导入</li>
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
							<td>
								<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({el:'search_productive_year',dateFmt:'yyyy'});" type="text">
							</td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询"
								style="margin-left: 2px;"></input>
								<!-- <input type="button"
								class="btn btn-sm btn-success btnQuery" id="btnAdd" value="新增"
								style="margin-left: 2px;"></input> -->
							</td>
						</tr>
					</table>
				</div>

				<div class="row">
					<div class="col-xs-12">
						<table id="tableOrder" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
						</table>
					</div>
				</div>
			</div>

			<div id="dialog-config" class="hide">
				<div id="config_form" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="order">*&nbsp;订单：</label>
						<div class="col-sm-3">
							<!-- <p style="width:98%;margin-bottom: 4px;font-size: 14px;margin-top: 4px;"id="order" >D2017003 K7 200台</p> -->
							<input type="text"  class="input-medium" style="width:100%"  id="order"  placeholder="订单编号.." />
							<input type="text" style="display:none" id="order_id" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="configName">*&nbsp;配置名称：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="配置名称..." id="configName" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="configQty">*&nbsp;配置数量：</label>
						<div class="col-sm-3">
							<input type="text" class="input-medium" style="width:100%"
								placeholder="配置数量..." id="configQty" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="materialNo">&nbsp;总成料号：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="总成料号..." id="materialNo" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="customer">&nbsp;客户：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="客户..." id="customer" />
						</div>
					</div>
					
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="material">&nbsp;物料描述：</label>
						<div class="col-sm-8">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="物料描述..." id="material" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="tire_type">&nbsp;轮胎规格：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="轮胎规格..." id="tire_type" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="spring_num">&nbsp;弹簧片数：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="弹簧片数..." id="spring_num" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="bus_seats">&nbsp;座位数：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="座位数..." id="bus_seats" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="rated_voltage">&nbsp;额定电压：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="额定电压..." id="rated_voltage" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="battery_capacity">&nbsp;电池容量：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="电池容量..." id="battery_capacity" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="passenger_num">&nbsp;额定载客人数：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"
								placeholder="额定载客人数..." id="passenger_num" />
						</div>
					</div>
					
					<div class="form-group" id="upload_div">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="editOrderCode">&nbsp;配置信息：</label>
						<div class="col-sm-9">
							<form id="uploadForm" action="" enctype="multipart/form-data" method="post">
								<div class="col-sm-4">
									<input id="file" style="margin-left: -10px;padding:0px 0px;font-size: 12px" class="btn btn-info btn-small" name="file" accept=".xls" type="file"> 				
								</div>
								<div class="col-sm-4">
									<input id="btn_upload" style="padding:0px 0px;font-size: 12px;height:35px" class="btn btn-primary" value="上传并导入" onclick="javascript:return upload(this.form, this.form.file.value)" type="button"> 
									<a href="../docs/configDetail.xls">下载批导模板</a>
								</div>							
							</form>
						</div>
						
					</div>

					<div class="form-group">					
						<div class="col-sm-12">			
							<table class="table table-striped table-bordered table-hover" style="width:1000px;overflow-x:auto;font-size:12px;" id="orderConfigTable">
							</table>
						</div>
					</div>
			</div>
			
		
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
	
	 <script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>
	<script src="../assets/js/buttons.flash.js"></script> 
	
	<script src="../js/jquery.form.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/order/configUpload.js"></script>
</body>
</html>
