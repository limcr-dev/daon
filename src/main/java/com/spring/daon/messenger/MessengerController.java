package com.spring.daon.messenger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/messenger")
@CrossOrigin
public class MessengerController {
	
	@Autowired
	private MessengerServiceImpl service;
	
	// http://localhost:8081/messenger/addressBook
	// 주소록 목록 조회
	@GetMapping("/addressBookList")
	public ResponseEntity<?> abList() {
		System.out.println("<<< abList >>>");
		
		return new ResponseEntity<>(service.abList(), HttpStatus.OK);
	}
	
	
//	// 주소록 검색(검색 시 조회)
//	@GetMapping("/addressBook")
//	public ResponseEntity<?> searchPerson(@PathVariable int emp_no) {
//		System.out.println("<<< searchPerson() >>>");
//		
//		return new ResponseEntity<>(service.searchPerson(emp_no), HttpStatus.OK);
//	}
}
