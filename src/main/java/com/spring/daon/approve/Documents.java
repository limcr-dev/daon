package com.spring.daon.approve;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;

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
@Table(name="documents")
public class Documents {
	@Id
	private int doc_no;
    private int doc_form;
    private int emp_no;
    private int dept_no;
    private String doc_title;
    private String doc_filename;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date doc_reg_date;
    private int doc_status;
    private char doc_urgent;
    
    private String emp_name;
    private int position_id;
    
}
