package com.spring.daon.attendMgt;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
@CrossOrigin
public class AttendMgtController {
	
	@Autowired
	private AttendMgtServiceImpl service;

	// login 페이지
//	@PostMapping("/attendMgtMain")
//	public ResponseEntity<?> attendMgtMain(@RequestBody Employees dto) {
//		System.out.println("<<< logincheckIdPwd >>>");
//		
//		Employees loginDTO = service.checkIdPwd(dto);
//		if(loginDTO == null) {
//			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//		}
//		else {
//			return new ResponseEntity<>(loginDTO, HttpStatus.OK);
//		}
//	}	
}
