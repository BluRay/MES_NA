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
<link rel="stylesheet" href="../assets/css/jquery.gritter.css" />
<link rel="stylesheet" href="../css/common.css">
<style type="text/css" media="screen">
label {
	font-weight: 400;
	font-size: 13px;
	text-align: right;
}
</style>
<jsp:include page="../common.jsp"></jsp:include>
</head>
<body class="no-skin" style="font-family: 'Microsoft YaHei';">
	<!-- 头 -->
	<%-- <jsp:include page="../top.jsp" flush="true" /> --%>
	<!-- 身 -->
	<div class="main-container" id="main-container" style="height: 100%">
		<!-- 左边菜单 -->
		<%-- <jsp:include page="../left.jsp" flush="true" /> --%>
		<!-- 主体 -->
		<div class="main-content">
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs breadcrumbs-fixed" id="breadcrumbs">
				<ul class="breadcrumb" style="font-size:14px;">
					<li><a href="/BMS/index_mobile"><i class="ace-icon fa fa-home home-icon bigger-160"></i>BMS</a></li>
					<li><a href="#">成品记录表</a></li>
				</ul>
				<!-- /.breadcrumb -->
	<!-- 			<div class="nav-search" id="nav-search"
					style="margin-top: 5px; margin-right: 10px;">
					<i id="btn_clear" class="ace-icon fa fa-refresh  red bigger-160"
						style="cursor: pointer; margin-right: 20px;"></i> <i id="btn_save"
						class="ace-icon fa fa-floppy-o green bigger-160"
						style="cursor: pointer"></i>
				</div> -->
			</div>

			<div class="page-content"
				style="position:fixed;top:38px;bottom:10px;width:100%;overflow-y:auto;padding-left: 0px;padding-right:12px;">

					<div class="no-steps-container" style="height:90%" >
						<div style="display: none" id="fuelux-wizard-container" data-target="#step-container">
								<ul class="wizard-steps">
									<li data-target="#step1" class="active">
										<span class="step">1</span>
										<span class="title">Validation states</span>
									</li>

									<li data-target="#step2">
										<span class="step">2</span>
										<span class="title">Alerts</span>
									</li>

									<li data-target="#step3">
										<span class="step">3</span>
										<span class="title">Payment Info</span>
									</li>
								</ul>
							</div>

						<div class="step-content pos-rel" id="step-container" >
								<div class="step-pane active" id="step1">
									<form class="form-horizontal" id="scan_form">
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">车号:</label>
											<div class="col-xs-9">
												<span class="input-icon input-icon-right" style="width: 100%;">
														<input id="bus_number" type="text" class="input-medium" style="width:100%;height:30px;">													
												</span>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">工厂:</label>
											<div class="col-xs-9">
												<select id="factory" class="input-medium" style="width:100%" disabled>
													<!-- <option value=''>请选择</option> -->
												</select>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验节点:</label>
											<div class="col-xs-9">
												<select id="check_node" class="input-medium" style="width:100%">
													<!-- <option value=''>请选择</option> -->
												</select>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">订单:</label>
											<div class="col-xs-9" style="padding-top: 4px;margin-bottom: 4px;">
												<span id="order"  style="font-size:13px;"></span>
											</div>
										</div>
										
										<div class="form-group has-info" >
											<label class="col-xs-3 control-label no-padding-right" style="text-align:right">检验日期:</label>
											<div class="col-xs-9">
												<input class="input-medium" style="width:100%;height:30px;" placeholder="选择检验日期..." id="test_date" onclick="WdatePicker({el:'test_date',dateFmt:'yyyy-MM-dd',enableKeyboard:false});" type="text">
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验结论:</label>
											<div class="col-xs-9">
												<select id="result" class="input-medium" style="width:100%">
													<option value='0'>一次校检合格</option>
													<option value='1'>返工/返修合格</option>
													<option value='2'>让步放行</option>
												</select>
											</div>
										</div>
													
									</form>
								</div>

								<div class="step-pane" id="step2">
									<form class="form-horizontal" id="scan_form">
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验项目:</label>
											<div class="col-xs-9">
												<span class="input-icon input-icon-right" style="width: 100%;">
													<select id="test_item" class="input-medium" style="width:100%">
													<!-- <option value=''>请选择</option> -->
													</select>												
												</span>
											</div>
										</div>
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验标准:</label>
											<div class="col-xs-9">
											</div>
										</div>
										<div class="form-group " style="margin-top:-30px" id="test_standard_list">
											<!-- <div class="col-xs-12">
												<label class="col-xs-3 control-label no-padding-right"></label>
												<div class="col-xs-9 has-info" style="margin-bottom: 0;padding-top: 3px;color: #657ba0;">
												<input type="radio" name="check_strd" />
												VIN码左右倾斜高度差＜4mm
												</div>
											</div>											
											<div class="col-xs-12">
												<label class="col-xs-3 control-label no-padding-right"></label>
												<div class="col-xs-9" style="margin-bottom: 0;padding-top: 3px;color: #657ba0;">
												<input type="radio" name="check_strd" />
												待油漆完全干燥后，查看VIN码边框，确保边框整齐清晰，漆膜光滑平整。
												</div>
											</div>					
										<div class="col-xs-12 has-info">
											<label class="col-xs-3 control-label no-padding-right"></label>
											<div class="col-xs-9" style="margin-bottom: 0;padding-top: 3px;color: #657ba0;">
												<input type="radio" name="check_strd" />
												VIN码拓印清晰、可辨,并与样板2的拓印效果对比，相关尺寸与样板2的拓印效果保持一致
											</div>
										</div>
										<div class="col-xs-12 has-info">
											<label class="col-xs-3 control-label no-padding-right"></label>
											<div class="col-xs-9" style="margin-bottom: 0;padding-top: 3px;color: #657ba0;">
												<input type="radio" name="check_strd" />
												VIN码拓印后凡士林涂抹整个VIN字体区域，涂抹后字体清晰、可辨
											</div>
										</div>
										<div class="col-xs-12 has-info">
											<label class="col-xs-3 control-label no-padding-right"></label>
											<div class="col-xs-9" style="margin-bottom: 0;padding-top: 3px;color: #657ba0;">
												<input type="radio" name="check_strd" />
												VIN码区域使用200*60mm的彩条膜防护，遮蔽严实，无遗漏
											</div>
										</div> -->
										</div>										
									</form>	
								</div>

								<div class="step-pane" id="step3">
									<form class="form-horizontal" >
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验员:</label>
											<div class="col-xs-9">
												<span class="input-icon input-icon-right" style="width: 100%;">
														<input id="tester" type="text" class="input-medium" style="width:100%;height:30px;">													
												</span>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">判定:</label>
											<div class="col-xs-9">
												<select id="judge" class="input-medium" style="width:100%" >
													<option value='合格'>合格</option>
													<option value='不合格'>不合格</option>
												</select>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">复检判定:</label>
											<div class="col-xs-9">
												<select id="rework" class="input-medium" style="width:100%" >
													<option value='合格'>合格</option>
													<option value='不合格'>不合格</option>
												</select>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">检验结果:</label>
											<div class="col-xs-9" >
												<textarea style="width:100%" class="input-xlarge" id="test_result" rows="2"></textarea>
											</div>
										</div>
										
										<div class="form-group has-info" id="fault_type_div">
											<label class="col-xs-3 control-label no-padding-right">缺陷类别:</label>
											<div class="col-xs-9" style="padding-top: 4px;margin-bottom: 4px;">
												<span id="fault_type"  style="font-size:13px;"></span>
											</div>
											
										</div><div class="form-group has-info" id="fault_level_div">
											<label class="col-xs-3 control-label no-padding-right">严重等级:</label>
											<div class="col-xs-9" style="padding-top: 4px;margin-bottom: 4px;">
												<span id="fault_level"  style="font-size:13px;"></span>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">责任车间:</label>
											<div class="col-xs-9">
												<select id="workshop" class="input-medium" style="width:100%" >
												</select>
											</div>
										</div>
										
										<div class="form-group has-info">
											<label class="col-xs-3 control-label no-padding-right">责任班组:</label>
											<div class="col-xs-9">
												<select id="workgroup" class="input-medium" style="width:100%" >
												</select>
											</div>
										</div>
													
									</form>
								</div>

							</div>

						<div class="wizard-actions" style="position:fixed;bottom:5px;width: 100%;background-color: rgb(245, 245, 245);">		
							<button disabled="disabled" class="btn btn-sm btn-prev " style="height:34px;">
								<!-- <i class="ace-icon fa fa-arrow-left"></i>  -->上一步
							</button>
							
							<button class="btn btn-success btn-sm btn-next"  style="height:34px;">
								下一步 <!-- <i class="ace-icon fa fa-arrow-right icon-on-right"></i> -->
							</button>
							
							<button class="btn btn-primary btn-sm" style="height:34px;margin-right:10px;" id="save">
								保存 
							</button>
						</div>

				</div>
			</div>	
			<!-- /.main-container -->
			</div>
	
		<script src="../js/datePicker/WdatePicker.js"></script>		
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/fuelux/fuelux.wizard.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/jquery.form.js"></script>
		<script src="../js/common.js"></script>
		<script src="../js/quality/productRecord_Mobile.js"></script>
	</div>
</body>
</html>