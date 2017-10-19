<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>车间工序</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet" href="../css/bootstrap.3.2.css">	
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../css/bootstrap-table.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css">
<style type="text/css" media="screen">
	.myselect {
		border: 0px none;
		-moz-appearance:none;
		-webkit-appearance:none;
		font-size: 100%;
		margin-bottom: 3px;
		color: #555;
		background-color:#f5f5f5;
		/* width: 70px; */
		padding: 0px;
		height:27px;
		cursor: pointer;
		margin-left: -8px;
		}
	</style>
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
							href="/MES/index">Index</a></li>
						<li><a href="executionindex">Production Execution</a></li>
						<li class="active">
						<select name="" id="search_factory" class="myselect">
						</select>
						</li>
						<li class="active">
						<select name="" id="search_workshop" class="myselect">
						</select>
						</li>
					</ul>
					<!-- /.breadcrumb -->
					
					<div style="right: 180px; position: absolute; top: 5px;" class="breadcrumb">
						<i class="fa fa-print bigger-130" aria-hidden="true" style='color: #4c8fbd;cursor: pointer;margin-left:5px;'></i> Bus No.
						<i class="fa fa-print bigger-130" aria-hidden="true"  style='color: #4c8fbd;cursor: pointer;margin-left:5px;'></i> Key Parts
						<i class="fa fa-wrench bigger-130" aria-hidden="true"  style='color: #4c8fbd;cursor: pointer;margin-left:5px;'></i> ECN
					</div>
					

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
					<div class="row">
					<div class="col-xs-12">
						<div style="margin-left: 30px;">
				 		<canvas id="first_canvas" width=1100 height=80 style="border: solid 0px;"> 
					
						</canvas> 
			</div>
					</div>
					</div>
				</div>

			</div>
			<!-- /.main-container -->
		</div>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/production/executionIndex.js"></script>
</body>

</html>
