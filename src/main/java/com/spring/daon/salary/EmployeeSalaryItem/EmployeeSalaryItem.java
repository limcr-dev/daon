package com.spring.daon.salary.EmployeeSalaryItem;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class EmployeeSalaryItem {

	private int id; // 고유 ID 
	 
	private int emp_no; // 사원 번호
	
	private String item_type; // 항목 타입
	
 	private int item_id; // 수당&공제 항목 ID(FK)
	
	private String item_name; // 항목 이름
	
	private BigDecimal amount; // 금액
	
	private String salary_month; // 급여 해당월
}
