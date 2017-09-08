<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>订单导入</title>
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
					<li class="active">订单导入</li>
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
							<!-- <td><select id="search_order_status" class="input-medium revise">
								<option value=''>全部</option>
								<option value='0'>未开始</option>
								<option value='1'>生产中</option>
								<option value='2'>已完成</option>
								</select>
							</td> -->
							<td>生产年份：</td>
							<td><!-- <select name="" id="search_productive_year"
								class="input-small">
							</select> -->
								<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({el:'search_productive_year',dateFmt:'yyyy'});" type="text">
							</td>
							<td>生产工厂：</td>
							<td><select name="" id="search_factory" class="input-small">
							</select>
							 	<script id="tmplBusTypeSelect" type="text/x-jsrander">
                                    <option value='{{:id}}'>{{:name}}</option>
                                </script>
							</td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询"
								style="margin-left: 2px;"></input>
								<button id='btnAdd' class="btn btn-sm btn-success">新增</button></td>
						</tr>
					</table>
				</div>

				<div class="row"  >
					<div class="col-xs-12"  style="width:100%">
						<table id="tableOrder" 
							class="table table-striped table-bordered table-hover "
							style="font-size: 12px; width:1500px;overflow-x:auto" >
						</table>
					</div>
				</div>


			</div>
			<div id="dialog-message" class="hide">
					<table id="tableBusNumber" style="font-size: 12px;width:2100px;overflow-x:auto" class="table table-bordered table-striped">
					</table>
			</div>

			<div id="dialog-order" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editOrderID">*&nbsp;订单编号</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" style="display: none"
								class="input-medium" placeholder="订单编号..." id="editOrderID" /> <input
								type="text" disabled="disabled" class="input-medium"
								placeholder="订单编号..." id="editOrderNo" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editOrderName">*&nbsp;订单名称</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单名称..." id="editOrderName" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editOrderCode">*&nbsp;订单简码</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单简码..." id="editOrderCode" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editOrderCode">*&nbsp;订单类型</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单类型..." id="editOrderType" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editOrderCode">*&nbsp;订单区域</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单区域..." id="editOrderArea" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;客户</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium"
								placeholder="客户..." id="edit_customer" />
						</div>
					</div> 
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;车型</label>
						<div class="col-sm-9">
							<select name="" disabled="disabled" id="editBusType"
								class="input-medium busType">
							</select>
							<script id="tmplBusTypeSelect" type="text/x-jsrander">
                                    <option value='{{:id}}'>{{:bus_type_code}}</option>
                                </script>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="edit_order_qty">*&nbsp;订单数量</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单数量..." id="edit_order_qty" />
						</div>
					</div>
					<!-- <div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">&nbsp;订单描述</label>
						<div class="col-sm-9">
							<input type="text" disabled="disabled" class="input-medium"
								placeholder="订单描述..." id="edit_order_descriptive" />
						</div>
					</div> -->
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="edit_productive_year">*&nbsp;生产年份</label>
						<div class="col-sm-9">
							<!-- <select name="" disabled="disabled" id="edit_productive_year"
								class="input-medium">
							</select> -->
							<input class="input-medium" style="height: 30px;" placeholder="生产年份.." id="edit_productive_year" 
							onclick="WdatePicker({el:'edit_productive_year',dateFmt:'yyyy'});" onchange="changeProductionYear(this)"  type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="edit_delivery_date">*&nbsp;订单交期</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium" placeholder="选择订单交期..."
								id="edit_delivery_date"
								onClick="WdatePicker({el:'edit_delivery_date',dateFmt:'yyyy-MM-dd'});" />
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">产地分配</label>
						<div class="col-sm-9">
							<!-- <input type="text" class="input-medium" placeholder="选择订单交期..." id="bmsFactoryOrder" /> -->
							<table class="exp-table table">
								<thead>
									<tr>
										<th><i id="editFactoryOrder" class="fa fa-plus"
											style="cursor: pointer;color: blue;"></i>
											<%-- <button style="height:24px" class="btn btn-success btn-xs" id="editFactoryOrder"><span class="glyphicon glyphicon-plus">+</span></button> --%></th>
										<th class="col-sm-3">生产工厂</th>
										<th class="col-sm-3">数量</th>
										<th class="col-sm-3">开始</th>
										<th class="col-sm-3">结束</th>
										<!-- <th></th><th></th> -->
									</tr>
								</thead>
								<tbody id="edit_factoryOrder_parameters" class="exp-table">
								</tbody>
							</table>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="edit_memo">备注</label>
						<div class="col-sm-9">
							<textarea class="input-xlarge" style="width: 355px"
								id="edit_memo" rows="2"></textarea>
						</div>
					</div>
				</form>
			</div>
			
			<div id="dialog-order_new" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderName">*&nbsp;订单名称</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium"
								placeholder="订单名称..." id="newOrderName" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderCode">*&nbsp;订单简码</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium"
								placeholder="订单简码..." id="newOrderCode" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderCode">*&nbsp;订单类型</label>
						<div class="col-sm-9">
							<select name="" id="newOrderType" class="input-medium"></select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;车型</label>
						<div class="col-sm-9">
							<select name="" id="newBusType"
								class="input-medium busType">
							</select>

						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_order_qty">*&nbsp;订单数量</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium"
								placeholder="订单数量..." id="new_order_qty" />
						</div>
					</div>
 					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;客户</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium"
								placeholder="客户..." id="new_customer" />
						</div>
					</div> 
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;订单区域</label>
						<div class="col-sm-9">
							<select name="" id="newOrderArea"
								class="input-medium orderArea">
							</select>

						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_productive_year">*&nbsp;生产年份</label>
						<div class="col-sm-9">
							<!-- <select name="" id="new_productive_year"
								class="input-medium">
							</select> -->
							<input class="input-medium"  style="height: 30px;" placeholder="生产年份.." id="new_productive_year" 
							onclick="WdatePicker({el:'new_productive_year',dateFmt:'yyyy'});" onchange="changeProductionYear(this)" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_delivery_date">*&nbsp;订单交期</label>
						<div class="col-sm-9">
							<input type="text" class="input-medium" placeholder="选择订单交期..."
								id="new_delivery_date"
								onClick="WdatePicker({el:'new_delivery_date',dateFmt:'yyyy-MM-dd'});" />
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">产地分配</label>
						<div class="col-sm-9">
							<!-- <input type="text" class="input-medium" placeholder="选择订单交期..." id="bmsFactoryOrder" /> -->
							<table class="exp-table table">
								<thead>
									<tr>
										<th><i id="newFactoryOrder" class="fa fa-plus"
											style="cursor: pointer;color: blue;"></i>
											<%-- <button style="height:24px" class="btn btn-success btn-xs" id="editFactoryOrder"><span class="glyphicon glyphicon-plus">+</span></button> --%></th>
										<th class="col-sm-3">生产工厂</th>
										<th class="col-sm-3">数量</th>
										<th class="col-sm-3">开始</th>
										<th class="col-sm-3">结束</th>
										<!-- <th></th><th></th> -->
									</tr>
								</thead>
								<tbody id="new_factoryOrder_parameters" class="exp-table">
								</tbody>
							</table>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_memo">备注</label>
						<div class="col-sm-9">
							<textarea class="input-xlarge" style="width: 355px"
								id="new_memo" rows="2"></textarea>
						</div>
					</div>
				</form>
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
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/jszip.min.js"></script>
	<script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
    <script src="../assets/js/buttons.html5.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/order/maintain.js"></script>
</body>

</html>
