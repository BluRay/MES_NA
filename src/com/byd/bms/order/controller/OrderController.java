package com.byd.bms.order.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.order.service.IOrderService;
import com.byd.bms.setting.service.ISettingService;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.util.ExcelTool;
import com.byd.bms.util.controller.BaseController;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
/**
 * 订单Controller
 * @author xjw 2017-04-12
 */ 
@Controller
@RequestMapping("/project")
public class OrderController extends BaseController{
	
	static Logger logger = Logger.getLogger(OrderController.class.getName());
	@Autowired
	protected IOrderService orderService;
	@Autowired
	protected ISettingService settingService;
	@RequestMapping("/update")
	public ModelAndView maintain(){ 
		mv.setViewName("order/maintain");
        return mv;  
    } 
	
	/**
	 * ajax 获取订单列表数据
	 * @return model
	 */
	@RequestMapping("/showOrderList")
	@ResponseBody
	public ModelMap showOrderList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String orderNo=request.getParameter("orderNo");//订单编号
		String orderName=request.getParameter("orderName");//订单名称模糊匹配
		String actYear=request.getParameter("actYear");//生产年份
		String factory=request.getParameter("factory");//工厂
		String orderStatus=request.getParameter("orderStatus");//状态
		String orderColumn=request.getParameter("orderColumn");//排序字段
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("orderNo", orderNo);
		condMap.put("orderName", orderName);
		condMap.put("actYear",actYear);
		condMap.put("factory", factory);
		condMap.put("orderStatus", orderStatus);
		condMap.put("orderColumn", orderColumn);
		Map<String,Object> result=orderService.getOrderListPage(condMap);
		model.addAllAttributes(result);
		
