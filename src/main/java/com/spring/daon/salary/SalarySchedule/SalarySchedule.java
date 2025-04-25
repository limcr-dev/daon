package com.spring.daon.salary.SalarySchedule;

import java.sql.Timestamp;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;

import lombok.Data;

@Data
public class SalarySchedule {
	private int id;                // 고유 ID
	
    private String salary_month;  // 급여월 (예: 2025-04)
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date payday;          // 지급일 (선택)
    
    @JsonProperty("is_closed")
    private boolean is_closed;    // 마감 여부
    
    @JsonProperty("is_calculated")  // ✅ 요거 추가!
    private boolean is_calculated;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp created_at; // 생성일시

}
