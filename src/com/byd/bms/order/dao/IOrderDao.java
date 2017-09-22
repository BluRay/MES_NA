package com.byd.bms.order.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.byd.bms.order.model.BmsFactoryOrderDetail;
import com.byd.bms.order.model.BmsOrder;
@Repository(value="orderDao")
public interface IOrderDao {
	public List<Map<String,Object>> getOrderList(Map<String,Object> queryMap);
	public int getOrderTotalCount(Map<String,Object> queryMap);
	public Map<String,Object> getOrderByNo(Map<String,Object> queryMap);
	public List<BmsOrder> getOrderDetailList(Map<String,Object> queryMap);
	public int getBusNumberStart(Map<String, Object> conditionMap);
	public void deleteFactoryOrderById(int factory_order_id);
	public void deleteFactoryOrderNoProduction(int order_id);
	public int updateOrder(BmsOrder order);
	public int insertFactoryOrder(BmsFactoryOrderDetail factoryorder);
	public int updateFactoryOrder(BmsFactoryOrderDetail factoryorder);
	public String queryOrderSerial(String year);
	public int insertOrder(BmsOrder order);
	public List queryBusNumberByOrder(Map<String, Object> conditionMap);
	public List<Map<String, Object>> getOrderConfigList(Map<String, Object> condMap);
	public int getConfigTotalCount(Map<String, Object> condMap);
	public List queryConfigDetailList(String configId);
	public int saveOrderConfig(Map<String, Object> configDetail);
	public void saveConfigDetails(Map<String, Object> smap);
	public void updateOrderConfig(Map<String, Object> configDetail);
	public void deleteConfigDetailById(int config_id);
	public List<Map<String, Object>> queryConfigAllotList(Map<String, Object> condMap);
	public int queryConfigAllotTotalCount(Map<String, Object> condMap);
	public List queryConfigListByOrder(Map<String, Object> condMap);
	public void batchSaveFactoryOrderConfig(List detail_list);
	public List queryOrderQueryList(Map<String, Object> condMap);
	public int queryOrderQueryListCount(Map<String, Object> condMap);
	public int queryOrderConfigTotalQty(String order_id);
	// 海外MES系统 start
	public List<Map<String, Object>> getProjectBomList(Map<String, Object> condMap);
	public int getProjectBomTotalCount(Map<String,Object> queryMap);
	Map<String, Object> queryBomHeader(Map<String, Object> bom);
	public int saveBomHeader(Map<String, Object> bom);
	public int saveBomDetails(Map<String, Object> smap);
	public int updateBomHeader(Map<String, Object> bom);
	public int deleteBomByHeader(@Param(value="header_id")int header_id);
	public List<Map<String, Object>> getBomItemList(Map<String, Object> condMap);
	public int getBomItemTotalCount(Map<String,Object> queryMap);
	public List<Map<String, Object>> getBomCompareList(Map<String, Object> condMap);
	public List<Map<String, Object>> getBomCompareDiffList(Map<String, Object> condMap);
	public List<Map<String, Object>> getMaxVersion(Map<String, Object> condMap);
}
