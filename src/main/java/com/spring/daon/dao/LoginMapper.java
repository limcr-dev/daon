package com.spring.daon.dao;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import com.spring.daon.dto.LoginDTO;

@Mapper
@Repository
public interface LoginMapper {
	
	// 사용자 사내 이메일, 비밀번호 조회
	public int checkIdPwd(LoginDTO dto); 	

}
