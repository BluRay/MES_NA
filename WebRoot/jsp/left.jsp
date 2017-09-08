<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String rqip= request.getRemoteAddr();

String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path;
/* if(rqip!=request.getServerName()){
	basePath=rqip+"/";
} */
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
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
		<!-- inline scripts related to this page -->
		<script type="text/javascript">
			jQuery(function($) {
				$('#loading-btn').on(ace.click_event, function () {
					var btn = $(this);
					btn.button('loading')
					setTimeout(function () {
						btn.button('reset')
					}, 2000)
				});			
				$('#id-button-borders').attr('checked' , 'checked').on('click', function(){
						$('#default-buttons .btn').toggleClass('no-border');
				});
			})
		</script>	
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>left</title>
<script type="text/javascript">
var s = [];
function ajaxQueryMenu(){
	$.ajax({
	    url: "<%=basePath%>/getMenu",
	    async: false,
	    dataType: "json",
		type: "get",
	    data: {
	    	//parentId:"1",
	    },
	    success:function(response){
	    	if(response.success) {
                $.each(eval("(" + response.result + ")"), function (index, value) {
                	value.list = [];
                    s.push(value);
                });
            } 
	    }
	});
}

function recursiveTree(id,s) {
	var node = getTreeNode(id,s);
	var childTreeNodes = queryTreeNode(id,s);
	$.each(childTreeNodes, function (index, value) {
		var n = recursiveTree(value.id,s); // 递归
		node.list.push(n);
    });
	return node;
}

function queryTreeNode(id,s) {
	var list = [];
	$.each(s, function (index, value) {
		if(value.parent===0){
			//do nothing
		}else if(value.parent===id){
			list.push(value);
		}
	});
	return list;
}

function getTreeNode(id,s) {
	var tn;
	$.each(s, function (index, value) {
		if(value.id===id){
			tn = value;
		}
	});
	return tn;
}

var menuTree = [];
$(document).ready(function () {
	//收起侧边菜单
	/* $('.nav-list').find('li').each(function(){
		$(this).removeClass('active');
	}); */
	
	/* $('.nav-list').find('li').on('click',function(){
		//alert($(this).html());
		$('.nav-list').find('li').each(function(){
			if($(this).hasClass('open')){
			alert($(this).html());
			$(this).find('a').eq(0).trigger("click");
			}
		});
	});  */
	
	//查询菜单数据
	ajaxQueryMenu();
	$.ajax({
		type:'GET',
		url:"<%=basePath%>/common/getTaskList",
		data:{},
		async: false,
		globle:false,
		error: function(){
			alert('数据处理错误！');
			return false;
		},
		success: function(data){
			data = eval("(" + data + ")");
 			$("#taskcount").html(data.count);
 			$("#task").html("需处理任务数 "+data.count+" 个");
			var str="";
            console.log("object",data);
			$.each(data.datalist,function(index,item){
				var url="<%=basePath%>/"+item.url;
				if(item.params!=null && item.params!=undefined){
					url+=item.params;
				}
				str+="<a href="+url+"><div class='clearfix'><span class='pull-left'>"+item.task_type_name+" [ "+item.count+"-"+item.finish_count+" ]</span><span class='pull-right'>"+item.percent+"%</span></div><div class='progress progress-mini'><div style='width:"+item.percent+"%' class='progress-bar'></div></div></a>";
			});
			$("#foreach").html(str);
		}
	});
	//生成菜单树
	if(s.length>0){
		$.each(s, function (index, value) {
			if(value.parent===0){
				var node = recursiveTree(value.id,s);
				menuTree.push(node);
			}
		});
	}
	//console.log(menuTree);
	//生成菜单元素
	if(menuTree.length>0){
		$.each(menuTree, function (index, value) {
			var root = $('.nav-list');
			
			var li = $('<li  class="" />');
			var a = $('<a href=\"<%=basePath%>/'+value.path+'\" ></a>');
			if(value.icon==='' || value.icon==undefined){
				var i = $('<i class="menu-icon fa fa-desktop"></i>');
			}else{
				var i = $('<i class="'+value.icon+'"></i>');
			}
			i.appendTo(a);
			var span = $('<span class="menu-text">'+value.name+' </span>');
			span.appendTo(a);
			if(value.list.length>0){
				a.addClass('dropdown-toggle');
				var b = $('<b class="arrow fa fa-angle-down"></b>');
				b.appendTo(a);
			}
			/* var i1 = $('<i class="'+value.icon+'"></i>');
			i1.appendTo(a); */
			a.appendTo(li);
			var b1 = $('<b class="arrow"></b>');
			b1.appendTo(li);
			
			traverseTree(value,li,true);
			//console.log('---->' + index + ' ' + li.html());
			
			li.appendTo(root);
		});
	}
	
	//定位当前菜单
	var url = window.location+"";
	//alert(getRealPath(url));
	$('.nav-list').find('li').each(function(){
		if(getRealPath(url)===getRealPath($(this).find("a").eq(0).attr('href'))){
			//alert(getRealPath($(this).find("a").eq(0).attr('href')));
			/* $(this).parent().parent().addClass('open');*/
			//$(this).parent().parent().parent().parent().find('a').eq(0).trigger("click");
			//$(this).parent().parent().addClass('active');
			$(this).addClass('active');
			var parent_li=$(this).parent("ul").parent("li");
			//alert($(parent_li).find(".fa-angle-down"));
			var p_li_list=new Array();
			while($(parent_li).find("a").eq(0).hasClass("dropdown-toggle")){
				$(parent_li).addClass("open");
				//$(parent_li).find("a").eq(0).trigger("click");		
				//$(parent_li).find("ul").eq(0).css("display","block");
				//alert($(parent_li).html());
				p_li_list.push(parent_li);
				parent_li=$(parent_li).parent().parent();				
			}
			var li=p_li_list.pop();
			//alert($(li).html());
			while(li!=undefined){
				//alert($(li).html());
				$(li).find('a').eq(0).trigger("click");
				li=p_li_list.pop();
			}
		
			 $(this).find('a').eq(0).trigger("click"); 
		}
	});
});

