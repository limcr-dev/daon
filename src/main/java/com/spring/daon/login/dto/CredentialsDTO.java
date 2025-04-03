package com.spring.daon.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CredentialsDTO {
	
	private String emp_email;
	private String emp_pwd;
	// private char[] emp_pwd;
	

}
