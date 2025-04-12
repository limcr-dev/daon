package com.spring.daon.schedule;

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
@Table(name="Schedule_members")
public class Schedule_members {
	// Schedule_members table
	@Id
	private int emp_no;			// 사원번호
	private int sch_no ;		// 스케쥴번호
}
