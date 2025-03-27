package com.spring.daon.login;

import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;

@Service
public interface LoginService {
	
	public Employees checkIdPwd(Employees dto);

}
