package com.byd.bms.production.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.setting.model.BmsBaseFactory;
@Repository(value="productionDao")
public interface IProductionDao {
	public List<Map<String, Object>> getVinList(Map<String, Object> condMap);
	public int getVinTotalCount(Map<String, Object> condMap);
	public int batchUpdateVin(List<Map<String,Object>> list);
}
