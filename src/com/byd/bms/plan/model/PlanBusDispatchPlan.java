package com.byd.bms.plan.model;

public class PlanBusDispatchPlan {
	private int id;
	private int factory_id;
	private String factory_name;
	private int order_id;
	private String order_no;
	private int plan_dispatch_qty;
	private String dispatch_date;
	private String customer_number_flag;
	private String status;
	private String email_addrs;
	private String creater_id;
	private String creatdate;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getFactory_id() {
		return factory_id;
	}
	public void setFactory_id(int factory_id) {
		this.factory_id = factory_id;
	}
	public String getFactory_name() {
		return factory_name;
	}
	public void setFactory_name(String factory_name) {
		this.factory_name = factory_name;
	}
	public int getOrder_id() {
		return order_id;
	}
	public void setOrder_id(int order_id) {
		this.order_id = order_id;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public int getPlan_dispatch_qty() {
		return plan_dispatch_qty;
	}
	public void setPlan_dispatch_qty(int plan_dispatch_qty) {
		this.plan_dispatch_qty = plan_dispatch_qty;
	}
	public String getDispatch_date() {
		return dispatch_date;
	}
	public void setDispatch_date(String dispatch_date) {
		this.dispatch_date = dispatch_date;
	}
	public String getCustomer_number_flag() {
		return customer_number_flag;
	}
	public void setCustomer_number_flag(String customer_number_flag) {
		this.customer_number_flag = customer_number_flag;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getEmail_addrs() {
		return email_addrs;
	}
	public void setEmail_addrs(String email_addrs) {
		this.email_addrs = email_addrs;
	}
	public String getCreater_id() {
		return creater_id;
	}
	public void setCreater_id(String creater_id) {
		this.creater_id = creater_id;
	}
	public String getCreatdate() {
		return creatdate;
	}
	public void setCreatdate(String creatdate) {
		this.creatdate = creatdate;
	}
	
}
