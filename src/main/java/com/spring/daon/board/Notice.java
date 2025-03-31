package com.spring.daon.board;

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
@Table(name="notice")
public class Notice {

	@Id
	private int notice_no;			// 공지사항 번호
	private int emp_no;				// 사원 번호(작성자)
	private String notice_title;	// 공지사항 제목
	private String notice_content;	// 공지사항 내용
	private Date notice_reg_date;	// 공지사항 등록일
	private int notice_views;		// 조회수
	private char notice_delete;		// 삭제 여부
}
