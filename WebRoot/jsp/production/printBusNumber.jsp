<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<title>Print Bus No.</title>
		<link rel="stylesheet" href="../css/bootstrap-table.css">
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
		<link rel="stylesheet" href="../css/printable.css" type="text/css" media="print">
		<link rel="stylesheet" href="../assets/css/buttons.dataTables.css" /> 
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
						<li class="active">Print Bus No.</li>
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
							<td>Plant：</td>
							<td><select id="search_plant" class="input-small" style="height: 30px;width:100px"></select></td>
							<td>&nbsp;Project No.：</td>
							<td><input style="height: 30px;" type="text" class="input-medium revise" id="search_project_no" /></td>
							<td>&nbsp;Bus No.：</td>
							<td><input id="search_bus_number" style="height: 30px;width:150px" type="text"></td>
							<td>Print Flag：</td>
							<td>
								<select id="search_print_flag" class="input-small" style="height: 30px;width:100px">
								    <option value=''>All</option>
								    <option value='0'>Not Print</option>
								    <option value='1'>Printed</option>
								</select>
							</td>
							<td>
								<input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="Search" style="margin-left: 2px;"></input>
								<input id="btnPrint" type="button" class="btn btn-sm btn-info" value="Print" style="margin-left: 2px;"></input>
							</td>
							<td></td>
						</tr>
						</table>
					</div>	
					<table id="tableResult" style="font-size: 12px;" class="table table-bordered table-striped">
			        </table>
			    </div>
            </div>
			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	<div id="printarea" class="printConfigure printable toPrint"></div>
	</body>
	<style type="text/css">
	.fixed-table-toolbar .bs-bars, .fixed-table-toolbar .search, .fixed-table-toolbar .columns {
		position: absolute;
		margin-top: 102px;
		right: 20px;
		top: -49px;
	}
	.btn-default {
		color: #333;
		background-color: #fff;
		border-color: #ccc;
		height: 40px;
		color: #fff;
		background-color: #333;
	}
	
</style>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>
	<script src="../assets/js/jszip.min.js"></script>
	<script src="../assets/js/dataTables.buttons.js"></script>
	<script src="../assets/js/buttons.colVis.js"></script>
	<script src="../assets/js/buttons.html5.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/jquery-barcode.js"></script>
	<script type="text/javascript" src="../js/production/printBusNumber.js"></script>
</html>
