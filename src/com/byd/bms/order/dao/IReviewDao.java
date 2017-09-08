package com.byd.bms.order.dao;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.byd.bms.order.model.BmsFactoryOrderDetail;
import com.byd.bms.order.model.BmsOrder;
import com.byd.bms.order.model.BmsOrderReviewResults;
@Repository(value="reviewDao")
public interface IReviewDao {
	
	public List<Map<String,Object>> getOrderReviewList(Map<String,Object> queryMap);
	public int getOrderReviewTotalCount(Map<String,Object> queryMap);
	public int saveBmsOrderReviewResults(BmsOrderReviewResults bmsOrderReviewResults);
	public int updateBmsOrderReviewResults(Map<String,Object> bmsOrderReviewResultsMap);
	public BmsOrderReviewResults getOrderReview(Map<String,Object> condMap);
	public Map<String,Object> getOrderReviewById(String id);
	public List<Map<String,Object>> getOrderDetailList(Map<String,Object> queryMap);
	public List<Map<String,Object>> getOrderReviewNodeList(Map<String,Object> condMap);
}
