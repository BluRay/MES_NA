package com.byd.bms.order.service;

import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.order.model.BmsOrderReviewResults;
import com.google.gson.JsonArray;

public interface IReviewService {
	
	// 查询订单评审记录
	public Map<String,Object> getOrderReviewListPage(Map<String,Object> condMap); 
	public int saveBmsOrderReviewResults(BmsOrderReviewResults bmsOrderReviewResults);
	public int updateBmsOrderReviewResults(Map<String,Object> bmsOrderReviewResultsMap);
	public BmsOrderReviewResults getOrderReview(Map<String,Object> condMap);
	public Map<String,Object> getOrderReviewById(String id);
	public List<Map<String,Object>> getOrderDetailList(Map<String, Object> conditionMap);
	public boolean isPermission(Map<String,Object> map); 
	public String getNextOperator(Map<String,Object> map);
}
