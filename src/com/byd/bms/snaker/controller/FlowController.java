package com.byd.bms.snaker.controller;

import org.apache.commons.beanutils.ConvertUtils;
import org.apache.commons.lang3.StringUtils;
import org.snaker.engine.access.Page;
import org.snaker.engine.access.QueryFilter;
import org.snaker.engine.entity.Order;
import org.snaker.engine.entity.Process;
import org.snaker.engine.entity.HistoryOrder;
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

import java.util.*;

import javax.servlet.http.HttpServletRequest;

 

/** 流程处理
 * @author thw
 * @since 2.0
 */
@Controller
@RequestMapping(value = "/snaker/flow")
public class FlowController extends BaseController{
    @Autowired
    private SnakerEngineFacets facets;
    @Autowired
	protected IOrderService orderService;
    @Autowired
	protected IReviewService reviewService;
    @SuppressWarnings("unchecked")
	@RequestMapping(value = "process")
    @ResponseBody
    public ModelMap process(HttpServletRequest request) {
    	model=new ModelMap();
    	Map<String, Object> params =getParams(request);
        String processId = request.getParameter("processId");
        String orderId = request.getParameter("orderId");
        String taskId = request.getParameter("taskId");
        String reviewOrderId = request.getParameter("reviewOrderId");
        String factoryId = request.getParameter("factoryId");
        String type = request.getParameter("type");
        String reviewResultId = request.getParameter("reviewResultId");
        String userId = request.getSession().getAttribute("user_id") + "";
        String nextOperator = request.getParameter("");
        if (StringUtils.isEmpty(orderId) && StringUtils.isEmpty(taskId)) {
        	BmsOrderReviewResults bmsOrderReviewResults=getBmsOrderReviewResults(request);
        	Order order=facets.startAndExecute(processId, userId, params);
        	if(type.equals("apply")){
        		bmsOrderReviewResults.setOrderId(Integer.parseInt(reviewOrderId));
            	bmsOrderReviewResults.setFactoryId(Integer.parseInt(factoryId));
            	bmsOrderReviewResults.setWfOrderId(order.getId());
            	bmsOrderReviewResults.setWfProcessId(order.getProcessId());
            	int reuslt =reviewService.saveBmsOrderReviewResults(bmsOrderReviewResults);
            	if(reuslt==1){
            		model.put("success", true);
            	}
        	}
        } else {
            String methodStr = request.getParameter("method");
            int method;
            try {
                method = Integer.parseInt(methodStr);
            } catch(Exception e) {
                method = 0;
            }
            switch(method) {
                case 0://任务执行
                    facets.execute(taskId, userId, params);
                    params.put("type",type);
                    params.put("id", reviewResultId);
            		int reuslt =reviewService.updateBmsOrderReviewResults(params);
            		if(reuslt==1){
                		model.put("success", true);
                	}
                    break;
                case -1://驳回、任意跳转
                    facets.executeAndJump(taskId, userId, params, request.getParameter("nodeName"));
                    break;
                case 1://转办
                    if(StringUtils.isNotEmpty(nextOperator)) {
                        facets.transferMajor(taskId, userId, nextOperator.split(","));
                    }
                    break;
                case 2://协办
                    if(StringUtils.isNotEmpty(nextOperator)) {
                        facets.transferAidant(taskId, "admin", nextOperator.split(","));
                    }
                    break;
                default:
                    facets.execute(taskId, userId, params);
                    break;
            }
        }
        String ccOperator = request.getParameter("ccoperator");
        if(StringUtils.isNotEmpty(ccOperator)) {
            facets.getEngine().order().createCCOrder(orderId, ccOperator);
        }
        //return "redirect:/snaker/task/active";
        return model;
    }
    /**
     * 流程实例查询
     * @param model
     * @param page
     * @return
     */
    @RequestMapping(value = "order", method= RequestMethod.GET)
    public String order(Model model, Page<HistoryOrder> page) {
        facets.getEngine().query().getHistoryOrders(page, new QueryFilter());
        model.addAttribute("page", page);
        return "snaker/order";
    }

