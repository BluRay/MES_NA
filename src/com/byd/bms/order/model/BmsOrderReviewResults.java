package com.byd.bms.order.model;

/*
 * 订单评审结果
 */

public class BmsOrderReviewResults {
	
	private int id;
	private int orderId;
	private int factoryId;
	private String factorydelieryDate; // 工厂订单交期
	private String reviewStatus; // 评审状态
	private String partsonlineDate; // 部件上线日期
	private String weldingonlineDate; // 焊装上线日期
	private String paintonlineDate;  // 涂装上线日期
	private String chassisonlineDate; // 底盘上线日期
	private String assemblyonlineDate;  // 总装上线日期
	private String warehousingDate;  // 全部入库日期
	private String modelexportDate;  // 数模输出时间
	private String drawingexportDate;  // 图纸
	private String detaildemandNode; // 下料明细需求节点
	private String sopdemandNode; // sop需求节点输出时间
	private String bomdemandNode; // bom需求节点
	private String sipdemandNode; // sip需求节点
	private String configTable;  // 技术协议、配置表
	private String proximatematter;  // 型材清单
	private String modeljudging;  // 数模评审 OK NG
	private String purchasedetail;  // 采购明细 OK NG
	private String drawingearlierjudging;  // 图纸受控前评审 OK NG
	private String technicaldatanode;  // 技术资料需求节点
	private String mintechInfo;  // 技术部评审信息
	private String technicsNode;  // 工艺资料需求节点
	private String technicsInfo;  // 工艺部评审信息 
	private String qualityNode;  // 品质部评审信息
	private String qualityInfo;  // 品质部评审信息
	private String factoryNode;  // 工厂内部评审信息
	private String factoryInfo;  // 工厂内部评审信息
	private String materialcontrolInfo;  // 综合计划部物控评审信息
	private String materialcontrolNode;  // 综合计划部物控评审节点
	private String plandepInfo;  // 综合计划部计划评审信息
	private String plandepNode;  // 综合计划部计划评审节点
	private String revisiondetailNode;  // 修正下料明细输出节点
	private String revisionsopNode;  // 修正SOP需求节点
	private String revisionbomNode;  // 修正BOM需求节点
	private String revisionsipNode;  // 修正SIP需求节点
	private String revisionpartsonlineDate;  // 修正部件上线日期
	private String revisionweldingonlineDate;  // 修正焊装上线日期
	private String revisionpaintonlineDate;  //修正涂装上线日期
	private String revisionchassisonlineDate;  // 修正底盘上线日期
	private String revisionassemblyonlineDate;  // 修正总装上线日期
	private String revisionwarehousingDate;  // 修正全部入库日期
	private String deliveryDate;  // 全部交付日期
	private int editorId;  
	private String editDate;
	private String wfOrderId;
	private String wfProcessId;
	private String orderNo;
	private String factoryName;
	private String factoryCode;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getOrderId() {
		return orderId;
	}
	public void setOrderId(int orderId) {
		this.orderId = orderId;
	}
	public int getFactoryId() {
		return factoryId;
	}
	public void setFactoryId(int factoryId) {
		this.factoryId = factoryId;
	}
	public String getFactorydelieryDate() {
		return factorydelieryDate;
	}
	public void setFactorydelieryDate(String factorydelieryDate) {
		this.factorydelieryDate = factorydelieryDate;
	}
	public String getReviewStatus() {
		return reviewStatus;
	}
	public void setReviewStatus(String reviewStatus) {
		this.reviewStatus = reviewStatus;
	}
	public String getPartsonlineDate() {
		return partsonlineDate;
	}
	public void setPartsonlineDate(String partsonlineDate) {
		this.partsonlineDate = partsonlineDate;
	}
	public String getWeldingonlineDate() {
		return weldingonlineDate;
	}
	public void setWeldingonlineDate(String weldingonlineDate) {
		this.weldingonlineDate = weldingonlineDate;
	}
	public String getPaintonlineDate() {
		return paintonlineDate;
	}
	public void setPaintonlineDate(String paintonlineDate) {
		this.paintonlineDate = paintonlineDate;
	}
	public String getChassisonlineDate() {
		return chassisonlineDate;
	}
	public void setChassisonlineDate(String chassisonlineDate) {
		this.chassisonlineDate = chassisonlineDate;
	}
	public String getAssemblyonlineDate() {
		return assemblyonlineDate;
	}
	public void setAssemblyonlineDate(String assemblyonlineDate) {
		this.assemblyonlineDate = assemblyonlineDate;
	}
	public String getWarehousingDate() {
		return warehousingDate;
	}
	public void setWarehousingDate(String warehousingDate) {
		this.warehousingDate = warehousingDate;
	}
	public String getModelexportDate() {
		return modelexportDate;
	}
	public void setModelexportDate(String modelexportDate) {
		this.modelexportDate = modelexportDate;
	}
	public String getDrawingexportDate() {
		return drawingexportDate;
	}
	public void setDrawingexportDate(String drawingexportDate) {
		this.drawingexportDate = drawingexportDate;
	}
	public String getDetaildemandNode() {
		return detaildemandNode;
	}
	public void setDetaildemandNode(String detaildemandNode) {
		this.detaildemandNode = detaildemandNode;
	}
	public String getSopdemandNode() {
		return sopdemandNode;
	}
	public void setSopdemandNode(String sopdemandNode) {
		this.sopdemandNode = sopdemandNode;
	}
	public String getBomdemandNode() {
		return bomdemandNode;
	}
	public void setBomdemandNode(String bomdemandNode) {
		this.bomdemandNode = bomdemandNode;
	}
	public String getSipdemandNode() {
		return sipdemandNode;
	}
	public void setSipdemandNode(String sipdemandNode) {
		this.sipdemandNode = sipdemandNode;
	}
	public String getConfigTable() {
		return configTable;
	}
	public void setConfigTable(String configTable) {
		this.configTable = configTable;
	}
	public String getProximatematter() {
		return proximatematter;
	}
	public void setProximatematter(String proximatematter) {
		this.proximatematter = proximatematter;
	}
	public String getModeljudging() {
		return modeljudging;
	}
	public void setModeljudging(String modeljudging) {
		this.modeljudging = modeljudging;
	}
	public String getPurchasedetail() {
		return purchasedetail;
	}
	public void setPurchasedetail(String purchasedetail) {
		this.purchasedetail = purchasedetail;
	}
	public String getDrawingearlierjudging() {
		return drawingearlierjudging;
	}
	public void setDrawingearlierjudging(String drawingearlierjudging) {
		this.drawingearlierjudging = drawingearlierjudging;
	}
	public String getTechnicaldatanode() {
		return technicaldatanode;
	}
	public void setTechnicaldatanode(String technicaldatanode) {
		this.technicaldatanode = technicaldatanode;
	}
	
