<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>BMS 车型</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" /> 
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
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
					<li><a href="#">系统设置</a></li>
					<li class="active">车型</li>
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
				<div id="form" class="well form-search">
					<table>
						<tr>
							<td>车型编号：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="请输入车型编号..." value=""
								id="search_busTypeCode" /></td>
							<td><input type="button"
								class="btn btn-sm btn-primary btnQuery" id="btnQuery" value="查询"
								style="margin-left: 2px;"></input>
								<button id='btnAdd' class="btn btn-sm btn-success">新增</button></td>
						</tr>
					</table>
				</div>

				<div class="row"  >
					<div class="col-xs-12"  style="width:100%">
						<table id="tableData" 
							class="table table-striped table-bordered table-hover"
							style="font-size: 12px; width:1500px;overflow-x:auto" >
						</table>
					</div>
				</div>
			</div>

			<div id="dialog-edit" class="hide">
				<form id="" class="form-horizontal">
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderName">*&nbsp;车辆型号</label>
							<div style="float:left;width:70%" class="col-sm-8">
							    <input type="hidden" id="editId" />
								<input type="text" class="input-medium" id="edit_busTypeCode" />
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderName">*&nbsp;车辆内部名称</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<select name="" id="edit_internalName" class="input-medium"></select>
								<!-- <input type="text" class="input-medium" placeholder="车辆内部名称..." id="edit_internalName" /> -->
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newVehicleModel">*&nbsp;车辆类型</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_vehicleModel" />
							</div>
						</div>
						<div style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newChassisModel">*&nbsp;底盘型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_chassisModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newVehicleLength">*&nbsp;车辆长度</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_vehicleLength" />mm
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMotorModel">*&nbsp;电机型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_motorModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newWheelbase">*&nbsp;轴距</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_wheelbase" />mm
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMotorPower">*&nbsp;电机最大功率</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_motorPower" />KW
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newBatteryCapacity">*&nbsp;电池容量</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_batteryCapacity" />AH
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newBatteryModel">*&nbsp;电池型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_batteryModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newPassengerNum">*&nbsp;座位数</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_passengerNum" />人
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newRatedVoltage">*&nbsp;额定电压</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_ratedVoltage" />V
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMaxSpeed">*&nbsp;最高车速</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_maxSpeed" />km/h
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMaxWeight">*&nbsp;最大允许质量</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_maxWeight" />KG
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="editPassager">*&nbsp;额定载客人数</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_passenger" />人
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newLightDowndip">*&nbsp;灯光倾下值</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" id="edit_lightDowndip" />
							</div>
						</div>
					</div>
				</form>
			</div>
			
			<div id="dialog_add" class="hide" >
				<form id="" class="form-horizontal">
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderName">*&nbsp;车辆型号</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="车辆型号..." id="add_busTypeCode" />
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newOrderName">*&nbsp;车辆内部名称</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<select name="" id="add_internalName" class="input-medium"></select>
								<!-- <input type="text" class="input-medium" placeholder="车辆内部名称..." id="add_internalName" /> -->
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newVehicleModel">*&nbsp;车辆类型</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="车辆类型..." id="add_vehicleModel" />
							</div>
						</div>
					    <div style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newChassisModel">*&nbsp;底盘型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="底盘型号..." id="add_chassisModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newVehicleLength">*&nbsp;车辆长度</label>
							<div style="float:left;width:65%;margin-right:1px" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="车辆长度..." id="add_vehicleLength" />mm
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMotorModel">*&nbsp;电机型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="电机型号..." id="add_motorModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newWheelbase">*&nbsp;轴距</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="轴距..." id="add_wheelbase" />mm
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMotorPower">*&nbsp;电机最大功率</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="电机最大功率..." id="add_motorPower" />KW
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newBatteryCapacity">*&nbsp;电池容量</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="电池容量..." id="add_batteryCapacity" />AH
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newBatteryModel">*&nbsp;电池型号</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="电池型号..." id="add_batteryModel" />
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newPassengerNum">*&nbsp;座位数</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="乘员数..." id="add_passengerNum" />人
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newRatedVoltage">*&nbsp;额定电压</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="额定电压..." id="add_ratedVoltage" />V
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMaxSpeed">*&nbsp;最高车速</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="最高车速..." id="add_maxSpeed" />km/h
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newMaxWeight">*&nbsp;最大允许质量</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="最大允许质量..." id="add_maxWeight" />KG
							</div>
						</div>
					</div>
					<div class="form-group">
					    <div style="float:left;width:45%">
							<label style="float:left;width:30%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newPassager">*&nbsp;额定载客人数</label>
							<div style="float:left;width:70%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="额定载客人数..." id="add_passenger" />人
							</div>
						</div>
						<div  style="float:left;width:55%">
							<label style="float:left;width:40%" class="col-sm-3 col-sm-3 control-label no-padding-right no-padding-right" for="newLightDowndip">*&nbsp;灯光倾下值</label>
							<div style="float:left;width:60%" class="col-sm-8">
								<input type="text" class="input-medium" placeholder="灯光倾下值..." id="add_lightDowndip" />
							</div>
						</div>
					</div>
				</form>
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
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jsrender.min.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/setting/busType.js"></script>
</body>

</html>
