package com.byd.bms.production.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
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

import com.byd.bms.order.service.IOrderService;
import com.byd.bms.production.model.ProductionException;
import com.byd.bms.production.service.IProductionService;
import com.byd.bms.setting.model.BmsBaseFactory;
import com.byd.bms.setting.service.ISettingService;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.util.ExcelTool;
import com.byd.bms.util.HttpUtil;
import com.byd.bms.util.controller.BaseController;
import com.byd.bms.util.service.ICommonService;
/**
 * 生产模块Controller
 * @author xiong.jianwu 2017/5/2
 *
 */
@Controller
@RequestMapping("/production")
public class ProductionController extends BaseController {
	static Logger logger = Logger.getLogger(ProductionController.class.getName());
	@Autowired
	protected IProductionService productionService;
	@Autowired
	protected ICommonService commonService;
	@Autowired
	protected ISettingService settingService;
	@Autowired
	protected IOrderService orderService;
	/****************************  xiongjianwu ***************************/
	/**
	 * 生产模块首页
	 * @return
	 */
	@RequestMapping("/index")
	public ModelAndView index(){
		mv.setViewName("production/productionIndex");
		return mv;
	}
	
	/**
	 * 车间工序页面
	 * @return
	 */
	@RequestMapping("/executionindex")
	public ModelAndView executionindex(){
		mv.getModelMap().addAttribute("workshop", request.getParameter("workshop"));
		mv.setViewName("production/executionIndex");
		return mv;
	}
	
