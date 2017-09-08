package com.byd.bms.plan.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import com.byd.bms.util.controller.BaseController;
import com.byd.bms.util.ExcelTool;
import com.byd.bms.plan.model.PlanBusDispatchPlan;
import com.byd.bms.plan.model.PlanConfigIssedQty;
import com.byd.bms.plan.model.PlanIssuance;
import com.byd.bms.plan.model.PlanIssuanceCount;
import com.byd.bms.plan.model.PlanIssuanceTotal;
import com.byd.bms.plan.model.PlanMasterPlan;
import com.byd.bms.plan.model.PlanPause;
import com.byd.bms.plan.model.PlanProductionPlan;
import com.byd.bms.plan.service.IPlanService;
import com.byd.bms.production.model.ProductionException;
import com.byd.bms.util.ExcelModel;

@Controller
@RequestMapping("/plan")
public class PlanController extends BaseController{
	static Logger logger = Logger.getLogger("PLAN");
	@Autowired
	protected IPlanService planService;

	@RequestMapping("/importMaster")
	public ModelAndView importMaster(){ 		//总计划导入
		mv.setViewName("plan/importMaster");
        return mv;  
    }
	
	@RequestMapping("/planPreview")
	public ModelAndView planPreview(){ 			//总计划详情
		mv.setViewName("plan/planPreview");
        return mv;  
    }
	
	@RequestMapping("/planRevision")
	public ModelAndView planRevision(){ 		//计划调整
		mv.setViewName("plan/planRevision");
        return mv;  
    }
	
	@RequestMapping("/planIssuance")
	public ModelAndView planIssuance(){ 		//计划发布
		mv.setViewName("plan/planIssuance");
        return mv;  
    }
	
	@RequestMapping("/planSearch")
	public ModelAndView planSearch(){			//计划查询 计划达成情况
		mv.setViewName("plan/planSearch");
        return mv;
	}
	
	@RequestMapping("/sapOrderManager")
	public ModelAndView sapOrderManager(){ 		//SAP生产订单维护
		mv.setViewName("plan/sapOrderManager");
        return mv;  
    }
	
	@RequestMapping("/pauseManager")
	public ModelAndView pauseManager(){ 		//计划停线
		mv.setViewName("plan/pauseManager");
        return mv;  
    }
	
	@RequestMapping("/exceptionManager")
	public ModelAndView exceptionManager(){ 	//生产异常处理
		mv.setViewName("plan/exceptionManager");
        return mv;  
    }
	
	@RequestMapping("/generateVin")
	public ModelAndView generateVin(){			//生成VIN号
		mv.setViewName("plan/generateVin");
        return mv;
	}
	
	@RequestMapping("/busTransfer")
	public ModelAndView busTransfer(){			//车辆调动
		mv.setViewName("plan/busTransfer");
        return mv;
	}
	
	@RequestMapping("/busDispatchPlan")
	public ModelAndView busDispatchPlan(){		//发车计划
		mv.setViewName("plan/busDispatchPlan");
        return mv;
	}
	
	@RequestMapping("/busDispatch")
	public ModelAndView busDispatch(){			//发车交接
		mv.setViewName("plan/busDispatch");
        return mv;
	}
	
	@RequestMapping("/busDispatchSearch")
	public ModelAndView busDispatchSearch(){	//发车查询
		mv.setViewName("plan/busDispatchSearch");
        return mv;
	}
	
	@RequestMapping("/busDispatchAccessories")
	public ModelAndView busDispatchAccessories(){//发车附件
		mv.setViewName("plan/busDispatchAccessories");
        return mv;
	}
	
