<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>MES</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
		<jsp:include page="common.jsp"></jsp:include>
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<%-- <jsp:include page="top.jsp" flush="true"/> --%>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
		<%-- 	<jsp:include page="left.jsp" flush="true"/> --%>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs breadcrumbs-fixed" id="breadcrumbs" >
					<ul class="breadcrumb" style="font-size:14px;">
						<li><a href="<%=request.getContextPath()%>/index_mobile"><i class="ace-icon fa fa-home home-icon bigger-160"></i>MES</a></li>
					</ul><!-- /.breadcrumb -->

					<!-- #section:basics/content.searchbox -->
				 	<div class="nav-search" id="nav-search" style="top: 10px;font-size:14px;">
						<a href="/MES/logout">
								<i class="ace-icon fa fa-power-off bigger-160" ></i>Logout
						</a>
					</div>
				</div>
				
			<div class="page-content">
					<!-- 设置小部件 -->
					<%-- <jsp:include page="settings.jsp" flush="true"/> --%>
					<!-- /section:settings.box -->
					<div class="page-content-area">
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/scan.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('execution');">							
									</div>
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/prdRcd.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('prdRcd');">
									</div>
								</div>
							</div>			
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<label>
										Production
										</label>
									</div>
									<div class="col-xs-6" style="text-align:center">
										<label>
										Inspection record
										</label>
									</div>
								</div>
							</div>		
							
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/keyparts.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('busTrace');">							
									</div>
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/exception.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('techfollow');">
									</div>
								</div>
							</div>			
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<label>
										Bus trace
										</label>
									</div>
									<div class="col-xs-6" style="text-align:center">
										<label>
										Ecn
										</label>
									</div>
								</div>
							</div>	
							
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/scan.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('execution');">							
									</div>
									<div class="col-xs-6" style="text-align:center">
										<img id="scan" class="img " src="images/prdRcd.png" style="width:90%;height:90%;" onclick="javascript: return pageForward('prdRcd');">
									</div>
								</div>
							</div>			
							<div class="row" style="margin-top:10px;">
								<div class="col-xs-12">
									<div class="col-xs-6" style="text-align:center">
										<label>
										Production
										</label>
									</div>
									<div class="col-xs-6" style="text-align:center">
										<label>
										Inspection record
										</label>
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
	<script type="text/javascript">
		function pageForward(flag){
			var url="";
			if(flag=='execution'){
				url="/MES/production/execution_mobile"
			}
			if(flag=='busTrace'){
				url="/MES/production/busTrace_mobile"
			}
			if(flag=='exception'){
				url="/MES/production/exception_mobile"
			}
			if(flag=='techfollow'){
				url="/MES/production/techFollowMobile"
			}
			window.location=url
		}
	</script>
</html>
