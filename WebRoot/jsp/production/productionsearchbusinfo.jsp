<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Search Bus Information</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	    <link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
		<link rel="stylesheet" href="../assets/css/fixedColumns.dataTables.min.css" />
		<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/MES/index">Index</a></li>
						<li><a href="#">Manufacturing</a></li>
						<li class="active">Search Bus Information</li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" onkeydown="EnterPress()" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
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
								<td>Bus No.：</td>
								<td><input id="search_busnumber" style="height: 30px;width:200px" type="text"></td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-success" value="Search" style="margin-left: 2px;"></td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<div class="tabbable">
						<ul class="nav nav-tabs" id="myTab">
							<li id="div1" class="active"><a data-toggle="tab" href="#div_1">Basic Information</a></li>
							<li id="div5"><a data-toggle="tab" href="#div_5">Scanning Record</a></li>
							<li id="div2"><a data-toggle="tab" href="#div_2">Punch Record</a></li>
							<li id="div3"><a data-toggle="tab" href="#div_3">Bus Trace</a></li>
							<li id="div4"><a data-toggle="tab" href="#div_4">Inspection Record</a></li>
							<li id="div6"><a data-toggle="tab" href="#div_6">ECN Record</a></li>
						</ul>
						
						<div class="tab-content" id="tab-content">
							<div id="div_1" style="height:390px" class="tab-pane fade in active">
								<table id="table01" style="text-align:center;table-layout:fixed;font-size:12px;width:1150px" class="table table-bordered table-striped">
									<tr>
										<td width="165px">Project No.：</td><td id="tab01_order_no"></td><td width="165px">Bus No.：</td><td id="tab01_bus_number"></td><td width="165px">VIN：</td><td id="tab01_vin"></td>
									</tr>
									<tr>
										<td>Plant：</td><td id="tab01_factory_name"></td><td>Customer：</td><td id="tab01_customer"></td><td>Status：</td><td id="tab01_production_status"></td>
									</tr>				
									<tr>
										<td>Current Station：</td><td id="tab01_current_station"></td><td>Welding Online Date：</td><td id="tab01_welding_online_date"></td><td>Welding Offline Date：</td><td id="tab01_welding_offline_date"></td>
									</tr>
									<tr>
										<td>Painting Online Date：</td><td id="tab01_painting_online_date"></td><td>Painting Offline Date：</td><td id="tab01_painting_offline_date"></td><td>Chassis Online Date：</td><td id="tab01_chassis_online_date"></td>
									</tr>
									<tr>
										<td>Chassis Offline Date：</td><td id="tab01_chassis_offline_date"></td><td>Assembly Offline Date：</td><td id="tab01_assembly_online_date"></td><td>Assembly Offline Date：</td><td id="tab01_assembly_offline_date"></td>
									</tr>
									<tr>
										<td>Testing Date</td><td id="tab01_testing"></td><td>Outgoing Date：</td><td id="tab01_outgoing"></td><td>Delivery Date：</td><td id="tab01_delivery"></td>
									</tr>				
								</table>
							</div>
							<div id="div_5" style="overflow:auto;height:390px" class="tab-pane fade">
<!-- 								<table id="table05" class="table table-bordered" style="font-size: 12px;"> -->
<!-- 									<thead> -->
<!-- 										<tr> -->
<!-- 											<th style="text-align:center;">No.</th> -->
<!-- 											<th style="text-align:center;">Plant</th> -->
<!-- 											<th style="text-align:center;">Workshop</th> -->
<!-- 											<th style="text-align:center;">Station</th> -->
<!-- 											<th style="text-align:center;">Status</th> -->
<!-- 											<th style="text-align:center;">Scanner</th>	 -->
<!-- 											<th style="text-align:center;">Scan Date</th>							 -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody> -->
<!-- 									</tbody> -->
<!-- 								</table> -->
<!--                                 <div class="row"  >        style="width: calc(100vw + 15px)"-->
								    <div class="col-xs-12"> 
										<table id="table05" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1069px" >
										</table>
									</div>
