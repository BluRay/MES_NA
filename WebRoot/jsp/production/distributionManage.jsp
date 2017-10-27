<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Distribution Manage</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
		<link rel="stylesheet" href="../css/printable.css" type="text/css" media="print">
		<style type="text/css" media="screen">
	        .printable{
	            display: none;
	        }
	  </style> 
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="../top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container notPrintable" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="#">Production</a></li>
						<li class="active">Distribution Manage</li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					<!-- /section:settings.box -->
					<div class="page-content-area">					
					
					<div class="well">
						<table>
							<tr>
								<td>Plant : &nbsp;</td>
								<td>&nbsp;<select id="search_factory" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;Workshop : &nbsp;</td>
								<td>&nbsp;<select id="search_workshop" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;Line : &nbsp;</td>
								<td>&nbsp;<select id="search_line" class="input-small" style="height: 30px;width:50px"></select></td>
								<td>&nbsp;Station : &nbsp;</td>
								<td>&nbsp;<select id="search_station" class="input-small" style="height: 30px;width:90px"></select></td>
								<td>&nbsp;BusNo : &nbsp;</td>
								<td>&nbsp;<input id="search_busno" placeholder="Bus No..." style="height: 30px;width:100px" type="text"></td>
								<td>&nbsp;&nbsp;</td>
							</tr>
							<tr>
								<td>Distribution No : &nbsp;</td>
								<td>&nbsp;<input id="search_disno" placeholder="Distribution No..." style="height: 30px;width:120px" type="text"></td>
								<td>&nbsp;Start Date : &nbsp;</td>
								<td>&nbsp;<input id="search_start_date" style="height: 30px;width:100px" onClick="WdatePicker({el:'search_start_date',dateFmt:'yyyy-MM-dd'});" type="text"></td>
								<td>&nbsp;End Date : &nbsp;</td>
								<td>&nbsp;<input id="search_end_date" style="height: 30px;width:100px" onClick="WdatePicker({el:'search_end_date',dateFmt:'yyyy-MM-dd'});" type="text"></td>
								<td>&nbsp;Status : &nbsp;</td>
								<td>&nbsp;<select id="search_status" class="input-small" style="height: 30px;width:90px"><option value="">All</option><option value="1">已收货</option><option value="2">未收货</option></select></td>
								<td></td>
								<td>&nbsp;<input type="button" class="btn btn-sm btn-success" id="btnQuery" value="Search" style="margin-left: 2px;"></input>&nbsp;</td>
								<td></td>
							</tr>
						</table>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					<thead><tr>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">DistributionNo</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="180px">Station</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="150px">BusNumber</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">MaterialNum</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">CreateUser</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">CreateTime</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">ReceptionUser</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">ReceptionTser</th>
						<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">Oprtation</th>
						</tr>
					</thead>
					<tbody></tbody>
					</table>
					</div>
			</div><!-- /.main-content -->	
			
			<div id="dialog-print" class="hide notPrintable" style="align:center;width:700px;height:500px">
				<div style="height:500px">
				<table id="tableDataShow" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
				<thead><tr>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="30px">Item</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">BusNumber</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">SAPmaterial</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">PartName</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">Quantity</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="30px">Unit</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">Distribution</th>
					<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">Vendor</th>
					</tr>
				</thead>
				<tbody></tbody>
				</table>
				</div>
			</div>

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
				
	</div>
	<div id="printarea" class="printConfigure printable toPrint">
		<table id="tableDataPrint" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
		<thead><tr>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="30px">Item</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">BusNumber</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">SAPmaterial</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="60px">PartName</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">Quantity</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="30px">Unit</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="50px">Distribution</th>
			<th style="text-align:center;padding-left:0px;padding-right:0px;" width="40px">Vendor</th>
			</tr>
		</thead>
		<tbody></tbody>
		</table>
		<h2 id="dis_no"></h2>
	</div>
	</body>
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	<script type="text/javascript" src="../js/production/distributionManage.js"></script>
</html>
