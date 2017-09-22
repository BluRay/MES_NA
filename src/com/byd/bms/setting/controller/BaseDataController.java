package com.byd.bms.setting.controller;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.byd.bms.setting.model.BmsBaseBusType;
import com.byd.bms.setting.model.BmsBaseFactory;
import com.byd.bms.setting.model.BmsBaseFunction;
import com.byd.bms.setting.model.BmsBaseFunctionPermission;
import com.byd.bms.setting.model.BmsBaseLine;
import com.byd.bms.setting.model.BmsBaseProcess;
import com.byd.bms.setting.model.BmsBaseRole;
import com.byd.bms.setting.model.BmsBaseRolePermission;
import com.byd.bms.setting.model.BmsBaseStandardWorkgroup;
import com.byd.bms.setting.model.BmsBaseStation;
import com.byd.bms.setting.model.BmsBaseVinRule;
import com.byd.bms.setting.model.BmsBaseWorkshop;
import com.byd.bms.setting.model.BmsUserRole;
import com.byd.bms.setting.service.ISettingService;
import com.byd.bms.util.MD5Util;
import com.byd.bms.util.controller.BaseController;
import com.byd.bms.util.model.BmsBaseUser;


@Controller
@RequestMapping("/setting")
public class BaseDataController extends BaseController {
	static Logger logger = Logger.getLogger("SETTING");
	@Autowired
	protected ISettingService settingService;
	private static List orgList;
	
	@RequestMapping("/roleManagerPage")
	public ModelAndView roleManagerPage(){
		mv.setViewName("setting/roleManager");
        return mv;  
	}
	
	@RequestMapping("/userManagerPage")
	public ModelAndView userManagerPage(){
		mv.setViewName("setting/userManager");
        return mv;  
	}
	
	@RequestMapping("/userRoleManagerPage")
	public ModelAndView userRoleManagerPage(){
		mv.setViewName("setting/userRoleManager");
        return mv;  
	}
	
