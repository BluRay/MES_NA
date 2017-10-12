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
}
