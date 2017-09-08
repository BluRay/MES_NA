package com.byd.bms.quality.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.ModelMap;

import com.byd.bms.order.dao.IOrderDao;
import com.byd.bms.quality.dao.IQualityDao;
import com.byd.bms.quality.service.IQualityService;
import com.byd.bms.quality.model.BmsBaseQCStdRecord;
import com.byd.bms.quality.model.MaterialExceptionLogs;
import com.byd.bms.quality.model.ProblemImproveBean;
import com.byd.bms.quality.model.ProcessFaultBean;
import com.byd.bms.quality.model.QualityTargetBean;
import com.byd.bms.quality.model.StdFaultLibBean;
import com.byd.bms.util.DataSource;
@Service
@DataSource("dataSourceMaster")
public class QualityServiceImpl implements IQualityService {
	@Resource(name="qualityDao")
	private IQualityDao qualityDao;
	@Resource(name="orderDao")
	private IOrderDao orderDao;
	//======================== xjw start=================================//
	@Override
	public void getOrderConfigList(Map<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.getOrderConfigList(condMap);
		totalCount=qualityDao.getConfigTotalCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);

	}
	@Override
	@Transactional
	public void saveKeyPartsDetail(Map<String, Object> keyParts) {
		String parts_detail=(String)keyParts.get("parts_detail");
		List detail_list=new ArrayList();
		JSONArray jsa=new JSONArray();
		if(parts_detail.contains("[")){
			jsa=JSONArray.fromObject(parts_detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			Map<String,Object> detail=(Map<String, Object>) JSONObject.toBean(el, Map.class);
			detail_list.add(detail);
		}
		
		int header_id=0;
		Map<String,Object> m=qualityDao.queryKeyPartsHeader(keyParts);
		if(m!=null){
			header_id=Integer.parseInt(m.get("id").toString());
		}
		Map<String,Object> smap=null;
		if(header_id==0){
			qualityDao.saveKeyPartsHeader(keyParts);
			header_id=(int) keyParts.get("id");	
			smap=new HashMap<String,Object>();
			smap.put("header_id", header_id);
			smap.put("detail_list", detail_list);
			
			if(detail_list.size()>0){
				qualityDao.saveKeyPartsDetails(smap);
			}	
		}else{
			qualityDao.updateKeyPartsHeader(keyParts);
			if(detail_list.size()>0){
				smap=new HashMap<String,Object>();
				smap.put("header_id", header_id);
				smap.put("detail_list", detail_list);
				qualityDao.deleteKeyPartsByHeader(header_id);
				qualityDao.saveKeyPartsDetails(smap);
			}		
		}
	}
	@Override
	public void getKeyPartsList(HashMap<String, Object> condMap, ModelMap model) {
		model.put("data", qualityDao.queryKeyPartsList(condMap));		
	}
	@Override
	public void validateWorkshopProcess(List<Map<String, String>> addList) throws Exception {
		List<Map<String,String>> process_list=qualityDao.queryWorkshopProcessList(addList);
		for(int i=0;i<addList.size();i++){
			Map<String,String> m=new HashMap<String,String>();
			m.put("workshop", addList.get(i).get("workshop"));
			m.put("process", addList.get(i).get("process"));
			if(!process_list.contains(m)){
				throw new Exception("数据错误，第"+(i+1)+"行数据装配车间("+addList.get(i).get("workshop")+")、工序("+addList.get(i).get("process")+")不存在！");
			};		
		}		
	}
	@Override
	public void getPrdRcdBusTypeTplList(HashMap<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.queryPrdRcdBusTypeTplList(condMap);
		totalCount=qualityDao.queryPrdRcdBusTypeTplCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);
		
	}
	@Override
	@Transactional
	public void savePrdRcdBusTypeTpl(Map<String, Object> condMap) {
		int tpl_header_id=condMap.get("tpl_header_id")==null?0:Integer.parseInt((String)condMap.get("tpl_header_id"));
		String tpl_detail=String.valueOf(condMap.get("tpl_list_str"));
		List detail_list=new ArrayList();
		JSONArray jsa=new JSONArray();
		if(tpl_detail.contains("[")){
			jsa=JSONArray.fromObject(tpl_detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			Map<String,Object> detail=(Map<String, Object>) JSONObject.toBean(el, Map.class);
			detail_list.add(detail);
		}
		Map<String,Object> smap=null;
		
		if(tpl_header_id==0){//无header_id 新增模板
			qualityDao.insertPrdRcdBusTypeTplHeader(condMap);
			tpl_header_id=Integer.parseInt(condMap.get("id").toString());
			smap=new HashMap<String,Object>();
			smap.put("tpl_header_id", tpl_header_id);
			smap.put("detail_list", detail_list);
			
			qualityDao.insertPrdRcdTplDetail(smap);
		}else{//更新模板
			smap=new HashMap<String,Object>();
			smap.put("tpl_header_id", tpl_header_id);
			smap.put("detail_list", detail_list);
			qualityDao.updatePrdRcdBusTypeTplHeader(condMap);
			qualityDao.deletePrdRcdTplByHeader(tpl_header_id);
			qualityDao.insertPrdRcdTplDetail(smap);
		}		
	}
	
	@Override
	public void getPrdRcdBusTypeTplDetail(String tpl_header_id, ModelMap model) {
		model.put("data", qualityDao.queryPrdRcdTplDetail(tpl_header_id));
	}
	
	@Override
	public void getPrdRcdOrderTplList(HashMap<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.queryPrdRcdOrderTplList(condMap);
		totalCount=qualityDao.queryPrdRcdOrderTplCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);
		
	}
	
	@Override
	public void getPrdRcdBusTypeTplDetailLatest(HashMap<String, Object> condMap, ModelMap model) {
		Map<String,Object> tpl_header=null;
		tpl_header=qualityDao.queryPrdRcdBusTypeTplHeader(condMap);
		if(tpl_header==null){
			tpl_header=new HashMap<String,Object>();
		}
		String version=(String) tpl_header.get("version");
		List<Map<String,Object>> datalist=new ArrayList<Map<String,Object>>();
		datalist=qualityDao.queryPrdRcdTplDetail(tpl_header.get("id").toString());
		datalist.forEach(e->{
			e.put("version_cp", version);
		});
		model.put("data", datalist);
		
	}

	@Override
	public void savePrdRcdOrderTpl(Map<String, Object> condMap) {
		int tpl_header_id=condMap.get("tpl_header_id")==null?0:Integer.parseInt((String)condMap.get("tpl_header_id"));
		String tpl_detail=String.valueOf(condMap.get("tpl_list_str"));
		List detail_list=new ArrayList();
		JSONArray jsa=new JSONArray();
		if(tpl_detail.contains("[")){
			jsa=JSONArray.fromObject(tpl_detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			Map<String,Object> detail=(Map<String, Object>) JSONObject.toBean(el, Map.class);
			detail_list.add(detail);
		}
		Map<String,Object> smap=null;
		
		if(tpl_header_id==0){//无header_id 新增模板
			qualityDao.insertPrdRcdOrderTplHeader(condMap);
			tpl_header_id=Integer.parseInt(condMap.get("id").toString());
			smap=new HashMap<String,Object>();
			smap.put("tpl_header_id", tpl_header_id);
			smap.put("detail_list", detail_list);
			
			qualityDao.insertPrdRcdTplDetail(smap);
		}else{//更新模板
			smap=new HashMap<String,Object>();
			smap.put("tpl_header_id", tpl_header_id);
			smap.put("detail_list", detail_list);
			qualityDao.updatePrdRcdOrderTplHeader(condMap);
			qualityDao.deletePrdRcdTplByHeader(tpl_header_id);
			qualityDao.insertPrdRcdTplDetail(smap);
		}		
	}

	@Override
	public void getPrdRcdOrderTplDetail(String tpl_header_id, ModelMap model) {
		model.put("data", qualityDao.queryPrdRcdTplDetail(tpl_header_id));
		
	}
	
	@Override
	public void getPrdRcdOrderTpl(Map<String, Object> condMap, ModelMap model) {
		Map<String,Object> tpl_header=qualityDao.queryPrdRcdOrderTplHeader(condMap);
		if(tpl_header==null){
			model.put("message", "未匹配到订单模板！");
			model.put("success", false);
		}else{
			String tpl_header_id=tpl_header.get("id").toString();
			model.put("success", true);
			model.put("data", qualityDao.queryPrdRcdTplDetail(tpl_header_id));
			model.put("tpl_header", tpl_header);
		}	
	}

	@Override
	public void getFaultLibFuzzyList(Map<String, Object> condMap, ModelMap model) {
		model.put("data", qualityDao.getFaultLibFuzzyList(condMap));
		
	}
	
	@Override
	@Transactional
	public void saveProductRecord(Map<String,Object> condMap, ModelMap model) {
		try{
			//根据车号、检验节点删除旧的成品记录数据
			qualityDao.deleteProductRecord(condMap);
			
			//插入新的成品记录数据
			/*if(condMap.get("detail_list")==null){
				qualityDao.insertProductRecordNoFault(condMap);
			}else*/
				qualityDao.insertProductRecord(condMap);
			model.put("success", true);
			model.put("message", "保存成功！");
		}catch(Exception e){
			model.put("success", false);
			model.put("message", "保存失败！"+e.getMessage());
			throw new RuntimeException(e.getMessage());
		}
		
	}
	
	@Override
	public void getProductRecordList(Map<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.queryProductRecordList(condMap);
		totalCount=qualityDao.queryProductRecordCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);	
	}
	
	@Override
	public void getProductRecordDetail(Map<String, Object> condMap,
			ModelMap model) {
		model.put("data",qualityDao.queryProductRecordDetail(condMap));
	}
	//======================== xjw end=================================//
		
	
	//========================yk start=================================//
			
			
	//======================== yk end=================================//
			
			
	//========================tj start=================================//
	@Override
	public Map<String, Object> getKeyPartsTraceList(
			Map<String, Object> conditionMap) {
		int totalCount=0;
		List datalist=qualityDao.getKeyPartsTraceList(conditionMap);
		totalCount=qualityDao.getKeyPartsTraceCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	@Transactional
	public int updateKeyParts(List<Map<String, Object>> list) {
		int result=0;
		for(Map map : list){
			if("".equals((String)map.get("keypartsId"))){
				result=qualityDao.saveParts(map);
			}else{
				result=qualityDao.updateKeyParts(map);
			}
			
		}
		return result;
	}
	
	@Override
	public Map<String, Object> getBusNumberDetailList(
			Map<String, Object> conditionMap) {
		List datalist=qualityDao.getBusNumberDetailList(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("data", datalist);
		return result;
	}
	
	@Override
	public Map<String, Object> getMaterialExceptionLogsList(
			Map<String, Object> conditionMap) {
		int totalCount=0;
		List datalist=qualityDao.getMaterialExceptionLogsList(conditionMap);
		totalCount=qualityDao.getMaterialExceptionLogsCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public int saveMaterialExceptionLogs(
			MaterialExceptionLogs materialExceptionLogs) {
		String orderNo=materialExceptionLogs.getOrder_no();
		Map<String, Object> conditionMap=new HashMap<String, Object> ();
		conditionMap.put("orderNo", orderNo);
		Map<String,Object> map=orderDao.getOrderByNo(conditionMap);
		long orderId=map.get("id")!=null ? (long)map.get("id") : 0;
		materialExceptionLogs.setOrder_id(orderId);
		return qualityDao.saveMaterialExceptionLogs(materialExceptionLogs);
	}
	@Override
	public MaterialExceptionLogs selectLogsById(int id) {
		MaterialExceptionLogs logs=qualityDao.selectLogsById(id);
		Map<String, Object> conditionMap=new HashMap<String, Object> ();
		conditionMap.put("orderId", logs.getOrder_id());
		Map<String,Object> map=orderDao.getOrderByNo(conditionMap);
		String order_no=(String)map.get("order_no");
		logs.setOrder_no(order_no);
		return logs;
	}
	@Override
	public int updateMaterialExceptionLogs(
			MaterialExceptionLogs materialExceptionLogs) {
		String orderNo=materialExceptionLogs.getOrder_no();
		Map<String, Object> conditionMap=new HashMap<String, Object> ();
		conditionMap.put("orderNo", orderNo);
		Map<String,Object> map=orderDao.getOrderByNo(conditionMap);
		long orderId=map.get("id")!=null ? (long)map.get("id") : 0;
		materialExceptionLogs.setOrder_id(orderId);
		return qualityDao.updateMaterialExceptionLogs(materialExceptionLogs);
	}
	
	public int insertStdRecord(BmsBaseQCStdRecord stdRecord) {
		return qualityDao.insertStdRecord(stdRecord);
	}
    // 品质标准更新记录【新增、查询】 add by tangjin
	public BmsBaseQCStdRecord selectStdRecord(int recordId) {
		return qualityDao.selectStdRecord(recordId);
	}

	public Map<String, Object> getStdRecordList(
			Map<String, Object> conditionMap) {
		int totalCount=0;
		List<BmsBaseQCStdRecord> datalist=qualityDao.getStdRecordList(conditionMap);
		totalCount=qualityDao.getStdRecordCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}

	public int getStdRecordCount(Map<String, Object> conditionMap) {
        return qualityDao.getStdRecordCount(conditionMap);
	}













		

	//======================== tj end=================================//
	
	@Override
	public Map<String, Object> getFaultLibList(Map<String, Object> conditionMap) {
		List<Map<String,String>> datalist= qualityDao.getFaultLibList(conditionMap);
		int totalCount= qualityDao.getFaultLibCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	
	@Override
	public int insertFaultLib(StdFaultLibBean faultLib) {
		return qualityDao.insertFaultLib(faultLib);
	}
	@Override
	public int updateFaultLib(StdFaultLibBean faultLib) {
		return qualityDao.updateFaultLib(faultLib);
	}
	@Override
	public Map<String, Object> getQaTargetParamList(Map<String, Object> conditionMap) {
		Map<String, Object> result=new HashMap<String,Object>();
		int totalCount= qualityDao.getQualityTargetCount(conditionMap);
		List<Map<String,String>> datalist= qualityDao.getQualityTargetList(conditionMap);
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public int insertQualityTarget(QualityTargetBean qualityTarget) {
		return qualityDao.insertQualityTarget(qualityTarget);
	}
	@Override
	public int updateQualityTarget(QualityTargetBean qualityTarget) {
		return qualityDao.updateQualityTarget(qualityTarget);
	}
	@Override
	public Map<String, Object> getProcessFaultList(Map<String, Object> conditionMap) {
		Map<String, Object> result=new HashMap<String,Object>();
		int totalCount= qualityDao.getProcessFaultCount(conditionMap);
		List<Map<String,String>> datalist= qualityDao.getProcessFaultList(conditionMap);
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public int addProcessFault(ProcessFaultBean pocessFault) {
		return qualityDao.addProcessFault(pocessFault);
	}
	@Override
	public ProcessFaultBean showProcessFaultInfo(int id) {
		return qualityDao.showProcessFaultInfo(id);
	}
	@Override
	public int editProcessFault(ProcessFaultBean pocessFault) {
		return qualityDao.editProcessFault(pocessFault);
	}
	@Override
	public int insertProblemImprove(ProblemImproveBean problemImprove) {
		return qualityDao.insertProblemImprove(problemImprove);
	}
	@Override
	public Map<String, Object> getProblemImproveList(Map<String, Object> conditionMap) {
		Map<String, Object> result=new HashMap<String,Object>();
		int totalCount= qualityDao.getProblemImproveCount(conditionMap);
		List<Map<String,String>> datalist= qualityDao.getProblemImproveList(conditionMap);
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public ProblemImproveBean showProblemImproveInfo(int id) {
		return qualityDao.showProblemImproveInfo(id);
	}
	@Override
	public int updateProblemImprove(ProblemImproveBean problemImprove) {
		return qualityDao.updateProblemImprove(problemImprove);
	}
	
		
}
