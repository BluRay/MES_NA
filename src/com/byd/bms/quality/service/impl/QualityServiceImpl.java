package com.byd.bms.quality.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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
import com.byd.bms.util.DataSource;
@Service
@DataSource("dataSourceMaster")
public class QualityServiceImpl implements IQualityService {
	@Resource(name="qualityDao")
	private IQualityDao qualityDao;
	@Resource(name="orderDao")
	private IOrderDao orderDao;

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
	public int insertFaultLib(Map<String, Object> faultLib) {
		return qualityDao.insertFaultLib(faultLib);
	}
	@Override
	public int updateFaultLib(Map<String, Object> faultLib) {
		return qualityDao.updateFaultLib(faultLib);
	}

	@Override
	public void getOrderKeyPartsTemplateList(Map<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.getOrderKeyPartsTemplateList(condMap);
		totalCount=qualityDao.getOrderKeyPartsTemplateCount(condMap);
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
		String project_id=keyParts.get("project_id").toString();
		String version=keyParts.get("version")!=null ? keyParts.get("version").toString() : "";
		String editor_id=keyParts.get("editor_id").toString();
		String edit_date=(String)keyParts.get("edit_date");
		List detail_list=new ArrayList();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		JSONArray jsa=new JSONArray();
		if(version.equals("")){
			version=qualityDao.queryKeyPartsMaxVersion(project_id);
			if(version==null){
				version ="V"+ df.format(new Date())+"01";
			}else{
				String monthyear=version.substring(1, 9);
				if(monthyear.equals(df.format(new Date()).toString())){
					String versionStr=version.substring(version.length()-2, version.length());
					int versionNo=Integer.parseInt(versionStr)+1;
					version ="V"+ df.format(new Date())+"0"+versionNo;
				}else{
					version ="V"+ df.format(new Date())+"01";
				}    
			}
		}
		if(parts_detail.contains("[")){
			jsa=JSONArray.fromObject(parts_detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			Map<String,Object> detail=(Map<String, Object>) JSONObject.toBean(el, Map.class);
			detail.put("project_id", project_id);
			detail.put("version", version);
			detail.put("editor_id", editor_id);
			detail.put("edit_date", edit_date);
			detail_list.add(detail);
		}
		if(keyParts.get("version")==null){
			qualityDao.saveKeyPartsDetails(detail_list);
		}else{
			Map<String,Object> map=new HashMap<String,Object>();
			qualityDao.deleteKeyPartsDetails(keyParts);
			qualityDao.saveKeyPartsDetails(detail_list);
		}
	}
	@Override
	public void getKeyPartsList(HashMap<String, Object> condMap, ModelMap model) {
		model.put("data", qualityDao.getKeyPartsList(condMap));		
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
	public void getPrdRcdOrderTplList(Map<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.getPrdRcdOrderTplList(condMap);
		totalCount=qualityDao.getPrdRcdOrderTplCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);

	}
	public void getProjectByNo(Map<String, Object> condMap, ModelMap model){
		Map<String, Object> datalist=qualityDao.getProjectByNo(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	@Override
	@Transactional
	public void saveInspectionRecordTemplate(Map<String, Object> inspection) {
		List detail_list=new ArrayList();
		String detail=(String)inspection.get("detail");
		String project_id=inspection.get("project_id").toString();
		String editor_id=inspection.get("editor_id").toString();
		String edit_date=(String)inspection.get("edit_date");
		String version=inspection.get("version")!=null ? (String)inspection.get("version"):"";
		if(version.equals("")){ // 新增导入
			SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
			// 同一天内 新增导入多次的情况
			version=qualityDao.queryInspectionRecordMaxVersion(project_id);
			if(version!=null){
				String monthyear=version.substring(1, 9);
				if(monthyear.equals(df.format(new Date()).toString())){
					String versionStr=version.substring(version.length()-2, version.length());
					int versionNo=Integer.parseInt(versionStr)+1;
					version ="V"+ df.format(new Date())+"0"+versionNo;
				}else{
					version ="V"+ df.format(new Date())+"01";
				}    
			}else{
				version ="V"+ df.format(new Date())+"01";
			}
		}
		JSONArray jsa=new JSONArray();
		if(detail.contains("[")){
			jsa=JSONArray.fromObject(detail);
		}
		Iterator it=jsa.iterator();
		while(it.hasNext()){
			JSONObject el= (JSONObject) it.next();
			Map<String,Object> detailmap=(Map<String, Object>) JSONObject.toBean(el, Map.class);
			detailmap.put("project_id", Integer.parseInt(project_id));
			detailmap.put("version", version);
			detailmap.put("editor_id", Integer.parseInt(editor_id));
			detailmap.put("edit_date", edit_date);
			detail_list.add(detailmap);
		}
		if(inspection.get("version")!=null){ // 更新此前版本,先删除
			Map<String,Object> map=new HashMap<String,Object>();
			map.put("project_id", Integer.parseInt(project_id));
			map.put("version", (String)inspection.get("version"));
			qualityDao.deleteInspectionRecordTemplate(map);
		}
		qualityDao.saveInspectionRecordTemplate(detail_list);
	}
	@Override
	public void getPrdRcdOrderTplDetailList(HashMap<String, Object> condMap, ModelMap model) {
		model.put("data", qualityDao.getPrdRcdOrderTplDetailList(condMap));		
	}
	@Override
	public void getPrdRcdTestingTplList(Map<String, Object> condMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, Object>> datalist=qualityDao.getPrdRcdTestingTplList(condMap);
		totalCount=qualityDao.getPrdRcdTestingTplCount(condMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", condMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);

	}
	@Override
	@Transactional
	public void saveTestingTemplate(Map<String, Object> testing) {
		List detailList=(List) testing.get("detail");
		Object header_id=testing.get("header_id");
		Map<String,Object> smap=new HashMap<String,Object>();
		smap.put("list", detailList);
		if(detailList.size()>0){
			if(header_id==null){ // 此版本不存在，先保存HEAD表，在保存ITEM表
				qualityDao.saveTestingTemplateHead(testing);
			    header_id=(int) testing.get("id");	
			    smap.put("testing_template_head_id", header_id);
			    qualityDao.saveTestingTemplateItem(smap);
			}else{
				qualityDao.updateTestingTemplateHeader(testing); // 更新header
				qualityDao.deleteTestingTemplateByHeader(Integer.parseInt(header_id.toString())); //根据header_id删除ITEM表记录
				smap.put("testing_template_head_id", header_id);
				qualityDao.saveTestingTemplateItem(smap); // 保存到ITEM表		
			}
	    }
	}
	public void getTestingTemplateByHeader(Map<String, Object> condMap, ModelMap model){
		model.put("data", qualityDao.getTestingTemplateDetailByHeader(condMap));
	}
	@Override
	public void getKeyPartsTraceList(Map<String, Object> conditionMap, ModelMap model) {
		int totalCount=0;
		List<Map<String, String>> datalist=qualityDao.getKeyPartsTraceList(conditionMap);
		totalCount=qualityDao.getKeyPartsTraceCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	public void getBusNumberDetailList(Map<String, Object> condMap, ModelMap model){
		model.put("data", qualityDao.getBusNumberDetailList(condMap));
	}
	public void getBusNumberTemplateList(Map<String, Object> condMap, ModelMap model){
		model.put("data", qualityDao.getBusNumberTemplateList(condMap));
	}
	@Transactional
	public int updateKeyParts(List<Map<String,Object>> list){
		int result=0;
		List addlist=new ArrayList<>();
		List updatelist=new ArrayList<>();
		for(Map map : list){
			int trace_id=Integer.parseInt(map.get("trace_id").toString());
			if(trace_id==0){
				addlist.add(map);			
			}else{
				updatelist.add(map);			
			}
		}
		if(addlist.size()>0){
			result=qualityDao.saveKeyParts(addlist);
		}
		if(updatelist.size()>0){
			result=qualityDao.updateKeyParts(updatelist);
		}
		
		return result;
	}
	@Override
	public void getInspectionRecordList(
			Map<String, Object> conditionMap, ModelMap model) {
		List<Map<String,Object>> datalist= qualityDao.getInspectionRecordList(conditionMap);
		int totalCount= qualityDao.getInspectionRecordCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	public int saveInspectionRecord(Map<String, Object> map){
		return qualityDao.saveInspectionRecord(map);
	}
	@Override
	public void getInspectionRecordDetail(Map<String,Object> conditionMap,ModelMap model) {
		List<Map<String,Object>> datalist= qualityDao.getInspectionRecordDetail(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	public int updateInspectionRecord(List list){
		return qualityDao.updateInspectionRecord(list);
	}

	@Override
	public List<Map<String, String>> getDefectCode(Map<String, Object> conditionMap) {
		return qualityDao.getDefectCode(conditionMap);
	}
	@Override
	public List<Map<String, String>> getLocationList(Map<String, Object> conditionMap) {
		return qualityDao.getLocationList(conditionMap);
	}
	@Override
	public int addPunch(Map<String, Object> conditionMap) {
		return qualityDao.addPunch(conditionMap);
	}
	@Override
	public Map<String, Object> getPunchList(Map<String, Object> conditionMap) {
		int totalCount=0;
		List<Map<String,String>> datalist = qualityDao.getPunchList(conditionMap);
		totalCount = qualityDao.getPunchListCount(conditionMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		return result;
	}
	@Override
	public List<Map<String, String>> getPunchInfoByid(Map<String, Object> conditionMap) {
		return qualityDao.getPunchList(conditionMap);
	}
	@Override
	public int editPunch(Map<String, Object> conditionMap) {
		return qualityDao.editPunchList(conditionMap);
	}

	@Override
	public void getTestingRecordList(Map<String, Object> conditionMap,ModelMap model) {
		List<Map<String,Object>> datalist= qualityDao.getTestingRecordList(conditionMap);
		int totalCount= qualityDao.getTestingRecordCount(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("draw", conditionMap.get("draw"));
		result.put("recordsTotal", totalCount);
		result.put("recordsFiltered", totalCount);
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	@Override
	public int checkTestingRecord(Map<String, Object> conditionMap) {
		return qualityDao.getTestingRecordCount(conditionMap);
	}
	@Transactional
	public int saveTestingRecord(Map<String, Object> map){
		return qualityDao.saveTestingRecord(map);
	}
	public void getTestingRecordDetailList(Map<String, Object> conditionMap,ModelMap model){
		List<Map<String,Object>> datalist= qualityDao.getTestingRecordDetailList(conditionMap);
		Map<String, Object> result=new HashMap<String,Object>();
		result.put("data", datalist);
		model.addAllAttributes(result);
	}
	public int updateTestingRecord(List<Map<String, String>> list){
		return qualityDao.updateTestingRecord(list);
	}

	@Override
	public int leadInitialsPunch(Map<String, Object> conditionMap) {
		return qualityDao.leadInitialsPunch(conditionMap);
	}
	@Override
	public int qcInitialsPunch(Map<String, Object> conditionMap) {
		return qualityDao.qcInitialsPunch(conditionMap);
	}
}
