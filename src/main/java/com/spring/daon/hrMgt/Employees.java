package com.spring.daon.hrMgt;

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
@Table(name="employees")
public class Employees {
	// employees table
	@Id
	private int emp_no;				// 사원번호
	private String emp_name;		// 이름
	private String emp_eng_name;	// 영어 이름
	private String emp_email;		// 사내이메일
	private String emp_ext_email;	// 외부이메일
	private String emp_pwd;			// 비밀번호
	private char emp_gender;		// 성별
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date emp_birthday;		// 생년월일	
	private String emp_mobile;		// 전화번호(휴대폰)
	private String emp_ext_tel;		// 전화번호(내선번호)
	private int position_id;		// 직급 코드
	private int role_id;			// 직책 코드
	private int manager_no;			// 매니저 코드
	private int dept_no;			// 부서 코드
	private int emp_status;			// 재직 구분
	private int emp_type;			// 고용 형태
	private String emp_img;			// 프로필 이미지
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date hire_date;			// 입사일
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private Date leave_date;		// 퇴사일
	private int admin_type;			// 관리자 유형
	private int work_type_no;		// 근무 유형 코드
	private String token;			// 토큰
}
