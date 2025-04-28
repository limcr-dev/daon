import React, { useEffect, useState, useCallback } from "react";
import { Card, Pagination } from "rsuite";
import { getDeptName } from "../../hrMgt/components/getEmployeeInfo";
import SalaryTrendChart from "./SalaryTrendChart";
import { request } from "../../common/components/helpers/axios_helper";
import "../css/SalaryDashboard.css";

const SalaryDashboard = () => {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);

  // 상태 정의
  const [salaryMonth, setSalaryMonth] = useState(defaultMonth);
  const [summaryList, setSummaryList] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  // 급여 요약 리스트 가져오기
  const fetchSummaryList = useCallback(() => {
    request("get", `/api/salaries/summary?salaryMonth=${salaryMonth}`)
      .then(res => setSummaryList(res.data))
      .catch(err => {
        console.error("급여 요약 목록 조회 실패:", err);
        alert("급여 요약 목록을 불러오지 못했습니다.");
      });
  }, [salaryMonth]);

  useEffect(() => {
    fetchSummaryList();
  }, [fetchSummaryList]);

  // 월별 통계 가져오기
  const fetchMonthlyStats = useCallback(() => {
    request("get", "/api/dashboard/monthly-total-pay")
      .then(res => setMonthlyStats(res.data))
      .catch(err => {
        console.error("월별 급여 통계 조회 실패:", err);
        alert("월별 통계를 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchMonthlyStats();
  }, [fetchMonthlyStats]);

  // 통계 계산
  const totalPay = summaryList.reduce((sum, row) => sum + Number(row.total_pay || 0), 0);
  const totalActualPay = summaryList.reduce((sum, row) => sum + Number(row.actual_pay || 0), 0);

  // 부서별 통계 계산
  const deptStats = {};
  summaryList.forEach(row => {
    const dept = getDeptName(row.dept_no);
    if (!deptStats[dept]) deptStats[dept] = { count: 0, total: 0 };
    deptStats[dept].count += 1;
    deptStats[dept].total += Number(row.total_pay || 0);
  });

  const deptStatsArray = Object.entries(deptStats);
  const paginatedData = deptStatsArray.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card style={{ borderRadius: 15, boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: 20 }}>
      <h3 style={{ marginBottom: 20 }}>📊 급여 통계</h3>

      {/* 급여 월 선택 */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 10 }}>급여 월:</label>
        <input
          type="month"
          value={salaryMonth}
          onChange={(e) => {
            setSalaryMonth(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* 총 지급액 / 사원 수 / 실수령액 */}
      <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
        <Card style={{ flex: 1, padding: 16 }}>
          <h5>총 지급액</h5>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            {totalPay.toLocaleString()} 원
          </p>
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <h5>총 사원 수</h5>
          <p style={{ fontSize: 18, fontWeight: "bold" }}>
            {summaryList.length.toLocaleString()} 명
          </p>
        </Card>
        <Card style={{ flex: 1, padding: 16 }}>
          <h5>총 실수령액</h5>
          <p style={{ fontSize: 18, fontWeight: "bold", color: "green" }}>
            {totalActualPay.toLocaleString()} 원
          </p>
        </Card>
      </div>

      {/* 월별 급여 트렌드 차트 */}
      <SalaryTrendChart rawMonthlyStats={monthlyStats} selectedMonth={salaryMonth} />

      {/* 부서별 총 지급액 및 사원 수 (페이징) */}
      <Card style={{ padding: 20, borderRadius: 15, marginTop: 40 }}>
        <h5 style={{ marginBottom: 20 }}>📊 부서별 총 지급액 및 사원 수</h5>

        <table className="salary-dashboard-table">
          <thead>
            <tr>
              <th>부서명</th>
              <th>사원 수</th>
              <th>총 지급액</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map(([dept, stat], idx) => (
              <tr key={idx}>
                <td>{dept}</td>
                <td>{stat.count}</td>
                <td>{stat.total.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <Pagination
            total={deptStatsArray.length}
            limit={pageSize}
            activePage={page}
            onChangePage={setPage}
          />
        </div>
      </Card>
    </Card>
  );
};

export default SalaryDashboard;
