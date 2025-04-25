package com.spring.daon.salary.DepartmentSalaryStats;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class DepartmentSalaryStats {
    private int dept_no;
    private String dept_name;
    private int employee_count; // 부서별 사원 수
    private BigDecimal total_actual_pay; // 부서별 실지급액 총합
}