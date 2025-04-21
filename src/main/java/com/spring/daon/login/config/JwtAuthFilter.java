package com.spring.daon.login.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import lombok.RequiredArgsConstructor;


//보안 컨텍스트(SecurityContext)에 인증 빈(Authentication)을 추가하면, 모든 컨트롤러에서 @AuthenticationPrincipal을 입력 매개변수로 추가할 수 있다. 
//public ResponseEntity< > reqularEndpoint(@AuthenticationPrincipal Employees) => 인증된 사용자를 주입
//따라서 Filter는 인증된 사용자의 개체를 Controller에 제공한다. 인증빈을 반환하기 위해

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {  // 요청당 한번만 사용되기를 원하므로 OncePerRequestFilter 상속받음
	
	private final UserAuthProvider userAuthProvider;

	// doFilterInternal 메서드는 Spring Security 필터 체인 메커니즘에 의해 직접 호출하지 않아도 자동으로 실행됨
	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		
		System.out.println("<<< JwtAuthFilter - doFilterInternal() >>>");
		
		// refresh 토큰 엔드포인트는 검증 없이 통과
		String requestURI = request.getRequestURI();
		if("/api/token/refresh".equals(requestURI)) {
			filterChain.doFilter(request, response);
			return;
		}
		
		// Authorization 헤더에서 토큰 추출
		String header = request.getHeader(HttpHeaders.AUTHORIZATION);	// 르그인 시점에 보인다
		
		if(header != null) {    // 길이가 정확하고 Bearer 토큰이어야 한다.
			String[] elements = header.split(" ");
			
			// 헤더 형식 검증
			// elements[0] : Bearer / elements[1] : 실제 JWT 토큰
			if(elements.length == 2 && "Bearer".equals(elements[0])) {
				// 토큰 유효성 검증
				try {
					// 자격증명이 유효하면 보안 컨텍스트에 인증빈을 추가한다. 검증 통과
					SecurityContextHolder.getContext().setAuthentication(userAuthProvider.validationToken(elements[1]));
				} catch(RuntimeException e) {    // 문제가 발생하면 보안 컨텍스트를 지우고 오류를 발생시킨다.
					SecurityContextHolder.clearContext();  
					throw e;
				}
			}
		}
		
		filterChain.doFilter(request, response);  // 필터끝에서 doFilter() 메서드 호출
		
	}

}
