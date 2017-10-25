package com.byd.bms.util.job;

import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.ui.ModelMap;

import com.byd.bms.plan.dao.IPlanDao;
import com.byd.bms.util.EmailSender;
import com.byd.bms.util.EmailSender.TableTable;
import com.byd.bms.util.EmailSender.TableTable.TdTd;
import com.byd.bms.util.dao.ICommonDao;
import com.byd.bms.util.dao.IEmailDao;
import com.byd.bms.util.service.impl.MailSenderServiceImpl;


public class SendPlanEmailJob  implements Job {
	
	@Override
	public void execute(JobExecutionContext arg0) throws JobExecutionException {
		// TODO Auto-generated method stub
		
	}

	private SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
	private IPlanDao planDao;
	private ICommonDao commonDao;	
	private IEmailDao emailDao;

	public IPlanDao getPlanDao() {
		return planDao;
	}

	public void setPlanDao(IPlanDao planDao) {
		this.planDao = planDao;
	}

	public ICommonDao getCommonDao() {
		return commonDao;
	}

	public void setCommonDao(ICommonDao commonDao) {
		this.commonDao = commonDao;
	}

	public IEmailDao getEmailDao() {
		return emailDao;
	}

	public void setEmailDao(IEmailDao emailDao) {
		this.emailDao = emailDao;
	}

	/**
	 * 计划生产日报表
	 * @return
	 * @throws UnsupportedEncodingException
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	public void work() throws IllegalAccessException{
		Map emailConditionMap = new HashMap<String,Object>();
		emailConditionMap.put("email_type", "生产日报表");
		List<Map<String,Object>> emaildatalist=new ArrayList();
		emaildatalist = emailDao.getEmailTemplet(emailConditionMap);
		for(Map<String,Object> map : emaildatalist){
			sendPlanDayEmail(map);
		}
	}
	
	public void sendPlanDayEmail(Map<String,Object> m){
		Map<String,Object> conditionMap=new HashMap<String,Object>();
		conditionMap.put("factory_id", String.valueOf(m.get("factory_id")));
		conditionMap.put("order_no", "");
		String workshop = "";
		/*if (!request.getParameter("workshop").equals("全部")) workshop = request.getParameter("workshop");*/
		conditionMap.put("workshop", workshop);
		/*conditionMap.put("start_date", sdf.format(new Date()));
		conditionMap.put("end_date", sdf.format(new Date()));*/
		conditionMap.put("start_date", "2017-08-29");
		conditionMap.put("end_date", "2017-08-29");
		List<Map<String,String>> datalist=new ArrayList();
		datalist = planDao.getPlanSerach(conditionMap);
		
		List plan_code=new ArrayList();
		if (datalist.size() == 0){
			//无数据，不发邮件
			System.out.println(String.valueOf(m.get("factory_name"))+"无数据!");
			return;
		}
		
		//邮件模块
		MailSenderServiceImpl mss = new MailSenderServiceImpl();
		
		JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();
        // 设定 Mail Server
        senderImpl.setHost("smtp.byd.com");
        
        //SMTP验证时，需要用户名和密码
        senderImpl.setUsername("div19BMS@byd.com");
        senderImpl.setPassword("rhc3@kxrz");
        senderImpl.setPort(25);
        mss.setMailSender(senderImpl);
        mss.setDefaultFrom("div19BMS@byd.com");
        //mss.send("duan.qiling@byd.com", "测试", "54321");
		
		mss.setTemplet("classpath:com/byd/bms/util/emailTemplet.html");
		mss.setEncode("utf-8");
		
		EmailSender emailSender = new EmailSender();
		emailSender.setTo(String.valueOf(m.get("inbox"))/*"wang.bo44@byd.com;liu.rui3@byd.com;wang.haitao4@byd.com;jiang.xiayun@byd.com;tan.haiwen@byd.com;wu.xiao1@byd.com;duan.qiling@byd.com;zeng.ni@byd.com;jiang.pei1@byd.com;liu.hongpu@byd.com;dong.ping@byd.com;huang.hua6@byd.com;zhu.yunfeng@byd.com"*/);
		emailSender.setCc(String.valueOf(m.get("cc")));
		emailSender.setFrom("div19BMS@byd.com");
		//emailSender.setContent("http://10.23.1.61:8080/19bms/login.jsp");
		emailSender.getParam().put("content", String.valueOf(m.get("content")));
		emailSender.getParam().put("factory", String.valueOf(m.get("factory_name")));
		emailSender.getParam().put("maintitle", "生产日报");
		//Date d=new Date();
		//SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		emailSender.getParam().put("subtitle", sdf.format(new Date()));
		emailSender.setSubject(String.valueOf(m.get("subject")).replaceAll("XX年XX月XX日", sdf.format(new Date())));
		
