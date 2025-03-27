package com.spring.daon.hrMgt;

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
public class Employees {
	// employees table
	@Id
	private int emp_no;
	private String emp_name;
	private String emp_eng_name;
	private String emp_email;
	private String emp_ext_email;
	private String emp_pwd;
	private char emp_gender;
	private Date emp_birthday;
	private String emp_mobile;
	private String emp_ext_tel;
	private int position_id;
	private int manager_no;
	private int dept_no;
	private int emp_status;
	private int emp_type;
	private String emp_img;
	private Date hire_date;
	private Date leave_date;
	private String admin_type;
	
}
