package com.spring.daon.attendMgt;

import java.sql.Time;
import java.time.LocalDate;
import java.sql.Date;

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
@Table(name="attendance")
public class Attendance {
	// attendance table
	@Id
	private int emp_no;			// 사원번호
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate date;			// 날짜
	private Time check_in_time;	// 출근 시간
	private Time check_out_time;// 퇴근 시간
	private double work_hours;	// 총 근무 시간
	private int normal;			// 정상
	private int late;			// 지각
	private int early_leave;	// 조퇴
	private int out_status;		// 외출
	private int absent;			// 결근
	private String message;   	// 수정 메시지
	private int modifier;		// 수정자
	private Time modifyTime;	// 수정시간
	private String emp_name;		// 이름
	private String emp_img;			// 프로필 이미지
}
