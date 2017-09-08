<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../css/bootstrap.3.2.css">
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../css/bootstrap-table.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css">
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../css/common.css">
<style type="text/css" media="screen">
.myselect {
	border: 0px none;
	-moz-appearance: none;
	-webkit-appearance: none;
	font-size: 100%;
	margin-bottom: 3px;
	color: #555;
	background-color: #f5f5f5;
	width: 56px;
	padding: 0px;
	height: 27px;
	cursor: pointer;
	margin-left: -8px;
}

.header {
	padding-left: 12px;
	margin-top: 10px;
	margin-bottom: 0px;
	border-bottom: none;
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
							href="/BMS/index">首页</a></li>
						<li><a href="executionindex">车间工序</a></li>
						<li><a href="#">车辆扫描</a></li>
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
									<label><b>车号：</b></label> <input type="text"
										class="input-medium" style="height: 30px;"
										placeholder="请扫描/输入车号..." id="vinText"> <input
										type="text" style="display: none" class="input-medium"
										style="height: 30px;" placeholder="请扫描/输入车号..." id="vinText2">
									<select name="exec_type" id="exec_type" class="input-small" >
										<option value="正常">正常</option>
										<!-- <option value="返修">返修</option>
										<option value="技改">技改</option> -->
									</select> 
									<select name="exec_onoff" id="exec_onoff" class="input-small" style="display:none">
										<option value="上线">上线</option>
										<option value="下线">下线</option>
									</select> <input type="button" class="btn btn-sm btn-primary"
										disabled="disabled" id="btnSubmit" value="确定"></input> <input
										type="button" class="btn btn-sm" id="reset" value="清空"></input>
									<input type="hidden" id='currentNode' name='currentNode'
										value='485'></input>
									<!-- 修改为对应的NodeID -->
									<input type="hidden" id='line' name='currentLine'
										value='涂装工厂I线'></input> <span class="help-inline" id="vinHint">请输入车号后回车</span>
									<!-- 	<label><b>关键零部件：</b></label><input type="text" placeholder="请扫描关键零部件" style="padding-top:5px;" /> -->

									<div class="help-inline" id="carInfo" style="display: inline-block;">
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
								<!-- <div class="widget-header" >
							<h6 class="widget-title">节点信息：</h6>
				</div>  -->
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
													<td><select disabled="disabled" name="exec_factory"
														id="exec_factory" class="input-small">
													</select></td>
													<td><select disabled="disabled" name="exec_workshop"
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
									style="padding-left: 0px; margin-top: 10px; margin-bottom: 0px; border-bottom: none">关键零部件：</h5>
							</div>
							<div class="col-xs-4">
								<h5 class="row header smaller lighter blue"
									style="padding-left: 0px; margin-top: 10px; margin-bottom: 0px; border-bottom: none">配置信息：</h5>
							</div>

							<div class="col-xs-8">
								<table id="partsListTable" style="width: 1500px; margin-left: -12px;" class="table  table-bordered">
									<thead>
										<tr>
											<td align="left" width="10%">物料编码</td>
											<td align="left" width="15%">零部件编号</td>
											<td align="left" width="20%">零部件名称</td>
											<td align="left" width="15%">材料/规格</td>
											<td align="left" width="25%">供应商</td>
											<td align="left" width="15%">批次</td>
										</tr>
									</thead>
									<tbody>
							
									</tbody>
								</table>
							</div>

							<div class="col-xs-4">
								<table id="configListTable" style="max-width: 110%; width: 107%; margin-left: -12px;" class="table  table-bordered">
									<thead>
										<tr>
											<td align="left" width="30%">零部件类别</td>
											<td align="left" width="70%">供应商</td>
										</tr>
									</thead>
									<tbody>
									
									</tbody>
								</table>
							</div>

						</div>
					</div>
				</div>				
<!-- 				<div class="modal" id="newModal" tabindex="-1" role="dialog"
					aria-hidden="true" >
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal"
							aria-hidden="true">×</button>
						<h3>校验</h3>
					</div>
					<div class="modal-body">
						
					</div>
					<div class="modal-footer">
						<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
						<button class="btn btn-success" id="btnTest">TEST</button>
						<button class="btn btn-primary" id="btnAddConfirm">确认</button>
					</div>
				</div> -->
			<div id="dialog-config" class="hide">
					<form id="  " class="form-horizontal">
							<div class="form-group">
								<label class="control-label col-sm-4" for="vin">*&nbsp;vin号</label>
								<div class="controls col-sm-8">
									<input type="text" id="vin" placeholder="vin号..."
										class="input-medium" />
								</div>
							</div>
							<div class="form-group">
								<label class="control-label col-sm-4" for="left_motor_number">*&nbsp;左电机号</label>
								<div class="controls col-sm-8">
									<input type="text" id="left_motor_number" placeholder="左电机号..."
										class="input-medium" />
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-4 control-label" for="right_motor_number">*&nbsp;右电机号</label>
								<div class="controls col-sm-8">
									<input type="text" id="right_motor_number"
										placeholder="右电机号..." class="input-medium" />
								</div>
							</div>
						</form>		
				</div>
			</div>
			<!-- /.main-container -->
			
		</div>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/production/productionExecution.js"></script>
</div>
</body>
</html>