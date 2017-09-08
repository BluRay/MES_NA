package com.byd.bms.snaker.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.snaker.engine.IProcessService;
import org.snaker.engine.IQueryService;
import org.snaker.engine.SnakerEngine;
import org.snaker.engine.access.QueryFilter;
import org.snaker.engine.entity.Process;
import org.snaker.engine.entity.Task;
import org.snaker.engine.model.TaskModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.byd.bms.order.model.BmsOrderReviewResults;
import com.byd.bms.order.service.IOrderService;
import com.byd.bms.order.service.IReviewService;
import com.byd.bms.snaker.engine.SnakerEngineFacets;
import com.byd.bms.util.controller.BaseController;

/** 订单评审流程测试
 * @author thw
 */
@Controller
@RequestMapping(value = "/order/review")
public class OrderReviewController extends BaseController{
	private final static String applyRoleName="计划部发起评审";
	private final static String technicalRoleName="技术部评审";
	private final static String tachnologyRoleName="工艺部评审";
	private final static String qualityRoleName="品质部评审";
	private final static String factoryRoleName="工厂内部评审";
	private final static String planningRoleName="综合计划部物控评审";
	private final static String plandepRoleName="综合计划部计划评审";
	private final static String resultRoleName="评审结果修正";
	private final static String roleName="评审";
	@Autowired
	private SnakerEngine engine;
	@Autowired
    private SnakerEngineFacets facets;
	@Autowired
	protected IReviewService reviewService;
	@Autowired
	protected IProcessService processService;
	@Autowired
	protected IQueryService queryService;
	/**
	 * 请假申请路由方法
	 */
	@RequestMapping(value = "apply", method= RequestMethod.GET)
	public String apply(Model model, String processId, String orderId, String taskId, String taskName,
			String reviewOrderId,String factoryId) {
		//将请求参数继续传递给视图页面
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewOrderId", reviewOrderId);
		model.addAttribute("factoryId", factoryId);
		
		//根据taskId是否为空来标识当前请求的页面是否为活动任务的节点页面
		if(StringUtils.isEmpty(orderId) || StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,technicalRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			//如果实例id为空或者驳回情况下，返回apply.jsp
			return "order/review/apply";
		} else {
			//如果orderId非空、taskId为空，则表示申请步骤已提交，此时可获取申请数据
			//由于请假流程中的业务数据，是保存在任务表的variable字段中，所以通过flowData方法获取
			//如果业务数据保存在业务表中，需要业务表的orderId字段来关联流程，进而根据orderId查询出业务数据
			model.addAllAttributes(facets.flowData(orderId, taskName));
			//返回申请的查看页面
			return "order/review/applyView";
		}
	}
	
	/**
	 * 技术部评审路由方法
	 */
	@RequestMapping(value = "technical", method= RequestMethod.GET)
	public String technical(Model model, String processId, String orderId, String taskId, 
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		
		if(StringUtils.isNotEmpty(taskId)) {
			model.addAttribute("reviewResultId", reviewResultId);
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,tachnologyRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/technical";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/technicalView";
		}
	}
	
	/**
	 * 工艺部评审路由方法
	 */
	@RequestMapping(value = "technology", method= RequestMethod.GET)
	public String technology(Model model, String processId, String orderId, String taskId,
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,qualityRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/technology";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/technologyView";
		}
	}


