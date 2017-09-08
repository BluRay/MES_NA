<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>创建临时派工单</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
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
						<li><a href="#">生产执行</a></li>
						<li><a href="#">创建临时派工单</a></li>
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
								<td>派工流水号：</td>
								<td>
									<input style="height: 30px;width:140px;" type="text" class="input-medium revise" placeholder="派工流水号..." id="search_tmp_order_no" />
								</td>
								<td>申请日期：</td>
								<td>
									<input id="search_date_start" class="input-medium" style="width:100px" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" type="text">	
									-
									<input id="search_date_end" class="input-medium" style="width:100px" onclick="WdatePicker({dateFmt:'yyyy-MM-dd'})" type="text">						
								</td>	
								<td>状态：</td>
								<td>
									<select name="" id="search_status" class="input-medium" style="height: 30px;width:100px;" >
									    <option value=''>全部</option>
									    <option value='0'>已评估</option>
									    <option value='1'>已审批</option>
									    <option value='2'>已驳回</option>
<!-- 									    <option value='3'>已评估 </option> -->
<!-- 									    <option value='4'>已验收 </option> -->
<!-- 									    <option value='5'>已完成 </option> -->
<!-- 									    <option value='6'>已驳回 </option> -->
									</select>
								</td>
								<td style="text-align:right">工厂：</td>
								<td>
									<select name="" id="search_factory" class="input-medium" style="width:90px;"></select>
								</td>
								<td style="text-align:right">车间：</td>
								<td>
									<select name="" id="search_workshop" class="input-medium" style="width:90px;"></select>
								</td>							
								<td><input type="button" class="btn btn-sm btn-primary" id="btnQuery" value="查询" style="margin-left: 2px;"></input>
								<input type="button" class="btn btn-sm btn-info" id="btnAdd" value="新增" style="margin-left: 2px;"></input>						
								</td>
							</tr>

						</table>
					</form>
						
					<div class="row">
					<div class="col-xs-12" style="width: calc(100vw + 20px)">
						<table id="tableResult"
							class="table table-striped table-bordered table-hover" style="font-size: 12px; width:1800px;overflow-x:auto ">
						</table>	
					</div>
					</div>
				</div>

			<div id="dialog-edit" class="hide" style="align:center;width:800px;height:450px">
				<form id="form_edit" class="form-horizontal">
					<table>
					<tr style="height:20px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:30px">&nbsp;&nbsp;工单内容</h5></th></tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*派工发起人：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="edit_order_launcher" name="order_launcher" style="width:120px;height:30px;"/>
						</td>
						<td align="right" style="width:120px">*派工接收工厂：</td>
						<td style="width:120px"><select id="edit_factory" class="input-small" style="width:120px;height:30px;"></select></td>
					    <td align="right" style="width:120px">*派工接收车间：</td>
						<td style="width:120px"><select id="edit_workshop" class="input-small" style="width:120px;height:30px;"></select></td>
					</tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*发起部门主管：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="edit_head_launch_unit" style="width:120px;height:30px;"/>
						</td>
						<td align="right" style="width:120px">* 验收人：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="edit_acceptor" name="acceptor" style="width:120px;height:30px;" /></td>
					    <td align="right" style="width:120px"><a style="cursor:pointer" onclick="getExtraWorkHourManager('edit')">额外工时库</a></td>
						<td style="width:120px"></td>
					</tr>
					<tr style="height:35px;">
					    <td align="right">&nbsp;作业原因/内容：</td>
						<td colspan=5>
						<textarea id="edit_reason_content" style="width: 600px;margin-top: 4px;margin-bottom: 3px;" rows="1" readonly="readonly"></textarea>
						</td>
					</tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*总数量：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="edit_total_qty" style="width:120px;height:30px;" readonly="readonly"/>
						</td>
						<td align="right" style="width:120px">* 派工类型：</td>
						<td style="width:120px"><select style="width:120px" id="edit_order_type"></select></td>
					    <td align="right" style="width:120px">* 责任部门：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="edit_duty_unit" style="width:120px;height:30px;" readonly="readonly"/></td>
					</tr>
					<tr style="height:20px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:30px">&nbsp;&nbsp;工单评估内容</h5></th></tr>

					<tr style="height:35px">
					    <td align="right" style="width:120px">*所需人力：</td>
					    <td><input type="text" class="input-medium" id="edit_labors" style="width:120px;height:30px;"/></td>
						<td align="right" style="width:120px">*单工时：</td>
						<td><input type="text" class="input-medium" id="edit_single_hour" style="width:120px;height:30px;" readonly="readonly"/></td>
					    <td></td><td></td>
					</tr>
					<tr style="height:35px">
					    <td align="right" style="width:120px">*工时评估人：</td><td><input type="text" class="input-medium" id="edit_assesor" style="width:120px;height:30px;" readonly="readonly"/></td>
						<td align="right" style="width:120px">* 工时评估负责人：</td><td><input type="text" class="input-medium" id="edit_assess_verifier" style="width:120px;height:30px;" readonly="readonly"/></td>
					    <td></td><td></td>
					</tr>
					<tr style="height:20px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:30px">&nbsp;&nbsp;签批信息</h5></th></tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*成本是否可转移：</td>
						<td style="width:120px">
						<select style="width:120px" id="edit_is_cost_transfer"><option value="0">否</option><option value="1">是</option></select>
						</td>
						<td align="right" style="width:120px">*成本科签字：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="edit_cost_unit_signer" name="" style="width:120px;height:30px;" /></td>
					    <td align="right" style="width:120px">*工单号：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="edit_sap_order" name="" style="width:120px;height:30px;" /></td>
					</tr>
					<tr style="height:35px">
					    <td align="right" style="width:120px">*派工流水号：</td><td><input type="text" class="input-medium" id="edit_tmp_order_no" style="width:120px;height:30px;"/></td>
						<td align="right" style="width:120px">*验收人签字：</td><td><input type="text" class="input-medium" id="edit_acceptor_sign" style="width:120px;height:30px;"/></td>
					    <td></td><td></td>
					</tr>
					</table>
				</form>
			</div>
			<div id="dialog-add" class="hide" style="align:center;width:800px;height:450px">
				<form id="form_add" class="form-horizontal">
					<table>
					<tr style="height:20px"><th colspan=6 style="margin-top:2px;margin-buttom:2px;background-color:#f5f5f5"><h5 style="line-height:20px;background-color:#f5f5f5">&nbsp;&nbsp;工单内容</h5></th></tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*派工发起人：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="order_launcher" name="order_launcher" style="width:120px;height:30px;"/>
						</td>
						<td align="right" style="width:120px">*派工接收工厂：</td>
						<td style="width:120px"><select id="new_factory" class="input-small" style="width:120px;height:30px;"></select></td>
					    <td align="right" style="width:120px">*派工接收车间：</td>
						<td style="width:120px"><select id="new_workshop" class="input-small" style="width:120px;height:30px;"></select></td>
					</tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*发起部门主管：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="head_launch_unit" style="width:120px;height:30px;"/>
						</td>
						<td align="right" style="width:120px">* 验收人：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="acceptor" name="acceptor" style="width:120px;height:30px;" /></td>
					    <td align="right" style="width:120px"><a style="cursor:pointer" onclick="getExtraWorkHourManager('add')">额外工时库</a></td>
						<td style="width:120px"></td>
					</tr>
					<tr style="height:35px;">
					    <td align="right">&nbsp;作业原因/内容：</td>
						<td colspan=5>
						<textarea id="reason_content" style="width: 600px;margin-top: 4px;margin-bottom: 3px;" rows="1" readonly="readonly"></textarea>
						</td>
					</tr>
					<tr style="height:35px">
						<td align="right" style="width:120px">*总数量：</td>
						<td style="width:120px">
						<input type="text" class="input-medium" id="total_qty" name="total_qty" style="width:120px;height:30px;"/>
						</td>
						<td align="right" style="width:120px">* 派工类型：</td>
						<td style="width:120px">
