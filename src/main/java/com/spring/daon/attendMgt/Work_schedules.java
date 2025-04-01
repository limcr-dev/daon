package com.spring.daon.attendMgt;

import java.sql.Time;
import java.sql.Date;

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
@Table(name="work_schedules")
public class Work_schedules {
	// work_schedules table
	@Id
	private int work_type_no;		// 근무 유형 코드
	private String type_name;		// 유형 이름(맘대로 지정 가능하게)
	private Time start_time;		// 근무 시작 시간
	private Time end_time;			// 근무 종료 시간
	private Time total_time;		// 일일 근무시간
}
