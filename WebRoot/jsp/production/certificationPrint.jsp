<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>合格证打印</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
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
		<div class="main-container"  id="main-container" >
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li class="active">合格证打印</li>
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
					<form id="form" class="well form-search">
						<table>
							<tr>
								<td>生产工厂：</td>
								<td><select disabled="disabled" name="" id="search_factory" class="input-medium carType"></select></td>
								<td>订单编号：</td>
								<td>
								<input type="text" class="input-medium revise" id="search_order_no" style="height: 30px;" />
								</td>
								<td>
								<input type="button" class="btn btn-sm  btn-primary" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
								<input class="btn btn-sm btn-danger" id="btnBuslist" value="指定车号" style="margin-left: 2px;" type="button">
								<input class="btn btn-sm  btn-success" id="btnImport" value="传输打印"  style="margin-left: 2px;" type="button">
								<input type="text" style="display:none;width:400px" class="input-large revise" id="bus_number_str"></input>
								</td>							
							</tr>

						</table>
					</form>
					
					<div class="row">
					<div class="col-xs-12">
						<table id="tableResult" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1600px;overflow-x:auto">
						</table>	
					</div>
					</div>
					
					<div id="dialog-config" class="hide">
					<form id="  " class="form-horizontal">
						<div class="form-group">
							<label class="col-sm-2 control-label no-padding-right no-padding-right" for="vin">车号：</label>
							<div class="col-sm-9">
								<textarea rows="6" id="search_bus_number" style="width:300px" placeholder="每行输入一个车号后回车！"></textarea>
							</div>
						</div>
					</form>
				</div>
			</div><!-- /.main-content -->
		</div>
	</div>
	</body>
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/jsrender.min.js"></script>
	<script type="text/javascript" src="../js/jquery-barcode.js"></script>
	<script type="text/javascript" src="../js/production/certificationPrint.js"></script>
</html>
