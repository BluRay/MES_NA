<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>物料异常记录</title>
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
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">首页</a></li>
						<li class="active">物料异常记录</li>
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
								<td>工厂</td>
								<td>&nbsp;车间</td>
								<td>&nbsp;车型</td>
								<td>&nbsp;订单</td>
								<td>&nbsp;物料名称</td>
								<td>&nbsp;发生日期</td><td></td>
								<td>&nbsp;严重等级</td>
							</tr>
							<tr>
								<td style="padding-right:5px"><select id="search_factory" class="form-control" style="width:100px"></select></td>
								<td style="padding-right:5px"><select id="search_workshop"  class="form-control"  style="width:80px"></select></td>
								<td style="padding-right:5px"><select id="search_bustype" class="form-control busType" style="width:80px"></select></td>
								<td><input id="search_orderno" placeholder="订单..." style="width:120px" type="text">&nbsp;</td>
								<td><input id="search_material" placeholder="物料名称..." style="width:120px" type="text">&nbsp;</td>
							    <td>
								   <input id="search_date_start" placeholder="开始时间..." style="width:90px" type="text" onClick="WdatePicker({el:'search_date_start',dateFmt:'yyyy-MM-dd'});"> -
								   <input id="search_date_end" placeholder="结束时间..." style="width:90px" type="text" onClick="WdatePicker({el:'search_date_end',dateFmt:'yyyy-MM-dd'});">&nbsp;</td>
								<td>
								<td>
								    S：<input type="checkbox" name="search_bugLevel" value="S" />&nbsp;&nbsp;
									A：<input type="checkbox" name="search_bugLevel" value="A" />&nbsp;&nbsp;
									B：<input type="checkbox" name="search_bugLevel" value="B" />&nbsp;&nbsp;
									C：<input type="checkbox" name="search_bugLevel" value="C" />
								
								<td>
								   <input id="btnQuery" type="button" class="btn btn-sm btn-primary" value="查询" style="margin-left: 10px;"></input>
								   <input id="btnAdd" type="button" class="btn btn-sm btn-success" value="新增" style="margin-left: 2px;"></input>
								</td>
							</tr>
						</table>	
					</div>
					<table id="tableData" class="table table-striped table-bordered table-hover" style="overflow-x:auto;font-size: 12px;">
					</table>
					</div>
			</div><!-- /.main-content -->
			
			<div id="dialog-add" class="hide" style="align:center;width:800px;height:450px">
				<form id="form_add" class="form-horizontal">
					<table>
					<tr style="height:36px">
						<td align="right" style="width:180px">*发生日期：</td>
						<td style="width:150px">
						<input type="text" class="input-medium" id="new_occurDate" name="new_occurDate" onClick="WdatePicker({el:'new_occurDate',dateFmt:'yyyy-MM-dd'});" style="width:150px;height:30px;"/>
						</td>
						<td align="right" style="width:180px">* 物料名称：</td>
						<td style="width:150px"><input type="text" class="input-medium" id="new_material" name="new_license_number" style="width:150px;height:30px;" /></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">发生工厂：</td><td style="width:150px"><select id="new_factory" class="input-small" style="width:150px;height:30px;"></select></td>
						<td align="right" style="width:180px">发生车间：</td><td style="width:150px"><select id="new_workshop" class="input-small" style="width:150px;height:30px;"></select></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">*订单编号：</td>
						<td style="width:150px"><input type="text" class="input-medium" id="new_orderNo" name="new_orderNo" style="width:150px;height:30px;"/></td>
						<td align="right" style="width:180px">* 车型：</td>
						<td style="width:150px">
						    <select name="" id="new_bus_type" class="input-medium busType">
							</select>
							<script id="tmplBusTypeSelect" type="text/x-jsrander">
                            	<option value='{{:id}}'>{{:code}}</option>
                            </script>
						</td>
					</tr>
					<tr style="height:36px;">
					    <td align="right">&nbsp;异常描述：</td>
						<td colspan=3>
						<textarea id="new_description" name="new_description" style="width: 485px;margin-top: 4px;margin-bottom: 3px;" rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">改善前图片：</td>
						<td colspan=3><input name="new_bphoto" type="file" id="new_bphoto" style="height:30px;" /></td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;临时措施：</td>
						<td colspan=3>
						<textarea id="new_tmpMeasures" name="new_tmpMeasures" style="width: 485px;margin-top: 5px;" rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;原因分析：</td>
						<td colspan=3>
						<textarea id="new_faultReason" name="new_faultReason" style="width: 485px;margin-top: 5px;" rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;改善/预防措施：</td>
						<td colspan=3>
						<textarea id="new_impMeasures" name="new_impMeasures" style="width: 485px;margin-top: 5px;margin-bottom: 3px;" rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 严重级别：</td>
						<td style="width:150px"><select class="input-medium" id="new_bugLevel" style="width:150px;height:30px;"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option></select></td>
					    <td align="right" style="width:180px">*预计完成日期：</td>
						<td style="width:150px">
						<input type="text" class="input-medium" id="new_expcFinishDate" name="new_expcFinishDate" onClick="WdatePicker({el:'new_expcFinishDate',dateFmt:'yyyy-MM-dd'});" style="width:150px;height:30px;"/>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 责任单位：</td><td><input type="text" class="input-medium" id="new_respUnit" style="width:150px;height:30px;"/></td>
						<td align="right" style="width:180px">* 责任人：</td><td><input type="text" class="input-medium" id="new_respPerson" style="width:150px;height:30px;"/></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 验证结果：</td><td><select class="input-medium" id="new_verifyResult" style="width:150px;height:30px;"><option value="OK">OK</option><option value="NG">NG</option></select></td>
						<td align="right" style="width:180px">* 验证人：</td><td><input type="text" class="input-medium" id="new_verifier" style="width:150px;height:30px;"/></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">改善后图片：</td>
						<td colspan=3><input name="new_fphoto" type="file" id="new_fphoto" /></td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;备注：</td>
						<td colspan=3>
						<textarea id="new_memo" name="new_memo" style="width: 485px;margin-top: 5px;" rows="1"></textarea>
						</td>
					</tr>
					</table>
				</form>
			</div>
			
			<div id="dialog-edit" class="hide" style="align:center;width:800px;height:600px">
			<div class = "div-dialog">
				<form id="form_edit" class="form-horizontal">
					<table>
					<tr style="height:36px">
						<td align="right" style="width:180px">*发生日期：</td>
						<td style="width:150px">
						<input type="text" class="input-medium" id="edit_occurDate" name="new_occurDate" onClick="WdatePicker({el:'new_occurDate',dateFmt:'yyyy-MM-dd'});" style="width:150px"/>
						</td>
						<td align="right" style="width:180px">* 物料名称：</td>
						<td style="width:150px"><input type="text" class="input-medium" id="edit_material" name="new_license_number" style="width:150px" /></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">发生工厂：</td><td style="width:150px"><select id="edit_factory" class="input-small" style="width:150px"></select></td>
						<td align="right" style="width:180px">发生车间：</td><td style="width:150px"><select id="edit_workshop" class="input-small" style="width:150px"></select></td>
					</tr>
					<tr style="height:36px">
					    <td align="right" style="width:180px">* 车型：</td>
						<td style="width:150px">
						    <select name="" id="edit_bus_type" class="input-medium busType">
							</select>
							<script id="tmplBusTypeSelect" type="text/x-jsrander">
                            	<option value='{{:id}}'>{{:code}}</option>
                            </script>
						</td>
						<td align="right" style="width:180px">*订单编号：</td>
						<td style="width:150px"><input type="text" class="input-medium" id="edit_orderNo" style="width:150px"/></td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;异常描述：</td>
						<td colspan='3'>
						<textarea id="edit_description" style="width: 100%;margin-top: 5px;" placeholder="..." rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">改善前图片：</td>
						<td colspan='2' style="width: 360px;">
							<div style="width: 360px;margin-top: 5px;">
							<input name="edit_bphoto" type="file"  id="edit_bphoto" />
							</div>
						</td>
						<td><a target="blank" id="bphoto">查看</a></td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;临时措施：</td>
						<td colspan=3>
						<textarea id="edit_tmpMeasures" name="edit_tmpMeasures" style="width: 100%;margin-top: 5px;" placeholder="..." rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;原因分析：</td>
						<td colspan=3>
						<textarea id="edit_faultReason" name="edit_faultReason" style="width: 100%;margin-top: 5px;" placeholder="..." rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;改善/预防措施：</td>
						<td colspan=3>
						<textarea id="edit_impMeasures" name="edit_impMeasures" style="width: 100%;margin-top: 5px;" placeholder="..." rows="1"></textarea>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 严重级别：</td>
						<td ><select class="input-medium" id="edit_bugLevel" style="width:150px"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="S">S</option></select></td>
					    <td align="right" style="width:180px">*预计完成日期：</td>
						<td style="width:150px">
						<input type="text" class="input-medium" id="edit_expcFinishDate" name="new_expcFinishDate" onClick="WdatePicker({el:'new_expcFinishDate',dateFmt:'yyyy-MM-dd'});" style="width:150px"/>
						</td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 责任单位：</td><td><input type="text" class="input-medium" id="edit_respUnit" style="width:150px"/></td>
						<td align="right" style="width:180px">* 责任人：</td><td><input type="text" class="input-medium" id="edit_respPerson" style="width:150px"/></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">* 验证结果：</td><td><select class="input-medium" id="edit_verifyResult" style="width:150px"><option value="OK">OK</option><option value="NG">NG</option></select></td>
						<td align="right" style="width:180px">* 验证人：</td><td><input type="text" class="input-medium" id="edit_verifier" style="width:150px"/></td>
					</tr>
					<tr style="height:36px">
						<td align="right" style="width:180px">改善后图片：</td>
						<td colspan=2>
							<input name="edit_fphoto" type="file" style="300px;" id="edit_fphoto" />
						</td>
						<td><a target="blank" id="fphoto">查看</a></td>
					</tr>
					<tr style="height:36px">
					    <td align="right">&nbsp;备注：</td>
						<td colspan=3>
						<textarea id="edit_memo"  style="width: 100%;" rows="1"></textarea>
<!-- 						<input type="hidden" id="edit_id"> -->
						</td>
					</tr>
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
	<script type="text/javascript" src="../js/quality/materialExceptionLogs.js"></script>
</html>
