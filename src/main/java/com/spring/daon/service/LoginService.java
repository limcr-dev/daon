package com.spring.daon.service;

import org.springframework.stereotype.Service;

import com.spring.daon.dto.LoginDTO;

@Service
public interface LoginService {
	
	public LoginDTO checkIdPwd(LoginDTO dto);

}
