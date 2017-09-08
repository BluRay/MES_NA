package com.byd.bms.util.controller;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.ListIterator;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.byd.bms.util.EmailSender;
import com.byd.bms.util.EmailSender.TableTable;
import com.byd.bms.util.EmailSender.TableTable.TdTd;
import com.byd.bms.util.service.ICommonService;
import com.byd.bms.util.service.impl.MailSenderServiceImpl;
@Controller
@RequestMapping("/common")
@Scope("prototype") 
public class CommonController extends BaseController {
	@Autowired
	protected ICommonService commonService;
	/**
	 * added by xjw for 根据订单编号输入值模糊查询订单下拉列表
	 * 
	 * @return
	 */
	@RequestMapping("/getOrderFuzzySelect")
	@ResponseBody
	public ModelMap getOrderFuzzySelect() {
		model=new ModelMap();
		String orderNo = request.getParameter("orderNo");
		String busType = request.getParameter("busType");
		String factory = request.getParameter("factory");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("orderNo", orderNo);
		condMap.put("busType", busType);
		condMap.put("factory",factory);
		model.put("data", commonService.getOrderFuzzySelect(condMap));

		return model;
	}
	/**
	 * added by xjw for 查询工厂下拉列表
	 * 
	 * @return
	 */
	@RequestMapping("/getFactorySelect")
	@ResponseBody
	public ModelMap getFactorySelect(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String function_url = request.getParameter("function_url");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		condMap.put("function_url", function_url);
		model=new ModelMap();
		model.put("data", commonService.getFactorySelect(condMap));

		return model;
	}
	
	/**
	 * added by xjw for 查询工厂下拉列表(权限控制 ORG表获取)
	 * 
	 * @return
	 */
	@RequestMapping("/getFactorySelectAuth")
	@ResponseBody
	public ModelMap getFactorySelectAuth(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String function_url = request.getParameter("function_url");
		String org_kind = request.getParameter("org_kind");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		condMap.put("function_url", function_url);
		condMap.put("org_kind", org_kind);
		model=new ModelMap();
		model.put("data", commonService.getFactorySelectAuth(condMap));

		return model;
	}
	@RequestMapping("/getAllFactorySelect")
	@ResponseBody
	public ModelMap getAllFactorySelect(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		model=new ModelMap();
		model.put("data", commonService.getAllFactorySelect(condMap));
		return model;
	}
	
	/**
	 * added by xjw for 查询车型列表
	 * 
	 * @return
	 */
	@RequestMapping("/getBusType")
	@ResponseBody
	public ModelMap getBusType(){
		model=new ModelMap();
		model.put("data", commonService.getBusTypeSelect());

		return model;
	}
	/**
	 * added by xjw for 查询弹性建下拉列表
	 * 
	 * @return
	 */
	@RequestMapping("/getKeysSelect")
	@ResponseBody
	public ModelMap getKeysSelect(){
		model=new ModelMap();
		model.put("data", commonService.getKeysSelect(request.getParameter("keyCode")
				.toString()));
		return model;
	}
	
	@RequestMapping("/getDepartmentByFactory")
	@ResponseBody
	public ModelMap getDepartmentByFactory(String factory_id){
		model=new ModelMap();
		model.put("data", commonService.getDepartmentByFactory(factory_id));
		return model;
	}
	
	@RequestMapping("/getUserInfoByCard")
	@ResponseBody
	public ModelMap getUserInfoByCard(){
		model=new ModelMap();
		model.put("data", commonService.getUserInfoByCard(request.getParameter("card_no")));
		return model;
	}
	
	/**
	 * added by xjw for 查询车间下拉列表(权限控制，ORG表获取)
	 * 
	 * @return
	 */
	@RequestMapping("/getWorkshopSelectAuth")
	@ResponseBody
	public ModelMap getWorkshopSelectAuth(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String function_url = request.getParameter("function_url");
		String factory = request.getParameter("factory");
		String org_kind = request.getParameter("org_kind");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		condMap.put("function_url", function_url);
		condMap.put("factory", factory);
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("org_kind", org_kind);
		model=new ModelMap();
		model.put("data", commonService.getWorkshopSelectAuth(condMap));

		return model;
	}
	
