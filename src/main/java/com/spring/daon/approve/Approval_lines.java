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
@Table(name="approval_lines")
public class Approval_lines {
	@Id
	private int line_id;
	private int doc_no;
    private int appr_no;
    private String appr_name;
    private String appr_position;
    private int appr_dept_no;
    private int appr_order;
    private int appr_status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date appr_date;
    private String appr_comment;
}
