<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>Abnormity</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../css/bootstrap.3.2.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css">
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../css/common.css">
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="#">Production</a></li>
						<li><a href="#">Abnormity</a></li>
					</ul>
					<!-- /.breadcrumb -->

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
							<div>
								<!-- 内容主体 -->
								<form id="form" class="well form-search">
									<label><b>Bus No.：</b></label>
									<input class="input-medium" style="height: 30px;" placeholder="Bus No...." id="vinText" type="text"> 
									<input class="btn btn-sm btn-primary" disabled="disabled" id="btnSubmit" value="确定" type="button"> 
									<input class="btn btn-sm" id="reset" value="清空" type="button">
									<input id="currentNode" name="currentNode" value="485" type="hidden">
									<span class="help-inline" id="vinHint">请输入车号后回车</span>

									<div class="help-inline" id="carInfo" style="display: inline-block;">
										<span class="label label-info" rel="tooltip" title="VIN" id="infoVIN"></span> 
										<span class="label label-info" rel="tooltip" title="Project" id="infoOrder"></span> 
										<span class="label label-info" rel="tooltip" title="Workshop" id="infoWorkShop"></span> 
										<span class="label label-info" rel="tooltip" title="Line" id="infoLine"></span> 
										<span class="label label-info" rel="tooltip" title="Process" id="infoProcess"></span> 
										<span class="label label-info" rel="tooltip" title="Config" id="infoConf"></span> 
										<span class="label label-info" rel="tooltip" title="Status" id="infoStatus"></span> 
										<span class="label label-info" rel="tooltip" title="Color" id="infoColor"></span> 
										<span class="label label-info" rel="tooltip" title="Seats" id="infoSeats"></span>
									</div>
								</form>
							</div>

							<h5 class="row header smaller lighter blue" style="padding-left: 12px; margin-top: 10px; margin-bottom: 0px; border-bottom: none">Node Info：</h5>
							<div class="widget-box" style="opacity: 1;">
								<div class="widget-body">
									<div class="widget-main" style="padding: 6px;">
										<div style="height: 140px" class="accordion-inner" id="TodayMiddlePlanDiv">
											<table id="TodayWaxPlanTable" style="width: 900px" class="table-condensed">
												<tr>
													<td align="left">&nbsp;Abnormal Bus No.</td>
													<td colspan="5" align="left"><input type="text" name="tags" style="width:500px" id="form-field-tags" value="" /></td>
												</tr>
												<tr>
													<td align="left">&nbsp;Plant:</td>
													<td align="left">&nbsp;Workshop:</td>
													<td align="left">&nbsp;Line:</td>
													<td align="left">&nbsp;Station:</td>
													<td align="left">&nbsp;Operator:</td>
													<td width="35%" align="left"></td>
												</tr>
												<tr>
													<td><select name="exec_factory" id="exec_factory" class="input-small"></select></td>
													<td><select name="exec_workshop" id="exec_workshop" class="input-small"></select></td>
													<td><select name="exec_line" id="exec_line" class="input-small"></select></td>
													<td><select name="exec_process" id="exec_process" class="input-small"></select></td>
													<td><select name="exec_user" id="exec_user" class="input-small"> <option value="<%=session.getAttribute("user_id")%>"><%=session.getAttribute("display_name")%></option></select></td>
													<td width="35%" align="left"></td>
												</tr>
											</table>
										</div>

									</div>
								</div>
							</div>

							<div class="col-xs-8">
								<h5 class="row header smaller lighter blue" style="padding-left: 0px; margin-top: 10px; margin-bottom: 0px; border-bottom: none;">Exception Info：</h5>
							</div>

							<div class=" widget-box col-xs-12" style="opacity: 1;padding: 10px;" >
								<div class="widget-body" style="margin-left: -10px;">
									<div class="widget-main" style="padding: 6px;">
										<div style="height: 250px;" class="accordion-inner" id="TodayMiddlePlanDiv">
											<table id="TodayWaxPlanTable2" style="width: 100%; margin-bottom: 0px" class="table table-condensed">
												<thead>
													<tr>
														<td align="left">Abnormal Cause:</td>
														<td class="">Open Date:</td>
														<td width="30%"></td><td width="30%"></td>
													</tr>
													<tr>
														<td><select name="reason_type" id="reason_type" class="input-medium"></select></td>
														<td><input type="text" class="input-medium" placeholder="Chouse Open Date..." id="start_time" onClick="WdatePicker({el:'start_time',dateFmt:'yyyy-MM-dd HH:mm'});" /></td>
														<td></td><td></td>
													</tr>
											</table>
											
											<div style="padding-top:10px;margin-left:15px;"><span style="color:#707070">Detailed Reasons：</span><textarea style="width:100%" class="input-xlarge" id="detailed_reasons" rows="2"></textarea></div>
										</div>									
									</div>
								</div>
							</div>
							
						</div>
					</div>
				</div>

			</div>
			<!-- /.main-container -->
		</div>
		<script src="../js/datePicker/WdatePicker.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/bootstrap-tag.min.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/production/abnormity.js"></script>
	</div>
</body>
</html>