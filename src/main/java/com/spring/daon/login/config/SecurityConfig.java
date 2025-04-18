package com.spring.daon.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;  // 경로주의
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import lombok.RequiredArgsConstructor;

// 2. 백엔드로 요청이 들어오면 이 클래스에서 모든 요청을 가로챔
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity	// SpringConfig 클래스에 있는 어노테이션으로, Spring Security의 자동 구성을 활성화시킴
public class SecurityConfig {
	
	// 매개변수 생성자 => @RequiredArgsConstructor + final 매개변수(대입 불가 상수로 안전하게 설정)
	private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
	private final UserAuthProvider userAuthProvider;

	// SecurityFilterChain 빈 정의
	// 정의하면 나머지 작업은 SpringBoot와 SpringSecurity에서 자동으로 처리해줌
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		System.out.println("<<< SecurityConfig - securityFilterChain() >>>");
		
		http
			.exceptionHandling(handling ->handling.authenticationEntryPoint(userAuthenticationEntryPoint))
			.addFilterBefore(new JwtAuthFilter(userAuthProvider), BasicAuthenticationFilter.class)  // Spring Security의 인증필터 앞에 JWT 필터를 추가
																									// JwtAuthFilter 실행 -> JWT 토큰 검증
			.csrf(csrf -> csrf.disable())  // csrf 설정 비활성화
			.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests((requests) -> requests	// 접근 권한 설정
					.antMatchers(HttpMethod.POST, "/login" ,"/home", "/api/**", "/attend/**", "/board/**", "/performMgt/**").permitAll() // 인증이 필요하지 않은 유일한 엔드포인트(모두에게 회원 가입, 로그인은 시도할 수 있도록 허용)
					.antMatchers(HttpMethod.GET,"/api/**", "/attend/**", "/board/**", "/performMgt/**").permitAll()
					.antMatchers(HttpMethod.PUT,"/api/**", "/attend/**", "/board/**", "/performMgt/**").permitAll()
					.antMatchers(HttpMethod.DELETE,"/api/**", "/attend/**", "/board/**", "/performMgt/**").permitAll()
					.anyRequest().authenticated()
		);			
		
		return http.build();
	}

}

// 작성
// UserAuthenticationEntryPoint
// UserAuthProvider
// JwtAuthFilter
