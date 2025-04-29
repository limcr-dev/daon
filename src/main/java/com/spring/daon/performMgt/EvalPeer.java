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
@Table(name="eval_peer")


public class EvalPeer {
	
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" , timezone = "Asia/Seoul")
    private Date eval_test_date;
    private String eval_order_num;
    
    // order번호 별 점수
    private double avg1;	// 역량1 점수
    private double avg2;	// 역량2 점수	
    private double avg3;	// 역량3 점수
    private double avg4;	// 역량4 점수
    private double avg5;	// 역량5 점수
    private double avg_total;	// 평균 점수
    
		
}
