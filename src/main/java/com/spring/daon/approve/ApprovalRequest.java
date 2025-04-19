package com.spring.daon.approve;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApprovalRequest {
	// dto를 모아둔 클래스
	
	private Documents document;
	private List<Approval_lines> lineList;
	private Vacation_req vacation_req;
	private Work_report work_report;
	
}
