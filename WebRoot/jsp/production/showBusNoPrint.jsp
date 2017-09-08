<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>车身号打印</title>
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
		<div class="main-container notPrintable" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li class="active">车身号打印</li>
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
					<div class="page-content-area">
					
					<div class="well">
						<table>
							<tr>
								<td>&nbsp;订单编号：</td>
								<td><input id="search_order" placeholder="订单编号..." style="width:90px" type="text" ></td>
								
								<td>&nbsp;车号：</td>
								<td><input id="search_busNumber" placeholder="车号..." style="width:150px" type="text" > </td>
								<td>&nbsp;计划生产日期：</td>
								<td colspan=3><input id="plan_date_start" placeholder="开始时间..." style="width:125px" type="text" onClick="WdatePicker({el:'plan_date_start',dateFmt:'yyyy-MM-dd'});"> - <input id="plan_date_end" placeholder="结束时间..." style="width:125px" type="text" onClick="WdatePicker({el:'plan_date_end',dateFmt:'yyyy-MM-dd'});"></td>								
								<td>
								    <input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input>
								</td>
							</tr>
						</table>	
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="overflow-x:auto;font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->

			

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	<div id="printarea" class="printConfigure printable toPrint">
	
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
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/jquery-barcode.js"></script>
	<script type="text/javascript" src="../js/production/showBusNoPrint.js"></script>
</html>
