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
		String fileName="vin.xls";
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
}
