package com.spring.daon.login.config;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.xml.catalog.Catalog;

import org.springframework.beans.factory.annotation.Value;  // 경로주의(롬복 아님)
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;  // 경로주의
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier; // 경로주의
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.spring.daon.hrMgt.Employees;
import com.spring.daon.login.service.LoginService;
import com.spring.daon.login.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

// 토큰 생성과 검증을 담당하는 클래스
@RequiredArgsConstructor
@Component
public class UserAuthProvider {
	
	// application.yml/properties에서 비밀키 값을 가져옴 (없으면 "secret-value" 사용)
	@Value("${security.jwt.token.secret-key:secret-value}")
    private String secretKey;
    
    @Value("${security.jwt.token.access-expiration:3600000}")
    private long accessTokenValidity;
    
    @Value("${security.jwt.token.refresh-expiration:86400000L}")
    private long refreshTokenValidity;
    
	private final LoginService loginService;
	
	private final RefreshTokenService refreshTokenService;
	
	@PostConstruct
	protected void init() {
		// 빈 초기화 후 자동으로 실행되어 비밀키를 Base64로 인코딩 (보안 강화)
		secretKey = Base64.getEncoder().encodeToString(secretKey.getBytes());
	}
	
	// 토큰 생성
	public String createAccessToken(Employees employee) {
		System.out.println("<<< UserAuthProvider - createToken() >>>");
		
		Date now = new Date();
	    Date validity = new Date(now.getTime() + accessTokenValidity); // 5분
	    
	    String jwtId = UUID.randomUUID().toString();
	    
	    System.out.println("액세스 토큰 생성 시간: " + now);
	    System.out.println("액세스 토큰 만료 시간: " + validity);
		
		// JWT를 사용하려면 pom.xml에 java-jwt 추가
		return JWT.create()
				.withSubject(String.valueOf(employee.getEmp_no()))	// 사용자 식별자(발급받은 사람)
				.withIssuer("daon-approval-system")		// 시스템 식별자(발급해준 사람)
				.withJWTId(jwtId) // 토큰 ID 설정
				.withIssuedAt(now)
				.withExpiresAt(validity)
				.withClaim("emp_name", employee.getEmp_name())
				.withClaim("dept_no", employee.getDept_no())
				.withClaim("position_id", employee.getPosition_id())
				.withClaim("role_id", employee.getRole_id())
				.withClaim("admin_type", employee.getAdmin_type())
				.withClaim("token_type", "access")
				.sign(Algorithm.HMAC256(secretKey));	// HMAC256 알고리즘으로 서명하여 토큰 생성
	}
	
	// 리프레시 토큰 생성
	public String createRefreshToken(Employees employee) {
		System.out.println("<<< UserAuthProvider - createRefreshToken() >>>");
		
		Date now = new Date();
		Date validity = new Date(now.getTime() + refreshTokenValidity);
		String jwtId = UUID.randomUUID().toString();
		System.out.println("리프레시 토큰 만료 일시:" + validity);
		
		return JWT.create()
				.withSubject(String.valueOf(employee.getEmp_no()))
				.withIssuer("daon-approval-system")
				.withJWTId(jwtId)
				.withIssuedAt(now)
				.withExpiresAt(validity)
				.withClaim("token_type", "refresh")
				.sign(Algorithm.HMAC256(secretKey));
				
	}
	
	// 토큰 검증
	public Authentication validationToken(String token) {
		System.out.println("<<< UserAuthProvider - validationToken() >>>");
		System.out.println("<<< UserAuthProvider - token >>>" + token);
		
		try {
		// 토큰 서명 검증 (HMAC256 알고리즘)
		JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();

		// 토큰 만료 여부 확인
		DecodedJWT decoded = verifier.verify(token);  // JWT를 확인하기 위해 먼저 디코딩한다. 유효기간을 초과하면 예외가 발생한다.
		
		// 토큰 타입 확인
		String tokenType = decoded.getClaim("token_type").asString();
		System.out.println("받은 토큰 타입: " + tokenType); 
		if(!"access".equals(tokenType)) {
			throw new RuntimeException("Invalid token type");
		}
		
		// 토큰의 발급자(Issuer) 정보로 사용자 조회
		Employees emp = loginService.findByEmp_no(Integer.parseInt(decoded.getSubject()));
		
		// 사용자가 데이터베이스에 존재하는지 확인
		return new UsernamePasswordAuthenticationToken(emp, null, Collections.emptyList());

		} catch (TokenExpiredException e) {
            System.out.println("토큰이 만료되었습니다: " + e.getMessage());
            throw e; // 호출자에게 만료 예외 다시 전달
        } catch (JWTVerificationException e) {
            System.out.println("토큰 검증 실패: " + e.getMessage());
            throw new RuntimeException("Invalid token: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("토큰 검증 중 오류 발생: " + e.getMessage());
            throw new RuntimeException("Error validating token: " + e.getMessage());
        }
	}
	
	public String validateRefreshToken(String refreshToken) {
	    System.out.println("<<< UserAuthProvider - validateRefreshToken() >>>");
	    System.out.println("리프레시 토큰 검증 시작: " + refreshToken.substring(0, Math.min(20, refreshToken.length())) + "...");
	    
	    try {
	        // 토큰이 유효한지 확인 (만료 등)
	        JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
	        DecodedJWT decoded = verifier.verify(refreshToken);
	        
	        // 토큰 타입 확인
	        String tokenType = decoded.getClaim("token_type").asString();
	        System.out.println("토큰 타입: " + tokenType);
	        if (!"refresh".equals(tokenType)) {
	            System.out.println("토큰 타입 불일치: " + tokenType);
	            throw new RuntimeException("Invalid token type");
	        }
	        
	        // 토큰의 발급 및 만료 시간 출력
	        System.out.println("토큰 발급 시간: " + decoded.getIssuedAt());
	        System.out.println("토큰 만료 시간: " + decoded.getExpiresAt());
	        System.out.println("현재 시간: " + new Date());
	        
	        // 사용자 정보 확인
	        String subStr = decoded.getSubject();
	        System.out.println("토큰에서 subject 추출: " + subStr);
	        int empNo = Integer.parseInt(subStr);
	        
	        // 사용자 및 DB의 토큰 확인
	        Employees emp = loginService.findByEmp_no(empNo);
	        boolean isValid = refreshTokenService.validateRefreshToken(empNo, refreshToken);
	        System.out.println("DB에서 리프레시 토큰 검증 결과: " + isValid);
	        
	        if (!isValid) {
	            throw new RuntimeException("Invalid refresh token in database");
	        }
	        
	        // 새 액세스 토큰 생성
	        return createAccessToken(emp);
	    } catch (TokenExpiredException e) {
            System.out.println("리프레시 토큰이 만료되었습니다: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("리프레시 토큰 검증 실패: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Invalid refresh token: " + e.getMessage(), e);
        }
	}
	
	// 토큰에서 emp_no를 추출하는 메서드
	// 토큰 순환 구현에 필요함
	public int getEmpNoFromToken(String token) {
		try {
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
			DecodedJWT decoded = verifier.verify(token);
			return Integer.parseInt(decoded.getSubject());
		} catch (Exception e) {
			System.out.println("토큰에서 emp_no 추출 실패: " + e.getMessage());
            throw new RuntimeException("Failed to extract emp_no from token", e);
		}
	}

}
