package com.spring.daon.salary;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalaryItem {
    private String name;       // 항목명 (수당 or 공제)
    private BigDecimal amount; // 금액
}