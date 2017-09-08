package com.byd.bms.setting.model;

import org.springframework.stereotype.Component;

@Component
public class BmsBaseFactory {
	private int id;
	private String factoryCode;
	private String factoryName;
	private String shortName;
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	private String area;
	private String assemblyCode;
	private String deleteFlag;
	private String memo;
	private String editorId;
	private String editor;
	private String editDate;
	
	private String capacity;
	
	public String getCapacity() {
		return capacity;
	}
	public void setCapacity(String capacity) {
		this.capacity = capacity;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFactoryCode() {
		return factoryCode;
	}
	public void setFactoryCode(String factoryCode) {
		this.factoryCode = factoryCode;
	}
	public String getFactoryName() {
		return factoryName;
	}
	public void setFactoryName(String factoryName) {
		this.factoryName = factoryName;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public String getAssemblyCode() {
		return assemblyCode;
	}
	public void setAssemblyCode(String assemblyCode) {
		this.assemblyCode = assemblyCode;
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
	
	public String getEditorId() {
		return editorId;
	}
	public void setEditorId(String editorId) {
		this.editorId = editorId;
	}
	public String getEditor() {
		return editor;
	}
	public void setEditor(String editor) {
		this.editor = editor;
	}
	public String getEditDate() {
		return editDate;
	}
	public void setEditDate(String editDate) {
		this.editDate = editDate;
	}
}
