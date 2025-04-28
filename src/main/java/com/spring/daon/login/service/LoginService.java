package com.spring.daon.login.service;

import java.nio.CharBuffer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.login.dto.CredentialsDTO;
import com.spring.daon.login.exception.AppException;
import com.spring.daon.login.mappers.LoginMapper;

@Service
public class LoginService {

	@Autowired
	private LoginMapper loginMapper;
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	// 입력한 이메일을 가지고 db에 값이 있는지 확인
	public Employees findByEmp_email(String emp_email) {
		System.out.println("<<< LoginService - findByEmp_Email() >>>");
		
		Employees emp = loginMapper.findByEmp_email(emp_email);
		
		return loginMapper.toEmployees(emp);
	}
	
	public Employees login(CredentialsDTO credentialsDTO) {
		System.out.println("<<< LoginService - login() >>>");
		
		// emp_email과 일치하는 사원 정보 조회
		Employees emp = loginMapper.findByEmp_email(credentialsDTO.getEmp_email());
		
		if (emp == null) {
		    throw new AppException("Invalid email", HttpStatus.UNAUTHORIZED);
		}
		
		// 입력받은 비밀번호를 CharBuffer로 변환하여 db에 저장된 암호화된 비밀번호와 비교함
		// import java.nio.CharBuffer; // 주의 -> 입력받은 비밀번호를 CharBuffer로 변환하여 db에 저장된 암호화된 비밀번호와 비교함
		if(passwordEncoder.matches(CharBuffer.wrap(credentialsDTO.getEmp_pwd()), emp.getEmp_pwd())) {
			return emp;
		}
		
		throw new AppException("Invalid password", HttpStatus.UNAUTHORIZED);
	}
	
	public Employees findByEmp_no(int emp_no) {
		System.out.println("<<< LoginService - login() >>>");
		return loginMapper.findByEmp_no(emp_no);
	}
}
