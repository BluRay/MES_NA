package com.byd.bms.setting.service;

import java.util.List;
import java.util.Map;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

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
import com.byd.bms.util.model.BmsBaseUser;

public interface ISettingService {
	public List<BmsBaseRole> getRoleList();
	public List<BmsBaseFunction> getFunctionList();
	public List<BmsBaseRolePermission> getRolePermission(String role_id);
	public List<BmsBaseFunctionPermission> getBaseFunctionPermission(String role_id);
	public int addRole(BmsBaseRole role);
	public int delRoleFunction(String role_id,String function_ids);
	public int addRoleFunction(String role_id,String function_id);
	public int delFunctionPermission(String role_id,String permission_ids);
	public int addFunctionPermission(String role_id,String permission_id);
	
	public int addUser(BmsBaseUser user);
	public int editUser(BmsBaseUser user);
	public int delUser(BmsBaseUser user);
	public BmsBaseUser getUserByid(String id);
	public int resetUserPass(BmsBaseUser user);
	public Map<String,Object> getUserList(Map<String,Object> condMap);
	public List<BmsUserRole> getUserRole(String staff_number);
	public List<BmsUserRole> getOneUserRole(String staff_number,String role_id);
	public int saveUserRole(String staff_number,String this_role,String role_permission,String factory_permission,String workshop_permission,String line_permission,String edit_user);
	
	//工厂
	public Map<String, Object> getFactoryList(Map<String,Object> queryMap);
	//public int getFactoryTotalCount(Map<String,Object> queryMap);
	public void updateFactory(BmsBaseFactory factory);
	public void deleteFactory(List ids);
	public int checkDeleteFactory(List ids);
	public int addFactory(BmsBaseFactory factory);
	public BmsBaseFactory getFactoryById(String id);
	//车间 分页查询
	public Map<String, Object> getWorkshopList(Map<String,Object> queryMap);
	//public int getWorkshopTotalCount(Map<String,Object> queryMap);
	// 查询所有记录
	public Map<String, Object> getAllWorkshopList();
	public int addWorkshop(BmsBaseWorkshop workshop);
	public void updateWorkshop(BmsBaseWorkshop workshop);
	public void deleteWorkshop(List ids);
	public int checkDeleteWorkshop(List ids);
	//线别
	public Map<String, Object> getLineList(Map<String,Object> queryMap);
	//public int getLineTotalCount(Map<String,Object> queryMap);
	public int addLine(BmsBaseLine line);
	public void updateLine(BmsBaseLine line);
	public void deleteLine(List ids);
	public int checkDeleteLine(List ids);
	
	//工位
	public Map<String, Object> getStationList(Map<String,Object> queryMap);
	//public int getProcessTotalCount(Map<String,Object> queryMap);
	public int addStation(BmsBaseStation station);
	public void updateStation(BmsBaseStation station);
	public void deleteStation(List ids);
	
	//工序
	public Map<String, Object> getProcessList(Map<String,Object> queryMap);
	//public int getProcessTotalCount(Map<String,Object> queryMap);
	public int addProcess(BmsBaseProcess process);
	public void updateProcess(BmsBaseProcess process);
	public void deleteProcess(List ids);
	public List<Map<String,Object>> getStationListNoLine(Map<String, Object> condMap);
	public List<Map<String,Object>> getStationConfigDetailList(Map<String, Object> condMap);
	public List<Map<String,Object>> getStationListByFactory(Map<String, Object> condMap);
	public void addStationConfig(List<Map<String, Object>> process_list,ModelMap model);
	@Transactional
	public void editStationConfig(List<Map<String, Object>> process_list,ModelMap model);
	public void deleteStationConfig(Map<String, Object> condMap,ModelMap model);
	//车间班组
	public List<BmsBaseStandardWorkgroup> getWorkgroupList(Map<String,Object> queryMap);
	public List<Map<String, Object>> getWorkshopTreeList(Map<String,Object> queryMap);
	public int addWorkgroup(BmsBaseStandardWorkgroup workgroup);
	public int updateWorkgroup(BmsBaseStandardWorkgroup workgroup);
	public void deleteWorkgroup(List ids);
	//车型
	public Map<String, Object> getBusTypeList(Map<String,Object> queryMap);
	//public int getBusTypeTotalCount(Map<String,Object> queryMap);
	public int addBusType(BmsBaseBusType busType);
	public void updateBusType(BmsBaseBusType busType);
	public Map<String, Object> getStationConfigList(Map<String, Object> condMap);
	public BmsBaseBusType getBusTypeById(Map<String,Object> queryMap);
	//VIN生成规则
	public Map<String, Object> getVinRuleList(Map<String,Object> queryMap);
	//public int getWorkgroupTotalCount(Map<String,Object> queryMap);
	public int addVinRule(BmsBaseVinRule workgroup);
	public int updateVinRule(BmsBaseVinRule workgroup);
	public void deleteVinRule(List ids);
	
	public List<Map<String, Object>> getOrgDataTreeList(Map<String,Object> queryMap);
	
	public List<Map<String, Object>> getOrgDataByParentId(Map<String,Object> queryMap);
	
    public int addOrgData(Map<String,Object> queryMap);
	
	public int editOrgData(Map<String,Object> queryMap);
	
	public int deleteOrgData(Map<String,Object> conditionMap);
}
