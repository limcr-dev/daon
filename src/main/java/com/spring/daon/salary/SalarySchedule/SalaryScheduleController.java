package com.spring.daon.salary.SalarySchedule;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@CrossOrigin
public class SalaryScheduleController {

    @Autowired
    private SalaryScheduleServiceImpl service;

    //  전체 대장 목록 조회
    @GetMapping
    public ResponseEntity<List<SalarySchedule>> getAllSchedules() {
        return new ResponseEntity<>(service.findAll(), HttpStatus.OK);
    }

    //  특정 급여월 단건 조회 (GET으로 변경, 경로 명확히 분리)
    @GetMapping("/month/{salaryMonth}")
    public ResponseEntity<SalarySchedule> getByMonth(@PathVariable String salaryMonth) {
        SalarySchedule dto = service.findByMonth(salaryMonth);
        return dto == null
            ? new ResponseEntity<>(HttpStatus.NO_CONTENT)
            : new ResponseEntity<>(dto, HttpStatus.OK);
    }

    //  급여 대장 생성
    @PostMapping
    public ResponseEntity<Integer> createSchedule(@RequestBody SalarySchedule dto) {
        return new ResponseEntity<>(service.insert(dto), HttpStatus.CREATED);
    }

    //  지급일 수정 (ID 기준)
    @PutMapping("/{id}")
    public ResponseEntity<Integer> updatePayday(@PathVariable int id, @RequestBody SalarySchedule dto) {
        dto.setId(id);
        int result = service.updatePayday(dto);
        return result > 0
            ? new ResponseEntity<>(result, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    //  마감 처리
    @PutMapping("/close/{id}")
    public ResponseEntity<Integer> closeSchedule(@PathVariable int id) {
        return new ResponseEntity<>(service.closeSchedule(id), HttpStatus.OK);
    }

    //  삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteSchedule(@PathVariable int id) {
        return new ResponseEntity<>(service.delete(id), HttpStatus.OK);
    }

    // '계산 완료' 상태로 마킹 (전체 급여 계산 후)
    @PutMapping("/calculate-complete/{salaryMonth}")
    public ResponseEntity<Integer> markScheduleAsCalculated(@PathVariable String salaryMonth) {
        int result = service.markAsCalculated(salaryMonth);
        return result > 0
            ? new ResponseEntity<>(result, HttpStatus.OK)
            : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
