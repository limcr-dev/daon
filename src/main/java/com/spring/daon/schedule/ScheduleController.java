package com.spring.daon.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@RequestMapping("/attend") // 임시 토큰 수정 후 바꿀거
@CrossOrigin
public class ScheduleController {
	
	@Autowired
	private ScheduleServiceImpl service;

	// 일정 카테고리 불러오기
	@GetMapping("/getCategory/{emp_no}")
	public ResponseEntity<?> getCategory(@PathVariable int emp_no) {
		System.out.println("<<< getCategory >>>" +service.getCategory(emp_no));
	
		return new ResponseEntity<>(service.getCategory(emp_no), HttpStatus.OK);
	}	
}
