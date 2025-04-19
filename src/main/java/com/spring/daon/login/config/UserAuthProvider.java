package com.spring.daon.login.config;

import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;  // 경로주의(롬복 아님)
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;  // 경로주의
import org.springframework.stereotype.Component;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier; // 경로주의
import com.auth0.jwt.algorithms.Algorithm;
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
    
    @Value("${security.jwt.token.refresh-expiration:604800000}")
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
		
		Date now = new Date();  // java.util.Date (import 주의)
		Date validity = new Date(now.getTime() + accessTokenValidity);   // 토큰 유효시간 1시간
		String jwtId = UUID.randomUUID().toString();
		
		// JWT를 사용하려면 pom.xml에 java-jwt 추가
		return JWT.create()
				.withSubject(String.valueOf(employee.getEmp_no()))	// 사용자 식별자(발급받은 사람)
				.withIssuer("daon-approval-system")		// 시스템 식별자(발급해준 사람)
				.withJWTId(jwtId) // 토큰 ID 설정
				.withIssuedAt(now)
				.withExpiresAt(validity)
				
				// payload 정보 담기
				.withClaim("emp_name", employee.getEmp_name())
				.withClaim("dept_no", employee.getDept_no())
				.withClaim("position_id", employee.getPosition_id())
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
	public Authentication validationToken(String token) {  // import org.springframework.security.core. 주의
		System.out.println("<<< UserAuthProvider - validationToken() >>>");
		System.out.println("<<< UserAuthProvider - token >>>" + token);
		
		// import com.auth0.jwt.JWTVerifier; // 주의
		// 토큰 서명 검증 (HMAC256 알고리즘)
		JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();

		// 토큰 만료 여부 확인
		DecodedJWT decoded = verifier.verify(token);  // JWT를 확인하기 위해 먼저 디코딩한다. 유효기간을 초과하면 예외가 발생한다.
		
		// 토큰 타입 확인
		String tokenType = decoded.getClaim("token_type").asString();
		if(!"access".equals(tokenType)) {
			throw new RuntimeException("Invalid token type");
		}
		
		// 토큰의 발급자(Issuer) 정보로 사용자 조회
		Employees emp = loginService.findByEmp_no(Integer.parseInt(decoded.getSubject()));
		
		// 사용자가 데이터베이스에 존재하는지 확인
		return new UsernamePasswordAuthenticationToken(emp, null, Collections.emptyList());
		
	}
	
	// 리프레시 토큰 검증
	public String validateRefreshToken(String refreshToken) {
		System.out.println("<<< UserAuthProvider - valicateRefreshToken() >>>");
		
		try{
			JWTVerifier verifier = JWT.require(Algorithm.HMAC256(secretKey)).build();
			DecodedJWT decoded = verifier.verify(refreshToken);
			
			// 토큰 타입 확인
			String tokenType = decoded.getClaim("token_type").asString();
			if(!"refresh".equals(tokenType)) {
				throw new RuntimeException("Invalid token type");
			}
			
			// 사용자 조회
			int emp_no = Integer.parseInt(decoded.getSubject());
			Employees emp = loginService.findByEmp_no(emp_no);
			
			// DB에 저장된 리프레시 토큰과 비교 검증
			boolean isValid = refreshTokenService.validateRefreshToken(emp_no, refreshToken);
			if(!isValid) {
				throw new RuntimeException("Invalid refresh token");
			}
			
			// 새 엑세스 토큰 발급
			return createAccessToken(emp);
		} catch(Exception e) {
			throw new RuntimeException("Invalid refresh token", e);
		}
	}

}