    /**
     * 抄送实例已读
     * @param id
     * @param url
     * @return
     */
    @RequestMapping(value = "ccread")
    public String ccread(String id, String url) {
    	String[] assignees = new String[]{"admin"};
        facets.getEngine().order().updateCCStatus(id, assignees);
        return "redirect:" + url;
    }

    /**
     * 通用的流程展现页面入口
     * 将流程中的各环节表单以tab+iframe方式展现
     */
    @RequestMapping(value = "all")
    public ModelAndView all(Model model, String processId, String orderId, String taskId,
    		String reviewOrderId,String factoryId,String reviewResultId,String orderNo) {
		model.addAttribute("processId", processId);
		model.addAttribute("orderId", orderId); // 评审流程ID 【wf_order】
		model.addAttribute("taskId", taskId);
		model.addAttribute("reviewOrderId", reviewOrderId); //订单ID 【bms_or_order】
		model.addAttribute("reviewResultId", reviewResultId); // 评审结果表ID 【bms_order_review_result】
		model.addAttribute("factoryId", factoryId);
		model.addAttribute("orderNo", orderNo); // 订单编号 【bms_or_order】
        if(StringUtils.isNotEmpty(processId)) {
            model.addAttribute("process", facets.getEngine().process().getProcessById(processId));
        }
        if(StringUtils.isNotEmpty(orderId)) {
            model.addAttribute("order", facets.getEngine().query().getOrder(orderId));
        }
        if(StringUtils.isNotEmpty(taskId)) {
            model.addAttribute("task", facets.getEngine().query().getTask(taskId));
        }
        //return "snaker/all";
        model.addAttribute("processId", processId);
        model.addAttribute("orderId", orderId);
        mv.setViewName("snaker/review");
		return mv;
    }

