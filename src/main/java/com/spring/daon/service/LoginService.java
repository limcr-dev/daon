package com.spring.daon.service;

import org.springframework.stereotype.Service;

import com.spring.daon.dto.LoginDTO;

@Service
public interface LoginService {
	
	public int checkIdPwd(LoginDTO dto);

}
