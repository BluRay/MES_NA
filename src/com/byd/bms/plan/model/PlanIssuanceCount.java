package com.byd.bms.plan.model;

public class PlanIssuanceCount {
	private int plan_code_value;
	private int order_id;
	private int factory_id;
	private int order_config_id;
	private int issed_qty;
	public int getPlan_code_value() {
		return plan_code_value;
	}
	public void setPlan_code_value(int plan_code_value) {
		this.plan_code_value = plan_code_value;
	}
	public int getOrder_id() {
		return order_id;
	}
	public void setOrder_id(int order_id) {
		this.order_id = order_id;
	}
	public int getFactory_id() {
		return factory_id;
	}
	public void setFactory_id(int factory_id) {
		this.factory_id = factory_id;
	}
	public int getOrder_config_id() {
		return order_config_id;
	}
	public void setOrder_config_id(int order_config_id) {
		this.order_config_id = order_config_id;
	}
	public int getIssed_qty() {
		return issed_qty;
	}
	public void setIssed_qty(int issed_qty) {
		this.issed_qty = issed_qty;
	}
	
}
