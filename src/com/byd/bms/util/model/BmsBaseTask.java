package com.byd.bms.util.model;

public class BmsBaseTask {
	
	private int id;
	
	private String url;
	
	private String count;
	
	private String finish_count;
	
	private String params;
	
	private int task_type_id;
	
	private String task_type_name;
	
	private int editor_id;
	
	private String edit_date;
	
	private String handler;
	
	private String finish_date;
	
	private int role_id;
	
	private String factory_code;
	
	private String percent; // 完成率

	public String getPercent() {
		return percent;
	}

	public void setPercent(String percent) {
		this.percent = percent;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getCount() {
		return count;
	}

	public void setCount(String count) {
		this.count = count;
	}

	public String getFinish_count() {
		return finish_count;
	}

	public void setFinish_count(String finish_count) {
		this.finish_count = finish_count;
	}

	public String getParams() {
		return params;
	}

	public void setParams(String params) {
		this.params = params;
	}

	public int getTask_type_id() {
		return task_type_id;
	}

	public void setTask_type_id(int task_type_id) {
		this.task_type_id = task_type_id;
	}

	public String getTask_type_name() {
		return task_type_name;
	}

	public void setTask_type_name(String task_type_name) {
		this.task_type_name = task_type_name;
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

	public String getHandler() {
		return handler;
	}

	public void setHandler(String handler) {
		this.handler = handler;
	}

	public String getFinish_date() {
		return finish_date;
	}

	public void setFinish_date(String finish_date) {
		this.finish_date = finish_date;
	}

	public int getRole_id() {
		return role_id;
	}

	public void setRole_id(int role_id) {
		this.role_id = role_id;
	}

	public String getFactory_code() {
		return factory_code;
	}

	public void setFactory_code(String factory_code) {
		this.factory_code = factory_code;
	}

}
