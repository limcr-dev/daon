package com.spring.daon.login.dto;


import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class SignUpDTO {
	
	private String emp_name;
	private String emp_eng_name;
	private String emp_email;
	private String emp_ext_email;
	private String emp_pwd;
	private char   emp_gender;
	private Date emp_birthday;
	private String emp_mobile;
	private String emp_ext_tel;
	private int position_id;
	private int role_id;
	private int manager_no;
	private int dept_no;
	private int emp_status;
	private int emp_type;
	private Date hire_date;
	private int admin_type;
	private int work_type_no;
	private String token;
	
}
