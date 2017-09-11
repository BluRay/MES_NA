package com.byd.bms.setting.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.setting.dao.ISettingDao;
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
import com.byd.bms.util.DataSource;
import com.byd.bms.util.model.BmsBaseUser;
@Service
@DataSource("dataSourceMaster")
public class SettingServiceImpl implements ISettingService {
	@Resource(name="settingDao")
	private ISettingDao settingDao;
	

	@Override
	public List<BmsBaseRole> getRoleList() {
		List<BmsBaseRole> list = settingDao.getRoleList();
		return list;
	}

	@Override
	public List<BmsBaseFunction> getFunctionList() {
		List<BmsBaseFunction> list = settingDao.getFunctionList();
		return list;
	}

	@Override
	public List<BmsBaseRolePermission> getRolePermission(String role_id) {
		List<BmsBaseRolePermission> list = settingDao.getRolePermission(role_id);
		return list;
	}

	@Override
	public List<BmsBaseFunctionPermission> getBaseFunctionPermission(String role_id) {
		List<BmsBaseFunctionPermission> list = settingDao.getBaseFunctionPermission(role_id);
		return list;
	}

	@Override
	public int addRole(BmsBaseRole role) {
		return settingDao.addRole(role);
	}

	@Override
	public int delRoleFunction(String role_id, String function_ids) {
		return settingDao.delRoleFunction(role_id, function_ids);
	}

	@Override
	public int addRoleFunction(String role_id, String function_id) {
		return settingDao.addRoleFunction(role_id, function_id);
	}

	@Override
	public int delFunctionPermission(String role_id, String permission_ids) {
		return settingDao.delFunctionPermission(role_id, permission_ids);
	}

	@Override
	public int addFunctionPermission(String role_id, String permission_id) {
		return settingDao.addFunctionPermission(role_id, permission_id);
	}

	@Override
	public int addUser(BmsBaseUser user) {
		return settingDao.addUser(user);
	}
	
	@Override
	public int editUser(BmsBaseUser user) {
		return settingDao.editUser(user);
	}

	@Override
	public int delUser(BmsBaseUser user) {
		return settingDao.delUser(user);
	}
    
	@Override
	public BmsBaseUser getUserByid(String id) {
		return settingDao.getUserById(id);
	}
	
	@Override
	public int resetUserPass(BmsBaseUser user) {
		return settingDao.resetUserPass(user);
	}
	
