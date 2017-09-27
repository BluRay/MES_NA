<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Project Update</title>
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
						href="/MES_NA/index">Index</a></li>
					<li >Project Management</li>
					<li class="active">Update</li>
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
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="Please input Project No..." value=""
								id="search_order_no" /></td>
							<!-- <td>订单名称：</td>
							<td><input type="text" style="height: 30px;"
								class="input-large revise" placeholder="请输入订单名称..." value=""
								id="search_order_name" /></td> -->
							<td>Status：</td>
							<td><select id="search_order_status" class="input-medium revise">
								<option value='All'>All</option>
								<option value='1'>Created</option>
								<option value='2'>In process</option>
								<option value='3'>Completed</option>
								</select>
							</td>
							<td>Year：</td>
							<td><!-- <select name="" id="search_productive_year"
								class="input-small">
							</select> -->
								<input class="input-small"  style="height: 30px;" id="search_productive_year" onclick="WdatePicker({lang:'en_us',el:'search_productive_year',dateFmt:'yyyy'});" type="text">
							</td>
							<td>Plant：</td>
							<td><select name="" id="search_factory" class="input-small">
							</select>
							 	<script id="tmplBusTypeSelect" type="text/x-jsrander">
                                    <option value='{{:id}}'>{{:name}}</option>
                                </script>
							</td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="Search"
								style="margin-left: 2px;"></input>
								<button id='btnAdd' class="btn btn-sm btn-success">Add</button></td>
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

			<div id="dialog-order_new" class="hide">
				<form id="project_new" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="">&nbsp;Customer Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large"
								placeholder="Please input the Customer Name" id="newCustomer" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="">*&nbsp;Search Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large"
								placeholder="Please input the Search Name for Customer" id="newSearchName" />
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Bus Type:</label>
						<div class="col-sm-9">
							<select name="" id="new_bus_type" class="input-large busType">
							</select>

						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newProjectName">*&nbsp;Project Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large"  id="newProjectName" disabled/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_project_date">*&nbsp;Project Date:</label>
						<div class="col-sm-9">
							<input class="input-large"  style="height: 30px;" placeholder="" id="new_project_date" 
							onclick="WdatePicker({lang:'en_us',el:'new_project_date',dateFmt:'yyyy-MM-dd'});"  type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Quantity:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="new_quantity" />Bus
						</div>
					</div>						
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="new_delivery_date">*&nbsp;Delivery Date:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="Please input the Delivery Date"
								id="new_delivery_date"
								onClick="WdatePicker({lang:'en_us',el:'new_delivery_date',dateFmt:'yyyy-MM-dd'});" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Production Plant:</label>
						<div class="col-sm-9">
							<select name="" id="new_plant" class="input-large">
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">Sales Manager:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="new_sales_manager" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">Project Manager:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="new_project_manager" />
						</div>
					</div>
				</form>
			</div>
			
			<div id="dialog-order_edit" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderCode">&nbsp;Customer Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large"  id="editCustomer" disabled/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="">*&nbsp;Search Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" id="editSearchName" disabled/>
						</div>
					</div>

					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Bus Type:</label>
						<div class="col-sm-9">
							<select name="" id="edit_bus_type" class="input-large busType" disabled>
							</select>

						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newProjectName">*&nbsp;Project Name:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large"  id="editProjectName" disabled/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Project Date:</label>
						<div class="col-sm-9">
							<input class="input-large"  style="height: 30px;" placeholder="" id="edit_project_date" 
							onclick="WdatePicker({lang:'en_us',el:'edit_project_date',dateFmt:'yyyy-MM-dd'});"  type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Quantity:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="edit_quantity" />Bus
						</div>
					</div>						
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Delivery Date:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" id="edit_delivery_date"
								onClick="WdatePicker({lang:'en_us',el:'edit_delivery_date',dateFmt:'yyyy-MM-dd'});" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">*&nbsp;Production Plant:</label>
						<div class="col-sm-9">
							<select name="" id="edit_plant" class="input-large" disabled>
							</select>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">Sales Manager:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="edit_sales_manager" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right" for="">Project Manager:</label>
						<div class="col-sm-9">
							<input type="text" class="input-large" placeholder="" id="edit_project_manager" />
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
	<script src="../js/jquery.form.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/order/maintain.js"></script>
</body>

</html>
