package com.spring.daon.login;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.hrMgt.Employees;

@Mapper
@Repository
public interface LoginMapper {
	
	// 사용자 사내 이메일, 비밀번호 조회
	public Employees checkIdPwd(Employees dto); 	

}