<!-- 								</div> -->
							</div>
							
							<div id="div_2" style="overflow:auto;height:390px" class="tab-pane fade">
<!-- 								<table id="table02" style="text-align:center;table-layout:fixed;font-size:12px" class="table table-bordered table-striped"> -->
<!-- 									<thead> -->
<!-- 										<tr id="0"> -->
<!-- 											<th style="width:60px;text-align:center;">No.</th> -->
<!-- 											<th style="text-align:center;">Plant</th> -->
<!-- 											<th style="text-align:center;">Workshop</th> -->
<!-- 											<th style="text-align:center;">SourceWorkshop</th> -->
<!-- 											<th style="text-align:center;">Location</th> -->
<!-- 											<th style="text-align:center;">Orientation</th> -->
<!-- 											<th style="text-align:center;">Problem Description</th> -->
<!-- 											<th style="text-align:center;">DefectCodes</th> -->
<!-- 											<th style="text-align:center;">Responsible Leader</th> -->
<!-- 											<th style="text-align:center;">QC_Inspector</th> -->
<!-- 											<th style="text-align:center;">Date Found</th> -->
<!-- 											<th style="text-align:center;">Lead Initials</th> -->
<!-- 											<th style="text-align:center;">Lead Initials Date</th> -->
<!-- 											<th style="text-align:center;">Quality Initials</th> -->
<!-- 											<th style="text-align:center;">Quality Initials Date</th> -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody>	 -->
<!-- 									</tbody> -->
<!-- 								</table> -->
                                    <div class="col-xs-12"> 
										<table id="table02" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1570px" >
										</table>
									</div>
							</div>
							
							<div id="div_3" style="overflow:auto;height:390px" class="tab-pane fade">
<!-- 								<table id="table03" class="table table-bordered" style="font-size: 12px;"> -->
<!-- 									<thead> -->
<!-- 										<tr> -->
<!-- 											<th style="text-align:center;">Item No.</th> -->
<!-- 											<th style="text-align:center;">Bus No.</th> -->
<!-- 											<th style="text-align:center;">SAP Material</th> -->
<!-- 											<th style="text-align:center;">Parts Name</th> -->
<!-- 											<th style="text-align:center;">BYD P/N</th> -->
<!-- 											<th style="text-align:center;">Vendor</th> -->
<!-- 											<th style="text-align:center;">Workshop</th> -->
<!-- 											<th style="text-align:center;">Station</th> -->
<!-- 											<th style="text-align:center;">Batch</th> -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody> -->
<!-- 									</tbody> -->
<!-- 								</table> -->
                                <div class="col-xs-12"> 
									<table id="table03" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1069px" >
									</table>
								</div>
							</div>
							
							<div id="div_4" style="overflow:auto;height:390px" class="tab-pane fade">
<!-- 								<table id="table04" class="table table-bordered" style="font-size: 12px;"> -->
<!-- 									<thead> -->
<!-- 										<tr> -->
<!-- 											<th style="text-align:center;">No.</th> -->
<!-- 											<th style="text-align:center;">Bus No.</th> -->
<!-- 											<th style="text-align:center;">Inspection Item</th> -->
<!-- 											<th style="text-align:center;">Inspection And Standard</th> -->
<!-- 											<th style="text-align:center;">Workshop</th> -->
<!-- 											<th style="text-align:center;">Station</th> -->
<!-- 											<th style="text-align:center;">Process Name</th> -->
<!-- 											<th style="text-align:center;">Supervisor</th> -->
<!-- 											<th style="text-align:center;">Supervisor Date</th> -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody> -->
<!-- 									</tbody> -->
<!-- 								</table> -->
                                <div class="col-xs-12"> 
									<table id="table04" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1069px" >
									</table>
								</div>
							</div>
							
							
							<div id="div_6" style="overflow:auto;height:390px" class="tab-pane fade">
