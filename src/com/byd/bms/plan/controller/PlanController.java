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

	@RequestMapping("/importPlan")
	public ModelAndView importPlan(){ 			//总计划导入
		mv.setViewName("plan/importPlan");
        return mv;  
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

}
