<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>车辆信息维护</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet"
	href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet"
	href="../assets/css/fixedColumns.dataTables.min.css" />
<link rel="stylesheet" href="../assets/css/jquery-ui.min.css" />
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
						<li><a href="#">车辆信息维护</a></li>
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
					<form id="form" class="well form-search">
						<table>
							<tr>
								<td>生产工厂：</td>
								<td><select name="" id="search_factory" class="input-medium carType" style="height: 30px;width:120px;" ></select></td>
								<td>订单编号：</td>
								<td><input style="height: 30px;" type="text" class="input-medium revise" placeholder="订单编号..." id="search_order_no" /></td>
								<td>车型：</td>
								<td><select name="" id="search_bus_type" class="input-small carType"></select></td>
								<td>车号：</td>
								<td><input style="height: 30px;" type="text" class="input-medium revise" placeholder="车号..." id="search_bus_number" /></td>
								<td><input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-info" id="btnAdd" value="批量编辑" style="margin-left: 2px;"></input>						
								</td>
							</tr>

						</table>
					</form>
						
					<div class="row">
					<div class="col-xs-12">
						<table id="tableResult"
							class="table table-striped table-bordered table-hover" style="font-size: 12px;width:2000px;overflow-x:auto">
						</table>	
					</div>
					</div>
				</div>

			<div id="dialog-config" class="hide">
				<form id="create_form" class="form-horizontal">
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:21%">*&nbsp;生产工厂：</label>
						<div class="col-sm-3">
							<select id="factory" class="input-medium" style="width:100%" >
								<option value=''>请选择</option>
							</select>
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="order" style="width:21%">*&nbsp;订单编号：</label>
						<div class="col-sm-2" style="width:19%">
							<input type="text"  class="input-medium" style="width:100%"  id="order"  placeholder="订单编号.." />
							<input type="text" style="display:none" id="order_id" />
						</div>
						<label id="specify_order_lable" class="col-sm-2 control-label no-padding-left"  style="width: 80px;" for=""><a href="#" onclick="javascript:specifyBus();">指定车号</a></label>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="bus_color" style="width:21%">&nbsp;颜       色：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="颜色..." id="bus_color" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="bus_seats" style="width:21%">&nbsp;座位数：</label>
						<div class="col-sm-3">
							<input type="text" class="input-medium" style="width:100%" placeholder="座位数..." id="bus_seats" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:21%">&nbsp;额定载客人数：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="额定载客人数..." id="passenger_num" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="" style="width:21%">&nbsp;轮胎规格：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="轮胎规格..." id="tire_type" />
						</div>
					</div>
					
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="battery_capacity" style="width:21%">&nbsp;电池容量：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="电池容量.." id="battery_capacity" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="rated_voltage" style="width:21%">&nbsp;额定电压：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="额定电压..." id="rated_voltage" />
						</div>
					</div>
					<div class="form-group">						
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="spring_num" style="width:21%">&nbsp;弹簧片数：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%"placeholder="弹簧片数..." id="spring_num" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="dp_production_date" style="width:21%">&nbsp;底盘生产日期：</label>
						<div class="col-sm-3">
							<input id="dp_production_date" class="input-medium" style="width:100%" placeholder="底盘生产日期.." onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="dp_zzd" style="width:21%">&nbsp;底盘资质地：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="底盘资质地..." id="dp_zzd" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="zc_production_date" style="width:21%">&nbsp;整车生产日期：</label>
						<div class="col-sm-3">
							<input id="zc_production_date" class="input-medium" style="width:100%" placeholder="整车生产日期.." onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" type="text">
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="zc_zzd" style="width:21%">&nbsp;整车资质地：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="整车资质地.." id="zc_zzd" />
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="hgz_note" style="width:21%">&nbsp;合格证备注：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="合格证备注..." id="hgz_note" />
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="ccczs_date" style="width:21%">&nbsp;CCC证书签发日期：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="CCC证书签发日期.." id="ccczs_date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
						</div>
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="dpgg_date" style="width:21%">&nbsp;底盘公告生效日期：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="底盘公告生效日期..." id="dpgg_date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
						</div>
					</div>
					<div class="form-group">
						<label class="col-sm-2 control-label no-padding-right no-padding-right" for="zcgg_date" style="width:21%">&nbsp;整车公告生效日期：</label>
						<div class="col-sm-3">
							<input type="text"  class="input-medium" style="width:100%" placeholder="整车公告生效日期.." id="zcgg_date" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})"/>
						</div>
						
					</div>
			</form>
		</div>
		
		<div id="dialog-config-bus" class="hide">
			<form id="bus_list_form" class="form-horizontal">
				<div class="form-group">
						<label class="col-sm-3 control-label no-padding-right no-padding-right" for="">&nbsp;车号：</label>
						<div class="col-sm-9">
							<textarea class="input-xlarge" style="width: 100%" placeholder="每行输入一个车号，输入车号后请回车！"
								id="bus_list" rows="4"></textarea>
						</div>
						
					</div>
			</form>
		</div>
		
			</div>
			<!-- /.main-container -->
		</div>
	
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/production/busInfoMtn.js"></script>
</body>

</html>
