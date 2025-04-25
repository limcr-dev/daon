package com.spring.daon.approve;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import software.amazon.awssdk.services.s3.endpoints.internal.Eval;

@Service
public class ApproveServiceImpl {
	
	@Autowired
	ApproveMapper apprMapper;
	
	@Transactional(readOnly=true)
	public List<Documents> getDocList(int status, int emp_no){
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		Map<String, Object> map = new HashMap<>();
		map.put("status", status);
		map.put("emp_no", emp_no);
		return apprMapper.getDocList(map);
	}
	
	@Transactional(readOnly=true)
	public List<Documents> getAllDocList(int emp_no){
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");
		
		return apprMapper.getAllDocList(emp_no);
	}
	
	@Transactional(readOnly=true)
	public List<Documents> getApproverDocList(int status, int emp_no){
		System.out.println("<<< ApproveServiceImpl - getApproverDocList >>>");
		Map<String, Object> map = new HashMap<>();
		map.put("status", status);
		map.put("emp_no", emp_no);
		return apprMapper.getApproverDocList(map);
	}
	
	@Transactional(readOnly=true)
	public List<Documents> getAllApproverDocList(int emp_no){
		System.out.println("<<< ApproveServiceImpl - getAllApproverDocList >>>");
		return apprMapper.getAllApproverDocList(emp_no);
	}
	
	@Transactional(readOnly=true)
	public List<Documents> getApproverInfo(int emp_no){
		System.out.println("<<< ApproveServiceImpl - getApproverInfo >>>");
		return apprMapper.getApproverInfo(emp_no);
	}
	
	@Transactional
	public int insertDocument(int form_no, ApprovalRequest appr_req) {
		System.out.println("<<< ApproveServiceImpl - getDocumentList >>>");

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
			line.setAppr_order(i);
			line.setDoc_no(doc_no);
			if(i == 0) {
				line.setAppr_date(new Date(System.currentTimeMillis()));
			}
			result2 += apprMapper.insertApprovalLines(line);
			System.out.println(line);
		}
		if(result2 == lineList.size()) {
			result2 = 1;
		}else {result2 = 0;}
		
		// 각 양식 별 저장
		int result3 = 0;
		switch(form_no) {
			case 1:
				Vacation_req vacation_req = appr_req.getVacation_req();
				vacation_req.setDoc_no(doc_no);
				result3 = apprMapper.insertVacationReq(vacation_req);
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				Work_report work_report = appr_req.getWork_report();
				work_report.setDoc_no(doc_no);
				result3 = apprMapper.insertWorkReport(work_report);
				break;
			default:
				break;
		}		
		return result * result2 * result3;
	}
	
	@Transactional(readOnly=true)
	public ApprovalRequest getApproveDetail(int form_no, int doc_no) {
		System.out.println("<<< ApproveServiceImpl - getApproveDetail >>>");
		ApprovalRequest apprReq = new ApprovalRequest();
		
		apprReq.setDocument(apprMapper.getDocument(doc_no));
		apprReq.setLineList(apprMapper.getApprLines(doc_no));
		
		switch(form_no) {
			case 1:
				apprReq.setVacation_req(apprMapper.getVacationReq(doc_no));
				break;
			case 2:
				break;
			case 3:
				break;
			case 4:
				break;
			case 5:
				apprReq.setWork_report(apprMapper.getWorkReport(doc_no));
				break;
			default:
				break;
		}
		System.out.println("===apprReq===" + apprReq);
		return apprReq;
	}
	
	// 결재 상신 취소
	@Transactional
	public int cancelDocument(int doc_no) {
		System.out.println("<<< ApproveServiceImpl - cancelDocument >>>");
		return apprMapper.cancelDocument(doc_no);
	}
	
	// 결재 반려
	@Transactional
	public int rejectApprove(int doc_no, Approval_lines appr_line) {
		System.out.println("<<< ApproveServiceImpl - rejectApprove >>>");
		if(doc_no != appr_line.getDoc_no()) {
			appr_line.setDoc_no(doc_no);
		}
		int result = apprMapper.rejectApprove(appr_line);
		
		if(result == 1) {
			result = apprMapper.rejectDocument(doc_no);
		}
		return result;
	}
	
	// 결재 승인
	@Transactional
	public int signApprove(int doc_no, Approval_lines appr_line) {
		System.out.println("<<< ApproveServiceImpl - signApprove >>>");
		if(doc_no != appr_line.getDoc_no()) {
			appr_line.setDoc_no(doc_no);
		}
		System.out.println("=== appr_line === : " + appr_line);
		// 상태값 명시적 설정
	    appr_line.setAppr_status(3);
	    
		// 현재 결재자 승인 처리
		int result = apprMapper.signApprove(appr_line);
		System.out.println("=== 승인 처리 결과 === " + result);
		
		// 결재자 수 조회
		int apprCnt = apprMapper.apprCnt(doc_no);
		
		if(apprCnt == appr_line.getAppr_order()) {
			// 마지막 결재자 -> 문서 상태 완료로 변경
			result = apprMapper.signDocument(doc_no);
		}else {
			// 다음 결재자 대기 상태로 변경
			result = apprMapper.updateApprStatus(appr_line);
		}
		
		return result;
	}
	
	// 전자결재 수정
	@Transactional
	public int updateApprove(int form_no, ApprovalRequest appr_req) {
		System.out.println("<<< ApproveServiceImpl - updateApprove >>>");
		// 기본 문서 정보 저장
		Documents document = appr_req.getDocument();
		System.out.println("document:" + document);
		int result = apprMapper.updateDocument(document);
		
		// 동일한 문서번호로 저장하기 위해 방금 저장한 문서 번호 가져오기
		int doc_no = document.getDoc_no();
		System.out.println("====doc_no=====:"+doc_no);
		
		apprMapper.deleteApprLines(doc_no);
		
		// 결재선 저장
		List<Approval_lines> lineList = appr_req.getLineList();
		
		int result2 = 0;
		for(int i = 0; i < lineList.size(); i++) {
			Approval_lines line = lineList.get(i);
			line.setAppr_order(i);
			line.setDoc_no(doc_no);
			if(i == 0) {
				line.setAppr_date(new Date(System.currentTimeMillis()));
			}
			result2 += apprMapper.insertApprovalLines(line);
			System.out.println(line);
		}
		if(result2 == lineList.size()) {
			result2 = 1;
		}else {result2 = 0;}
		
		// 각 양식 별 저장
		int result3 = 0;
		if(form_no == 5) {
			Work_report work_report = appr_req.getWork_report();
			work_report.setDoc_no(doc_no);
			result3 = apprMapper.updateWorkReport(work_report);
		}
		
		return result * result2 * result3;
	}
}
