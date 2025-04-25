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
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
	
	@Bean
	public FilterRegistrationBean corsFilter() {
		
		System.out.println("<<< WebConfig - corsFilter() >>>");
		
		// import org.springframework.web.cors. 주의
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		
		// 프론트엔드가 일부 자격증명을 보내면 그것을 받아들여야 한다.
		CorsConfiguration config = new CorsConfiguration();
		
		System.out.println("<<< WebConfig-1 >>>");
		config.setAllowCredentials(true);
		config.addAllowedOrigin("http://localhost:3000");
		config.setAllowedHeaders(Arrays.asList(
					HttpHeaders.AUTHORIZATION,
					HttpHeaders.CONTENT_TYPE,
					HttpHeaders.ACCEPT
				));
		
		System.out.println("<<< WebConfig-2 >>>");
		config.setAllowedMethods(Arrays.asList(
					HttpMethod.GET.name(),
					HttpMethod.POST.name(),
					HttpMethod.PUT.name(),
					HttpMethod.DELETE.name()
				));
		
		config.setMaxAge(3600L);  // 옵션 요청이 수락되는 시간 30분
		source.registerCorsConfiguration("/**", config);
		
		System.out.println("<<< WebConfig-3 >>>");
		// 주의 - import org.springframework.web.filter.CorsFilter; 
		FilterRegistrationBean bean = new FilterRegistrationBean(new CorsFilter(source));
		bean.setOrder(-102);  // 가장 낮은 위치
		
		System.out.println("<<< WebConfig-4 >>>");
		
		return bean;
		
		/*
		 * CORS(Cross-Origin Resource Sharing : 교차 출처 자원 공유)
		 * 백엔드는 프런트엔드에서 오는 요청을 신뢰하지 않는다.
		 * 기본적으로 백엔드는 자신에게서 오는 요청만 수락한다.
		 * 따라서 프런트엔드의 요청을 수락하도록 백엔드를 구성해야 한다.(Cors Policy에 의한 Not Access 해결)
		 */
	}
	
	@Value("${file.upload-dir}")
	private String uploadDir;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/uploads/**")
	    .addResourceLocations("file:C:/daon/uploads/");
    }
}
