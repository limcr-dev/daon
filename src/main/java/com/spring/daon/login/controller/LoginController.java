package com.spring.daon.login.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.exceptions.TokenExpiredException;
import com.spring.daon.hrMgt.Employees;
import com.spring.daon.login.service.LoginService;
import com.spring.daon.login.service.RefreshTokenService;

import co.elastic.clients.elasticsearch.nodes.Http;

import com.spring.daon.login.config.UserAuthProvider;
import com.spring.daon.login.dto.CredentialsDTO;
import com.spring.daon.login.exception.AppException;

@RestController
@RequestMapping("/api")
public class LoginController {

	// 리프레시 토큰 쿠키 이름 상수 추가
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
    
	@Autowired
	private LoginService loginService;
	
	@Autowired
	private UserAuthProvider userAuthProvider;
	
	@Autowired
	private RefreshTokenService refreshTokenService;
	
	@Value("${security.jwt.token.refresh-expiration:86400000L}")
    private long refreshTokenValidity;
	
	public LoginController(LoginService loginService, UserAuthProvider userAuthProvider, RefreshTokenService refreshTokenService) {
		super();
		this.loginService = loginService;
		this.userAuthProvider = userAuthProvider;
	    this.refreshTokenService = refreshTokenService;
	}
	
	// login 페이지, 
	@PostMapping("/login")
	public ResponseEntity<?> logincheckIdPwd(@RequestBody CredentialsDTO credentialsDTO, HttpServletResponse response) {
		System.out.println("<<< logincheckIdPwd >>>");
		try {
			// LoginService를 통해 사용자 인증
			Employees emp = loginService.login(credentialsDTO);
			
			// 액세스 토큰 생성
			String accessToken = userAuthProvider.createAccessToken(emp);
			
			// 리프레시 토큰 생성
			String refreshToken = userAuthProvider.createRefreshToken(emp);
			
			// 리프레시 토큰 저장(만료 시간 계산)
			Date expiryDate = new Date(System.currentTimeMillis() + refreshTokenValidity); 
			refreshTokenService.createRefreshToken(emp.getEmp_no(), refreshToken, expiryDate);
			
			// 리프레시 토큰을 쿠키에 설정
			addRefreshTokenCookie(response, refreshToken);
			
			Map<String, String> tokenMap = new HashMap<>();
			tokenMap.put("accessToken", accessToken);
			
			// res로 토큰과 사용자 정보 반환
			return ResponseEntity.ok(tokenMap);  // 크롬브라우저 F12 > Headers : 200 OK  : 새로운 JWT를 반환
		}catch (AppException e) {
	        return ResponseEntity.status(e.getCode()).body(Map.of("error", e.getMessage()));
	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "서버 내부 오류"));
	    }
		
	}	
	
	// 로그아웃 시 쿠키 삭제
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody Map<String, Object> requestBody, HttpServletResponse response) {
		System.out.println("<<< logout >>>");
		
		// 사원 번호로 사용자 정보 찾기
	    Integer empNo = requestBody.get("emp_no") != null ? 
	                   Integer.parseInt(requestBody.get("emp_no").toString()) : null;
	    
		// 사용자 ID를 알 수 있다면 리프레시 토큰 삭제
		if(empNo != null) {
			try {
				 // 사원 번호로 직접 리프레시 토큰 삭제
	            refreshTokenService.deleteByEmpNo(empNo);
	            System.out.println("사원번호 " + empNo + "의 리프레시 토큰을 삭제했습니다.");
			} catch (Exception e) {
				// 사용자를 찾을 수 없거나 다른 오류가 발생해도 로그아웃은 계속 진행
				System.out.println("Error during logout:" + e.getMessage());
			}
		} else {
			System.out.println("로그아웃 요청에 사원번호가 포함되지 않았습니다.");
		}
		
		// 리프레시 토큰 쿠키 삭제
        deleteRefreshTokenCookie(response);
		
		return ResponseEntity.ok().body(Map.of("message", "로그아웃 되었습니다."));
		
	}	
	
	// 토큰 리프레시 - 쿠키에서 리프레시 토큰 읽기
	@PostMapping("/token/refresh")
	public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
		System.out.println("<<< refreshToken >>>");
		
		// 쿠키에서 리프레시 토큰 추출
		String refreshToken = extractRefreshTokenFromCookie(request);
		
		if(refreshToken == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Refresh token not found in cookies"));
		}
		
		try {
			// 리프레시 토큰 검증 및 새 액세스 토큰 발급
			String newAccessToken = userAuthProvider.validateRefreshToken(refreshToken);
			
			// 토큰 순환(Token Rotation)구현 - 더 높은 보안을 위해 새 리프레시 토큰 발급
			String newRefreshToken = generateNewRefreshToken(refreshToken);
			
			// 새 리프레시 토큰을 쿠키에 설정
			if(newRefreshToken != null) {
				addRefreshTokenCookie(response, newRefreshToken);
			}
			
			Map<String, String> tokenMap = new HashMap<>();
			
			tokenMap.put("accessToken", newAccessToken);
			
			return ResponseEntity.ok(tokenMap);
			
		} catch (TokenExpiredException e) {
			deleteRefreshTokenCookie(response);
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Refresh token has expired. Please login again."));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "Invalid refresh token: " + e.getMessage()));
		}
    }
	
	// 쿠키에 리프레시 토큰 추가
	private void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
		Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
		
		// 개발환경 여부 체크해서 Secure 설정
