<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>异常登记</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a
							href="/BMS/index">首页</a></li>
						<li><a href="#">生产执行</a></li>
						<li><a href="#">异常登记</a></li>
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
									<label><b>车号：</b></label> <input class="input-medium"
										style="height: 30px;" placeholder="请扫描/输入车号..." id="vinText"
										type="text"> <input style="display: none"
										class="input-medium" placeholder="请扫描/输入车号..." id="vinText2"
										type="text"> <select name="exec_type" id="exec_type"
										class="input-small">
										<option value="正常">正常</option>
										<!-- <option value="返修">返修</option>
										<option value="技改">技改</option> -->
									</select> <select name="exec_onoff" id="exec_onoff" class="input-small"
										style="display: none">
										<option value="上线">上线</option>
										<option value="下线">下线</option>
									</select> <input class="btn btn-sm btn-primary" disabled="disabled"
										id="btnSubmit" value="确定" type="button"> <input
										class="btn btn-sm" id="reset" value="清空" type="button">
									<input id="currentNode" name="currentNode" value="485"
										type="hidden">
									<!-- 修改为对应的NodeID -->
									<input id="line" name="currentLine" value="涂装工厂I线"
										type="hidden"> <span class="help-inline" id="vinHint">请输入车号后回车</span>
									<!-- 	<label><b>关键零部件：</b></label><input type="text" placeholder="请扫描关键零部件" style="padding-top:5px;" /> -->

									<div class="help-inline" id="carInfo"
										style="display: inline-block;">
										<span class="label label-info" rel="tooltip" title="VIN"
											id="infoVIN"></span> <span class="label label-info"
											rel="tooltip" title="订单" id="infoOrder"></span> <span
											class="label label-info" rel="tooltip" title="当前车间"
											id="infoWorkShop"></span> <span class="label label-info"
											rel="tooltip" title="当前线别" id="infoLine"></span> <span
											class="label label-info" rel="tooltip" title="当前工位"
											id="infoProcess"></span> <span class="label label-info"
											rel="tooltip" title="配置" id="infoConf"></span> <span
											class="label label-info" rel="tooltip" title="状态"
											id="infoStatus"></span> <span class="label label-info"
											rel="tooltip" title="颜色" id="infoColor"></span> <span
											class="label label-info" rel="tooltip" title="座位数"
											id="infoSeats"></span>
									</div>
								</form>
							</div>
							<!-- end 主体 -->

							<div>
								<div id="messageAlert" class="alert"></div>
							</div>
							<!-- end 提示信息 -->

							<h5 class="row header smaller lighter blue"
								style="padding-left: 12px; margin-top: 10px; margin-bottom: 0px; border-bottom: none">节点信息：</h5>
							<div class="widget-box" style="opacity: 1;">
								<div class="widget-body">
									<div class="widget-main" style="padding: 6px;">
										<div style="height: 70px" class="accordion-inner"
											id="TodayMiddlePlanDiv">
											<table id="TodayWaxPlanTable" style="width: 700px"
												class="table-condensed">
												<tr>
													<td align="left">&nbsp;生产工厂</td>
													<td align="left">&nbsp;生产车间</td>
													<td align="left">&nbsp;生产线别</td>
													<td align="left">&nbsp;监控点</td>
													<td align="left">&nbsp;监控名</td>
													<td align="left">&nbsp;操作员</td>
												</tr>
												<tr>
													<td><select name="exec_factory"
														id="exec_factory" class="input-small">
													</select></td>
													<td><select name="exec_workshop"
														id="exec_workshop" class="input-small">
													</select></td>
													<td><select name="exec_line" id="exec_line"
														class="input-small">
													</select></td>
													<td><select name="exec_process" id="exec_process"
														class="input-small">
													</select></td>
													<td><input type="text" disabled="disabled"
														style="height: 30px;" name="exec_processname"
														id="exec_processname" class="input-medium"></td>
													<td><select name="exec_user" id="exec_user"
														class="input-small">
															<option value="<%=session.getAttribute("user_id")%>"><%=session.getAttribute("display_name")%></option>
													</select></td>
												</tr>
											</table>
										</div>

									</div>
								</div>
							</div>

							<div class="col-xs-8">
								<h5 class="row header smaller lighter blue"
									style="padding-left: 0px; margin-top: 10px; margin-bottom: 0px; border-bottom: none;">异常信息：</h5>
							</div>
							<div class="col-xs-4">
								<h5 class="row header smaller lighter blue"
									style="padding-left: 10px; margin-top: 10px; margin-bottom: 0px; border-bottom: none">登记信息：</h5>
							</div>

							<div class=" widget-box col-xs-8" style="opacity: 1;padding: 10px;" >
								<div class="widget-body" style="margin-left: -10px;">
									<div class="widget-main" style="padding: 6px;">
										<div style="height: 250px;" class="accordion-inner"
											id="TodayMiddlePlanDiv">
											<table id="TodayWaxPlanTable2"
												style="width: 100%; margin-bottom: 0px"
												class="table table-condensed">
												<thead>
													<tr>
														<td align="left">异常类别</td>
														<td class="">缺料原因</td>
														<td class="">开始时间</td>
														<td class="">严重等级</td>
													</tr>
													<tr>
														<td><select name="reason_type" id="reason_type"
															class="input-medium">
														</select></td>
														<td><select name="lack_reason" id="lack_reason"
															class="input-medium">
														</select></td>
														<td><input type="text" class="input-medium"
															placeholder="选择开始时间..." id="start_time"
															onClick="WdatePicker({el:'start_time',dateFmt:'yyyy-MM-dd HH:mm'});" />
														</td>
														<td><select name="severity_level" id="severity_level"
															class="input-medium">
																<option value="0">不影响</option>
																<option value="1">普通</option>
																<option value="2">严重</option>
														</select></td>
													</tr>
											</table>
											
											<div style="padding-top:10px;margin-left:15px;"><span style="color:#707070">详细原因：</span><textarea style="width:100%" class="input-xlarge" id="detailed_reasons" rows="2"></textarea></div>
										</div>									
									</div>
								</div>
							</div>

							<div class="col-xs-4">
								<div class="widget-body">
								<table id="dispatchDetail" class="table table-bordered">
								<thead>
								<tr>
									<td width='70%'>已登记车号</td>
									<td>删除</td>
								</tr>
								</thead>
									<tbody>
					
									</tbody>
								</table>
								</div>
							</div>
							
						</div>
					</div>
				</div>

				<div id="dialog-config" class="hide">
					<form id="  " class="form-horizontal">
						<div class="control-group">
							<label class="control-label" for="vin">*&nbsp;vin号</label>
							<div class="controls">
								<input type="text" id="vin" placeholder="vin号..."
									class="input-medium" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label" for="left_motor_number">*&nbsp;左电机号</label>
							<div class="controls">
								<input type="text" id="left_motor_number" placeholder="左电机号..."
									class="input-medium" />
							</div>
						</div>
						<div class="control-group">
							<label class="control-label" for="right_motor_number">*&nbsp;右电机号</label>
							<div class="controls">
								<input type="text" id="right_motor_number" placeholder="右电机号..."
									class="input-medium" />
							</div>
						</div>
					</form>
				</div>

			</div>
			<!-- /.main-container -->
		</div>
		<script src="../js/datePicker/WdatePicker.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/production/productionException.js"></script>
	</div>
</body>
</html>