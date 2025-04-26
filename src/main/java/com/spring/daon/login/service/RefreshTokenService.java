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
	    
	    // 토큰이 null인 경우
	    if (refreshToken == null) {
	        System.out.println("DB에서 리프레시 토큰을 찾을 수 없음: empNo = " + empNo);
	        return false;
	    }
	    
	    // 토큰 일치 여부 확인
	    boolean tokenMatches = refreshToken.getToken().equals(token);
	    if (!tokenMatches) {
	        System.out.println("토큰 불일치:");
	        System.out.println("DB 토큰: " + refreshToken.getToken().substring(0, Math.min(20, refreshToken.getToken().length())) + "...");
	        System.out.println("요청 토큰: " + token.substring(0, Math.min(20, token.length())) + "...");
	    }
	    
	    // 만료 시간 확인
	    boolean notExpired = refreshToken.getExpiryDate().isAfter(LocalDateTime.now());
	    if (!notExpired) {
	        System.out.println("토큰 만료됨:");
	        System.out.println("만료 시간: " + refreshToken.getExpiryDate());
	        System.out.println("현재 시간: " + LocalDateTime.now());
	    }
	    
	    return tokenMatches && notExpired;
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
