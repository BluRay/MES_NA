<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<html lang="zh-CN">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta charset="utf-8" />
<title>生产执行</title>
<meta name="description" content="Common Buttons &amp; Icons" />
<meta name="viewport"
	content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />	
<link rel="stylesheet" href="../css/bootstrap.3.2.css">	
<link rel="stylesheet" href="../assets/css/fixedColumns.bootstrap.min.css" />
<link rel="stylesheet" href="../css/bootstrap-table.css">
<link rel="stylesheet" href="../css/bootstrap-editable.css">
<style type="text/css" media="screen">
	.node-rgl {
		position:relative;z-index:20;height:40px;width:70px;font-size: 32px;
	}
	.node-rgl:hover {
		border: 2px solid green;cursor:pointer;
	}
	.node-rgl-1 {
		position:relative;z-index:20;height:29px;width:58px;font-size: 14px;
	}
	.node-rgl-1:hover {
		border: 1px solid blue;cursor:pointer;
	}
	.node-rgl-2 {
		position:relative;z-index:20;height:20px;width:58px;font-size: 14px;text-align:center;color:red;
	}
	.node-rgl-2:hover {
		cursor:pointer;font-size:18px;
	}
	.node-rgl-3{
		position:relative;z-index:20;height:20px;width:90px;font-size: 14px;text-align:center;color:black;
	}
	.node-rgl-3:hover {
		cursor:pointer;font-size:18px;
	}
	.node-rgl-4{
		position:relative;z-index:20;height:50px;width:40px;font-size: 12px;text-align:center;color:black;
	}
	.node-rgl-4:hover {
		cursor:pointer;font-size:16px;
	}
	.node-rgl-5 {
		position:relative;z-index:20;height:29px;width:58px;font-size: 14px;
	}
	.node-rgl-5:hover {
		cursor:pointer;
	}
	.node-rgl-6{
		position:relative;z-index:20;height:25px;width:44px;font-size: 14px;
	}
	.node-rgl-6:hover {
		cursor:pointer;
	}
	.execution{
		background-image:url('../images/productionIndex.png');background-repeat:no-repeat;/* background-size:99.9% 99.9%; */
		width:1100px;height:400px;color: #FFF;font-weight:bold;font-size:9px;text-align:center;overflow-y: hidden; 
	}
