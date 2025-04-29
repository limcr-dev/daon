package com.spring.daon.performMgt;


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
@Table(name="eval_goals")


public class Goal {
	
	@Id
	private double completion_rate;
	private String goal_month;
	private Long id;
    private String title;
    private String description;
    private int completed;
    private String created_at;
    private int emp_id;
    
		
}
