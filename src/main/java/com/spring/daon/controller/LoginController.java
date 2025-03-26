package com.spring.daon.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.dto.LoginDTO;
import com.spring.daon.service.LoginService;




@RestController
@RequestMapping("/api")
@CrossOrigin
public class LoginController {

	@Autowired
	private LoginService service;

	// login 페이지
	@PostMapping("/login")
	public ResponseEntity<?> logincheckIdPwd(@RequestBody LoginDTO dto) {
		System.out.println("<<< logincheckIdPwd >>>");
		if(service.checkIdPwd(dto) == null) {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
		else {
			return new ResponseEntity<>(HttpStatus.OK);
		}
	}	

}
