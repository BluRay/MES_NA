<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>铭牌打印</title>
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
		<div class="main-container notPrintable" id="main-container" >
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li class="active">铭牌打印</li>
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
								<td>订单编号：</td>
								<td><input type="text" class="input-medium revise" id="input_order_no" style="height: 30px;" /></td>
								<td>流水范围：</td>
								<td>
								<input type="text" class="input-medium revise" id="input_busno_start"  style="height: 30px;"/> 
								<span class="add-on" style="padding: 4px 0">-</span> 
								<input type="text" class="input-medium revise" id="input_busno_end"  style="height: 30px;"/>
								</td>
								<td><input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
										 <input type="button" class="btn btn-sm btn-success" id="btnPrint" value="打印" style="margin-left: 2px;"></input>
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
					
			</div><!-- /.main-content -->

	</div>
	</div>
	<div id="printarea" class="printConfigure printable toPrint">
			<table id="tablePrint" class="table table-bordered">
		
			</table>
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
	<script type="text/javascript" src="../js/production/nameplatePrint.js"></script>
</html>