/**
	 * 品质部评审路由方法
	 */
	@RequestMapping(value = "quality", method= RequestMethod.GET)
	public String quality(Model model, String processId, String orderId, String taskId,
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,factoryRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/quality";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/qualityView";
		}
	}
	/**
	 * 工厂内部评审路由方法
	 */
	@RequestMapping(value = "factory", method= RequestMethod.GET)
	public String factory(Model model, String processId, String orderId, String taskId, 
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,planningRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/factory";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/factoryView";
		}
	}
	/**
	 * 综合计划部评审路由方法
	 */
	@RequestMapping(value = "plandep", method= RequestMethod.GET)
	public String plandep(Model model, String processId, String orderId, String taskId,
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,resultRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/plandep";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/plandepView";
		}
	}
	/**
	 * 计划部物控评审路由方法
	 */
	@RequestMapping(value = "planning", method= RequestMethod.GET)
	public String planning(Model model, String processId, String orderId, String taskId,
			String taskName,String reviewResultId,String factoryId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			//下一节点操作人
			String nextOperator=getNextOperator(factoryId,plandepRoleName);
			model.addAttribute("operator", userId);
			model.addAttribute("nextOperator", nextOperator);
			return "order/review/planning";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/planningView";
		}
	}
	/**
	 * 评审结果修订
	 */
	@RequestMapping(value = "result", method= RequestMethod.GET)
	public String result(Model model, String processId, String orderId, String taskId, 
			String taskName,String reviewResultId) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId);
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewResultId", reviewResultId);
		if(StringUtils.isNotEmpty(taskId)) {
			//设置操作人为当前登录用户
			String userId = request.getSession().getAttribute("user_id") + "";
			model.addAttribute("operator", userId);
			return "order/review/result";
		} else {
			model.addAllAttributes(facets.flowData(orderId, taskName));
			return "order/review/resultView";
		}
	}
	/**
	 *   内部评审
	 * @return
	 */
	@RequestMapping("/internalReview")
	public ModelAndView internalReview(){ 
		mv.setViewName("order/internalReview");
        return mv;  
    } 
	/**
	 * ajax 获取订单评审列表数据
	 * @return model
	 */
	@RequestMapping("/showOrderReviewList")
	@ResponseBody
	public ModelMap showOrderReviewList(){
		model=new ModelMap();
		String userId = request.getSession().getAttribute("user_id") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String orderNo=request.getParameter("orderNo");//订单编号
		String orderId=request.getParameter("orderId");
		String reviewStatus=request.getParameter("reviewStatus");//评审状态
		String actYear=request.getParameter("actYear");//生产年份
		String factory=request.getParameter("factory");//工厂
		String orderColumn=request.getParameter("orderColumn");//排序字段
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("orderNo", orderNo);
		condMap.put("reviewStatus", reviewStatus);
		condMap.put("actYear",actYear);
		condMap.put("factory", factory);
		condMap.put("orderId", orderId);
		condMap.put("orderColumn", orderColumn);
		condMap.put("userId", userId);
		Map<String,Object> result=reviewService.getOrderReviewListPage(condMap);
		model.addAllAttributes(result);
		
		return model;
	}
	
    @RequestMapping(value = "getReviewResult")
    @ResponseBody
    public ModelMap getReviewResult() {
    	model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		
		String orderNo=request.getParameter("orderId");//订单编号
        String factory=request.getParameter("factoryId");//工厂
        String id=request.getParameter("id");
        condMap.put("orderId", orderNo);
		condMap.put("factoryId", factory);
		condMap.put("id", id);
		Map<String,Object> result=new HashMap<String,Object>();
		BmsOrderReviewResults bmsOrderReviewResults=reviewService.getOrderReview(condMap);
		result.put("bmsOrderReviewResults", bmsOrderReviewResults);
		result.put("orderNo", orderNo);
		model.addAllAttributes(result);
		return model;
    }
    /**
     * 
     */
    @RequestMapping(value = "getOrderReviewById")
    @ResponseBody
    public ModelMap getOrderReviewById() {
    	model=new ModelMap();
        String id=request.getParameter("id");
		Map<String,Object> result=new HashMap<String,Object>();
		Map map=reviewService.getOrderReviewById(id);
		result.put("data", map);
		model.addAllAttributes(result);
		return model;
    }
    @RequestMapping("/showOrderDetailList")
	@ResponseBody
	public ModelMap showOrderDetailList(){
		model=new ModelMap();
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		if (request.getParameter("search_order_no") != null) conditionMap.put("search_order_no", request.getParameter("search_order_no"));
		if ((request.getParameter("search_factory") != "")&&(request.getParameter("search_factory") != null)) conditionMap.put("search_factory", Integer.valueOf(request.getParameter("search_factory")));
		if (request.getParameter("order_id") != null){
			conditionMap.put("order_id", request.getParameter("order_id"));
		}
		if (request.getParameter("start") != null){
			conditionMap.put("start",request.getParameter("start"));
			conditionMap.put("length",request.getParameter("length"));
		}
		List datalist=new ArrayList();
		datalist=reviewService.getOrderDetailList(conditionMap);	
		
		model.put("data", datalist);
		return model;
	}
    /**
     * 
     * 
     */
    @RequestMapping(value = "getProcessByName")
    @ResponseBody
    public ModelMap getProcessByName() {
    	model=new ModelMap();
		Map<String,Object> result=new HashMap<String,Object>();
		String processName=request.getParameter("processName");
		Process process= processService.getProcessByName(processName);
		result.put("processId", process.getId());
		model.addAllAttributes(result);
		return model;
    }
    @RequestMapping(value = "getTaskByOrderId")
    @ResponseBody
    public ModelMap getTaskByOrderId() {
    	model=new ModelMap();
		Map<String,Object> result=new HashMap<String,Object>();
		String orderId=request.getParameter("orderId");
		List<Task> tasks = engine.query().getActiveTasks(new QueryFilter().setOrderId(orderId));
		if(tasks != null && tasks.size() > 0) {
			result.put("taskId", tasks.get(0).getId());
		}
		model.addAllAttributes(result);
		return model;
    }
    @RequestMapping(value = "getTaskActorId")
    @ResponseBody
    public ModelMap getTaskActorId() {
    	model=new ModelMap();
		Map<String,Object> result=new HashMap<String,Object>();
		String taskId=request.getParameter("taskId");
		String[] taskActors = queryService.getTaskActorsByTaskId(taskId);
		String userId = request.getSession().getAttribute("user_id") + "";
		if(taskActors != null && taskActors.length > 0) {
			for(String taskActor : taskActors){
				if(userId.equals(taskActor)){
					result.put("taskActor", taskActor);
				}
			}
		}
		model.addAllAttributes(result);
		return model;
    }

    /* 根据 factoryId 查询当前用户是否有发起或查看操作评审权限
     *
     *type: 发起:start  查看: check
    */
    @RequestMapping(value = "isApplyPermission")
    @ResponseBody
    public ModelMap isApplyPermission(String factoryId,String type){
    	model=new ModelMap();
    	String userId = request.getSession().getAttribute("user_id") + "";
		Map<String,Object> result=new HashMap<String,Object>();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("userId", userId);
		condMap.put("factoryId", factoryId);
		condMap.put("type", type);
		if(type.equals("start")){
			condMap.put("roleName", applyRoleName);
		}
		if(type.equals("check")){
			condMap.put("roleName", roleName);
		}
    	boolean isPermission = reviewService.isPermission(condMap);
    	result.put("isPermission", isPermission);
    	model.addAllAttributes(result);
		return model;
    }
    
    public String getNextOperator(String factoryId,String roleName){
    	Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("roleName", roleName);
		condMap.put("factoryId", factoryId);
    	String nextOperator = reviewService.getNextOperator(condMap);
    	return nextOperator;
    	
    }
}