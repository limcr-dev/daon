package com.spring.daon.performMgt;


import java.sql.Date;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.daon.attendMgt.Attendance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvalAttand {
	
	private Attendance attendance;
	
	
	private double attand_avg;   // 평균
	private double mothly_avg;
	private int avg_total;
	// 동료평가 완료 개수
	// 동료평가 전체 개수
	private int emp_no;			// 사원번호
	private int late;			// 지각
	private int early_leave;	// 조퇴
	private int absent;			// 결근
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;	
	private String eval_test_date;      // 월
	
}
