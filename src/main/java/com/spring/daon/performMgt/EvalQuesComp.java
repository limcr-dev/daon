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
@Table(name="eval_quescomp")


public class EvalQuesComp {
	
	
	// EvalQuesComp => eval_quescomp
	@Id
	private String eval_ques_id;			//질문 ID
	private String eval_comp_id;			//평가 역량 항목
	private String eval_comp_type;			//역량 구분(공통역량/리더십역량)
	private String eval_comp_name;			//역량명(공통역량(의사소통,책임감,시간관리....)리더십역량(비전설정,위기관리...))
	private String eval_comp_level;			//역량 수준
	private String eval_comp_description;	//역량 설명
	private String eval_ques_text;			//질문 내용

		
}
