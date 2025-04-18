package com.spring.daon.schedule;

import java.sql.Timestamp;

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
@Table(name="Schedule")
public class Schedule {
	// Schedule table
	@Id
	private int sch_no ;			// 스케쥴 번호
	private int emp_no;				// 사원번호
	private int sch_title ;			// 스케쥴 제목
	private int sch_content ;		// 스케쥴 설명
	private int sch_Mem;			// 일정 참여자?? 
	private Timestamp  sch_start_time ;	// 시작 시간
	private Timestamp  sch_end_time ;		// 종료 시간
	private String sch_all_day ;   	// 종일 여부
	private int sch_category_no ;	// 카테고리코드
}