//	    if (isProduction()) {
//	        cookie.setSecure(true);	// HTTPS에서만 전송되도록 설정 (프로덕션에서)
//	    } else {
//	        cookie.setSecure(false); // 개발단계에서 사용
//	    }
	    
		// 쿠키 설정
        cookie.setHttpOnly(true);// JavaScript에서 접근 불가능하게 설정
        cookie.setSecure(true); 
        cookie.setPath("/");     // 해당 경로에서만 쿠키 전송
        cookie.setMaxAge((int)(refreshTokenValidity / 1000)); // 24시간(밀리초를 초로 변환)
        response.addCookie(cookie);
        System.out.println("리프레시 토큰 쿠키 추가: " + refreshToken.substring(0, 20) + "...");
	}
	
	// 쿠키에서 리프레시 토큰 삭제
	private void deleteRefreshTokenCookie(HttpServletResponse response) {
		Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, null);
		
		// 개발환경 여부 체크해서 Secure 설정
//	    if (isProduction()) {
//	        cookie.setSecure(true);	// HTTPS에서만 전송되도록 설정 (프로덕션에서)
//	    } else {
//	        cookie.setSecure(false); // 개발단계에서 사용
//	    } 
	  
		cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // 즉시 만료
        
        response.addCookie(cookie);
	}
	
	// 쿠키에서 리프레시 토큰 추출
	private String extractRefreshTokenFromCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		
		if(cookies != null) {
			for(Cookie cookie : cookies) {
				if(REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
					return cookie.getValue();
				}
			}
		}
		
		// Authorization 헤더에서도 확인
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		if(header != null && header.startsWith("Bearer ")) {
			return header.substring(7);
		}
		
		return null;
	}
	
	// 토큰 순환을 위한 새 리프레시 토큰 생성
	private String generateNewRefreshToken(String oldRefreshToken) {
		try {
			// 이전 토큰 정보 디코딩하여 사용자 정보 추출
			int empNo = userAuthProvider.getEmpNoFromToken(oldRefreshToken);
			Employees emp = loginService.findByEmp_no(empNo);
			
			if(emp != null) {
				// 새 리프레시 토큰 생성
				String newRefreshToken = userAuthProvider.createRefreshToken(emp);
				
				// DB에 새 토큰 저장
				Date expiryDate = new Date(System.currentTimeMillis() + refreshTokenValidity);	// 24시간
				refreshTokenService.createRefreshToken(empNo, newRefreshToken, expiryDate);
				
				return newRefreshToken;
			}
		} catch (Exception e) {
			System.out.println("새 리프레시 토큰 생성 중 오류: " + e.getMessage());
		}
		
		return null;
	}
	
	// 토큰 유효성 검사 엔드포인트
	@PostMapping("/token/validate")
	public ResponseEntity<?> validateToken(HttpServletRequest request){
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);
		
		if(header == null || !header.startsWith("Bearer ")) {
			return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "No token provided"));
		}
		
		String token = header.substring(7);
		
		try {
			userAuthProvider.validationToken(token);
			return ResponseEntity.ok(Map.of("valid", true));
		} catch (TokenExpiredException e) {
			return ResponseEntity.ok(Map.of("valid", false, "expired", true));
		} catch(Exception e) {
			return ResponseEntity.ok(Map.of("valid", false, "message", e.getMessage()));
		}
	}
	
	private boolean isProduction() {
	    // 간단하게 profile 같은 거로 구분
	    String activeProfile = System.getProperty("spring.profiles.active");
	    return "prod".equals(activeProfile);
	}
}
