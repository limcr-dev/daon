package com.spring.daon.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class ErrorDTO {
	
	private String message;
	
//	public ErrorDTO() {}
//	public ErrorDTO(String message) {
//		this.message = message;
//	}
//		
//	public String getMessage() {
//		return message;
//	}
//	
//	public void setMessage(String message) {
//		this.message = message;
//	}

}
