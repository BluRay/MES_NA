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

import javax.servlet.ServletContext;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.byd.bms.order.service.IOrderService;
import com.byd.bms.production.service.IProductionService;
import com.byd.bms.setting.service.ISettingService;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.util.ExcelTool;
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
	static Logger logger = Logger.getLogger("ProductionController");
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
            		errorMessage+="P_common_01;";
            	}
            }else{
            	errorMessage+="P_common_02;";
            }
            if(data[2] != null && !data[2].toString().equals("")){
            	infomap.put("vin",data[2].toString().trim());
            }else{
            	errorMessage+="P_vinInfo_01;";
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
			condMap.put("station_name", businfo.get("current_station"));
			condMap.put("on_offline", businfo.get("on_offline"));
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
	 * 技改维护页面
	 * @return
	 */
	@RequestMapping("/ecnUpdate")
	public ModelAndView ecnUpdate(){
		mv.setViewName("production/ecnUpdate");
		return mv;
	}
	
	/**
	 * 查询工厂工位下拉列表
	 * @return
	 */
	@RequestMapping("/getStationSelect")
	@ResponseBody
	public ModelMap getStationSelect(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", request.getParameter("factory"));
		model=new ModelMap();
		model.put("data", productionService.getStationSelect(condMap));
		return model;
	}
	
	@RequestMapping(value="/uploadEcnMaterial",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadEcnMaterial(@RequestParam(value="file",required=false) MultipartFile file){
		model.clear();
		String fileName=file.getOriginalFilename();
		Map<String,Object> condMap=new HashMap<String,Object>();
		
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_STRING);
		dataType.put("1", ExcelModel.CELL_TYPE_STRING);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_STRING);
		dataType.put("4", ExcelModel.CELL_TYPE_NUMERIC);
		dataType.put("5", ExcelModel.CELL_TYPE_STRING);
		
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
		List<Map<String, Object>> materialList = new ArrayList<Map<String, Object>>();
		int i=1;
		for(Object[] data:excelModel.getData()){
			Map<String,Object> m=new HashMap<String,Object>();
			m.put("item_no", i);
			m.put("SAP_material", data[0].toString());
			m.put("BYD_NO", data[1].toString());
			m.put("description", data[2].toString());
			m.put("specification", data[3].toString());
			m.put("qty", data[4].toString());
			m.put("note", data[5].toString());
			materialList.add(m);
			i++;
		}	
		
		initModel(true, "Upload Success!", materialList);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false, "Upload Failed!", null);
		}
		return mv.getModelMap();
	}
	
	/**
	 * 新增技改单技改任务
	 * @return
	 */
	@RequestMapping("/addEcnItems")
	@ResponseBody
	public ModelMap addEcnItems(@RequestParam(value="ecn_pictures",required=false) MultipartFile ecn_pictures){
		model.clear();
		String project_id=request.getParameter("project_id");
		String project =request.getParameter("project");
		String ecn_no=request.getParameter("ecn_no");
		//保存图片
		String piecture=saveFileMethod(ecn_pictures);
		String design_people=request.getParameter("design_people");
		String ecnItemList=request.getParameter("taskList");
		String bus_list=request.getParameter("bus_list");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("project_id", project_id);
		condMap.put("project", project);
		condMap.put("ecn_no", ecn_no);
		condMap.put("design_people", design_people);
		condMap.put("creator_id", userid);
		condMap.put("create_date", curTime);
		condMap.put("ecnItemList", ecnItemList);
		condMap.put("pictures", piecture);
		condMap.put("bus_list", bus_list);
		
		productionService.addEcnItems(condMap,model);
		
		return model;
	}
	
	
	private String saveFileMethod(MultipartFile file) {
		ServletContext servletContext = ContextLoader.getCurrentWebApplicationContext().getServletContext(); 
		String filepath = "";
		if (file != null) {
			try {
				 //取得当前上传文件的文件名称  
                String myFileName = file.getOriginalFilename();  
                //如果名称不为“”,说明该文件存在，否则说明该文件不存在  
                if(myFileName.trim() !=""){  
    				// 把上传的文件放到指定的路径下
    				String path = servletContext.getRealPath("/file/upload/ecn/");
    				// 写到指定的路径中
    				File savedir = new File(path);
    				// 如果指定的路径没有就创建
    				if (!savedir.exists()) {
    					savedir.mkdirs();
    				}
    				//System.out.println(myFileName.substring(myFileName.indexOf("."),myFileName.length()));
    				File saveFile = new File(savedir, String.valueOf(System.currentTimeMillis()) + myFileName.substring(myFileName.indexOf("."),myFileName.length()));
                    System.out.println(myFileName);  
                    file.transferTo(saveFile);
                    filepath = "/MES/file/upload/ecn/" + saveFile.getName();
                }
			} catch (Exception e) {
				logger.error(e.getMessage());
				e.printStackTrace();
			}
		}

		return filepath;
	}
	/**
	 * 技改维护页面查询技改任务列表
	 * @return
	 */
	@RequestMapping("/getEcnItemList")
	@ResponseBody
	public ModelMap getEcnItemList(){
		model.clear();
		String ecn_no=request.getParameter("ecn_no");
		String status=request.getParameter("status");
		String items=request.getParameter("items");
		String start_date=request.getParameter("start_date");
		String end_date=request.getParameter("end_date");
		int draw=Integer.parseInt(request.getParameter("draw")!=null ? request.getParameter("draw") : "1"); 
		int start=Integer.parseInt(request.getParameter("start")!=null ? request.getParameter("start") : "0");
		int length=Integer.parseInt(request.getParameter("length")!=null ? request.getParameter("length") : "-1");
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("ecn_no", ecn_no);
		condMap.put("status", status);
		condMap.put("items", items);
		condMap.put("start_date", start_date);
		condMap.put("end_date", end_date);
		
		productionService.getEcnItemList(condMap,model);
		
		return model;
	}
	
	/**
	 * 根据ecn_id查询技改任务列表
	 * @return
	 */
	@RequestMapping("/getItemListByEcn")
	@ResponseBody
	public ModelMap getItemListByEcn(){
		model.clear();
		String ecn_id=request.getParameter("ecn_id");
		productionService.getItemListByEcn(ecn_id,model);
		
		return model;
	}
	/**
	 * 技改单修改
	 * @return
	 */
	@RequestMapping("/updateEcnItems")
	@ResponseBody
	public ModelMap updateEcnItems(@RequestParam(value="ecn_pictures",required=false) MultipartFile ecn_pictures){
		model.clear();
		String project_id=request.getParameter("project_id");
		String project =request.getParameter("project");
		String ecn_no=request.getParameter("ecn_no");
		String ecn_id=request.getParameter("ecn_id");
		//保存图片
		String piecture=saveFileMethod(ecn_pictures);
		String design_people=request.getParameter("design_people");
		String ecnItemList=request.getParameter("taskList");
		String bus_list=request.getParameter("bus_list");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("project_id", project_id);
		condMap.put("project", project);
		condMap.put("ecn_no", ecn_no);
		condMap.put("ecn_id", ecn_id);
		condMap.put("design_people", design_people);
		condMap.put("creator_id", userid);
		condMap.put("create_date", curTime);
		condMap.put("ecnItemList", ecnItemList);
		condMap.put("pictures", piecture);
		condMap.put("bus_list", bus_list);
		
		
		productionService.updateEcnItems(condMap,model);
		
		return model;
	}
	/**
	 * 技改任务删除
	 * @return
	 */
	@RequestMapping("/deleteEcnItem")
	@ResponseBody
	public ModelMap deleteEcnItem(){
		model.clear();
		String ecn_item_id=request.getParameter("ecn_item_id");
		productionService.deleteEcnItem(ecn_item_id,model);
		
		return model;
	}
	
	/**
	 * 技改跟进页面
	 * @return
	 */
	@RequestMapping("/ecnConfirm")
	public ModelAndView ecnConfirm(){
		mv.setViewName("production/ecnConfirm");
		return mv;
	}
	
	/**
	 * 技改任务BUS列表查询
	 * @return
	 */
	@RequestMapping("/getEcnBusList")
	@ResponseBody
	public ModelMap getEcnBusList(){
		model.clear();
		String ecn_item_id=request.getParameter("ecn_item_id");
		productionService.getEcnBusList(ecn_item_id,model);
		return model;
	}
	
	/**
	 * 技改跟进
	 * @return
	 */
	@RequestMapping("/confirmEcnItem")
	@ResponseBody
	public ModelMap confirmEcnItem(){
		model.clear();
		String ecn_item_id=request.getParameter("ecn_item_id");
		String bus_list_str=request.getParameter("bus_list");
		JSONArray bus_arr=JSONArray.fromObject(bus_list_str);
		Iterator it_bus=bus_arr.iterator();
		List<Map<String,Object>> bus_list=new ArrayList<Map<String,Object>>();
		
		while(it_bus.hasNext()){
			JSONObject jso=(JSONObject) it_bus.next();
			Map<String,Object> bus=(Map<String, Object>) JSONObject.toBean(jso, Map.class);
			bus.put("ecn_item_id", ecn_item_id);
			bus_list.add(bus);
		}
		
		productionService.confirmEcnItem(bus_list,model);
		return model;
	}
	
	/**
	 * 技改跟进QC
	 * @return
	 */
	@RequestMapping("/confirmEcnItem_QC")
	@ResponseBody
	public ModelMap confirmEcnItem_QC(){
		model.clear();
		String ecn_item_id=request.getParameter("ecn_item_id");
		String bus_list_str=request.getParameter("bus_list");
		JSONArray bus_arr=JSONArray.fromObject(bus_list_str);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curTime = df.format(new Date());
		
		Iterator it_bus=bus_arr.iterator();
		List<Map<String,Object>> bus_list=new ArrayList<Map<String,Object>>();
		
		while(it_bus.hasNext()){
			JSONObject jso=(JSONObject) it_bus.next();
			Map<String,Object> bus=(Map<String, Object>) JSONObject.toBean(jso, Map.class);
			bus.put("ecn_item_id", ecn_item_id);
			bus_list.add(bus);
			bus.put("qc_date", curTime);
		}
		
		productionService.confirmEcnItem_QC(bus_list, model);
		return model;
	}
	
	/**
	 * Workshop View
	 * @return
	 */
	@RequestMapping("/workshopView")
	public ModelAndView workshopView(){
		mv.setViewName("production/workshopView");
		return mv;
	}
	
	/**
	 * 查询各车间的在制库存
	 * @return
	 */
	@RequestMapping("/getWorkshopStock")
	@ResponseBody
	public ModelMap getWorkshopStock(){
		model.clear();
		String factory=request.getParameter("factory");
		String factory_id=request.getParameter("factory_id");
		
		Map<String, Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("factory_id", factory_id);
		productionService.getWorkshopStock(condMap, model);
		
		return model;
	}
	
	/**
	 * 查询各车间、工位在制车辆信息
	 * @return
	 */
	@RequestMapping("/getMonitorBusList")
	@ResponseBody
	public ModelMap getMonitorBusList(){
		model.clear();
		String factory=request.getParameter("factory");
		String factory_id=request.getParameter("factory_id");
		String station_id=request.getParameter("station_id");
		String station=request.getParameter("station");
		String workshop=request.getParameter("workshop");
		
		Map<String, Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("factory_id", factory_id);
		condMap.put("station", station);
		condMap.put("station_id", station_id);
		condMap.put("workshop", workshop);
		productionService.getMonitorBusList(condMap, model);
		
		return model;
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
				initModel(true,"",vin_list);
			}else{
				initModel(false,"",null);
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
	@RequestMapping("/busTrace")
	public ModelAndView busTrace(){
		mv.setViewName("production/busTrace");
		return mv;
	}
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
	@RequestMapping("/getEcnBusListByBusNo")
	@ResponseBody
	public ModelMap getEcnBusListByBusNo(){	
		model.clear();
		productionService.getEcnBusListByBusNo(request.getParameter("bus_number").toString(),model);
        return model;
	}
	
	@RequestMapping("/getBusNumberScanList")
	@ResponseBody
	public ModelMap getBusNumberScanList(){	
		model.clear();
		productionService.getBusNumberScanList(request.getParameter("bus_number").toString(),model);
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
	
	
	@RequestMapping("/measuresAbnormity")
	@ResponseBody
	public ModelMap measuresAbnormity(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("id", request.getParameter("id"));
		if (request.getParameter("responsible_department_id") != ""){
			condMap.put("responsible_department_id", request.getParameter("responsible_department_id"));
		}else{
			condMap.put("responsible_department_id", "0");
		}
		condMap.put("responsible_department", request.getParameter("responsible_department"));
		condMap.put("measures", request.getParameter("measures"));
		condMap.put("measure_date", request.getParameter("measure_date"));
		int result = productionService.measuresAbnormity(condMap);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	
	/*****************End Abnormity 生产异常反馈************************************************************/

	/*****************Start Material Requirement 物料需求 AddBy:Yangke 171019******************************/
	@RequestMapping("/materialRequirement")
	public ModelAndView materialRequirement(){
		mv.setViewName("production/materialRequirement");
		return mv;
	}
	
	@RequestMapping("/getMaterialRequirement")
	@ResponseBody
	public ModelMap getMaterialRequirement(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_name", request.getParameter("factory_name"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("workshop_name", request.getParameter("workshop_name"));
		condMap.put("workshop_id", request.getParameter("workshop_id"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("station", request.getParameter("station"));
		condMap.put("station_name", request.getParameter("station_name"));
		condMap.put("station_id", request.getParameter("station_id"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		
		List<Map<String, Object>> datalist = new ArrayList<Map<String, Object>>();
		datalist = productionService.getMaterialRequirement(condMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/printMaterialRequirement")
	@ResponseBody
	public ModelMap printMaterialRequirement() {
		//生成送货单号
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		String dis_date = df.format(new Date());
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("dis_date", dis_date);
		SimpleDateFormat df2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df2.format(new Date());
		String create_user=String.valueOf(session.getAttribute("user_name"));
		
		int dis_count = productionService.getLineDisCount(condMap)+1;
		String dis_no = dis_date +  String.format("%4d", dis_count).replace(" ", "0");
		logger.info("-->dis_no = " + dis_no);
		int result = 0;
		String conditions=request.getParameter("conditions");
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		for(int i=0;i<jsonArray.size();i++){
			JSONObject object = (JSONObject)jsonArray.get(i);	
			logger.info(object);
			Map<String,Object> condMap2=new HashMap<String,Object>();
			condMap2.put("dis_no", dis_no);
			condMap2.put("create_user", create_user);
			condMap2.put("create_time", curTime);
			condMap2.put("station_id", object.get("station_id"));
			condMap2.put("station", object.get("station"));
			condMap2.put("bus_number", object.get("bus_number"));
			condMap2.put("sap_material", object.get("SAP_material"));
			condMap2.put("byd_no", object.get("BYD_NO"));
			condMap2.put("part_name", object.get("part_name"));
			condMap2.put("specification", object.get("specification"));
			condMap2.put("required_quantity", object.get("quantity"));
			condMap2.put("dis_quantity", object.get("dis_num"));
			condMap2.put("unit", object.get("unit"));
			condMap2.put("vendor", object.get("vendor"));
			//写入送货流水表[BMS_NA_LINE_DISTRIBUTION]
			result += productionService.insertLineDistribution(condMap2);
			
		}
		initModel(true,dis_no,result);
		model = mv.getModelMap();
		return model;
	}
	
	/*****************End   Material Requirement 物料需求 ****************************************************/
	
	/*****************Start Material Reception 物料接收 AddBy:Yangke 171024***********************************/
	@RequestMapping("/materialReception")
	public ModelAndView materialReception(){
		mv.setViewName("production/materialReception");
		return mv;
	}
	
	@RequestMapping("/getMaterialReception")
	@ResponseBody
	public ModelMap getMaterialReception(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("dis_no", request.getParameter("dis_no"));
		List<Map<String, Object>> datalist = new ArrayList<Map<String, Object>>();
		datalist = productionService.getMaterialReception(condMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/materialReceptionConfirm")
	@ResponseBody
	public ModelMap materialReceptionConfirm(){
		String conditions=request.getParameter("conditions");
		JSONArray jsonArray=JSONArray.fromObject(conditions);
		for(int i=0;i<jsonArray.size();i++){
			JSONObject object = (JSONObject)jsonArray.get(i);	
			Map<String,Object> condMap=new HashMap<String,Object>();
			if(i==0){
				condMap.put("dis_no", object.get("dis_no"));
				//00 判断发货单是否存在
				int dis_count = productionService.getDistributionCount(condMap);
				if(dis_count == 0){
					initModel(false,"error","P_materialReception_06");
					model = mv.getModelMap();
					return model;
				}
				
				//01 判断发货单状态 是否已经接收
				String reception_user = productionService.getDistributionReceptionUser(condMap);
				logger.info("-->reception_user = " + reception_user);
				if(reception_user != null){
					initModel(false,"error","P_materialReception_03");
					model = mv.getModelMap();
					return model;
				}
				//02 更新发货单收货人信息
				SimpleDateFormat df2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				String curTime = df2.format(new Date());
				String userName=String.valueOf(session.getAttribute("user_name"));
				condMap.put("reception_time", curTime);
				condMap.put("reception_user", userName);
				productionService.updateLineDistributionReception(condMap);				
			}
			//03 更新线边物料表 [BMS_NA_LINE_INVENTORY]
			condMap.put("station_id", object.get("station_id"));
			condMap.put("station", object.get("station"));
			condMap.put("bus_number", object.get("bus_number"));
			condMap.put("sap_material", object.get("sap_material"));
			condMap.put("byd_no", object.get("byd_no"));
			condMap.put("part_name", object.get("part_name"));
			condMap.put("specification", object.get("specification"));
			condMap.put("required_quantity", object.get("required_quantity"));
			condMap.put("dis_quantity", object.get("dis_quantity"));
			condMap.put("unit", object.get("unit"));
			condMap.put("vendor", object.get("vendor"));
			productionService.updateLineInventory(condMap);
			
		}
		return model;
	}
	
	/*****************Start DistributionManage AddBy:Yangke 171025**********************************************/
	@RequestMapping("/distributionManage")
	public ModelAndView distributionManage(){
		mv.setViewName("production/distributionManage");
		return mv;
	}
	
	@RequestMapping("/getLineInventoryList")
	@ResponseBody
	public ModelMap getLineInventoryList(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory_name", request.getParameter("factory_name"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("workshop_name", request.getParameter("workshop_name"));
		condMap.put("workshop_id", request.getParameter("workshop_id"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("station", request.getParameter("station"));
		condMap.put("station_name", request.getParameter("station_name"));
		condMap.put("station_id", request.getParameter("station_id"));
		condMap.put("bus_number", request.getParameter("bus_number"));
		condMap.put("dis_no", request.getParameter("dis_no"));
		condMap.put("start_date", request.getParameter("start_date"));
		condMap.put("end_date", request.getParameter("end_date"));
		condMap.put("status", request.getParameter("status"));
		List<Map<String, Object>> datalist = new ArrayList<Map<String, Object>>();
		datalist = productionService.getLineInventoryList(condMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getDistributionDetail")
	@ResponseBody
	public ModelMap getDistributionDetail(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("dis_no", request.getParameter("dis_no"));
		List<Map<String, Object>> datalist = new ArrayList<Map<String, Object>>();
		datalist = productionService.getMaterialReception(condMap);
		initModel(true,"success",datalist);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/removeDistribution")
	@ResponseBody
	public ModelMap removeDistribution(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("dis_no", request.getParameter("dis_no"));
		int result = productionService.removeDistribution(condMap);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	/*****************End   Distribution Manage *****************************************************************/
	/*****************Start LineInventory AddBy:Yangke 171025****************************************************/
	@RequestMapping("/lineInventory")
	public ModelAndView lineInventory(){
		mv.setViewName("production/lineInventory");
		return mv;
	}
	
	@RequestMapping("/getLineInventoryMatList")
	@ResponseBody
	public ModelMap getLineInventoryMatList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):50;	//每一页数据条数
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("factory_name", request.getParameter("factory_name"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		condMap.put("workshop_name", request.getParameter("workshop_name"));
		condMap.put("workshop_id", request.getParameter("workshop_id"));
		condMap.put("line", request.getParameter("line"));
		condMap.put("station", request.getParameter("station"));
		condMap.put("station_name", request.getParameter("station_name"));
		condMap.put("station_id", request.getParameter("station_id"));
		condMap.put("sap_material", request.getParameter("sap_material"));
		
		Map<String,Object> list = productionService.getLineInventoryMatList(condMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(list);
		model = mv.getModelMap();
		return model;
	}
	
	/*****************Start LineInventory ***********************************************************************/
}
