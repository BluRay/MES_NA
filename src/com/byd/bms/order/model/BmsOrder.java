package com.byd.bms.order.model;

/**
 * 订单实体类
 * @author xjw 2017-04-12
 */
public class BmsOrder {
	private int id;
	private String project_no;
	private String project_name;
	private String customer;
	private String search_name;
	private String bus_type;
	private int quantity;
	private String delivery_date;
	private String project_date;
	private int production_plant_id;
	private String production_plant;
	private String project_status;
	private String sales_manager;
	private int editor_id;
	private String edit_date;
	private String project_manager;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getProject_no() {
		return project_no;
	}
	public void setProject_no(String project_no) {
		this.project_no = project_no;
	}
	public String getProject_name() {
		return project_name;
	}
	public void setProject_name(String project_name) {
		this.project_name = project_name;
	}
	public String getCustomer() {
		return customer;
	}
	public void setCustomer(String customer) {
		this.customer = customer;
	}
	public String getBus_type() {
		return bus_type;
	}
	public void setBus_type(String bus_type) {
		this.bus_type = bus_type;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getDelivery_date() {
		return delivery_date;
	}
	public void setDelivery_date(String delivery_date) {
		this.delivery_date = delivery_date;
	}
	public String getProduction_plant() {
		return production_plant;
	}
	public void setProduction_plant(String production_plant) {
		this.production_plant = production_plant;
	}
	public String getProject_status() {
		return project_status;
	}
	public void setProject_status(String project_status) {
		this.project_status = project_status;
	}
	public String getSales_manager() {
		return sales_manager;
	}
	public void setSales_manager(String sales_manager) {
		this.sales_manager = sales_manager;
	}
	public int getEditor_id() {
		return editor_id;
	}
	public void setEditor_id(int editor_id) {
		this.editor_id = editor_id;
	}
	public String getEdit_date() {
		return edit_date;
	}
	public void setEdit_date(String edit_date) {
		this.edit_date = edit_date;
	}
	public String getProject_manager() {
		return project_manager;
	}
	public void setProject_manager(String project_manager) {
		this.project_manager = project_manager;
	}
	public String getSearch_name() {
		return search_name;
	}
	public void setSearch_name(String search_name) {
		this.search_name = search_name;
	}
	public String getProject_date() {
		return project_date;
	}
	public void setProject_date(String project_date) {
		this.project_date = project_date;
	}
	public int getProduction_plant_id() {
		return production_plant_id;
	}
	public void setProduction_plant_id(int production_plant_id) {
		this.production_plant_id = production_plant_id;
	}
	
}
