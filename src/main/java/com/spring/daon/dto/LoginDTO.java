package com.spring.daon.dto;

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
@Table(name="employees")
public class LoginDTO {
	
	@Id
	private String emp_no;
	private String emp_name;
	private String emp_eng_name;
	private String emp_email;
	private String emp_ext_email;
	private String emp_pwd;
	private String emp_gender;
	private String emp_mobile;
	private String emp_ext_tel;
	private String emp_position;
	private String emp_role;
	private String dept_no;
	private String emp_status;
	private String emp_type;
	private String emp_img;
	private String hire_date;
	private String leave_date;
	private String admin_type;
	
}
