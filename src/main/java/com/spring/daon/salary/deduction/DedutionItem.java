package com.spring.daon.salary.deduction;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class DedutionItem {
	
	private int id; // 공제 항목
	
	private String name; // 공제 항목 이름
	
	private BigDecimal rate; // 공제율
	
	private BigDecimal fixed_amount; // 고정 금액
	
	@JsonProperty("is_tax")
	private boolean is_tax; // 소득세 & 지방세 항목 여부

	@JsonProperty("is_active")
	private boolean is_active; // 사용 여부
	

}
