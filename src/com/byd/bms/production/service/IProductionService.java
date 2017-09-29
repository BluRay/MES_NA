package com.byd.bms.production.service;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

public interface IProductionService {
	public Map<String, Object> getVinList(Map<String, Object> conditionMap);
	public int batchUpdateVin(List<Map<String,Object>> list);
}
