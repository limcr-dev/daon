import React, { useEffect, useState, useCallback } from "react";
import { Card } from "rsuite";
import { getDeptName } from "../../hrMgt/components/getEmployeeInfo";
import SalaryTrendChart from "./SalaryTrendChart";
import { request } from "../../common/components/helpers/axios_helper";
import "../css/SalaryDashboard.css"; // ✅ 고유 스타일 import

const SalaryDashboard = () => {
  const today = new Date();
  const defaultMonth = today.toISOString().slice(0, 7);
  const [salaryMonth, setSalaryMonth] = useState(defaultMonth);
  const [summaryList, setSummaryList] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);

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

  const totalPay = summaryList.reduce((sum, row) => sum + Number(row.total_pay || 0), 0);
  const totalActualPay = summaryList.reduce((sum, row) => sum + Number(row.actual_pay || 0), 0);

  const deptStats = {};
  summaryList.forEach(row => {
    const dept = getDeptName(row.dept_no);
    if (!deptStats[dept]) deptStats[dept] = { count: 0, total: 0 };
    deptStats[dept].count += 1;
    deptStats[dept].total += Number(row.total_pay || 0);
  });

  return (
    <Card
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: 20,
      }}
    >
      <h3 style={{ marginBottom: 20 }}>📊 급여 통계</h3>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 10 }}>급여 월:</label>
        <input
          type="month"
          value={salaryMonth}
          onChange={(e) => setSalaryMonth(e.target.value)}
        />
      </div>

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

      <SalaryTrendChart rawMonthlyStats={monthlyStats} selectedMonth={salaryMonth} />

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
            {Object.entries(deptStats).map(([dept, stat], idx) => (
              <tr key={idx}>
                <td>{dept}</td>
                <td>{stat.count}</td>
                <td>{stat.total.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Card>
  );
};

export default SalaryDashboard;
