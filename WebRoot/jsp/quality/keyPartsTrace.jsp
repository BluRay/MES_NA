<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Bus Trace</title>
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
						<li><a href="#">Quality</a></li>
						<li class="active">Bus Trace</li>
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
								<td>Bus Type：</td>
								<td><select name="" id="search_bus_type" class="input-small carType"></select></td>
								<td>&nbsp;Project No.：</td>
								<td><input id="search_project_no"  style="width:90px" type="text" ></td>
								
<!-- 								<td>&nbsp;Plant：</td> -->
<!-- 								<td><select id="search_factory" class="form-control" style="width:100px"></select></td> -->
								<td>&nbsp;Bus No.：</td>
								<td><input id="search_busNumber"  style="width:150px" type="text" > </td>
								<td>
								    <input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 10px;"></input>
<!-- 								    <input id="btnAdd" type="button" class="btn btn-sm btn-success" value="新增" style="margin-left: 2px;"></input> -->
								</td>
							</tr>
						</table>	
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="overflow-x:auto;font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:1200px;height:600px;">
				<form id="form_add" class="">
					<table>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 车辆型号：</td><td style="width:150px">
						<select name="" id="new_bus_type" class="input-medium busType">
							</select>
							<script id="tmplBusTypeSelect" type="text/x-jsrander">
                            	<option value='{{:id}}'>{{:code}}</option>
                            </script>
						</td>
						<td align="right" style="width:100px">*故障反馈日期：</td><td style="width:150px"><input type="text" class="input-medium" id="new_fault_date" name="new_fault_date" onClick="WdatePicker({el:'new_fault_date',dateFmt:'yyyy-MM-dd'});" style="width:150px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 故障里程：</td><td style="width:150px"><input type="text" class="input-medium" id="new_fault_mils" name="new_fault_mils" style="width:150px" /></td>
						<td align="right" style="width:100px">*客户名称：</td><td style="width:150px"><input type="text" class="input-medium" id="new_customer_name" name="new_customer_name" style="width:150px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 车牌号码：</td><td style="width:150px"><input type="text" class="input-medium" id="new_license_number" name="new_license_number" style="width:150px" /></td>
						<td align="right" style="width:100px">*VIN号：</td><td style="width:150px"><input type="text" class="input-medium" id="new_vin" name="new_vin" style="width:150px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 故障等级：</td><td style="width:150px"><select class="input-medium" id="new_fault_level_id" style="width:150px"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option></select></td>
						<td align="right" style="width:100px">*问题性质：</td><td style="width:150px"><select class="input-medium" id="new_is_batch" style="width:150px"><option value="0">非批量</option><option value="1">批量</option></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 故障现象：</td><td colspan=3><input type="text" class="input-medium" id="new_fault_phenomenon" style="width:400px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">* 故障原因：</td><td colspan=3><input type="text" class="input-medium" id="new_fault_reason" style="width:400px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">责任工厂：</td><td style="width:150px"><select id="new_factory" class="input-small" style="width:150px"></select></td>
						<td align="right" style="width:100px">责任车间：</td><td style="width:150px"><select id="new_workshop" class="input-small" style="width:80px"></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">解决方法：</td><td colspan=3><input type="text" class="input-medium" id="new_resolve_method" style="width:400px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">处理时间：</td><td style="width:150px"><input type="text" class="input-medium" id="new_resolve_date" style="width:150px" onClick="WdatePicker({el:'new_resolve_date',dateFmt:'yyyy-MM-dd'});"/></td>
						<td align="right" style="width:100px">处理结果：</td><td style="width:150px"><select class="input-medium" id="new_resolve_result" style="width:150px"><option value="0">关闭</option><option value="1">受理</option></select></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">问题报告：</td><td colspan=3><input name="new_report_file" type="file" id="new_report_file" /></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">处罚情况：</td><td style="width:150px"><input type="text" class="input-medium" id="new_punish" style="width:150px" /></td>
						<td align="right" style="width:100px">索赔情况：</td><td style="width:150px"><input type="text" class="input-medium" id="new_compensation" style="width:150px"/></td>
					</tr>
					<tr style="height:40px">
						<td align="right" style="width:100px">备注信息：</td><td colspan=3><input type="text" class="input-medium" id="new_memo" style="width:400px"/></td>
					</tr>
					</table>
				</form>
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:900px;height:600px">
				<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right" for="" >&nbsp;Bus No.：</label>
						<label id="bus_number" class="col-sm-4  no-padding-left"  style="margin-left:15px;"></label>
					</div>
				<div class = "div-dialog">
					<form id="form_edit">
						<table id="tableDataDetail" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 12px;" role="grid" aria-describedby="tableData_info">
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
	<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../assets/js/ace/elements.fileinput.js"></script>
	<script type="text/javascript" src="../js/jquery.form.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/jsrender.min.js"></script>
	<script type="text/javascript" src="../js/quality/keyPartsTrace.js"></script>
</html>
