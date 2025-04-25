package com.spring.daon.salary;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class SalaryDetail {
    private int emp_no;
    private String emp_name;
    private String dept_name;
    private String position_name;
    private BigDecimal base_pay;
    private BigDecimal total_allowance;
    private BigDecimal total_deduction;
    private BigDecimal income_tax;
    private BigDecimal local_tax;
    private BigDecimal actual_pay;

    private List<SalaryItem> allowances;  // 수당 리스트
    private List<SalaryItem> deductions;  // 공제 리스트
}