	@RequestMapping(value="/uploadMasterPlan",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadMasterPlan(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("---->uploadMasterPlan");
		String fileFileName = "masterPlan.xls";
		int result = 0;
		ExcelModel excelModel =new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String,Integer> dataType = new HashMap<String,Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_STRING);
		dataType.put("1", ExcelModel.CELL_TYPE_STRING);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("4", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("5", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("6", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("7", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("8", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("9", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("10", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("11", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("12", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("13", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("14", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("15", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("16", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("17", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("18", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("19", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("20", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("21", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("22", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("23", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("24", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("25", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("26", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("27", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("28", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("29", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("30", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("31", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("32", ExcelModel.CELL_TYPE_NUMERIC);dataType.put("33", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("34", ExcelModel.CELL_TYPE_NUMERIC);
		excelModel.setDataType(dataType);
		excelModel.setPath(fileFileName);

        File planFile = new File(fileFileName);
		
		/**
		 * 读取输入流中的excel文件，并且将数据封装到ExcelModel对象中
		 */
		try {
			file.transferTo(planFile);
			InputStream is = new FileInputStream(planFile);
			ExcelTool excelTool = new ExcelTool();
			excelTool.readExcel(is, excelModel);
			
			//数据校验/
			int lineCount = excelModel.getData().size();
			//上传的文件行数验证
			//if(((lineCount)%12) != 0){
			if(lineCount!= 12){
				initModel(false,"导入文件的行数有误！一次只能导入一个月的计划！",null);
				model = mv.getModelMap();
				return model;
			}
			String plan_no = "";		//订单编号 同一个文件只能导入一个订单
			String factory_name = "";
			String plan_date = "";
			for(int i=0;i<lineCount;i++){
				if (i==0){
					plan_no = excelModel.getData().get(i)[0].toString().trim();
					factory_name = excelModel.getData().get(i)[1].toString().trim();
					plan_date = excelModel.getData().get(i)[3].toString().trim();
				}
				//判断上传计划的工厂是否属于这些订单
				Map<String,Object> importPlanMap=new HashMap<String,Object>();
				importPlanMap.put("order_no", plan_no);
				importPlanMap.put("factory_name", factory_name);
				String factory_order_id = planService.checkImportPlanFactory(importPlanMap);
				if (factory_order_id == null){
					//out.print(plan_no + " 订单没有 "+factory_name+"的计划，不能上传！<a href=\"javascript:history.back();\">返回</a>");
					initModel(false,plan_no + "订单没有 "+factory_name+"的计划，不能上传！",null);
					model = mv.getModelMap();
					return model;
				}
				//判断plan_no在plan_date月份内是否有发布，发布后不能重复导入
				Map<String,Object> conditionMap=new HashMap<String,Object>();
				conditionMap.put("order_no", plan_no);
				conditionMap.put("factory_name", factory_name);
				conditionMap.put("plan_date", plan_date);
				List<Map<String,String>> datalist = planService.checkProductionPlan(conditionMap);
				
				if(datalist.size()>0){
					//out.print(plan_no + " 订单已有发布数据,不能重复导入！<a href=\"javascript:history.back();\">返回</a>");
					initModel(false,plan_no + "订单已有发布数据,不能重复导入！",null);
					model = mv.getModelMap();
					return model;
				}
				
				String node = excelModel.getData().get(i)[2].toString().trim();
				int lineCountSwitch = i % 12;
				switch(lineCountSwitch){
					case 0 : if(!node.equals("自制下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 1 : if(!node.equals("部件上线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 2 : if(!node.equals("部件下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 3 : if(!node.equals("焊装上线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 4 : if(!node.equals("焊装下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 5 : if(!node.equals("涂装上线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 6 : if(!node.equals("涂装下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 7 : if(!node.equals("底盘上线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 8 : if(!node.equals("底盘下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 9 : if(!node.equals("总装上线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 10 : if(!node.equals("总装下线")){throw new RuntimeException("导入文件的格式有误！");}break; 
					case 11 : if(!node.equals("车辆入库")){throw new RuntimeException("导入文件的格式有误！");}break; 
				}
			}
			//上传的文件验证完成
			String userid=request.getSession().getAttribute("staff_number") + "";;
			result = planService.savePlanMaster(excelModel,userid);			
			
		} catch (Exception e) {
			e.printStackTrace();
			initModel(false,"导入文件的格式有误！",null);
			model = mv.getModelMap();
			return model;
		}
		
		initModel(true,"导入成功！",result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanMasterList")
	@ResponseBody
	public ModelMap showPlanMasterList(){
		String version=request.getParameter("version");
		String factory_id=request.getParameter("factory_id");
		String order_no=request.getParameter("order_no");
		String plan_month = request.getParameter("plan_month");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		if (request.getParameter("version") != null) conditionMap.put("version", version);
		if (request.getParameter("factory_id") != null) conditionMap.put("factory_id", factory_id);
		if (request.getParameter("order_no") != null) conditionMap.put("order_no", order_no);
		if (request.getParameter("plan_month") != null) conditionMap.put("plan_month", plan_month);
		
		List<PlanMasterPlan> datalist = planService.showPlanMasterList(conditionMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getPlanIssed")
	@ResponseBody
	public ModelMap getPlanIssed(){
		String factory_id=request.getParameter("factory_id");
		String order_no=request.getParameter("order_no");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		if (request.getParameter("factory_id") != null) conditionMap.put("factory_id", factory_id);
		if (request.getParameter("order_no") != null) conditionMap.put("order_no", order_no);
		
		List<Map<String,String>> datalist = planService.getPlanIssed(conditionMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/reVisionPlan")
	@ResponseBody
	public ModelMap reVisionPlan(){
		String factory_id = request.getParameter("factory_id");
		String order_no = request.getParameter("order_no");
		String revision_str = request.getParameter("revision_str");
		String plan_month = request.getParameter("plan_month");
		String edit_user = request.getSession().getAttribute("user_id") + "";
		int result = planService.reVisionPlan(factory_id, order_no, revision_str, plan_month,edit_user);		
		
		
		initModel(true,"success",result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanMasterIndex")
	@ResponseBody
	public ModelMap showPlanMasterIndex(){
		String factory_id=request.getParameter("factory_id");
		String order_no=request.getParameter("order_no");
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("factory_id", factory_id);
		condMap.put("order_no", order_no);
		
		Map<String,Object> result = planService.getPlanMasterIndex(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@RequestMapping("/getIssuancePlan")
	@ResponseBody
	public ModelMap getIssuancePlan(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();		//2017-06-01
		if (request.getParameter("issuance_date") != null) conditionMap.put("issuance_date", request.getParameter("issuance_date"));
		conditionMap.put("day",Integer.valueOf(request.getParameter("issuance_date").substring(8, 10)));		
		conditionMap.put("issuance_month",request.getParameter("issuance_date").substring(0, 4) + request.getParameter("issuance_date").substring(5, 7));	
		if (request.getParameter("factory_id") != null) conditionMap.put("factory_id", request.getParameter("factory_id"));
		if (request.getParameter("order_no") != null) conditionMap.put("order_no", request.getParameter("order_no"));

		//判断发布订单是否已经发布到工厂
		String msg = "查询成功";
		List<Map<String,String>> checkdatalist=new ArrayList<Map<String, String>>();
		checkdatalist = planService.checkPlanIssuanceList(conditionMap);
		if (checkdatalist.size() == 0){
			msg = "当前没有可发布的计划";
		}else{
			for(int i=0;i<checkdatalist.size(); i++){
				Map<String,String> cerMap = (Map<String, String>) checkdatalist.get(i);
				if(cerMap.get("product_qty") == null){
					msg = cerMap.get("order_no") + "没有发布工厂配置！";
				}
			}
		}
		
		List<PlanIssuance> datalist=new ArrayList<PlanIssuance>();
		List<PlanIssuance> resultlist=new ArrayList<PlanIssuance>();
		datalist = planService.getPlanIssuanceList(conditionMap);
		int cur_order_id = 0;
		List<PlanIssuanceTotal> total_datalist=new ArrayList<PlanIssuanceTotal>();
		int issed_count_1 = 0;int issed_count_2 = 0;int issed_count_3 = 0;int issed_count_4 = 0;
		int issed_count_5 = 0;int issed_count_6 = 0;int issed_count_7 = 0;int issed_count_8 = 0;
		int issed_count_9 = 0;int issed_count_10 = 0;int issed_count_11 = 0;int issed_count_12 = 0;
		for(int i=0;i<datalist.size(); i++){
			PlanIssuance cur_planIssuance = (PlanIssuance)datalist.get(i);
			int this_order_id = cur_planIssuance.getOrder_id();
			if(cur_order_id == 0 || cur_order_id != this_order_id){
				PlanIssuance newIssuance = new PlanIssuance();
				newIssuance.setOrder_config_name(cur_planIssuance.getOrder_no() + "总数");
				Map<String,Object> conditionMap2=new HashMap<String,Object>();				
				conditionMap2.put("day",Integer.valueOf(request.getParameter("issuance_date").substring(8, 10)));		
				conditionMap2.put("month",request.getParameter("issuance_date").substring(0, 4) + request.getParameter("issuance_date").substring(5, 7));		
				conditionMap2.put("factory_id", request.getParameter("factory_id"));
				conditionMap2.put("order_id",this_order_id);
				total_datalist = planService.getPlanIssuanceTotal(conditionMap2);
				//判断当前订单是否有调整后的计划
				if(total_datalist.size() != 0){
					newIssuance.setPlan_code_1(((PlanIssuanceTotal)total_datalist.get(0)).getNum());
					newIssuance.setPlan_code_2(((PlanIssuanceTotal)total_datalist.get(1)).getNum());
					newIssuance.setPlan_code_3(((PlanIssuanceTotal)total_datalist.get(2)).getNum());
					newIssuance.setPlan_code_4(((PlanIssuanceTotal)total_datalist.get(3)).getNum());
					newIssuance.setPlan_code_5(((PlanIssuanceTotal)total_datalist.get(4)).getNum());
					newIssuance.setPlan_code_6(((PlanIssuanceTotal)total_datalist.get(5)).getNum());
					newIssuance.setPlan_code_7(((PlanIssuanceTotal)total_datalist.get(6)).getNum());
					newIssuance.setPlan_code_8(((PlanIssuanceTotal)total_datalist.get(7)).getNum());
					newIssuance.setPlan_code_9(((PlanIssuanceTotal)total_datalist.get(8)).getNum());
					newIssuance.setPlan_code_10(((PlanIssuanceTotal)total_datalist.get(9)).getNum());
					newIssuance.setPlan_code_11(((PlanIssuanceTotal)total_datalist.get(10)).getNum());
					newIssuance.setPlan_code_12(((PlanIssuanceTotal)total_datalist.get(11)).getNum());
				}
				issed_count_1 = 0;issed_count_2 = 0;issed_count_3 = 0;issed_count_4 = 0;
				issed_count_5 = 0;issed_count_6 = 0;issed_count_7 = 0;issed_count_8 = 0;
				issed_count_9 = 0;issed_count_10 = 0;issed_count_11 = 0;issed_count_12 = 0;
				resultlist.add(newIssuance);
			}
			cur_order_id = cur_planIssuance.getOrder_id();
			//计算配置发布数的推荐值  获取当前配置的总计划数及已发布数量
			PlanIssuance planIssuance = (PlanIssuance)datalist.get(i);
			
			//STEP 01 判断planIssuance的生产节点是否已经发布
			List<PlanProductionPlan> iss_done_list=new ArrayList<PlanProductionPlan>();
			Map<String,Object> iss_queryMap=new HashMap<String,Object>();
			iss_queryMap.put("factory_id", request.getParameter("factory_id"));
			iss_queryMap.put("plan_date", request.getParameter("issuance_date"));
			iss_queryMap.put("order_id", planIssuance.getOrder_id());
			iss_done_list = planService.getProductionPlanIssuanceList(iss_queryMap);
			for(int j=0;j<iss_done_list.size();j++){
				PlanProductionPlan issedPlan = (PlanProductionPlan)iss_done_list.get(j);
				switch (issedPlan.getPlan_code_value()){
				case 1:
					planIssuance.setPlan_code_issed_1_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_1(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_1(0);
					}
					break;
				case 2:
					planIssuance.setPlan_code_issed_2_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_2(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_2(0);
					}
					break;
				case 3:
					planIssuance.setPlan_code_issed_3_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_3(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_3(0);
					}
					break;
				case 4:
					planIssuance.setPlan_code_issed_4_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_4(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_4(0);
					}
					break;
				case 5:
					planIssuance.setPlan_code_issed_5_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_5(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_5(0);
					}
					break;
				case 6:
					planIssuance.setPlan_code_issed_6_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_6(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_6(0);
					}
					break;
				case 7:
					planIssuance.setPlan_code_issed_7_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_7(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_7(0);
					}
					break;
				case 8:
					planIssuance.setPlan_code_issed_8_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_8(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_8(0);
					}
					break;
				case 9:
					planIssuance.setPlan_code_issed_9_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_9(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_9(0);
					}
					break;
				case 10:
					planIssuance.setPlan_code_issed_10_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_10(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_10(0);
					}
					break;
				case 11:
					planIssuance.setPlan_code_issed_11_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_11(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_11(0);
					}
					break;
				case 12:
					planIssuance.setPlan_code_issed_12_done(1);
					if(issedPlan.getOrder_config_id() == planIssuance.getOrder_config_id()){
						planIssuance.setPlan_code_issed_12(issedPlan.getPlan_qty());
					}else{
						planIssuance.setPlan_code_issed_12(0);
					}
					break;
				}
			}
			
			//STEP 02 查询已分配数 planIssuance.setPlan_code_issed_X
			Map<String,Object> conditionMap3=new HashMap<String,Object>();
			conditionMap3.put("order_id", ((PlanIssuance)datalist.get(i)).getOrder_id());
			conditionMap3.put("factory_id", request.getParameter("factory_id"));
			conditionMap3.put("order_config_id", ((PlanIssuance)datalist.get(i)).getOrder_config_id());
			conditionMap3.put("plan_date", request.getParameter("issuance_date"));
			List<PlanIssuanceCount> total_data_count=new ArrayList<PlanIssuanceCount>();			//已分配数
			total_data_count = planService.getPlanIssuanceCount(conditionMap3);
			for(int j=0;j<total_data_count.size();j++){
				PlanIssuanceCount tempIssuanceCount = (PlanIssuanceCount)total_data_count.get(j);
				switch(tempIssuanceCount.getPlan_code_value()){
				case 1:
					planIssuance.setPlan_code_issed_1(tempIssuanceCount.getIssed_qty());break;
				case 2:
					planIssuance.setPlan_code_issed_2(tempIssuanceCount.getIssed_qty());break;
				case 3:
					planIssuance.setPlan_code_issed_3(tempIssuanceCount.getIssed_qty());break;
				case 4:
					planIssuance.setPlan_code_issed_4(tempIssuanceCount.getIssed_qty());break;
				case 5:
					planIssuance.setPlan_code_issed_5(tempIssuanceCount.getIssed_qty());break;
				case 6:
					planIssuance.setPlan_code_issed_6(tempIssuanceCount.getIssed_qty());break;
				case 7:
					planIssuance.setPlan_code_issed_7(tempIssuanceCount.getIssed_qty());break;
				case 8:
					planIssuance.setPlan_code_issed_8(tempIssuanceCount.getIssed_qty());break;
				case 9:
					planIssuance.setPlan_code_issed_9(tempIssuanceCount.getIssed_qty());break;
				case 10:
					planIssuance.setPlan_code_issed_10(tempIssuanceCount.getIssed_qty());break;
				case 11:
					planIssuance.setPlan_code_issed_11(tempIssuanceCount.getIssed_qty());break;
				case 12:
					planIssuance.setPlan_code_issed_12(tempIssuanceCount.getIssed_qty());break;
				}
			}
			
			//STEP 03 获取当前工厂  当前配置  当前月份  总计划数  及 已发布数之和 planIssuance.setPlan_config_qty_X_done
			int order_config_Qty = 0;
			Map<String,Object> conditionMap_1=new HashMap<String,Object>();
			conditionMap_1.put("order_id", ((PlanIssuance)datalist.get(i)).getOrder_id());
			conditionMap_1.put("factory_id", request.getParameter("factory_id"));
			conditionMap_1.put("order_config_id", ((PlanIssuance)datalist.get(i)).getOrder_config_id());
			order_config_Qty = planService.getPlanConfigQty(conditionMap_1);
			
			planIssuance.setPlan_config_qty(order_config_Qty);
			
			Map<String,Object> conditionMap4=new HashMap<String,Object>();
			conditionMap4.put("order_id", ((PlanIssuance)datalist.get(i)).getOrder_id());
			conditionMap4.put("factory_id", request.getParameter("factory_id"));
			conditionMap4.put("order_config_id", ((PlanIssuance)datalist.get(i)).getOrder_config_id());
			List<PlanConfigIssedQty> plan_config_issed_qty = new ArrayList<PlanConfigIssedQty>();
			//获取当前配置已发布数量
			plan_config_issed_qty = planService.getPlanConfigIssedQty(conditionMap4);
			for(int j=0;j<plan_config_issed_qty.size();j++){
				PlanConfigIssedQty config_issed_qty = (PlanConfigIssedQty) plan_config_issed_qty.get(j);
				int plan_code_value = config_issed_qty.getPlan_code_value();
				switch(plan_code_value){
				case 1:
					planIssuance.setPlan_config_qty_1_done(config_issed_qty.getSum_plan_qty());break;
				case 2:
					planIssuance.setPlan_config_qty_2_done(config_issed_qty.getSum_plan_qty());break;
				case 3:
					planIssuance.setPlan_config_qty_3_done(config_issed_qty.getSum_plan_qty());break;
				case 4:
					planIssuance.setPlan_config_qty_4_done(config_issed_qty.getSum_plan_qty());break;
				case 5:
					planIssuance.setPlan_config_qty_5_done(config_issed_qty.getSum_plan_qty());break;
				case 6:
					planIssuance.setPlan_config_qty_6_done(config_issed_qty.getSum_plan_qty());break;
				case 7:
					planIssuance.setPlan_config_qty_7_done(config_issed_qty.getSum_plan_qty());break;
				case 8:
					planIssuance.setPlan_config_qty_8_done(config_issed_qty.getSum_plan_qty());break;
				case 9:
					planIssuance.setPlan_config_qty_9_done(config_issed_qty.getSum_plan_qty());break;
				case 10:
					planIssuance.setPlan_config_qty_10_done(config_issed_qty.getSum_plan_qty());break;
				case 11:
					planIssuance.setPlan_config_qty_11_done(config_issed_qty.getSum_plan_qty());break;
				case 12:
					planIssuance.setPlan_config_qty_12_done(config_issed_qty.getSum_plan_qty());break;		
				}
			}
			
			//STEP 04 推荐发布值 根据 当前配置总计划数 - 当前配置已发布部 < 当天计划数 
			int plan_qty_1 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(0)).getNum():0;int plan_code_1 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_1_done()) < plan_qty_1 - issed_count_1){
				plan_code_1 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_1_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_1_done()):0;
			}else{
				plan_code_1 = (plan_qty_1 - issed_count_1>=0)?plan_qty_1 - issed_count_1:0;
			}
			planIssuance.setPlan_code_1(plan_code_1);
			issed_count_1 += plan_code_1;
			
			int plan_qty_2 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(1)).getNum():0;int plan_code_2 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_2_done()) < plan_qty_2 - issed_count_2){
				plan_code_2 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_2_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_2_done()):0;
			}else{
				plan_code_2 = (plan_qty_2 - issed_count_2>=0)?plan_qty_2 - issed_count_2:0;
			}
			planIssuance.setPlan_code_2(plan_code_2);
			issed_count_2 += plan_code_2;
			
			int plan_qty_3 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(2)).getNum():0;int plan_code_3 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_3_done()) < plan_qty_3 - issed_count_3){
				plan_code_3 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_3_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_3_done()):0;
			}else{
				plan_code_3 = (plan_qty_3 - issed_count_3>=0)?plan_qty_3 - issed_count_3:0;
			}
			planIssuance.setPlan_code_3(plan_code_3);		
			issed_count_3 += plan_code_3;
			
			int plan_qty_4 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(3)).getNum():0;int plan_code_4 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_4_done()) < plan_qty_4 - issed_count_4){
				plan_code_4 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_4_done() >=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_4_done() ):0;
			}else{
				plan_code_4 = (plan_qty_4 - issed_count_4>=0)?plan_qty_4 - issed_count_4:0;
			}
			planIssuance.setPlan_code_4(plan_code_4);
			issed_count_4 += plan_code_4;
			
			int plan_qty_5 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(4)).getNum():0;int plan_code_5 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_5_done()) < plan_qty_5 - issed_count_5){
				plan_code_5 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_5_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_5_done()):0;
			}else{
				plan_code_5 = (plan_qty_5 - issed_count_5>=0)?plan_qty_5 - issed_count_5:0;
			}
			planIssuance.setPlan_code_5(plan_code_5);
			issed_count_5 += plan_code_5;
			
			int plan_qty_6 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(5)).getNum():0;int plan_code_6 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_6_done()) < plan_qty_6 - issed_count_6){
				plan_code_6 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_6_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_6_done()):0;
			}else{
				plan_code_6 = (plan_qty_6 - issed_count_6>=0)?plan_qty_6 - issed_count_6:0;
			}
			planIssuance.setPlan_code_6(plan_code_6);
			issed_count_6 += plan_code_6;
			
			int plan_qty_7 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(6)).getNum():0;int plan_code_7 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_7_done()) < plan_qty_7 - issed_count_7){
				plan_code_7 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_7_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_7_done()):0;
			}else{
				plan_code_7 = (plan_qty_7 - issed_count_7>=0)?plan_qty_7 - issed_count_7:0;
			}
			planIssuance.setPlan_code_7(plan_code_7);
			issed_count_7 += plan_code_7;
			
			int plan_qty_8 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(7)).getNum():0;int plan_code_8 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_8_done()) < plan_qty_8 - issed_count_8){
				plan_code_8 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_8_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_8_done()):0;
			}else{
				plan_code_8 = (plan_qty_8 - issed_count_8>=0)?plan_qty_8 - issed_count_8:0;
			}
			planIssuance.setPlan_code_8(plan_code_8);
			issed_count_8 += plan_code_8;
			
			int plan_qty_9 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(8)).getNum():0;int plan_code_9 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_9_done()) < plan_qty_9 - issed_count_9){
				plan_code_9 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_9_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_9_done()):0;
			}else{
				plan_code_9 = (plan_qty_9 - issed_count_9>=0)?plan_qty_9 - issed_count_9:0;
			}
			planIssuance.setPlan_code_9(plan_code_9);
			issed_count_9 += plan_code_9;
			
			int plan_qty_10 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(9)).getNum():0;int plan_code_10 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_10_done()) < plan_qty_10 - issed_count_10){
				plan_code_10 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_10_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_10_done()):0;
			}else{
				plan_code_10 = (plan_qty_10 - issed_count_10>=0)?plan_qty_10 - issed_count_10:0;
			}
			planIssuance.setPlan_code_10(plan_code_10);
			issed_count_10 += plan_code_10;
			
			int plan_qty_11 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(10)).getNum():0;int plan_code_11 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_11_done()) < plan_qty_11 - issed_count_11){
				plan_code_11 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_11_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_11_done()):0;
			}else{
				plan_code_11 = (plan_qty_11 - issed_count_11>=0)?plan_qty_11 - issed_count_11:0;
			}
			planIssuance.setPlan_code_11(plan_code_11);
			issed_count_11 += plan_code_11;
			
			int plan_qty_12 = (total_datalist.size() != 0)?((PlanIssuanceTotal)total_datalist.get(11)).getNum():0;int plan_code_12 = 0;
			if((planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_12_done()) < plan_qty_12 - issed_count_12){
				plan_code_12 = (planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_12_done()>=0)?(planIssuance.getProduct_qty() - planIssuance.getPlan_config_qty_12_done()):0;
			}else{
				plan_code_12 = (plan_qty_12 - issed_count_12>=0)?plan_qty_12 - issed_count_12:0;
			}
			planIssuance.setPlan_code_12(plan_code_12);
			issed_count_12 += plan_code_12;
			
			//STEP 05 resultlist.add(planIssuance);
			resultlist.add(planIssuance);
		}
		
		initModel(true,msg,resultlist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/issuancePlanSubmit")
	@ResponseBody
	public ModelMap issuancePlanSubmit(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String edit_user = request.getSession().getAttribute("staff_number") + "";
		String issuance_date = request.getParameter("issuance_date");
		int factory_id = Integer.valueOf(request.getParameter("factory_id"));
		String issuance_str = request.getParameter("issuance_str");
		
		int bus_count = planService.issuancePlanSubmit(curTime, edit_user, issuance_date, factory_id, issuance_str);
		
		initModel(true,String.valueOf(bus_count),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/addPause")
	@ResponseBody
	public ModelMap addPause(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String create_user = request.getSession().getAttribute("staff_number") + "";
		List<PlanPause> pauseList = new ArrayList<PlanPause>();
		String[] staffArray=request.getParameter("lines").toString().split(",");
		for(int i=0;i<staffArray.length;i++){
			PlanPause pause = new PlanPause();
			pause.setFactory_id(request.getParameter("factory_id"));
			pause.setWorkshop_id(request.getParameter("workshop_id"));
			pause.setLine(staffArray[i]);
			pause.setStart_time(request.getParameter("pause_date_start"));
			pause.setPend_time(request.getParameter("pause_date_end"));
			pause.setEnd_time(request.getParameter("end_time"));
			pause.setReason_type_id(Integer.parseInt(request.getParameter("reason_type_id")));
			pause.setBus_type(request.getParameter("bus_type_id"));
			pause.setDuty_department_id(Integer.parseInt(request.getParameter("duty_department_id")));
			pause.setOrder_list(request.getParameter("order_list"));
			pause.setDetailed_reason(request.getParameter("detailed_reason"));
			pause.setHuman_lossed(request.getParameter("waste_num"));
			pause.setCapacity_lossed(request.getParameter("capacity"));
			pause.setHours(request.getParameter("pause_hours"));
			pause.setMemo(request.getParameter("memo"));
			pause.setCreate_user(create_user);
			pause.setCreate_time(curTime);
			pauseList.add(pause);
		}
		int result = planService.addPause(pauseList);
		mv.clear();
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/addDispatchPlan")
	@ResponseBody
	public ModelMap addDispatchPlan(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String create_user = request.getSession().getAttribute("staff_number") + "";
		PlanBusDispatchPlan planBusDispatchPlan = new PlanBusDispatchPlan();
		planBusDispatchPlan.setFactory_id(Integer.parseInt(request.getParameter("factory_id")));
		planBusDispatchPlan.setOrder_no(request.getParameter("order_no"));
		planBusDispatchPlan.setPlan_dispatch_qty(Integer.parseInt(request.getParameter("plan_dispatch_qty")));
		planBusDispatchPlan.setDispatch_date(request.getParameter("dispatch_date"));
		planBusDispatchPlan.setCustomer_number_flag(request.getParameter("customer_number_flag"));
		planBusDispatchPlan.setEmail_addrs(request.getParameter("email_addrs"));
		planBusDispatchPlan.setCreater_id(create_user);
		planBusDispatchPlan.setCreatdate(curTime);
		planBusDispatchPlan.setStatus("0");
		int result = planService.addDispatchPlan(planBusDispatchPlan);
		mv.clear();
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/editDispatchPlan")
	@ResponseBody
	public ModelMap editDispatchPlan(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String create_user = request.getSession().getAttribute("staff_number") + "";
		PlanBusDispatchPlan planBusDispatchPlan = new PlanBusDispatchPlan();
		planBusDispatchPlan.setId(Integer.parseInt(request.getParameter("id")));
		planBusDispatchPlan.setFactory_id(Integer.parseInt(request.getParameter("factory_id")));
		planBusDispatchPlan.setOrder_no(request.getParameter("order_no"));
		planBusDispatchPlan.setPlan_dispatch_qty(Integer.parseInt(request.getParameter("plan_dispatch_qty")));
		planBusDispatchPlan.setDispatch_date(request.getParameter("dispatch_date"));
		planBusDispatchPlan.setCustomer_number_flag(request.getParameter("customer_number_flag"));
		planBusDispatchPlan.setEmail_addrs(request.getParameter("email_addrs"));
		planBusDispatchPlan.setCreater_id(create_user);
		planBusDispatchPlan.setCreatdate(curTime);
		int result = planService.editDispatchPlan(planBusDispatchPlan);
		mv.clear();
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getDispatchPlanList")
	@ResponseBody
	public ModelMap getDispatchPlanList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("id", request.getParameter("id"));
		condMap.put("bustype", request.getParameter("bustype"));
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("start_date", request.getParameter("start_date"));
		condMap.put("end_date", request.getParameter("end_date"));
		condMap.put("orderColumn", "id");
		Map<String,Object> result= planService.getDispatchPlanList(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@RequestMapping("/getOrderDispatchQty")
	@ResponseBody
	public ModelMap getOrderDispatchQty(){
		int dispatchQty = planService.getOrderDispatchQty(Integer.parseInt(request.getParameter("order_id")));
		initModel(true,String.valueOf(dispatchQty),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getPauseList")
	@ResponseBody
	public ModelMap getPauseList(){
		String factory_id=request.getParameter("factory_id");
		String factory_name=request.getParameter("factory_name");
		String order_no=request.getParameter("order_no");
		String workshop_id = request.getParameter("workshop_id");
		String workshop_name = request.getParameter("workshop_name");
		String line = request.getParameter("line");
		String reason_type = request.getParameter("reason_type");
		String pause_date_start = request.getParameter("pause_date_start");
		String pause_date_end = request.getParameter("pause_date_end");
		String resume_date_start = request.getParameter("resume_date_start");
		String resume_date_end = request.getParameter("resume_date_end");
		String pause_id = request.getParameter("pause_id");
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("factory_id", factory_id);
		condMap.put("factory_name", factory_name);
		condMap.put("order_no", order_no);
		condMap.put("workshop_id", workshop_id);
		condMap.put("workshop_name", workshop_name);
		condMap.put("line", line);
		condMap.put("reason_type_id", reason_type);
		condMap.put("start_time", pause_date_start);
		condMap.put("end_time", pause_date_end);
		condMap.put("start_time2", resume_date_start);
		condMap.put("end_time2", resume_date_end);
		condMap.put("pause_id", pause_id);
		Map<String,Object> list = planService.getPauseList(condMap);
		//initModel(true,"SUCCESS",list);	
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/editPauseInfo")
	@ResponseBody
	public ModelMap editPauseInfo(){
		PlanPause pause = new PlanPause();
		pause.setId(Integer.parseInt(request.getParameter("pause_id")));
		pause.setBus_type(request.getParameter("edit_bus_type"));
		pause.setReason_type_id(Integer.parseInt(request.getParameter("edit_reason_type")));
		pause.setDuty_department_id(Integer.parseInt(request.getParameter("edit_dep_id")));
		pause.setStart_time(request.getParameter("edit_pause_date_start"));
		pause.setPend_time(request.getParameter("edit_pause_date_end"));
		pause.setEnd_time(request.getParameter("edit_end_time"));
		pause.setHours(request.getParameter("edit_pause_hours"));
		pause.setHuman_lossed(request.getParameter("edit_human_lossed"));
		pause.setCapacity_lossed(request.getParameter("edit_capacity"));
		pause.setDetailed_reason(request.getParameter("edit_reason_detailed"));
		pause.setMemo(request.getParameter("edit_memo"));	
		
		int result = planService.updatePauseInfo(pause);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getExceptionList")
	@ResponseBody
	public ModelMap getExceptionList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("offset")!=null)?Integer.parseInt(request.getParameter("offset")):0;		//分页数据起始数
		int length=(request.getParameter("limit")!=null)?Integer.parseInt(request.getParameter("limit")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("id", request.getParameter("id"));
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("severity_level_id", request.getParameter("severity_level_id"));
		condMap.put("measures_id", request.getParameter("measures_id"));
		condMap.put("status", request.getParameter("status"));
		condMap.put("start_time", request.getParameter("start_time"));
		condMap.put("finish_time", request.getParameter("finish_time"));
		
		Map<String,Object> list = planService.getExceptionList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/editExceptionInfo")
	@ResponseBody
	public ModelMap editExceptionInfo(){
		ProductionException exception = new ProductionException();
		exception.setId(Integer.parseInt(request.getParameter("id")));
		exception.setFactory(request.getParameter("factory"));
		exception.setWorkshop(request.getParameter("workshop"));
		exception.setLine(request.getParameter("line"));
		exception.setProcess(request.getParameter("process"));
		exception.setReason_type_id(request.getParameter("reason_type_id"));
		exception.setDetailed_reasons(request.getParameter("detailed_reasons"));
		exception.setSeverity_level_id(request.getParameter("severity_level_id"));
		exception.setDuty_department_id(request.getParameter("duty_department_id"));
		exception.setMeasures_id(request.getParameter("measures_id"));
		int result = planService.updateExceptionInfo(exception);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/confirmException")
	@ResponseBody
	public ModelMap confirmException(){
		ProductionException exception = new ProductionException();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		exception.setId(Integer.parseInt(request.getParameter("id")));
		exception.setProcess_date(request.getParameter("process_date"));
		exception.setReason_type_id(request.getParameter("reason_type_id"));
		exception.setDuty_department_id(request.getParameter("duty_department_id"));
		exception.setDetailed_reasons(request.getParameter("detailed_reasons"));
		exception.setSolution(request.getParameter("solution"));
		exception.setProcessor(staff_number);
		exception.setProcess_date(curTime);
		
		int result = planService.confirmException(exception);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanVinList")
	@ResponseBody
	public ModelMap showPlanVinList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("offset")!=null)?Integer.parseInt(request.getParameter("offset")):0;		//分页数据起始数
		int length=(request.getParameter("limit")!=null)?Integer.parseInt(request.getParameter("limit")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("bus_vin", request.getParameter("bus_vin"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		
		Map<String,Object> list = planService.getPlanVinList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getGenerateVin")
	@ResponseBody
	public ModelMap getGenerateVin(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("vin_factory_id", request.getParameter("vin_factory_id"));
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("vinCount", request.getParameter("vinCount"));
		condMap.put("year", request.getParameter("year"));
		condMap.put("vin_prefix", request.getParameter("vin_prefix"));
		condMap.put("WMI_extension", request.getParameter("WMI_extension"));
		condMap.put("curTime", curTime);
		condMap.put("staff_number", staff_number);
		Map<String,Object> list = planService.getGenerateVin(condMap);
		initModel(true,null,list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getVinPrefix")
	@ResponseBody
	public ModelMap getVinPrefix(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("area", request.getParameter("area"));
		condMap.put("order_no", request.getParameter("order_no"));
		Map<String,Object> list = planService.getVinPrefix(condMap);
		//model.addAllAttributes(list);
		initModel(true,null,list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping(value="/uploadVin",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadVin(@RequestParam(value="file",required=false) MultipartFile file){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String fileFileName = "vin.xls";
		int result = 0;
		ExcelModel excelModel =new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String,Integer> dataType = new HashMap<String,Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_STRING);
		dataType.put("1", ExcelModel.CELL_TYPE_STRING);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_STRING);
		dataType.put("4", ExcelModel.CELL_TYPE_STRING);
		dataType.put("5", ExcelModel.CELL_TYPE_STRING);
		excelModel.setDataType(dataType);
		excelModel.setPath(fileFileName);

        File vinFile = new File(fileFileName);
        List<Map<String,Object>> vin_list = new ArrayList<Map<String,Object>>();
		try{
	        file.transferTo(vinFile);
			InputStream is = new FileInputStream(vinFile);
			ExcelTool excelTool = new ExcelTool();
			excelTool.readExcel(is, excelModel);
			//数据校验
			int lineCount = excelModel.getData().size();
			String vin_str = "";
			for(int i=0;i<lineCount;i++){
				String factory_name = excelModel.getData().get(i)[0].toString().trim();
				String order_no = excelModel.getData().get(i)[1].toString().trim();
				String vin = excelModel.getData().get(i)[2].toString().trim();
				String left_motor_number = excelModel.getData().get(i)[3].toString().trim();
				String right_motor_number = excelModel.getData().get(i)[4].toString().trim();
				String bus_number = excelModel.getData().get(i)[5].toString().trim();
				if(vin_str.indexOf(vin)>=0){
					mv.clear();
					initModel(false,"导入文件的VIN号" + vin + "重复,请确认后重新导入。",null);
					model = mv.getModelMap();
					return model;
				}
				vin_str += vin;
				//校验工厂与订单是否正确
				Map<String,Object> condMap=new HashMap<String,Object>();
				condMap.put("factory_name", factory_name);
				condMap.put("order_no", order_no);
				condMap.put("vin", vin);
				condMap.put("left_motor_number", left_motor_number);
				condMap.put("right_motor_number", right_motor_number);
				condMap.put("bus_number", bus_number);
				condMap.put("curTime", curTime);
				condMap.put("staff_number", staff_number);
				int check_result = planService.checkFactoryOrder(condMap);
				logger.info("---->uploadVin factory_name = " + factory_name + ";order_no = " + order_no + ";check_result = " + check_result);
				if (check_result == 0){
					mv.clear();
					initModel(false,"导入文件的" + factory_name + "没有配置订单" + order_no + ",请确认后重新导入。",null);
					model = mv.getModelMap();
					return model;
				}
				if(vin.equals("")){
					mv.clear();
					initModel(false,"导入文件的VIN号不能为空，请确认后重新导入。",null);
					model = mv.getModelMap();
					return model;
				}
				//checkBingingVin
				Map<String,Object> condMap2=new HashMap<String,Object>();
				condMap2.put("vin", request.getParameter("vin"));
				condMap2.put("update_val", left_motor_number);
				condMap2.put("update", "left_motor");
				check_result = planService.checkBingingVin(condMap2);
				if(check_result != 0){
					mv.clear();
					initModel(false,"此左电机号"+left_motor_number+"已经绑定了，请确认后重新导入。",null);
					model = mv.getModelMap();
					return model;
				}
				condMap2.put("vin", request.getParameter("vin"));
				condMap2.put("update_val", right_motor_number);
				condMap2.put("update", "right_motor");
				check_result = planService.checkBingingVin(condMap2);
				if(check_result != 0){
					mv.clear();
					initModel(false,"此右电机号"+left_motor_number+"已经绑定了，请确认后重新导入。",null);
					model = mv.getModelMap();
					return model;
				}
				if(!bus_number.equals("")){
					condMap2.put("vin", request.getParameter("vin"));
					condMap2.put("update_val", bus_number);
					condMap2.put("update", "bus_number");
					check_result = planService.checkBusNumber(condMap2);
					if(check_result == 0){
						mv.clear();
						initModel(false,"此车号"+bus_number+"已经绑定了或不存在，请确认后重新导入。",null);
						model = mv.getModelMap();
						return model;
					}
				}
				
				List<String> busList = planService.selectBusByMotorVin(condMap);
				if(busList.size()>0){
					mv.clear();
					initModel(false,"导入文件的VIN号/电机号("+ vin + "/" + left_motor_number + "/" +right_motor_number + ")与系统中的数据重复。",null);
					model = mv.getModelMap();
					return model;
				}
				
				vin_list.add(condMap);
			}
			result = planService.importVin(vin_list);
			
		}catch (Exception e) {
			e.printStackTrace();
			initModel(false,"导入文件的格式有误！",null);
			model = mv.getModelMap();
			return model;
		}
		mv.clear();
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/BingingVinMotor")
	@ResponseBody
	public ModelMap BingingVinMotor(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("vin", request.getParameter("vin"));
		condMap.put("update_val", request.getParameter("update_val"));
		condMap.put("update", request.getParameter("update"));
		
		int result = planService.BingingVinMotor(condMap);
		mv.clear();
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busTransferOutQuery")
	@ResponseBody
	public ModelMap busTransferOutQuery(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("busNumbers", request.getParameter("busNumbers"));
		//condMap.put("busNumbers", "'K8-SZ-2017-00001','K8-SZ-2017-00002'");
		List<Map<String,String>> list = planService.getBusTransferOutList(condMap);
		initModel(true,null,list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busTransferInQuery")
	@ResponseBody
	public ModelMap busTransferInQuery(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		if(request.getParameter("bus_numbers").length()>2){
			condMap.put("bus_numbers", request.getParameter("bus_numbers"));
		}else{
			condMap.put("bus_numbers", null);
		}
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("factory_id_in", request.getParameter("factory_id_in"));
		List<Map<String,String>> list = planService.getBusTransferInList(condMap);
		initModel(true,null,list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busTransferOut")
	@ResponseBody
	public ModelMap busTransferOut(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("bus_numbers", request.getParameter("bus_number"));
		condMap.put("factory_out_id", request.getParameter("transfer_out_factory"));
		condMap.put("curTime", curTime);
		condMap.put("staff_number", staff_number);
		int result = planService.busTransferOut(condMap);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busTransferIn")
	@ResponseBody
	public ModelMap busTransferIn(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("bus_numbers", request.getParameter("bus_number"));
		condMap.put("transfer_in_factory", request.getParameter("transfer_in_factory"));
		condMap.put("curTime", curTime);
		condMap.put("staff_number", staff_number);
		int result = planService.busTransferIn(condMap);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busTransferHisQuery")
	@ResponseBody
	public ModelMap busTransferHisQuery(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("transfer_his_busnumber", request.getParameter("transfer_his_busnumber"));
		conditionMap.put("transfer_his_vin", request.getParameter("transfer_his_vin"));
		conditionMap.put("transfer_his_orderno", request.getParameter("transfer_his_orderno"));
		conditionMap.put("transfer_his_out_factory", request.getParameter("transfer_his_out_factory"));
		conditionMap.put("transfer_his_out_date_start", request.getParameter("transfer_his_out_date_start"));
		conditionMap.put("transfer_his_out_date_end", request.getParameter("transfer_his_out_date_end"));		
		conditionMap.put("transfer_his_in_factory", request.getParameter("transfer_his_in_factory"));
		conditionMap.put("transfer_his_in_date_start", request.getParameter("transfer_his_in_date_start"));
		conditionMap.put("transfer_his_in_date_end", request.getParameter("transfer_his_in_date_end"));
		List<Map<String, String>> busTransferHisInfo=new ArrayList<Map<String, String>>();
		busTransferHisInfo = planService.getBusTransferHisList(conditionMap);
		initModel(true,null,busTransferHisInfo);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanSearch")
	@ResponseBody
	public ModelMap showPlanSearch(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		conditionMap.put("order_no", request.getParameter("order_no"));
		String workshop = "";
		if (!request.getParameter("workshop").equals("全部")) workshop = request.getParameter("workshop");
		if(workshop.equals("成品库")) workshop="入库";
		conditionMap.put("workshop", workshop);
		conditionMap.put("start_date", request.getParameter("start_date"));
		conditionMap.put("end_date", request.getParameter("end_date"));
		
		List<Map<String, String>> datalist=new ArrayList<Map<String,String>>();
		datalist = planService.getPlanSerach(conditionMap);
		initModel(true,null,datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanSearchDetail")
	@ResponseBody
	public ModelMap showPlanSearchDetail(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("date_array", request.getParameter("date_array"));
		conditionMap.put("order_no", request.getParameter("order_no"));
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		conditionMap.put("workshop", request.getParameter("workshop"));
		conditionMap.put("workshop", request.getParameter("workshop"));
		
		Map<String, Object> datalist  = planService.showPlanSearchDetail(conditionMap);
		initModel(true,null,datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getQueryOrderTool")
	@ResponseBody
	public ModelMap getQueryOrderTool(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("orderNo", request.getParameter("orderNo"));
		conditionMap.put("dis_name", request.getParameter("dis_name"));
		conditionMap.put("dis_receiver", request.getParameter("dis_receiver"));
		conditionMap.put("dis_date_start", request.getParameter("dis_date_start"));
		conditionMap.put("dis_date_end", request.getParameter("dis_date_end"));
		List<Map<String, String>> datalist  = planService.getOrderDispatchList(conditionMap);
		initModel(true,null,datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/saveOrderDispatchRecord")
	@ResponseBody
	public ModelMap saveOrderDispatchRecord(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String form_str = request.getParameter("form_str");
		String cardNumber = request.getParameter("cardNumber");
		String receiver = request.getParameter("receiver");
		String factory_id = request.getParameter("factory_id");
		Map<String, Object> result = planService.saveOrderDispatchRecord(curTime,staff_number,factory_id,form_str,cardNumber,receiver);
		initModel(true,null,result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getBusInfo")
	@ResponseBody
	public ModelMap getBusInfo(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("busNo", request.getParameter("busNo"));
		conditionMap.put("orderId", request.getParameter("orderId"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("busInfo", planService.getBusInfoByBusNo(conditionMap));
		result.put("toolList", planService.getBusToolList());
		initModel(true,null,result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/saveDispatchRecord")
	@ResponseBody
	public ModelMap saveDispatchRecord(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String plan_status = request.getParameter("plan_status");
		String form_str = request.getParameter("form_str");
		Map<String, Object> result = planService.saveDispatchRecord(curTime,staff_number,form_str,plan_status);
		initModel(true,null,result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/saveDispatchRecordKD")
	@ResponseBody
	public ModelMap saveDispatchRecordKD(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		
		conditionMap.put("dispatch_plan_id", request.getParameter("patch_plan_id"));
		conditionMap.put("bus_number", request.getParameter("bus_number"));
		conditionMap.put("dispatcher_id", request.getParameter("cardNumber"));
		conditionMap.put("receiver", request.getParameter("username"));
		conditionMap.put("workcardid", request.getParameter("cardNumber"));
		conditionMap.put("qtys", request.getParameter("qtys"));
		conditionMap.put("cardNumber", request.getParameter("cardNumber"));
		conditionMap.put("username", request.getParameter("username"));
		conditionMap.put("plan_status", request.getParameter("plan_status"));
		conditionMap.put("curTime", curTime);
		conditionMap.put("edit_user", staff_number);
		
		Map<String, Object> result = planService.saveDispatchRecordKD(conditionMap);
		initModel(true,null,result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busDispatchQuery")
	@ResponseBody
	public ModelMap busDispatchQuery(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		conditionMap.put("order", request.getParameter("order_no"));
		conditionMap.put("dispatchStart", request.getParameter("dispatchStart"));
		conditionMap.put("dispatchEnd", request.getParameter("dispatchEnd"));
		Map<String, Object> result = planService.busDispatchQuery(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/busDispatchDescQuery")
	@ResponseBody
	public ModelMap busDispatchDescQuery(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		conditionMap.put("orderNo", request.getParameter("orderNo"));
		conditionMap.put("busNoVin", request.getParameter("busNoVin"));
		conditionMap.put("dispatchStart", request.getParameter("dispatchStart"));
		conditionMap.put("dispatchEnd", request.getParameter("dispatchEnd"));
		Map<String, Object> result = planService.busDispatchDescQuery(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}

}
