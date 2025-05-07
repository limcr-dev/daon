package com.spring.daon.approve;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApproveServiceImpl {
    
    @Autowired
    ApproveMapper apprMapper;

    @Transactional(readOnly = true)
    public List<Documents> getDocList(int status, int emp_no) {
        Map<String, Object> map = new HashMap<>();
        map.put("status", status);
        map.put("emp_no", emp_no);
        return apprMapper.getDocList(map);
    }

    @Transactional(readOnly = true)
    public List<Documents> getAllDocList(int emp_no) {
        return apprMapper.getAllDocList(emp_no);
    }

    @Transactional(readOnly = true)
    public List<Documents> getApproverDocList(int status, int emp_no) {
        Map<String, Object> map = new HashMap<>();
        map.put("status", status);
        map.put("emp_no", emp_no);
        return apprMapper.getApproverDocList(map);
    }

    @Transactional(readOnly = true)
    public List<Documents> getAllApproverDocList(int emp_no) {
        return apprMapper.getAllApproverDocList(emp_no);
    }

    @Transactional(readOnly = true)
    public List<Documents> getApproverInfo(int emp_no) {
        return apprMapper.getApproverInfo(emp_no);
    }

    // 결재 문서 등록
    @Transactional
    public int insertDocument(int form_no, ApprovalRequest appr_req) {
        Documents document = appr_req.getDocument();
        int result = apprMapper.insertDocument(document);

        int doc_no = apprMapper.getDocNo(document.getEmp_no());
        List<Approval_lines> lineList = appr_req.getLineList();

        int result2 = 0;
        for (int i = 0; i < lineList.size(); i++) {
            Approval_lines line = lineList.get(i);
            line.setAppr_order(i);
            line.setDoc_no(doc_no);
            if (i == 0) {
                line.setAppr_date(new Date(System.currentTimeMillis()));
            }
            result2 += apprMapper.insertApprovalLines(line);
        }

        if (result2 != lineList.size()) {
            throw new RuntimeException("결재선 저장 실패");
        }

        int result3 = 0;
        switch (form_no) {
            case 1:
                Vacation_req vacation_req = appr_req.getVacation_req();
                vacation_req.setDoc_no(doc_no);
                result3 = apprMapper.insertVacationReq(vacation_req);
                break;
            case 5:
                Work_report work_report = appr_req.getWork_report();
                work_report.setDoc_no(doc_no);
                result3 = apprMapper.insertWorkReport(work_report);
                break;
            default:
                result3 = 1;
        }

        if (result == 0 || result3 == 0) {
            throw new RuntimeException("문서 또는 양식 저장 실패");
        }

        return 1;
    }

    // 전자결재 상세 조회
    @Transactional(readOnly = true)
    public ApprovalRequest getApproveDetail(int form_no, int doc_no) {
        ApprovalRequest apprReq = new ApprovalRequest();
        apprReq.setDocument(apprMapper.getDocument(doc_no));
        apprReq.setLineList(apprMapper.getApprLines(doc_no));

        switch (form_no) {
            case 1:
                apprReq.setVacation_req(apprMapper.getVacationReq(doc_no));
                break;
            case 5:
                apprReq.setWork_report(apprMapper.getWorkReport(doc_no));
                break;
        }

        return apprReq;
    }

    // 상신 취소
 // 상신 취소
    @Transactional
    public int cancelDocument(int doc_no) {
        Documents doc = apprMapper.getDocument(doc_no);

        // 1. 문서 상태 확인 (진행중 상태만 취소 가능)
        if (doc == null || doc.getDoc_status() != 2) {
            throw new RuntimeException("진행 중인 문서만 상신 취소할 수 있습니다.");
        }

        // 2. 이미 결재되었거나 반려된 결재선이 있는지 확인
        int processedLineCount = apprMapper.countApprovedOrRejectedLines(doc_no);
        if (processedLineCount > 0) {
            throw new RuntimeException("결재가 진행된 문서는 취소할 수 없습니다.");
        }

        // 3. 취소 처리
        int result = apprMapper.cancelDocument(doc_no);
        if (result == 0) throw new RuntimeException("상신 취소 실패");

        return result;
    }


    // 반려 처리
    @Transactional
    public int rejectApprove(int doc_no, Approval_lines appr_line) {
        if (doc_no != appr_line.getDoc_no()) {
            appr_line.setDoc_no(doc_no);
        }

        int result = apprMapper.rejectApprove(appr_line);
        if (result != 1) throw new RuntimeException("반려 처리 실패");

        result = apprMapper.rejectDocument(doc_no);
        if (result != 1) throw new RuntimeException("문서 상태 반려 처리 실패");

        return result;
    }

    // 승인 처리
    @Transactional
    public int signApprove(int doc_no, Approval_lines appr_line) {
        if (doc_no != appr_line.getDoc_no()) {
            appr_line.setDoc_no(doc_no);
        }

        appr_line.setAppr_status(3);
        int result = apprMapper.signApprove(appr_line);
        if (result != 1) throw new RuntimeException("승인 처리 실패");

        int apprCnt = apprMapper.apprCnt(doc_no);

        if (apprCnt == appr_line.getAppr_order()) {
            result = apprMapper.signDocument(doc_no);
            if (result != 1) throw new RuntimeException("문서 최종 승인 실패");
        } else {
            result = apprMapper.updateApprStatus(appr_line);
            if (result != 1) throw new RuntimeException("다음 결재자 상태 갱신 실패");
        }

        return result;
    }

    // 수정 처리
    @Transactional
    public int updateApprove(int form_no, ApprovalRequest appr_req) {
        Documents document = appr_req.getDocument();
        int result = apprMapper.updateDocument(document);
        if (result == 0) throw new RuntimeException("문서 수정 실패");

        int doc_no = document.getDoc_no();
        apprMapper.deleteApprLines(doc_no);

        List<Approval_lines> lineList = appr_req.getLineList();
        int result2 = 0;
        for (int i = 0; i < lineList.size(); i++) {
            Approval_lines line = lineList.get(i);
            line.setAppr_order(i);
            line.setDoc_no(doc_no);
            if (i == 0) {
                line.setAppr_date(new Date(System.currentTimeMillis()));
            }
            result2 += apprMapper.insertApprovalLines(line);
        }

        if (result2 != lineList.size()) {
            throw new RuntimeException("결재선 수정 실패");
        }

        int result3 = 1;
        
        if (form_no == 1) {
            Vacation_req vacation_req = appr_req.getVacation_req();
            vacation_req.setDoc_no(doc_no);
            result3 = apprMapper.updateVacationReq(vacation_req);
            if (result3 == 0) throw new RuntimeException("휴가신청서 수정 실패");
        } else if (form_no == 5) {
            Work_report work_report = appr_req.getWork_report();
            work_report.setDoc_no(doc_no);
            result3 = apprMapper.updateWorkReport(work_report);
            if (result3 == 0) throw new RuntimeException("업무보고서 수정 실패");
        }

        return 1;
    }
}
