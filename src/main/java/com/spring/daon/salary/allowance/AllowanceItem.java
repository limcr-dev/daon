package com.spring.daon.salary.allowance;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class AllowanceItem {
	
	private int id; // 수당 항목
	
	private String name; // 수당 항목 이름
	
	private BigDecimal fixed_amount; // 고정 금액
	
	@JsonProperty("is_fixed")
	private boolean is_fixed; // 고정 수당 여부
	
	@JsonProperty("is_tax_free")
	private boolean is_tax_free; // 비과세 여부
	
	private String tax_free_type; // 비과세 유형
	
	private BigDecimal tax_free_limit; // 비과세 한도
	
	@JsonProperty("is_active")
	private boolean is_active; // 사용 여부
	

}
