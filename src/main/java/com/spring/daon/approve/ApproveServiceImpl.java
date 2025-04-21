package com.spring.daon.approve;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ApproveServiceImpl {
	
	@Autowired
	ApproveMapper apprMapper;
	
	public List<Documents> getDocList(int status, int emp_no){
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		Map<String, Object> map = new HashMap<>();
		map.put("status", status);
		map.put("emp_no", emp_no);
		return apprMapper.getDocList(map);
	}
	
	public List<Documents> getAllDocList(int emp_no){
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		
		return apprMapper.getAllDocList(emp_no);
	}
	
	public List<Documents> getApproverDocList(int status, int emp_no){
		System.out.println("<<< ApproveServiceImpl - getApproverDocList >>>");
		Map<String, Object> map = new HashMap<>();
		map.put("status", status);
		map.put("emp_no", emp_no);
		return apprMapper.getApproverDocList(map);
	}
	
	public int insertDocument(int form_no, ApprovalRequest appr_req) {
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		System.out.println("appr_req" + appr_req);
		// 기본 문서 정보 저장
		Documents document = appr_req.getDocument();
		System.out.println("document:" + document);
		int result = apprMapper.insertDocument(document);
		
		// 동일한 문서번호로 저장하기 위해 방금 저장한 문서 번호 가져오기
		int doc_no = apprMapper.getDocNo(document.getEmp_no());
		System.out.println("====doc_no=====:"+doc_no);
		// 결재선 저장
		List<Approval_lines> lineList = appr_req.getLineList();
		
		int result2 = 0;
		for(int i = 0; i < lineList.size(); i++) {
			Approval_lines line = lineList.get(i);
			line.setApproval_order(i+1);
			line.setDoc_no(doc_no);
			// 첫번째 결재자만 결재 상태 대기로 설정
			if(i != 0) {
				line.setApproval_status(0);
			}
			result2 += apprMapper.insertApprovalLines(line);
		}
		if(result2 == lineList.size()) {
			result2 = 1;
		}else {result2 = 0;}
		System.out.println("---------doc_no------------"+ doc_no);
		// 각 양식 별 저장
		int result3 = 0;
		if(form_no == 5) {
			Work_report work_report = appr_req.getWork_report();
			work_report.setDoc_no(doc_no);
			result3 = apprMapper.insertWorkReport(work_report);
		}
		
		return result * result2 * result3;
	}
}
