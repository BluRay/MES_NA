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
import com.byd.bms.order.model.BmsOrderConfigAllot;
import com.byd.bms.order.service.IOrderService;
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
	
	@RequestMapping("/maintain")
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
		String orderColumn=request.getParameter("orderColumn");//排序字段
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("orderNo", orderNo);
		condMap.put("orderName", orderName);
		condMap.put("actYear",actYear);
		condMap.put("factory", factory);
		condMap.put("orderColumn", orderColumn);
		Map<String,Object> result=orderService.getOrderListPage(condMap);
		model.addAllAttributes(result);
		
		return model;
	}
	
	/**
	 * ajax 获取车辆最近的流水
	 * @return model
	 */
	@RequestMapping("/getLatestBusSeries")
	@ResponseBody
	public ModelMap getLatestBusSeries(){
		model=new ModelMap();
		String productive_year=request.getParameter("productive_year");
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("productive_year", productive_year);	
		int bus_num_start=orderService.getBusNumberStart(conditionMap)+1;
		model.put("latest_num_start", bus_num_start);
		return model;
	}
	/**
	 * ajax 获取订单详情
	 * @return model
	 */
	@RequestMapping("/showOrderDetailList")
	@ResponseBody
	public ModelMap showOrderDetailList(){
		model=new ModelMap();
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		if (request.getParameter("search_order_no") != null) conditionMap.put("search_order_no", request.getParameter("search_order_no"));
		if (request.getParameter("search_order_name") != null) conditionMap.put("search_order_name", request.getParameter("search_order_name"));
		if (request.getParameter("search_productive_year") != null) conditionMap.put("search_productive_year", request.getParameter("search_productive_year"));
		if ((request.getParameter("search_factory") != "")&&(request.getParameter("search_factory") != null)) conditionMap.put("search_factory", Integer.valueOf(request.getParameter("search_factory")));
		if (request.getParameter("order_id") != null){
			conditionMap.put("order_id", request.getParameter("order_id"));
		}
		if (request.getParameter("start") != null){
			conditionMap.put("start",request.getParameter("start"));
			conditionMap.put("length",request.getParameter("length"));
		}
		List datalist=new ArrayList();
		datalist=orderService.getOrderDetailList(conditionMap);	
		
		model.put("data", datalist);
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
		
		String factoryOrderDetail = request.getParameter("factoryOrderDetail");//根据factoryOrderDetail合并后的工厂订单列表
		String delOrderList = request.getParameter("del_order_list");//需要删除的工厂订单列表
		String order_id=request.getParameter("data_order_id");//操作的订单id
		Map<String,String> ordermap=new HashMap<String,String>();
		ordermap.put("order_id", order_id);
		ordermap.put("delivery_date", request.getParameter("delivery_date"));
		ordermap.put("memo", request.getParameter("memo"));
		ordermap.put("curTime", curTime);
		ordermap.put("userid", userid);
		ordermap.put("customer",request.getParameter("customer"));
		
/*		JsonArray jsar_del=new JsonArray();
		JsonParser parser = new JsonParser();
		JsonElement jel=parser.parse(factoryOrderDetail);
		JsonArray jsonArray = null;
		
		if(jel.isJsonArray()){
			jsonArray = jel.getAsJsonArray();
		}
		
		JsonElement jel_del=parser.parse(delOrderList);
		if(jel_del.isJsonArray()){
			jsar_del = jel_del.getAsJsonArray();
		}*/
		JSONArray jsonArray=JSONArray.fromObject(factoryOrderDetail);
		JSONArray jsar_del=JSONArray.fromObject(delOrderList);
		try{
			orderService.editOrder(jsar_del,jsonArray,ordermap);
			initModel(true,"修改成功！",null);
		}catch(Exception e){
			initModel(false,"修改失败！",null);
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
		order.setOrder_no(getOrderSerialByYear(request.getParameter("data_productive_year")));
		order.setOrder_name(request.getParameter("data_order_name"));
		order.setOrder_code(request.getParameter("data_order_code"));
		order.setOrder_type(request.getParameter("data_order_type"));		
		order.setBus_type_id(Integer.parseInt(request.getParameter("data_bus_type_id")));
		order.setOrder_qty(Integer.parseInt(request.getParameter("data_order_qty")));
		order.setProductive_year(request.getParameter("data_productive_year"));
		order.setDelivery_date(request.getParameter("delivery_date"));
		order.setMemo(request.getParameter("memo"));
		order.setCustomer(request.getParameter("data_customer"));
		order.setOrder_area(request.getParameter("data_order_area"));
		order.setEditor_id(userid);
		order.setEdit_date(curTime);
		
		String factoryOrderNum = request.getParameter("factoryOrderNum");
		try{
			orderService.createOrder(order,factoryOrderNum);
			initModel(true, "新增成功！", null);
		}catch(Exception e){
			initModel(false, "新增失败！", null);
		}
				
		return mv.getModelMap();
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
	/**
	 * 订单配置导入页面
	 * @return
	 */
	@RequestMapping("/configUpload")
	public ModelAndView configUpload(){ 
		mv.setViewName("order/configUpload");
        return mv;  
    } 
	
	@RequestMapping("/showOrderConfigList")
	@ResponseBody
	public ModelMap showOrderConfigList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String orderNo=request.getParameter("orderNo");//订单编号
		String orderName=request.getParameter("orderName");//订单名称模糊匹配
		String actYear=request.getParameter("actYear");//生产年份
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("orderNo", orderNo);
		condMap.put("orderName", orderName);
		condMap.put("actYear",actYear);
		Map<String,Object> result=orderService.getOrderConfigListPage(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	@RequestMapping("/getConfigDetailList")
	@ResponseBody
	public ModelMap getConfigDetailList(){
		model=new ModelMap();
		String configId=request.getParameter("configId");
		List datalist=orderService.getConfigDetailList(configId);
		model.put("data",datalist);
		model.put("draw", request.getParameter("draw"));
		return model;
	}
	
	
	@RequestMapping(value="/uploadConfigListFile",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadConfigListFile(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName="configDetail.xls";
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
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
		for (Object[] data : excelModel.getData()) {
			Map<String, String> infomap = new HashMap<String, String>();

			infomap.put("parts_type", data[0] == null ? null : data[0].toString().trim());
			infomap.put("sap_mat", data[1] == null ? null : data[1].toString().trim());
			infomap.put("components_no", data[2] == null ? null : data[2].toString().trim());
			infomap.put("components_name", data[3] == null ? null : data[3].toString().trim());
			infomap.put("size", data[4] == null ? null : data[4].toString().trim());
			infomap.put("type", data[5] == null ? null : data[5].toString().trim());
			infomap.put("vendor", data[6] == null ? null : data[6].toString().trim());
			infomap.put("workshop", data[7] == null ? null : data[7].toString().trim());
			infomap.put("notes", data[8] == null ? null : data[8].toString().trim());

			addList.add(infomap);
		}
		initModel(true,"导入成功！",addList);
		}catch(Exception e){
			initModel(false,"导入失败！",null);
		}
		return mv.getModelMap();
	}

	@RequestMapping("/saveOrderConfigDetail")
	@ResponseBody
	public ModelMap saveOrderConfigDetail(){
		Map<String,Object> configDetail=new HashMap<String,Object>();
		configDetail.put("config_id",Integer.parseInt(request.getParameter("config_id")));
		configDetail.put("order_id",Integer.parseInt(request.getParameter("order_id")));
		configDetail.put("config_name",request.getParameter("config_name"));
		configDetail.put("config_qty",request.getParameter("config_qty"));
		configDetail.put("materialNo",request.getParameter("materialNo"));
		configDetail.put("customer",request.getParameter("customer"));
		configDetail.put("material",request.getParameter("material"));
		configDetail.put("tire_type",request.getParameter("tire_type"));
		configDetail.put("spring_num",request.getParameter("spring_num"));
		configDetail.put("bus_seats",request.getParameter("bus_seats"));
		configDetail.put("rated_voltage",request.getParameter("rated_voltage"));
		configDetail.put("battery_capacity",request.getParameter("battery_capacity"));
		configDetail.put("passenger_num",request.getParameter("passenger_num"));
		configDetail.put("config_detail",request.getParameter("config_detail"));
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		configDetail.put("editor_id", userid);
		configDetail.put("edit_date", curTime);
		
		try{
			orderService.saveOrderConfigDetail(configDetail);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(true,"保存失败！",null);
		}
		return mv.getModelMap();
		
	}
	
	/**
	 * 订单配置分配页面
	 * @return
	 */
	@RequestMapping("/configAllot")
	public ModelAndView configAllot(){ 
		mv.setViewName("order/configAllot");
        return mv;  
    } 
	/**
	 * 获取配置产地分配列表
	 * @return
	 */
	@RequestMapping("/getConfigAllotList")
	@ResponseBody
	public ModelMap getConfigAllotList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));//jquerydatatables 
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String orderNo=request.getParameter("orderNo");//订单编号
		String orderName=request.getParameter("orderName");//订单名称模糊匹配
		String actYear=request.getParameter("actYear");//生产年份
		String factory=request.getParameter("factory");//工厂
		String orderColumn=request.getParameter("orderColumn");//排序字段
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("orderNo", orderNo);
		condMap.put("orderName", orderName);
		condMap.put("actYear",actYear);
		condMap.put("factory", factory);
		condMap.put("orderColumn", orderColumn);
		
		Map<String,Object> result=orderService.getConfigAllotListPage(condMap);
		model.addAllAttributes(result);
		return model;
	}
	
	/**
	 * 根据订单获取配置列表
	 * @return
	 */
	@RequestMapping("/getConfigListByOrder")
	@ResponseBody
	public ModelMap getConfigListByOrder(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("order_id", request.getParameter("order_id"));
		condMap.put("factory_id", request.getParameter("factory_id"));
		List datalist=orderService.getConfigListByOrder(condMap);
		model.put("data", datalist);
		return model;
	}
	
	/**
	 * 配置产地分配
	 * @return
	 */
	@RequestMapping("/updateConfigAllot")
	@ResponseBody
	public ModelMap updateConfigAllot(){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		String paramstr=request.getParameter("allot_config_list");
/*		JsonArray jsa= new JsonArray();
		JsonParser parser=new JsonParser();
		JsonElement jel=parser.parse(paramstr);	
		Gson gson=new Gson();
		
		if(jel.isJsonArray()){
			jsa=jel.getAsJsonArray();
		}*/
		JSONArray jsa=JSONArray.fromObject(paramstr);
		Iterator it=jsa.iterator();
		List detail_list=new ArrayList();
		/**
		 * 封装需要保存的数据
		 */
		while(it.hasNext()){
			/*JsonElement el=(JsonElement)it.next();*/
			JSONObject el=(JSONObject) it.next();
			BmsOrderConfigAllot allotBean=new BmsOrderConfigAllot();
			/*allotBean=gson.fromJson(el, BmsOrderConfigAllot.class);*/
			allotBean=(BmsOrderConfigAllot) JSONObject.toBean(el, BmsOrderConfigAllot.class);
			allotBean.setEditor_id(userid);
			allotBean.setEdit_date(curTime);
			
			detail_list.add(allotBean);
		}
		//调用service保存数据
		try{
			orderService.saveOrderConfigAllot(detail_list);
			initModel(true,"分配成功！",null);
		}catch(Exception e){
			initModel(false,"分配失败!",null);
		}
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
	
	/**
	 * 查询订单配置数量之和
	 * @return
	 */
	@RequestMapping("/getOrderConfigTotalQty")
	@ResponseBody
	public ModelMap getOrderConfigTotalQty(){
		model=new ModelMap();
		String order_id=request.getParameter("order_id");
		orderService.getOrderConfigTotalQty(order_id,model);
		return model;
	}
	/**
	 * 根据订单编号查询订单信息
	 * @return
	 */
	@RequestMapping("/getOrderByNo")
	@ResponseBody
	public ModelMap getOrderByNo(){
		model=new ModelMap();
		String order_no=request.getParameter("order_no");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("orderNo", order_no);
		Map map=orderService.getOrderByNo(condMap);
		model.put("data", map);
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
		mv.getModelMap().addAllAttributes(map);
        return mv;  
    } 
	@RequestMapping(value="/uploadBomInfo",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadBomInfo(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName="bom.xls";
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

		List<Map<String, String>> addList = new ArrayList<Map<String, String>>();
		for (Object[] data : excelModel.getData()) {
			int line=6; // 模板从第6行开始是bom数据
			String errorMessage="";
			Map<String, String> infomap = new HashMap<String, String>();
            if(data[0] != null && !data[0].toString().equals("")){
            	infomap.put("item_no",data[0].toString().trim());
            }else{
            	errorMessage="Line "+line+": Item不能为空;";
            }
            if(data[1] != null && !data[1].toString().equals("")){
            	infomap.put("SAP_material",data[1].toString().trim());
            }else{
            	errorMessage+="SAP不能为空;";
            }
			infomap.put("BYD_P/N", data[2] == null ? null : data[2].toString().trim());
			if(data[3] != null && !data[3].toString().equals("")){
				infomap.put("part_name",data[3].toString().trim());
            }else{
            	errorMessage+="Part Name不能为空;";
            }
			infomap.put("specification", data[4] == null ? null : data[4].toString().trim());
			if(data[5] != null && !data[5].toString().equals("")){
				infomap.put("unit",data[5].toString().trim());
            }else{
            	errorMessage+="Unit不能为空;";
            }
			if(data[6] != null && !data[6].toString().equals("")){
				infomap.put("quantity",data[6].toString().trim());
				boolean isNumber=isNumber(data[6].toString().trim());
				if(!isNumber){
					errorMessage+="Quantity必须是数字;";
				}
            }else{
            	errorMessage+="Quantity不能为空;";
            }
			infomap.put("en_description", data[7] == null ? null : data[7].toString().trim());
			if(data[8] != null && !data[8].toString().equals("")){
				infomap.put("vendor",data[8].toString().trim());
            }else{
            	errorMessage+="Vendor不能为空;";
            }
			if(data[9] != null && !data[9].toString().equals("")){
				infomap.put("station_code",data[9].toString().trim());
            }else{
            	errorMessage+="Station Code不能为空;";
            }
			infomap.put("note", data[11] == null ? null : data[11].toString().trim());
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
		String sapNo=request.getParameter("sapNo");
		String stationCode=request.getParameter("stationCode");
		String plant=request.getParameter("plant");//工厂
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("projectNo", projectNo);
		condMap.put("stationCode",stationCode);
		condMap.put("plant", plant);
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
		String stationCode=request.getParameter("stationCode");
		String compareType=request.getParameter("compareType");
//		condMap.put("draw", draw);
//		condMap.put("start", start);
//		condMap.put("length", length);
		condMap.put("projectNo", projectNo);
		condMap.put("stationCode",stationCode);
		condMap.put("sapNo", sapNo);
		condMap.put("compareType", compareType);
		Map<String,Object> result=orderService.getBomCompareList(condMap);
		model.addAllAttributes(result);
		return model;
	}
}
