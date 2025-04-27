import React, { useEffect, useState, useCallback } from "react";
import { Container, Content, Card, Button, Input } from "rsuite"; // ✅ Input 추가
import Leftbar from "../../../common/pages/Leftbar";
import SalaryLeftbar from "../SalaryLeftbar";
import SalaryDetailModal from "./SalaryDetailModal";
import { getPositionName, getDeptName, getEmpStatus } from "../../../hrMgt/components/getEmployeeInfo";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { request } from "../../../common/components/helpers/axios_helper";
import Header from '../../../common/pages/Header';
import Paging from "../../../common/components/paging.js"; // ✅ 페이징 추가
import "../../css/EmployeeSalaryList.css";

const EmployeeSalaryList = () => {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);

  const [salaryMonth, setSalaryMonth] = useState(defaultMonth);
  const [salaryList, setSalaryList] = useState([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEmpNo, setSelectedEmpNo] = useState(null);
  const [page, setPage] = useState(1);    // ✅ 현재 페이지
  const size = 14;           // ✅ 한 페이지당 보여줄 개수
  const [searchKeyword, setSearchKeyword] = useState(""); // ✅ 검색어

  const fetchSalaryList = useCallback(() => {
    request("get", `/api/salaries/summary?salaryMonth=${salaryMonth}`)
      .then((res) => setSalaryList(res.data))
      .catch((err) => {
        console.error("급여 요약 조회 실패:", err);
        alert("급여 요약 목록을 불러오지 못했습니다.");
      });
  }, [salaryMonth]);

  useEffect(() => {
    fetchSalaryList();
  }, [fetchSalaryList]);

  const openDetail = (emp_no) => {
    setSelectedEmpNo(emp_no);
    setDetailModalOpen(true);
  };

  const handleExportToExcel = () => {
    const excelData = filteredList.map(item => ({
      사번: item.emp_no,
      이름: item.emp_name,
      부서: getDeptName(item.dept_no),
      직급: getPositionName(item.position_id),
      재직상태: getEmpStatus(item.emp_status),
      입사일: item.hire_date,
      기본급: item.base_pay?.toLocaleString(),
      총수당: item.total_allowance?.toLocaleString(),
      총공제: item.total_deduction?.toLocaleString(),
      실수령액: item.actual_pay?.toLocaleString()
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "급여요약");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(file, `급여요약_${salaryMonth}.xlsx`);
  };

  // ✅ 이름으로 검색
  const filteredList = salaryList.filter(item =>
    item.emp_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // ✅ 현재 페이지 데이터 slice
  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1); // 검색어 바뀌면 페이지 초기화
  };

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        <SalaryLeftbar />
        <Content>
          <Header />
          <div style={{ marginTop: "50px" }}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: 20,
              }}
            >
              <h3 style={{ marginBottom: 20 }}>급여 요약 목록</h3>

              {/* ✅ 검색 + 월 선택 + 엑셀 다운로드 */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <label style={{ alignSelf: "center" }}>급여 월:</label>
                  <input
                    type="month"
                    value={salaryMonth}
                    onChange={(e) => setSalaryMonth(e.target.value)}
                  />
                  <Button size="sm" appearance="ghost" onClick={handleExportToExcel}>
                    📥 엑셀 다운로드
                  </Button>
                </div>
                <Input
                  placeholder="이름 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  style={{ width: 250 }}
                />
              </div>

              {/* ✅ 테이블 */}
              <table className="salary-summary-table">
                <thead>
                  <tr>
                    <th>사번</th>
                    <th>이름</th>
                    <th>부서</th>
                    <th>직급</th>
                    <th>재직 상태</th>
                    <th>입사일</th>
                    <th>기본급</th>
                    <th>총 수당</th>
                    <th>총 공제</th>
                    <th>실수령액</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedList.map((row, idx) => (
                    <tr key={idx} onClick={() => openDetail(row.emp_no)} style={{ cursor: 'pointer' }}>
                      <td>{row.emp_no}</td>
                      <td>{row.emp_name}</td>
                      <td>{getDeptName(row.dept_no)}</td>
                      <td>{getPositionName(row.position_id)}</td>
                      <td>{getEmpStatus(row.emp_status)}</td>
                      <td>{row.hire_date}</td>
                      <td style={{ textAlign: 'right' }}>{row.base_pay?.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{row.total_allowance?.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{row.total_deduction?.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{row.actual_pay?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* ✅ 페이징 */}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <Paging
                  paging={{
                    page: page,
                    size: size,
                    totalCount: filteredList.length
                  }}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </Card>
          </div>
          {/* ✅ 상세 모달 */}
          <SalaryDetailModal
            open={detailModalOpen}
            onClose={() => setDetailModalOpen(false)}
            empNo={selectedEmpNo}
            salaryMonth={salaryMonth}
          />
        </Content>
      </Container>
    </Container>
  );
};

export default EmployeeSalaryList;