	@RequestMapping("/addUser")
	@ResponseBody
	public ModelMap addUser() throws NoSuchAlgorithmException, UnsupportedEncodingException{
		String staff_number=request.getParameter("staff_number");
		String username=request.getParameter("username");
		String email=request.getParameter("email");
		String telephone=request.getParameter("telephone");
		String cellphone=request.getParameter("cellphone");
		String password=request.getParameter("password");
		String display_name=request.getParameter("display_name");
		String factory_id=request.getParameter("factory_id");
		//String department_id=request.getParameter("department_id");
		String admin=request.getParameter("admin");
		String edit_user = request.getSession().getAttribute("user_name") + "";
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_time = df.format(new Date());
		
		BmsBaseUser user = new BmsBaseUser();
		user.setStaff_number(staff_number);
		user.setUsername(username);
		user.setEmail(email);
		user.setTelephone(telephone);
		user.setCellphone(cellphone);
		user.setPassword(MD5Util.getEncryptedPwd(password));
		user.setDisplay_name(display_name);
		user.setFactory_id(Integer.valueOf(factory_id));
		//user.setDepartment_id(Integer.valueOf(department_id));
		user.setAdmin(admin);
		user.setCreate_user(edit_user);
		user.setCreate_time(edit_time);
		int reuslt = settingService.addUser(user);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/editUser")
	@ResponseBody
	public ModelMap editUser(){
		String staff_number=request.getParameter("staff_number");
		String username=request.getParameter("username");
		String email=request.getParameter("email");
		String telephone=request.getParameter("telephone");
		String cellphone=request.getParameter("cellphone");
		String display_name=request.getParameter("display_name");
		String factory_id=request.getParameter("factory_id");
		String admin=request.getParameter("admin");
		String edit_user = request.getSession().getAttribute("user_name") + "";
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_time = df.format(new Date());
		
		BmsBaseUser user = new BmsBaseUser();
		user.setStaff_number(staff_number);
		user.setUsername(username);
		user.setEmail(email);
		user.setTelephone(telephone);
		user.setCellphone(cellphone);
		user.setDisplay_name(display_name);
		user.setFactory_id(Integer.valueOf(factory_id));
		user.setAdmin(admin);
		user.setCreate_user(edit_user);
		user.setCreate_time(edit_time);
		int reuslt = settingService.editUser(user);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/delUser")
	@ResponseBody
	public ModelMap delUser(){
		String staff_number=request.getParameter("staff_number");
		BmsBaseUser user = new BmsBaseUser();
		user.setStaff_number(staff_number);
		int reuslt = settingService.delUser(user);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/resetUserPass")
	@ResponseBody
	public ModelMap resetUserPass() throws NoSuchAlgorithmException, UnsupportedEncodingException{
		String staff_number=request.getParameter("staff_number");
		BmsBaseUser user = new BmsBaseUser();
		user.setStaff_number(staff_number);
		user.setPassword(MD5Util.getEncryptedPwd(staff_number));
		int reuslt = settingService.resetUserPass(user);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getUserList")
	@ResponseBody
	public ModelMap getUserList(){
		int draw=(request.getParameter("draw")!=null)?Integer.parseInt(request.getParameter("draw")):1;	
		int start=(request.getParameter("start")!=null)?Integer.parseInt(request.getParameter("start")):0;		//分页数据起始数
		int length=(request.getParameter("length")!=null)?Integer.parseInt(request.getParameter("length")):500;	//每一页数据条数
		String search_key=request.getParameter("search_key");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("draw", draw);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("search_key", search_key);
		condMap.put("orderColumn", "id");
		
		Map<String,Object> result=settingService.getUserList(condMap);
		model.addAllAttributes(result);
		/**
		List<Object> result = new ArrayList<Object>();
		List<BmsBaseUser> list = new ArrayList<BmsBaseUser>();
		list = settingService.getUserList(search_key);	
		result.add(0,list);
		initModel(true,"success",result);
		model = mv.getModelMap();**/
		return model;
	}
	
	@RequestMapping("/getRoleList")
	@ResponseBody
	public ModelMap getRoleList(){		
		List<BmsBaseRole> list = new ArrayList<BmsBaseRole>();
		list = settingService.getRoleList();		
		initModel(true,"success",list);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getUserRoleList")
	@ResponseBody
	public ModelMap getUserRoleList(){
		String staff_number=request.getParameter("staff_number");
		List<Object> result = new ArrayList<Object>();
		List<BmsBaseRole> list = new ArrayList<BmsBaseRole>();
		list = settingService.getRoleList();
		result.add(0,list);
		
		List<BmsUserRole> list2 = new ArrayList<BmsUserRole>();
		list2 = settingService.getUserRole(staff_number);
		result.add(1,list2);
		
		initModel(true,"success",result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getFunctionList")
	@ResponseBody
	public ModelMap getFunctionList(){
		String role_id=request.getParameter("role_id");
		String staff_number=request.getParameter("staff_number");
		List<Object> result = new ArrayList<Object>();
		List<BmsBaseFunction> list = new ArrayList<BmsBaseFunction>();
		list = settingService.getFunctionList();				
		result.add(0,list);
		
		List<BmsBaseRolePermission> list2 = new ArrayList<BmsBaseRolePermission>();
		list2 = settingService.getRolePermission(role_id);
		result.add(1,list2);
		
		List<BmsBaseFunctionPermission> list3 = new ArrayList<BmsBaseFunctionPermission>();
		list3 = settingService.getBaseFunctionPermission(role_id);
		result.add(2,list3);
		
		List<BmsUserRole> list4 = new ArrayList<BmsUserRole>();
		list4 = settingService.getOneUserRole(staff_number, role_id);
		result.add(3,list4);
		
		initModel(true,"success",result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/addRole")
	@ResponseBody
	public ModelMap addRole(){
		String role_name=request.getParameter("new_role_name");
		String role_description=request.getParameter("new_role_description");
		String type=request.getParameter("new_type");
		String edit_user = request.getSession().getAttribute("user_name") + "";
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_time = df.format(new Date());
		BmsBaseRole role = new BmsBaseRole();
		role.setRole_name(role_name);
		role.setRole_description(role_description);
		role.setType(type);
		role.setEdit_user(edit_user);
		role.setEdit_time(edit_time);
		int reuslt = settingService.addRole(role);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/saveRole")
	@ResponseBody
	public ModelMap saveRole(){
		String role_id=request.getParameter("role_id");
		String function_ids=request.getParameter("function_ids");
		String permission_ids=request.getParameter("permission_ids");
		int reuslt = settingService.delRoleFunction(role_id, function_ids);
		
		String[] function_id = function_ids.split(",");
		for (int i = 0 ; i <function_id.length ; i++ ) {
			reuslt += settingService.addRoleFunction(role_id, function_id[i]);
		}
		
		if(!"".equals(permission_ids))reuslt += settingService.delFunctionPermission(role_id, permission_ids);
		String[] permission_id = permission_ids.split(",");
		for (int i = 0 ; i <permission_id.length ; i++ ) {
			reuslt += settingService.addFunctionPermission(role_id, permission_id[i]);
		}
		
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/saveUserRole")
	@ResponseBody
	public ModelMap saveUserRole(){
		String staff_number=request.getParameter("staff_number");
		String this_role=request.getParameter("this_role");
		String role_permission=request.getParameter("role_permission");
		String factory_permission=request.getParameter("factory_permission");
		String workshop_permission=request.getParameter("workshop_permission");
		String line_permission=request.getParameter("line_permission");
		String edit_user = request.getSession().getAttribute("user_name") + "";
		int reuslt = settingService.saveUserRole(staff_number, this_role, role_permission, factory_permission, workshop_permission, line_permission,edit_user);
		initModel(true,"success",reuslt);
		model = mv.getModelMap();
		return model;
	}
	
	// 工厂
	@RequestMapping("/factory")
	public ModelAndView factoryPage() {
		mv.setViewName("setting/factory");
		return mv;
	}

	// 车间
	@RequestMapping("/workshop")
	public ModelAndView workshopPage() {
		mv.setViewName("setting/workshop");
		return mv;
	}

	// 班组
	@RequestMapping("/workgroup")
	public ModelAndView workgroupPage() {
		mv.setViewName("setting/workgroup");
		return mv;
	}

	// 线别
	@RequestMapping("/line")
	public ModelAndView linePage() {
		mv.setViewName("setting/line");
		return mv;
	}
	
	// 工位
	@RequestMapping("/station")
	public ModelAndView stationPage() {
		mv.setViewName("setting/station");
		return mv;
	}

	// 工序
	@RequestMapping("/process")
	public ModelAndView processPage() {
		mv.setViewName("setting/process");
		return mv;
	}

	// 车型
	@RequestMapping("/busType")
	public ModelAndView busTypePage() {
		mv.setViewName("setting/busType");
		return mv;
	}
	// vin生成规则
	@RequestMapping("/vinRule")
	public ModelAndView vinRulePage() {
		mv.setViewName("setting/vinRule");
		return mv;
	}
	
	/**
	 * ajax 获取工厂列表
	 * 
	 * @return model
	 */
	@RequestMapping("/getFactoryList")
	@ResponseBody
	public ModelMap getFactoryList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int draw = Integer.parseInt(request.getParameter("draw"));// jquerydatatables
		int start = Integer.parseInt(request.getParameter("start"));// 分页数据起始数
		int length = Integer.parseInt(request.getParameter("length"));// 每一页数据条数

		String factory = request.getParameter("factory");// 工厂
		String assembcode = request.getParameter("assembcode");//

		queryMap.put("draw", draw);
		queryMap.put("start", start);
		queryMap.put("length", length);
		queryMap.put("factory", factory);
		queryMap.put("assembcode", assembcode);
		Map<String, Object> result = settingService.getFactoryList(queryMap);
		model.addAllAttributes(result);

		return model;
	}

	@RequestMapping("/addFactory")
	@ResponseBody
	public ModelMap addFactory() {
		try {
			String factory_name = request.getParameter("factory_name") == null ? "" : request.getParameter("factory_name");
			String factory_code = request.getParameter("factory_code") == null ? "" : request.getParameter("factory_code");
			String short_name = request.getParameter("short_name") == null ? "" : request.getParameter("short_name");
			String capacity = request.getParameter("capacity") == null ? "" : request.getParameter("capacity");
			String area = request.getParameter("area") == null ? "" : request.getParameter("area");
			String vin_assembly_code = request.getParameter("vin_assembly_code") == null ? "" : request.getParameter("vin_assembly_code");
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseFactory factory = new BmsBaseFactory();

			factory.setFactoryName(factory_name);
			factory.setFactoryCode(factory_code);
			factory.setShortName(short_name);
			factory.setCapacity(capacity);
			factory.setArea(area);
			factory.setAssemblyCode(vin_assembly_code);
			factory.setMemo(memo);
			factory.setEditorId(editor_id);
			factory.setEditDate(edit_date);

			int reuslt = settingService.addFactory(factory);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}

	@RequestMapping("/updateFactory")
	@ResponseBody
	public ModelMap updateFactory() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			String factory_name = request.getParameter("factory_name") == null ? "" : request.getParameter("factory_name");
			String factory_code = request.getParameter("factory_code") == null ? "" : request.getParameter("factory_code");
			String short_name = request.getParameter("short_name") == null ? "" : request.getParameter("short_name");
			String capacity = request.getParameter("capacity") == null ? "" : request.getParameter("capacity");
			String area = request.getParameter("area") == null ? "" : request.getParameter("area");
			String vin_assembly_code = request.getParameter("vin_assembly_code") == null ? "" : request.getParameter("vin_assembly_code");
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseFactory factory = new BmsBaseFactory();
			
			factory.setId(id);

			factory.setFactoryName(factory_name);
			factory.setFactoryCode(factory_code);
			factory.setShortName(short_name);
			factory.setCapacity(capacity);
			factory.setArea(area);
			factory.setAssemblyCode(vin_assembly_code);
			factory.setMemo(memo);
			factory.setEditorId(editor_id);
			factory.setEditDate(edit_date);

			settingService.updateFactory(factory);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteFactory")
	@ResponseBody
	public ModelMap deleteFactory() {
		try {
			String ids = request.getParameter("ids");
			List<String> idlist = new ArrayList<String>();
			for(String id : ids.split(",")){
				idlist.add(id);
			}
			settingService.deleteFactory(idlist);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	/**
	 * ajax 获取车间列表
	 * 
	 * @return model
	 */
	@RequestMapping("/getWorkshopList")
	@ResponseBody
	public ModelMap getWorkshopList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int draw = Integer.parseInt(request.getParameter("draw"));// jquerydatatables
		int start = Integer.parseInt(request.getParameter("start"));// 分页数据起始数
		int length = Integer.parseInt(request.getParameter("length"));// 每一页数据条数

		String workshopName = request.getParameter("workshopName");//

		queryMap.put("draw", draw);
		queryMap.put("start", start);
		queryMap.put("length", length);
		queryMap.put("workshopName", workshopName);
		Map<String, Object> result = settingService.getWorkshopList(queryMap);
		model.addAllAttributes(result);

		return model;
	}
	/**
	 * ajax 获取车间列表(不分页)
	 * 
	 * @return model
	 */
	@RequestMapping("/getAllWorkshopList")
	@ResponseBody
	public ModelMap getAllWorkshopList() {
		
		Map<String, Object> result = settingService.getAllWorkshopList();
		model.addAllAttributes(result);

		return model;
	}
	
	@RequestMapping("/addWorkshop")
	@ResponseBody
	public ModelMap addWrokshop() {
		try {
			String workshop_name = request.getParameter("workshop_name") == null ? "" : request.getParameter("workshop_name");
			String workshop_code = request.getParameter("workshop_code") == null ? "" : request.getParameter("workshop_code");
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseWorkshop workshop = new BmsBaseWorkshop();

			workshop.setWorkshopName(workshop_name);
			workshop.setWorkshopCode(workshop_code);
			workshop.setMemo(memo);
			workshop.setEditorId(editor_id);
			workshop.setEditDate(edit_date);

			int reuslt = settingService.addWorkshop(workshop);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}

	@RequestMapping("/updateWorkshop")
	@ResponseBody
	public ModelMap updateWorkshop() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			String workshop_name = request.getParameter("workshop_name") == null ? "" : request.getParameter("workshop_name");
			String workshop_code = request.getParameter("workshop_code") == null ? "" : request.getParameter("workshop_code");
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseWorkshop workshop = new BmsBaseWorkshop();
			
			workshop.setId(id);

			workshop.setWorkshopName(workshop_name);
			workshop.setWorkshopCode(workshop_code);
			workshop.setMemo(memo);
			workshop.setEditorId(editor_id);
			workshop.setEditDate(edit_date);

			settingService.updateWorkshop(workshop);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteWorkshop")
	@ResponseBody
	public ModelMap deleteWorkshop() {
		try {
			String ids = request.getParameter("ids");
			List<String> idlist = new ArrayList<String>();
			for(String id : ids.split(",")){
				idlist.add(id);
			}
			settingService.deleteWorkshop(idlist);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	/**
	 * ajax 获取线别列表
	 * 
	 * @return model
	 */
	@RequestMapping("/getLineList")
	@ResponseBody
	public ModelMap getLineList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int draw = Integer.parseInt(request.getParameter("draw"));// jquerydatatables
		int start = Integer.parseInt(request.getParameter("start"));// 分页数据起始数
		int length = Integer.parseInt(request.getParameter("length"));// 每一页数据条数

		String lineName = request.getParameter("lineName");//

		queryMap.put("draw", draw);
		queryMap.put("start", start);
		queryMap.put("length", length);
		queryMap.put("lineName", lineName);
		Map<String, Object> result = settingService.getLineList(queryMap);
		model.addAllAttributes(result);

		return model;
	}
	
	@RequestMapping("/addLine")
	@ResponseBody
	public ModelMap addLine() {
		try {
			String lineName = request.getParameter("lineName") == null ? "" : request.getParameter("lineName");
			
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseLine line = new BmsBaseLine();

			line.setLineName(lineName);
			line.setMemo(memo);
			line.setEditorId(editor_id);
			line.setEditDate(edit_date);

			int reuslt = settingService.addLine(line);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}

	@RequestMapping("/updateLine")
	@ResponseBody
	public ModelMap updateLine() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			String lineName = request.getParameter("lineName") == null ? "" : request.getParameter("lineName");
			String memo = request.getParameter("memo") == null ? "" : request.getParameter("memo");

			String editor_id = request.getSession().getAttribute("staff_number") + "";
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseLine line = new BmsBaseLine();
			
			line.setId(id);

			line.setLineName(lineName);
			line.setMemo(memo);
			line.setEditorId(editor_id);
			line.setEditDate(edit_date);

			settingService.updateLine(line);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/deleteLine")
	@ResponseBody
	public ModelMap deleteLine() {
		try {
			String ids = request.getParameter("ids");
			List<String> idlist = new ArrayList<String>();
			for(String id : ids.split(",")){
				idlist.add(id);
			}
			settingService.deleteLine(idlist);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	
	/**
	 * 编辑标准工位
	 * @return
	 */
	@RequestMapping("/editStation")
	@ResponseBody
	public ModelMap editStation(@ModelAttribute("station")  BmsBaseStation station){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		station.setEditor_id(userid);
		station.setEdit_date(curTime);
		settingService.updateStation(station);
		initModel(true, "Save Success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 新增标准工位
	 */
	@RequestMapping("/addStation")
	@ResponseBody
	public ModelMap addStation(@ModelAttribute("station")  BmsBaseStation station){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		station.setEditor_id(userid);
		station.setEdit_date(curTime);
		settingService.addStation(station);
		initModel(true, "Save Success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 软删除标准工位
	 */
	@RequestMapping("/deleteStation")
	@ResponseBody
	public ModelMap deleteStation( ){
		String ids=request.getParameter("ids");
		List idlist=Arrays.asList(ids.split(","));
		settingService.deleteStation(idlist);
		initModel(true, "Delete success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 获取标准工位列表
	 * @return
	 */
	@RequestMapping("/getStationList")
	@ResponseBody
	public ModelMap getStationList(){
		model.clear();
		String draw=request.getParameter("draw");
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String line=request.getParameter("line");
		String monitoryPoint_flag=request.getParameter("monitoryPoint_flag");
		String keyStation_flag=request.getParameter("keyStation_flag");
		String planNode_flag=request.getParameter("planNode_flag");
		
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("line", line);
		condMap.put("monitoryPoint_flag", monitoryPoint_flag);
		condMap.put("keyStation_flag", keyStation_flag);
		condMap.put("planNode_flag", planNode_flag);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("draw", draw);
		
		model.addAllAttributes(settingService.getStationList(condMap));
		
		return model;
	}
	
	/**
	 * 获取标准工序列表
	 * @return
	 */
	@RequestMapping("/getProcessList")
	@ResponseBody
	public ModelMap getProcessList(){
		model.clear();
		String draw=request.getParameter("draw");
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		String station=request.getParameter("station");
		String process=request.getParameter("process");
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("process", process);
		condMap.put("station", station);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("draw", draw);
		
		model.addAllAttributes(settingService.getProcessList(condMap));
		
		return model;
	}
	
	/**
	 * 编辑标准工序
	 * @return
	 */
	@RequestMapping("/editProcess")
	@ResponseBody
	public ModelMap editProcess(@ModelAttribute("process")  BmsBaseProcess process){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		process.setEditor_id(userid);
		process.setEdit_date(curTime);
		settingService.updateProcess(process);
		initModel(true, "Save Success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 新增标准工序
	 */
	@RequestMapping("/addProcess")
	@ResponseBody
	public ModelMap addProcess(@ModelAttribute("process")  BmsBaseProcess process){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		process.setEditor_id(userid);
		process.setEdit_date(curTime);
		settingService.addProcess(process);
		initModel(true, "Save Success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 软删除标准工序
	 */
	@RequestMapping("/deleteProcess")
	@ResponseBody
	public ModelMap deleteProcess( ){
		String ids=request.getParameter("ids");
		List idlist=Arrays.asList(ids.split(","));
		settingService.deleteProcess(idlist);
		initModel(true, "Delete success！", null);
		return mv.getModelMap();
	}
	
	/**
	 * 工序配置页面
	 * @return
	 */
	@RequestMapping("/stationConfig")
	public ModelAndView processConfig(){
		mv.setViewName("setting/stationConfig");
		return mv;
	}
	
	/**
	 * 获取工序配置列表
	 */
	@RequestMapping("/getStationConfigList")
	@ResponseBody
	public ModelMap getProcessConfigList(){
		model.clear();
		String draw=request.getParameter("draw");
		int start=Integer.parseInt(request.getParameter("start"));//分页数据起始数
		int length=Integer.parseInt(request.getParameter("length"));//每一页数据条数
		String factory=request.getParameter("factory");
		String order_type=request.getParameter("order_type");
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("order_type", order_type);
		condMap.put("start", start);
		condMap.put("length", length);
		condMap.put("draw", draw);
		
		model.addAllAttributes(settingService.getStationConfigList(condMap));
		return model;
	}
	
	/**
	 * 根据工厂、车间获取工序列表（不区分线别）
	 */
	@RequestMapping("/getStationListNoLine")
	@ResponseBody
	public ModelMap getStationListNoLine(){
		model.clear();
		String factory=request.getParameter("factory");
		String workshop=request.getParameter("workshop");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		
		model.put("data", settingService.getStationListNoLine(condMap));
		return model;
	}
	
	/**
	 * 根据工厂、订单类型获取工序配置明细列表
	 */
	@RequestMapping("/getStationConfigDetailList")
	@ResponseBody
	public ModelMap getStationConfigDetailList(){
		model.clear();
		String factory=request.getParameter("factory");
		String order_type=request.getParameter("order_type");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("order_type", order_type);
		
		model.put("data", settingService.getStationConfigDetailList(condMap));
		return model;
	}
	
	/**
	 * 根据工厂获取该工厂下所有车间的标准工序列表
	 */
	@RequestMapping("/getStationListByFactory")
	@ResponseBody
	public ModelMap getStationListByFactory(){
		model.clear();
		String factory=request.getParameter("factory");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		
		model.put("data", settingService.getStationListByFactory(condMap));
		return model;
	}
	
	/**
	 * 新增工位配置
	 */
	@RequestMapping("/addStationConfig")
	@ResponseBody
	public ModelMap addStationConfig(){
		model.clear();
		String process_list_str=request.getParameter("process_list");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		
		JSONArray jsar=JSONArray.fromObject(process_list_str);
		List<Map<String,Object>> process_list=new ArrayList<Map<String,Object>>();
		if(process_list_str.contains("{")){
			process_list=JSONArray.toList(jsar,Map.class);
		}

//		process_list.forEach(e->{
//			e.put("editor_id", userid);
//			e.put("edit_date", curTime);
//		});
		for(Map map : process_list){
			map.put("editor_id", userid);
			map.put("edit_date", curTime);
		}
		settingService.addStationConfig(process_list,model);
		
		return model;
	}
	
	/**
	 * 编辑工序配置
	 */
	@RequestMapping("/editStationConfig")
	@ResponseBody
	public ModelMap editStationConfig(){
		model.clear();
		String process_list_str=request.getParameter("process_list");
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		int userid=(int)session.getAttribute("user_id");
		
		JSONArray jsar=JSONArray.fromObject(process_list_str);
		List<Map<String,Object>> process_list=new ArrayList<Map<String,Object>>();
		if(process_list_str.contains("{")){
			process_list=JSONArray.toList(jsar,Map.class);
		}

//		process_list.forEach(e->{
//			e.put("editor_id", userid);
//			e.put("edit_date", curTime);
//		});
		for(Map map : process_list){
			map.put("editor_id", userid);
			map.put("edit_date", curTime);
		}
		settingService.editStationConfig(process_list,model);
		
		return model;
	}
	/**
	 * 编辑工序配置
	 */
	@RequestMapping("/deleteStationConfig")
	@ResponseBody
	public ModelMap deleteStationConfig(){
		model.clear();
		String factory=request.getParameter("factory");
		String order_type=request.getParameter("order_type");
		
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("order_type", order_type);
		settingService.deleteStationConfig(condMap,model);
		return model;
	}
	
	/**
	 * ajax 获取vin码生成规则列表
	 * 
	 * @return model
	 */
	@RequestMapping("/getVinRuleList")
	@ResponseBody
	public ModelMap getVinRuleList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int draw = Integer.parseInt(request.getParameter("draw"));// jquerydatatables
		int start = Integer.parseInt(request.getParameter("start"));// 分页数据起始数
		int length = Integer.parseInt(request.getParameter("length"));// 每一页数据条数

		String busTypeId = request.getParameter("busTypeId");// 工厂
		String area = request.getParameter("area");//

		queryMap.put("draw", draw);
		queryMap.put("start", start);
		queryMap.put("length", length);
		queryMap.put("busTypeId", busTypeId);
		queryMap.put("area", area);
		Map<String, Object> result = settingService.getVinRuleList(queryMap);
		model.addAllAttributes(result);

		return model;
	}
	/**
	 * 删除vin生成规则
	 */
	@RequestMapping("/deleteVinRule")
	@ResponseBody
	public ModelMap deleteVinRule( ){
		String ids=request.getParameter("ids");
		List idlist=Arrays.asList(ids.split(","));
		settingService.deleteVinRule(idlist);
		initModel(true, "Delete success！", null);
		return mv.getModelMap();
	}
	@RequestMapping("/addVinRule")
	@ResponseBody
	public ModelMap addVinRule() {
		try {
			String message="";
			String busTypeId =request.getParameter("busTypeId");
			String vinPrefix = request.getParameter("vinPrefix");
			String wmiExtension = request.getParameter("wmiExtension") == null ? "" : request.getParameter("wmiExtension");
			String numberSize = request.getParameter("numberSize") == null ? "" : request.getParameter("numberSize");
			String area = request.getParameter("area") == null ? "" : request.getParameter("area");
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
            BmsBaseVinRule vinRule = new BmsBaseVinRule();
            vinRule.setBusTypeId(Integer.parseInt(busTypeId));
			vinRule.setVinPrefix(vinPrefix);
			vinRule.setWmiExtension(wmiExtension);
			vinRule.setNumberSize(numberSize);
			vinRule.setEditorId(editor_id);
			vinRule.setEditDate(edit_date);
			vinRule.setArea(area);
			int reuslt = settingService.addVinRule(vinRule);
			if(reuslt==0){
				message="添加失败";
				initModel(false, message, reuslt);
			}else if(reuslt==1){
				message="添加成功";
				initModel(true, message, reuslt);
			}else if(reuslt==2){
				message="已存在记录，不能添加";
				initModel(false, message, reuslt);
			}
			
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}

	@RequestMapping("/updateVinRule")
	@ResponseBody
	public ModelMap updateVinRule() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			String busTypeId = request.getParameter("busTypeId") == null ? "" : request.getParameter("busTypeId");
			String vinPrefix = request.getParameter("vinPrefix") == null ? "" : request.getParameter("vinPrefix");
			String wmiExtension = request.getParameter("wmiExtension") == null ? "" : request.getParameter("wmiExtension");
			String numberSize = request.getParameter("numberSize") == null ? "" : request.getParameter("numberSize");
			String area = request.getParameter("area") == null ? "" : request.getParameter("area");
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());

			BmsBaseVinRule vinRule = new BmsBaseVinRule();
			vinRule.setId(id);
			vinRule.setBusTypeId(Integer.parseInt(busTypeId));
			vinRule.setVinPrefix(vinPrefix);
			vinRule.setWmiExtension(wmiExtension);
			vinRule.setNumberSize(numberSize);
			vinRule.setEditorId(editor_id);
			vinRule.setEditDate(edit_date);
			vinRule.setArea(area);
			settingService.updateVinRule(vinRule);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	/**
	 * ajax 获取车型列表
	 * 
	 * @return model
	 */
	@RequestMapping("/getBusTypeList")
	@ResponseBody
	public ModelMap getBusTypeList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int draw = Integer.parseInt(request.getParameter("draw"));// jquerydatatables
		int start = Integer.parseInt(request.getParameter("start"));// 分页数据起始数
		int length = Integer.parseInt(request.getParameter("length"));// 每一页数据条数

		String busTypeCode = request.getParameter("busTypeCode");
		
		queryMap.put("draw", draw);
		queryMap.put("start", start);
		queryMap.put("length", length);
		queryMap.put("busTypeCode", busTypeCode);
		Map<String, Object> result = settingService.getBusTypeList(queryMap);

		model.addAllAttributes(result);

		return model;
	}
	@RequestMapping("/addBusType")
	@ResponseBody
	public ModelMap addBusType() {
		try {
			
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			BmsBaseBusType busType = new BmsBaseBusType();

			busType.setBusTypeCode(request.getParameter("busTypeCode"));
            busType.setInternalName(request.getParameter("internalName"));
            busType.setBatteryModel(request.getParameter("batteryModel"));
            busType.setChassisModel(request.getParameter("chassisModel"));
            busType.setLightDowndip(request.getParameter("lightDowndip"));
            busType.setMaxSpeed(request.getParameter("maxSpeed"));
            busType.setMaxWeight(request.getParameter("maxWeight"));
            busType.setMotorModel(request.getParameter("motorModel"));
            busType.setBatteryCapacity(request.getParameter("batteryCapacity"));
            busType.setRatedVoltage(request.getParameter("ratedVoltage"));
            busType.setMotorPower(request.getParameter("motorPower"));
            busType.setPassengerNum(request.getParameter("passengerNum"));
            busType.setVehicleLength(request.getParameter("vehicleLength"));
            busType.setVehicleModel(request.getParameter("vehicleModel"));
            busType.setPassengers(request.getParameter("passengers"));
            busType.setWheelbase(request.getParameter("wheelbase"));
            busType.setEditDate(edit_date);
            busType.setEditorId(editor_id);
			int reuslt = settingService.addBusType(busType);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}

	@RequestMapping("/updateBusType")
	@ResponseBody
	public ModelMap updateBusType() {
		try {
			int id = Integer.parseInt(request.getParameter("id"));
			
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			BmsBaseBusType busType = new BmsBaseBusType();
			busType.setId(id);
			busType.setBusTypeCode(request.getParameter("busTypeCode"));
            busType.setInternalName(request.getParameter("internalName"));
            busType.setBatteryModel(request.getParameter("batteryModel"));
            busType.setBatteryCapacity(request.getParameter("batteryCapacity"));
            busType.setRatedVoltage(request.getParameter("ratedVoltage"));
            busType.setChassisModel(request.getParameter("chassisModel"));
            busType.setLightDowndip(request.getParameter("lightDowndip"));
            busType.setMaxSpeed(request.getParameter("maxSpeed"));
            busType.setMaxWeight(request.getParameter("maxWeight"));
            busType.setMotorModel(request.getParameter("motorModel"));
            busType.setMotorPower(request.getParameter("motorPower"));
            busType.setPassengerNum(request.getParameter("passengerNum"));
            busType.setPassengers(request.getParameter("passengers"));
            busType.setVehicleLength(request.getParameter("vehicleLength"));
            busType.setVehicleModel(request.getParameter("vehicleModel"));
            busType.setWheelbase(request.getParameter("wheelbase"));
            busType.setEditDate(edit_date);
            busType.setEditorId(editor_id);
			settingService.updateBusType(busType);
			initModel(true, "success", "");
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/getBusTypeById")
	@ResponseBody
	public ModelMap getBusTypeById() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		int id = Integer.parseInt(request.getParameter("id"));
		queryMap.put("id", id);
		
		Map<String, Object> result=new HashMap<String, Object>(); 
		BmsBaseBusType bmsBaseBusType= settingService.getBusTypeById(queryMap);
		result.put("data",bmsBaseBusType);
		model.addAllAttributes(result);

		return model;
	}
	// 获取班组tree型菜单
	@RequestMapping("/getWorkshopTreeList")
	@ResponseBody
	public ModelMap getWorkshopTreeList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		
//		String busTypeCode = request.getParameter("busTypeCode");
//		queryMap.put("busTypeCode", busTypeCode);
		List result = settingService.getWorkshopTreeList(queryMap);
		Map<String, Object> map = new HashMap<String, Object>();  
// 
        map.put( "data",result);
//      
//        JSONObject jsonObject = JSONObject.fromObject(map);
	
		model.addAllAttributes(map);

		return model;
	}
	@RequestMapping("/getWorkgroupNodeName")
	@ResponseBody
	public ModelMap getWorkgroupNodeName() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		Map<String, Object> map = new HashMap<String, Object>();
		String id = request.getParameter("id");
		queryMap.put("id", id);
		List<Map<String, Object>> result = settingService.getWorkshopTreeList(queryMap);
		if(result!=null && result.size()>0){
			Map<String, Object> m=result.get(0);
			map.put( "nodeName",m.get("workshop_name"));
		}
		model.addAllAttributes(map);

		return model;
	}
	// 根据ID查询该班组子节点菜单
	@RequestMapping("/getWorkgroupList")
	@ResponseBody
	public ModelMap getWorkgroupList() {
		Map<String, Object> queryMap = new HashMap<String, Object>();
		
		String parentId = request.getParameter("id");
		queryMap.put("parentId", parentId);
		List result = settingService.getWorkgroupList(queryMap);
		Map<String, Object> map = new HashMap<String, Object>();  
        map.put( "data",result);

		model.addAllAttributes(map);

		return model;
	}
	
	@RequestMapping("/addWorkgroup")
	@ResponseBody
	public ModelMap addWorkgroup() {
		try {
			
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			BmsBaseStandardWorkgroup workgroup = new BmsBaseStandardWorkgroup();
			workgroup.setWorkshopId(Integer.parseInt(request.getParameter("workshopId")));
			workgroup.setWorkgroupId(request.getParameter("workgroupId"));
			workgroup.setGroupName(request.getParameter("groupName"));
			workgroup.setResponsibility(request.getParameter("responsibility"));
			workgroup.setMemo(request.getParameter("memo"));
			workgroup.setParentId(request.getParameter("parentId"));
            workgroup.setEditDate(edit_date);
            workgroup.setEditorId(editor_id);
			int reuslt = settingService.addWorkgroup(workgroup);
			initModel(true, "success", reuslt);
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/updateWorkgroup")
	@ResponseBody
	public ModelMap updateWorkgroup() {
		try {
			
			int editor_id =(int) request.getSession().getAttribute("user_id");
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String edit_date = df.format(new Date());
			BmsBaseStandardWorkgroup workgroup = new BmsBaseStandardWorkgroup();
			workgroup.setId(Integer.parseInt(request.getParameter("id")));
			workgroup.setWorkgroupId(request.getParameter("workgroupId"));
			workgroup.setGroupName(request.getParameter("groupName"));
			workgroup.setResponsibility(request.getParameter("responsibility"));
			workgroup.setMemo(request.getParameter("memo"));
            workgroup.setEditDate(edit_date);
            workgroup.setEditorId(editor_id);
			int result=settingService.updateWorkgroup(workgroup);
			if(result==1){
				initModel(true, "更新成功", result);
			}else{
				initModel(false, "更新失败", result);
			}
			
		} catch (Exception e) {
			initModel(false, e.getMessage(), e.toString());
		}
		model = mv.getModelMap();
		return model;
	}
	@RequestMapping("/deleteWorkgroup")
	@ResponseBody
	public ModelMap deleteWorkgroup(){
		String ids=request.getParameter("ids");
		List idlist=Arrays.asList(ids.split(","));
		settingService.deleteWorkgroup(idlist);
		initModel(true, "Delete success！", null);
		return mv.getModelMap();
	}
	
	
	public List getOrgList() {
		return orgList;
	}

	public void setOrgList(List orgList) {
		this.orgList = orgList;
	}
	//组织架构
	@RequestMapping("/orgData")
	public ModelAndView orgDataPage() {
		mv.setViewName("setting/orgData");
		return mv;
	}
	//标准岗位库
	@RequestMapping("/positionSystem")
	public ModelAndView positionSystemPage() {
		mv.setViewName("setting/positionSystem");
		return mv;
	}
	//标准人力
	@RequestMapping("/standardHuman")
	public ModelAndView standardHumanPage() {
		mv.setViewName("setting/standardHuman");
		return mv;
	}
	// 获取组织架构tree型菜单
	@RequestMapping("/getOrgDataTreeList")
	@ResponseBody
	public ModelMap getOrgDataTreeList() {
		model.clear();
		Map<String, Object> queryMap = new HashMap<String, Object>();
		String id = request.getParameter("id");
		queryMap.put("id", id);
		List result = settingService.getOrgDataTreeList(queryMap);
		if(request.getParameter("id")==null){
			this.setOrgList(result);
		}

		Map<String, Object> map = new HashMap<String, Object>();  
        map.put( "data",result);
        map.put( "success",true);
		model.addAllAttributes(map);
        return model;
	}
	// 根据parent_id查询该子节点菜单
	@RequestMapping("/getOrgDataByParentId")
	@ResponseBody
	public ModelMap getOrgDataByParentId() {
		model.clear();
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		String id = request.getParameter("id");
		String parent_id = request.getParameter("parent_id");
		conditionMap.put("id", id);
		conditionMap.put("parent_id", parent_id);
		List result = settingService.getOrgDataByParentId(conditionMap);
		Map<String, Object> map = new HashMap<String, Object>();  
        map.put( "data",result);
        map.put( "success",true);
        model.addAllAttributes(map);
        return model;
	}
	/**
	 * 修改组织结构
	 * 
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/editOrgData")
	@ResponseBody
	public ModelMap editOrgData() throws UnsupportedEncodingException {
		model.clear();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String editor_id = request.getSession().getAttribute("user_id") + "";
		
		Map<String, Object> conditionMap = new HashMap<String, Object>();
        conditionMap.put("parent_id", request.getParameter("parent_id"));
		conditionMap.put("org_type", request.getParameter("org_type"));
		conditionMap.put("org_kind", request.getParameter("org_kind"));
		conditionMap.put("name", request.getParameter("name"));
		conditionMap.put("org_code", request.getParameter("org_code"));
		conditionMap.put("manager", request.getParameter("manager"));
		conditionMap.put("responsibilities",
				request.getParameter("responsibilities"));
		conditionMap.put("deleted", "0");
		conditionMap.put("editor_id", editor_id);
		conditionMap.put("edit_date", curTime);

		conditionMap.put("id", request.getParameter("id"));

		int result = settingService.editOrgData(conditionMap);
		if(result==1){
			conditionMap.put("success",true);
			model.addAllAttributes(conditionMap);
		}
		return model;
	}
	/**
	 * 删除组织结构
	 * 
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/deleteOrgData")
	@ResponseBody
	public ModelMap deleteOrgData() throws UnsupportedEncodingException {
		model.clear();
		int result=0;
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		String ids=request.getParameter("ids");
		List idlist=Arrays.asList(ids.split(","));
		for(Object id : idlist){
			conditionMap.put("id", (String)id);
            //生成子tree
			TreeNode t = recursiveTree((String)id,this.getOrgList());
			//递归删除子tree的所有节点
			traverseTreeDeleteOrg(t);
			//删除当前节点
			result = settingService.deleteOrgData(conditionMap);
		}
		if(result==1){
			conditionMap.put("success",true);
			model.addAllAttributes(conditionMap);
		}
		return model;
	}
	public void traverseTreeDeleteOrg(TreeNode node){
		for(TreeNode n :(List<TreeNode>)node.getNodes()){
			//do something
			Map<String, Object> conditionMap = new HashMap<String, Object>();
			conditionMap.put("id", n.getId());
			settingService.deleteOrgData(conditionMap);
			traverseTreeDeleteOrg(n);
		}
	}
	/**
	 * 添加组织结构
	 * 
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@RequestMapping("/addOrgData")
	@ResponseBody
	public ModelMap addOrgData() throws UnsupportedEncodingException {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String editor_id = request.getSession().getAttribute("user_id") + "";
		
			Map<String, Object> conditionMap = new HashMap<String, Object>();

			conditionMap.put("parent_id", request.getParameter("parent_id"));
			conditionMap.put("org_type", request.getParameter("org_type"));
			conditionMap.put("org_kind", request.getParameter("org_kind"));
			conditionMap.put("name", request.getParameter("name"));
			conditionMap.put("org_code", request.getParameter("org_code"));
			conditionMap
					.put("sort_number", request.getParameter("sort_number"));
			conditionMap.put("manager", request.getParameter("manager"));
			conditionMap.put("foreign_id", request.getParameter("foreign_id")!="" ? request.getParameter("foreign_id") : null);
			conditionMap.put("responsibilities",
					request.getParameter("responsibilities"));
			conditionMap.put("deleted", "0");
			conditionMap.put("editor_id", editor_id);
			conditionMap.put("edit_date", curTime);
			List resultList = settingService.getOrgDataTreeList(conditionMap);
			if(resultList.size()>0){
				conditionMap.put("success",false);
				conditionMap.put("message",request.getParameter("name")+" existed!");
				model.addAllAttributes(conditionMap);
				return model;
			}
			//数据插入成功后返回新插入数据的id
			conditionMap.put("id", "");
			
			int result = settingService.addOrgData(conditionMap);
			
			//复制
			if(request.getParameter("id")!=null){
				//生成子tree
				TreeNode t = recursiveTree(request.getParameter("id"),this.getOrgList());
				//递归复制子tree的所有节点
				traverseTreeCopyOrg(t,conditionMap.get("id").toString());
			}

			if(result==1){
				conditionMap.put("success",true);
				model.addAllAttributes(conditionMap);
			}
			return model;
		
	}
	public void traverseTreeCopyOrg(TreeNode node,String parent){
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		String editor_id = request.getSession().getAttribute("user_id") + "";
		for(TreeNode n :(List<TreeNode>)node.getNodes()){
			//do something
			
			Map<String, Object> conditionMap = new HashMap<String, Object>();
			conditionMap.put("parent_id", parent);
			conditionMap.put("org_type", n.getOrg_type());
			conditionMap.put("org_kind", n.getOrg_kind());
			conditionMap.put("name", n.getDisplay_name());
			conditionMap
					.put("sort_number", n.getSort_number());
			conditionMap.put("manager", n.getManager());
			conditionMap.put("responsibilities",
					n.getResponsibilities());
			conditionMap.put("deleted", "0");
			conditionMap.put("editor_id", editor_id);
			conditionMap.put("edit_date", curTime);
			
			conditionMap.put("id", "");
			
			//conditionMap.put("id", n.getId());
			settingService.addOrgData(conditionMap);
			traverseTreeCopyOrg(n,conditionMap.get("id").toString());
		}
	}
	
	/**
	 * 递归算法解析成树形结构
	 *
	 * @param id
	 * @return
	 * @author wx
	 */
	public TreeNode recursiveTree(String id,List<HashMap<Object,Object>> s) {
		// 根据cid获取节点对象(SELECT * FROM tb_tree t WHERE t.cid=?)
		TreeNode node = getTreeNode(id,s);
		// 查询cid下的所有子节点(SELECT * FROM tb_tree t WHERE t.pid=?)
		List<TreeNode> childTreeNodes = queryTreeNode(id,s);
		// 遍历子节点
		for (TreeNode child : childTreeNodes) {
			TreeNode n = recursiveTree(child.getId(),s); // 递归
			node.getNodes().add(n);
		}

		return node;
	}

	private List<TreeNode> queryTreeNode(String id,List<HashMap<Object,Object>> s) {
		List list = new ArrayList();
		for(HashMap<Object,Object> h : s){
			if(h.get("parent_id")==null){
				//
			}else
			if(h.get("parent_id").toString().equals(id)){
				TreeNode tn = new TreeNode();
				tn.setId(h.get("id")==null?"":h.get("id").toString());
				if(h.get("parent_id")==null){
					tn.setParent("0");
				}else{
					tn.setParent(h.get("parent_id").toString());
				}
				tn.setName(h.get("name")==null?"":h.get("name").toString());
				tn.setDisplay_name(h.get("display_name")==null?"":h.get("display_name").toString());
				tn.setShort_name(h.get("short_name")==null?"":h.get("short_name").toString());
				tn.setSort_number(h.get("sort_number")==null?"0":h.get("sort_number").toString());
				tn.setManager(h.get("manager")==null?"":h.get("manager").toString());
				tn.setOrg_type(h.get("org_type")==null?"":h.get("org_type").toString());
				tn.setOrg_kind(h.get("org_kind")==null?"":h.get("org_kind").toString());
				tn.setResponsibilities(h.get("responsibilities")==null?"":h.get("responsibilities").toString());
				tn.setDeleted(h.get("deleted")==null?"":h.get("deleted").toString());
				list.add(tn);
			}
		}
		return list;
	}

	private TreeNode getTreeNode(String id,List<HashMap<Object,Object>> s) {
		TreeNode tn = new TreeNode();
		for(HashMap<Object,Object> h : s){
			if(h.get("id").toString().equals(id)){
				tn.setId(h.get("id")==null?"":h.get("id").toString());
				if(h.get("parent")==null){
					tn.setParent("0");
				}else{
					tn.setParent(h.get("parent").toString());
				}
				tn.setName(h.get("name")==null?"":h.get("name").toString());
				tn.setDisplay_name(h.get("display_name")==null?"":h.get("display_name").toString());
				tn.setShort_name(h.get("short_name")==null?"":h.get("short_name").toString());
				tn.setSort_number(h.get("sort_number")==null?"0":h.get("sort_number").toString());
				tn.setManager(h.get("manager")==null?"":h.get("manager").toString());
				tn.setOrg_type(h.get("org_type")==null?"":h.get("org_type").toString());
				tn.setOrg_kind(h.get("org_kind")==null?"":h.get("org_kind").toString());
				tn.setResponsibilities(h.get("responsibilities")==null?"":h.get("responsibilities").toString());
				tn.setDeleted(h.get("deleted")==null?"":h.get("deleted").toString());
			}
		}
		return tn;
	}
	public class TreeNode implements Serializable {
		private String id;
		private String parent;
		private String name;
		private String display_name;
		private String short_name;
		private String sort_number;
		private String manager;
		private String org_type;
		private String org_kind;
		private String responsibilities;
		private String deleted;
		public String getDeleted() {
			return deleted;
		}
		public void setDeleted(String deleted) {
			this.deleted = deleted;
		}
		//子节点
		private List nodes = new ArrayList();
		public String getId() {
			return id;
		}
		public void setId(String id) {
			this.id = id;
		}
		public String getParent() {
			return parent;
		}
		public void setParent(String parent) {
			this.parent = parent;
		}
		public String getName() {
			return name;
		}
		public void setName(String name) {
			this.name = name;
		}
		public String getDisplay_name() {
			return display_name;
		}
		public void setDisplay_name(String display_name) {
			this.display_name = display_name;
		}
		public String getShort_name() {
			return short_name;
		}
		public void setShort_name(String short_name) {
			this.short_name = short_name;
		}
		public String getSort_number() {
			return sort_number;
		}
		public void setSort_number(String sort_number) {
			this.sort_number = sort_number;
		}
		public String getManager() {
			return manager;
		}
		public void setManager(String manager) {
			this.manager = manager;
		}
		public String getOrg_type() {
			return org_type;
		}
		public void setOrg_type(String org_type) {
			this.org_type = org_type;
		}
		public String getOrg_kind() {
			return org_kind;
		}
		public void setOrg_kind(String org_kind) {
			this.org_kind = org_kind;
		}
		public String getResponsibilities() {
			return responsibilities;
		}
		public void setResponsibilities(String responsibilities) {
			this.responsibilities = responsibilities;
		}
		public List getNodes() {
			return nodes;
		}
		public void setNodes(List nodes) {
			this.nodes = nodes;
		}
	}
}
