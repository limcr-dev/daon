package com.spring.daon.login.mappers;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.spring.daon.login.dto.RefreshToken;

@Mapper
@Repository
public interface RefreshTokenMapper {
	
	public void saveRefreshToken(RefreshToken refreshToken);
	
	public RefreshToken findByEmpNo(@Param("emp_no") int empNo);
	
	public RefreshToken findByToken(@Param("token") String token);
	
	public void deleteByEmpNo(@Param("emp_no") int empNo);
	
	public void deleteExpiredTokens();
}