<!-- 								<table id="table06" style="text-align:center;table-layout:fixed;font-size:12px;width:1150px" class="table table-bordered table-striped"> -->
<!-- 									<thead> -->
<!-- 										<tr> -->
<!-- 											<th style="text-align:center;">No.</th> -->
<!-- 											<th style="text-align:center;">Item</th> -->
<!-- 											<th style="text-align:center;">Problem Details</th> -->
<!-- 											<th style="text-align:center;">Station</th> -->
<!-- 											<th style="text-align:center;">Supervisor</th> -->
<!-- 											<th style="text-align:center;">Supervisor Date</th> -->
<!-- 											<th style="text-align:center;">QC Inspection</th> -->
<!-- 											<th style="text-align:center;">QC Inspection Date</th> -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody> -->
<!-- 									</tbody> -->
<!-- 								</table> -->
                                <div class="col-xs-12"> 
									<table id="table06" class="table table-striped table-bordered table-hover" style="font-size: 12px;width:1069px" >
									</table>
								</div>
							</div>
							
<!-- 							<div id="div_7" style="overflow:auto" class="tab-pane fade"> -->
<!-- 								<table id="table07" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped"> -->
<!-- 									<tr> -->
<!-- 										<td width="130px;" style="text-align: right;">车辆识别代号：</td><td id="tab07_VIN"></td><td width="130px" style="text-align: right;">生产序号：</td><td id="tab07_sequence"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">车辆型号：</td><td id="tab07_vehicle_model"></td><td width="130px" style="text-align: right;">品牌：</td><td id="tab07_brand"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">电机型号：</td><td id="tab07_motor_model"></td><td width="130px" style="text-align: right;">电机最大功率：</td><td id="tab07_motor_power"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">乘员数：</td><td id="tab07_passenger"></td><td width="130px" style="text-align: right;">最大允许总质量：</td><td id="tab07_max_weight"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">电池型号：</td><td id="tab07_battery_model"></td><td width="130px" style="text-align: right;">电池容量：</td><td id="tab07_battery_capacity"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">最高车速：</td><td id="tab07_max_speed"></td><td width="130px" style="text-align: right;">灯光下倾值：</td><td id="tab07_light_downdip"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">额定电压：</td><td id="tab07_rated_voltage"></td><td width="130px" style="text-align: right;">生产日期：</td><td id="tab07_productive_date"></td> -->
<!-- 									</tr> -->
<!-- 								</table> -->
<!-- 							</div> -->
							
<!-- 							<div id="div_8" style="overflow:auto" class="tab-pane fade"> -->
<!-- 								<table id="table08" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped"> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">车身号：</td><td id="tab08_bus_number"></td><td width="130px" style="text-align: right;">VIN码：</td><td id="tab08_vin"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">底盘型号：</td><td id="tab08_chassis_model"></td><td width="130px" style="text-align: right;">整车型号：</td><td id="tab08_vehicle_model"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">电机型号：</td><td id="tab08_motor_model"></td><td width="130px" style="text-align: right;">电机号：</td><td id="tab08_motor_number"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">颜色：</td><td id="tab08_bus_color"></td><td width="130px" style="text-align: right;">座位数：</td><td id="tab08_bus_seats"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">轮胎规格：</td><td id="tab08_tire_type"></td><td width="130px" style="text-align: right;">弹簧片数：</td><td id="tab08_plates"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">额定载客人数：</td><td id="tab08_passengers"></td><td width="130px" style="text-align: right;">CCC证书签发日期：</td><td id="tab08_ccc_date"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">底盘公告生效日期：</td><td id="tab08_chassis_notice_date"></td><td width="130px" style="text-align: right;">整车公告生效日期：</td><td id="tab08_production_notice_date"></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td width="130px" style="text-align: right;">底盘生产日期：</td><td id="tab08_chassis_date"></td><td width="130px" style="text-align: right;">整车生产日期：</td><td id="tab08_production_date"></td> -->
<!-- 									</tr> -->
<!-- 								</table> -->
<!-- 							</div> -->
							
