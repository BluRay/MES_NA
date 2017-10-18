<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Punch Initials</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
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
						<li><a href="#">Quality</a></li>
						<li class="active">Punch Initials</li>
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
								<td>&nbsp;Status : &nbsp;</td>
								<td>&nbsp;<select id="search_status" class="input-small" style="height: 30px;width:60px"><option value="0">All</option><option value="1">Processing</option><option value="2">Closed</option></select></td>
								<td>&nbsp;BusNo : &nbsp;</td>
								<td>&nbsp;<input id="search_busno" placeholder="Bus No..." style="height: 30px;width:100px" type="text"></td>
								<td>&nbsp;<input type="button" class="btn btn-sm btn-success" id="btnQuery" value="Search" style="margin-left: 2px;"></input>&nbsp;</td>
								<td>&nbsp;&nbsp;</td>
							</tr>
						</table>
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-lead" class="hide" style="align:center;width:700px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">BusNumber：</td><td colspan="3"><input type="text" disabled="disabled" id="lead_busNumber" placeholder="BusNumber..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Plant：</td><td style="width:150px"><input type="text" disabled="disabled" id="lead_plant" placeholder="Plant..." class="form-control" style="width:250px" /></td>
						<td align="right" style="width:100px">Workshop：</td><td style="width:150px"><input type="text" disabled="disabled" id="lead_workshop" placeholder="Workshop..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Source Workshop：</td><td style="width:150px"><input type="text" disabled="disabled" id="lead_src_workshop" placeholder="Source Workshop..." class="form-control" style="width:250px" /></td>
						<td align="right" style="width:100px">Location：</td><td style="width:150px"><input type="text" disabled="disabled" id="lead_location" placeholder="Location..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Orientation：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="Orientation..." id="lead_orientation" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">ProblemDescription：</td><td colspan="3"><input type="text" disabled="disabled" id="lead_problemDescription" placeholder="ProblemDescription..." class="form-control" style="width:400px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Defect Codes：</td><td colspan="3"><input type="text" disabled="disabled" id="lead_defectcodes" placeholder="Defect Codes..." class="form-control" style="width:400px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Responsible Leader：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="Responsible Leader..." id="lead_responsibleleader" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">QC inspector：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="QC inspector..." id="lead_QCinspector" /></td>
					</tr>
					
					</table>
				</form>
			
			</div>
			
			<div id="dialog-qc" class="hide" style="align:center;width:1200px;height:500px">
				<form>
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">BusNumber：</td><td colspan="3"><input type="text" disabled="disabled" id="qc_busNumber" placeholder="BusNumber..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Plant：</td><td style="width:150px"><input type="text" disabled="disabled" id="qc_plant" placeholder="Plant..." class="form-control" style="width:250px" /></td>
						<td align="right" style="width:100px">Workshop：</td><td style="width:150px"><input type="text" disabled="disabled" id="qc_workshop" placeholder="Workshop..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Source Workshop：</td><td style="width:150px"><input type="text" disabled="disabled" id="qc_src_workshop" placeholder="Source Workshop..." class="form-control" style="width:250px" /></td>
						<td align="right" style="width:100px">Location：</td><td style="width:150px"><input type="text" disabled="disabled" id="qc_location" placeholder="Location..." class="form-control" style="width:250px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Orientation：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="Orientation..." id="qc_orientation" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">ProblemDescription：</td><td colspan="3"><input type="text" disabled="disabled" id="qc_problemDescription" placeholder="ProblemDescription..." class="form-control" style="width:400px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Defect Codes：</td><td colspan="3"><input type="text" disabled="disabled" id="qc_defectcodes" placeholder="Defect Codes..." class="form-control" style="width:400px" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">Responsible Leader：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="Responsible Leader..." id="qc_responsibleleader" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">QC inspector：</td><td style="width:150px"><input type="text" disabled="disabled" class="form-control" placeholder="QC inspector..." id="qc_QCinspector" /></td>
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
	<script type="text/javascript" src="../js/quality/punchInitials.js"></script>
</html>