<!-- 						<input type="text" class="input-medium" id="order_type" name="new_license_number" style="width:120px;height:30px;" /> -->
						    <select style="width:120px" id="order_type"></select>
						</td>
					    <td align="right" style="width:120px">* 责任部门：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="duty_unit"  readonly="readonly" style="width:120px;height:30px;" /></td>
					</tr>
					<tr style="height:20px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:20px">&nbsp;&nbsp;工单评估内容</h5></th></tr>

					<tr style="height:35px">
					    <td align="right" style="width:120px">*所需人力：</td>
					    <td><input type="text" class="input-medium" id="labors" style="width:120px;height:30px;"/></td>
						<td align="right" style="width:120px">*单工时：</td>
						<td><input type="text" class="input-medium" id="single_hour" style="width:120px;height:30px;"  readonly="readonly"/></td>
					</tr>
					<tr style="height:35px">
					    <td align="right" style="width:120px">*工时评估人：</td><td><input type="text" class="input-medium" id="assesor" style="width:120px;height:30px;" readonly="readonly"/></td>
						<td align="right" style="width:120px">* 工时评估负责人：</td><td><input type="text" class="input-medium" id="assess_verifier" style="width:120px;height:30px;" readonly="readonly"/></td>
					</tr>
					<tr style="height:20px;background-color:#f5f5f5;border-collapse:separate; border-spacing:2px;"><th colspan=6><h5 style="line-height:20px">&nbsp;&nbsp;签批信息</h5></th></tr>
					<tr style="height:35px;border-collapse:separate; border-spacing:2px;">
						<td align="right" style="width:120px">*成本是否可转移：</td>
						<td style="width:120px">
						<select style="width:120px" id="is_cost_transfer"><option value="0">否</option><option value="1">是</option></select>
						</td>
						<td align="right" style="width:120px">*成本科签字：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="cost_unit_signer" style="width:120px;height:30px;" /></td>
					    <td align="right" style="width:120px">*工单号：</td>
						<td style="width:120px"><input type="text" class="input-medium" id="sap_order" style="width:120px;height:30px;" /></td>
					</tr>
					<tr style="height:35px;">
					    <td align="right" style="width:120px;">*派工流水号：</td><td><input type="text" class="input-medium" id="tmp_order_no" style="width:120px;height:30px;"/></td>
						<td align="right" style="width:120px;">*验收人签字：</td><td><input type="text" class="input-medium" id="new_acceptor_sign" style="width:120px;height:30px;"/></td>
					</tr>
					</table>
				</form>
			</div>
		    <div id="div-dialog" class="hide" >
				<form id="">
				    <table style='margin-bottom:10px'>
						<tr>
							<td>车型：</td>
							<td><select style="height: 30px;width:80px" id="search_bus_type" class="input-small" ></select></td>
							<td>订单编号：</td>
							<td><input type="text" style="height: 30px;width:120px"
								class="input-medium revise" placeholder="订单编号..." value=""
								id="search_order_no" /></td>
							<td>派工类型：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="派工类型..." value=""
								id="search_order_type" /></td>
							<td>作业内容/原因：</td>
							<td><input type="text" style="height: 30px;"
								class="input-medium revise" placeholder="作业内容/原因..." value=""
								id="search_reason_content" />
							</td>
							<td><input type="button" class="btn btn-sm btn-primary" id="btnQueryExtra" value="查询" style="margin-left: 2px;"></input>
							</td>
							</tr>
						</table>
						<table id="tableDataDetail" class="table table-striped table-bordered table-hover dataTable no-footer"
					            style="font-size: 12px;" role="grid" aria-describedby="tableDataDetail_info">
						</table>
				</form>
			</div>
			<div id="dialog-show" class="hide" >
				<div class="tabbable">
					<ul class="nav nav-tabs" id="myTab">
						<li id="div1" class="active">
							<a data-toggle="tab" onclick="" href="#baseinfo">基本信息</a>
						</li>
						<li id="div2">
							<a data-toggle="tab" onclick="" href="#productiondetailmtn">产量明细维护</a>
						</li>
						<li id="div3">
							<a data-toggle="tab" onclick="" href="#workhourdetail">工时明细</a>
						</li>
						<li id="div4">
							<a data-toggle="tab" onclick="" href="#workhourallot">工时分配</a>
						</li>
					</ul>
				</div>
				<div class="tab-content" id="new_accordion">
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="baseinfo">
                       <table>
							<tr style="height:30px;background-color:#f5f5f5"><th colspan=6><h5 style="line-height:30px;">&nbsp;&nbsp;工单内容</h5></th></tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">派工发起人：</td>
								<td style="width:120px" id="show_order_launcher">
								</td>
								<td align="right" style="width:120px">派工接收工厂：</td>
								<td style="width:120px" id="show_factory"></td>
							    <td align="right" style="width:120px">派工接收车间：</td>
								<td style="width:120px" id="show_workshop"></td>
							</tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">发起部门主管：</td>
								<td style="width:120px" id="show_head_launch_unit">
								</td>
								<td align="right" style="width:120px">验收人：</td>
								<td style="width:120px" id="show_acceptor"></td>
							    <td align="right">&nbsp;作业原因/内容：</td>
								<td colspan=5 id="show_reason_content">
								</td>
							</tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">总数量：</td>
								<td style="width:120px" id="show_total_qty">
								</td>
								<td align="right" style="width:120px">派工类型：</td>
								<td style="width:120px" id="show_order_type"></td>
							    <td align="right" style="width:120px">责任部门：</td>
								<td style="width:120px" id="show_duty_unit"></td>
							</tr>
							<tr style="height:30px"><th colspan=6 style="background-color:#f5f5f5"><h5 style="line-height:30px">&nbsp;&nbsp;工单评估内容</h5></th></tr>
		
							<tr style="height:30px">
							    <td align="right" style="width:120px">所需人力：</td>
							    <td id="show_labors" ></td>
								<td align="right" style="width:120px">单工时：</td>
								<td  id="show_single_hour"></td>
							    <td></td><td></td>
							</tr>
							<tr style="height:30px">
							    <td align="right" style="width:120px">工时评估人：</td><td  id="show_assesor" ></td>
								<td align="right" style="width:120px">工时评估负责人：</td><td id="show_assess_verifier" ></td>
							    <td></td><td></td>
							</tr>
							<tr style="height:30px"><th colspan=6 style="background-color:#f5f5f5"><h5 style="line-height:30px">&nbsp;&nbsp;签批信息</h5></th></tr>
							<tr style="height:30px">
								<td align="right" style="width:120px">成本是否可转移：</td>
								<td style="width:120px" id="show_is_cost_transfer">
								</td>
								<td align="right" style="width:120px">成本科签字：</td>
								<td style="width:120px" id="show_cost_unit_signer"></td>
							    <td align="right" style="width:120px">工单号：</td>
								<td style="width:120px" id="show_sap_order"></td>
							</tr>
							<tr style="height:30px">
							    <td align="right" style="width:120px">派工流水号：</td><td id="show_tmp_order_no" ></td>
								<td align="right" style="width:120px">验收人签字：</td><td id="show_acceptor_sign"></td>
							    <td></td><td></td>
							</tr>
							</table>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="productiondetailmtn">
                        <div class="row" >
							<div class="col-xs-12"  id="productiondetailmtnResultDiv" style="padding-right:0px;">
								<table id="productiondetailmtnResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="workhourdetail">
                        <div class="row" >
							<div class="col-xs-12"  id="workhourdetailResultDiv" style="padding-right:0px;">
								<table id="workhourdetailResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
                    <div class="tab-pane" role="tabpanel" style="height:400px" id="workhourallot">
                        <div class="row" >
							<div class="col-xs-12"  id="workhourallotResultDiv" style="padding-right:0px;">
								<table id="workhourallotResult" class="table table-striped table-bordered table-hover" style="table-layout:fixed;font-size: 12px; width:745px;overflow:auto;">
								</table>
							</div>
						</div>
                    </div>
				</div>
			</div>
			</div>
			<!-- /.main-container -->
		</div>
	
	<script src="../js/datePicker/WdatePicker.js"></script>
	<script src="../assets/js/jquery.dataTables.min.js"></script>
	<script src="../assets/js/jquery-ui.min.js"></script>
	<script src="../assets/js/jquery.gritter.min.js"></script>
	<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
	<script src="../assets/js/dataTables.fixedColumns.min.js"></script>
	<script src="../assets/js/dataTables.rowGroup.js"></script>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/jquery.form.js"></script>	
	<script src="../js/common.js"></script>
	<script src="../js/production/createTmpOrder.js"></script>
</body>

</html>
