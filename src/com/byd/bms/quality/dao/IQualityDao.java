package com.byd.bms.quality.dao;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Repository(value="qualityDao")
public interface IQualityDao {
	public int insertFaultLib(Map<String, Object> faultLib);
	public int updateFaultLib(Map<String, Object> faultLib);
	public List<Map<String, String>> getFaultLibList(Map<String, Object> conditionMap);	
	public int getFaultLibCount(Map<String, Object> conditionMap);
	
	int getOrderKeyPartsTemplateCount(Map<String, Object> condMap);
	List<Map<String, Object>> getOrderKeyPartsTemplateList(Map<String, Object> condMap);
	Map<String, Object> queryKeyPartsHeader(Map<String, Object> keyParts);
	int saveKeyPartsHeader(Map<String, Object> keyParts);
	int saveKeyPartsDetails(List detail_list);
	int updateKeyPartsHeader(Map<String, Object> keyParts);
	int deleteKeyPartsByHeader(@Param(value="header_id")int header_id);
	List<Map<String, Object>> queryKeyPartsList(Map<String, Object> condMap);
	List<Map<String, String>> queryWorkshopProcessList(@Param(value="addList")List<Map<String, String>> addList);
	public String queryKeyPartsMaxVersion(String project_id);
	public List<Map<String, String>> getKeyPartsList(Map<String, Object> keyParts);
	int getPrdRcdOrderTplCount(Map<String, Object> condMap);
	List<Map<String, Object>> getPrdRcdOrderTplList(Map<String, Object> condMap);
	Map<String, Object> getProjectByNo(Map<String, Object> condMap);
	int saveInspectionRecordTemplate(List detail_list);
	public String queryInspectionRecordMaxVersion(String project_id);
	public int deleteInspectionRecordTemplate(Map<String, Object> condMap);
	public List<Map<String, String>> getPrdRcdOrderTplDetailList(Map<String, Object> map);
	public List<Map<String, Object>> getPrdRcdTestingTplList(Map<String, Object> keyParts);
	int getPrdRcdTestingTplCount(Map<String, Object> condMap);
	public int saveTestingTemplateHead(Map<String, Object> map);
	public int saveTestingTemplateItem(Map<String, Object> map);
	public int deleteTestingTemplateByHeader(int header_id);
	public int updateTestingTemplateHeader(Map<String, Object> keyParts);
	Map<String, Object> queryTestingTemplateHeader(Map<String, Object> condMap);
	public List<Map<String, String>> getTestingTemplateDetailByHeader(Map<String, Object> map);
	public int deleteKeyPartsDetails(Map<String, Object> map);
	public List<Map<String, String>> getKeyPartsTraceList(Map<String, Object> conditionMap);	
	public int getKeyPartsTraceCount(Map<String, Object> conditionMap);
	public List<Map<String, String>> getBusNumberDetailList(Map<String, Object> conditionMap);
	public List<Map<String, String>> getBusNumberTemplateList(Map<String, Object> conditionMap);	
	public int saveKeyParts(List<Map<String, String>> list);
	public int updateKeyParts(List<Map<String, String>> list);
	public int getInspectionRecordCount(Map<String, Object> condMap);
	public List<Map<String, Object>> getInspectionRecordList(Map<String, Object> condMap);
	public List<Map<String, Object>> getInspectionDetailList(Map<String, Object> condMap);
	public int saveInspectionRecord(Map<String, Object> map);
	public List<Map<String, Object>> getInspectionRecordDetail(Map<String, Object> map);
	public List<Map<String, Object>> getInspectionByBusNo(Map<String, Object> map);
	public int updateInspectionRecord(List list);
	public List<Map<String, String>> getDefectCode(Map<String, Object> conditionMap);
	public List<Map<String, String>> getLocationList(Map<String, Object> conditionMap);
	public int addPunch(Map<String, Object> conditionMap);
	public List<Map<String, String>> getPunchList(Map<String, Object> conditionMap);
	public int getPunchListCount(Map<String, Object> conditionMap);
	public int editPunchList(Map<String, Object> conditionMap);

	public List<Map<String, Object>> getTestingRecordList(Map<String, Object> conditionMap);	
	public int getTestingRecordCount(Map<String, Object> conditionMap);
	int saveTestingRecord(Map<String, Object> map);
	public List<Map<String, Object>> getTestingRecordDetailList(Map<String, Object> conditionMap);
	public int updateTestingRecord(List<Map<String, String>> list);

	public int leadInitialsPunch(Map<String, Object> conditionMap);
	public int qcInitialsPunch(Map<String, Object> conditionMap);

}
