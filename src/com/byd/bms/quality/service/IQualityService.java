package com.byd.bms.quality.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ui.ModelMap;

public interface IQualityService {
		
	public int insertFaultLib(Map<String, Object> faultLib);
	public int updateFaultLib(Map<String, Object> faultLib);
	public Map<String, Object> getFaultLibList(Map<String, Object> conditionMap) ;

	void getOrderKeyPartsTemplateList(Map<String, Object> condMap, ModelMap model);
	void saveKeyPartsDetail(Map<String, Object> keyParts);
	void getKeyPartsList(HashMap<String, Object> condMap, ModelMap model);
	void validateWorkshopProcess(List<Map<String, String>> addList) throws Exception;
	public void getPrdRcdOrderTplList(Map<String, Object> condMap, ModelMap model);
	public void getProjectByNo(Map<String, Object> condMap, ModelMap model);
	void saveInspectionRecordTemplate(Map<String, Object> keyParts);
	void getPrdRcdOrderTplDetailList(HashMap<String, Object> condMap, ModelMap model);
	public void getPrdRcdTestingTplList(Map<String, Object> condMap, ModelMap model);
	public void saveTestingTemplate(Map<String, Object> testing);
	public void getTestingTemplateByHeader(Map<String, Object> condMap, ModelMap model);
	public void getKeyPartsTraceList(Map<String, Object> conditionMap, ModelMap model);
	public void getBusNumberDetailList(Map<String, Object> conditionMap, ModelMap model);
	public void getBusNumberTemplateList(Map<String, Object> conditionMap, ModelMap model);
	public int updateKeyParts(List<Map<String,Object>> list);
	public void getInspectionRecordList(Map<String, Object> conditionMap, ModelMap model);
	public int saveInspectionRecord(Map<String, Object> map);
	public void getInspectionRecordDetail(Map<String, Object> conditionMap, ModelMap model);
	public int updateInspectionRecord(List list);
	
	public List<Map<String, String>> getDefectCode(Map<String, Object> conditionMap);
	public List<Map<String, String>> getLocationList(Map<String, Object> conditionMap);
	public int addPunch(Map<String, Object> conditionMap);
	public Map<String, Object> getPunchList(Map<String, Object> conditionMap);
	public List<Map<String, String>> getPunchInfoByid(Map<String, Object> conditionMap);
	public int editPunch(Map<String, Object> conditionMap);
	public int leadInitialsPunch(Map<String, Object> conditionMap);
	public int qcInitialsPunch(Map<String, Object> conditionMap);

}
