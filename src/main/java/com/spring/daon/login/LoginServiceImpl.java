package com.spring.daon.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.spring.daon.hrMgt.Employees;

@Service 
public class LoginServiceImpl implements LoginService {

	@Autowired
	private LoginMapper loginMapper; 
	
    @Override
    public Employees checkIdPwd(Employees dto) {
        
    	return loginMapper.checkIdPwd(dto);
    }
}