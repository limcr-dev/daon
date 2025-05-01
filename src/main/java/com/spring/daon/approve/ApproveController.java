package com.spring.daon.approve;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/approve")
@CrossOrigin
public class ApproveController {

    @Autowired
    ApproveServiceImpl service;

    // 작성자 - 문서 상태별 리스트
    @GetMapping("/documents/{status}/{emp_no}")
    public ResponseEntity<?> getDocList(@PathVariable int status, @PathVariable int emp_no) {
        return new ResponseEntity<>(service.getDocList(status, emp_no), HttpStatus.OK);
    }

    // 작성자 - 문서 전체 리스트
    @GetMapping("/documents/all/{emp_no}")
    public ResponseEntity<?> getAllDocList(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.getAllDocList(emp_no), HttpStatus.OK);
    }

    // 결재자 - 상태별 문서
    @GetMapping("/approver/{status}/{emp_no}")
    public ResponseEntity<?> getApproverDocList(@PathVariable int status, @PathVariable int emp_no) {
        return new ResponseEntity<>(service.getApproverDocList(status, emp_no), HttpStatus.OK);
    }

    // 결재자 - 전체 문서
    @GetMapping("/approver/all/{emp_no}")
    public ResponseEntity<?> getAllApproverDocList(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.getAllApproverDocList(emp_no), HttpStatus.OK);
    }

    // 결재자 - 결재 정보
    @GetMapping("/approverInfo/{emp_no}")
    public ResponseEntity<?> getApproverInfo(@PathVariable int emp_no) {
        return new ResponseEntity<>(service.getApproverInfo(emp_no), HttpStatus.OK);
    }

    // 전자결재 제출
    @PostMapping("/submit/{form_no}")
    public ResponseEntity<?> insertDocument(@PathVariable int form_no, @RequestBody ApprovalRequest appr_req) {
        try {
            return new ResponseEntity<>(service.insertDocument(form_no, appr_req), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("전자결재 제출 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전자결재 상세 조회
    @GetMapping("/detail/{form_no}/{doc_no}")
    public ResponseEntity<?> getApproveDetail(@PathVariable int form_no, @PathVariable int doc_no) {
        return new ResponseEntity<>(service.getApproveDetail(form_no, doc_no), HttpStatus.OK);
    }

    // 전자결재 상신 취소
    @PostMapping("/cancel/{doc_no}")
    public ResponseEntity<?> cancelDocument(@PathVariable int doc_no) {
        try {
            return new ResponseEntity<>(service.cancelDocument(doc_no), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("상신취소 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전자결재 반려
    @PostMapping("/reject/{doc_no}")
    public ResponseEntity<?> rejectApprove(@PathVariable int doc_no, @RequestBody Approval_lines apprLine) {
        try {
            return new ResponseEntity<>(service.rejectApprove(doc_no, apprLine), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("반려 처리 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전자결재 승인
    @PostMapping("/sign/{doc_no}")
    public ResponseEntity<?> signApprove(@PathVariable int doc_no, @RequestBody Approval_lines apprLine) {
        try {
            return new ResponseEntity<>(service.signApprove(doc_no, apprLine), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("승인 처리 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 전자결재 수정
    @PostMapping("/update/{form_no}")
    public ResponseEntity<?> updateApprove(@PathVariable int form_no, @RequestBody ApprovalRequest appr_req) {
        try {
            return new ResponseEntity<>(service.updateApprove(form_no, appr_req), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("전자결재 수정 실패: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
