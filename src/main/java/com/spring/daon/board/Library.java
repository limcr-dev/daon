package com.spring.daon.board;

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
@Table(name="library")
public class Library {

	@Id
	private int library_no;			// 자료 번호
	private int emp_no;				// 사원 번호(작성자)
	private String library_title;	// 자료 제목
	private String library_content;	// 자료 내용
	private String library_filename; // 자료 첨부 파일 이름
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
	private Date library_reg_date;	// 자료 등록일
	private int library_views;		// 자료 조회수
	private char library_delete;		// 자료 삭제 여부
	
	private String emp_name;
	private int dept_no;
	private int position_id;
}
