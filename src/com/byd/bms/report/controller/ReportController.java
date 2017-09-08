package com.byd.bms.report.controller;

import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONArray;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import com.byd.bms.report.service.IReportService;
import com.byd.bms.util.controller.BaseController;

@Controller
@RequestMapping("/report")
public class ReportController extends BaseController {
	static Logger logger = Logger.getLogger(ReportController.class.getName());
	@Autowired
	private IReportService reportService;
	
	/************************* xjw start *****************************/
	/**
	 * 工厂年度产量
	 * @return
	 */
	@RequestMapping("/factoryOutputYear")
	public ModelAndView factoryOutputYear(){
		mv.setViewName("report/factoryOutputYear");
		return mv;
	}
	
	@RequestMapping("/factoryOutputReport")
	public ModelAndView factoryOutputReport(){
		mv.setViewName("report/factoryOutputReport");
		return mv;
	}
	
	/**
	 * 工厂年度产量报表数据查询
	 * @return
	 */
	@RequestMapping("/getFactoryOutputYearData")
	@ResponseBody
	public ModelMap getFactoryOutputYearData(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		model.put("straw", request.getParameter("straw"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("year", request.getParameter("year"));
		
		reportService.getFactoryOutputYear(condMap, model);
		
		return model;
	}
	
	/**
	 * 工厂月计划达成
	 * @return
	 */
	@RequestMapping("/factoryPlanRate")
	public ModelAndView factoryPlanRate(){
		mv.setViewName("report/factoryPlanRate");
		return mv;
	}
	
	/**
	 * 工厂年度产量报表数据查询
	 * @return
	 */
	@RequestMapping("/getFactoryPlanRateData")
	@ResponseBody
	public ModelMap getFactoryPlanRateData(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		model.put("straw", request.getParameter("straw"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("factory_name", request.getParameter("factory_name"));
		condMap.put("month", request.getParameter("month"));
		
		reportService.getFactoryPlanRateData(condMap, model);
		
		return model;
	}
	
	/************************* xjw end *****************************/
	
	/**
	 * 焊装、底盘上下线完成情况
	 * @return
	 */
	@RequestMapping("/onlineAndOfflineReport")
	public ModelAndView onlineAndOfflineReport(){
		mv.setViewName("report/onlineAndOfflineReport");
		return mv;
	}
	@RequestMapping("/getOnlineAndOfflineData")
	@ResponseBody
	public ModelMap getOnlineAndOfflineData(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		String start_date=request.getParameter("start_date");
		String end_date=request.getParameter("end_date");
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("start_date", start_date);
		condMap.put("end_date", end_date);
		reportService.getOnlineAndOfflineData(condMap, model);
		
		return model;
	}
	/**
	 * 车间计划达成率
	 * @return
	 */
	@RequestMapping("/workshopRateReport")
	public ModelAndView workshopRateReport(){
		mv.setViewName("report/workshopRateReport");
		return mv;
	}
	@RequestMapping("/getWorkshopRateData")
	@ResponseBody
	public ModelMap getWorkshopRateData() throws ParseException, UnsupportedEncodingException{
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		conditionMap.put("start_date", request.getParameter("start_date"));
		conditionMap.put("end_date", request.getParameter("end_date"));
		//计划数量
		List datalist=new ArrayList();
		datalist = reportService.queryPlanQty(conditionMap);
		
		List plan_code=new ArrayList();
		java.text.DecimalFormat   df = new   java.text.DecimalFormat("##.##"); 
		for (int i = 0; i < datalist.size(); i++) {			
	        Map<String,Object> resultMap=new HashMap<String,Object>();
			resultMap = (Map<String, Object>) datalist.get(i);
			
			Map<String,Object> conditionMap2=new HashMap<String,Object>();
			conditionMap2.put("factory_id", request.getParameter("factory_id"));
			
			String start_date = request.getParameter("start_date");
//			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//			Date startDate = sdf.parse(start_date);
//			Calendar calendar = Calendar.getInstance(); //得到日历
//			calendar.setTime(startDate);//把当前时间赋给日历
//			calendar.add(Calendar.DAY_OF_MONTH, -1);  //设置为前一天
//			startDate = calendar.getTime();   //得到前一天的时间
//			start_date = sdf.format(startDate)+" 17:30:00";    //格式化前一天

			conditionMap2.put("start_date", start_date);
			conditionMap2.put("end_date", request.getParameter("end_date"));
			
			Map<String,Object> conditionMap3=new HashMap<String,Object>();
			Map<String,Object> conditionMap4=new HashMap<String,Object>();
			
			if (resultMap.get("key_name").equals("焊装下线"))conditionMap2.put("workshop", "welding_offline_date");
			if (resultMap.get("key_name").equals("涂装下线"))conditionMap2.put("workshop", "painting_offline_date");
			if (resultMap.get("key_name").equals("底盘下线"))conditionMap2.put("workshop", "chassis_offline_date");
			if (resultMap.get("key_name").equals("总装下线"))conditionMap2.put("workshop", "assembly_offline_date");
			if (resultMap.get("key_name").equals("车辆入库"))conditionMap2.put("workshop", "warehousing_date");
			
			if (resultMap.get("key_name").equals("部件下线")){
				conditionMap3.put("factory_id", request.getParameter("factory_id"));
				conditionMap3.put("start_date", request.getParameter("start_date"));
				conditionMap3.put("end_date", request.getParameter("end_date"));
				conditionMap3.put("workshop", "offline_real_qty");
		
				int realNum = reportService.getPlanPartsRealCount(conditionMap3);
				resultMap.put("real_qty", realNum);
				double count = Double.parseDouble(realNum+"");
				int plan_qty = Integer.parseInt(resultMap.get("plan_qty").toString());
				double rate = Double.parseDouble(df.format(count/plan_qty*100));
				resultMap.put("rate", rate);
				
			}else if (resultMap.get("key_name").equals("自制下线")){
				conditionMap4.put("factory_id", request.getParameter("factory_id"));
				conditionMap4.put("start_date", request.getParameter("start_date"));
				conditionMap4.put("end_date", request.getParameter("end_date"));
				int realNum = reportService.getPlanZzjRealCount(conditionMap4);
				resultMap.put("real_qty", realNum);
				double count = Double.parseDouble(realNum+"");
				int plan_qty = Integer.parseInt(resultMap.get("plan_qty").toString());
				double rate = Double.parseDouble(df.format(count/plan_qty*100));
				resultMap.put("rate", rate);
				
			}else{
				plan_code.add(conditionMap2);
			}	
		}
		//完成数量
		List result=new ArrayList();
		if(plan_code.size()>0){
			result = reportService.getPlanSearchRealCount(plan_code);
		}
		
		int x =0;
		for (int i = 0; i < datalist.size(); i++) {
			
			Map<String,Object> resultMap=new HashMap<String,Object>();
			resultMap = (Map<String, Object>) datalist.get(i);
			if (!resultMap.get("key_name").equals("部件下线")&&!resultMap.get("key_name").equals("自制下线")){
				Map<String,Long> resultMap2=new HashMap<String,Long>();
				resultMap2 = (Map<String, Long>) result.get(x);	
				
				resultMap.put("real_qty", resultMap2.get("count"));
				double count = Double.parseDouble(resultMap2.get("count").toString());
				int plan_qty = Integer.parseInt(resultMap.get("plan_qty").toString());
				double rate = (plan_qty==0&&count>0.0)?100:((plan_qty==0&&count==0.0)?null:Double.parseDouble(df.format(count/plan_qty*100)));
				resultMap.put("rate", rate);
				//System.out.println(resultMap.get("key_name")+" 达成率："+rate);
				x++;
			}
			
		}
		
		//JSONObject json = Util.dataListToJson(true,"查询成功",datalist,null);
		Map<String, Object> map = new HashMap<String, Object>();  
        map.put( "success", true);   
        map.put( "data",datalist);
        JSONArray jsonObject = JSONArray.fromObject(datalist);
//        mv.clear();
		mv.getModelMap().addAllAttributes(jsonObject);
//		model = mv.getModelMap();
//		model=new ModelMap();
		model.put("data", jsonObject);
		return model;
	}
	@RequestMapping("/showFactoryOutputReportData")
	@ResponseBody 
	public ModelMap showFactoryOutputReportData(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("date_array", request.getParameter("date_array"));
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		
		List<Map<String, Object>> datalist  = reportService.showFactoryOutputReportData(conditionMap);		
		Map<String,Object> list = new HashMap<String,Object>();
		list.put("rows", datalist);
		list.put("total", 0);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}

}