<!-- 							<div id="div_9" style="overflow:auto" class="tab-pane fade"> -->
<!-- 								<table id="table09" style="text-align:center;table-layout:fixed;font-size:12px;" class="table table-bordered table-striped"> -->
<!-- 									<thead> -->
<!-- 										<tr id="0"> -->
<!-- 											<th style="width:60px;text-align:center;">序号</th> -->
<!-- 											<th style="width:130px;text-align:center;">车辆车号</th> -->
<!-- 											<th style="text-align:center;">生产工厂</th> -->
<!-- 											<th style="text-align:center;">生产车间</th> -->
<!-- 											<th style="text-align:center;">生产线别</th> -->
<!-- 											<th style="text-align:center;">生产工序</th> -->
<!-- 											<th style="text-align:center;">严重等级</th> -->
<!-- 											<th style="text-align:center;">处理措施</th> -->
<!-- 											<th style="text-align:center;">异常记录点</th> -->
<!-- 											<th style="text-align:center;">异常原因</th> -->
<!-- 											<th style="text-align:center;">责任部门</th> -->
<!-- 											<th style="text-align:center;">状态</th> -->
<!-- 										</tr> -->
<!-- 									</thead> -->
<!-- 									<tbody>	 -->
<!-- 									</tbody> -->
<!-- 								</table> -->
<!-- 							</div> -->
							
<!-- 							<div id="div_10" style="overflow:auto" class="tab-pane fade"> -->
<!-- 								<table id="table10" style="text-align:center;font-size:12px" class="table table-bordered table-striped"> -->
<!-- 									<thead> -->
<!-- 											<tr> -->
<!-- 												<th style="text-align:center;">序号</th> -->
<!-- 												<th style="text-align:center;">技改任务</th> -->
<!-- 												<th style="text-align:center;">技改单编号</th> -->
<!-- 												<th style="text-align:center;">技改工厂</th> -->
<!-- 												<th style="text-align:center;">技改车间</th> -->
<!-- 												<th style="text-align:center;">确认人</th> -->
<!-- 												<th style="text-align:center;">确认时间</th> -->
<!-- 											</tr> -->
<!-- 										</thead> -->
<!-- 										<tbody> -->
<!-- 										</tbody> -->
<!-- 									</table> -->
<!-- 							</div> -->
							
<!-- 							<div id="div_11" style="overflow:auto" class="tab-pane fade"> -->
<!-- 								<table id="table08" style="text-align:center;table-layout:fixed;font-size:12px;width:1000px" class="table table-bordered table-striped"> -->
<!-- 									<tr> -->
<!-- 										<td width="220px" style="text-align: right;">VIN号：</td><td id=""></td> -->
<!-- 										<td width="180px" style="text-align: right;">车牌号：</td><td id=""></td> -->
<!-- 										<td width="180px" style="text-align: right;">动力电池电压（V）：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">电池组当前总电流（A）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">SOC（%）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">输出电流（A）：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">所有单体电池端电压最小值（V）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">最低电压电池号（#）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">总里程（km）：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">所有单体电池端电压最大值（V）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">最高电压电池号（#）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">动力电池最低温度（°C）：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">最低温度电池号（#）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">动力电池最高温度（°C）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">最高温度电池号（#）：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">电机转速（rpm）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">档位：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">车速：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">手刹信号：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">驻车制动开关：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">制动开关：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">制动踏板深度（%）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">加速踏板深度（%）：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">近光灯：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">左转向灯：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">倒车灯：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">远光灯：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 									<tr> -->
<!-- 										<td style="text-align: right;">右转向灯：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">刹车灯：</td><td id=""></td> -->
<!-- 										<td style="text-align: right;">前雾灯：</td><td id=""></td> -->
<!-- 									</tr> -->
<!-- 								</table> -->
<!-- 							</div> -->
							
						</div>
						
					</div>
					
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/ace/elements.onpage-help.js"></script>
	<script src="../assets/js/ace/ace.onpage-help.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/production/productionsearchbusinfo.js"></script>
</html>