    /**
     * 节点信息以json格式返回
     * all页面以节点信息构造tab及加载iframe
     */
    @RequestMapping(value = "node")
    @ResponseBody
    public Object node(String processId) {
        Process process = facets.getEngine().process().getProcessById(processId);
        List<TaskModel> models = process.getModel().getModels(TaskModel.class);
        List<TaskModel> viewModels = new ArrayList<TaskModel>();
        for(TaskModel model : models) {
            TaskModel viewModel = new TaskModel();
            viewModel.setName(model.getName());
            viewModel.setDisplayName(model.getDisplayName());
            viewModel.setForm(model.getForm());
            viewModels.add(viewModel);
        }
        return viewModels;
    }
    public Map<String, Object> getParams(HttpServletRequest request){
    	Map<String, Object> params = new HashMap<String, Object>();
    	String type= request.getParameter("type");
    	if(type.equals("apply")){
    		String partsonlineDate= request.getParameter("partsonlineDate");
        	String weldingonlineDate= request.getParameter("weldingonlineDate");
        	String paintonlineDate= request.getParameter("paintonlineDate");
        	String chassisonlineDate= request.getParameter("chassisonlineDate");
        	String drawingexportDate= request.getParameter("drawingexportDate");
        	String assemblyonlineDate= request.getParameter("assemblyonlineDate");
        	String warehousingDate= request.getParameter("warehousingDate");
        	String modelexportDate= request.getParameter("modelexportDate");
        	String detaildemandNode= request.getParameter("detaildemandNode");
        	String sopdemandNode= request.getParameter("sopdemandNode");
        	String sipdemandNode= request.getParameter("sipdemandNode");
        	String bomdemandNode= request.getParameter("bomdemandNode");
        	String apply_operator= request.getParameter("apply.operator");
        	String technical_operator= request.getParameter("technical.operator");
        	String quality_operator= request.getParameter("quality.operator");
        	String technology_operator= request.getParameter("technology.operator");
        	params.put("partsonlineDate", partsonlineDate);
        	params.put("weldingonlineDate", weldingonlineDate);
        	params.put("chassisonlineDate", chassisonlineDate);
        	params.put("paintonlineDate", paintonlineDate);
        	params.put("drawingexportDate", drawingexportDate);
        	params.put("assemblyonlineDate", assemblyonlineDate);
        	params.put("warehousingDate", warehousingDate);
        	params.put("modelexportDate", modelexportDate);
        	params.put("detaildemandNode", detaildemandNode);
        	params.put("sopdemandNode", sopdemandNode);
        	params.put("sipdemandNode", sipdemandNode);
        	params.put("bomdemandNode", bomdemandNode);
        	params.put("apply.operator", apply_operator);
        	params.put("technical.operator", technical_operator);
//        	params.put("technology.operator", technology_operator);
//        	params.put("quality.operator", quality_operator);
    	}
    	if(type.equals("technical")){
    		// 技术部页面评审参数
        	String configTable= request.getParameter("configTable");
        	String proximatematter= request.getParameter("proximatematter");
        	String modeljudging= request.getParameter("modeljudging");
        	String drawingearlierjudging= request.getParameter("drawingearlierjudging");
        	String purchasedetail= request.getParameter("purchasedetail");
        	String technicaldatanode= request.getParameter("technicaldatanode");
        	String technical_operator= request.getParameter("technical.operator");
        	String technology_operator= request.getParameter("technology.operator");
        	String mintechInfo= request.getParameter("mintechInfo");
        	
        	params.put("configTable", configTable);
        	params.put("proximatematter", proximatematter);
        	params.put("modeljudging", modeljudging);
        	params.put("drawingearlierjudging", drawingearlierjudging);
        	params.put("purchasedetail", purchasedetail);
        	params.put("technicaldatanode", technicaldatanode);
        	params.put("mintechInfo", mintechInfo);
        	params.put("technical.operator", technical_operator);
        	params.put("technology.operator", technology_operator);
    	}
    	if(type.equals("technology")){
    		// 工艺部页面评审参数
        	String technicsNode= request.getParameter("technicsNode");
        	String technicsInfo= request.getParameter("technicsInfo");
        	String technology_operator= request.getParameter("technology.operator");
        	String quality_operator= request.getParameter("quality.operator");
        	params.put("technicsNode", technicsNode);
        	params.put("technicsInfo", technicsInfo);
        	params.put("technology.operator", technology_operator);
        	params.put("quality.operator", quality_operator);
    	}
    	if(type.equals("quality")){
    		// 品质部页面评审参数
        	String qualityNode= request.getParameter("qualityNode");
        	String qualityInfo= request.getParameter("qualityInfo");
        	String quality_operator= request.getParameter("quality.operator");
        	String factory_operator= request.getParameter("factory.operator");
        	params.put("qualityNode", qualityNode);
        	params.put("qualityInfo", qualityInfo);
        	params.put("quality.operator", quality_operator);
        	params.put("factory.operator", factory_operator);
    	}
    	if(type.equals("factory")){
    		// 工厂内部页面评审参数
        	String factoryNode= request.getParameter("factoryNode");
        	String factoryInfo= request.getParameter("factoryInfo");
        	String factory_operator= request.getParameter("factory.operator");
        	String planning_operator= request.getParameter("planning.operator");
        	params.put("factoryNode", factoryNode);
        	params.put("factoryInfo", factoryInfo);
        	params.put("planning.operator", planning_operator);
        	params.put("factory.operator", factory_operator);
    	}
    	if(type.equals("planning")){
    		// 计划部物控页面评审参数
        	String materialcontrolInfo= request.getParameter("materialcontrolInfo");
        	String materialcontrolNode= request.getParameter("materialcontrolNode");
        	String planning_operator= request.getParameter("planning.operator");
        	String plandep_operator= request.getParameter("plandep.operator");
        	params.put("materialcontrolInfo", materialcontrolInfo);
        	params.put("materialcontrolNode", materialcontrolNode);
        	params.put("planning.operator", planning_operator);
        	params.put("plandep.operator", plandep_operator);
    	}
    	if(type.equals("plandep")){
    		// 综合计划部页面评审参数
        	String plandepNode= request.getParameter("plandepNode");
        	String plandepInfo= request.getParameter("plandepInfo");
        	String plandep_operator= request.getParameter("plandep.operator");
        	String result_operator= request.getParameter("result.operator");
        	params.put("plandepNode", plandepNode);
        	params.put("plandepInfo", plandepInfo);
        	params.put("plandep.operator", plandep_operator);
        	params.put("result.operator", result_operator);
    	}
    	if(type.equals("result")){
    		// 评审结果部页面评审参数
        	String revisiondetailNode= request.getParameter("revisiondetailNode");
        	String revisionsopNode= request.getParameter("revisionsopNode");
        	String revisionbomNode= request.getParameter("revisionbomNode");
        	String revisionsipNode= request.getParameter("revisionsipNode");
        	String revisionpartsonlineDate= request.getParameter("revisionpartsonlineDate");
        	String revisionweldingonlineDate= request.getParameter("revisionweldingonlineDate");
        	String revisionpaintonlineDate= request.getParameter("revisionpaintonlineDate");
        	String revisionchassisonlineDate= request.getParameter("revisionchassisonlineDate");
        	String revisionassemblyonlineDate= request.getParameter("revisionassemblyonlineDate");
        	String revisionwarehousingDate= request.getParameter("revisionwarehousingDate");
        	String deliveryDate= request.getParameter("deliveryDate");
        	String result_operator= request.getParameter("result.operator");
        	params.put("revisiondetailNode", revisiondetailNode);
        	params.put("revisionsopNode", revisionsopNode);
        	params.put("revisionbomNode", revisionbomNode);
        	params.put("revisionsipNode", revisionsipNode);
        	params.put("revisionpartsonlineDate", revisionpartsonlineDate);
        	params.put("revisionweldingonlineDate", revisionweldingonlineDate);
        	params.put("revisionpaintonlineDate", revisionpaintonlineDate);
        	params.put("revisionchassisonlineDate", revisionchassisonlineDate);
        	params.put("revisionassemblyonlineDate", revisionassemblyonlineDate);
        	params.put("revisionwarehousingDate", revisionwarehousingDate);
        	params.put("deliveryDate", deliveryDate);
        	params.put("result.operator", result_operator);
    	}
    	return params;
    }
    public BmsOrderReviewResults getBmsOrderReviewResults(HttpServletRequest request){
    	BmsOrderReviewResults bmsOrderReviewResults = new BmsOrderReviewResults();
        String partsonlineDate= request.getParameter("partsonlineDate");
    	String weldingonlineDate= request.getParameter("weldingonlineDate");
    	String paintonlineDate= request.getParameter("paintonlineDate");
    	String chassisonlineDate= request.getParameter("chassisonlineDate");
    	String drawingexportDate= request.getParameter("drawingexportDate");
    	String assemblyonlineDate= request.getParameter("assemblyonlineDate");
    	String warehousingDate= request.getParameter("warehousingDate");
    	String modelexportDate= request.getParameter("modelexportDate");
    	String detaildemandNode= request.getParameter("detaildemandNode");
    	String sopdemandNode= request.getParameter("sopdemandNode");
    	String sipdemandNode= request.getParameter("sipdemandNode");
    	String bomdemandNode= request.getParameter("bomdemandNode");
    	String configTable= request.getParameter("configTable");
    	String proximatematter= request.getParameter("proximatematter");
    	String modeljudging= request.getParameter("modeljudging");
    	String drawingearlierjudging= request.getParameter("drawingearlierjudging");
    	String purchasedetail= request.getParameter("purchasedetail");
    	String technicaldatanode= request.getParameter("technicaldatanode");
    	bmsOrderReviewResults.setPaintonlineDate(paintonlineDate);
    	bmsOrderReviewResults.setWeldingonlineDate(weldingonlineDate);
    	bmsOrderReviewResults.setPartsonlineDate(partsonlineDate);
    	bmsOrderReviewResults.setChassisonlineDate(chassisonlineDate);
    	bmsOrderReviewResults.setDrawingexportDate(drawingexportDate);
    	bmsOrderReviewResults.setAssemblyonlineDate(assemblyonlineDate);
    	bmsOrderReviewResults.setWarehousingDate(warehousingDate);
    	bmsOrderReviewResults.setModelexportDate(modelexportDate);
    	bmsOrderReviewResults.setDetaildemandNode(detaildemandNode);
    	bmsOrderReviewResults.setSopdemandNode(sopdemandNode);
    	bmsOrderReviewResults.setSipdemandNode(sipdemandNode);
    	bmsOrderReviewResults.setBomdemandNode(bomdemandNode);
    	bmsOrderReviewResults.setConfigTable(configTable);
    	bmsOrderReviewResults.setProximatematter(proximatematter);
    	bmsOrderReviewResults.setModeljudging(modeljudging);
    	bmsOrderReviewResults.setDrawingearlierjudging(drawingearlierjudging);
    	bmsOrderReviewResults.setPurchasedetail(purchasedetail);
    	bmsOrderReviewResults.setTechnicaldatanode(technicaldatanode);
    	return bmsOrderReviewResults;
    }
    @RequestMapping({"processtest"})
    public String processtest(HttpServletRequest request)
    {
      Map<String, Object> params = new HashMap();
      Enumeration<String> paraNames = request.getParameterNames();
      while (paraNames.hasMoreElements())
      {
        String element = (String)paraNames.nextElement();
        int index = element.indexOf("_");
        String paraValue = request.getParameter(element);
        if (index == -1)
        {
          params.put(element, paraValue);
        }
        else
        {
          char type = element.charAt(0);
          String name = element.substring(index + 1);
          Object value = null;
          switch (type)
          {
          case 'S': 
            value = paraValue;
            break;
          case 'I': 
            value = ConvertUtils.convert(paraValue, Integer.class);
            break;
          case 'L': 
            value = ConvertUtils.convert(paraValue, Long.class);
            break;
          case 'B': 
            value = ConvertUtils.convert(paraValue, Boolean.class);
            break;
          case 'D': 
            value = ConvertUtils.convert(paraValue, Date.class);
            break;
          case 'N': 
            value = ConvertUtils.convert(paraValue, Double.class);
            break;
          default: 
            value = paraValue;
          }
          params.put(name, value);
        }
      }
      String processId = request.getParameter("processId");
      String orderId = request.getParameter("orderId");
      String taskId = request.getParameter("taskId");
      String nextOperator = request.getParameter("");
      if ((StringUtils.isEmpty(orderId)) && (StringUtils.isEmpty(taskId)))
      {
        this.facets.startAndExecute(processId, "1", params);
      }
      else
      {
        String methodStr = request.getParameter("method");
        int method;
        try
        {
          method = Integer.parseInt(methodStr);
        }
        catch (Exception e)
        {
          //int method;
          method = 0;
        }
        switch (method)
        {
        case 0: 
          this.facets.execute(taskId, "3", params);
          break;
        case -1: 
          this.facets.executeAndJump(taskId, "admin", params, request.getParameter("nodeName"));
          break;
        case 1: 
          if (StringUtils.isNotEmpty(nextOperator)) {
            this.facets.transferMajor(taskId, "admin", nextOperator.split(","));
          }
          break;
        case 2: 
          if (StringUtils.isNotEmpty(nextOperator)) {
            this.facets.transferAidant(taskId, "admin", nextOperator.split(","));
          }
          break;
        default: 
          this.facets.execute(taskId, "admin", params);
        }
      }
      String ccOperator = request.getParameter("ccoperator");
//      if (StringUtils.isNotEmpty(ccOperator)) {
//        this.facets.getEngine().order().createCCOrder(orderId, ccOperator.split(","));
//      }
      return "redirect:/snaker/task/active";
    }
}