		return model;
	}

	
	/**
	 * 修改订单
	 * @return model
	 */
	@RequestMapping("/editOrder")
	@ResponseBody
	public ModelMap editOrder(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String userid=String.valueOf(session.getAttribute("user_id"));
		BmsOrder order = new BmsOrder();
		int project_id=Integer.parseInt(request.getParameter("project_id"));
		int editor_id=Integer.parseInt(userid);
		
		order.setId(project_id);
		order.setEditor_id(editor_id);
		order.setEdit_date(curTime);
		order.setProduction_plant_id(Integer.parseInt(request.getParameter("production_plant_id")));
		order.setProject_name(request.getParameter("project_name"));
		order.setDelivery_date(request.getParameter("delivery_date"));		
		order.setQuantity(Integer.parseInt(request.getParameter("quantity")));
		order.setProject_date(request.getParameter("project_date"));
		order.setSales_manager(request.getParameter("sales_manager"));
		order.setProject_manager(request.getParameter("project_manager"));
		
		try{
			orderService.editOrder(order);
			initModel(true,"Succeed!",null);
		}catch(Exception e){
			logger.error("edit order failed!"+e.getMessage());
			initModel(false,"Failed！",null);
		}		
		
		return mv.getModelMap();
	}
	/**
	 * 新增订单
	 * @return model
	 */
	@RequestMapping("/addOrder")
	@ResponseBody
	public ModelMap addOrder(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		
		BmsOrder order = new BmsOrder();
		order.setProject_no(getOrderSerialByYear(request.getParameter("project_date").substring(0, 4)));
		order.setProject_name(request.getParameter("project_name"));
		order.setCustomer(request.getParameter("customer"));
		order.setSearch_name(request.getParameter("search_name"));
		order.setProject_date(request.getParameter("project_date"));		
		order.setBus_type(request.getParameter("bus_type"));
		order.setQuantity(Integer.parseInt(request.getParameter("quantity")));
		order.setDelivery_date(request.getParameter("delivery_date"));
		order.setProduction_plant(request.getParameter("production_plant"));
		order.setProduction_plant_id(Integer.parseInt(request.getParameter("production_plant_id")));
		order.setSales_manager(request.getParameter("sales_manager"));
		order.setProject_manager(request.getParameter("project_manager"));
		order.setProject_status(request.getParameter("project_status"));
		order.setEditor_id(userid);
		order.setEdit_date(curTime);
		
		//String factoryOrderNum = request.getParameter("factoryOrderNum");
		try{
			orderService.createOrder(order);
			initModel(true, "新增成功！", null);
		}catch(Exception e){
			logger.error("createOrder 失败!"+e.getMessage());
			initModel(false, "新增失败！", null);
		}
				
		return mv.getModelMap();
	}
	
	/**
	 * 根据project_id 获取订单下在制车辆数
	 * @return
	 */
	@RequestMapping("/getBusInProcess")
	@ResponseBody
	public ModelMap getBusInProcess(){
		model.clear();
		String project_id=request.getParameter("project_id");
		
		orderService.getBusInProcess(project_id,model);
		
		return model;
	}
	
	public String getOrderSerialByYear(String year){
		String order_no = orderService.getOrderSerial(year);
		String new_order_no = "";
		if (order_no == null){
			return "D" + year + "001";
		}
		int serial = Integer.parseInt(order_no.substring(5, 8)) + 1;
		if (serial < 10){
			new_order_no = order_no.substring(0, 5) + "00" + String.valueOf(serial);
		}else if (serial < 100){
			new_order_no = order_no.substring(0, 5) + "0" + String.valueOf(serial);
		}else{
			new_order_no = order_no.substring(0, 5) + String.valueOf(serial);
		}
		return new_order_no;		
	}
	/**
	 * 展示订单车辆明细
	 * @return model
	 */
	@RequestMapping("/showBusNumber")
	@ResponseBody
	public ModelMap showBusNumber(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("order_id",request.getParameter("order_id"));
		conditionMap.put("factory_id",request.getParameter("factory_id"));
		conditionMap.put("order_config_id", request.getParameter("order_config_id"));
		initModel(true,"查询成功！",orderService.getBusNumberByOrder(conditionMap));
		return mv.getModelMap();
	}

	@RequestMapping("/orderQuery")
	public ModelAndView orderQuery(){ 
		mv.setViewName("order/orderQuery");
        return mv;  
    } 
	
	/**
	 * 订单查询，获取订单明细列表
	 * @return
	 */
	@RequestMapping("/getOrderDetailList")
	@ResponseBody
	public ModelMap getOrderDetailList(){
		model=new ModelMap();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_no", request.getParameter("order_no"));
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("actYear", request.getParameter("actYear"));
		condMap.put("status", request.getParameter("status"));		
		/*if(request.getParameter("offset")!=null)condMap.put("offset", Integer.valueOf(request.getParameter("offset")));
		if(request.getParameter("limit")!=null)condMap.put("pageSize", Integer.valueOf(request.getParameter("limit")));*/
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("sort", request.getParameter("sort"));
		condMap.put("order", request.getParameter("order"));
		condMap.put("draw", draw);
		
		model=orderService.getOrderQueryData(condMap);

		return model;
	}
	

	/* 订单BOM信息页面 */
	@RequestMapping("/getProjectBomInfo")
	public ModelAndView getProjectBomInfo(){ 
		mv.setViewName("order/getProjectBomInfo");
        return mv;  
    } 
	/**
	 * ajax 获取订单BOM数据
	 * @return model
	 */
	@RequestMapping("/getProjectBomList")
	@ResponseBody
	public ModelMap getProjectBomList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String projectNo=request.getParameter("projectNo");//订单编号
		String status=request.getParameter("status");//订单状态
		String actYear=request.getParameter("actYear");//生产年份
		String plant=request.getParameter("plant");//工厂
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("projectNo", projectNo);
		condMap.put("actYear",actYear);
		condMap.put("plant", plant);
		condMap.put("status", status);
		Map<String,Object> result=orderService.getProjectBomList(condMap);
		model.addAllAttributes(result);
		
		return model;
	}
	
	/* 订单BOM导入页面 */
	@RequestMapping("/importBomInfo")
	public ModelAndView importBomInfo(){ 
		mv.setViewName("order/importBomInfo");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("projectId",request.getParameter("projectId"));
	    map.put("projectNo",request.getParameter("projectNo"));
	    String version=request.getParameter("version");
	    String dcn=request.getParameter("dcn");
	    String document_no=request.getParameter("document_no");
	    map.put("version",version);
	    map.put("dcn",dcn);
	    map.put("document_no",document_no);
		mv.getModelMap().addAllAttributes(map);
        return mv;  
    } 
	@RequestMapping(value="/uploadBomInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadBomInfo(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName=file.getOriginalFilename();
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(5);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("2", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("3", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("4", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("5", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("6", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("7", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("8", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("9", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("10", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("11", ExcelModel.CELL_TYPE_CANNULL);
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
		Map<String,Object> queryMap=new HashMap<String,Object>();
		queryMap.put("length", -1);
		String stationStr=settingService.checkStation(queryMap,"Code");
		List<Map<String, String>> addList = new ArrayList<Map<String, String>>();
		for (Object[] data : excelModel.getData()) {
			int line=6; // 模板从第6行开始是bom数据
			String errorMessage="";
			Map<String, String> infomap = new HashMap<String, String>();
            if(data[0] != null && !data[0].toString().equals("")){
            	infomap.put("item_no",data[0].toString().trim());
            }else{
            	errorMessage="Line "+line+": Item cannot be null";
            }
            if(data[1] != null && !data[1].toString().equals("")){
            	infomap.put("SAP_material",data[1].toString().trim());
            }else{
            	errorMessage+="SAP Material cannot be null;";
            }
			infomap.put("BYD_P/N", data[2] == null ? null : data[2].toString().trim());
			if(data[3] != null && !data[3].toString().equals("")){
				infomap.put("part_name",data[3].toString().trim());
            }else{
            	errorMessage+="Part Name cannot be null;";
            }
			infomap.put("specification", data[4] == null ? null : data[4].toString().trim());
			if(data[5] != null && !data[5].toString().equals("")){
				infomap.put("unit",data[5].toString().trim());
            }else{
            	errorMessage+="Unit cannot be null;;";
            }
			if(data[6] != null && !data[6].toString().equals("")){
				infomap.put("quantity",data[6].toString().trim());
				boolean isNumber=isNumber(data[6].toString().trim());
				if(!isNumber){
					errorMessage+="Quantity must be Number";
				}
            }else{
            	errorMessage+="Quantity cannot be null;";
            }
			infomap.put("en_description", data[7] == null ? null : data[7].toString().trim());
			if(data[8] != null && !data[8].toString().equals("")){
				infomap.put("vendor",data[8].toString().trim());
            }else{
            	errorMessage+="Vendor cannot be null;";
            }
			if(data[9] != null && !data[9].toString().equals("")){
				int index=stationStr.indexOf(data[9].toString().trim());
				if(index<0){
					infomap.put("error", "Station Code annot be found");
				}
				infomap.put("station_code",data[9].toString().trim());
            }else{
            	errorMessage+="Station Code cannot be Null;";
            }
			infomap.put("note", data[10] == null ? null : data[10].toString().trim());
			infomap.put("error", errorMessage);
			addList.add(infomap);
			line++;
		}
		initModel(true,"导入成功！",addList);
		}catch(Exception e){
			initModel(false,"导入失败！",null);
		}
		return mv.getModelMap();
	}
	
	@RequestMapping("/saveProjectBomInfo")
	@ResponseBody
	public ModelMap saveProjectBomInfo(){
		model.clear();
		String addList=request.getParameter("addList");
		String projectId=request.getParameter("projectId");
		String documentNo=request.getParameter("documentNo");
		String version=request.getParameter("version");
		String dcn=request.getParameter("dcn");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_date = df.format(new Date());
		String editor_id=String.valueOf(session.getAttribute("user_id"));
		JSONArray add_arr=JSONArray.fromObject(addList);
		Iterator it=add_arr.iterator();
		List<Map<String,Object>> bom_list=new ArrayList<Map<String,Object>>();
		Map<String,Object> param_map=new HashMap<String,Object>();
		while(it.hasNext()){
			JSONObject jel=(JSONObject) it.next();
			Map<String,Object> bom=(Map<String, Object>) JSONObject.toBean(jel, Map.class);
			bom_list.add(bom);
		}
		param_map.put("bom_list", bom_list);
		param_map.put("projectId",projectId);
		param_map.put("documentNo",documentNo);
		param_map.put("version",version);
		param_map.put("dcn",dcn);
		param_map.put("editor_id",editor_id);
		param_map.put("edit_date",edit_date);
		try{
			orderService.saveBomInfo(param_map);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false,"保存失败！"+e.getMessage(),null);
		}
		
		return mv.getModelMap();
	}
	public static boolean isNumber(String numStr){
        try {            
        	new BigDecimal(numStr);            
        	return true;        
        } catch (Exception e) {            
        	return false;        
        }
	}
	/* 订单BOM明细显示页面 */
	@RequestMapping("/showBomInfo")
	public ModelAndView showBomInfo(){ 
		mv.setViewName("order/showBomInfo");
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("projectNo",request.getParameter("projectNo"));
	    map.put("version",request.getParameter("version"));
	    map.put("dcn",request.getParameter("dcn"));
	    map.put("document_no",request.getParameter("document_no"));
		mv.getModelMap().addAllAttributes(map);
        return mv;  
    } 
	@RequestMapping("/getBomItemList")
	@ResponseBody
	public ModelMap getBomItemList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw")!=null ? request.getParameter("draw") : "1");//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start")!=null ? request.getParameter("start") : "0");
		int length=Integer.parseInt(request.getParameter("length")!=null ? request.getParameter("length") : "-1");//每一页数据条数
		String projectNo=request.getParameter("projectNo");//订单编号
		String version=request.getParameter("version");
		String sapNo=request.getParameter("sapNo");
		String stationCode=request.getParameter("stationCode");
		String plant=request.getParameter("plant");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("projectNo", projectNo);
		condMap.put("stationCode",stationCode);
		condMap.put("plant", plant);
		condMap.put("version", version);
		condMap.put("sapNo", sapNo);
		Map<String,Object> result=orderService.getBomItemList(condMap);
		model.addAllAttributes(result);
		return model;
	}
	@RequestMapping("/getBomCompareList")
	@ResponseBody
	public ModelMap getBomCompareList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
//		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
//		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
//		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String projectNo=request.getParameter("projectNo");
		String sapNo=request.getParameter("sapNo");
		String version=request.getParameter("version");
		String stationCode=request.getParameter("stationCode");
		String compareType=request.getParameter("compareType");
//		condMap.put("draw", draw);
//		condMap.put("start", start);
//		condMap.put("length", length);
		condMap.put("projectNo", projectNo);
		condMap.put("stationCode",stationCode);
		condMap.put("sapNo", sapNo);
		condMap.put("version", version);
		condMap.put("compareType", compareType);
		Map<String,Object> result=orderService.getBomCompareList(condMap);
		model.addAllAttributes(result);
		return model;
	}
	/* 订单查询显示页面 */
	@RequestMapping("/projectQuery")
	public ModelAndView projectQuery(){ 
		mv.setViewName("order/projectQuery");
        return mv;  
    } 
	/**
	 * 订单查询，获取订单明细列表
	 * @return
	 */
	@RequestMapping("/getProjectDetailList")
	@ResponseBody
	public ModelMap getProjectDetailList(){
		model=new ModelMap();
		int draw=Integer.parseInt(request.getParameter("draw")); 
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("project_no", request.getParameter("project_no"));
		condMap.put("plant", request.getParameter("plant"));
		condMap.put("actYear", request.getParameter("actYear"));
		condMap.put("status", request.getParameter("status"));		
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("sort", request.getParameter("sort"));
		condMap.put("order", request.getParameter("order"));
		condMap.put("draw", draw);
		
		model=orderService.getProjectQueryData(condMap);

		return model;
	}
	/**
	 * 展示订单车辆明细
	 * @return model
	 */
	@RequestMapping("/showProjectBusNumber")
	@ResponseBody
	public ModelMap showProjectBusNumber(){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("project_id",request.getParameter("project_id"));
		initModel(true,"查询成功！",orderService.getBusNumberByProject(conditionMap));
		return mv.getModelMap();
	}
}
