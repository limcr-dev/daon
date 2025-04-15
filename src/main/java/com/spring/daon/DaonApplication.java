package com.spring.daon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DaonApplication {

	public static void main(String[] args) {
		SpringApplication.run(DaonApplication.class, args);
	}

}
