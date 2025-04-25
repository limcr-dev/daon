package com.spring.daon.salary.DepartmentSalaryStats;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class MonthlySalaryStat {
    private String salary_month;
    private BigDecimal total_actual_pay;
}