	/**
	 * added by xjw for 查询车间下拉列表
	 * 
	 * @return
	 */
	@RequestMapping("/getWorkshopSelect")
	@ResponseBody
	public ModelMap getWorkshopSelect(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String function_url = request.getParameter("function_url");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		condMap.put("function_url", function_url);
		model=new ModelMap();
		model.put("data", commonService.getWorkshopSelect(condMap));

		return model;
	}
	
	@RequestMapping("/getReasonTypeSelect")
	@ResponseBody
	public ModelMap getReasonTypeSelect(){
		model=new ModelMap();
		model.put("data", commonService.getAllReasonType());
		return model;
	}
	
	/**
	 * 查询线别下拉列表（BMS_BASE_LINE表获取，无权限控制）
	 * @return
	 */
	@RequestMapping("/getLineSelect")
	@ResponseBody
	public ModelMap getLineSelect(){
		model=new ModelMap();
		model.put("data", commonService.getLineSelect());
		return model;
	}
	
	/**
	 * 查询线别下拉列表（BMS_BASE_PROCESS表获取，权限控制）
	 * @return
	 */
	@RequestMapping("/getLineSelectAuth")
	@ResponseBody
	public ModelMap getLineSelectAuth(){
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		String function_url = request.getParameter("function_url");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("staff_number", staff_number);
		condMap.put("function_url", function_url);
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		model=new ModelMap();
		model.put("data", commonService.getLineSelectAuth(condMap));
		return model;
	}
	
	
	@RequestMapping("/queryProcessList")
	@ResponseBody
	public ModelMap queryProcessList(){
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("id", request.getParameter("id"));
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("line", request.getParameter("line") + "线");
		model=new ModelMap();
		model.put("data", commonService.queryProcessList(condMap));
		return model;
	}
	
	@RequestMapping("/getWorkshopSelect_Key")
	@ResponseBody
	public ModelMap getWorkshopSelect_Key() {
		model=new ModelMap();
		model.put("data", commonService.getWorkshopSelect_Key());
		return model;
	}
	
	/**
	 * 根据订单编号查询订单配置列表
	 * @return
	 */
	@RequestMapping("/getOrderConfigSelect")
	@ResponseBody
	public ModelMap getOrderConfigSelect(){
		model=new ModelMap();
		model.put("data", commonService.getOrderConfigSelect(request.getParameter("order_id")));
		return model;
	}
	
	@RequestMapping("/getPartsSelect")
	@ResponseBody
	public ModelMap getPartsSelect(){
		String parts = request.getParameter("parts");
		List<Map<String,String>> selectList = commonService.getPartsSelect(parts);
		//mv.clear();
		//model = mv.getModelMap();
		model=new ModelMap();
		model.put("data",selectList);
		return model;
	}
	
	@RequestMapping("/getPartsSelectByParts")
	@ResponseBody
	public ModelMap getPartsSelectByParts(){
		String parts = request.getParameter("parts");
		
		return model;
	}
	
	@RequestMapping("/getBusNumberFuzzySelect")
	@ResponseBody
	public ModelMap getBusNumberFuzzySelect(){
		String bus_input=request.getParameter("bus_input");
		List<Map<String,String>> selectList =commonService.getBusNumberList(bus_input);
		model=new ModelMap();
		model.put("data",selectList);
		return model;
	}
	
	/**
	 * added by xjw for 查询班组下拉列表(ORG表获取)
	 * 
	 * @return
	 */
	@RequestMapping("/getWorkgroupSelect")
	@ResponseBody
	public ModelMap getWorkgroupSelect(){

		String factory = request.getParameter("factory");
		String workshop = request.getParameter("workshop");
		String workgroup_input= request.getParameter("workgroup");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("workgroup", workgroup_input);
		model=new ModelMap();
		model.put("data", commonService.getWorkgroupSelect(condMap));

		return model;
	}
	
