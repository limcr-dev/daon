package com.spring.daon.login.service;

import java.util.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.springframework.stereotype.Service;

import com.spring.daon.login.dto.RefreshToken;
import com.spring.daon.login.mappers.RefreshTokenMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
	
	private final RefreshTokenMapper refreshTokenMapper;
	
	public RefreshToken createRefreshToken(int emp_no, String token, Date expiryDate) {
		// 기존 토큰 삭제
		refreshTokenMapper.deleteByEmpNo(emp_no);
		
		// 새 토큰 저장
		RefreshToken refreshToken = RefreshToken.builder()
				.empNo(emp_no)
				.token(token)
				.expiryDate(convertToLocalDateTime(expiryDate))
				.build();
		
		refreshTokenMapper.saveRefreshToken(refreshToken);
		return refreshToken;
	}
	
	public boolean validateRefreshToken(int empNo, String token) {
		RefreshToken refreshToken = refreshTokenMapper.findByEmpNo(empNo);
		
		return refreshToken != null &&
				refreshToken.getToken().equals(token) &&
				refreshToken.getExpiryDate().isAfter(LocalDateTime.now());
	}
	
	public RefreshToken findByToken(String token) {
		return refreshTokenMapper.findByToken(token);
	}
	
	public void deleteByEmpNo(int empNo) {
		refreshTokenMapper.deleteByEmpNo(empNo);
	}
	
	private LocalDateTime convertToLocalDateTime(Date date) {
		return date.toInstant()
				.atZone(ZoneId.systemDefault())
				.toLocalDateTime();
	}
	
	
}
