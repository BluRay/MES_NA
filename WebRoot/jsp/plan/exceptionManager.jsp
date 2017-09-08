<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>异常处理</title>
		
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
						<li class="active">异常处理</li>
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
					<div class="tablediv page-content-area">
					<div class="well">
						<table>
							<tr>
								<td>工厂：</td>
								<td><select id="search_factory" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;车间：</td>
								<td><select id="search_workshop" class="input-small" style="height: 30px;width:80px"></select></td>
								<td>&nbsp;线别：</td>
								<td><select id="search_line" class="input-small" style="height: 30px;width:60px"><option value='A'>A线</option><option value='B'>B线</option></select></td>
								<td>&nbsp;车号：</td>
								<td><input id="search_busnumber" placeholder="请输入车号..." style="height: 30px;width:110px" type="text"></td>
								<td>&nbsp;严重等级：</td>
								<td><select id="search_severity_level" class="input-small" style="height: 30px;width:120px"></select></td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td>&nbsp;措施：</td>
								<td><select id="search_measures" class="input-small" style="height: 30px;width:100px"></select></td>
								<td>&nbsp;状态：</td>
								<td><select id="search_status" class="input-small" style="height: 30px;width:80px"></select></td>
								<td>异常日期：</td>
								<td colspan=3><input id="date_start" placeholder="开始时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'date_start',dateFmt:'yyyy-MM-dd'});"> - <input id="date_end" placeholder="结束时间..." style="height: 30px;width:125px" type="text" onClick="WdatePicker({el:'date_end',dateFmt:'yyyy-MM-dd'});"></td>
								<td></td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;"></input>&nbsp;&nbsp;</td>
							</tr>
						</table>
					</div>
					<div id="toolbar"></div>
					<table  style="font-weight:normal;width:1500px;" id="table" data-toolbar="#toolbar" data-search="false" data-show-refresh="true"
				           data-show-toggle="false" data-show-columns="true" data-show-export="true" data-detail-view="false"
				           data-detail-formatter="detailFormatter" data-minimum-count-columns="2" data-show-pagination-switch="true"
				           data-pagination="true" data-id-field="id" data-page-list="[50, 100, 200, 500, ALL]"
				           data-show-footer="false" data-side-pagination="server" data-response-handler="responseHandler">
				    </table>
			</div><!-- /.main-content -->
			
			<div id="dialog-edit" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">生产工厂：</td><td style="width:150px"><select id="edit_factory" class="form-control" style="width:150px"></select><input type="text" style="display:none" id="exception_id" class="input-small" /></td>
						<td align="right" style="width:100px">生产车间：</td><td style="width:150px"><select id="edit_workshop" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">生产线别：</td><td style="width:150px"><select id="edit_line" class="form-control" style="width:150px"><option value='A'>A线</option><option value='B'>B线</option></select></td>
						<td align="right" style="width:100px">生产工序：</td><td style="width:150px"><select id="edit_process" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">车号：</td><td style="width:150px"><input id="edit_busNumber" disabled="disabled" placeholder="车号..." style="width:150px" type="text"></td>
						<td align="right" style="width:100px">原因：</td><td style="width:150px"><select id="edit_reason_type" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right">详细原因：</td><td colspan=3><input id="edit_detailed_reason" placeholder="详细原因..." style="width:370px" type="text"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">严重等级：</td><td style="width:150px"><select id="edit_severity_level" class="form-control" style="width:150px"></select></td>
						<td align="right" style="width:100px">责任部门：</td><td style="width:150px"><select id="edit_duty_department" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">处理措施：</td><td style="width:150px"><select id="edit_measures" class="form-control" style="width:150px"></select></td>
						<td align="right" style="width:100px"></td><td style="width:150px"></td>
					</tr>
					
					</table>
				</form>
			</div>
			
			<div id="dialog-confirm" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">车号：</td><td style="width:150px"><input id="confirm_busNumber" disabled="disabled" placeholder="车号..." style="width:150px" type="text"><input type="text" style="display:none" id="confirm_exception_id" class="input-small" /></td>
						<td align="right" style="width:100px">处理时间：</td><td style="width:150px"><input id="confirm_process_date" placeholder="处理时间..." style="width:150px" type="text" onClick="WdatePicker({el:'confirm_process_date',dateFmt:'yyyy-MM-dd HH:mm:ss'});"></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">异常原因：</td><td style="width:150px"><select id="confirm_reason_type" class="form-control" style="width:120px"></select></td>
						<td align="right" style="width:100px">责任部门：</td><td style="width:150px"><select id="confirm_duty_department" class="form-control" style="width:150px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right">处理方案：</td><td colspan=3><input id="confirm_solution" placeholder="处理方案..." style="width:370px" type="text"></td>
					</tr>
					<tr style="height:40px">
						<td align="right">详细原因：</td><td colspan=3><input id="confirm_detailed_reason" placeholder="详细原因..." style="width:370px" type="text"></td>
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
	<script type="text/javascript" src="../js/plan/exceptionManager.js"></script>
</html>