		emailSender.setMerge(true);
		
		List<TableTable> tables = new ArrayList<TableTable>();
		
		Map<String,Integer> m_zzj=new HashMap<String,Integer>();
		m_zzj.put("plan", 0);
		m_zzj.put("real", 0);
		m_zzj.put("undone", 0);
		Map<String,Integer> m_bj=new HashMap<String,Integer>();
		m_bj.put("plan", 0);
		m_bj.put("real", 0);
		m_bj.put("undone", 0);
		Map<String,Integer> m_hzon=new HashMap<String,Integer>();
		m_hzon.put("plan", 0);
		m_hzon.put("real", 0);
		m_hzon.put("undone", 0);
		Map<String,Integer> m_hzoff=new HashMap<String,Integer>();
		m_hzoff.put("plan", 0);
		m_hzoff.put("real", 0);
		m_hzoff.put("undone", 0);
		Map<String,Integer> m_tzon=new HashMap<String,Integer>();
		m_tzon.put("plan", 0);
		m_tzon.put("real", 0);
		m_tzon.put("undone", 0);
		Map<String,Integer> m_tzoff=new HashMap<String,Integer>();
		m_tzoff.put("plan", 0);
		m_tzoff.put("real", 0);
		m_tzoff.put("undone", 0);
		Map<String,Integer> m_dpon=new HashMap<String,Integer>();
		m_dpon.put("plan", 0);
		m_dpon.put("real", 0);
		m_dpon.put("undone", 0);
		Map<String,Integer> m_dpoff=new HashMap<String,Integer>();
		m_dpoff.put("plan", 0);
		m_dpoff.put("real", 0);
		m_dpoff.put("undone", 0);
		Map<String,Integer> m_zzon=new HashMap<String,Integer>();
		m_zzon.put("plan", 0);
		m_zzon.put("real", 0);
		m_zzon.put("undone", 0);
		Map<String,Integer> m_zzoff=new HashMap<String,Integer>();
		m_zzoff.put("plan", 0);
		m_zzoff.put("real", 0);
		m_zzoff.put("undone", 0);
		Map<String,Integer> m_rk=new HashMap<String,Integer>();
		m_rk.put("plan", 0);
		m_rk.put("real", 0);
		m_rk.put("undone", 0);
		
		//订单计划达成表格封装
		TableTable tableX = emailSender.new TableTable();
		List<TdTd> theadX = new ArrayList<TdTd>();
		
		theadX.add(tableX.new TdTd("订单"));
		theadX.add(tableX.new TdTd("车间"));
		theadX.add(tableX.new TdTd("今日计划"));
		theadX.add(tableX.new TdTd("实际完成"));
		theadX.add(tableX.new TdTd("累计完成"));
		theadX.add(tableX.new TdTd("备注"));
		
		tableX.setThead(theadX);
		
