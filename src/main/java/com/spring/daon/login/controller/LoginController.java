package com.spring.daon.login.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.spring.daon.hrMgt.Employees;
import com.spring.daon.login.service.LoginService;
import com.spring.daon.login.service.RefreshTokenService;
import com.spring.daon.login.config.UserAuthProvider;
import com.spring.daon.login.dto.CredentialsDTO;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class LoginController {

	@Autowired
	private LoginService loginService;
	
	@Autowired
	private UserAuthProvider userAuthProvider;
	
	@Autowired
	private RefreshTokenService refreshTokenService;
	
	public LoginController(LoginService loginService, UserAuthProvider userAuthProvider, RefreshTokenService refreshTokenService) {
		super();
		this.loginService = loginService;
		this.userAuthProvider = userAuthProvider;
	    this.refreshTokenService = refreshTokenService;
	}
	
	// login 페이지
	@PostMapping("/login")
	public ResponseEntity<?> logincheckIdPwd(@RequestBody CredentialsDTO credentialsDTO) {
		System.out.println("<<< logincheckIdPwd >>>");
		
		// LoginService를 통해 사용자 인증
		Employees emp = loginService.login(credentialsDTO);
		
		String accessToken = userAuthProvider.createAccessToken(emp);
		
		String refreshToken = userAuthProvider.createRefreshToken(emp);
		
		// 리프레시 토큰 저장(만료 시간 계산)
		Date expiryDate = new Date(System.currentTimeMillis() + 259200000); 
		refreshTokenService.createRefreshToken(emp.getEmp_no(), refreshToken, expiryDate);
		
		// 인증 성공 시 JWT 토큰 발급
		emp.setToken(accessToken);
		
		Map<String, Object> response = new HashMap<>();
		response.put("user", emp);
		response.put("refreshToken", refreshToken);
		
		// res로 토큰과 사용자 정보 반환
		return ResponseEntity.ok(response);  // 크롬브라우저 F12 > Headers : 200 OK  : 새로운 JWT를 반환
	}	
	
	// login 페이지
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody CredentialsDTO credentialsDTO) {
		System.out.println("<<< logout >>>");
		
		// 사용자 ID를 알 수 있다면 리프레시 토큰 삭제
		if(credentialsDTO.getEmp_email() != null) {
			try {
				Employees emp = loginService.findByEmp_email(credentialsDTO.getEmp_email());
				if(emp != null) {
					refreshTokenService.deleteByEmpNo(emp.getEmp_no());
				}
				
			} catch (Exception e) {
				// 사용자를 찾을 수 없거나 다른 오류가 발생해도 로그아웃은 계속 진행
				System.out.println("Error during logout:" + e.getMessage());
			}
		}
		
		return ResponseEntity.ok().body(Map.of("message", "로그아웃 되었습니다."));
		
	}	
	
	// 토큰 리프레시
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        // 헤더에서 리프레시 토큰 추출
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        System.out.println("토큰 리프레시 요청 수신. 헤더: " + (header != null ? (header.substring(0, Math.min(20, header.length())) + "...") : "null"));

        if (header == null || !header.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Refresh token is required");
        }
        
        String refreshToken = header.substring(7);
        
        try {
            // 리프레시 토큰 검증 및 새 액세스 토큰 발급
            String newAccessToken = userAuthProvider.validateRefreshToken(refreshToken);
            
            Map<String, String> tokenMap = new HashMap<>();
            tokenMap.put("accessToken", newAccessToken);
            
            return ResponseEntity.ok(tokenMap);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token: " + e.getMessage());
        }
    }

}
