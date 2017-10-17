package com.byd.bms.quality.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletContext;

import org.apache.commons.io.FileUtils;
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

import com.byd.bms.quality.service.IQualityService;
import com.byd.bms.quality.model.BmsBaseQCStdRecord;
import com.byd.bms.quality.model.MaterialExceptionLogs;
import com.byd.bms.quality.model.ProblemImproveBean;
import com.byd.bms.quality.model.ProcessFaultBean;
import com.byd.bms.quality.model.QualityTargetBean;
import com.byd.bms.quality.model.StdFaultLibBean;
import com.byd.bms.setting.service.ISettingService;
import com.byd.bms.util.ExcelModel;
import com.byd.bms.util.ExcelTool;
import com.byd.bms.util.controller.BaseController;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * 品质模块Controller
 * @author xiong.jianwu
 *
 */
@Controller
@RequestMapping("/quality")
public class QualityController extends BaseController {
	static Logger logger = Logger.getLogger("QUALITY");
	@Autowired
	protected IQualityService qualityService;
	@Autowired
	protected ISettingService settingService;
	//======================== tj end=================================//
	@RequestMapping("/standardFaultLib")
	public ModelAndView standardFaultLib(){ 			//标准故障库
		mv.setViewName("quality/standardFaultLib");
        return mv;  
    }
	
	//========================yk start=================================//
	
	/************START punchList AddBy Yangke 171013******************************/
	@RequestMapping("/punchList")
	public ModelAndView punchList(){
		mv.setViewName("quality/punchList");
        return mv;  
    }
	
	
	/************END punchList****************************************************/
	
