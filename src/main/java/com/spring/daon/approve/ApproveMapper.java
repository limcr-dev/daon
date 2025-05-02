package com.spring.daon.approve;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ApproveMapper {
	
	public List<Documents> getDocList(Map<String, Object> map);
	
	public List<Documents> getAllDocList(int emp_no);
	
	public List<Documents> getApproverDocList(Map<String, Object> map);
	
	public List<Documents> getAllApproverDocList(int emp_no);
	
	public List<Documents> getApproverInfo(int emp_no);
	
	public int insertDocument(Documents document);
	
	public int getDocNo(int emp_no);
	
	public int insertApprovalLines(Approval_lines appr_lines);
	
	public int insertVacationReq(Vacation_req vacation_req);
	
	public int insertWorkReport(Work_report work_report);
	
	public Documents getDocument(int doc_no);
	
	public List<Approval_lines> getApprLines(int doc_no);
	
	public Work_report getWorkReport(int doc_no);
	
	public Vacation_req getVacationReq(int doc_no);
	
	public int cancelDocument(int doc_no);
	
	public int countApprovedOrRejectedLines(int doc_no);
	
	public int rejectApprove(Approval_lines appr_line);
	
	public int rejectDocument(int doc_no);
	
	public int signApprove(Approval_lines appr_line);
	
	public int apprCnt(int doc_no);
	
	public int updateApprStatus(Approval_lines appr_line);
	
	public int signDocument(int doc_no);
	
	public int updateDocument(Documents document);
	
	public int deleteApprLines(int doc_no);
	
	public int updateWorkReport(Work_report work_report);
}
