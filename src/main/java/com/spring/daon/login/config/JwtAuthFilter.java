package com.spring.daon.login.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.spring.daon.hrMgt.Employees;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final UserAuthProvider userAuthProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("<<< JwtAuthFilter - doFilterInternal() >>>");

        String requestURI = request.getRequestURI();

        // 토큰 체크 제외 URI
        if (requestURI.equals("/api/token/refresh") ||
            requestURI.contains("/ws-chat") ||
            requestURI.contains("/messenger/file/upload")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Authorization 헤더에서 토큰 추출
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            try {
                Authentication auth = userAuthProvider.validationToken(token);

                // admin_type 체크 (특정 URI 한정)
                if (requestURI.startsWith("/api/positions")) {
                    Employees emp = (Employees) auth.getPrincipal();
                    int adminType = emp.getAdmin_type();
                    if (adminType != 2 && adminType != 3) {
                        response.sendError(HttpServletResponse.SC_FORBIDDEN, "접근 권한이 없습니다.");
                        return;
                    }
                }

                // 보안 컨텍스트에 인증 객체 저장
                SecurityContextHolder.getContext().setAuthentication(auth);

            } catch (RuntimeException e) {
                SecurityContextHolder.clearContext();
                throw e;
            }
        }

        // 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }
}
