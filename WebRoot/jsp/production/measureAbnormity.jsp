<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Measure Abnormity</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="#">Production</a></li>
						<li class="active">Measure Abnormity</li>
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
								<td>&nbsp;<select id="search_factory" class="input-small" style="height: 30px;width:120px"></select></td>
								<td>&nbsp;Workshop : &nbsp;</td>
								<td>&nbsp;<select id="search_workshop" class="input-small" style="height: 30px;width:120px"></select></td>
								<td>&nbsp;Line : &nbsp;</td>
								<td>&nbsp;<select id="search_line" class="input-small" style="height: 30px;width:120px"></select></td>
								<td>&nbsp;BusNo : &nbsp;</td>
								<td>&nbsp;<input id="search_busno" style="height: 30px;" placeholder="Bus No..." class="col-sm-10" type="text"></td>
								<td></td><td></td>
							</tr>
							<tr>
								<td>Status : &nbsp;</td>
								<td>&nbsp;<select id="search_status" class="input-small" style="height: 30px;width:120px"><option value="0">All</option><option value="1">Processing</option><option value="2">Closed</option></select></td>
								<td>&nbsp;OpenDate : &nbsp;</td>
								<td colspan="3">&nbsp;<input type="text" class="input-medium" placeholder="Chouse Open Date..." id="start_time" onClick="WdatePicker({el:'start_time',dateFmt:'yyyy-MM-dd'});" /> - <input type="text" class="input-medium" placeholder="Chouse Open Date..." id="end_time" onClick="WdatePicker({el:'end_time',dateFmt:'yyyy-MM-dd'});" /></td>
							
								<td>&nbsp;<input type="button" class="btn btn-sm btn-success" id="btnQuery" value="Search" style="margin-left: 2px;"></input>&nbsp;</td>
								<td>&nbsp;<input id="btnAdd" class="btn btn-sm btn-info" value="Add" type="button">&nbsp;</td>
							</tr>
						</table>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">Plant：</td><td style="width:150px"><select id="new_plant" class="form-control" style="width:150px"></select></td>
						<td align="right" style="width:100px">Workshop：</td><td style="width:150px"><select id="new_workshop" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Line：</td><td style="width:150px"><select id="new_line" class="form-control" style="width:150px"></select></td>
						<td align="right" style="width:100px">AbnormalStation：</td><td style="width:150px"><select id="new_abnormalStation" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">BusNumber：</td><td style="width:150px"><input type="text" id="new_busNumber" class="form-control" style="width:150px" /></td>
						<td align="right" style="width:100px">AbnormalCause：</td><td style="width:150px"><select id="new_abnormal_cause" class="form-control" style="width:120px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">OpenDate：</td><td style="width:150px"><input type="text" class="input-medium" placeholder="Open Date..." id="new_opendate" onClick="WdatePicker({el:'new_opendate',dateFmt:'yyyy-MM-dd'});" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Detailed_Reason：</td><td colspan="3" style="width:150px"><input type="text" id="new_detailed_reason" class="form-control" style="width:300px" /></td>
					</tr>
					
					</table>
				</form>
			
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:1200px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:200px">Plant：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_plant" class="form-control" style="width:150px" /></td>
						<td align="right" style="width:100px">Workshop：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_workshop" class="form-control" style="width:150px" /><input type="text" id="edit_id" class="form-control" style="width:150px;display:none" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:200px">Line：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_line" class="form-control" style="width:150px" /></td>
						<td align="right" style="width:100px">AbnormalStation：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_abnormalStation" class="form-control" style="width:150px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:200px">BusNumber：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_busnumber" class="form-control" style="width:150px" /></td>
						<td align="right" style="width:100px">AbnormalCause：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_abnormalCause" class="form-control" style="width:150px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right">OpenDate：</td><td style="width:150px"><input type="text" disabled="disabled" id="edit_opendate" class="form-control" style="width:150px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Detailed_Reason：</td><td colspan="3" style="width:150px"><input type="text" disabled="disabled" id="edit_detailed_reason" class="form-control" style="width:300px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Responsible Department：</td><td colspan="3" style="width:150px"><select id="edit_responsibleDepartment" class="form-control" style="width:150px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Measures：</td><td colspan="3" style="width:150px"><input type="text" id="edit_measures" class="form-control" style="width:300px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Measures Time：</td><td style="width:150px"><input type="text" class="input-medium" placeholder="Measures Time..." id="edit_measuresTime" onClick="WdatePicker({el:'edit_measuresTime',dateFmt:'yyyy-MM-dd HH:mm'});" /></td>
					</tr>
					
					</table>
				</form>
			
			</div>

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
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
	<script type="text/javascript" src="../js/production/measureAbnormity.js"></script>
</html>
