/**
 * 
 */
package com.byd.bms.production.service.impl;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.util.StringUtil;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.production.dao.IProductionDao;
import com.byd.bms.production.service.IProductionService;
import com.byd.bms.util.DataSource;

/**
 * @author xiong.jianwu
 *	生产模块service实现
 */
@Service
@DataSource("dataSourceMaster")
public class ProductionServiceImpl implements IProductionService {
	@Resource(name="productionDao")
	private IProductionDao productionDao;

	@Override
	public Map<String, Object> getVinList(Map<String, Object> conditionMap) {
		//int totalCount=0;
		List<Map<String, Object>> datalist=productionDao.getVinList(conditionMap);
		//totalCount=productionDao.getVinTotalCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		//result.put("draw", conditionMap.get("draw"));
		//result.put("recordsTotal", totalCount);
		//result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	@Override
	@Transactional
	public int batchUpdateVin(List<Map<String, Object>> list) {
		return productionDao.batchUpdateVin(list);
	}
	

}
