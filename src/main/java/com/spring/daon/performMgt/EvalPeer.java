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
@Table(name="eval_peer")


public class EvalPeer {
	
	
	// EvalQuesComp => eval_quescomp
	@Id
	 private int eval_id;
    private int eval_peer_no;     // 피평가자
    private int eval_no;          // 평가자
    private String eval_type;
    private String eval_comp1;
    private int eval_comp1_score;
    private String eval_comp2;
    private int eval_comp2_score;
    private String eval_comp3;
    private int eval_comp3_score;
    private String eval_comp4;
    private int eval_comp4_score;
    private String eval_comp5;
    private int eval_comp5_score;
    private String eval_status;
    private int eval_total_score;
    private String eval_start_date;  // DB에서 default CURRENT_TIMESTAMP지만 클라이언트에서 전달할 수도 있음
    private String eval_end_date;

		
}
