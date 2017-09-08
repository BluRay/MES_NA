<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html lang="en">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta charset="utf-8" />
		<title>模板</title>
		<meta name="description" content="Common Buttons &amp; Icons" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
	</head>
	<body class="no-skin" style="font-family: 'Microsoft YaHei';">
		<!-- 头 -->
		<jsp:include page="top.jsp" flush="true"/>
		<!-- 身 -->
		<div class="main-container" id="main-container">
			<!-- 左边菜单 -->
			<jsp:include page="left.jsp" flush="true"/>
			<!-- 主体 -->
			<div class="main-content">			
			<!-- 路径和搜索框 -->
			<div class="breadcrumbs" id="breadcrumbs">
					<ul class="breadcrumb">
						<li><i class="ace-icon fa fa-home home-icon"></i><a href="<%=request.getContextPath()%>/index">首页</a></li>
						<li><a href="#">模块</a></li>
						<li class="active">功能</li>
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
					<!-- 设置小部件 -->
					<jsp:include page="settings.jsp" flush="true"/>
					<!-- /section:settings.box -->
					<div class="page-content-area">
					
					<!-- 东西放这里！ -->		
					
					</div>
			</div><!-- /.main-content -->

			<!-- 脚 -->
			<%-- <jsp:include page="footer.jsp" flush="true"/> --%>
			<a href="#" id="btn-scroll-up" class="btn-scroll-up btn btn-sm btn-inverse"><i class="ace-icon fa fa-angle-double-up icon-only bigger-110"></i></a>
		</div><!-- /.main-container -->
	</div>
	</body>
</html>
