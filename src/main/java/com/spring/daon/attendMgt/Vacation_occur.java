package com.spring.daon.attendMgt;

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
@Table(name="vacation_occur")
public class Vacation_occur {
	// vacation_occur table
	@Id
	private int vac_no;		// 휴가발생 번호
	private int emp_no;		
	private int earned_days;		// 발생 일수
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Date expire_date;		// 유효기간
	private String occur_reason;			// 발생사유
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date create_at;		// 생성 날짜
}
