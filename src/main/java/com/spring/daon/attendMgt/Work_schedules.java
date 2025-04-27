package com.spring.daon.attendMgt;

import java.sql.Time;
import java.sql.Date;
import java.time.LocalTime;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;

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
@Table(name="work_schedules")
public class Work_schedules {
	// work_schedules table
	@Id
	private int work_type_no;		// 근무 유형 코드
	private String type_name;		// 유형 이름(맘대로 지정 가능하게)
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	private Time start_time;		// 근무 시작 시간
	
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
	private Time end_time;			// 근무 종료 시간
	
	private Time total_time;		// 일일 근무시간
	
	
	private int emp_no;				// 사원번호
	private String emp_name;		// 이름
	private int position_id;		// 직급 코드
	private int dept_no;			// 부서 코드
}
