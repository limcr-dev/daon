package com.spring.daon.common;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class CommonController {
	
	@Autowired
	private CommonServiceImpl service;

	// 직원 정보 불러오기
	@GetMapping("/getEmpInfo/{emp_no}")
	public ResponseEntity<?> getEmpInfo(@PathVariable int emp_no) {
		System.out.println("<<< getEmpInfo >>>");
	
		return new ResponseEntity<>(service.getEmpInfo(emp_no), HttpStatus.OK);
	}	
}
