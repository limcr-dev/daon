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
	
	// 결재 문서 상태별 리스트(작성자 입장) > 1: 진행중, 2:승인, 3:반려, 4: 임시저장, 5:상신취소
	@GetMapping("/documents/{status}/{emp_no}")
	public ResponseEntity<?> getDocList(@PathVariable int status, @PathVariable int emp_no){
		System.out.println("<<< getDocList >>>");
		//
		return new ResponseEntity<>(service.getDocList(status, emp_no), HttpStatus.OK);
	}
	
	// 결재 문서 리스트(임시저장 제외)
	@GetMapping("/documents/all/{emp_no}")
	public ResponseEntity<?> getAllDocList(@PathVariable int emp_no){
		System.out.println("<<< getAllDocList >>>");
		return new ResponseEntity<>(service.getAllDocList(emp_no), HttpStatus.OK);
	}
	
	// 결재 문서 상태별 리스트(수신자 입장) > 0: 예정, 1:대기, 2: 승인, 3: 반려, 4: 완료
	@GetMapping("/approver/{status}/{emp_no}")
	public ResponseEntity<?> getApproverDocList(@PathVariable int status, @PathVariable int emp_no){
		System.out.println("<<< getApproverDocList >>>");
		
		return new ResponseEntity<>(service.getApproverDocList(status, emp_no), HttpStatus.OK);
	}
		
	// 결재 요청
	@PostMapping("/submit/{form_no}")
	public ResponseEntity<?> insertDocument(@PathVariable int form_no, @RequestBody ApprovalRequest appr_req){
		System.out.println("<<< insertDocument >>>");
		return new ResponseEntity<>(service.insertDocument(form_no, appr_req), HttpStatus.OK);
	}
}
