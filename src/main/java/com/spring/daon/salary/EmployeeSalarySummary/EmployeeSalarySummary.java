package com.spring.daon.salary.EmployeeSalarySummary;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeSalarySummary {
	
	private int id;                      // 고유 ID (옵션)
    private int emp_no;                 // 사원 번호
    private String salary_month;        // 급여 월 (예: 2024-04)

    private BigDecimal base_pay;        // 기본급
    private BigDecimal total_allowance; // 수당 총합
    private BigDecimal total_deduction; // 공제 총합 (세금 제외)

    private BigDecimal income_tax;      // 소득세
    private BigDecimal local_tax;       // 지방세

    private BigDecimal total_pay;       // 총 지급액
    private BigDecimal actual_pay;      // 실수령액

}