	@RequestMapping("addFaultLib")
	@ResponseBody
	public ModelMap addFaultLib(){
		int userid=(int) session.getAttribute("user_id");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("defectType",request.getParameter("defect_type").toString());
		map.put("defectCode",request.getParameter("defect_code").toString());
		map.put("faultLevel",request.getParameter("faultLevel").toString());
		map.put("defectName",request.getParameter("defect_name").toString());
		map.put("editorId",userid+"");
		map.put("editDate",curTime);
		
		int result = qualityService.insertFaultLib(map);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("updateFaultLib")
	@ResponseBody
	public ModelMap updateFaultLib(){
		int userid=(int) session.getAttribute("user_id");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("defectType",request.getParameter("defect_type").toString());
		map.put("defectCode",request.getParameter("defect_code").toString());
		map.put("faultLevel",request.getParameter("faultLevel").toString());
		map.put("defectName",request.getParameter("defect_name").toString());
		map.put("editorId",userid+"");
		map.put("editDate",curTime);
		map.put("id", request.getParameter("id").toString());
		
		int result = qualityService.updateFaultLib(map);
		initModel(true,String.valueOf(result),null);
		model = mv.getModelMap();
		return model;
	}	
	
	@SuppressWarnings("rawtypes")
	@RequestMapping("/getFaultLibList")
	@ResponseBody
	public ModelMap getFaultLibList(){
		String conditions = request.getParameter("conditions");
		JSONObject jo=JSONObject.fromObject(conditions);
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		conditionMap.put("draw", draw);
		conditionMap.put("start", start);
		conditionMap.put("length", length);
		for(Iterator it=jo.keys();it.hasNext();){
			String key=(String) it.next();
			//System.out.println(key);
			if(key.equals("faultLevel")){
				Object[] arr=jo.getJSONArray(key).toArray();
				conditionMap.put(key, arr);
			}else
			conditionMap.put(key, jo.get(key));
		}
		
		Map<String, Object> result = qualityService.getFaultLibList(conditionMap);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	/**
	 * 订单关键零部件页面
	 * @return
	 */
	@RequestMapping("/orderKeyParts")
	public ModelAndView orderKeyParts(){
		mv.setViewName("quality/orderKeyParts");
		return mv;
	}
	
	/**
	 * 订单配置列表
	 * @return
	 */
	@RequestMapping("/getProjectKeyPartsTemplateList")
	@ResponseBody
	public ModelMap getProjectKeyPartsTemplateList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String project_no=request.getParameter("project_no");
		String bus_type=request.getParameter("bus_type");//车型
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_no", project_no);
		condMap.put("bus_type",bus_type);
		qualityService.getOrderKeyPartsTemplateList(condMap,model);
		return model;
	}
	
	/**
	 * 关键零部件模板上传
	 * @return
	 */
	@RequestMapping(value="/uploadKeyPartsFile",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadKeyPartsFile(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName=file.getOriginalFilename();
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("4", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("5", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("6", ExcelModel.CELL_TYPE_CANNULL);
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
        String stationStr=settingService.checkStation(queryMap, "Name");
        String workshopStr=settingService.checkWorkshop(queryMap, "Name");
		List<Map<String, String>> addList = new ArrayList<Map<String, String>>();
		int i=1;
		for (Object[] data : excelModel.getData()) {
			Map<String, String> infomap = new HashMap<String, String>();

			infomap.put("item_no", data[0] == null ? null : data[0].toString().trim());
			infomap.put("SAP_material", data[1] == null ? null : data[1].toString().trim());
			infomap.put("parts_name", data[2] == null ? null : data[2].toString().trim());
			infomap.put("BYD_NO", data[3] == null ? null : data[3].toString().trim());
			infomap.put("vendor", data[4] == null ? null : data[4].toString().trim());
			if(data[5] != null && !data[5].toString().trim().equals("")){
				int index=workshopStr.indexOf(data[5].toString().trim());
				if(index<0){
					infomap.put("error", "Workshop cannot be found");
				}
			}else{
				infomap.put("error", "Workshop cannot be Null");
			}
			infomap.put("workshop", data[5] == null ? null : data[5].toString().trim());
			if(data[6] != null && !data[6].toString().trim().equals("")){
				int index=stationStr.indexOf(data[6].toString().trim());
				if(index<0){
					infomap.put("error", "Station cannot be found");
				}
			}else{
				infomap.put("error", "Station cannot be Null");
			}
			infomap.put("station", data[6] == null ? null : data[6].toString().trim());
			
			addList.add(infomap);
			i++;
		}
		initModel(true,"Success！",addList);
		
		}catch(Exception e){
			initModel(false,"Failure！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	
	/**
	 * 保存关键零部件明细
	 * @return
	 */
	@RequestMapping("saveKeyPartsTemplateInfo")
	@ResponseBody
	public ModelMap saveKeyPartsTemplateInfo(){
		Map<String,Object> keyParts=new HashMap<String,Object>();
		keyParts.put("parts_detail", request.getParameter("addList"));
		keyParts.put("project_id", request.getParameter("project_id"));
		keyParts.put("version", request.getParameter("version"));
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		keyParts.put("editor_id", userid);
		keyParts.put("edit_date", curTime);
		try{
			qualityService.saveKeyPartsDetail(keyParts);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false,"保存失败！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	
	/**
	 *  查询关键零部件明细
	 * @return
	 */
	@RequestMapping("getKeyPartsList")
	@ResponseBody
	public ModelMap getKeyPartsList(){
		model=new ModelMap();
		String project_id=request.getParameter("project_id");//订单
		String version=request.getParameter("version");
		HashMap<String, Object> condMap =new HashMap<String,Object>();
		condMap.put("project_id", project_id);
		condMap.put("version", version);
		qualityService.getKeyPartsList(condMap,model);
		
		return model;
	}
	/**
	 * 订单成品记录表模板
	 * @return
	 */
	@RequestMapping("/productRecordOrderTpl")
	public ModelAndView productRecordOrderTpl(){
		mv.setViewName("quality/productRecordOrderTpl");
		return mv;
	}
	/**
	 * 订单配置列表
	 * @return
	 */
	@RequestMapping("/getPrdRcdOrderTplList")
	@ResponseBody
	public ModelMap getPrdRcdOrderTplList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String project_no=request.getParameter("project_no");
		String bus_type=request.getParameter("bus_type");//车型
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_no", project_no);
		condMap.put("bus_type",bus_type);
		qualityService.getPrdRcdOrderTplList(condMap,model);
		return model;
	}
	
	/**
	 * 关键零部件模板上传
	 * @return
	 */
	@RequestMapping(value="/uploadPrdRcdOrderTplFile",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadPrdRcdOrderTplFile(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName=file.getOriginalFilename();
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("2", ExcelModel.CELL_TYPE_STRING);
		dataType.put("3", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("4", ExcelModel.CELL_TYPE_CANNULL);
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
		String stationStr=settingService.checkStation(queryMap,"Name");
		String processStr=settingService.checkProcess(queryMap,"Name");
		List<Map<String, String>> addList = new ArrayList<Map<String, String>>();
		for (Object[] data : excelModel.getData()) {
			Map<String, String> infomap = new HashMap<String, String>();

			infomap.put("item_no", data[0] == null ? null : data[0].toString().trim());
			if(data[1] != null && !data[1].toString().trim().equals("")){
				int index=stationStr.indexOf(data[1].toString().trim());
				if(index<0){
					infomap.put("error", "Station cannot be found");
				}
			}else{
				infomap.put("error", "Station cannot be Null");
			}
			infomap.put("station", data[1] == null ? null : data[1].toString().trim());
			if(data[2] != null && !data[2].toString().trim().equals("")){
				int index=processStr.indexOf(data[1].toString().trim());
				if(index<0){
					infomap.put("error", "Process Name cannot be found");
				}
			}else{
				infomap.put("error", "Process Name cannot be Null");
			}
			infomap.put("process_name", data[2] == null ? null : data[2].toString().trim());
			infomap.put("inspection_item", data[3] == null ? null : data[3].toString().trim());
			infomap.put("specification_and_standard", data[4] == null ? null : data[4].toString().trim());
			addList.add(infomap);
		}
		initModel(true,"Success！",addList);
		
		}catch(Exception e){
			initModel(false,"Failure！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	
	/**
	 * 保存订单成品模板明细
	 * @return
	 */
	@RequestMapping("savePrdRcdOrderTplInfo")
	@ResponseBody
	public ModelMap savePrdRcdOrderTplInfo(){
		Map<String,Object> keyParts=new HashMap<String,Object>();
		keyParts.put("detail", request.getParameter("addList"));
		keyParts.put("project_id", request.getParameter("project_id"));
		keyParts.put("version", request.getParameter("version"));
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		keyParts.put("editor_id", userid);
		keyParts.put("edit_date", curTime);
		try{
			qualityService.saveInspectionRecordTemplate(keyParts);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false,"保存失败！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	
	/**
	 *  查询关键零部件明细
	 * @return
	 */
	@RequestMapping("getPrdRcdOrderTplDetailList") 
	@ResponseBody
	public ModelMap getPrdRcdOrderTplDetailList(){
		model=new ModelMap();
		String project_id=request.getParameter("project_id");//订单
		String version=request.getParameter("version");
		HashMap<String, Object> condMap =new HashMap<String,Object>();
		condMap.put("project_id", project_id);
		condMap.put("version", version);
		qualityService.getPrdRcdOrderTplDetailList(condMap,model);
		
		return model;
	}
	
	@RequestMapping("getProjectByNo")
	@ResponseBody
	public ModelMap getProjectByNo(){
		model=new ModelMap();
		String project_no=request.getParameter("project_no");
		HashMap<String, Object> condMap =new HashMap<String,Object>();
		condMap.put("project_no", project_no);
		qualityService.getProjectByNo(condMap,model);
		return model;
	}
	/**
	 * 订单成品检测模板
	 * @return
	 */
	@RequestMapping("/productRecordTestingTpl")
	public ModelAndView productRecordTestingTpl(){
		mv.setViewName("quality/productRecordTestingTpl");
		return mv;
	}
	/**
	 * 订单检测模板列表
	 * @return
	 */
	@RequestMapping("/getPrdRcdTestingTplList")
	@ResponseBody
	public ModelMap getPrdRcdTestingTplList(){
		model=new ModelMap();
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String project_no=request.getParameter("project_no");
		String bus_type=request.getParameter("bus_type");
		String test_type_value=request.getParameter("test_type_value");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_no", project_no);
		condMap.put("bus_type",bus_type);
		condMap.put("test_type_value",test_type_value);
		qualityService.getPrdRcdTestingTplList(condMap,model);
		return model;
	}
	
	/**
	 * 检测模板上传
	 * @return
	 */
	@RequestMapping(value="/uploadTestingTemplateFile",method=RequestMethod.POST)
	@ResponseBody
	public ModelMap uploadTestingTemplateFile(@RequestParam(value="file",required=false) MultipartFile file){
		logger.info("uploading.....");
		String fileName=file.getOriginalFilename();
		try{
		ExcelModel excelModel = new ExcelModel();
		excelModel.setReadSheets(1);
		excelModel.setStart(1);
		Map<String, Integer> dataType = new HashMap<String, Integer>();
		dataType.put("0", ExcelModel.CELL_TYPE_CANNULL);
		dataType.put("1", ExcelModel.CELL_TYPE_CANNULL);
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
		for (Object[] data : excelModel.getData()) {
			Map<String, String> infomap = new HashMap<String, String>();

			infomap.put("item_no", data[0] == null ? null : data[0].toString().trim());
			infomap.put("inspection_item", data[1] == null ? null : data[1].toString().trim());
			infomap.put("specification_standard", data[2] == null ? null : data[2].toString().trim());
			addList.add(infomap);
		}
		initModel(true,"Success！",addList);
		
		}catch(Exception e){
			initModel(false,"Failure！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	/**
	 * 保存检测模板明细
	 * @return
	 */
	@RequestMapping("savePrdRcdTestingTplInfo")
	@ResponseBody
	public ModelMap savePrdRcdTestingTplInfo(){
		Map<String,Object> testing=new HashMap<String,Object>();
		testing.put("project_id", request.getParameter("project_id"));
		testing.put("header_id", request.getParameter("header_id"));
		testing.put("version", request.getParameter("version"));
		testing.put("initiated", request.getParameter("initiated"));
		testing.put("approved", request.getParameter("approved"));
		testing.put("test_type_value", request.getParameter("test_type_value"));
		testing.put("remarks", request.getParameter("remarks"));
		JSONArray add_arr=JSONArray.fromObject(request.getParameter("addList"));
		Iterator it=add_arr.iterator();
		List<Map<String,Object>> detail=new ArrayList<Map<String,Object>>();
		while(it.hasNext()){
			JSONObject jel=(JSONObject) it.next();
			Map<String,Object> bom=(Map<String, Object>) JSONObject.toBean(jel, Map.class);
			detail.add(bom);
		}
		testing.put("detail", detail);
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		testing.put("editor_id", userid);
		testing.put("edit_date", curTime);
		try{
			qualityService.saveTestingTemplate(testing);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			logger.error(e.getMessage());
			initModel(false,"保存失败！"+e.getMessage(),null);
		}
		return mv.getModelMap();
	}
	
	@RequestMapping("getTestingTemplateDetailList") 
	@ResponseBody
	public ModelMap getTestingTemplateDetailList(){
		model=new ModelMap();
		String header_id=request.getParameter("header_id");
		HashMap<String, Object> condMap =new HashMap<String,Object>();
		condMap.put("header_id", header_id);
		qualityService.getTestingTemplateByHeader(condMap,model);
		
		return model;
	}
	/* 车辆成品记录表维护页面 */
	@RequestMapping("/inspectionRecord")
	public ModelAndView inspectionRecord(){ 
		mv.setViewName("quality/inspectionRecord");
        return mv;  
    } 
	/**
	 * 车辆成品记录
	 * @return
	 */
	@RequestMapping("/getInspectionRecordList")
	@ResponseBody
	public ModelMap getInspectionRecordList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String project_no=request.getParameter("project_no");
		String bus_number=request.getParameter("bus_number");
		String plant=request.getParameter("plant");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_no", project_no);
		condMap.put("bus_number",bus_number);
		condMap.put("plant",plant);
		qualityService.getPrdRcdOrderTplList(condMap,model);
		return model;
	}
	/* 零部件跟踪页面 */
	@RequestMapping("/keyPartsTrace")
	public ModelAndView keyPartsTrace(){ 
		mv.setViewName("quality/keyPartsTrace");
        return mv;  
    } 
	
	@RequestMapping("/getKeyPartsTraceList")
	@ResponseBody
	public ModelMap getKeyPartsTraceList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		int draw=Integer.parseInt(request.getParameter("draw"));
		int start=Integer.parseInt(request.getParameter("start"));
		int length=Integer.parseInt(request.getParameter("length"));
		String project_no=request.getParameter("project_no");
		String bus_type=request.getParameter("bus_type");
		String bus_number=request.getParameter("bus_number");
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("project_no", project_no);
		condMap.put("bus_type",bus_type);
		condMap.put("bus_number",bus_number);
		qualityService.getKeyPartsTraceList(condMap,model);
		return model;
	}
	@RequestMapping("/getBusNumberDetailList")
	@ResponseBody
	public ModelMap getBusNumberDetailList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		String bus_number=request.getParameter("bus_number");
		condMap.put("bus_number",bus_number);
		qualityService.getBusNumberDetailList(condMap,model);
		return model;
	}
	@RequestMapping("/getBusNumberTemplateList")
	@ResponseBody
	public ModelMap getBusNumberTemplateList(){
		model=new ModelMap();;
		Map<String,Object> condMap=new HashMap<String,Object>();
		String bus_number=request.getParameter("bus_number");
		String project_id=request.getParameter("project_id");
		condMap.put("bus_number",bus_number);
		condMap.put("project_id",project_id);
		qualityService.getBusNumberTemplateList(condMap,model);
		return model;
	}
	@RequestMapping("/addKeyParts")
	@ResponseBody
	public ModelMap addKeyParts() {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int) session.getAttribute("user_id");
		String paramstr=request.getParameter("key_parts_list");
		JSONArray jsa=JSONArray.fromObject(paramstr);
		Iterator it=jsa.iterator();
		List<Map<String,Object>> list=new ArrayList<Map<String,Object>>();
		/**
		 * 封装需要保存的数据
		 */
		while(it.hasNext()){
			JSONObject el=(JSONObject) it.next();	
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("trace_id", el.get("trace_id"));
			map.put("batch", el.get("batch"));
			map.put("bus_number", el.get("bus_number"));
			map.put("SAP_material",el.get("SAP_material"));
			map.put("parts_name",el.get("parts_name"));
			map.put("vendor",el.get("vendor"));
			map.put("station",el.get("station"));
			map.put("workshop",el.get("workshop"));
			map.put("trace_template_id",el.get("trace_template_id"));
			map.put("project_id",el.get("project_id"));
			map.put("production_plant_id",el.get("production_plant_id"));
			map.put("edit_date",curTime);
			map.put("editor_id",userid);
			list.add(map);
		}
		//调用service保存数据
		try{
			int result=qualityService.updateKeyParts(list);
			initModel(true,"保存成功！",null);
		}catch(Exception e){
			initModel(false,"保存失败!",null);
		}
		return mv.getModelMap();
	}
}