/* 	.execution:hover{
		cursor:pointer
	} */
	.node-welding-text{
		top:10px;left:76px;
	}
	.node-painting-text{
		top: -30px;left: 352px;
	}
	.node-bottom-text{
		top: -70px;left: 570px;
	}
	.node-asembly-text{
		top: -110px;left: 787px;
	}
	.node-monitor-welding{
		top: -90px;left: 218px;
	}
	.node-monitor-assembly{
		top: -118px;left: 907px;
	}
	.node-online-w-a{
		top: -102px;left: -8px;
	}
	.node-online-w-b{
		top: -59px;left: -8px;
	}
	.node-offline-w-a{
		top: -142px;left: 162px;
	}
	.node-offline-w-b{
		top: -99px;left: 162px;
	}
	.node-prod-w{
		top: -150px;left: 62px;
	}
	.node-online-p{
		top: -252px;left: 289px;
	}
	.node-offline-p{
		top: -272px;left: 419px;
	}
	.node-prod-p{
		top: -260px;left: 339px;
	}
	.node-online-b-a{
		top: -362px;left: 488px;
	}
	.node-online-b-b{
		top: -320px;left: 488px;
	}
	.node-offline-b-a{
		top: -402px;left: 648px;
	}
	.node-offline-b-b{
		top: -360px;left: 648px;
	}
	.node-prod-b{
		top: -410px;left: 552px;
	}
	.node-online-a-a{
		top: -512px;left: 712px;
	}
	.node-online-a-b{
		top: -470px;left: 712px;
	}
	.node-offline-a-a{
		top: -552px;left: 858px;
	}
	.node-offline-a-b{
		top: -510px;left: 858px;
	}
	.node-prod-a{
		top: -560px;left: 771px;
	}
	.node-wip-1{
		top: -180px;left: 264px;
	}
	.node-wip-2{
		top: -290px;left: 464px;
	}
	.node-wip-3{
		top: -440px;left: 690px;
	}
	.node-warehouse{
		top: -612px;left: 1005px;
	}	
	.node-print-mp{
		top:-640px;left:925px;
	}
	.node-print-hgz{
		top:-600px;left:925px;
	}
	.node-print-disp{
		top: -660px;left: 1052px;
	}
	.node-print-body{
		top: -560px;left: 30px;
	}
	.node-print-color{
		top: -590px;left: 350px;
	}
	.node-print-vin{
		top: -620px;left: 630px;
	}
	.node-print-seat{
		top: -650px;left: 760px;
	}
	.node-debug-area{
		top: -829px;left: 918px;
	}
	.node-testline{
		top: -829px; left: 942px;
	}
	.node-cpk{
	    position: relative;
		z-index: 20;
		height: 35px;
		width: 35px;
		font-size: 14px;
		cursor: pointer;
		border-radius: 20px;
		top: -860px;
		left: 1018px;
	}
	
	
	.myselect {
		border: 0px none;
		-moz-appearance:none;
		-webkit-appearance:none;
		font-size: 100%;
		margin-bottom: 3px;
		color: #555;
		background-color:#f5f5f5;
		width: 80px;
		padding: 0px;
		height:27px;
		cursor: pointer;
		margin-left: -8px;
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
						<li><a href="#">生产执行</a></li>
						<li class="active">
						<select name="" id="search_factory" class="myselect">
						</select>
						</li>
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
					<div id="execution"  style="height:500px">
                  	<div class="execution" style="margin-left:10px;margin-top:30px">
	                  <div title="焊装" id="node-welding" class="node-rgl node-welding-text" onclick="executionFoward('焊装')"></div>
	                  <div title="涂装" id="node-painting" class="node-rgl node-painting-text" onclick="executionFoward('涂装')"></div>
	                  <div title="底盘" id="node-bottom" class="node-rgl node-bottom-text" onclick="executionFoward('底盘')"></div>
	                  <div title="总装" id="node-asembly" class="node-rgl node-asembly-text" onclick="executionFoward('总装')"></div>
	                  
	                  <div title="焊装监控" id="node-monitor-welding" class="node-rgl-1 node-monitor-welding" onclick="monitorFoward('welding')"></div>
	                  <div title="总装监控" id="node-monitor-assembly" class="node-rgl-1 node-monitor-assembly" onclick="monitorFoward('assembly')"></div>
	                  
	                  <div title="焊装A线上线数" id="node-online-w-a" class="node-rgl-2 node-online-w-a" ></div>
	                  <div title="焊装B线上线数" id="node-online-w-b" class="node-rgl-2 node-online-w-b" ></div>
	                  <div title="焊装A线下线数" id="node-offline-w-a" class="node-rgl-2 node-offline-w-a" ></div>
	                  <div title="焊装B线下线数" id="node-offline-w-b" class="node-rgl-2 node-offline-w-b" ></div>
	                  <div title="焊装在制数" class="node-rgl-3 node-prod-w" onclick="imgFoward('在制','焊装')">在制：<span id="node-prod-w" style="color:red"></span></div>
	                  
	                  <div title="" class="node-rgl-4 node-wip-1" onclick="imgFoward('在制','焊装')">WIP<br/><span id="node-wip-1" style="color:red"></span></div>
	                  
	                  <div title="涂装A线上线数" id="node-online-p" class="node-rgl-2 node-online-p" ></div>
	                  <div title="涂装A线下线数" id="node-offline-p" class="node-rgl-2 node-offline-p" ></div>
	                  <div title="涂装在制数"  class="node-rgl-3 node-prod-p" onclick="imgFoward('在制','涂装')">在制：<span id="node-prod-p" style="color:red"></span></div> 
	                  
	                  <div title="" class="node-rgl-4 node-wip-2" onclick="imgFoward('在制','涂装')">WIP<br/><span id="node-wip-2" style="color:red"></span></div>
	                  
	                  <div title="底盘A线上线数" id="node-online-b-a" class="node-rgl-2 node-online-b-a" ></div>
	                  <div title="底盘B线上线数" id="node-online-b-b" class="node-rgl-2 node-online-b-b" ></div>
	                  <div title="底盘A线下线数" id="node-offline-b-a" class="node-rgl-2 node-offline-b-a" ></div>
	                  <div title="底盘B线下线数" id="node-offline-b-b" class="node-rgl-2 node-offline-b-b" ></div>
	                  <div title="底盘在制数"  class="node-rgl-3 node-prod-b" onclick="imgFoward('在制','底盘')">在制：<span id="node-prod-b" style="color:red"></span></div>
	                  
	                  <div title=""  class="node-rgl-4 node-wip-3" onclick="imgFoward('在制','底盘')">WIP<br/><span id="node-wip-3" style="color:red"></span></div>
	                  
	                  <div title="总装A线上线数" id="node-online-a-a" class="node-rgl-2 node-online-a-a" ></div>
	                  <div title="总装B线上线数" id="node-online-a-b" class="node-rgl-2 node-online-a-b" ></div>
	                  <div title="总装A线下线数" id="node-offline-a-a" class="node-rgl-2 node-offline-a-a" ></div>
	                  <div title="总装B线下线数" id="node-offline-a-b" class="node-rgl-2 node-offline-a-b" ></div>
	                  <div title="总装在制数"  class="node-rgl-3 node-prod-a" onclick="imgFoward('在制','总装')">在制：<span id="node-prod-a" style="color:red"></span></div>                 
	                  
	                  <div title="入库数" id="node-warehouse" class="node-rgl-2 node-warehouse" ></div>
	                  
	                  <div title="铭牌打印" id="node-print-mp" class="node-rgl-5 node-print-mp" onclick="imgFoward('铭牌')"></div>	              
	                  <div title="合格证打印" id="node-print-hgz" class="node-rgl-5 node-print-hgz" onclick="imgFoward('合格证')"></div>
	                  <div title="发车" id="node-print-disp" style="width: 40px;height: 50px;" class="node-rgl-5 node-print-disp" onclick="imgFoward('发车')"></div>
	                  <div title="车身号打印" id="node-print-body" style="width: 90px;height: 30px;"  class="node-rgl-5 node-print-body" onclick="imgFoward('车身号')"></div>
	                  <div title="车身颜色" id="node-print-color" style="width: 100px;height: 30px;" class="node-rgl-5 node-print-color" onclick="imgFoward('车身颜色')"></div>
	                  <div title="VIN打印" id="node-print-vin" class="node-rgl-5 node-print-vin" onclick="imgFoward('VIN')"></div>
	                  <div title="座位数" id="node-print-seat" class="node-rgl-5 node-print-seat" onclick="imgFoward('座位数')"></div>
	                  
	                  <!-- <div title="调试区" id="node-debug-area" class="node-rgl-6 node-debug-area" onclick="executionFoward('调试区')"></div> -->
	                  <div title="检测线" id="node-testline" class="node-rgl-6 node-testline" onclick="executionFoward('检测线')"></div>
                  	  <div title="成品库" id="node-cpk" class="node-cpk" onclick="executionFoward('成品库')"></div>
                  
                  </div>
                </div>
				</div>
					</div>
				</div>

			</div>
			<!-- /.main-container -->
		</div>
	<script src="../assets/js/bootstrap3-typeahead.js"></script>
	<script src="../js/common.js"></script>
	<script src="../js/production/productionIndex.js"></script>
</body>

</html>
