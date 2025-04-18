package com.spring.daon.login.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.login.service.LoginService;

import com.spring.daon.login.config.UserAuthProvider;
import com.spring.daon.login.dto.CredentialsDTO;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class LoginController {

	@Autowired
	private LoginService loginService;
	
	@Autowired
	private UserAuthProvider userAuthProvider;
	
	public LoginController(LoginService loginService, UserAuthProvider userAuthProvider) {
		super();
		this.loginService = loginService;
		this.userAuthProvider = userAuthProvider;
	}
	
	// login 페이지
	@PostMapping("/login")
	public ResponseEntity<?> logincheckIdPwd(@RequestBody CredentialsDTO credentialsDTO) {
		System.out.println("<<< logincheckIdPwd >>>");
		
		// LoginService를 통해 사용자 인증
		Employees emp = loginService.login(credentialsDTO);
		
		// 인증 성공 시 JWT 토큰 발급
		emp.setToken(userAuthProvider.createToken(emp));
		
		// res로 토큰과 사용자 정보 반환
		return ResponseEntity.ok(emp);  // 크롬브라우저 F12 > Headers : 200 OK  : 새로운 JWT를 반환
		
		// return ResponseEntity.ok().body(Map.of("token", token, "user", userDTO));
	}	
	
	// login 페이지
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody CredentialsDTO credentialsDTO) {
		System.out.println("<<< logout >>>");
		
		
		return null;  // 크롬브라우저 F12 > Headers : 200 OK  : 새로운 JWT를 반환
		
		// return ResponseEntity.ok().body(Map.of("token", token, "user", userDTO));
	}	

}
