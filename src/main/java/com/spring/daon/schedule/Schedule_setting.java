package com.spring.daon.schedule;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
@Entity   
@Table(name="schedule_setting")
public class Schedule_setting {
	// Schedule_setting table
	@Id
	private int c_sch_no ;			// 카테고리 코드
	private int emp_no;				// 사원번호
	private String c_sch_title ;	// 카테고리 제목
	private String c_sch_color;		// 카테고리 색
	private char c_sch_type ;	// 카테고리 타입 
}
