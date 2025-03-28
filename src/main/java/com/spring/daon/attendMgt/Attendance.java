package com.spring.daon.attendMgt;

import java.sql.Time;
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
@Table(name="attendance")
public class Attendance {
	@Id
	private String emp_no;
	private Date date ;
	private Time check_in_time;
	private Time check_out_time;
	private double work_hours;
	private int status;
}
