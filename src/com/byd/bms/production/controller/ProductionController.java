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
	/****************************  xiongjianwu start***************************/
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
	 * VIN导入
	 * @return
	 */
	@RequestMapping("/vinInfo")
	public ModelAndView vinInfo(){
		mv.setViewName("production/vinInfo");
		return mv;
	}
	@RequestMapping("/getVinListByProject")
	@ResponseBody
	public ModelMap getVinListByProject(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw")!=null ? request.getParameter("draw") : "1"); 
		int start=Integer.parseInt(request.getParameter("start")!=null ? request.getParameter("start") : "0");
		int length=Integer.parseInt(request.getParameter("length")!=null ? request.getParameter("length") : "-1");
		String project_id=request.getParameter("project_id");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_id", project_id);
		Map<String,Object> result=productionService.getVinList(condMap);
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping(value="/uploadProjectVinInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadProjectVinInfo(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName=file.getOriginalFilename();
		Map<String,Object> condMap=new HashMap<String,Object>();
		String project_id=request.getParameter("project_id");
		condMap.put("project_id", project_id);
		Map<String,Object> result=productionService.getVinList(condMap);
		List<Map<String,Object>> resultList=(List<Map<String, Object>>) result.get("data");
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_STRING);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
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

		List<Map<String, String>> addList = new ArrayList<Map<String, String>>();
		int line=1; 
		for (Object[] data : excelModel.getData()) {
			String errorMessage="";
			Map<String, String> infomap = new HashMap<String, String>();
			infomap.put("project_id",project_id);
			infomap.put("no",data[0].toString().trim());
            if(data[1] != null && !data[1].toString().equals("")){
            	infomap.put("bus_number",data[1].toString().trim());
            	boolean check=false;
            	for(Map<String,Object> map : resultList){
            		String bus_number=map.get("bus_number")!=null ? (String)map.get("bus_number") : "";
            		if(bus_number.equals(data[1].toString().trim())){
            			check=true;
            			break;
            		}
            	}
            	if(check==false){
            		errorMessage+="Bus No. is not exsist;";
            	}
            }else{
            	errorMessage+="Bus No. cannot be null;";
            }
            if(data[2] != null && !data[2].toString().equals("")){
            	infomap.put("vin",data[2].toString().trim());
            }else{
            	errorMessage+="VIN cannot be null;";
            }
			infomap.put("error", errorMessage);
			addList.add(infomap);
			line++;
		}
		initModel(true,"Success！",addList);
		}catch(Exception e){
			initModel(false,"Falure！",null);
		}
		return mv.getModelMap();
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
	 * 查询监控工序下拉列表
	 * @return
	 */
	@RequestMapping("/getStationMonitorSelect")
	@ResponseBody
	public ModelMap getStationMonitorSelect(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("order_type", request.getParameter("order_type"));
		model=new ModelMap();
		model.put("data", productionService.getStationMonitorSelect(condMap));
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

		//查询车辆基本信息
		Map<String,Object> businfo=new HashMap<String,Object>();
		businfo=productionService.getBusInfo(bus_number);
		if(businfo==null){
			model.put("businfo", null);
			model.put("nextStation", null);
		}else{
			Map<String,Object> condMap=new HashMap<String,Object>();
			condMap.put("factory_name", businfo.get("factory"));
			condMap.put("order_type", businfo.get("order_type"));
			condMap.put("station_name", businfo.get("station_name"));
			Map<String,Object> nextStation=productionService.getNextStation(condMap);
			model.put("businfo", businfo);
			model.put("nextStation", nextStation);
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
		String station_name=(String)  request.getParameter("station_name");
		String bus_number=request.getParameter("bus_number");
		String project_id=request.getParameter("project_id");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_id", factory_id);
		condMap.put("workshop", workshop);
		condMap.put("station_name", station_name);
		condMap.put("bus_number", bus_number);
		condMap.put("project_id", project_id);
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
		int station_id=Integer.parseInt(request.getParameter("station_id"));
		String station_name=request.getParameter("station_name");
		String line_name=request.getParameter("line_name");
		String plan_node_name=request.getParameter("plan_node_name");
		String field_name=request.getParameter("field_name");
		String bus_number=request.getParameter("bus_number");
		String parts_list_str=request.getParameter("parts_list");
		String order_type=request.getParameter("order_type");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		String project_id=request.getParameter("project_id");
		String rework=request.getParameter("rework");
		String on_offline=request.getParameter("on_offline");
		
		condMap.put("factory_id", factory_id);
		condMap.put("factory_name", factory_name);
		condMap.put("workshop_name", workshop_name);
		condMap.put("station_id", station_id);
		condMap.put("station_name", station_name);
		condMap.put("line_name", line_name);
		condMap.put("plan_node_name", plan_node_name);
		condMap.put("bus_number", bus_number);
		condMap.put("field_name", field_name.equals("")?"":(field_name));
		condMap.put("order_type", order_type);
		condMap.put("project_id", project_id);
		condMap.put("editor_id", userid);
		condMap.put("edit_date", curTime);
		condMap.put("rework", rework);
		condMap.put("on_offline", on_offline);
		
		/**
		 * 关键零部件列表
		 */
		List<Map<String,Object>> parts_list=new ArrayList<Map<String,Object>>();
		if(parts_list_str.contains("{")){
			JSONArray jsa=JSONArray.fromObject(parts_list_str);
			parts_list=JSONArray.toList(jsa, Map.class);
		}	
		for(Map m:parts_list){
			m.put("production_plant_id", factory_id);
			m.put("bus_number", bus_number);
			m.put("station_name", station_name);
			m.put("editor_id", userid);
			m.put("edit_date", curTime);
		}
		
		try{
			model.addAllAttributes(productionService.scan(condMap,parts_list));
		}catch(Exception e){
			logger.error(e.getMessage());
		}

		return model;
	}
		
	/**
	 * 车间工序页面
	 * @return
	 */
	@RequestMapping("/ecnUpdate")
	public ModelAndView ecnUpdate(){
		mv.setViewName("production/ecnUpdate");
		return mv;
	}
	/****************************  xiongjianwu end***************************/
	
	@RequestMapping("/saveVinInfo")
	@ResponseBody
	public ModelMap saveVinInfo(){
		model.clear();
		String addList=request.getParameter("addList");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_date = df.format(new Date());
		String editor_id=String.valueOf(session.getAttribute("user_id"));
		JSONArray add_arr=JSONArray.fromObject(addList);
		Iterator it=add_arr.iterator();
		List<Map<String,Object>> vin_list=new ArrayList<Map<String,Object>>();
		while(it.hasNext()){
			JSONObject jel=(JSONObject) it.next();
			Map<String,Object> bom=(Map<String, Object>) JSONObject.toBean(jel, Map.class);
			vin_list.add(bom);
		}
		
		try{
			int result=productionService.batchUpdateVin(vin_list);
			if(result>0){
				initModel(true,"保存成功！",vin_list);
			}else{
				initModel(false,"保存失败！",null);
			}
			
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false,"保存失败！"+e.getMessage(),null);
		}
		
		return mv.getModelMap();
	}
	@RequestMapping("/printBusNumber")
	public ModelAndView printBusNumber(){
		mv.setViewName("production/printBusNumber");
		return mv;
	}
	@RequestMapping("/showBusNumberList")
	@ResponseBody
	public ModelMap showBusNumberList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw")!=null ? request.getParameter("draw") : "1"); 
		int start=Integer.parseInt(request.getParameter("start")!=null ? request.getParameter("start") : "0");
		int length=Integer.parseInt(request.getParameter("length")!=null ? request.getParameter("length") : "-1");
		String plant=request.getParameter("plant");
		String project_no=request.getParameter("project_no");
		String bus_number=request.getParameter("bus_number");
		String print_flag=request.getParameter("print_flag");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("plant", plant);
		condMap.put("project_no", project_no);
		condMap.put("bus_number", bus_number);
		condMap.put("print_flag", print_flag);
		Map<String,Object> result=productionService.getBusNumberList(condMap);
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
	@RequestMapping("/getProjectBusNumberList")
	@ResponseBody
	public ModelMap getProjectBusNumberList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw")!=null ? request.getParameter("draw") : "1"); 
		int start=Integer.parseInt(request.getParameter("start")!=null ? request.getParameter("start") : "0");
		int length=Integer.parseInt(request.getParameter("length")!=null ? request.getParameter("length") : "-1");
		String plant=request.getParameter("plant");
		String project_no=request.getParameter("project_no");
		String status=request.getParameter("status");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("plant", plant);
		condMap.put("project_no", project_no);
		condMap.put("status", status);
		Map<String,Object> result=productionService.getProjectBusNumberList(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	/*****************Start Abnormity 生产异常反馈 生产异常处理 AddBy:Yangke 171010************************************************************/
	@RequestMapping("/abnormity")
	public ModelAndView abnormity(){
		mv.setViewName("production/abnormity");
		return mv;
	}
	
	@RequestMapping("/measureAbnormity")
	public ModelAndView measureAbnormity(){
		mv.setViewName("production/measureAbnormity");
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
	
	@RequestMapping("/enterException")
	@ResponseBody
	public ModelMap enterException(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		logger.info("---->enterException " + curTime + " " + userid);
		
		String bus_list = request.getParameter("bus_list");
		bus_list.replaceAll(",+", ",");
		String[] bus_number = bus_list.split(",");
		for (int i = 0 ; i <bus_number.length ; i++ ) {
			Map<String,Object> conditionMap=new HashMap<String,Object>();
			if (request.getParameter("factory") != null) conditionMap.put("plant", request.getParameter("factory"));
			if (request.getParameter("workshop") != null) conditionMap.put("workshop", request.getParameter("workshop"));
			if (request.getParameter("line") != null) conditionMap.put("line", request.getParameter("line"));
			if (request.getParameter("process") != ""){
				conditionMap.put("abnormal_station_id", request.getParameter("process"));
			}else{
				conditionMap.put("abnormal_station_id", "0");
			}
			conditionMap.put("abnormal_station", request.getParameter("process_name"));
			conditionMap.put("bus_number", bus_number[i].trim());
			if (request.getParameter("reason_type_id") != null) conditionMap.put("abnormal_cause_id", request.getParameter("reason_type_id"));
			if (request.getParameter("reason_type") != null) conditionMap.put("abnormal_cause", request.getParameter("reason_type"));
			if (request.getParameter("start_time") != null) conditionMap.put("open_date", request.getParameter("start_time"));
			conditionMap.put("detailed_reason", request.getParameter("detailed_reasons"));
			productionService.insertAbnormity(conditionMap);
		}
		return model;
	}
	
	@RequestMapping("/getExceptionList")
	@ResponseBody
	public ModelMap getExceptionList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):50;	//每一页数据条数
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("plant", request.getParameter("plant"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("status", request.getParameter("status"));
		condMap.put("start_time", request.getParameter("start_time"));
		condMap.put("end_time", request.getParameter("end_time"));
		Map<String,Object> list = productionService.getExceptionList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	
	
	/*****************End Abnormity 生产异常反馈************************************************************/
	
}
