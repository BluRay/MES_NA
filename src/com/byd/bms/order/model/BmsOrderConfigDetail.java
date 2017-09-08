package com.byd.bms.order.model;

/**
 * 订单配置明细
 * @author xiong.jianwu
 *
 */
public class BmsOrderConfigDetail {
	private int config_id;//订单配置id
	private String parts_type;//零部件类别
	private String sap_mat;//总成料号
	private String components_no;//零部件编号
	private String components_name;//零部件名称
	private String size;//材料/规格
	private String type;//类别
	private String vendor;//供应商名称
	private String workshop;//车间
	private String notes;//备注
	public int getConfig_id() {
		return config_id;
	}
	public void setConfig_id(int config_id) {
		this.config_id = config_id;
	}
	public String getParts_type() {
		return parts_type;
	}
	public void setParts_type(String parts_type) {
		this.parts_type = parts_type;
	}
	public String getSap_mat() {
		return sap_mat;
	}
	public void setSap_mat(String sap_mat) {
		this.sap_mat = sap_mat;
	}
	public String getComponents_no() {
		return components_no;
	}
	public void setComponents_no(String components_no) {
		this.components_no = components_no;
	}
	public String getComponents_name() {
		return components_name;
	}
	public void setComponents_name(String components_name) {
		this.components_name = components_name;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getVendor() {
		return vendor;
	}
	public void setVendor(String vendor) {
		this.vendor = vendor;
	}
	public String getWorkshop() {
		return workshop;
	}
	public void setWorkshop(String workshop) {
		this.workshop = workshop;
	}
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
	
	
}
