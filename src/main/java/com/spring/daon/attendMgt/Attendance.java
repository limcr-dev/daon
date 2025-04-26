package com.spring.daon.attendMgt;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.daon.hrMgt.Employees;
import com.spring.daon.orgChart.Department;

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
@Table(name="attendance")
public class Attendance {
	// attendance table
	@Id
	private int attendance_no;	// 근태번호
	private int emp_no;			// 사원번호
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;			// 날짜
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	private Time check_in_time;	// 출근 시간
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
	private Time check_out_time;// 퇴근 시간
	private double work_hours;	// 총 근무 시간
	private int normal;			// 정상
	private int late;			// 지각
	private int early_leave;	// 조퇴
	private int out_status;		// 외출
	private int absent;			// 결근
	private String message;   	// 수정 메시지
	private int modifier;		// 수정자
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime  modifyTime;	// 수정시간
	private int vacation;		// 휴가
	
	private String emp_name;		// 이름
	private String emp_img;			// 프로필 이미지
	private String dept_name;		// 부서명
	private int position_id;
	
	private int work_type_no;		// 근무 유형 코드
	private String type_name;		// 유형 이름(맘대로 지정 가능하게)
	
	@Transient
    private Department department;
	
	@Transient
    private Employees employee;
	
}
