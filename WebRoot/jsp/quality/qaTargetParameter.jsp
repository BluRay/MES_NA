<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>质量目标参数</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.custom.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
						<li><a href="#">制程品质</a></li>
						<li class="active">质量目标参数</li>
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
								<td>工厂：</td>
								<td><select id="search_factory" class="input-small" style="width:100px"></select></td>
								<td>&nbsp;车间：</td>
								<td><select id="search_workshop" class="input-small" style="width:80px"></select></td>
								<td>&nbsp;参数类别：</td>
								<td><select id="search_targetType" class="input-small" style="width:100px"></select></td>
								<td>&nbsp;有效期：</td>
								<td colspan=3><input id="date_start" placeholder="开始时间..." style="width:125px" type="text" onClick="WdatePicker({el:'date_start',dateFmt:'yyyy-MM-dd'});"> - <input id="date_end" placeholder="结束时间..." style="width:125px" type="text" onClick="WdatePicker({el:'date_end',dateFmt:'yyyy-MM-dd'});"></td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 2px;"></input><input id="btnAdd" type="button" class="btn btn-sm btn-success" value="新增" style="margin-left: 2px;"></input></td>
							</tr>
						</table>
					</div>	
					<table id="tableData" class="table table-striped table-bordered table-hover" style="overflow-x:auto;font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">工厂：</td><td style="width:130px"><select id="new_factory" class="input-small" style="width:125px"></select></td>
						<td align="right" style="width:100px">车间：</td><td style="width:150px"><select id="new_workshop" class="input-small" style="width:125px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">参数类别：</td><td style="width:130px"><select id="new_targetType" class="input-small" style="width:125px"></select></td>
						<td align="right" style="width:100px">目标值：</td><td style="width:150px"><input type="text" class="input-medium" id="new_targetVal" style="width:125px"></input></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">有效期：</td>
						<td colspan=3><input id="new_date_start" placeholder="开始时间..." style="width:125px" type="text" onClick="WdatePicker({el:'new_date_start',dateFmt:'yyyy-MM-dd'});"> - <input id="new_date_end" placeholder="结束时间..." style="width:125px" type="text" onClick="WdatePicker({el:'new_date_end',dateFmt:'yyyy-MM-dd'});"></td>
					</tr>
					</table>
				</form>
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">工厂：</td><td style="width:130px"><select id="edit_factory" class="input-small" style="width:125px"></select></td>
						<td align="right" style="width:100px">车间：</td><td style="width:150px"><select id="edit_workshop" class="input-small" style="width:125px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">参数类别：</td><td style="width:130px"><select id="edit_targetType" class="input-small" style="width:125px"></select></td>
						<td align="right" style="width:100px">目标值：</td><td style="width:150px"><input type="text" class="input-medium" id="edit_targetVal" style="width:125px"></input></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">有效期：</td>
						<td colspan=3><input id="edit_date_start" placeholder="开始时间..." style="width:125px" type="text" onClick="WdatePicker({el:'edit_date_start',dateFmt:'yyyy-MM-dd'});"> - <input id="edit_date_end" placeholder="结束时间..." style="width:125px" type="text" onClick="WdatePicker({el:'edit_date_end',dateFmt:'yyyy-MM-dd'});"></td>
					</tr>
					</table>
					<input type="text" class="input-medium" id="edit_id" style="display:none"></input>
				</form>
			</div>

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>

	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/quality/qaTargetParameter.js"></script>
</html>