	public String getTechnicsNode() {
		return technicsNode;
	}
	public void setTechnicsNode(String technicsNode) {
		this.technicsNode = technicsNode;
	}
	
	public String getFactoryInfo() {
		return factoryInfo;
	}
	public void setFactoryInfo(String factoryInfo) {
		this.factoryInfo = factoryInfo;
	}
	public String getMaterialcontrolInfo() {
		return materialcontrolInfo;
	}
	public void setMaterialcontrolInfo(String materialcontrolInfo) {
		this.materialcontrolInfo = materialcontrolInfo;
	}
	public String getPlandepInfo() {
		return plandepInfo;
	}
	public void setPlandepInfo(String plandepInfo) {
		this.plandepInfo = plandepInfo;
	}
	public String getRevisiondetailNode() {
		return revisiondetailNode;
	}
	public void setRevisiondetailNode(String revisiondetailNode) {
		this.revisiondetailNode = revisiondetailNode;
	}
	public String getRevisionsopNode() {
		return revisionsopNode;
	}
	public void setRevisionsopNode(String revisionsopNode) {
		this.revisionsopNode = revisionsopNode;
	}
	public String getRevisionbomNode() {
		return revisionbomNode;
	}
	public void setRevisionbomNode(String revisionbomNode) {
		this.revisionbomNode = revisionbomNode;
	}
	public String getRevisionsipNode() {
		return revisionsipNode;
	}
	public void setRevisionsipNode(String revisionsipNode) {
		this.revisionsipNode = revisionsipNode;
	}
	public String getRevisionpartsonlineDate() {
		return revisionpartsonlineDate;
	}
	public void setRevisionpartsonlineDate(String revisionpartsonlineDate) {
		this.revisionpartsonlineDate = revisionpartsonlineDate;
	}
	public String getRevisionweldingonlineDate() {
		return revisionweldingonlineDate;
	}
	public void setRevisionweldingonlineDate(String revisionweldingonlineDate) {
		this.revisionweldingonlineDate = revisionweldingonlineDate;
	}
	public String getRevisionpaintonlineDate() {
		return revisionpaintonlineDate;
	}
	public void setRevisionpaintonlineDate(String revisionpaintonlineDate) {
		this.revisionpaintonlineDate = revisionpaintonlineDate;
	}
	public String getRevisionchassisonlineDate() {
		return revisionchassisonlineDate;
	}
	public void setRevisionchassisonlineDate(String revisionchassisonlineDate) {
		this.revisionchassisonlineDate = revisionchassisonlineDate;
	}
	public String getRevisionassemblyonlineDate() {
		return revisionassemblyonlineDate;
	}
	public void setRevisionassemblyonlineDate(String revisionassemblyonlineDate) {
		this.revisionassemblyonlineDate = revisionassemblyonlineDate;
	}
	public String getRevisionwarehousingDate() {
		return revisionwarehousingDate;
	}
	public void setRevisionwarehousingDate(String revisionwarehousingDate) {
		this.revisionwarehousingDate = revisionwarehousingDate;
	}
	public String getDeliveryDate() {
		return deliveryDate;
	}
	public void setDeliveryDate(String deliveryDate) {
		this.deliveryDate = deliveryDate;
	}
	public int getEditorId() {
		return editorId;
	}
	public void setEditorId(int editorId) {
		this.editorId = editorId;
	}
	public String getEditDate() {
		return editDate;
	}
	public void setEditDate(String editDate) {
		this.editDate = editDate;
	}
	public String getMintechInfo() {
		return mintechInfo;
	}
	public void setMintechInfo(String mintechInfo) {
		this.mintechInfo = mintechInfo;
	}
	public String getTechnicsInfo() {
		return technicsInfo;
	}
	public void setTechnicsInfo(String technicsInfo) {
		this.technicsInfo = technicsInfo;
	}
	public String getQualityNode() {
		return qualityNode;
	}
	public void setQualityNode(String qualityNode) {
		this.qualityNode = qualityNode;
	}
	public String getQualityInfo() {
		return qualityInfo;
	}
	public void setQualityInfo(String qualityInfo) {
		this.qualityInfo = qualityInfo;
	}
	public String getFactoryNode() {
		return factoryNode;
	}
	public void setFactoryNode(String factoryNode) {
		this.factoryNode = factoryNode;
	}  
	public String getWfOrderId() {
		return wfOrderId;
	}
	public void setWfOrderId(String wfOrderId) {
		this.wfOrderId = wfOrderId;
	}
	public String getWfProcessId() {
		return wfProcessId;
	}
	public void setWfProcessId(String wfProcessId) {
		this.wfProcessId = wfProcessId;
	}
	public String getMaterialcontrolNode() {
		return materialcontrolNode;
	}
	public void setMaterialcontrolNode(String materialcontrolNode) {
		this.materialcontrolNode = materialcontrolNode;
	}
	public String getPlandepNode() {
		return plandepNode;
	}
	public void setPlandepNode(String plandepNode) {
		this.plandepNode = plandepNode;
	}
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}
	public String getFactoryName() {
		return factoryName;
	}
	public void setFactoryName(String factoryName) {
		this.factoryName = factoryName;
	}
	public String getFactoryCode() {
		return factoryCode;
	}
	public void setFactoryCode(String factoryCode) {
		this.factoryCode = factoryCode;
	}
}
