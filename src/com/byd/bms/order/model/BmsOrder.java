package com.byd.bms.order.model;

/**
 * 订单实体类
 * @author xjw 2017-04-12
 */
public class BmsOrder {
	private int id;
	private String order_no;
	private String order_name;
	private String order_name_str;
	private String order_code;
	private String order_type;
	private int bus_type_id;
	private String bus_type;
	private int order_qty;
	private int issed_qty;
	private String productive_year;
	private String delivery_date;
	private String status;
	private String memo;
	private int editor_id;
	private String edit_date;
	private String customer;
	private String order_area;
	
	public String getOrder_name_str() {
		return order_name_str;
	}
	public void setOrder_name_str(String order_name_str) {
		this.order_name_str = order_name_str;
	}
	public String getBus_type() {
		return bus_type;
	}
	public void setBus_type(String bus_type) {
		this.bus_type = bus_type;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public String getOrder_name() {
		return order_name;
	}
	public void setOrder_name(String order_name) {
		this.order_name = order_name;
	}
	public String getOrder_code() {
		return order_code;
	}
	public void setOrder_code(String order_code) {
		this.order_code = order_code;
	}
	public int getBus_type_id() {
		return bus_type_id;
	}
	public void setBus_type_id(int bus_type_id) {
		this.bus_type_id = bus_type_id;
	}
	public int getOrder_qty() {
		return order_qty;
	}
	public void setOrder_qty(int order_qty) {
		this.order_qty = order_qty;
	}
	public String getProductive_year() {
		return productive_year;
	}
	public void setProductive_year(String productive_year) {
		this.productive_year = productive_year;
	}
	public String getDelivery_date() {
		return delivery_date;
	}
	public void setDelivery_date(String delivery_date) {
		this.delivery_date = delivery_date;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
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
	public int getIssed_qty() {
		return issed_qty;
	}
	public void setIssed_qty(int issed_qty) {
		this.issed_qty = issed_qty;
	}
	public String getOrder_type() {
		return order_type;
	}
	public void setOrder_type(String order_type) {
		this.order_type = order_type;
	}
	public String getCustomer() {
		return customer;
	}
	public void setCustomer(String customer) {
		this.customer = customer;
	}
	public String getOrder_area() {
		return order_area;
	}
	public void setOrder_area(String order_area) {
		this.order_area = order_area;
	}	

}
