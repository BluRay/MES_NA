<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="zh-CN">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>Organization</title>
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
		<div id="div_row" class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="../left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="/BMS/index">Index</a></li>
						<li><a href="#">Settings</a></li>
						<li class="active">Organization</li>
					</ul>

					<div class="nav-search" id="nav-search">
						<form class="form-search">
							<span class="input-icon">
								<input type="text" placeholder="Search ..." class="nav-search-input" id="nav-search-input" autocomplete="off" /><i class="ace-icon fa fa-search nav-search-icon"></i>
							</span>
						</form>
					</div><!-- /.nav-search -->
				</div>
				
			<div class="page-content">
					
					<div class="row">
						<div class="col-xs-12">
							<div class="row">
								<div class="col-sm-4">
									<div id="div_tree1" class="widget-box widget-color-blue2" style="height:800px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller">Organization&nbsp;&nbsp;&nbsp;&nbsp;</h4>
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
												<div id="tree2" class="tree tree-unselectable"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="col-sm-8">
									<div id="div_tree2" class="widget-box widget-color-green2" style="height:800px;OVERFLOW-X:auto;OVERFLOW-Y:auto;OVERFLOW:auto">
										<div class="widget-header">
											<h4 class="widget-title lighter smaller" id="nodeName">&nbsp;</h4>
											
											<button id="btn_add" style="float:right;margin-top:2px" class="btn btn-sm btn-success">Add</button>
											<button id="btn_delete" style="float:right;margin-top:2px" class="btn btn-sm btn-purple">Delete</button>&nbsp;&nbsp;
<!-- 											<button id="btn_add" style="float:right;margin-top:2px" class="btn btn-sm btn-success">新增</button> -->
										</div>

										<div class="widget-body">
											<div class="widget-main padding-8">
											<div class="form-group">
											    <table id="tableData" class="table table-striped table-bordered table-hover" style="font-size: 12px;"></table>
											</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							
						</div>							
					</div>
			</div><!-- /.main-content -->
			<div id="dialog-confirm" class="hide" style="width:800px;height:600px">
				<form class="form-horizontal">
			        <input type="hidden" id="org_type"><input type="hidden" id="parent_id">
			        <input type="hidden" id="org_kind">
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Superior Departments： </label>
							<div class="col-sm-9">
								<select name="" id="new_p_id" class="input-large carType"></select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Type： </label>
							<div class="col-sm-9">
							    <select name="" id="new_org_type" class="input-large carType">
<!-- 			                    	<option value='0'>事业部</option> -->
<!-- 			                    	<option value='1'>片区</option> -->
<!-- 			                    	<option value='2'>工厂</option> -->
<!-- 			                    	<option value='5'>车间</option> -->
<!-- 			                    	<option value='7'>班组</option> -->
<!-- 			                    	<option value='8'>小班组</option> -->
								</select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Model： </label>
							<div class="col-sm-9">
								<select name="" id="new_org_kind" class="input-large carType">
									<option value=''>--Please Choose--</option>
			                    	<option value='1'>Managed</option>
			                    	<option value='0'>Production</option>
								</select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Name： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" 
                                class="input-medium revise carType" id="new_name" 
                                onkeyup="value=value.replace(/[^\u4E00-\u9FA5]/g,'')" 
                                onbeforepaste="clipboardData.setData('text',clipboardData.getData('text').replace(/[^\u4E00-\u9FA5]/g,''))"/>							</div>
						    </div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Code： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" class="input-large revise carType" placeholder="" id="new_org_code" />				
                                </div>
						    </div>
					</fieldset>					
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Manager： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" class="input-large revise carType" placeholder="" id="new_manager" />				
                                </div>
						    </div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Responsibilities： </label>
							<div class="col-sm-9">
                                <textarea style="width:280px" name="" id="new_responsibilities" class="input-medium carType"></textarea>
                            </div>
					    </div>
					</fieldset>
				</form>
            </div>
			<div id="dialog-edit" class="hide" style="width:800px;height:600px">
				<form class="form-horizontal">
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Superior Departments： </label>
							<div class="col-sm-9">
								<input type="hidden" id="editId" />
								<select name="" id="p_id" class="input-large carType"></select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Type： </label>
							<div class="col-sm-9">
							    <select name="" id="edit_org_type" class="input-large carType">
<!-- 			                    	<option value='0'>事业部</option> -->
<!-- 			                    	<option value='1'>片区</option> -->
<!-- 			                    	<option value='2'>工厂</option> -->
<!-- 			                    	<option value='3'>科室</option> -->
<!-- 			                    	<option value='5'>车间</option> -->
<!-- 			                    	<option value='7'>班组</option> -->
<!-- 			                    	<option value='8'>小班组</option> -->
								</select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Model： </label>
							<div class="col-sm-9">
								<select name="" id="edit_org_kind" class="input-large carType">
			                    	<option value='1'>Managed</option>
			                    	<option value='0'>Production</option>
								</select>
							</div>
						</div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Name： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" 
                                class="input-medium revise carType" id="edit_name" readonly="readonly"/>							
                            </div>
					    </div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Org Code： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" class="input-large revise carType" placeholder="" id="edit_org_code" />				
                                </div>
						    </div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Manager： </label>
							<div class="col-sm-9">
                                <input style="height: 30px;width:280px" type="text" class="input-large revise carType" placeholder="" id="edit_manager" />				
                                </div>
						    </div>
					</fieldset>
					<fieldset>
						<div class="form-group form-horizontal">
							<label class="col-sm-3 control-label no-padding-right" for="form-field-1"> Responsibilities： </label>
							<div class="col-sm-9">
                                <textarea style="width:280px" name="" id="edit_responsibilities" class="input-medium carType"></textarea>
                            </div>
					    </div>
					</fieldset>
				</form>
            </div>
			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
		<script src="../assets/js/fuelux/fuelux.tree.min.js"></script>
		<script src="../assets/js/jquery.dataTables.min.js"></script>
		<script src="../assets/js/jquery.dataTables.bootstrap.js"></script>
		<script src="../assets/js/bootstrap3-typeahead.js"></script>
		<script src="../js/setting/orgData.js"></script>
		<script src="../js/common.js"></script>
		<script src="../assets/js/jquery-ui.min.js"></script>
		<script src="../assets/js/jquery.ui.touch-punch.min.js"></script>
		<script src="../assets/js/jquery.gritter.min.js"></script>
	</body>
</html>
