package com.spring.daon.hrMgt.position;

import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Data
public class Position {
    private int position_id;           // 직급 ID
    private String position_name;      // 직급명
    private BigDecimal base_salary;    // 기본급
    private Timestamp created_at;      // 생성일
}
