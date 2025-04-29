package com.spring.daon.login.config;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // 주의 (.reactive(x))
import org.springframework.web.filter.CorsFilter;  // 주의
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
	
	@Value("${file.upload-dir}")
	private String uploadDir;

	@Bean
	public FilterRegistrationBean corsFilter() {
		
		System.out.println("<<< WebConfig - corsFilter() >>>");
		
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		
		// 프론트엔드가 일부 자격증명을 보내면 그것을 받아들여야 한다.
		CorsConfiguration config = new CorsConfiguration();
		
		config.setAllowCredentials(true);	// 쿠키 전송을 허용
		config.addAllowedOrigin("http://13.209.178.147:80");	// 프론트엔드 도메인 설정
		
		// 모든 헤더 허용 대신 필요한 헤더만 명시
		config.setAllowedHeaders(Arrays.asList(
					HttpHeaders.AUTHORIZATION,
					HttpHeaders.CONTENT_TYPE,
					HttpHeaders.ACCEPT,
					HttpHeaders.COOKIE
				));
		
		// 허용할 HTTP 메서드 지정
		config.setAllowedMethods(Arrays.asList(
					HttpMethod.GET.name(),
					HttpMethod.POST.name(),
					HttpMethod.PUT.name(),
					HttpMethod.DELETE.name(),
					HttpMethod.OPTIONS.name()	// OPTIONS 메서드 추가(프리플라이트 요청에 필요)
				));
		
		// 브라우저가 프리플라이트 응답을 캐시하는 시간(30분)
		config.setMaxAge(1800L);
		
		// 노출할 헤더 설정(클라이언트가 읽을 수 있는 응답 헤더)
		config.setExposedHeaders(Arrays.asList(
					HttpHeaders.AUTHORIZATION,
					"Set-Cookie"
				));
		
		// 모든 경로에 대해 CORS 구성 적용
		source.registerCorsConfiguration("/**", config);
		
		FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
		bean.setOrder(-102);  // 낮은 순서로 설정하여 다른 필터보다 먼저 실행
		
		return bean;
		
		/*
		 * CORS(Cross-Origin Resource Sharing : 교차 출처 자원 공유)
		 * 백엔드는 프런트엔드에서 오는 요청을 신뢰하지 않는다.
		 * 기본적으로 백엔드는 자신에게서 오는 요청만 수락한다.
		 * 따라서 프런트엔드의 요청을 수락하도록 백엔드를 구성해야 한다.(Cors Policy에 의한 Not Access 해결)
		 */
	}
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/uploads/**")
	    .addResourceLocations("file:C:/daon/uploads/");
    }
	
	 @Override
	    public void addCorsMappings(CorsRegistry registry) {
	        registry.addMapping("/**")
	                .allowedOrigins("http://13.209.178.147:80", "https://daon-ai.com")  // 프론트 주소
	                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONS 반드시 포함!!
	                .allowedHeaders("*")
	                .allowCredentials(true); // 쿠키 포함 허용
	    }
}
