package com.spring.daon.approve;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApproveMapper {
	
	public List<Documents> getDocumentList(Map<String, Object> map);
	
	public int insertDocument(Documents document);
	
	public int getDocNo(int emp_no);
	
	public int insertApprovalLines(Approval_lines appr_lines);
	
	public int insertWorkReport(Work_report work_report);
	
	public int insertVacationReq(Vacation_req vacation_req);
	//public List<Documents> getCompleteList();
}
