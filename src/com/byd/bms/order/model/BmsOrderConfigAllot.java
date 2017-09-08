package com.byd.bms.order.model;

public class BmsOrderConfigAllot {
	private int id;
	private int order_id;
	private int factory_id;
	private int order_config_id;
	private String product_qty;
	private String sequence;
	private int editor_id;
	private String edit_date;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	public String getProduct_qty() {
		return product_qty;
	}
	public void setProduct_qty(String product_qty) {
		this.product_qty = product_qty;
	}
	public String getSequence() {
		return sequence;
	}
	public void setSequence(String sequence) {
		this.sequence = sequence;
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
}
