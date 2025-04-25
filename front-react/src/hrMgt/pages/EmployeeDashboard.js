import React, { useEffect, useState, useCallback } from "react";
import { Card } from "rsuite";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { request } from "../../common/components/helpers/axios_helper";

const EmployeeDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    newThisMonth: 0,
    resignedThisMonth: 0,
    contractsEnding: 0,
    birthdaysThisMonth: 0,
  });

  const [deptCounts, setDeptCounts] = useState([]);

  // 📌 인사 통계 조회
  const fetchEmployeeStats = useCallback(() => {
    request("get", "/api/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error("인사 통계 조회 실패:", err);
        alert("인사 통계를 불러오지 못했습니다.");
      });
  }, []);

  // 📌 부서별 사원 수 조회
  const fetchDeptCounts = useCallback(() => {
    request("get", "/api/employees/departmentCount")
      .then((res) => setDeptCounts(res.data))
      .catch((err) => {
        console.error("부서별 사원 수 조회 실패:", err);
        alert("부서별 사원 수를 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchEmployeeStats();
    fetchDeptCounts();
  }, [fetchEmployeeStats, fetchDeptCounts]);

  // ✅ 부서명 들여쓰기 포맷 (상위는 그대로, 하위만 └ 붙이기)
  const formatDeptName = (dept) => {
    const topLevelDeptNos = [1, 10, 20, 30]; // ✅ 회사(1) 포함
    return topLevelDeptNos.includes(dept.dept_no)
      ? dept.dept_name
      : `└ ${dept.dept_name}`;
  };

  // ✅ 부서 정렬: 최상위 → 상위 → 하위 순서 유지
  const sortDeptHierarchy = (list) => {
    const topLevels = list.filter(d => [1, 10, 20, 30].includes(d.dept_no)); // ✅ 회사 포함
    const children = list.filter(d => ![1, 10, 20, 30].includes(d.dept_no));
    const result = [];

    topLevels.forEach(top => {
      result.push(top);
      children
        .filter(child => child.dept_parent === top.dept_no)
        .forEach(child => result.push(child));
    });

    return result;
  };

  return (
    <Card
      style={{
        borderRadius: "15px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: 20,
      }}
    >
      <h3 style={{ marginBottom: 20 }}>👤 인사관리 대시보드</h3>

      {/* 📌 요약 통계 카드 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, marginBottom: 24 }}>
        {[
          { title: "👥 총 사원 수", value: stats.totalEmployees },
          { title: "📌 신규 입사자", value: stats.newThisMonth },
          { title: "📤 퇴사자 수", value: stats.resignedThisMonth },
          { title: "🔍 계약 만료 예정자", value: stats.contractsEnding },
          { title: "🎂 이번 달 생일자", value: stats.birthdaysThisMonth },
        ].map((item, idx) => (
          <Card
            key={idx}
            style={{ flex: "1 1 30%", minWidth: 200, padding: 16, borderRadius: 15 }}
          >
            <h5>{item.title}</h5>
            <p style={{ fontSize: 18, fontWeight: "bold" }}>{item.value} 명</p>
          </Card>
        ))}
      </div>

      {/* 📊 부서별 사원 수 그래프 */}
      <div style={{ marginTop: 40 }}>
        <h4 style={{ marginBottom: 20 }}>📊 부서별 재직 사원 수 (그래프)</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortDeptHierarchy(deptCounts)}>
            <XAxis dataKey={(d) => formatDeptName(d)} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [`${value} 명`, "사원 수"]} />
            <Bar
              dataKey="count"
              fill="#4C6EF5"
              barSize={30}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EmployeeDashboard;