		List<List<TdTd>> tbodyX = new ArrayList<List<TdTd>>();
		for(Map<String,String> m1 : datalist){
			List<TdTd> tr = new ArrayList<TdTd>();
			tr.add(tableX.new TdTd(String.valueOf(m1.get("order_desc"))));
			tr.add(tableX.new TdTd(String.valueOf(m1.get("key_name"))));
			tr.add(tableX.new TdTd(String.valueOf(m1.get("total_plan_qty"))));
			tr.add(tableX.new TdTd(String.valueOf(m1.get("real_qty"))));
			tr.add(tableX.new TdTd(String.valueOf(m1.get("total_qty"))));
			if(m1.get("key_name").equals("自制件下线")){
				m_zzj.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_zzj.get("plan"));
				m_zzj.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_zzj.get("real"));
				m_zzj.put("undone", m_zzj.get("plan")-m_zzj.get("real"));
			}
			if(m1.get("key_name").equals("部件下线")){
				m_bj.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_bj.get("plan"));
				m_bj.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_bj.get("real"));
				m_bj.put("undone", m_bj.get("plan")-m_bj.get("real"));
			}
			if(m1.get("key_name").equals("焊装上线")){
				m_hzon.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_hzon.get("plan"));
				m_hzon.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_hzon.get("real"));
				m_hzon.put("undone", m_hzon.get("plan")-m_hzon.get("real"));
			}
			if(m1.get("key_name").equals("焊装下线")){
				m_hzoff.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_hzoff.get("plan"));
				m_hzoff.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_hzoff.get("real"));
				m_hzoff.put("undone", m_hzoff.get("plan")-m_hzoff.get("real"));
			}
			if(m1.get("key_name").equals("涂装上线")){
				m_tzon.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_tzon.get("plan"));
				m_tzon.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_tzon.get("real"));
				m_tzon.put("undone", m_tzon.get("plan")-m_tzon.get("real"));
			}
			if(m1.get("key_name").equals("涂装下线")){
				m_tzoff.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_tzoff.get("plan"));
				m_tzoff.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_tzoff.get("real"));
				m_tzoff.put("undone", m_tzoff.get("plan")-m_tzoff.get("real"));
			}
			if(m1.get("key_name").equals("底盘上线")){
				m_dpon.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_dpon.get("plan"));
				m_dpon.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_dpon.get("real"));
				m_dpon.put("undone", m_dpon.get("plan")-m_dpon.get("real"));
			}
			if(m1.get("key_name").equals("底盘下线")){
				m_dpoff.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_dpoff.get("plan"));
				m_dpoff.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_dpoff.get("real"));
				m_dpoff.put("undone", m_dpoff.get("plan")-m_dpoff.get("real"));
			}
			if(m1.get("key_name").equals("总装上线")){
				m_zzon.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_zzon.get("plan"));
				m_zzon.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_zzon.get("real"));
				m_zzon.put("undone", m_zzon.get("plan")-m_zzon.get("real"));
			}
			if(m1.get("key_name").equals("总装下线")){
				m_zzoff.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_zzoff.get("plan"));
				m_zzoff.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_zzoff.get("real"));
				m_zzoff.put("undone", m_zzoff.get("plan")-m_zzoff.get("real"));
			}
			if(m1.get("key_name").equals("入库")){
				m_rk.put("plan", Integer.valueOf(String.valueOf(m1.get("total_plan_qty")))+m_rk.get("plan"));
				m_rk.put("real", Integer.valueOf(String.valueOf(m1.get("real_qty")))+m_rk.get("real"));
				m_rk.put("undone", m_rk.get("plan")-m_rk.get("real"));
			}
						
			
			
			if(m1.get("key_name").endsWith("下线")){
				Map<String,Object> conditionMap1 = new HashMap<String,Object>();
				conditionMap1.put("date_start", sdf.format(new Date()));
				conditionMap1.put("date_end", sdf.format(new Date()));
				conditionMap1.put("factory_id", String.valueOf(m.get("factory_id")));
				conditionMap1.put("order_no", m1.get("order_no"));
				conditionMap1.put("workshop_name", m1.get("key_name").replaceAll("下线", ""));
				/**
				List<ProductionException> datalist1=new ArrayList<ProductionException>();
				datalist1=planDao.getExceptionList(conditionMap1);
				if(datalist1.size()>0){
					String remark = datalist1.get(0).getDetailed_reasons();
					if(datalist1.size()>1){
						remark += "<br>"+datalist1.get(1).getDetailed_reasons();
					}
					tr.add(tableX.new TdTd(remark));
				}else{
					tr.add(tableX.new TdTd(" "));
				}**/
			}else{
				tr.add(tableX.new TdTd(" "));
			}
			tbodyX.add(tr);
		}
		tableX.setTbody(tbodyX);
			
		
		//车间计划达成表格封装
		TableTable tableW = emailSender.new TableTable();
		List<TdTd> theadW = new ArrayList<TdTd>();
		List<List<TdTd>> tbodyW = new ArrayList<List<TdTd>>();
		
		theadW.add(tableW.new TdTd("生产车间"));
		theadW.add(tableW.new TdTd("自制件下线"));
		theadW.add(tableW.new TdTd("部件下线"));
		theadW.add(tableW.new TdTd("焊装上线"));
		theadW.add(tableW.new TdTd("焊装下线"));
		theadW.add(tableW.new TdTd("涂装上线"));
		theadW.add(tableW.new TdTd("涂装下线"));
		theadW.add(tableW.new TdTd("底盘上线"));
		theadW.add(tableW.new TdTd("底盘下线"));
		theadW.add(tableW.new TdTd("总装上线"));
		theadW.add(tableW.new TdTd("总装下线"));
		theadW.add(tableW.new TdTd("入库"));
		tableW.setThead(theadW);
		
		List<TdTd> tr_plan = new ArrayList<TdTd>();
		tr_plan.add(tableW.new TdTd("计划数量"));
		tr_plan.add(tableW.new TdTd(m_zzj.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_bj.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_hzon.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_hzoff.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_tzon.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_tzoff.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_dpon.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_dpoff.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_zzon.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_zzoff.get("plan").toString()));
		tr_plan.add(tableW.new TdTd(m_rk.get("plan").toString()));
		tbodyW.add(tr_plan);
		
		List<TdTd> tr_real = new ArrayList<TdTd>();
		tr_real.add(tableW.new TdTd("实际完成量"));
		tr_real.add(tableW.new TdTd(m_zzj.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_bj.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_hzon.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_hzoff.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_tzon.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_tzoff.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_dpon.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_dpoff.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_zzon.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_zzoff.get("real").toString()));
		tr_real.add(tableW.new TdTd(m_rk.get("real").toString()));
		tbodyW.add(tr_real);
		
		List<TdTd> tr_rate = new ArrayList<TdTd>();
		tr_rate.add(tableW.new TdTd("实际达成率"));
		String rate_zzj="-";
		if(Integer.parseInt(m_zzj.get("plan").toString())>0){
			rate_zzj=Integer.parseInt(m_zzj.get("real").toString())*100/Integer.parseInt(m_zzj.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_zzj));
		
		String rate_bj="-";
		if(Integer.parseInt(m_bj.get("plan").toString())>0){
			rate_bj=Integer.parseInt(m_bj.get("real").toString())*100/Integer.parseInt(m_bj.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_bj));
		
		String rate_hzon="-";
		if(Integer.parseInt(m_hzon.get("plan").toString())>0){
			rate_hzon=Integer.parseInt(m_hzon.get("real").toString())*100/Integer.parseInt(m_hzon.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_hzon));
		
		String rate_hzoff="-";
		if(Integer.parseInt(m_hzoff.get("plan").toString())>0){
			rate_hzoff=Integer.parseInt(m_hzoff.get("real").toString())*100/Integer.parseInt(m_hzoff.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_hzoff));
		
		String rate_tzon="-";
		if(Integer.parseInt(m_tzon.get("plan").toString())>0){
			rate_tzon=Integer.parseInt(m_hzon.get("real").toString())*100/Integer.parseInt(m_hzon.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_tzon));
		
		String rate_tzoff="-";
		if(Integer.parseInt(m_tzoff.get("plan").toString())>0){
			rate_tzoff=Integer.parseInt(m_tzoff.get("real").toString())*100/Integer.parseInt(m_tzoff.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_tzoff));
		
		String rate_dpon="-";
		if(Integer.parseInt(m_dpon.get("plan").toString())>0){
			rate_dpon=Integer.parseInt(m_dpon.get("real").toString())*100/Integer.parseInt(m_dpon.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_dpon));
		
		String rate_dpoff="-";
		if(Integer.parseInt(m_dpoff.get("plan").toString())>0){
			rate_dpoff=Integer.parseInt(m_dpoff.get("real").toString())*100/Integer.parseInt(m_dpoff.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_dpoff));
		
		String rate_zzon="-";
		if(Integer.parseInt(m_zzon.get("plan").toString())>0){
			rate_zzon=Integer.parseInt(m_zzon.get("real").toString())*100/Integer.parseInt(m_zzon.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_zzon));
		
		String rate_zzoff="-";
		if(Integer.parseInt(m_zzoff.get("plan").toString())>0){
			rate_zzoff=Integer.parseInt(m_zzoff.get("real").toString())*100/Integer.parseInt(m_zzoff.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_zzoff));
		
		String rate_rk="-";
		if(Integer.parseInt(m_rk.get("plan").toString())>0){
			rate_rk=Integer.parseInt(m_rk.get("real").toString())*100/Integer.parseInt(m_rk.get("plan").toString())+"%";
		}
		tr_rate.add(tableW.new TdTd(rate_rk));
		tbodyW.add(tr_rate);
		
		List<TdTd> tr_undone = new ArrayList<TdTd>();
		tr_undone.add(tableW.new TdTd("欠产数量"));
		tr_undone.add(tableW.new TdTd(m_zzj.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_bj.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_hzon.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_hzoff.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_tzon.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_tzoff.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_dpon.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_dpoff.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_zzon.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_zzoff.get("undone").toString()));
		tr_undone.add(tableW.new TdTd(m_rk.get("undone").toString()));
		tbodyW.add(tr_undone);
		
		tableW.setTbody(tbodyW);
		
		
		//tableX.setTbody(tbodyX);
		tables.add(0,tableW);
		tables.add(1,tableX);
		
		emailSender.setTables(tables);
		
		mss.send(emailSender,new ModelMap());
	}

}


