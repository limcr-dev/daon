package com.spring.daon.approve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/approve")
@CrossOrigin
public class ApproveController {
	
	@Autowired
	ApproveServiceImpl service;
	
	// 작성자 - 문서 상태별 리스트
	// 1: 임시저장, 2: 진행중, 3: 승인, 4: 반려, 5: 상신취소
	@GetMapping("/documents/{status}/{emp_no}")
	public ResponseEntity<?> getDocList(@PathVariable int status, @PathVariable int emp_no){
		System.out.println("<<< getDocList >>>");
		
		return new ResponseEntity<>(service.getDocList(status, emp_no), HttpStatus.OK);
	}
	
	// 작성자 - 문서 상태별 리스트(임시저장 제외)
	@GetMapping("/documents/all/{emp_no}")
	public ResponseEntity<?> getAllDocList(@PathVariable int emp_no){
		System.out.println("<<< getAllDocList >>>");
		return new ResponseEntity<>(service.getAllDocList(emp_no), HttpStatus.OK);
	}
	
	// 결재자 - 결재 상태별 문서 리스트
	// 0: 신청, 1: 예정, 2: 대기, 3: 승인, 4: 반려, 4: 완료
	@GetMapping("/approver/{status}/{emp_no}")
	public ResponseEntity<?> getApproverDocList(@PathVariable int status, @PathVariable int emp_no){
		System.out.println("<<< getApproverDocList >>>");
		
		return new ResponseEntity<>(service.getApproverDocList(status, emp_no), HttpStatus.OK);
	}
		
	// 결재자 - 결재 상태별 문서 리스트
	// 0: 신청, 1: 예정, 2: 대기, 3: 승인, 4: 반려
	@GetMapping("/approver/all/{emp_no}")
	public ResponseEntity<?> getAllApproverDocList(@PathVariable int emp_no){
		System.out.println("<<< getAllApproverDocList >>>");
		
		return new ResponseEntity<>(service.getAllApproverDocList(emp_no), HttpStatus.OK);
	}
	
	// 결재자 - 결재 상태별 문서 리스트
	// 0: 신청, 1: 예정, 2: 대기, 3: 승인, 4: 반려
	@GetMapping("/approverInfo/{emp_no}")
	public ResponseEntity<?> getApproverInfo(@PathVariable int emp_no){
		System.out.println("<<< getApproverInfo >>>");
		
		return new ResponseEntity<>(service.getApproverInfo(emp_no), HttpStatus.OK);
	}
	
	// 결재 요청
	@PostMapping("/submit/{form_no}")
	public ResponseEntity<?> insertDocument(@PathVariable int form_no, @RequestBody ApprovalRequest appr_req){
		System.out.println("<<< insertDocument >>>");
		return new ResponseEntity<>(service.insertDocument(form_no, appr_req), HttpStatus.OK);
	}
	
	// 전자결재 상세 페이지
	@GetMapping("/detail/{form_no}/{doc_no}")
	public ResponseEntity<?> getApproveDetail(@PathVariable int form_no, @PathVariable int doc_no){
		System.out.println("<<< getApproveDetail >>>");
		return new ResponseEntity<>(service.getApproveDetail(form_no, doc_no), HttpStatus.OK);
	}
	
	// 전자결재 상신취소
	@PostMapping("/cancel/{doc_no}")
	public ResponseEntity<?> cancelDocument(@PathVariable int doc_no){
		System.out.println("<<< cancelDocument >>>");
		return new ResponseEntity<>(service.cancelDocument(doc_no), HttpStatus.OK);
	}
	
	// 전자결재 반려
	@PostMapping("/reject/{doc_no}")
	public ResponseEntity<?> rejectApprove(@PathVariable int doc_no, @RequestBody Approval_lines apprLine){
		System.out.println("<<< rejectApprove >>>");
		return new ResponseEntity<>(service.rejectApprove(doc_no, apprLine), HttpStatus.OK);
	}
	
	// 전자결재 승인
	@PostMapping("/sign/{doc_no}")
	public ResponseEntity<?> signApprove(@PathVariable int doc_no, @RequestBody Approval_lines apprLine){
		System.out.println("<<< signApprove >>>");
		return new ResponseEntity<>(service.signApprove(doc_no, apprLine), HttpStatus.OK);
	}
	
	// 전자결재 수정
	@PostMapping("/update/{form_no}")
	public ResponseEntity<?> updateApprove(@PathVariable int form_no, @RequestBody ApprovalRequest appr_req){
		System.out.println("<<< updateApprove >>>");
		return new ResponseEntity<>(service.updateApprove(form_no, appr_req), HttpStatus.OK);
	}
}
