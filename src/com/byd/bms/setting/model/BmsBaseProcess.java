package com.byd.bms.setting.model;

public class BmsBaseProcess {
	private int id;
	private String factory;
	private String workshop;
	private String station;
	private String process_code;
	private String process_name;
	private String key_process_flag;
	private String monitory_point_flag;
	private String quality_monitory_flag;
	private String plan_node_id;
	private String plan_node_name;
	private String deleteFlag;
	private String memo;
	private int editor_id;
	private String editor;
	private String edit_date;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFactory() {
		return factory;
	}
	public void setFactory(String factory) {
		this.factory = factory;
	}
	public String getWorkshop() {
		return workshop;
	}
	public void setWorkshop(String workshop) {
		this.workshop = workshop;
	}
	public String getStation() {
		return station;
	}
	public void setStation(String station) {
		this.station = station;
	}
	public String getProcess_code() {
		return process_code;
	}
	public void setProcess_code(String process_code) {
		this.process_code = process_code;
	}
	public String getProcess_name() {
		return process_name;
	}
	public void setProcess_name(String process_name) {
		this.process_name = process_name;
	}
	public String getKey_process_flag() {
		return key_process_flag;
	}
	public void setKey_process_flag(String key_process_flag) {
		this.key_process_flag = key_process_flag;
	}
	public String getMonitory_point_flag() {
		return monitory_point_flag;
	}
	public void setMonitory_point_flag(String monitory_point_flag) {
		this.monitory_point_flag = monitory_point_flag;
	}
	public String getQuality_monitory_flag() {
		return quality_monitory_flag;
	}
	public void setQuality_monitory_flag(String quality_monitory_flag) {
		this.quality_monitory_flag = quality_monitory_flag;
	}
	public String getPlan_node_id() {
		return plan_node_id;
	}
	public void setPlan_node_id(String plan_node_id) {
		this.plan_node_id = plan_node_id;
	}
	public String getPlan_node_name() {
		return plan_node_name;
	}
	public void setPlan_node_name(String plan_node_name) {
		this.plan_node_name = plan_node_name;
	}
	public String getDeleteFlag() {
		return deleteFlag;
	}
	public void setDeleteFlag(String deleteFlag) {
		this.deleteFlag = deleteFlag;
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
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public String getEdit_date() {
		return edit_date;
	}
	public void setEdit_date(String edit_date) {
		this.edit_date = edit_date;
	}

}
