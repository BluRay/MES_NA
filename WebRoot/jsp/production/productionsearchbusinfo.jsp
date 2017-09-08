<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>车辆信息查询</title>
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
						<li><a href="#">生产执行</a></li>
						<li class="active">车辆信息查询</li>
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
								<td>车号/VIN号：</td>
								<td><input id="search_busnumber" placeholder="请输入车号/VIN号..." style="height: 30px;width:200px" type="text"></td>
								<td><input id="btnQuery" type="button" class="btn btn-sm btn-success" value="查询" style="margin-left: 2px;"></td>
								<td></td>
							</tr>
						</table>
					</div>
					
					<div class="tabbable">
						<ul class="nav nav-tabs" id="myTab">
							<li id="div1" class="active"><a data-toggle="tab" href="#div_1">基本信息</a></li>
							<li id="div2"><a data-toggle="tab" href="#div_2">生产信息</a></li>
							<li id="div3"><a data-toggle="tab" href="#div_3">成品纪录表</a></li>
							<li id="div4"><a data-toggle="tab" href="#div_4">关键零部件</a></li>
							<!-- <li id="div5"><a data-toggle="tab" href="#div_5">订单配置一致性</a></li>-->
							<li id="div6"><a data-toggle="tab" href="#div_6">底盘铭牌</a></li>
							<li id="div7"><a data-toggle="tab" href="#div_7">整车铭牌</a></li>
							<li id="div8"><a data-toggle="tab" href="#div_8">合格证</a></li>
							<li id="div9"><a data-toggle="tab" href="#div_9">异常信息</a></li>
							<li id="div10"><a data-toggle="tab" href="#div_10">技改信息</a></li>
							<li id="div11"><a data-toggle="tab" href="#div_11">车辆监控信息</a></li>
						</ul>
						
						<div class="tab-content" id="tab-content">
							<div id="div_1" class="tab-pane fade in active">
								<table id="table01" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped">
									<tr>
										<td width="105px">生产订单：</td><td id="tab01_order_no"></td><td width="105px">车号：</td><td id="tab01_bus_number"></td><td width="105px">VIN：</td><td id="tab01_vin"></td>
									</tr>
									<tr>
										<td>生产工厂：</td><td id="tab01_factory_name"></td><td>车辆配置：</td><td id="tab01_order_config_name"></td><td>客户名称：</td><td id="tab01_customer"></td>
									</tr>
									<tr>
										<td>生产日期：</td><td id="tab01_productive_date"></td><td>左电机号：</td><td id="tab01_left_motor_number"></td><td>右电机号：</td><td id="tab01_right_motor_number"></td>
									</tr>
									<tr>
										<td>车辆颜色：</td><td id="tab01_bus_color"></td><td>座位数量：</td><td id="tab01_bus_seats"></td><td>车辆状态：</td><td id="tab01_production_status"></td>
									</tr>
									<tr>
										<td>客户自编号：</td><td id="tab01_customer_number"></td><td>焊装上线日期：</td><td id="tab01_welding_online_date"></td><td>焊装下线日期：</td><td id="tab01_welding_offline_date"></td>
									</tr>
									<tr>
										<td>玻璃钢下线：</td><td id="tab01_fiberglass_offline_date"></td><td>涂装上线日期：</td><td id="tab01_painting_online_date"></td><td>涂装下线日期：</td><td id="tab01_painting_offline_date"></td>
									</tr>
									<tr>
										<td>底盘上线日期：</td><td id="tab01_chassis_online_date"></td><td>底盘下线日期：</td><td id="tab01_chassis_offline_date"></td><td>总装上线日期：</td><td id="tab01_assembly_online_date"></td>
									</tr>
									<tr>
										<td>总装下线日期：</td><td id="tab01_assembly_offline_date"></td><td>调试区上线：</td><td id="tab01_debugarea_online_date"></td><td>调试区下线：</td><td id="tab01_debugarea_offline_date"></td>
									</tr>
									<tr>
										<td>检测线上线：</td><td id="tab01_testline_online_date"></td><td>检测线下线：</td><td id="tab01_testline_offline_date"></td><td>入库日期：</td><td id="tab01_warehousing_date"></td>
									</tr>
									<tr>
										<td>出厂日期：</td><td id="tab01_dispatch_date"></td><td>配置附件：</td><td id="tab01_config_file"></td><td></td><td></td>
									</tr>
								
								</table>
							</div>
							
							<div id="div_2" style="overflow:auto" class="tab-pane fade">
								<table id="table02" style="text-align:center;table-layout:fixed;font-size:12px" class="table table-bordered table-striped">
									<thead>
										<tr id="0">
											<th style="width:60px;text-align:center;">序号</th>
											<th style="text-align:center;">车辆车号</th>
											<th style="text-align:center;">生产工厂</th>
											<th style="text-align:center;">生产车间</th>
											<th style="text-align:center;">生产线别</th>
											<th style="text-align:center;">生产工序</th>
											<th style="text-align:center;">扫描时间</th>
											<th style="text-align:center;">车辆状态</th>
											<th style="text-align:center;">扫描人</th>
										</tr>
									</thead>
									<tbody>	
									</tbody>
								</table>
							</div>
							
							<div id="div_3" style="overflow:auto" class="tab-pane fade">
								<table id="table03" class="table table-bordered" style="font-size: 12px;">
									<thead>
										<tr>
											<th style="text-align:center;">序号</th>
											<th style="text-align:center;">车号</th>
											<th style="text-align:center;">节点</th>
											<th style="text-align:center;">检测结果</th>
											<th style="text-align:center;">结果判定</th>
											<th style="text-align:center;">返工/返修</th>
											<th style="text-align:center;">检验员</th>
											<th style="text-align:center;">检验日期</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
							
							<div id="div_4" style="overflow:auto" class="tab-pane fade">
								<table id="table04" class="table table-bordered" style="font-size: 12px;">
									<thead>
										<tr>
											<th style="text-align:center;">序号</th>
											<th style="text-align:center;">工序编号</th>
											<th style="text-align:center;">工序名称</th>
											<th style="text-align:center;">零部件编号</th>
											<th style="text-align:center;">零部件名称</th>
											<th style="text-align:center;">批次</th>
											<th style="text-align:center;">记录人</th>
											<th style="text-align:center;">记录时间</th>
										</tr>
									</thead>
									<tbody>
									</tbody>
								</table>
							</div>
							
							<div id="div_5" style="overflow:auto" class="tab-pane fade">
								div_5
							</div>
							
							<div id="div_6" style="overflow:auto" class="tab-pane fade">
								<table id="table06" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped">
									<tr>
										<td width="130px;" style="text-align: right;">车辆识别代号：</td><td id="tab06_VIN"></td><td width="130px" style="text-align: right;">生产序号：</td><td id="tab06_sequence"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">底盘型号：</td><td id="tab06_chassis_model"></td><td width="130px" style="text-align: right;">品牌：</td><td id="tab06_brand"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">电机型号：</td><td id="tab06_motor_model"></td><td width="130px" style="text-align: right;">电机最大功率：</td><td id="tab06_motor_power"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">乘员数：</td><td id="tab06_passenger"></td><td width="130px" style="text-align: right;">最大允许总质量：</td><td id="tab06_max_weight"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">电池型号：</td><td id="tab06_battery_model"></td><td width="130px" style="text-align: right;">电池容量：</td><td id="tab06_battery_capacity"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">最高车速：</td><td id="tab06_max_speed"></td><td width="130px" style="text-align: right;">灯光下倾值：</td><td id="tab06_light_downdip"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">额定电压：</td><td id="tab06_rated_voltage"></td><td width="130px" style="text-align: right;">生产日期：</td><td id="tab06_productive_date"></td>
									</tr>
								</table>
							</div>
							
							<div id="div_7" style="overflow:auto" class="tab-pane fade">
								<table id="table07" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped">
									<tr>
										<td width="130px;" style="text-align: right;">车辆识别代号：</td><td id="tab07_VIN"></td><td width="130px" style="text-align: right;">生产序号：</td><td id="tab07_sequence"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">车辆型号：</td><td id="tab07_vehicle_model"></td><td width="130px" style="text-align: right;">品牌：</td><td id="tab07_brand"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">电机型号：</td><td id="tab07_motor_model"></td><td width="130px" style="text-align: right;">电机最大功率：</td><td id="tab07_motor_power"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">乘员数：</td><td id="tab07_passenger"></td><td width="130px" style="text-align: right;">最大允许总质量：</td><td id="tab07_max_weight"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">电池型号：</td><td id="tab07_battery_model"></td><td width="130px" style="text-align: right;">电池容量：</td><td id="tab07_battery_capacity"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">最高车速：</td><td id="tab07_max_speed"></td><td width="130px" style="text-align: right;">灯光下倾值：</td><td id="tab07_light_downdip"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">额定电压：</td><td id="tab07_rated_voltage"></td><td width="130px" style="text-align: right;">生产日期：</td><td id="tab07_productive_date"></td>
									</tr>
								</table>
							</div>
							
							<div id="div_8" style="overflow:auto" class="tab-pane fade">
								<table id="table08" style="text-align:center;table-layout:fixed;font-size:12px;width:850px" class="table table-bordered table-striped">
									<tr>
										<td width="130px" style="text-align: right;">车身号：</td><td id="tab08_bus_number"></td><td width="130px" style="text-align: right;">VIN码：</td><td id="tab08_vin"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">底盘型号：</td><td id="tab08_chassis_model"></td><td width="130px" style="text-align: right;">整车型号：</td><td id="tab08_vehicle_model"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">电机型号：</td><td id="tab08_motor_model"></td><td width="130px" style="text-align: right;">电机号：</td><td id="tab08_motor_number"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">颜色：</td><td id="tab08_bus_color"></td><td width="130px" style="text-align: right;">座位数：</td><td id="tab08_bus_seats"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">轮胎规格：</td><td id="tab08_tire_type"></td><td width="130px" style="text-align: right;">弹簧片数：</td><td id="tab08_plates"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">额定载客人数：</td><td id="tab08_passengers"></td><td width="130px" style="text-align: right;">CCC证书签发日期：</td><td id="tab08_ccc_date"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">底盘公告生效日期：</td><td id="tab08_chassis_notice_date"></td><td width="130px" style="text-align: right;">整车公告生效日期：</td><td id="tab08_production_notice_date"></td>
									</tr>
									<tr>
										<td width="130px" style="text-align: right;">底盘生产日期：</td><td id="tab08_chassis_date"></td><td width="130px" style="text-align: right;">整车生产日期：</td><td id="tab08_production_date"></td>
									</tr>
								</table>
							</div>
							
							<div id="div_9" style="overflow:auto" class="tab-pane fade">
								<table id="table09" style="text-align:center;table-layout:fixed;font-size:12px;" class="table table-bordered table-striped">
									<thead>
										<tr id="0">
											<th style="width:60px;text-align:center;">序号</th>
											<th style="width:130px;text-align:center;">车辆车号</th>
											<th style="text-align:center;">生产工厂</th>
											<th style="text-align:center;">生产车间</th>
											<th style="text-align:center;">生产线别</th>
											<th style="text-align:center;">生产工序</th>
											<th style="text-align:center;">严重等级</th>
											<th style="text-align:center;">处理措施</th>
											<th style="text-align:center;">异常记录点</th>
											<th style="text-align:center;">异常原因</th>
											<th style="text-align:center;">责任部门</th>
											<th style="text-align:center;">状态</th>
										</tr>
									</thead>
									<tbody>	
									</tbody>
								</table>
							</div>
							
							<div id="div_10" style="overflow:auto" class="tab-pane fade">
								<table id="table10" style="text-align:center;font-size:12px" class="table table-bordered table-striped">
									<thead>
											<tr>
												<th style="text-align:center;">序号</th>
												<th style="text-align:center;">技改任务</th>
												<th style="text-align:center;">技改单编号</th>
												<th style="text-align:center;">技改工厂</th>
												<th style="text-align:center;">技改车间</th>
												<th style="text-align:center;">确认人</th>
												<th style="text-align:center;">确认时间</th>
											</tr>
										</thead>
										<tbody>
										</tbody>
									</table>
							</div>
							
							<div id="div_11" style="overflow:auto" class="tab-pane fade">
								<table id="table08" style="text-align:center;table-layout:fixed;font-size:12px;width:1000px" class="table table-bordered table-striped">
									<tr>
										<td width="220px" style="text-align: right;">VIN号：</td><td id=""></td>
										<td width="180px" style="text-align: right;">车牌号：</td><td id=""></td>
										<td width="180px" style="text-align: right;">动力电池电压（V）：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">电池组当前总电流（A）：</td><td id=""></td>
										<td style="text-align: right;">SOC（%）：</td><td id=""></td>
										<td style="text-align: right;">输出电流（A）：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">所有单体电池端电压最小值（V）：</td><td id=""></td>
										<td style="text-align: right;">最低电压电池号（#）：</td><td id=""></td>
										<td style="text-align: right;">总里程（km）：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">所有单体电池端电压最大值（V）：</td><td id=""></td>
										<td style="text-align: right;">最高电压电池号（#）：</td><td id=""></td>
										<td style="text-align: right;">动力电池最低温度（°C）：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">最低温度电池号（#）：</td><td id=""></td>
										<td style="text-align: right;">动力电池最高温度（°C）：</td><td id=""></td>
										<td style="text-align: right;">最高温度电池号（#）：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">电机转速（rpm）：</td><td id=""></td>
										<td style="text-align: right;">档位：</td><td id=""></td>
										<td style="text-align: right;">车速：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">手刹信号：</td><td id=""></td>
										<td style="text-align: right;">驻车制动开关：</td><td id=""></td>
										<td style="text-align: right;">制动开关：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">制动踏板深度（%）：</td><td id=""></td>
										<td style="text-align: right;">加速踏板深度（%）：</td><td id=""></td>
										<td style="text-align: right;">近光灯：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">左转向灯：</td><td id=""></td>
										<td style="text-align: right;">倒车灯：</td><td id=""></td>
										<td style="text-align: right;">远光灯：</td><td id=""></td>
									</tr>
									<tr>
										<td style="text-align: right;">右转向灯：</td><td id=""></td>
										<td style="text-align: right;">刹车灯：</td><td id=""></td>
										<td style="text-align: right;">前雾灯：</td><td id=""></td>
									</tr>
								</table>
							</div>
							
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
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script type="text/javascript" src="../js/datePicker/WdatePicker.js"></script>
	<script type="text/javascript" src="../js/common.js"></script>
	<script type="text/javascript" src="../js/production/productionsearchbusinfo.js"></script>
</html>
