package com.spring.daon.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.daon.dao.LoginMapper;
import com.spring.daon.dto.LoginDTO;

@Service 
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginMapper loginMapper; 
	
    @Override
    public LoginDTO checkIdPwd(LoginDTO dto) {
        
    	return loginMapper.checkIdPwd(dto);
    }
}