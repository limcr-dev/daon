package com.spring.daon.performMgt;


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
@Table(name="eval_test")


public class Test {
	
	
	// Test => eval_quescomp
	@Id
	private int eval_test_no;
	private String eval_order_num;
	private String eval_emp_type;
	private String eval_click_emp;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" , timezone = "Asia/Seoul")
	private Date eval_start_date;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" , timezone = "Asia/Seoul")
	private Date eval_end_date;
	private String registration;
	private int eval_num1;
	private int eval_num2;
	private int eval_num3;
	private int eval_num4;
	private int eval_num5;
		
}