	/**
	 * 获取线别工序列表
	 * @return
	 */
	@RequestMapping("/getLineProcessList")
	@ResponseBody
	public ModelMap getLineProcessList(){
		model=new ModelMap();
		String conditions=request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		Map<String, Object> conditionMap = new HashMap<String, Object>();	
		for (Iterator it = jo.keys(); it.hasNext();) {
			String key = (String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		model.put("dataList", productionService.getLineProcessList(conditionMap));
		
		return model;
	}
	
	/**
	 * 生产扫描页面
	 * @return
	 */
	@RequestMapping("/execution")
	public ModelAndView execution(){
		mv.setViewName("production/productionExecution");
		return mv;
	}
	
	/**
	 * 生产扫描页面(移动端)
	 * @return
	 */
	@RequestMapping("/execution_mobile")
	public ModelAndView execution_mobile(){
		mv.setViewName("production/productionExecution_Mobile");
		return mv;
	}
	
	@RequestMapping("/workHoursMtaPage")
	public ModelAndView workHoursMtaPage(){					//额外工时维护 AddBy:Yangke 170731
		mv.setViewName("production/workHoursMtaPage");
		return mv;
	}

	@RequestMapping("/workHoursVerifyPage")
	public ModelAndView workHoursVerifyPage(){				//额外工时审核 AddBy:Yangke 170731
		mv.setViewName("production/workHoursVerifyPage");
		return mv;
	}
	
	@RequestMapping("/productionsearch")
	public ModelAndView productionsearch(){
		mv.setViewName("production/productionsearch");
		return mv;
	}
	
	/**
	 * 查询监控工序下拉列表
	 * @return
	 */
	@RequestMapping("/getProcessMonitorSelect")
	@ResponseBody
	public ModelMap getProcessMonitorSelect(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("order_type", request.getParameter("order_type"));
		model=new ModelMap();
		model.put("data", productionService.getProcessMonitorSelect(condMap));
		return model;
	}
	
	/**
	 * 车辆扫描后获取车辆信息（订单、车间、线别、当前工序、状态、颜色、订单配置信息）
	 * @return
	 */
	@RequestMapping("/getBusInfo")
	@ResponseBody
	public ModelMap getBusInfo(){
		model=new ModelMap();
		//封装查询条件
		String bus_number=request.getParameter("bus_number");
/*		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String line=request.getParameter("line");
		*/
		//查询车辆基本信息
		Map<String,Object> businfo=new HashMap<String,Object>();
		businfo=productionService.getBusInfo(bus_number);
		if(businfo==null){
			model.put("businfo", null);
			model.put("nextProcess", null);
		}else{
			Map<String,Object> condMap=new HashMap<String,Object>();
			condMap.put("factory_name", businfo.get("factory"));
			condMap.put("order_type", businfo.get("order_type"));
			condMap.put("process_name", businfo.get("process_name"));
			Map<String,Object> nextProcess=productionService.getNextProcess(condMap);
			model.put("businfo", businfo);
			model.put("nextProcess", nextProcess);
		}
				
/*		//根据车辆所属订单类型、工厂、车间、线别查询监控工序列表
		if(businfo!=null&&!businfo.isEmpty()&&businfo.containsKey("factory_name")){
			String factory=(String) businfo.get("factory_name");
			String workshop=(String) businfo.get("workshop");
			String line=(String) businfo.get("line");
			String order_type=(String) businfo.get("order_type");
			Map<String,Object> condMap=new HashMap<String,Object>();
			condMap.put("factory", factory);
			condMap.put("workshop", workshop);
			condMap.put("line", line);
			condMap.put("order_type", order_type);
			model.put("processList", productionService.getProcessMonitorSelect(condMap));
		}	*/
		
		//查询订单配置信息
		if(businfo!=null&&!businfo.isEmpty()&&businfo.containsKey("order_config_id")){
			String order_config_id=String.valueOf(businfo.get("order_config_id"));
			model.put("configList", productionService.getOrderConfigList(order_config_id));
		}
		
		return model;
	}
	

	/**
	 * 根据车号、工厂、车间、工序、订单、车型、配置查询关键零部件列表
	 * @return
	 */
	@RequestMapping("/getKeyParts")
	@ResponseBody
	public ModelMap getKeyParts(){	
		model=new ModelMap();
		int factory_id=Integer.parseInt(request.getParameter("factory_id"));
		String workshop=(String)  request.getParameter("workshop");
		int order_id=Integer.parseInt(request.getParameter("order_id"));
		int order_config_id=Integer.parseInt(request.getParameter("order_config_id"));
		int bus_type_id=Integer.parseInt(request.getParameter("bus_type_id"));
		String processName=(String)  request.getParameter("process_name");
		String bus_number=request.getParameter("bus_number");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_id", factory_id);
		condMap.put("workshop", workshop);
		condMap.put("order_id", order_id);
		condMap.put("order_config_id", order_config_id);
		condMap.put("bus_type_id", bus_type_id);
		condMap.put("process_name", processName);
		condMap.put("bus_number", bus_number);
		model.put("partsList", productionService.getKeyParts(condMap));
					
		return model;	
	}
	
	/**
	 * 车辆扫描，判断该工序是否有扫描记录，未扫描判断上一个计划节点是否有扫描记录，无则提示先扫描上一个计划节点
	 * 保存扫描信息、关键零部件信息、更新bus表对应车辆的latest_process_id
	 * @return
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@RequestMapping("/enterExecution")
	@ResponseBody
	public ModelMap enterExecution(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		/**
		 * 封装service 参数
		 */
		int factory_id=Integer.parseInt(request.getParameter("factory_id"));
		String factory_name=request.getParameter("factory_name");
		String workshop_name=request.getParameter("workshop_name");
		int process_id=Integer.parseInt(request.getParameter("process_id"));
		String process_name=request.getParameter("process_name");
		String process_number=request.getParameter("process_number");
		String line_name=request.getParameter("line_name");
		String plan_node_name=request.getParameter("plan_node_name");
		String field_name=request.getParameter("field_name");
		String bus_number=request.getParameter("bus_number");
		String parts_list_str=request.getParameter("parts_list");
		String order_type=request.getParameter("order_type");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		String order_id=request.getParameter("order_id");
		
		condMap.put("factory_id", factory_id);
		condMap.put("factory_name", factory_name);
		condMap.put("workshop_name", workshop_name);
		condMap.put("process_id", process_id);
		condMap.put("process_name", process_name);
		condMap.put("line_name", line_name);
		condMap.put("plan_node_name", plan_node_name);
		condMap.put("bus_number", bus_number);
		condMap.put("field_name", field_name.equals("")?"":(field_name+"_date"));
		condMap.put("order_type", order_type);
		condMap.put("order_id", order_id);
		condMap.put("editor_id", userid);
		condMap.put("edit_date", curTime);
		
		/**
		 * 关键零部件列表
		 */
		List<Map<String,Object>> parts_list=new ArrayList<Map<String,Object>>();
		if(parts_list_str.contains("{")){
			JSONArray jsa=JSONArray.fromObject(parts_list_str);
			parts_list=JSONArray.toList(jsa, Map.class);
		}	
		for(Map m:parts_list){
			m.put("factory_id", factory_id);
			m.put("bus_number", bus_number);
			m.put("process_number", process_number);
			m.put("process_name", process_name);
			m.put("editor_id", userid);
			m.put("edit_date", curTime);
		}
		
		model.addAllAttributes(productionService.scan(condMap,parts_list));

		return model;
	}
	
	/**
	 * 生产异常登记页面
	 * @return
	 */
	@RequestMapping("/exception")
	public ModelAndView exception(){
		mv.setViewName("production/productionException");
		return mv;
	}
	
	/**
	 * 生产异常登记页面(移动端)
	 * @return
	 */
	@RequestMapping("/exception_mobile")
	public ModelAndView exception_mobile(){
		mv.setViewName("production/productionException_Mobile");
		return mv;
	}
	
	/**
	 * 生产异常登记
	 * @return
	 */
	@RequestMapping("/enterException")
	@ResponseBody
	public ModelMap enterException(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		logger.info("---->enterException " + curTime + " " + userid);
		
		String bus_number = request.getParameter("bus_number");
		//logger.info("---->bus_number = " + bus_number);
		//String[] bus_numberArray=bus_number.split("\\|");
		JSONArray busarr=JSONArray.fromObject(request.getParameter("bus_list"));
		List<ProductionException> exceptionList=new ArrayList<ProductionException>();
		
		for(Iterator it=busarr.iterator();it.hasNext();){
			//logger.info("---->bus_numberArray = " + bus_numberArray[i] + " ");
			JSONObject bus=(JSONObject) it.next();
			String cur_bus_number = bus.getString("bus_number");
			ProductionException exception = new ProductionException();
			exception.setFactory(request.getParameter("factory"));
			exception.setWorkshop(request.getParameter("workshop"));
			exception.setLine(request.getParameter("line"));
			exception.setProcess(request.getParameter("process"));
			exception.setBus_number(cur_bus_number);
			exception.setReason_type_id(request.getParameter("reason_type_id"));
			if(request.getParameter("lack_reason_id") != "") exception.setLack_reason_id(request.getParameter("lack_reason_id"));
			exception.setStart_time(request.getParameter("start_time"));
			exception.setSeverity_level_id(request.getParameter("severity_level"));
			exception.setDetailed_reasons(request.getParameter("detailed_reasons"));
			exception.setEditor_id(userid);
			exception.setEdit_date(curTime);
			exceptionList.add(exception);
		}	
		productionService.createProductionException(exceptionList,model);
		return model;
	}
	
	/**
	 * 车辆信息维护页面
	 * @return
	 */
	@RequestMapping("/busInfoMtn")
	public ModelAndView busInfoMtn(){
		mv.setViewName("production/busInfoMtn");
		return mv;
	}
	
	/**
	 * 获取车辆信息列表
	 * @return
	 */
	@RequestMapping("/getBusInfoList")
	@ResponseBody
	public ModelMap getBusInfoList(){
		model=new ModelMap();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("bus_type", request.getParameter("bus_type"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		
		model.addAllAttributes(productionService.getBusInfoList(condMap));
		return model;
	}
	
	/**
	 * 车辆信息维护
	 * @return
	 */
	@RequestMapping("/updateBusInfo")
	@ResponseBody
	public ModelMap updateBusInfo(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_id",request.getParameter("factory_id")) ;
		condMap.put("order_id",request.getParameter("order_id")) ;
		condMap.put("bus_list",request.getParameter("bus_list")) ;
		condMap.put("bus_number",request.getParameter("bus_number")) ;
		condMap.put("bus_color",request.getParameter("bus_color")) ;
		condMap.put("bus_seats",request.getParameter("bus_seats")) ;
		condMap.put("passenger_num",request.getParameter("passenger_num")) ;
		condMap.put("tire_type",request.getParameter("tire_type")) ;
		condMap.put("battery_capacity",request.getParameter("battery_capacity")) ;
		condMap.put("rated_voltage",request.getParameter("rated_voltage")) ;
		condMap.put("spring_num",request.getParameter("spring_num")) ;
		condMap.put("dp_production_date",request.getParameter("dp_production_date")) ;
		condMap.put("dp_zzd",request.getParameter("dp_zzd")) ;
		condMap.put("zc_production_date",request.getParameter("zc_production_date")) ;
		condMap.put("zc_zzd",request.getParameter("zc_zzd")) ;
		condMap.put("hgz_note",request.getParameter("hgz_note")) ;
		condMap.put("ccczs_date",request.getParameter("ccczs_date")) ;
		condMap.put("dpgg_date",request.getParameter("dpgg_date")) ;
		condMap.put("zcgg_date",request.getParameter("zcgg_date")) ;
		
		productionService.updateBusInfo(condMap,model);
		
		return model;
		
	}
	
	/**
	 * 铭牌打印页面
	 * @return
	 */
	@RequestMapping("/nameplatePrint")
	public ModelAndView nameplatePrint(){
		mv.setViewName("production/nameplatePrint");
		return mv;
	}
	
	/**
	 * 获取铭牌打印列表数据
	 * @return
	 */
	@RequestMapping("/getNameplatePrintList")
	@ResponseBody
	public ModelMap getNameplatePrintList(){
		model=new ModelMap();
		String conditions=request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		Map<String, Object> conditionMap = new HashMap<String, Object>();	
		for (@SuppressWarnings("rawtypes")
		Iterator it = jo.keys(); it.hasNext();) {
			String key = (String) it.next();
			logger.info(key);
			conditionMap.put(key, jo.get(key));
		}
		
		int factoryId=Integer.parseInt(session.getAttribute("factory_id").toString());
		conditionMap.put("factoryId", factoryId);
		
		productionService.getNameplatePrintList(conditionMap,model);
		
		return model;
	}
	
	/**
	 * 铭牌打印后更新状态
	 * @return
	 */
	@RequestMapping("/afterNameplatePrint")
	@ResponseBody
	public ModelMap afterNameplatePrint(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		String conditions=request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		String busNOListString=jo.getString("busNoList");

		List<String> busNoList= new ArrayList<String>();
		busNoList=Arrays.asList(busNOListString.split(","));
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("busNoList", busNoList);
		conditionMap.put("printer", userid);
		conditionMap.put("printDate", curTime);
		
		productionService.updateNameplatePrint(conditionMap,model);
		return model;
	}
	
	/**
	 *	车间供货页面
	 * @return
	 */
	@RequestMapping("/workshopSupply")
	public ModelAndView workshopSupply(){
		mv.setViewName("production/workshopSupply");
		return mv;
	}
	
	/**
	 * 根据工厂、订单、供货车间、接收车间获取供应车付信息
	 * @return
	 */
	@RequestMapping("/getSupplyTotalCount")
	@ResponseBody
	public ModelMap getSupplyTotalCount(){
		model=new ModelMap();
		String factory_id=request.getParameter("factory_id");
		String order_no=request.getParameter("order_no");
		String supply_workshop=request.getParameter("supply_workshop");
		String receive_workshop=request.getParameter("receive_workshop");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_id", factory_id);
		condMap.put("order_no", order_no);
		condMap.put("supply_workshop", supply_workshop);
		condMap.put("receive_workshop", receive_workshop);
		
		productionService.getSupplyTotalCount(condMap,model);
		return model;
	}
	
	/**
	 * 保存车间供付信息
	 * @return
	 */
	@RequestMapping("/saveUpdateWorkshopSupply")
	@ResponseBody
	public ModelMap saveUpdateWorkshopSupply(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("id", request.getParameter("id"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("order_id", request.getParameter("order_id"));
		condMap.put("supply_workshop", request.getParameter("supply_workshop"));
		condMap.put("receive_workshop", request.getParameter("receive_workshop"));
		condMap.put("quantity", request.getParameter("quantity"));
		condMap.put("supply_date", request.getParameter("supply_date"));
		condMap.put("editor_id", userid);
		condMap.put("edit_date", curTime);
		
		productionService.saveUpdateWorkshopSupply(condMap,model);
		return model;
	}
	
	/**
	 * 查询车间供付记录列表
	 * @return
	 */
	@RequestMapping("/getWorkshopSupplyList")
	@ResponseBody
	public ModelMap getWorkshopSupplyList(){
		model=new ModelMap();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("search_date_start", request.getParameter("search_date_start"));
		condMap.put("search_date_end", request.getParameter("search_date_end"));
		condMap.put("supply_workshop", request.getParameter("supply_workshop"));
		condMap.put("receive_workshop", request.getParameter("receive_workshop"));
		condMap.put("orderColumn", request.getParameter("orderColumn"));
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		
		model.addAllAttributes(productionService.getWorkshopSupplyList(condMap));
		return model;
	}
	
	/**
	 *	车间供货页面
	 * @return
	 */
	@RequestMapping("/partsOnOffline")
	public ModelAndView partsOnOffline(){
		mv.setViewName("production/partsOnOffline");
		return mv;
	}
	
	/**
	 * 查询部件上下线剩余数量
	 * @return
	 */
	@RequestMapping("/getPartsFinishCount")
	@ResponseBody
	public ModelMap getPartsFinishCount(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("parts_id", request.getParameter("parts_id"));
		
		productionService.getPartsFinishCount(condMap,model);
		return model;
	}
	
	/**
	 * 保存部件上下线记录
	 * @return
	 */
	@RequestMapping("/saveUpdatePartsOnOffRecord")
	@ResponseBody
	public ModelMap saveUpdatePartsOnOffRecord(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("id", request.getParameter("id"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("order_id", request.getParameter("order_id"));
		condMap.put("parts_id", request.getParameter("parts_id"));
		condMap.put("online_num", request.getParameter("online_num"));
		condMap.put("offline_num", request.getParameter("offline_num"));
		condMap.put("prod_date", request.getParameter("prod_date"));
		condMap.put("editor_id", userid);
		condMap.put("edit_date", curTime);
		
		productionService.saveUpdatePartsOnOffRecord(condMap,model);
		return model;
	}
	
	/**
	 * 查询部件上下线记录列表
	 * @return
	 */
	@RequestMapping("/getPartsOnOffList")
	@ResponseBody
	public ModelMap getPartsOnOffList(){
		model=new ModelMap();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("search_date_start", request.getParameter("search_date_start"));
		condMap.put("search_date_end", request.getParameter("search_date_end"));
		condMap.put("parts_id", request.getParameter("parts_id"));
		condMap.put("orderColumn", request.getParameter("orderColumn"));
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		
		model.addAllAttributes(productionService.getPartsOnOffList(condMap));
		return model;
	}
	
	/**
	 *	合格证打印页面
	 * @return
	 */
	@RequestMapping("/certificationPrint")
	public ModelAndView certificationPrint(){
		mv.setViewName("production/certificationPrint");
		return mv;
	}
	/**
	 * 获取合格证打印列表数据
	 * @return
	 */
	@RequestMapping("/getCertificationList")
	@ResponseBody
	public ModelMap getCertificationList(){
		model=new ModelMap();
		
		String conditions=request.getParameter("conditions");
		logger.info("合格证查询条件:"+conditions);
		JSONObject jo = JSONObject.fromObject(conditions);
		Map<String, Object> conditionMap = new HashMap<String, Object>();	
		for (Iterator it = jo.keys(); it.hasNext();) {
			String key = (String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		String bus_number=conditionMap.get("bus_number").toString();
		String[] busNumberList =bus_number.split("\n");
		int bus_number_size = busNumberList.length;
		if (bus_number.equals(""))bus_number_size=0;
		conditionMap.put("bus_number", busNumberList);
		conditionMap.put("bus_number_size", bus_number_size);
		
		productionService.getCertificationList(conditionMap,model);
		return model;
	}
	
	/**
	 * added by xjw 2017/03/10
	 * 合格证信息传输到合格证系统打印
	 * @return
	 */
	@RequestMapping("/certificatePrint")
	@ResponseBody
	public ModelMap certificatePrint(){
		model=new ModelMap();
		String conditions=request.getParameter("conditions");
		JSONArray jsa=JSONArray.fromObject(conditions);
		List<Map<String,Object>> buslist=JSONArray.toList(jsa,Map.class);
		
		productionService.transferDataToHGZSys(buslist,model);
		
		return model;
	}
	/**
	 * 车间监控板
	 * @return
	 */
	@RequestMapping("/monitorBoard")
	public ModelAndView monitorBoard(){
		mv.setViewName("production/monitorBoard");
		return mv;
	}
	
	/**
	 *@author xiong.jianwu
	 * 校验VIN与对应的车载终端是否绑定成功
	 * @return
	 */
	@RequestMapping("/gpsValidate")
	@ResponseBody
	public ModelMap gpsValidate(){
		model.clear();
		String conditions=request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		Map<String, Object> conditionMap = new HashMap<String, Object>();	
		for (Iterator it = jo.keys(); it.hasNext();) {
			String key = (String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		String jsonstr=HttpUtil.post("http://10.9.32.67:8082/i.dbhttpservice_bms/auto/validateVin",
		        JSONObject.fromObject(conditionMap).toString());
		model.put("data", jsonstr);
		
		return model;
	}
	
	/**
	 * 计件工时维护页面
	 * @return
	 */
	@RequestMapping("/pieceWorkhourMtn")
	public ModelAndView pieceWorkhourMtn(){
		mv.getModelMap().addAttribute("workshop", request.getParameter("workshop"));
		mv.setViewName("production/pieceWorkhourMtn");
		return mv;
	}
	
	/**
	 * @author xiong.jianwu
	 * 获取小班组的计件方式
	 * @return
	 */
	@RequestMapping("/getSalaryModel")
	@ResponseBody
	public ModelMap getSalaryModel(){
		model.clear();
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String workgroup=request.getParameter("workgroup");
		String team=request.getParameter("team");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("workgroup", workgroup);
		condMap.put("team", team);
		
		productionService.getSalaryModel(condMap,model);
			
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 计件工时维护查询小班组人员列表,小班组记资方式
	 * @return
	 */
	@RequestMapping("/getTeamStaffDetail")
	@ResponseBody
	public ModelMap getTeamStaffDetail(){
		model.clear();
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String workgroup=request.getParameter("workgroup");
		String team=request.getParameter("team");
		String order_id=request.getParameter("order_id");
		String work_date=request.getParameter("work_date");
		String org_id=request.getParameter("org_id");
		String staff_number=request.getParameter("staff_number");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("workgroup", workgroup);
		condMap.put("team", team);
		condMap.put("order_id", order_id);
		condMap.put("org_id", org_id);
		condMap.put("work_date", work_date);
		condMap.put("staff_number", staff_number);
		
		productionService.getTeamStaffDetail(condMap,model);
		
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 计件工时维护校验车号/自编号是否已经录入工时信息。车辆是否在车间上线
	 * @return
	 */
	@RequestMapping("/workhourValidateBus")
	@ResponseBody
	public ModelMap workhourValidateBus(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("salary_model", request.getParameter("salary_model"));
		condMap.put("is_customer", request.getParameter("is_customer"));
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("workgroup", request.getParameter("workgroup"));
		condMap.put("team", request.getParameter("team"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("work_date", request.getParameter("work_date"));
		
		productionService.workhourValidateBus(condMap,model);	
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 校验辅助人力、底薪模式是否已经录入了计件工时信息
	 * @return
	 */
	@RequestMapping("/workhourValidateRecordIn")
	@ResponseBody
	public ModelMap workhourValidateRecordIn(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("salary_model", request.getParameter("salary_model"));
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("workgroup", request.getParameter("workgroup"));
		condMap.put("team", request.getParameter("team"));
		condMap.put("work_date", request.getParameter("work_date"));
		
		productionService.workhourValidateRecordIn(condMap,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 保存计件工时信息
	 * @return
	 */
	@RequestMapping("/saveStaffHours")
	@ResponseBody
	public ModelMap saveStaffHours(){
		model.clear();
		String salary_model=request.getParameter("salary_model");
		String is_customer=request.getParameter("is_customer");
		String str_staffHours=request.getParameter("staffHourList");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_date = df.format(new Date());
		String editor_id=String.valueOf(session.getAttribute("user_id"));
		
		if("技能系数".equals(salary_model)){
			productionService.saveStaffHours_cal0(str_staffHours,is_customer,edit_date,editor_id,model);
		}
		if("承包制".equals(salary_model)){
			productionService.saveStaffHours_cal1(str_staffHours,is_customer,edit_date,editor_id,model);
		}
		if("辅助人力".equals(salary_model)){
			productionService.saveStaffHours_cal2(str_staffHours,edit_date,editor_id,model);
		}
		if("底薪模式".equals(salary_model)){
			productionService.saveStaffHours_cal3(str_staffHours,edit_date,editor_id,model);
		}

		return model;
	}
	
	/**
	 * 计件工时修改页面
	 * @return
	 */
	@RequestMapping("/pieceWorkhourUpdate")
	public ModelAndView pieceWorkhourUpdate(){
		mv.setViewName("production/pieceWorkhourUpdate");
		return mv;
	}
	
	/**
	 * @author xiong.jianwu
	 * 查询计件工时列表（计件工时修改/审核页面）
	 * @return
	 */
	@RequestMapping("/getStaffHoursDetail")
	@ResponseBody
	public ModelMap getStaffHoursDetail(){
		model.clear();
		String org_id=request.getParameter("org_id");
		String bus_number=request.getParameter("bus_number");
		String wdate_start=request.getParameter("wdate_start");
		String wdate_end=request.getParameter("wdate_end");
		String status=request.getParameter("status");
		
		productionService.getStaffHoursDetail(org_id,bus_number,wdate_start,wdate_end,status,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 删除员工工时信息
	 * @return
	 */
	@RequestMapping("/deleteStaffHours")
	@ResponseBody
	public ModelMap deleteStaffHours(){
		model.clear();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("workgroup", request.getParameter("workgroup"));
		condMap.put("team", request.getParameter("team"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("work_date", request.getParameter("work_date"));
		condMap.put("work_month", request.getParameter("work_date").substring(0, 7));
		condMap.put("swh_id", request.getParameter("swh_id"));
		condMap.put("salary_model", request.getParameter("salary_model"));
		
		productionService.deleteStaffHours(condMap,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 计件工时信息修改，重新计算计件工资
	 * @return
	 */
	@RequestMapping("/updateStaffHours")
	@ResponseBody
	public ModelMap updateStaffHours(){
		model.clear();
		String salary_model=request.getParameter("salary_model");
		String is_customer=request.getParameter("is_customer");
		String str_staffHours=request.getParameter("staffHourList");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_date = df.format(new Date());
		String editor_id=String.valueOf(session.getAttribute("user_id"));
		
		if("技能系数".equals(salary_model)){
			productionService.updateStaffHours_cal0(str_staffHours,is_customer,edit_date,editor_id,model);
		}
		if("承包制".equals(salary_model)){
			productionService.updateStaffHours_cal1(str_staffHours,is_customer,edit_date,editor_id,model);
		}
		if("辅助人力".equals(salary_model)){
			productionService.updateStaffHours_cal2(str_staffHours,edit_date,editor_id,model);
		}
		if("底薪模式".equals(salary_model)){
			productionService.updateStaffHours_cal3(str_staffHours,edit_date,editor_id,model);
		}
		return model;
	}
	
	/**
	 * 计件工时审核页面
	 * @return
	 */
	@RequestMapping("/pieceWorkhourVerify")
	public ModelAndView pieceWorkhourVerify(){
		mv.setViewName("production/pieceWorkhourVerify");
		return mv;
	}
	
	/**
	 * 工时审核（驳回）
	 * @return
	 */
	@RequestMapping("/verifyStaffHours")
	@ResponseBody
	public ModelMap verifyStaffHours(){
		model.clear();
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String workgroup=request.getParameter("workgroup");
		String team=request.getParameter("team");
		String salary_model=request.getParameter("salary_model");
		String bus_number_list=request.getParameter("bus_number_list");
		String work_date_list=request.getParameter("work_date_list");
		Map<String,String> condMap=new HashMap<String,String>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("workgroup", workgroup);
		condMap.put("team", team);
		condMap.put("salary_model", salary_model);
		condMap.put("bus_number_list", bus_number_list);
		condMap.put("work_date_list", work_date_list);
		condMap.put("status", "2");
		
		productionService.verifyStaffHours(condMap,model);
		return model;
	}
	/****************************  xiongjianwu ***************************/
	
	@RequestMapping("/productionsearchbusinfo")
	public ModelAndView productionsearchbusinfo(){
		mv.setViewName("production/productionsearchbusinfo");
		return mv;
	}
	
	@RequestMapping("/getProductionSearchBusInfo")
	@ResponseBody
	public ModelMap getProductionSearchBusInfo(){		
		List<Map<String, String>> datalist = productionService.getProductionSearchBusinfo(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getProductionSearchScan")
	@ResponseBody
	public ModelMap getProductionSearchScan(){
		List<Map<String, String>> datalist = productionService.getProductionSearchScan(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getProductionSearch")
	@ResponseBody
	public ModelMap getProductionSearch(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		conditionMap.put("workshop_id", request.getParameter("workshop_id"));
		conditionMap.put("line_id", request.getParameter("line_id"));
		conditionMap.put("exception_type", request.getParameter("exception_type"));
		conditionMap.put("order_no", request.getParameter("order_no"));
		conditionMap.put("cur_date", curTime.substring(0, 10));
		conditionMap.put("onoff", request.getParameter("onoff"));
		conditionMap.put("start_date", request.getParameter("start_date"));
		conditionMap.put("end_date", request.getParameter("end_date"));
		
		List<Map<String,String>> datalist = productionService.getProductionSearch(conditionMap);
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getProductionSearchCarinfo")
	@ResponseBody
	public ModelMap getProductionSearchCarinfo(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String wipFlg=request.getParameter("wip_flg");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("factory_id", request.getParameter("factory_id"));
		conditionMap.put("onoff", request.getParameter("onoff"));
		conditionMap.put("start_date", request.getParameter("start_date"));
		conditionMap.put("end_date", request.getParameter("end_date"));
		conditionMap.put("wip_flg", wipFlg);
		if(request.getParameter("workshop").equals("全部")){
			conditionMap.put("workshop","");
		}else if(request.getParameter("workshop").equals("焊装")){
			conditionMap.put("workshop","welding");
		}else if(request.getParameter("workshop").equals("玻璃钢")){
			conditionMap.put("workshop","fiberglass");
		}else if(request.getParameter("workshop").equals("涂装")){
			conditionMap.put("workshop","painting");
		}else if(request.getParameter("workshop").equals("底盘")){
			conditionMap.put("workshop","chassis");
		}else if(request.getParameter("workshop").equals("总装")){
			conditionMap.put("workshop","assembly");
		}else if(request.getParameter("workshop").equals("调试区")){
			conditionMap.put("workshop","debugarea");
		}else if(request.getParameter("workshop").equals("检测线")){
			conditionMap.put("workshop","testline");
		}else if(request.getParameter("workshop").equals("成品库")){
			conditionMap.put("workshop","warehousing");
		}
		if(request.getParameter("line").equals("全部")){
			conditionMap.put("line","");
		}else{
			conditionMap.put("line",request.getParameter("line"));
		}		
		conditionMap.put("exception_type", request.getParameter("exception_type"));
		conditionMap.put("order_no", request.getParameter("order_no"));
		conditionMap.put("bus_number", request.getParameter("bus_number"));
		conditionMap.put("cur_date", curTime.substring(0, 10));
		List<Map<String,String>> datalist=new ArrayList<Map<String,String>>();
		if(StringUtils.isNotEmpty(wipFlg)){
			datalist = productionService.getProductionWIPBusInfo(conditionMap);
		}else{
			datalist = productionService.getProductionSearchCarinfo(conditionMap);
		}
		
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getNamePlateInfo")
	@ResponseBody
	public ModelMap getNamePlateInfo(){
		List<Map<String, String>> datalist = productionService.getNamePlateInfo(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getProductionSearchException")
	@ResponseBody
	public ModelMap getProductionSearchException(){
		List<Map<String, String>> datalist = productionService.getProductionSearchException(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}

	
	@RequestMapping("/getCertificationInfo")
	@ResponseBody
	public ModelMap getCertificationInfo(){
		List<Map<String, String>> datalist = productionService.getCertificationInfo(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/queryTechSingleCarNolist")
	@ResponseBody
	public ModelMap queryTechSingleCarNolist(){
		List<Map<String, String>> datalist = productionService.getEcnTasksByBusNumber(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getQmTestCardList")
	@ResponseBody
	public ModelMap getQmTestCardList(){	//车辆信息查询 成品纪录表 TEST_CARD
		List<Map<String, String>> datalist = productionService.getQmTestCardList(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getKeyPartsList")
	@ResponseBody
	public ModelMap getKeyPartsList(){
		List<Map<String, String>> datalist = productionService.getKeyPartsList(request.getParameter("bus_number"));
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	/**************************** TANGJIN  ************************/
	
	/**打印VIN码*/
	@RequestMapping("/showVinPrint")
	public ModelAndView showVinPrint(){
		mv.setViewName("production/showVinPrint");
		return mv;
	}
	@RequestMapping("/getVinPrintList")
	@ResponseBody
	public ModelMap getVinPrintList(){
		model=new ModelMap();
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):20;	//每一页数据条数
		String factory_id=String.valueOf(session.getAttribute("factory_id"));
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("orderNo", request.getParameter("orderNo"));
		condMap.put("busNo", request.getParameter("busNumber"));
		condMap.put("factoryId", factory_id);
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		Map<String,Object> list = productionService.getVinPrintList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/saveMotorNumber")
	@ResponseBody
	public ModelMap saveMotorNumber(){
		model=new ModelMap();
		Map<String, Object> result = new HashMap<String, Object>();
		String conditions=request.getParameter("conditions");
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<Map<String,Object>> buslist=new ArrayList<Map<String,Object>>();
		for(int i=0;i<jsonArray.size();i++){
			 JSONObject object = (JSONObject)jsonArray.get(i);		
			 Map<String, Object> map = (Map<String, Object>) object;
			 buslist.add(map);
		}
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("buslist", buslist);
		int a=productionService.updateBusMotorNumber(condMap);
		int b=productionService.updateVinMotorNumber(condMap);
		if(a>0&&b>0){
			result.put("success", true);
			result.put("message", "保存成功");
		}else{
			result.put("success", false);
			result.put("message", "保存失败");
		}
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping("/afterVinPrint")
	@ResponseBody
	public ModelMap afterVinPrint(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		Map<String, Object> result = new HashMap<String, Object>();
		List<String> vinList= new ArrayList<String>();
		String conditions=request.getParameter("conditions");
		vinList=Arrays.asList(conditions.split(","));
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("vinList", vinList);
		conditionMap.put("printer", userid);
		conditionMap.put("printDate", curTime);
		int i=productionService.updateVinPrint(conditionMap);
		if(i>0){
			result.put("success", true);
			result.put("message", "打印成功");
		}else{
			result.put("success", false);
			result.put("message", "打印失败");
		}
		model.addAllAttributes(result);
		return model;
	}
	/**
	 * 检查vin码是否在PD_VIN表中存在，存在为有效，否则无效
	 * 
	 * @return
	 */
	@RequestMapping("/validateVin")
	@ResponseBody
	public ModelMap validateVin() {
		model=new ModelMap();
		String vin=request.getParameter("vin");
		Map conditionMap=new HashMap<String,Object>();
		conditionMap.put("vin", vin);
		List selectList = productionService.getVinList(conditionMap);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", selectList);
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping("/getBusNumberByVin")
	@ResponseBody
	public ModelMap getBusNumberByVin() {
		model=new ModelMap();
		String vin=request.getParameter("vin");
		Map conditionMap=new HashMap<String,Object>();
		conditionMap.put("vin", vin);
		List selectList = productionService.getBusNumberByVin(conditionMap);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", selectList);
		model.addAllAttributes(result);
		return model;
	}
	/**打印车身号*/
	@RequestMapping("/showBusNoPrint")
	public ModelAndView showBusNoPrint(){
		mv.setViewName("production/showBusNoPrint");
		return mv;
	}
	@RequestMapping("/getBusNoPrintList")
	@ResponseBody
	public ModelMap getBusNoPrintList(){
		model=new ModelMap();
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):20;	//每一页数据条数
		String factory_id=String.valueOf(session.getAttribute("factory_id"));
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("orderNo", request.getParameter("orderNo"));
		condMap.put("busNo", request.getParameter("busNumber"));
		condMap.put("planStart", request.getParameter("planStart"));
		condMap.put("planEnd", request.getParameter("planEnd"));
		condMap.put("factoryId", factory_id);
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		Map<String,Object> list = productionService.getBusNoPrintList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/getOrderConfigList")
	@ResponseBody
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public ModelMap getOrderConfigList() {
		model=new ModelMap();
		String search_order_no=request.getParameter("search_order_no");
		String factory_id=request.getParameter("factory_id");
		Map conditionMap=new HashMap<String,Object>();
		conditionMap.put("search_order_no", search_order_no);
		conditionMap.put("factory_id", factory_id);
		List selectList = productionService.getOrderConfigList(conditionMap);
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("data", selectList);
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping("/afterBusNoPrint")
	@ResponseBody
	public ModelMap afterBusNoPrint(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		Map<String, Object> result = new HashMap<String, Object>();
		List<String> vinList= new ArrayList<String>();
		String conditions=request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		String bus_no_list=jo.getString("busNoList");
		String changed_config_id=jo.getString("changedConfigId");
		List<String> busNoList= new ArrayList<String>();
		busNoList=Arrays.asList(bus_no_list.split(","));
		vinList=Arrays.asList(conditions.split(","));
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("busNoList", busNoList);
		conditionMap.put("changedConfigId",changed_config_id);
		conditionMap.put("printer", userid);
		conditionMap.put("printDate", curTime);
		int i=productionService.updateBusPrint(conditionMap);
		i=productionService.updateBusConfig(conditionMap);
		if(i>0){
			result.put("success", true);
			result.put("message", "打印成功");
		}else{
			result.put("success", false);
			result.put("message", "打印失败");
		}
		model.addAllAttributes(result);
		return model;
	}
	/**等待工时维护*/
	@RequestMapping("/waitWorkTimeMtn")
	public ModelAndView waitWorkTimeMtn(){
		mv.setViewName("production/waitWorkTimeMtn");
		return mv;
	}
	/**
	 * 员工工时查询
	 * @return
	 */
	@RequestMapping("/getWaitWorkTimeList")
	@ResponseBody
	public ModelMap getWaitWorkTimeList(){
		String conditions=request.getParameter("conditions");
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		Map<String,Object> list = productionService.getWaitWorkTimeList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/saveWaitWorkTimeInfo")
	@ResponseBody
	public ModelMap saveWaitWorkTimeInfo(){
		String conditions=request.getParameter("conditions");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String user_name=String.valueOf(session.getAttribute("user_name"));
		
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<Map<String,Object>> swh_list=new ArrayList<Map<String,Object>>();
		for(int i=0;i<jsonArray.size();i++){
			JSONObject object = (JSONObject)jsonArray.get(i);		
			object.put("editor", user_name);
			object.put("edit_date", curTime);
			Map<String, Object> map = (Map<String, Object>) object;
			swh_list.add(map);
		}
		int i=0;		
		i=productionService.saveWaitWorkHourInfo(swh_list);
		Map<String, Object> result = new HashMap<String, Object>();
		
		if(i>0){
			Map<String,Map<String,Object>> taskMap=getWaitWorkTimeMap(swh_list,"");
			commonService.createTask("等待工时审核",taskMap);
			result.put("success", true);
			result.put("message","保存成功");
		}else{
			result.put("success", false);
			result.put("message","保存失败");
		}		
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	public Map<String,Map<String,Object>> getWaitWorkTimeMap(List<Map<String,Object>> swh_list,String flag){
		String factory_id=String.valueOf(session.getAttribute("factory_id"));
		// Map<工厂代码_车间名称,Map<String,Object>>
		BmsBaseFactory bmsBaseFactory=settingService.getFactoryById(factory_id);
		String factory_code=bmsBaseFactory.getFactoryCode();
		Map<String,Map<String,Object>> taskMap=new HashMap<String,Map<String,Object>>();
		Map<String,Object> paramMap=null;
		for(Map<String,Object> swh_map : swh_list){
			String factory=(String)swh_map.get("factory");
			String workshop=(String)swh_map.get("workshop");
			String key=factory_code+"_"+workshop;
			if(taskMap.containsKey(key)){
				Integer count=(Integer)taskMap.get(key).get("count")+1;
				taskMap.get(key).put("count", count);
			}else{
				String paramval="?factory="+factory+"&workshop="+workshop+"&status=0";
				if(flag.equals("reject")){
					paramval="?factory="+factory+"&workshop="+workshop+"&status=2";
				}
				paramMap=new HashMap<String,Object>();
				paramMap.put("param", paramval);
				paramMap.put("count", 1);
				taskMap.put(key, paramMap);
			}
		}
		return taskMap;
	}
	/**等待工时修改*/
	@RequestMapping("/waitWorkTimeMod")
	public ModelAndView waitWorkTimeMod(){
		mv.setViewName("production/waitWorkTimeMod");
		return mv;
	}
	/**
	 * 删除工时信息
	 * @return
	 */
	@RequestMapping("/deleteWaitWorkTimeInfo")
	@ResponseBody
	public ModelMap deleteWaitWorkTimeInfo(){
		Map<String,Object> result=new HashMap<String,Object>();
		String conditions=request.getParameter("conditions");
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		Map map=productionService.getWaitWorkTimeList(conditionMap);
		// Map<车间,任务数>
		List<Map<String,Object>> swh_list=new ArrayList<Map<String,Object>>();
		List list=(List) map.get("data");
		for(Object object : list){
			Map obj=(Map)object;
			swh_list.add(obj);
		}
		int i=productionService.deleteWaitHourInfo(conditionMap);
		if(i>0){
			Map<String,Map<String,Object>> taskMap=getWaitWorkTimeMap(swh_list,"");
			commonService.updateTask("等待工时修改",taskMap);
			result.put("success", true);
		    result.put("message", "删除成功");
		}else{
			result.put("success", false);
		    result.put("message", "系统异常！删除失败");
		}
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping("/updateWaitWorkTimeInfo")
	@ResponseBody
	public ModelMap updateWaitWorkTimeInfo(){
		String conditions=request.getParameter("conditions");
		String flag=request.getParameter("flag");
		String factory_id=String.valueOf(session.getAttribute("factory_id"));
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String user_name=String.valueOf(session.getAttribute("user_name"));
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<Map<String,Object>> swh_list=new ArrayList<Map<String,Object>>();
		for(int i=0;i<jsonArray.size();i++){
			 JSONObject object = (JSONObject)jsonArray.get(i);	
			 if(object.get("status").toString().equals("1")){
				 object.put("approver", user_name);
				 object.put("approve_date", curTime);
			 }else{
				 object.put("wpay", "");
				 object.put("editor", user_name);
				 object.put("edit_date", curTime);
			 }
			 
			Map<String, Object> map = (Map<String, Object>) object;
			swh_list.add(map);
		}
		int i=0;		
		i=productionService.batchUpdateWaitPay(swh_list);
		Map<String, Object> result = new HashMap<String, Object>();
		if(i>0){
			if(flag.equals("modify")){
				Map<String,Map<String,Object>> taskMap=getWaitWorkTimeMap(swh_list,"");
				commonService.createTask("等待工时审核",taskMap);
				commonService.updateTask("等待工时修改",taskMap);
			}
            if(flag.equals("verify")){
            	Map<String,Map<String,Object>> taskMap=getWaitWorkTimeMap(swh_list,"");
            	commonService.updateTask("等待工时审核",taskMap);			
            }
			if(flag.equals("reject")){
				Map<String,Map<String,Object>> taskMap=getWaitWorkTimeMap(swh_list,flag);
				commonService.createTask("等待工时修改",taskMap);
				commonService.updateTask("等待工时审核",taskMap);
			}
			result.put("success", true);
			result.put("message","操作成功");
		}else{
			result.put("success", false);
			result.put("message","操作失败");
		}		
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	/**等待工时审核*/
	@RequestMapping("/waitWorkTimeVerify")
	public ModelAndView waitWorkTimeVerify(){
		mv.setViewName("production/waitWorkTimeVerify");
		return mv;
	}
	/**临时派工类型*/
	@RequestMapping("/tmpOrderType")
	public ModelAndView tmpOrderType(){
		mv.setViewName("production/tmpOrderType");
		return mv;
	}
	@RequestMapping("/getTmpOrderTypeList")
	@ResponseBody
	public ModelMap getTmpOrderTypeList(){
		String name=request.getParameter("name");
		String cost_transfer=request.getParameter("cost_transfer");
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("name",name);
		conditionMap.put("cost_transfer",cost_transfer);
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> list = productionService.getTmpOrderTypeList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/addTmpOrderType")
	@ResponseBody
	public ModelMap addTmpOrderType() {
		try {
			String name = request.getParameter("name");
			String cost_transfer = request.getParameter("cost_transfer");
			String editor_id = request.getSession().getAttribute("user_id") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("name", name);
			Map<String,Object> tmpOrderTypeMap = productionService.getTmpOrderTypeList(map);
			if((int)tmpOrderTypeMap.get("recordsTotal")>0){
				String message = name+" 已存在";
				map.put("message", message);
				model.addAllAttributes(map);
				return model;
			}
			map.put("cost_transfer", cost_transfer);
			map.put("editor", editor_id);
			map.put("edit_date", edit_date);

			int reuslt = productionService.insertTmpOrderType(map);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
 
	@RequestMapping("/editTmpOrderType")
	@ResponseBody
	public ModelMap editTmpOrderType() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			String name = request.getParameter("name");
			String cost_transfer = request.getParameter("cost_transfer");
			String editor_id = request.getSession().getAttribute("user_id") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("id", id);
			map.put("name", name);
			map.put("cost_transfer", cost_transfer);
			map.put("editor", editor_id);
			map.put("edit_date", edit_date);
			productionService.editTmpOrderType(map);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteTmpOrderType")
	@ResponseBody
	public ModelMap deleteTmpOrderType() {
		try {
			String ids = request.getParameter("ids");
			List<String> idlist = new ArrayList<String>();
			for(String id : ids.split(",")){
				idlist.add(id);
			}
			productionService.delTmpOrderType(idlist);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	/**额外工时库维护*/
	@RequestMapping("/extraWorkHourManager")
	public ModelAndView extraWorkHourManager(){
		mv.setViewName("production/extraWorkHourManager");
		return mv;
	}
	/**额外工时库查询*/
	@RequestMapping("/getExtraWorkHourManagerList")
	@ResponseBody
	public ModelMap getExtraWorkHourManagerList(){
		String bus_type=request.getParameter("bus_type");
		String order_no=request.getParameter("order_no");
		String order_type=request.getParameter("order_type");
		String reason_content=request.getParameter("reason_content");
		int draw=Integer.parseInt(request.getParameter("draw")); 
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("bus_type",bus_type);
		conditionMap.put("order_no",order_no);
		conditionMap.put("order_type",order_type);
		conditionMap.put("reason_content",reason_content);
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> list = productionService.getExtraWorkHourManagerList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping(value="/uploadExtraWorkHourManager",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadExtraWorkHourManager(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName="extraWorkHourManager.xls";
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String editor_id = request.getSession().getAttribute("user_id") + "";
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("2", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("3", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("4", ExcelModel.CELL_TYPE_DATE);
		dataType.put("5", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("5", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("6", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("7", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("8", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("9", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("10", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("11", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("12", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("13", ExcelModel.CELL_TYPE_CANNULL);
		excelModel.setDataType(dataType);
		excelModel.setPath(fileName);
		File tempfile=new File(fileName);
		file.transferTo(tempfile);
		/**
		 * 读取输入流中的excel文件，并且将数据封装到ExcelModel对象中
		 */
		InputStream is = new FileInputStream(tempfile);

		ExcelTool excelTool = new ExcelTool();
		excelTool.readExcel(is, excelModel);

		List<Map<String, Object>> addList = new ArrayList<Map<String, Object>>();
		boolean saveFlag=true;
		String result="";
		for (Object[] data : excelModel.getData()) {
			Map<String, Object> infomap = new HashMap<String, Object>();

			infomap.put("tmp_order_type", data[0] == null ? null : data[0].toString().trim());
			if(data[0] != null){
				if(data[0].toString().trim().length()==0){
					saveFlag=false;
					result =" 额外工时类型不能为空";
					break;
				}
				Map<String, Object> querymap = new HashMap<String, Object>();
				querymap.put("name",data[0].toString().trim());
				Map<String,Object> tmpOrderTypeMap=productionService.getTmpOrderTypeList(querymap);
				if((int)tmpOrderTypeMap.get("recordsTotal")==0){
					saveFlag=false;
					result ="额外工时类型"+ data[0].toString().trim()+"没有维护";
					break;
				}
				
			}else{
				saveFlag=false;
				result ="额外工时类型不能为空";
				break;
			}
			infomap.put("no", data[1] == null ? null : data[1].toString().trim());
			infomap.put("order_no", data[2] == null ? null : data[2].toString().trim());
			if(data[2] != null){
				Map<String, Object> querymap = new HashMap<String, Object>();
				querymap.put("orderNo",data[2].toString().trim());
				Map<String,Object> orderMap=orderService.getOrderByNo(querymap);
				if(orderMap==null){
					saveFlag=false;
					result = data[2].toString().trim()+" 订单号不存在";
					break;
				}
			}
			if(data[3] != null){
				Map<String, Object> querymap = new HashMap<String, Object>();
				querymap.put("busTypeCode",data[3].toString().trim());
				Map<String,Object> bustypeMap=settingService.getBusTypeList(querymap);
				if((int)bustypeMap.get("recordsTotal")==0){
					saveFlag=false;
					result = data[3].toString().trim()+" 车型不存在";
					break;
				}
			}
			infomap.put("bus_type", data[3] == null ? null : data[3].toString().trim());
			
			infomap.put("time", data[4] == null ? null : data[4].toString().trim());
			infomap.put("tmp_name", data[5] == null ? null : data[5].toString().trim());
			infomap.put("reason_content", data[6] == null ? null : data[6].toString().trim());
			infomap.put("description", data[7] == null ? null : data[7].toString().trim());
			infomap.put("single_hour", data[8] == null ? null : data[8].toString().trim());
			infomap.put("assesor", data[9] == null ? null : data[9].toString().trim());
			infomap.put("assess_verifier", data[10] == null ? null : data[10].toString().trim());
			infomap.put("duty_unit", data[11] == null ? null : data[11].toString().trim());
			infomap.put("order_type", data[12] == null ? null : data[12].toString().trim());
			infomap.put("memo", data[13] == null ? null : data[13].toString().trim());
			addList.add(infomap);
		}
		if(saveFlag){
			int returnVal=productionService.insertExtraWorkHourManager(addList);
		    if(returnVal==1){
		    	initModel(true,"导入成功！",addList);
		    }else{
		    	initModel(false,"导入失败！",null);
		    }
		}else{
			initModel(false,result,null);
		}
		
		
		}catch(Exception e){
			initModel(false,"导入失败！",null);
		}
		return mv.getModelMap();
	}
	@RequestMapping("/editExtraWorkHourManager")
	@ResponseBody
	public ModelMap editExtraWorkHourManager() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("id", id);
			map.put("tmp_order_type",request.getParameter("tmp_order_type"));
			map.put("no",request.getParameter("no"));
			map.put("order_no", request.getParameter("order_no"));
			map.put("bus_type", request.getParameter("bus_type"));
			map.put("time", request.getParameter("time"));
			map.put("tmp_name", request.getParameter("tmp_name"));
			map.put("reason_content", request.getParameter("reason_content"));
			map.put("description",request.getParameter("description"));
			map.put("single_hour", request.getParameter("single_hour"));
			map.put("assesor", request.getParameter("assesor"));
			map.put("assess_verifier",request.getParameter("assess_verifier"));
			map.put("duty_unit",request.getParameter("duty_unit"));
			map.put("order_type",request.getParameter("order_type"));
			map.put("memo",request.getParameter("memo"));
			productionService.editExtraWorkHourManager(map);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteExtraWorkHourManager")
	@ResponseBody
	public ModelMap deleteExtraWorkHourManager() {
		try {
			String ids = request.getParameter("ids");
			List<String> idlist = new ArrayList<String>();
			for(String id : ids.split(",")){
				idlist.add(id);
			}
			productionService.delExtraWorkHourManager(idlist);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	/**创建临时派工单*/
	@RequestMapping("/createTmpOrder")
	public ModelAndView createTmpOrder(){
		mv.setViewName("production/createTmpOrder");
		return mv;
	}
	@RequestMapping("/getCreateTmpOrderList")
	@ResponseBody
	public ModelMap getCreateTmpOrderList(){
		String tmp_order_no=request.getParameter("tmp_order_no");
		String status=request.getParameter("status");
		String apply_date_start=request.getParameter("apply_date_start");
		String apply_date_end=request.getParameter("apply_date_end");
		int draw=Integer.parseInt(request.getParameter("draw")); 
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("tmp_order_no",tmp_order_no);
		conditionMap.put("status",status);
		conditionMap.put("factory",factory);
		conditionMap.put("workshop",workshop);
		conditionMap.put("apply_date_start",apply_date_start);
		conditionMap.put("apply_date_end",apply_date_end);
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> list = productionService.getCreateTmpOrderList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/addCreateTmpOrder")
	@ResponseBody
	public ModelMap addCreateTmpOrder() {
		model.clear();
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			String editor_id = request.getSession().getAttribute("user_id") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("order_launcher", request.getParameter("order_launcher"));
			map.put("factory",  request.getParameter("factory"));
			map.put("workshop",  request.getParameter("workshop"));
			map.put("head_launch_unit",  request.getParameter("head_launch_unit"));
			map.put("acceptor",  request.getParameter("acceptor"));
			map.put("reason_content",  request.getParameter("reason_content"));
			map.put("total_qty",  request.getParameter("total_qty"));
			map.put("order_type",  request.getParameter("order_type"));
			map.put("duty_unit",  request.getParameter("duty_unit"));
			map.put("labors",  request.getParameter("labors"));
			map.put("single_hour",  request.getParameter("single_hour"));
			map.put("total_hours",  request.getParameter("total_hours"));
			map.put("assess_verifier",  request.getParameter("assess_verifier"));
			map.put("is_cost_transfer",  request.getParameter("is_cost_transfer"));
			map.put("cost_unit_signer",  request.getParameter("cost_unit_signer"));
			map.put("order_serial_no",  request.getParameter("order_serial_no"));
			map.put("sap_order",  request.getParameter("sap_order"));
			map.put("assesor",  request.getParameter("assesor"));
			map.put("tmp_order_no",  request.getParameter("tmp_order_no"));
			map.put("applier", editor_id);
			map.put("apply_date", edit_date);

			int reuslt = productionService.insertCreateTmpOrder(map);
			if(reuslt>0){
				resultMap.put("success", true);
				resultMap.put("message", "保存成功");
			}else{
				resultMap.put("success", false);
				resultMap.put("message", "保存失败");
			}
			model.addAllAttributes(resultMap);
			
		} catch (Exception e) {
			resultMap.put("success", false);
			resultMap.put("message", e.getMessage());
		}
		return model;
	}
	@RequestMapping("/editCreateTmpOrder")
	@ResponseBody
	public ModelMap editCreateTmpOrder() {
		model.clear();
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			String editor_id = request.getSession().getAttribute("user_id") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("id", request.getParameter("id"));
			map.put("order_launcher", request.getParameter("order_launcher"));
			map.put("factory",  request.getParameter("factory"));
			map.put("workshop",  request.getParameter("workshop"));
			map.put("head_launch_unit",  request.getParameter("head_launch_unit"));
			map.put("acceptor",  request.getParameter("acceptor"));
			map.put("reason_content",  request.getParameter("reason_content"));
			map.put("total_qty",  request.getParameter("total_qty"));
			map.put("order_type",  request.getParameter("order_type"));
			map.put("duty_unit",  request.getParameter("duty_unit"));
			map.put("labors",  request.getParameter("labors"));
			map.put("single_hour",  request.getParameter("single_hour"));
			map.put("total_hours",  request.getParameter("total_hours"));
			map.put("assess_verifier",  request.getParameter("assess_verifier"));
			map.put("is_cost_transfer",  request.getParameter("is_cost_transfer"));
			map.put("cost_unit_signer",  request.getParameter("cost_unit_signer"));
			map.put("order_serial_no",  request.getParameter("order_serial_no"));
			map.put("sap_order",  request.getParameter("sap_order"));
			map.put("assesor",  request.getParameter("assesor"));
			map.put("tmp_order_no",  request.getParameter("tmp_order_no"));

			int returnVal = productionService.editCreateTmpOrder(map);
			if(returnVal>0){
				resultMap.put("success", true);
				resultMap.put("message", "编辑成功");
			}else{
				resultMap.put("success", false);
				resultMap.put("message", "编辑失败");
			}
			model.addAllAttributes(resultMap);
			
		} catch (Exception e) {
			resultMap.put("success", false);
			resultMap.put("message", e.getMessage());
		}
		return model;
	}
	
	@RequestMapping("/showTmpOrderDetail")
	@ResponseBody
	public ModelMap showTmpOrderDetail() {
		try {
			String temp_order_id = request.getParameter("temp_order_id");
			String tmp_order_no = request.getParameter("tmp_order_no");
			Map<String,Object> result=new HashMap<String,Object>();
			Map<String,Object> queryMap=new HashMap<String,Object>();
			queryMap.put("temp_order_id", temp_order_id);
			queryMap.put("tmp_order_no", tmp_order_no);
			Map tmpOrderMap=productionService.getCreateTmpOrderList(queryMap);
			List<Map<String,Object>> tmpOrderProcedureList=
					productionService.queryTmpOrderProcedureList(queryMap);
			List<Map<String,Object>> assignList=productionService.queryAssignList(queryMap);
			List<Map<String, String>> staffTmpHoursList=productionService.queryStaffTmpHours(queryMap);
			result.put("tmpOrderMap", tmpOrderMap);
			result.put("tmpOrderProcedureList", tmpOrderProcedureList);
			result.put("assignList", assignList);
			result.put("staffTmpHoursList", staffTmpHoursList);
			model.addAllAttributes(result);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		return model;
	}
	@RequestMapping("/delCreateTmpOrder")
	@ResponseBody
	public ModelMap delCreateTmpOrder() {
		model.clear();
		Map<String,Object> map=new HashMap<String,Object>();
		try {
			String id = request.getParameter("id");
			int result=productionService.delCreateTmpOrder(id);
			if(result>0){
				map.put("success", true);
				map.put("message", "删除成功");
			}else{
				map.put("success", false);
				map.put("message", "删除失败");
			}
			model.addAllAttributes(map);
			
		} catch (Exception e) {
			map.put("success", false);
			map.put("message", e.getMessage());
		}
		return model;
	}
	/**打印vin号*/
	@RequestMapping("/printVin")
	public ModelAndView printVin(){
		mv.setViewName("production/printVin");
		return mv;
	}
	/**临时派工单查询*/
	@RequestMapping("/queryTmpOrder")
	public ModelAndView queryTmpOrder(){
		mv.setViewName("production/queryTmpOrder");
		return mv;
	}
	@RequestMapping("/queryTmpOrderList")
	@ResponseBody
	public ModelMap queryTmpOrderList(){
		String tmp_order_no=request.getParameter("tmp_order_no");
		String status=request.getParameter("status");
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String reason_content=request.getParameter("reason_content");
		String apply_date_start=request.getParameter("apply_date_start");
		String apply_date_end=request.getParameter("apply_date_end");
		int draw=Integer.parseInt(request.getParameter("draw")); 
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("tmp_order_no",tmp_order_no);
		conditionMap.put("status",status);
		conditionMap.put("factory",factory);
		conditionMap.put("workshop",workshop);
		conditionMap.put("reason_content",reason_content);
		conditionMap.put("apply_date_start",apply_date_start);
		conditionMap.put("apply_date_end",apply_date_end);
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> list = productionService.queryTmpOrderList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	/****************************  TANGJIN ***************************/
	
	/****************************  THW ***************************/
	/**
	 * 车间奖惩导入
	 * @return
	 */
	@RequestMapping("/rewardsIndex")
	public ModelAndView rewardsIndex(){
		mv.setViewName("production/rewardsMtn");
		return mv;
	}
	/**
	 * 查询监控工序下拉列表
	 * @return
	 */
	@RequestMapping("/addRewards")
	@ResponseBody
	public ModelMap addRewards(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		
		List<Map<String, Object>> addList = new ArrayList<Map<String,Object>>();
		Map<String, Object> rewardsInfo = new HashMap<String, Object>();
		rewardsInfo.put("staff_number", request.getParameter("staff_number"));
		rewardsInfo.put("rewards_factory", request.getParameter("rewards_factory"));
		rewardsInfo.put("rewards_workshop", request.getParameter("rewards_workshop"));
		rewardsInfo.put("rewards_date", request.getParameter("rewards_date"));
		rewardsInfo.put("reasons", request.getParameter("reasons"));
		rewardsInfo.put("deduct", request.getParameter("deduct"));
		rewardsInfo.put("add", request.getParameter("add"));
		rewardsInfo.put("group_leader", request.getParameter("group_leader"));
		rewardsInfo.put("gaffer", request.getParameter("gaffer"));
		rewardsInfo.put("proposer", request.getParameter("proposer"));
		rewardsInfo.put("editor_id", userid);
		rewardsInfo.put("edit_date", curTime);
		addList.add(rewardsInfo);
		
		model=new ModelMap();
		model.put("data", productionService.addRewards(addList));
		return model;
	}
	
	@RequestMapping("/getRewardsList")
	@ResponseBody
	public ModelMap getRewardsList() {
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):20;	//每一页数据条数
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		conditionMap.put("staff_number", request.getParameter("staff_number"));
		conditionMap.put("rewards_factory", request.getParameter("factory"));
		conditionMap.put("rewards_workshop", request.getParameter("workshop"));
		conditionMap.put("rewards_date", request.getParameter("rewards_date"));
		
		Map<String, Object> selectList = productionService.getRewardsList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(selectList);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteRewards")
	@ResponseBody
	public ModelMap deleteRewards() {
		try {
			String ids = request.getParameter("ids");
			Map map = new HashMap();
			map.put("ids", ids);
			productionService.deleteRewards(map);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/uploadRewards",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadRewards(@RequestParam(value="file",required=false) MultipartFile file){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		
		int insert = 0;
		String result = "";
		
		String fileFileName = "uploadRewards.xls";
		//int result = 0;
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
		dataType.put("6", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("7", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("8", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("9", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("10", ExcelModel.CELL_TYPE_CANNULL);
		excelModel.setDataType(dataType);
		excelModel.setPath(fileFileName);
		
		try {
			File staffFile = new File(fileFileName);
			file.transferTo(staffFile);
			InputStream is = new FileInputStream(staffFile);
			ExcelTool excelTool = new ExcelTool();
			excelTool.readExcel(is, excelModel);
			
			if(excelModel.getData().size()>500){
				initModel(false,"不能同时导入500条以上数据！",null);
				model = mv.getModelMap();
				return model;
			}else{
				List<Map<String, Object>> addList = new ArrayList<Map<String,Object>>();
				StringBuffer staff_numbers = new StringBuffer();
				boolean success = true;
				int i = 1;
				List<Map<String, Object>> queryOrgList = new ArrayList<Map<String,Object>>();
				for(Object[] data : excelModel.getData()){
					++i;
					if(null == data[0] || StringUtils.isBlank(data[0].toString().trim())){
						success = false;
						result = result+"第"+i+"行工号信息为必填项！\n";
					}else{
						staff_numbers.append(data[0].toString().trim());
						staff_numbers.append(",");
					}
					if(null == data[2] || StringUtils.isBlank(data[2].toString().trim()) || 
							null == data[3] || StringUtils.isBlank(data[3].toString().trim()) || 
							null == data[4] || StringUtils.isBlank(data[4].toString().trim())){
						success = false;
						result = result+"第"+i+"行奖惩工厂、奖惩车间、奖惩日期信息为必填项！\n";
					}
					if((null == data[6] || StringUtils.isBlank(data[6].toString().trim())) &&
							(null == data[7] || StringUtils.isBlank(data[7].toString().trim())) ){
						success = false;
						result = result+"第"+i+"行扣分、奖励至少需要填写一个值！\n";
					}
					Map queryOrgMap = new HashMap<String, Object>();
					if(null!=data[2] && !"".equals(data[2].toString().trim())){
						queryOrgMap.put("plant", data[2]==null?null:data[2].toString());
					}
					if(null!=data[3] && !"".equals(data[3].toString().trim())){
						queryOrgMap.put("workshop", data[3]==null?null:data[3].toString());
					}
					
					queryOrgList.add(queryOrgMap);
					
					Map<String, Object> rewardsInfo = new HashMap<String, Object>();
					rewardsInfo.put("staff_number", data[0] == null?null:data[0].toString().trim());
					rewardsInfo.put("rewards_factory", data[2] == null?null:data[2].toString().trim());
					rewardsInfo.put("rewards_workshop", data[3] == null?null:data[3].toString().trim());
					rewardsInfo.put("rewards_date", data[4] == null?null:data[4].toString().trim());
					rewardsInfo.put("reasons", data[5] == null?null:data[5].toString().trim());
					rewardsInfo.put("deduct", data[6] == null?null:data[6].toString().trim());
					rewardsInfo.put("add", data[7] == null?null:data[7].toString().trim());
					rewardsInfo.put("group_leader", data[8] == null?null:data[8].toString().trim());
					rewardsInfo.put("gaffer", data[9] == null?null:data[9].toString().trim());
					rewardsInfo.put("proposer", data[10] == null?null:data[10].toString().trim());
					rewardsInfo.put("editor_id", userid);
					rewardsInfo.put("edit_date", curTime);
					addList.add(rewardsInfo);
				}
				//校验员工信息
				Map<String, Object> conditionMap = new HashMap<String, Object>();
				conditionMap.put("staff_number", staff_numbers.toString().trim());
				conditionMap.put("status", "在职");
				Map<String,Object> staff_info = settingService.getStaffList(conditionMap);
				List<Map<String,Object>> staff_list = (List<Map<String,Object>>)staff_info.get("rows");
				String[] staffArray=staff_numbers.toString().split(",");
				for(int ii=0;ii<=staffArray.length-1;ii++){
					boolean flag=true;
					String hrStaff_status="在职";
					for(int j=0;j<=staff_list.size()-1;j++){
						if(staffArray[ii].equals(staff_list.get(j).get("staff_number"))){
							flag=false;
							hrStaff_status= (String)staff_list.get(j).get("status");
							break;
						}
					}
					if(flag){
						success = false;
						result = result+"工号为："+staffArray[ii]+"的员工不存在！！\n";
					}
					if(hrStaff_status.equals("离职")){
						success = false;
						result = result+"工号为："+staffArray[ii]+"的员工已离职！！\n";
					}
					
				}
				
				//根据用户填写的组织结构信息查询bms_base_org表
				List<Map<String, Object>> orgResultList = productionService.getOrg(queryOrgList);
				int j=1;
				for(Object[] data : excelModel.getData()){
					++j;
					String rewards_factory = data[2].toString().trim();
					String rewards_workshop = data[3].toString().trim();
					Map <String, Object> orgMap = new HashMap<String, Object>();
					orgMap.put("plant", rewards_factory);
					orgMap.put("workshop", rewards_workshop);
					if(orgResultList.indexOf(orgMap)<0){
						success = false;
						result = result+"第"+j+"行填写的惩工厂、奖惩车间信息与组织结构不符！\n";
					}
				}
				if(success){
					insert = productionService.insertRewards(addList);
				}
				
			}
		
		} catch (Exception e) {
			e.printStackTrace();
			initModel(false,"导入文件的格式有误！",null);
			model = mv.getModelMap();
			return model;
		}
		if(insert>0){
			result ="车间奖惩导入成功！";
		}
		initModel(true,result,null);
		model = mv.getModelMap();
		return model;
	}
	
	/**
	 * 考勤导入
	 * @return
	 */
	@RequestMapping("/attendanceIndex")
	public ModelAndView attendanceIndex(){
		mv.setViewName("production/attendanceMtn");
		return mv;
	}
	
	@RequestMapping("/getAttendanceList")
	@ResponseBody
	public ModelMap getAttendanceList() {
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):20;	//每一页数据条数
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		conditionMap.put("staff_number", request.getParameter("staff_number"));
		conditionMap.put("factory", request.getParameter("factory"));
		conditionMap.put("workshop", request.getParameter("workshop"));
		conditionMap.put("workgroup", request.getParameter("workgroup"));
		conditionMap.put("team", request.getParameter("team"));		
		conditionMap.put("month", request.getParameter("month"));
		
		Map<String, Object> selectList = productionService.getAttendanceList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(selectList);
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/uploadAttendance",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadAttendance(@RequestParam(value="file",required=false) MultipartFile file){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		
		String result = "";
		boolean success =true;
		
		int error=0; //定义一个错误类型；
		int lineCount=1; //表格数据行
		int staffIndex=-1;
		
		String fileFileName = "uploadAttendance.xls";
		//int result = 0;
		ExcelModel excelModel =new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String,Integer> dataType = new HashMap<String,Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_STRING);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("4", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("5", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("6", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("7", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("8", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("9", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("10", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("11", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("12", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("13", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("14", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("15", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("16", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("17", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("18", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("19", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("20", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("21", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("22", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("23", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("24", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("25", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("26", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("27", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("28", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("29", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("30", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("31", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("32", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("33", ExcelModel.CELL_TYPE_CANNULL);
		excelModel.setDataType(dataType);
		excelModel.setPath(fileFileName);
		
		try {
			File staffFile = new File(fileFileName);
			file.transferTo(staffFile);
			InputStream is = new FileInputStream(staffFile);
			ExcelTool excelTool = new ExcelTool();
			excelTool.readExcel(is, excelModel);
			
			if(excelModel.getData().size()>500){
				initModel(false,"不能同时导入500条以上数据！",null);
				model = mv.getModelMap();
				return model;
			}else{
						List<Map<String, Object>> addList = new ArrayList<Map<String,Object>>();
						
						String month = excelModel.getData().get(0)[2].toString().trim().substring(0,7);
						logger.info("---->month: " + month);
						StringBuffer staff_numbers = new StringBuffer();
						//解析并封装数据
						for(Object[] data : excelModel.getData()){
							if(null != data[0] && StringUtils.isNotBlank(data[0].toString().trim())){
								String staff_number = data[0].toString().trim(); 
								staff_numbers.append(staff_number);
								staff_numbers.append(",");
							}
							Map<String, Object> attendanceInfo = new HashMap<String, Object>();
							attendanceInfo.put("staff_number", data[0] == null?"0":data[0].toString().trim());
							attendanceInfo.put("month", month);
							attendanceInfo.put("D1", data[3] == null?"0":data[3].toString().trim() == ""?"0":data[3].toString().trim());
							attendanceInfo.put("D2", data[4] == null?"0":data[4].toString().trim()== ""?"0":data[4].toString().trim());
							attendanceInfo.put("D3", data[5] == null?"0":data[5].toString().trim()== ""?"0":data[5].toString().trim());
							attendanceInfo.put("D4", data[6] == null?"0":data[6].toString().trim()== ""?"0":data[6].toString().trim());
							attendanceInfo.put("D5", data[7] == null?"0":data[7].toString().trim()== ""?"0":data[7].toString().trim());
							attendanceInfo.put("D6", data[8] == null?"0":data[8].toString().trim()== ""?"0":data[8].toString().trim());
							attendanceInfo.put("D7", data[9] == null?"0":data[9].toString().trim()== ""?"0":data[9].toString().trim());
							attendanceInfo.put("D8", data[10] == null?"0":data[10].toString().trim()== ""?"0":data[10].toString().trim());
							attendanceInfo.put("D9", data[11] == null?"0":data[11].toString().trim()== ""?"0":data[11].toString().trim());
							attendanceInfo.put("D10", data[12] == null?"0":data[12].toString().trim()== ""?"0":data[12].toString().trim());
							attendanceInfo.put("D11", data[13] == null?"0":data[13].toString().trim()== ""?"0":data[13].toString().trim());
							attendanceInfo.put("D12", data[14] == null?"0":data[14].toString().trim()== ""?"0":data[14].toString().trim());
							attendanceInfo.put("D13", data[15] == null?"0":data[15].toString().trim()== ""?"0":data[15].toString().trim());
							attendanceInfo.put("D14", data[16] == null?"0":data[16].toString().trim()== ""?"0":data[16].toString().trim());
							attendanceInfo.put("D15", data[17] == null?"0":data[17].toString().trim()== ""?"0":data[17].toString().trim());
							attendanceInfo.put("D16", data[18] == null?"0":data[18].toString().trim()== ""?"0":data[18].toString().trim());
							attendanceInfo.put("D17", data[19] == null?"0":data[19].toString().trim()== ""?"0":data[19].toString().trim());
							attendanceInfo.put("D18", data[20] == null?"0":data[20].toString().trim()== ""?"0":data[20].toString().trim());
							attendanceInfo.put("D19", data[21] == null?"0":data[21].toString().trim()== ""?"0":data[21].toString().trim());
							attendanceInfo.put("D20", data[22] == null?"0":data[22].toString().trim()== ""?"0":data[22].toString().trim());
							attendanceInfo.put("D21", data[23] == null?"0":data[23].toString().trim()== ""?"0":data[23].toString().trim());
							attendanceInfo.put("D22", data[24] == null?"0":data[24].toString().trim()== ""?"0":data[24].toString().trim());
							attendanceInfo.put("D23", data[25] == null?"0":data[25].toString().trim()== ""?"0":data[25].toString().trim());
							attendanceInfo.put("D24", data[26] == null?"0":data[26].toString().trim()== ""?"0":data[26].toString().trim());
							attendanceInfo.put("D25", data[27] == null?"0":data[27].toString().trim()== ""?"0":data[27].toString().trim());
							attendanceInfo.put("D26", data[28] == null?"0":data[28].toString().trim()== ""?"0":data[28].toString().trim());
							attendanceInfo.put("D27", data[29] == null?"0":data[29].toString().trim()== ""?"0":data[29].toString().trim());
							attendanceInfo.put("D28", data[30] == null?"0":data[30].toString().trim()== ""?"0":data[30].toString().trim());
							attendanceInfo.put("D29", data[31] == null?"0":data[31].toString().trim()== ""?"0":data[31].toString().trim());
							attendanceInfo.put("D30", data[32] == null?"0":data[32].toString().trim()== ""?"0":data[32].toString().trim());
							attendanceInfo.put("D31", data[33] == null?"0":data[33].toString().trim()== ""?"0":data[33].toString().trim());
							
							int attendance_days = 0;
							float attendance_hours = 0;
							for(int i=3;i<=33;i++){
								if(!"0".equals(data[i])&&data[i]!=null&&StringUtils.isNotEmpty(data[i].toString().trim())){
									attendance_days++;
									attendance_hours+=Float.valueOf(data[i].toString().trim());
								}
							}
							attendanceInfo.put("attendance_days", attendance_days);
							attendanceInfo.put("attendance_hours", attendance_hours);
							attendanceInfo.put("editor_id",userid);
							attendanceInfo.put("edit_date",curTime);
							addList.add(attendanceInfo);
						}
						/*
						 * 数据校验
						 */
						Map<String, Object> conditionMap = new HashMap<String, Object>();
						conditionMap.put("month", month);
						conditionMap.put("staff_number", staff_numbers.toString().trim());
						conditionMap.put("status", "在职");
						String[] staffArray=staff_numbers.toString().split(",");
						for(int i=0;i<staffArray.length-1;i++){
							lineCount=i+2;
							for(int j=i+1;j<=staffArray.length-1;j++){
								if(staffArray[i].equals(staffArray[j])){
									success = false;
									staffIndex=j+2;
									error=3;                 //员工数据重复类型
									throw new Exception();
								}
							}
						}
						
						Map<String,Object> staff_info = settingService.getStaffList(conditionMap);
						List<Map<String,Object>> staff_list = (List<Map<String,Object>>)staff_info.get("rows");
						for(int i=0;i<=staffArray.length-1;i++){
							boolean flag=true;
							String hrStaff_status="在职";
							for(int j=0;j<=staff_list.size()-1;j++){
								if(staffArray[i].equals(staff_list.get(j).get("staff_number"))){
									flag=false;
									hrStaff_status= (String)staff_list.get(j).get("status");
								} 
							}
							if(flag){
								success = false;
								lineCount=i+2;
								error=1;                 //员工不存在类型
								throw new Exception();
							}else if(hrStaff_status.equals("离职")){
								success = false;
								lineCount=i+2;
								error=2;             //员工已经离职
								throw new Exception();
							}
							
						}
						int insert = 0;
						if(success){
							insert = productionService.uoloadStaffAttendance(addList);
						}
						if(insert>0){
							result ="考勤信息导入成功！";
						}
				}
		
		} catch (Exception e) {
			switch(error){
			  case 0:
				  success = false;
				  result = "考勤信息上传出错："+e.getMessage();
				  e.printStackTrace();
				  break;
			  case 1:
				  success = false;
				  result="第"+lineCount+"行数据有误，该行员工不存在，数据上传失败！";
				  break;
			  case 2:
				  success = false;
				  result="第"+lineCount+"行数据有误，该行员工已经离职，数据上传失败！";
				  break;
			  case 3:
				  success = false;
				  result="第"+staffIndex+"行数据与第"+lineCount+"行数据重复，数据上传失败！";
				  break;
			}
			initModel(false,result,null);
			model = mv.getModelMap();
			return model;
		}
		
		initModel(true,result,null);
		model = mv.getModelMap();
		return model;
	}
	
	/****************************  THW ***************************/
	
	/****************************  Yangke 170731 *****************/
	@RequestMapping("/getTmpOrderList")
	@ResponseBody
	public ModelMap getTmpOrderList(){
		String conditions = request.getParameter("conditions");
		String applier = request.getSession().getAttribute("staff_number") + "";
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator<?> it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		conditionMap.put("applier", applier);
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> result= productionService.getTmpOrderList(conditionMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@RequestMapping("/getTmpOrderListForVerify")
	@ResponseBody
	public ModelMap getTmpOrderListForVerify(){
		String conditions = request.getParameter("conditions");
		String applier = request.getSession().getAttribute("staff_number") + "";
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator<?> it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		conditionMap.put("applier", applier);
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		Map<String,Object> result= productionService.getTmpOrderListForVerify(conditionMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/saveWorkHourInfo")
	@ResponseBody
	public ModelMap saveWorkHourInfo(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String createTime = df.format(new Date());
		String editorId = request.getSession().getAttribute("staff_number") + "";
		String conditions = request.getParameter("conditions");
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<Map<String,Object>> swh_list=new ArrayList<Map<String,Object>>();
		for(int i=0;i<jsonArray.size();i++){
			 JSONObject object = (JSONObject)jsonArray.get(i);		
			 object.put("editorId", editorId);
			 object.put("editDate", createTime);
			Map<String, Object> map = (Map<String, Object>) object;
			swh_list.add(map);
		}
		
		int result = productionService.saveWorkHourInfo(swh_list);	
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("unchecked")
	@RequestMapping("/updateStaffTmpHourInfo")
	@ResponseBody
	public ModelMap updateStaffTmpHourInfo(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String createTime = df.format(new Date());
		String editorId = request.getSession().getAttribute("staff_number") + "";
		String conditions = request.getParameter("conditions");
		String whflag = request.getParameter("whflag");
		String tempOrderStaus = request.getParameter("tempOrderStaus");
		String tempOrderId = request.getParameter("tempOrderId");
		
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<Map<String,Object>> swh_list=new ArrayList<Map<String,Object>>();
		for(int i=0;i<jsonArray.size();i++){
			 JSONObject object = (JSONObject)jsonArray.get(i);
			 //临时派工单状态：0-已评估、1-已完成、2-已驳回 （BMS_PD_TMP_ORDER）
			 if("verify".equals(whflag)){
				 object.put("approver_id", editorId);
				 object.put("approve_date", createTime);
				 object.put("status", "1");
				 object.put("actionType", "verify");
			 }else if("reject".equals(whflag)){
				 object.put("approver_id", editorId);
				 object.put("approve_date", createTime);
				 object.put("status", "2");
				 object.put("actionType", "reject");
			 }else{
				 object.put("editorId", editorId);
				 object.put("status", "0");
				 object.put("editDate", createTime);
			 }
			 Map<String, Object> map = (Map<String, Object>) object;
			 swh_list.add(map);
		}
		Map<String,Object> m=new HashMap<String,Object>();
		m.put("tempOrderId", tempOrderId);
		m.put("auditor", editorId);
		m.put("auditDate", createTime);
		if("verify".equals(tempOrderStaus)){
			productionService.verifyOrder(m);
		}
		if("reject".equals(tempOrderStaus)){
			productionService.rejectOrder(m);
		}
		
		int result = productionService.batchUpdateWorkHour(swh_list);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/caculateSalary")
	@ResponseBody
	public ModelMap caculateSalary(){
		String conditions = request.getParameter("conditions");
		logger.info("---->caculateSalary conditions = " + conditions);
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		productionService.caculateTmpSalary(conditionMap);
		return model;
	}
	
	@RequestMapping("/deleteStaffTmpHourInfo")
	@ResponseBody
	public ModelMap deleteStaffTmpHourInfo(){
		String conditions = request.getParameter("conditions");
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		List<String> idlist=new ArrayList<String>();
		for(int i=0;i<jsonArray.size();i++){
			 JSONObject object = (JSONObject)jsonArray.get(i);
			 idlist.add(object.getString("id"));
		}
		String ids=StringUtils.join(idlist, ",");
		Map<String, Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("ids", ids);
		
		int result = productionService.deleteStaffTmpHourInfo(conditionMap);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/getStaffTmpHours")
	@ResponseBody
	public ModelMap getStaffTmpHours(){
		String conditions = request.getParameter("conditions");
		JSONObject jo = JSONObject.fromObject(conditions);
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		for (Iterator it = jo.keys(); it.hasNext();) {
			String key = (String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		List<Map<String, String>> datalist = productionService.queryStaffTmpHours(conditionMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/updateOrderProcedure")
	@ResponseBody
	public ModelMap updateOrderProcedure(){
		String conditions = request.getParameter("conditions");
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		for(Iterator it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			conditionMap.put(key, jo.get(key));
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String createTime = df.format(new Date());
		String editorId = request.getSession().getAttribute("staff_number") + "";
		conditionMap.put("workDate", createTime);
		conditionMap.put("recorder", editorId);
		
		int result = productionService.saveTmpOrderProcedure(conditionMap);
		Map<String,Object> conditionMap2=new HashMap<String,Object>();
		conditionMap2.put("id", conditionMap.get("orderId"));
		conditionMap2.put("finished_qty", String.valueOf(conditionMap.get("finishedQty")));
		conditionMap2.put("status",conditionMap.get("status"));
		result += productionService.updateTmpOrder(conditionMap2);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	/****************************  Yangke End *********************/
}
