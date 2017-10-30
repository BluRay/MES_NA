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
import com.byd.bms.plan.model.PlanMasterPlan;
import com.byd.bms.plan.service.IPlanService;
import com.byd.bms.util.ExcelModel;

@Controller
@RequestMapping("/plan")
public class PlanController extends BaseController{
	static Logger logger = Logger.getLogger("PLAN");
	@Autowired
	protected IPlanService planService;

	@RequestMapping("/importPlan")
	public ModelAndView importPlan(){ 			//总计划导入
		mv.setViewName("plan/importPlan");
        return mv;  
    }
	
	@RequestMapping("/adjustPlan")
	public ModelAndView adjustPlan(){
		mv.setViewName("plan/adjustPlan");
        return mv;  
	}
	
	@RequestMapping("/displayPlan")
	public ModelAndView displayPlan(){
		mv.setViewName("plan/displayPlan");
        return mv;  
	}
	
	@RequestMapping("/productionReport")
	public ModelAndView productionReport(){
		mv.setViewName("plan/productionReport");
        return mv;  
	}
	
	@RequestMapping("/showPlanMasterIndex")
	@ResponseBody
	public ModelMap showPlanMasterIndex(){
		String production_plant=request.getParameter("production_plant");
		String project_no=request.getParameter("project_no");
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("production_plant", production_plant);
		condMap.put("project_no", project_no);
		
		Map<String,Object> result = planService.getPlanMasterIndex(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@RequestMapping(value="/uploadMasterPlan",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadMasterPlan(@RequestParam(value="file",required=false) MultipartFile file){
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
			if(lineCount!= 9){
				initModel(false,"导入文件的行数有误！一次只能导入一个月的计划！",null);
				model = mv.getModelMap();
				return model;
			}
			String project_no = "";		//订单编号 同一个文件只能导入一个订单
			String factory_name = "";
			for(int i=0;i<lineCount;i++){
				if (i==0){
					project_no = excelModel.getData().get(i)[0].toString().trim();
					factory_name = excelModel.getData().get(i)[1].toString().trim();
				}
				//判断上传计划的工厂是否属于这些订单
				Map<String,Object> importPlanMap=new HashMap<String,Object>();
				importPlanMap.put("project_no", project_no);
				importPlanMap.put("factory_name", factory_name);
				String factory_order_id = planService.checkImportPlanFactory(importPlanMap);
				if (factory_order_id == null){
					initModel(false,project_no + "订单没有 "+factory_name+"的计划，不能上传！",null);
					model = mv.getModelMap();
					return model;
				}
				
				String node = excelModel.getData().get(i)[2].toString().trim();
				int lineCountSwitch = i % 9;
				switch(lineCountSwitch){
					case 0 : if(!node.equals("welding_online")){throw new RuntimeException("import file ERROR！");}break; 
					case 1 : if(!node.equals("welding_offline")){throw new RuntimeException("import file ERROR！");}break; 
					case 2 : if(!node.equals("painting_online")){throw new RuntimeException("import file ERROR！");}break; 
					case 3 : if(!node.equals("painting_offline")){throw new RuntimeException("import file ERROR！");}break; 
					case 4 : if(!node.equals("chassis_online")){throw new RuntimeException("import file ERROR！");}break; 
					case 5 : if(!node.equals("chassis_offline")){throw new RuntimeException("import file ERROR！");}break; 
					case 6 : if(!node.equals("assembly_online")){throw new RuntimeException("import file ERROR！");}break; 
					case 7 : if(!node.equals("assembly_offline")){throw new RuntimeException("import file ERROR！");}break; 
					case 8 : if(!node.equals("outgoing")){throw new RuntimeException("import file ERROR！");}break; 
				}
			}
			//上传的文件验证完成
			String userid=request.getSession().getAttribute("staff_number") + "";;
			result = planService.savePlanMaster(excelModel,userid);			

			
		} catch (Exception e) {
			e.printStackTrace();
			initModel(false,"import file ERROR！",null);
			model = mv.getModelMap();
			return model;
		}
		
		initModel(true,"Import Success!",result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/showPlanMasterList")
	@ResponseBody
	public ModelMap showPlanMasterList(){
		String version=request.getParameter("version");
		String factory_id=request.getParameter("factory_id");
		String factory_name=request.getParameter("factory_name");
		String order_no=request.getParameter("order_no");
		String plan_month = request.getParameter("plan_month");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		if (request.getParameter("version") != null) conditionMap.put("version", version);
		if (request.getParameter("factory_id") != null) conditionMap.put("factory_id", factory_id);
		if (request.getParameter("factory_name") != null) conditionMap.put("factory_name", factory_name);
		if (request.getParameter("order_no") != null) conditionMap.put("project_no", order_no);
		if (request.getParameter("plan_month") != null) conditionMap.put("plan_month", plan_month);
		
		List<PlanMasterPlan> datalist = planService.showPlanMasterList(conditionMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/reVisionPlan")
	@ResponseBody
	public ModelMap reVisionPlan(){
		String factory_id = request.getParameter("factory_id");
		String factory_name = request.getParameter("factory_name");
		String order_no = request.getParameter("order_no");
		String revision_str = request.getParameter("revision_str");
		String plan_month = request.getParameter("plan_month");
		String edit_user = request.getSession().getAttribute("user_id") + "";
		int result = planService.reVisionPlan(factory_id,factory_name, order_no, revision_str, plan_month,edit_user);		
		initModel(true,"success",result);
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
		if (!request.getParameter("workshop").equals("All")) workshop = request.getParameter("workshop");
		////if(workshop.equals("成品库")) workshop="入库";
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

}
