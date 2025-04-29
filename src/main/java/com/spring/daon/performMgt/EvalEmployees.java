package com.spring.daon.performMgt;

import com.spring.daon.hrMgt.Employees;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvalEmployees {
	
	private Employees employees;
//	private List<EvalSelf> evalSelf; 
//	private List<EvalPeer> evalPeer;
//	private SelfTarget selfTarge;
//	private PeerTarget peerTarget;
	
	private double self_avg;	// 자기 평가 평균
	private int self_cnt;		// 자기 평가 완료 개수
	private int self_total_cnt;	// 자기 평가 전체 개수
	private double peer_avg;	// 동료 평가 평균
	
	// 동료평가 완료 개수
	// 동료평가 전체 개수
	
	private String emp_name;
	private int emp_no;
	private int position_id;
	private int dept_no;    
}