	/**
	 * added by xjw for 查询小班组下拉列表(ORG表获取)
	 * 
	 * @return
	 */
	@RequestMapping("/getTeamSelect")
	@ResponseBody
	public ModelMap getTeamSelect(){

		String factory = request.getParameter("factory");
		String workshop = request.getParameter("workshop");
		String workgroup= request.getParameter("workgroup");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop", workshop);
		condMap.put("workgroup", workgroup);
		model=new ModelMap();
		model.put("data", commonService.getTeamSelect(condMap));

		return model;
	}
	
	/**
	 * added by xjw for 查询各个车间下的班组下拉列表(ORG表获取)
	 * 
	 * @return
	 */
	@RequestMapping("/getWorkgroupSelectAll")
	@ResponseBody
	public ModelMap getWorkgroupSelectAll(){

		String factory = request.getParameter("factory");
		String workshop_list = request.getParameter("workshop_list");
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("factory", factory);
		condMap.put("workshop_list", workshop_list);
		model=new ModelMap();
		model.put("data", commonService.getWorkgroupSelectAll(condMap));

		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 获取首页订单情况数据
	 * @return
	 */
	@RequestMapping("/getIndexOrderData")
	@ResponseBody
	public ModelMap getIndexOrderData(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy");
		String actYear = df.format(new Date());
		commonService.getIndexOrderData(actYear,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 获取首页工厂日计划达成数据
	 * @return
	 */
	@RequestMapping("/getIndexFactoryDailyData")
	@ResponseBody
	public ModelMap getIndexFactoryDailyData(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String query_date = df.format(new Date());
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("query_date", query_date);
		condMap.put("factory_id", request.getParameter("factory_id"));
		commonService.getIndexFactoryDailyData(condMap,model);
		return model;
	}
	@RequestMapping("/getStaffNameByNumber")
	@ResponseBody
	public ModelMap getStaffNameByNumber(){
		model=new ModelMap();
		String staff_number = request.getParameter("staff_number");
		commonService.getStaffNameByNumber(staff_number,model);
		return model;
	}
	
	/**
	 * added by tj for 查询当前任务
	 * 
	 * @return
	 */
	@RequestMapping("/getTaskList")
	@ResponseBody
	public ModelMap getTaskList(){

		String user_id = request.getSession().getAttribute("user_id") + "";
		String staff_number = request.getSession().getAttribute("staff_number") + "";
		Map<String,Object> condMap=new HashMap<String,Object>();
		condMap.put("user_id", user_id);
		condMap.put("staff_number", staff_number);
		model=new ModelMap();
		Map map=commonService.getTaskList(condMap);
		model.addAllAttributes(map);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 查询首页工厂在制订单报表数据
	 * @return
	 */
	@RequestMapping("/getIndexFactoryPrdOrdData")
	@ResponseBody
	public ModelMap getIndexFactoryPrdOrdData(){
		model=new ModelMap();
		commonService.getIndexFactoryPrdOrdData(request.getParameter("factory_id"),model);
		
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 查询首页产量报表数据
	 * @return
	 */
	@RequestMapping("/getIndexOutputData")
	@ResponseBody
	public ModelMap getIndexOutputData(){
		model=new ModelMap();
		SimpleDateFormat df = new SimpleDateFormat("yyyy");
		String actYear = df.format(new Date());
		commonService.getIndexOutputData(actYear,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 查询首页工厂停线异常信息
	 * @return
	 */
	@RequestMapping("/getIndexExceptionData")
	@ResponseBody
	public ModelMap getIndexExceptionData(){
		model.clear();
		String factory=request.getParameter("factory");
		commonService.getIndexExceptionData(factory,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * @return
	 */
	@RequestMapping("/getIndexStaffCountData")
	@ResponseBody
	public ModelMap getIndexStaffCountData(){
		model.clear();
		commonService.getIndexStaffCountData(model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * @return
	 */
	@RequestMapping("/getProductionIndexData")
	@ResponseBody
	public ModelMap getProductionIndexData(){
		model.clear();
		String factoryId=request.getParameter("factoryId");
		factoryId=factoryId==null?String.valueOf(session.getAttribute("factory_id")):factoryId;
		Map<String, Object> conditionMap = new HashMap<String, Object>();	
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curdate = df.format(new Date());
		
		conditionMap.put("factoryId", factoryId);
		conditionMap.put("curDate", curdate);
		
		commonService.getProductionIndexData(conditionMap,model);
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * @return
	 */
	@RequestMapping("/getMonitorBoardInfo")
	@ResponseBody
	public ModelMap getMonitorBoardInfo(){
		model.clear();
		String factoryId=request.getParameter("factory_id");
		String factory=request.getParameter("factory_name");/*session.getAttribute("factory").toString();*/
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String curDate = df.format(new Date());
		factoryId=factoryId==null?String.valueOf(session.getAttribute("factory_id")):factoryId;
		factory=factory==null?session.getAttribute("factory").toString():factory;
		String workshop = request.getParameter("workshop");
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("factoryId", factoryId);
		conditionMap.put("factory", factory);
		if (!StringUtils.isEmpty(workshop)) {
			conditionMap.put("workshop", workshop);
		}
		conditionMap.put("curDate", curDate);
		commonService.getMonitorBoardInfo(conditionMap,model);
		model.put("factory", factory);
		return model;
	}
	
	/**
	 * 动态获取车间监控面板工厂和时间
	 * 
	 * @return
	 */
	@RequestMapping("/getWorkshopBoardHeadInfo")
	@ResponseBody
	public ModelMap getWorkshopBoardHeadInfo() {
		model.clear();
		String factory=session.getAttribute("factory").toString();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String curTime = df.format(new Date());
		model.put("factory", factory);
		model.put("curTime", curTime);
		return model;
	}
	
	/**
	 * 获取组织结构权限树
	 * @return
	 */
	@RequestMapping("/getOrgAuthTree")
	@ResponseBody
	public ModelMap getOrgAuthTree(){
		model.clear();
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("staff_number", session.getAttribute("staff_number"));
		conditionMap.put("url",  request.getParameter("url"));
		conditionMap.put("org_type", request.getParameter("orgType")); // 部门类别 (0事业部-1部门-2工厂-3科室-4车间-5班组-6小班组)
		conditionMap.put("org_kind", request.getParameter("orgKind"));// 部门类别  (0管理型-1生产型)
		
		commonService.getOrgAuthTree(conditionMap,model);
		return model;
	}
	/**
	 * @author xiong.jianwu
	 * 查询车间该月工资是否已提交或者结算
	 * @return
	 */
	@RequestMapping("/getSubmitSalary")
	@ResponseBody
	public ModelMap getSubmitSalary(){
		model.clear();
		Map<String, Object> condMap = new HashMap<String, Object>();
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workshop", request.getParameter("workshop"));
		condMap.put("month", request.getParameter("month"));
		
		commonService.getSubmitSalary(condMap,model);
		return model;
	}
	@RequestMapping("/getBasePrice")
	@ResponseBody
	public ModelMap getBasePrice() throws UnsupportedEncodingException{	
		model.clear();
		Map<String, Object> condMap = new HashMap<String, Object>();
		condMap.put("factory", request.getParameter("factory"));
		condMap.put("workDate", request.getParameter("workDate"));
		condMap.put("type", request.getParameter("type"));
		
		commonService.getBasePrice(condMap,model);
		return model;
	}
	
	@RequestMapping("/getChildOrgList")
	@ResponseBody
	public ModelMap getChildOrgList(){
		String parentId = request.getParameter("parentId");
		List<Map<String,String>> datalist = commonService.queryChildOrgList(parentId);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	@RequestMapping("/getStaffInfo")
	@ResponseBody
	public ModelMap getStaffInfo(){
		Map<String, Object> conditionMap = new HashMap<String, Object>();
		conditionMap.put("staffNum", request.getParameter("staffNum"));
		conditionMap.put("factory", request.getParameter("factory"));
		conditionMap.put("dept", request.getParameter("dept"));
		conditionMap.put("workshop", request.getParameter("workshop"));
		conditionMap.put("workgroup", request.getParameter("workgroup"));
		conditionMap.put("subgroup", request.getParameter("subgroup"));
		conditionMap.put("workDate", request.getParameter("workDate"));
		conditionMap.put("order_id", request.getParameter("order_id"));
		conditionMap.put("hourType", request.getParameter("hourType"));
		
		List<Map<String,String>> datalist = commonService.queryStaffInfo(conditionMap);
		Map<String, Object> result = new HashMap<String,Object>();
		result.put("data", datalist);
		mv.clear();
		mv.getModelMap().addAllAttributes(result);
		model = mv.getModelMap();
		return model;
	}
	
	
	/**
	 * 使用公用邮箱发送邮件
	 * @return
	 * @throws UnsupportedEncodingException 
	 */
	@RequestMapping("sendEmail")
	@ResponseBody
	public ModelMap sendEmail() throws UnsupportedEncodingException {
		model.clear();
		String thead=request.getParameter("thead");
		String[] theadarr=thead.split(",");
		String tbdatalist=request.getParameter("tbdatalist");
		JSONArray jsa=JSONArray.fromObject(tbdatalist);
		String mailTo= request.getParameter("mailTo");
		String cc=request.getParameter("cc");
		String mainTitle=request.getParameter("title");		
		String content=request.getParameter("content");
		
		request.setCharacterEncoding("UTF-8");
		// 邮件模块
		MailSenderServiceImpl mss = new MailSenderServiceImpl();

		JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();
		// 设定 Mail Server
		senderImpl.setHost("smtp.byd.com");

		// SMTP验证时，需要用户名和密码
		senderImpl.setUsername("div19BMS@byd.com");
		senderImpl.setPassword("rhc3@kxrz");
		senderImpl.setPort(25);
		mss.setMailSender(senderImpl);
		mss.setDefaultFrom("div19BMS@byd.com");
		// mss.send("duan.qiling@byd.com", "测试", "54321");

		mss.setTemplet("classpath:com/byd/bms/util/emailTemplet.html");
		mss.setEncode("utf-8");
		
		EmailSender emailSender = new EmailSender();
		emailSender.setTo(mailTo);
		emailSender.setCc(cc);
		emailSender.getParam().put("content", content);
		emailSender.getParam().put("subtitle", "");
		emailSender.getParam().put("factory", "");
		emailSender.getParam().put("maintitle", mainTitle);
		emailSender.setSubject(mainTitle);
		emailSender.setContent(content);
		
		emailSender.setMerge(true);
		
		//封装邮件内容表格
		List<TableTable> tables = new ArrayList<TableTable>();
		
		TableTable tableX = emailSender.new TableTable();
		List<TdTd> theadX = new ArrayList<TdTd>();
		List<List<TdTd>> tbodyX = new ArrayList<List<TdTd>>();
		for (int i=0;i<theadarr.length;i++) { //遍历keys封装thead
	        String key = theadarr[i];
	        theadX.add(tableX.new TdTd(key));
		}
		
		for(ListIterator lit=jsa.listIterator();lit.hasNext();){
			JSONObject jso=(JSONObject) lit.next();
			  List<TdTd> tr = new ArrayList<TdTd>();
			  /*for (Iterator iter = jso.keys(); iter.hasNext();) {//封装tbody 
			        String key = (String)iter.next();			        
					tr.add(tableX.new TdTd(jso.getString(key)));
			  } */
			  for (int i=0;i<theadarr.length;i++) { //遍历keys封装thead
			        String key = theadarr[i];
			        tr.add(tableX.new TdTd(jso.getString(key)));
				}
			  tbodyX.add(tr);
			  
		}
		tableX.setThead(theadX);
		tableX.setTbody(tbodyX);
		tables.add(tableX);
		
		emailSender.setTables(tables);
		
		mss.send(emailSender,model);
		
		return model;
	}
	
	/**
	 * @author xiong.jianwu
	 * 查询用户角色列表
	 * @return
	 */
	@RequestMapping("/getRoleListAuth")
	@ResponseBody
	public ModelMap getRoleListAuth(){
		model.clear();
		String staff_number = request.getSession().getAttribute("staff_number").toString();
		commonService.getRoleListAuth(staff_number,model);
				
		return model;
	}
}