function getRealPath(url){
	var str = url;
	var index2 = str.lastIndexOf("<%= path %>");
	if(index2===-1){
		//do nothing
	}else{
		str  = str.substring(index2 + 1, str.length);
	}
	var index = str.lastIndexOf("?");
	if(index===-1){
		//do nothing
	}else{
		str = str.substring(0,index);
	}
	var index1 = str.lastIndexOf(".");
	if(index1===-1){
		return str;
	}
	str = str.substring(0,index1);
	return str;
}

//遍历树生成菜单元素
function traverseTree(node,parentli,two){
	var ul = $('<ul class="submenu" />');
	$.each(node.list, function (index, value) {
		var li = $('<li  class="" />');
		var a = $('<a href=\"<%=basePath%>/'+value.path+'\" ></a>');
		if(value.list.length>0){
			a.addClass('dropdown-toggle');
			if(two){
				var i = $('<i class="menu-icon fa fa-caret-right"></i>');
				i.appendTo(a);
			}else{
				var i = $('<i class="'+value.icon+'"></i>');
				i.appendTo(a);
			}
			var b = $('<b class="arrow fa fa-angle-down"></b>');
			b.appendTo(a);
		}else{
			if(two){
				var i1 = $('<i class="menu-icon fa fa-caret-right"></i>');
				i1.appendTo(a);
			}else{
				var i1 = $('<i class="'+value.icon+'"></i>');
				i1.appendTo(a);
			}
		} 
		if(two){
			a.append('<span><i class="'+value.icon+'" style="margin-right:3px;"></i>'+value.name+'</span>');
		}else{
			a.append('&nbsp;&nbsp;&nbsp;'+value.name);
		}
		a.appendTo(li);
		var b1 = $('<b class="arrow"></b>');
		b1.appendTo(li);
		li.appendTo(ul);
		traverseTree(value,li);//递归
		ul.appendTo(parentli);
	});
}
</script>
</head>
<body>
	<!-- #section:basics/sidebar -->
	<div id="sidebar" class="sidebar                  responsive sidebar-fixed sidebar-scroll">
				

				<div class="sidebar-shortcuts" id="sidebar-shortcuts">
					<div class="sidebar-shortcuts-large" id="sidebar-shortcuts-large">
						<button class="btn btn-success">
							<i class="ace-icon fa fa-signal"></i>
						</button>

						<button class="btn btn-info">
							<i class="ace-icon fa fa-pencil"></i>
						</button>

						<!-- #section:basics/sidebar.layout.shortcuts -->
						<button class="btn btn-warning">
							<i class="ace-icon fa fa-users"></i>
						</button>

						<button class="btn btn-danger">
							<i class="ace-icon fa fa-cogs"></i>
						</button>

						<!-- /section:basics/sidebar.layout.shortcuts -->
					</div>

					<div class="sidebar-shortcuts-mini" id="sidebar-shortcuts-mini">
						<span class="btn btn-success"></span>

						<span class="btn btn-info"></span>

						<span class="btn btn-warning"></span>

						<span class="btn btn-danger"></span>
					</div>
				</div><!-- /.sidebar-shortcuts -->

				<ul class="nav nav-list">
					<li class="">
						<a href="<%=basePath%>/index">
							<i class="menu-icon fa fa-home green"></i>
							<span class="menu-text"> Index </span>
						</a>

						<b class="arrow"></b>
					</li>

					<%-- <li  class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa fa-desktop"></i>
							<span class="menu-text"> 界面 &amp; 元素 </span>

							<b class="arrow fa fa-angle-down"></b>
						</a>

						<b class="arrow"></b>

						<ul class="submenu">
							<li class="">
								<a href="<%=basePath%>/blank.html">
									<i class="menu-icon fa fa-caret-right"></i>
									模板
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/elements.html">
									<i class="menu-icon fa fa-caret-right"></i>
									元素
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/buttons.html">
									<i class="menu-icon fa fa-caret-right"></i>
									按钮 &amp; 图标
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/treeview.html">
									<i class="menu-icon fa fa-caret-right"></i>
									树形菜单
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/jqueryui.html">
									<i class="menu-icon fa fa-caret-right"></i>
									jQuery UI
								</a>

								<b class="arrow"></b>
							</li>
						</ul>
					</li>

					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa fa-list"></i>
							<span class="menu-text"> 表格 </span>

							<b class="arrow fa fa-angle-down"></b>
						</a>

						<b class="arrow"></b>

						<ul class="submenu">
							<li class="">
								<a href="<%=basePath%>/tables.html">
									<i class="menu-icon fa fa-caret-right"></i>
									简单 &amp; 动态
								</a>

								<b class="arrow"></b>
							</li>
						</ul>
					</li>

					<li class="">
						<a href="#" class="dropdown-toggle">
							<i class="menu-icon fa fa-pencil-square-o"></i>
							<span class="menu-text"> 表单 </span>

							<b class="arrow fa fa-angle-down"></b>
						</a>

						<b class="arrow"></b>

						<ul class="submenu">
							<li class="">
								<a href="<%=basePath%>/formelements.html">
									<i class="menu-icon fa fa-caret-right"></i>
									表单元素
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/formwizard.html">
									<i class="menu-icon fa fa-caret-right"></i>
									向导 &amp; 校验
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/wysiwyg.html">
									<i class="menu-icon fa fa-caret-right"></i>
									文本编辑器
								</a>

								<b class="arrow"></b>
							</li>

							<li class="">
								<a href="<%=basePath%>/dropzone.html">
									<i class="menu-icon fa fa-caret-right"></i>
									拖拽上传文件
								</a>

								<b class="arrow"></b>
							</li>
							<li class="">
								<a href="<%=basePath%>/flow.html">
									<i class="menu-icon fa fa-caret-right"></i>
									流程测试
								</a>

								<b class="arrow"></b>
							</li>
						</ul>
					</li> --%>
				</ul><!-- /.nav-list -->

				<!-- #section:basics/sidebar.layout.minimize -->
				<div class="sidebar-toggle sidebar-collapse" id="sidebar-collapse">
					<i class="ace-icon fa fa-angle-double-left" data-icon1="ace-icon fa fa-angle-double-left" data-icon2="ace-icon fa fa-angle-double-right"></i>
				</div>				
				<!-- /section:basics/sidebar.layout.minimize -->
				<script type="text/javascript">
					try{ace.settings.check('sidebar' , 'collapsed')}catch(e){}
				</script>
		<div style="display: none;position:absolute;z-index:999;top:50%;left:350%" class="divLoading" >
             <span><i class="fa fa-spinner fa-spin fa-4x" style="height:1em;"></i></span>
         </div> 
			</div>
			
</body>
</html>