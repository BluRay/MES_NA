<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String rqip= request.getRemoteAddr();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
%>
<head>
<link rel="stylesheet" href="<%=basePath%>/assets/css/bootstrap.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/font-awesome.min.css" />
<!-- text fonts -->
<link rel="stylesheet" href="<%=basePath%>/assets/css/ace-fonts.css" />
<!-- ace styles -->
<link rel="stylesheet" href="<%=basePath%>/assets/css/ace.min.css" id="main-ace-style" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/ace-skins.min.css" />
<link rel="stylesheet" href="<%=basePath%>/assets/css/ace-rtl.min.css" />

<script src="<%=basePath%>/assets/js/jquery.min.js"></script>
<script src="<%=basePath%>/assets/js/jquery.mobile.custom.min.js"></script>
<script src="<%=basePath%>/assets/js/ace-extra.min.js"></script>
<script src="<%=basePath%>/assets/js/bootstrap.min.js"></script>
<!-- page specific plugin scripts -->
<!-- ace scripts -->
<script src="<%=basePath%>/assets/js/ace-elements.min.js"></script>
<script src="<%=basePath%>/assets/js/ace.min.js"></script>
</head>