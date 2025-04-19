import React, { useEffect, useState } from "react";
import { Modal, Table, Button } from "rsuite";
import { generateSalaryPdf } from "./generateSalaryPdf";


const { Column, HeaderCell, Cell } = Table;

const SalaryDetailModal = ({ open, onClose, empNo, salaryMonth }) => {
  const [salaryDetails, setSalaryDetails] = useState(null);

  // ✅ 상세 내역 불러오기
  useEffect(() => {
    if (open && empNo && salaryMonth) {
      fetch(`http://localhost:8081/api/salaries/detail?empNo=${empNo}&salaryMonth=${salaryMonth}`)
        .then(res => res.json())
        .then(data => setSalaryDetails(data));
    }
  }, [open, empNo, salaryMonth]);

  if (!salaryDetails) return null;

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <h4>급여 상세 보기 - {salaryDetails.emp_name} ({salaryMonth})</h4>
      </Modal.Header>

      <Modal.Body>
        {/* 기본 정보 */}
        <div style={{ marginBottom: 16 }}>
          <p><strong>부서:</strong> {salaryDetails.dept_name}</p>
          <p><strong>직급:</strong> {salaryDetails.position_name}</p>
          <p><strong>기본급:</strong> {salaryDetails.base_pay.toLocaleString()} 원</p>
        </div>

        {/* 수당 항목 */}
        <h5>수당 항목</h5>
        <Table data={salaryDetails.allowances} height={200}>
          <Column flexGrow={1}>
            <HeaderCell>항목명</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1} align="right">
            <HeaderCell>금액</HeaderCell>
            <Cell>{row => `${row.amount.toLocaleString()} 원`}</Cell>
          </Column>
        </Table>

        {/* 공제 항목 */}
        <h5 style={{ marginTop: 20 }}>공제 항목</h5>
        <Table data={salaryDetails.deductions} height={200}>
          <Column flexGrow={1}>
            <HeaderCell>항목명</HeaderCell>
            <Cell dataKey="name" />
          </Column>
          <Column flexGrow={1} align="right">
            <HeaderCell>금액</HeaderCell>
            <Cell>{row => `${row.amount.toLocaleString()} 원`}</Cell>
          </Column>
        </Table>

        {/* 총계 */}
        <div style={{ marginTop: 20 }}>
          <p><strong>총 수당:</strong> {salaryDetails.total_allowance.toLocaleString()} 원</p>
          <p><strong>총 공제:</strong> {salaryDetails.total_deduction.toLocaleString()} 원</p>
          <p><strong>실수령액:</strong> <span style={{ color: "green" }}>{salaryDetails.actual_pay.toLocaleString()} 원</span></p>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {/* <Button appearance="primary" onClick={() => generateSalaryPdf(salaryDetails, salaryMonth)}>
          PDF 다운로드
        </Button> */}
        <Button appearance="subtle" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SalaryDetailModal;
