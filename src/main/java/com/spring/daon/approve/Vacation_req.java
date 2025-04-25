package com.spring.daon.approve;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;

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
@Table(name="vacation_req")
public class Vacation_req {
	@Id
	private int doc_no;			// 문서 번호
    private int emp_no;			// 기안자 사번
    private String title;		// 휴가 제목
    private String content;		// 휴가 사유
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date start_date;	// 휴가 시작일
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date end_date;		// 휴가 종료일
    private float used_days;	// 신청일
    private int vacation_type;	// 휴가 타입
    
    private String emp_name;	// 이름
	private String dept_name;	// 부서명
	private int position_id;	// 직급
}
