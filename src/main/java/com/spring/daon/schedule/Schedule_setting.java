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
@Table(name="Schedule_setting")
public class Schedule_setting {
	// Schedule_setting table
	@Id
	private int emp_no;					// 사원번호
	private int sch_category_no ;		// 카테고리 코드
	private String sch_category_title ;	// 카테고리 제목
	private String sch_category_color;	// 카테고리 색
	private boolean full_schedule ;	// 전사 일정 카테고리 여부
}
