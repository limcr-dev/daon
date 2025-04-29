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
@Table(name="peer_target")


public class PeerTarget {

	@Id
	private String peer_test_status;
    private int eval_peer_no;     // 피평가자
    private int eval_emp_no;          // 평가자
    private String eval_order_num;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd" , timezone = "Asia/Seoul")
    private Date created_at;
    
    
    private int peer_cnt;  // 내가 진행한 동료평가 "제출완료"
    private int peer_total_cnt; // 내가 진행해야 할 동료평가
    
    private String emp_name;
}
