package com.spring.daon.login.config;

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
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
//@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload-dir}")
    private String uploadDir;

//    @Bean
//    public FilterRegistrationBean<CorsFilter> corsFilter() {
//        System.out.println("<<< WebConfig - corsFilter() >>>");
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        CorsConfiguration config = new CorsConfiguration();
//
//        config.setAllowCredentials(true); // 쿠키 전송 허용
//        config.setAllowedOrigins(Arrays.asList(
//            "https://daon-ai.com",
//            "https://13.209.178.147"    // (EC2 IP, 포트 없이)
//        ));
//        config.setAllowedHeaders(Arrays.asList(
//            HttpHeaders.AUTHORIZATION,
//            HttpHeaders.CONTENT_TYPE,
//            HttpHeaders.ACCEPT,
//            HttpHeaders.COOKIE
//        ));
//        config.setAllowedMethods(Arrays.asList(
//            HttpMethod.GET.name(),
//            HttpMethod.POST.name(),
//            HttpMethod.PUT.name(),
//            HttpMethod.DELETE.name(),
//            HttpMethod.OPTIONS.name()
//        ));
//        config.setExposedHeaders(Arrays.asList(
//            HttpHeaders.AUTHORIZATION,
//            "Set-Cookie"
//        ));
//        config.setMaxAge(1800L); // 프리플라이트 응답 캐시 30분
//
//        source.registerCorsConfiguration("/**", config);
//
//        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
//        bean.setOrder(-102); // 다른 필터보다 먼저 실행
//        return bean;
//    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:C:/daon/uploads/");
    }
    
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:\\w+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:\\w+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{spring:\\w+}/**{spring:?!(\\.js|\\.css)$}")
                .setViewName("forward:/index.html");
    }
}