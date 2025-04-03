package com.spring.daon.performMgt;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/performMgt")
@CrossOrigin
public class PerformMgtController {
	
	@Autowired
	private PerformMgtServiceImpl service;
	
	// 문제 리스트 페이지 
	@GetMapping("/queslist")
	public ResponseEntity<?> findAll(){
		System.out.println("<<<<<문제리스트??");
		
		
		return new ResponseEntity<>(service.evalQuesList(), HttpStatus.OK);	// 200
	}
	
	// 역량 리스트
	@GetMapping("/complist")
	public ResponseEntity<?> findCompAll(){
		System.out.println("<<<<<역량 리스트??");
		
		return new ResponseEntity<>(service.evalList(), HttpStatus.OK);	// 200
	}
	
	// 역량 넘기면서 insert(인사평가 담당이 세팅 )
//	@PostMapping("/insertComp")
	
	
	// update   putmapping

	
	
	
	// 평가 관리 리스트
	
	
	// 평가 항목 선택
	
}
