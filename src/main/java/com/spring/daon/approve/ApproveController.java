package com.spring.daon.approve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/approve")
@CrossOrigin
public class ApproveController {
	
	@Autowired
	ApproveServiceImpl service;
	
	// 결재 진행중 문서 리스트
	@GetMapping("/documents/{status}")
	public ResponseEntity<?> getDocumentList(@PathVariable int status){
		System.out.println("<<< getDocumentList >>>");
		return new ResponseEntity<>(service.getDocumentList(status), HttpStatus.OK);
	}
	
	// 결재 완료 문서 리스트
//	@GetMapping("/documents")
//	public ResponseEntity<?> getCompleteList(@PathVariable int status){
//		System.out.println("<<< getCompleteList >>>");
//		return new ResponseEntity<>(service.getCompleteList(status), HttpStatus.OK);
//	}
}
