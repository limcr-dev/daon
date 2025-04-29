package com.spring.daon.salary.SalarySchedule;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin
public class SalaryScheduleController {

    @Autowired
    private SalaryScheduleServiceImpl service;

    @GetMapping
    public ResponseEntity<List<SalarySchedule>> getAllSchedules() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    @PutMapping("/{salary_month}")
    public ResponseEntity<SalarySchedule> getByMonth(@PathVariable String salary_month) {
    	 SalarySchedule dto = service.findByMonth(salary_month);
    	 
    	    if (dto == null) {
    	        //  해당 월의 급여 대장이 없을 경우
    	        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204
    	    } else {
    	        //  이미 있는 경우 데이터 반환
    	        return new ResponseEntity<>(dto, HttpStatus.OK);
    	    }
    }

    @PostMapping
    public ResponseEntity<Integer> createSchedule(@RequestBody SalarySchedule dto) {
        return new ResponseEntity<>(service.insert(dto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Integer> updatePayday(@PathVariable int id, @RequestBody SalarySchedule dto) {
        dto.setId(id);
        int result = service.updatePayday(dto);
        return result > 0
            ? new ResponseEntity<>(result, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
    
    @PutMapping("/close/{id}")
    public ResponseEntity<Integer> closeSchedule(@PathVariable int id) {
        return new ResponseEntity<>(service.closeSchedule(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteSchedule(@PathVariable int id) {
        return new ResponseEntity<>(service.delete(id), HttpStatus.OK);
    }
	 // ✅ 급여 대장을 '계산 완료' 상태로 업데이트하는 API
	 // - 전체 급여 계산이 끝난 후 호출하여 마감 처리를 위한 사전 조건으로 사용
	 @PutMapping("/calculate-complete/{salaryMonth}")
	 public ResponseEntity<Integer> markScheduleAsCalculated(@PathVariable String salaryMonth) {
	     int result = service.markAsCalculated(salaryMonth);
	     return result > 0
	         ? new ResponseEntity<>(result, HttpStatus.OK)
	         : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
	 }
}
