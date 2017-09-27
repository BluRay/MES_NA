package com.byd.bms.quality.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.ui.ModelMap;

public interface IQualityService {
		
	public int insertFaultLib(Map<String, Object> faultLib);
	public int updateFaultLib(Map<String, Object> faultLib);
	public Map<String, Object> getFaultLibList(Map<String, Object> conditionMap) ;

	void getOrderKeyPartsList(Map<String, Object> condMap, ModelMap model);
	void saveKeyPartsDetail(Map<String, Object> keyParts);
	void getKeyPartsList(HashMap<String, Object> condMap, ModelMap model);
	void validateWorkshopProcess(List<Map<String, String>> addList) throws Exception;
	
}