	@Override
	public Map<String,Object> getUserList(Map<String,Object> condMap) {
		int totalCount=0;
		List<BmsBaseUser> datalist = settingDao.getUserList(condMap);
		totalCount = settingDao.getTotalUserCount(condMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	public List<BmsUserRole> getUserRole(String staff_number) {
		return settingDao.getUserRole(staff_number);
	}

	@Override
	@Transactional
	public int saveUserRole(String staff_number, String this_role, String role_permission, String factory_permission,String workshop_permission, String line_permission,String edit_user) {
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String edit_time = df.format(new Date());
		String[] roles = role_permission.split(",");
		System.out.println("---->staff_number" + "=" + staff_number + " " + role_permission.substring(0, role_permission.length()-1));
		int result = 0;
		//删除roles以外的用户权限
		settingDao.delUserRole(staff_number, role_permission.substring(0, role_permission.length()-1));
		//增加 新增的用户权限
		for (int i = 0 ; i <roles.length ; i++ ) {
			System.out.println("---->" + i + "=" + roles[i]);
			BmsUserRole userRole = new BmsUserRole();
			userRole.setStaff_number(staff_number);
			userRole.setRole_id(roles[i]);
			userRole.setPermission_key("");
			userRole.setPermission_value("");
			userRole.setEdit_user(edit_user);
			userRole.setEdit_time(edit_time);
			result += settingDao.addUserRole(userRole);
		}
		//修改 当前权限的 数据权限
		int permission_count = 0;
		if (!factory_permission.equals(""))permission_count++;
		if (!workshop_permission.equals(""))permission_count++;
		if (!line_permission.equals(""))permission_count++;
		if (permission_count > 0){
			//delete
			settingDao.delOneUserRole(staff_number, this_role);
			if(!factory_permission.equals("")){
				BmsUserRole userRole = new BmsUserRole();
				userRole.setStaff_number(staff_number);
				userRole.setRole_id(this_role);
				userRole.setPermission_key("1");
				userRole.setPermission_value(factory_permission);
				userRole.setEdit_user(edit_user);
				userRole.setEdit_time(edit_time);
				result += settingDao.addOneUserRole(userRole);
			}
			if(!workshop_permission.equals("")){
				BmsUserRole userRole = new BmsUserRole();
				userRole.setStaff_number(staff_number);
				userRole.setRole_id(this_role);
				userRole.setPermission_key("2");
				userRole.setPermission_value(workshop_permission);
				userRole.setEdit_user(edit_user);
				userRole.setEdit_time(edit_time);
				result += settingDao.addOneUserRole(userRole);
			}
			if(!line_permission.equals("")){
				BmsUserRole userRole = new BmsUserRole();
				userRole.setStaff_number(staff_number);
				userRole.setRole_id(this_role);
				userRole.setPermission_key("3");
				userRole.setPermission_value(line_permission);
				userRole.setEdit_user(edit_user);
				userRole.setEdit_time(edit_time);
				result += settingDao.addOneUserRole(userRole);
			}			
		}
		return result;
	}
	
	//工厂
	@Override
	public Map<String, Object> getFactoryList(Map<String,Object> queryMap){
		int totalCount=0;
		List<BmsBaseFactory> datalist=settingDao.getFactoryList(queryMap);
		totalCount=settingDao.getFactoryTotalCount(queryMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public void updateFactory(BmsBaseFactory factory){
		settingDao.updateFactory(factory);
	}
	@Override
	public void deleteFactory(List ids){
		settingDao.deleteFactory(ids);
	}
	@Override
	public int checkDeleteFactory(List ids){
		return settingDao.checkDeleteFactory(ids);
	}
	@Override
	public int addFactory(BmsBaseFactory factory){
		return settingDao.addFactory(factory);
	}
	
	//车间
	@Override
	public Map<String, Object> getWorkshopList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<BmsBaseWorkshop> datalist=settingDao.getWorkshopList(queryMap);
		totalCount=settingDao.getWorkshopTotalCount(queryMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	public Map<String, Object> getAllWorkshopList() {

		List<BmsBaseWorkshop> datalist=settingDao.getAllWorkshopList();

		Map<String, Object> result=new HashMap<String,Object>();
		
		result.put("data", datalist);
		return result;
	}
	@Override
	public int addWorkshop(BmsBaseWorkshop workshop) {
		return settingDao.addWorkshop(workshop);
	}
	@Override
	public void updateWorkshop(BmsBaseWorkshop workshop) {
		settingDao.updateWorkshop(workshop);
	}
	@Override
	public void deleteWorkshop(List ids) {
		settingDao.deleteWorkshop(ids);
	}
	@Override
	public int checkDeleteWorkshop(List ids) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	//线别
	@Override
	public Map<String, Object> getLineList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<BmsBaseLine> datalist=settingDao.getLineList(queryMap);
		totalCount=settingDao.getLineTotalCount(queryMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public int addLine(BmsBaseLine line) {
		return settingDao.addLine(line);
	}
	@Override
	public void updateLine(BmsBaseLine line) {
		settingDao.updateLine(line);
	}
	@Override
	public void deleteLine(List ids) {
		settingDao.deleteLine(ids);
	}
	@Override
	public int checkDeleteLine(List ids) {
		// TODO Auto-generated method stub
		return 0;
	}
	
	//工位
	@Override
	public Map<String, Object> getStationList(Map<String, Object> queryMap) {
		Map<String,Object> result=new HashMap<String,Object>();
		int totalCount=0;
		List<BmsBaseStation> datalist=settingDao.getStationList(queryMap);
		totalCount=settingDao.getStationTotalCount(queryMap);
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("draw", queryMap.get("draw"));
		result.put("data", datalist);
		
		return result;
	}
	@Override
	public int addStation(BmsBaseStation station) {
		if(station!=null){
			settingDao.addStation(station);
		}	
		return station.getId();
	}
	@Override
	public void updateStation(BmsBaseStation station) {
		if(station.getId()!=0){
			settingDao.updateStation(station);
		}	
	}
	@Override
	public void deleteStation(List ids) {
		if(ids.size()>0){
			settingDao.deleteStation(ids);
		}		
	}
	
	//工序
	@Override
	public Map<String, Object> getProcessList(Map<String, Object> queryMap) {
		Map<String,Object> result=new HashMap<String,Object>();
		int totalCount=0;
		List<BmsBaseProcess> datalist=settingDao.getProcessList(queryMap);
		totalCount=settingDao.getProcessTotalCount(queryMap);
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("draw", queryMap.get("draw"));
		result.put("data", datalist);
		
		return result;
	}
	@Override
	public int addProcess(BmsBaseProcess process) {
		if(process!=null){
			settingDao.addProcess(process);
		}	
		return process.getId();
	}
	@Override
	public void updateProcess(BmsBaseProcess process) {
		if(process.getId()!=0){
			settingDao.updateProcess(process);
		}	
	}
	@Override
	public void deleteProcess(List ids) {
		if(ids.size()>0){
			settingDao.deleteProcess(ids);
		}		
	}
	@Override
	public Map<String, Object> getProcessConfigList(Map<String, Object> condMap) {
		Map<String,Object> result=new HashMap<String,Object>();
		int totalCount=0;
		List<Map<String,Object>> datalist=settingDao.queryProcessConfigList(condMap);
		totalCount=settingDao.queryProcessConfigCount(condMap);
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("draw", condMap.get("draw"));
		result.put("data", datalist);
		return result;
	}
	@Override
	public List<Map<String, Object>> getProcessListNoLine(
			Map<String, Object> condMap) {
		List<Map<String,Object>> datalist=settingDao.queryProcessListNoLine(condMap);
		return datalist;
	}
	@Override
	public List<Map<String,Object>> getProcessConfigDetailList(Map<String, Object> condMap) {
		List<Map<String,Object>> datalist=settingDao.queryProcessConfigDetailList(condMap);
		return datalist;
	}
	/**
	 * 根据工厂获取该工厂下所有车间的标准工序列表
	 */
	@Override
	public List<Map<String,Object>> getProcessListByFactory(Map<String, Object> condMap) {
		List<Map<String,Object>> datalist=settingDao.queryProcessListByFactory(condMap);
		return datalist;
	}
	/**
	 * 新增工序配置，同一工厂同一订单类型只允许保存一个工序配置
	 */
	@Override
	public void addProcessConfig(List<Map<String, Object>> process_list,
			ModelMap model) {
		String factory=(String) process_list.get(0).get("factory");
		String order_type=(String) process_list.get(0).get("order_type");
		Map<String,Object>condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("order_type", order_type);
		//根据工厂、订单类型查询是否已经存在工序配置
		List<Map<String, Object>> list=settingDao.queryProcessConfigList(condMap);
		if(list.size()>0){
			model.put("message", factory+" "+order_type+" 已存在工序配置，不能重复添加！");
			model.put("success", false);
			return;
		}
		try{
			int i=settingDao.insertProcessConfig(process_list);
			model.put("message","保存成功！");
			model.put("success", true);
		}catch(Exception e){
			model.put("message",e.getMessage());
			model.put("success", false);
		}	
	}
	
	/**
	 * 编辑工序配置，先删除该工厂该订单类型下的工序配置，再插入修改后的工序配置
	 */
	@Override
	@Transactional
	public void editProcessConfig(List<Map<String, Object>> process_list,
			ModelMap model) {
		String factory=(String) process_list.get(0).get("factory");
		String order_type=(String) process_list.get(0).get("order_type");
		Map<String,Object>condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("order_type", order_type);
		//删除该工厂订单类型下的工序配置
		try{
			settingDao.deleteProcessConfig(condMap);
			settingDao.insertProcessConfig(process_list);
			model.put("message","保存成功！");
			model.put("success", true);
		}catch(Exception e){
			model.put("message",e.getMessage());
			model.put("success", false);
			throw new RuntimeException("系统异常！");			
		}	
		
	}
	
	@Override
	public void deleteProcessConfig(Map<String, Object> condMap, ModelMap model) {
		try{
			settingDao.deleteProcessConfig(condMap);
			model.put("message","删除成功！");
			model.put("success", true);
		}catch(Exception e){
			model.put("message",e.getMessage());
			model.put("success", false);
		}	
	}
	
	//班组
	public List<BmsBaseStandardWorkgroup> getWorkgroupList(Map<String, Object> queryMap) {
		return settingDao.getWorkgroupList(queryMap);
	}

	public List<Map<String, Object>> getWorkshopTreeList(Map<String, Object> queryMap) {
	
		return settingDao.getWorkshopTreeList(queryMap);
	}
	@Override
	public int addWorkgroup(BmsBaseStandardWorkgroup workgroup) {
	
		return settingDao.addWorkgroup(workgroup);
	}
	@Override
	public int updateWorkgroup(BmsBaseStandardWorkgroup workgroup) {
		return settingDao.updateWorkgroup(workgroup);
	}
	@Override
	public void deleteWorkgroup(List ids) {
		for(Object id : ids){
			if(id!=null){
				settingDao.deleteWorkgroup((String)id);
				Map<String,Object>condMap=new HashMap<String,Object>();
				// 删除子节点记录
				condMap.put("parentId", (String)id);
				List<BmsBaseStandardWorkgroup> list=settingDao.getWorkgroupList(condMap);
				if(list.size()>0){
					for(BmsBaseStandardWorkgroup bean : list){
						settingDao.deleteWorkgroup(bean.getId()+"");
					}
				}
			}
		}
	}
	
	//车型
	@Override
	public Map<String, Object> getBusTypeList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<BmsBaseBusType> datalist=settingDao.getBusTypeList(queryMap);
		totalCount=settingDao.getBusTypeTotalCount(queryMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public int addBusType(BmsBaseBusType busType) {
		return settingDao.addBusType(busType);
	}
	@Override
	public void updateBusType(BmsBaseBusType busType) {
	    settingDao.updateBusType(busType);
	}
	@Override
	public BmsBaseBusType getBusTypeById(Map<String, Object> queryMap) {
		return settingDao.getBusTypeById(queryMap);
	}
	// VIN生成规则
	
	public Map<String, Object> getVinRuleList(Map<String, Object> queryMap) {
		int totalCount=0;
		List<BmsBaseVinRule> datalist=settingDao.getVinRuleList(queryMap);
		totalCount=settingDao.getVinRuleTotalCount(queryMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", queryMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	public int addVinRule(BmsBaseVinRule vinRule) {
		/*
		 * result 0:插入失败; 1:插入成功; 2:已存在记录
		 */
		int result=0;
		Map map=new HashMap<String,Object>();
		map.put("busTypeId", vinRule.getBusTypeId());
		map.put("area",vinRule.getArea());
		int count=settingDao.getVinRuleTotalCount(map);
		if(count==0){
			result=settingDao.addVinRule(vinRule);
		}else{
			result=2;
		}
		return result;
	}

	public int updateVinRule(BmsBaseVinRule vinRule) {
		return settingDao.updateVinRule(vinRule);
	}

	public void deleteVinRule(List ids) {
		settingDao.deleteVinRule(ids);
	}
	@Override
	public BmsBaseFactory getFactoryById(String id) {
		return settingDao.getFactoryById(id);
	}
	
	public List<Map<String, Object>> getOrgDataTreeList(Map<String, Object> queryMap) {
		return settingDao.getOrgDataTreeList(queryMap);
	}
	public List<Map<String, Object>> getOrgDataByParentId(Map<String,Object> map) {
		return settingDao.getOrgDataByParentId(map);
	}
	
    public int addOrgData(Map<String,Object> map){
    	return settingDao.addOrgData(map);
    }
	
	public int editOrgData(Map<String,Object> map){
		return settingDao.editOrgData(map);
	}
	
	public int deleteOrgData(Map<String,Object> conditionMap){
		return settingDao.deleteOrgData(conditionMap);
	}

	@Override
	public List<BmsUserRole> getOneUserRole(String staff_number, String role_id) {
		// TODO Auto-generated method stub
		return settingDao.getOneUserRole(staff_number, role_id);
	}

}
