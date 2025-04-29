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
@Table(name="eval_goals")


public class Goal {
	
	@Id
	private double completion_rate;
	private String goal_month;
	private Long id;
    private String title;
    private String description;
    private int completed;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" , timezone = "Asia/Seoul")
    private Date created_at;
    private int emp_id;
    
		
}
