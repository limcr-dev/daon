package com.spring.daon.login.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;  // 경로주의
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

// 백엔드로 요청이 들어오면 이 클래스에서 모든 요청을 가로챔
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity   // SpringConfig 클래스에 있는 어노테이션으로, Spring Security의 자동 구성을 활성화시킴
public class SecurityConfig {
   
   // 매개변수 생성자 => @RequiredArgsConstructor + final 매개변수(대입 불가 상수로 안전하게 설정)
   private final UserAuthenticationEntryPoint userAuthenticationEntryPoint;
   private final UserAuthProvider userAuthProvider;

   // JwtAuthFilter 빈 정의
   // new로 저장해서 웹소켓 반응x -> 추가
   @Bean
    public JwtAuthFilter jwtAuthFilter() {
        System.out.println(">>> JwtAuthFilter Bean 등록됨");
        return new JwtAuthFilter(userAuthProvider);
    }
	
	// SecurityFilterChain 빈 정의
	// 정의하면 나머지 작업은 SpringBoot와 SpringSecurity에서 자동으로 처리해줌
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		
		System.out.println("<<< SecurityConfig - securityFilterChain() >>>");
		
		http
			.exceptionHandling(handling ->handling.authenticationEntryPoint(userAuthenticationEntryPoint))
			.addFilterBefore(jwtAuthFilter(), BasicAuthenticationFilter.class)  // Spring Security의 인증필터 앞에 JWT 필터를 추가
																				// JwtAuthFilter 실행 -> JWT 토큰 검증
			.csrf(csrf -> csrf.disable())  // REST API이므로 CSRF 보호 비활성화
			.sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
			.cors(cors -> cors.configurationSource(corsConfigurationSource()))	// CORS 설정 추가
			.authorizeHttpRequests((requests) -> requests
				    .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
				    .antMatchers("/uploads/**").permitAll()
				    .antMatchers("/api/login").permitAll()  // 로그인은 누구나
				    .antMatchers("/api/token/refresh").permitAll()
				    .antMatchers("/api/s3/library/download/**").permitAll() // 파일 다운로드 경로 추가
				    .anyRequest().authenticated()       // 나머지 전부 로그인 필요!!			
		);
		
		return http.build();
	}
	
	@Bean
	public HttpFirewall allowUrlEncodedPercentHttpFirewall() {
		StrictHttpFirewall firewall = new StrictHttpFirewall();
		firewall.setAllowUrlEncodedPercent(true);  // 핵심 설정!
		return firewall;
    }
	
	// 웹소켓 때문에 추가
	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
	    CorsConfiguration config = new CorsConfiguration();
	    
	    // config.setAllowedOriginPatterns(List.of("http://localhost:3000")); // 프론트엔드 도메인 지정
	    config.setAllowedOriginPatterns(List.of("*")); // 모든 Origin 허용(배포 후 변경 필요)
	    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    config.setAllowedHeaders(List.of("*"));
	    config.setAllowCredentials(true); // 쿠키 전송 허용
	    config.setExposedHeaders(List.of("Authorization", "Set-Cookie")); // 클라이언트가 접근할 수 있는 헤더

	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    source.registerCorsConfiguration("/**", config);
	    return source;
	}
}
