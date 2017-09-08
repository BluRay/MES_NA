<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>生成VIN号</title>
		<link rel="stylesheet" href="../css/bootstrap-table.css">
		<link rel="stylesheet" href="../css/bootstrap-editable.css">
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="../top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li><a href="#">生产计划</a></li>
						<li class="active">生成VIN号</li>
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
							<td>生产工厂：</td>
							<td><select id="search_factory" class="input-small" style="height: 30px;width:150px"></select></td>
							<td>&nbsp;订单编号：</td>
							<td><input style="height: 30px;" type="text" class="input-medium revise" placeholder="订单编号..." id="search_order_no" /></td>
							<td></td>
							<td width="25px"></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
						</tr>
						<tr>
							<td>&nbsp;VIN号：</td>
							<td><input id="search_bus_vin" placeholder="请输入VIN号..." style="height: 30px;width:150px" type="text"></td>
							<td>&nbsp;车号：</td>
							<td><input id="search_bus_number" placeholder="请输入车号..." style="height: 30px;width:150px" type="text"></td>
							<td></td>
							<td></td>
							<td>
								<input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input>
								<input id="btnGenVin" type="button" class="btn btn-sm btn-success" value="生成VIN号" style="margin-left: 2px;"></input>
								<input id="btnImport" type="button" class="btn btn-sm btn-danger" value="导入" style="margin-left: 2px;"></input>
								<!-- <input id="btnPrint" type="button" class="btn btn-sm btn-info" value="打印VIN号" style="margin-left: 2px;"></input>	 -->
							</td>
							<td></td>
						</tr>
						</table>
					</div>	
					
					<div id="divBulkAdd" class="well" style="display:none;">
					<button id="btnBulkHide" type="button" class="close"><i class="ace-icon fa fa-times"></i></button>
						<form id="uploadMasterPlanForm" action="#" enctype="multipart/form-data" method="post">
						<table>
							<tr>
								<td><input id="file" type="file" name="file" accept="*.xlsx"/></td>
								<td><input id="btn_upload" type="button" class="btn btn-sm btn-primary" value="上传并导入" onclick="javascript:return LimitAttach(this.form, this.form.file.value)"/></td>
								<td></td><td><a href="../docs/vin.xls">下载批导模板</a></td>
							</tr>
						</table>
						</form>
					</div>
					
					<div id="toolbar"></div>
					<table  style="font-weight:normal;width:100%;" id="table" data-toolbar="#toolbar" data-search="false" data-show-refresh="true"
				           data-show-toggle="false" data-show-columns="true" data-show-export="true" data-detail-view="false"
				           data-detail-formatter="detailFormatter" data-minimum-count-columns="2" data-show-pagination-switch="true"
				           data-pagination="true" data-id-field="id" data-page-list="[50, 100, 200, 500, ALL]"
				           data-show-footer="false" data-side-pagination="server" data-response-handler="responseHandler">
				    </table>
					</div>
					
					<div id="dialog-new" class="hide" style="align:center;width:700px;height:500px">
						<form>
						<table>
						<tr style="height:40px">
							<td width="75px"></td>
							<td align="right" style="width:100px">订单编号：</td><td style="width:150px"><input type="text" disabled="disabled" id="new_order_no" placeholder="订单编号..." class="input-medium" /></td>
							<td></td>
						</tr>
						<tr style="height:40px">
							<td width="75px"></td>
							<td align="right" style="width:100px">生产区域：</td><td style="width:150px"><select id="new_area" class="form-control" style="width:150px"></select></td>
							<td></td>
						</tr>
						<tr style="height:40px">
							<td width="75px"></td>
							<td align="right" style="width:100px">VIN前8位：</td><td style="width:150px"><input type="text" disabled="disabled" id="new_vinPrefix" placeholder="VIN前8位..." class="input-medium" /><input type="text" style="display:none" id="new_WMI_extension" placeholder="WMI_extension..." class="input-medium" /></td>
							<td></td>
						</tr>
						<tr style="height:40px">
							<td width="75px"></td>
							<td align="right" style="width:100px">生产年份：</td><td style="width:150px"><input type="text" id="new_year" placeholder="生产年份..." class="input-medium" onClick="WdatePicker({el:'new_year',dateFmt:'yyyy'});"/></td>
							<td></td>
						</tr>
						<tr style="height:40px">
							<td></td>
							<td align="right" style="width:100px">VIN号工厂：</td><td style="width:150px"><select id="vin_factory" class="form-control" style="width:150px"></select></td>
							<td></td>
						</tr>
						<tr style="height:40px">
							<td></td>
							<td align="right" style="width:100px">生成数量：</td><td style="width:150px"><input style="height: 30px;" type="text" class="input-medium revise" placeholder="生成数量..." id="new_vinCount" /></td>
							<td></td>
						</tr>
						
						</table>
						</form>
					</div>
					
			</div>

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script>
		var $table = $('#table'),$remove = $('#remove'),selections = [];
	</script>
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
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	
	<script type="text/javascript" src="../assets/js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/plan/generateVin.js"></script>
</html>
