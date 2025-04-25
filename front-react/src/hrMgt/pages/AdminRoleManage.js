import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Content,
  Table,
  SelectPicker,
  Input,
  Card
} from "rsuite";
import Leftbar from "../../common/pages/Leftbar";
import EmployeeLeftbar from "./EmployeeLeftbar";
import { request } from "../../common/components/helpers/axios_helper";
import Header from "../../common/pages/Header";
import "../css/AdminRoleManage.css";

const { Column, HeaderCell, Cell } = Table;

const AdminRoleManage = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filter, setFilter] = useState(null);       // 권한 필터
  const [nameFilter, setNameFilter] = useState(""); // 이름 검색어

  const fetchEmployees = useCallback(() => {
    request("get", "/api/employeeList")
      .then((res) => {
        setAllEmployees(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        alert("사원 목록을 불러오지 못했습니다.");
      });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleRoleChange = (empNo, newType) => {
    request("put", `/api/employees/${empNo}/adminType?adminType=${newType}`)
      .then(() => {
        const updated = allEmployees.map((e) =>
          e.emp_no === empNo ? { ...e, admin_type: newType } : e
        );
        setAllEmployees(updated);
        applyFilter(filter, nameFilter, updated);
      })
      .catch((err) => {
        console.error("권한 변경 실패:", err);
        alert("권한 변경에 실패했습니다.");
      });
  };

  // ✅ 필터 적용 함수 (권한 + 이름 모두 적용)
  const applyFilter = (adminType, name = "", list = allEmployees) => {
    let filtered = [...list];

    if (adminType !== null) {
      filtered = filtered.filter((e) => e.admin_type === adminType);
    }

    if (name.trim()) {
      const lowerName = name.toLowerCase();
      filtered = filtered.filter((e) =>
        e.emp_name.toLowerCase().includes(lowerName)
      );
    }

    setFilter(adminType);
    setNameFilter(name);
    setEmployees(filtered);
  };

  const adminOptions = [
    { label: "일반 사용자", value: 1 },
    { label: "관리자", value: 2 },
    { label: "인사 관리자", value: 3 },
    { label: "급여 관리자", value: 4 },
    { label: "부서 관리자", value: 5 },
    { label: "팀 관리자", value: 6 },
  ];

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />

          <Card
            style={{
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* 상단 제목 + 필터 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}> 🔑 권한 설정 </h3>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <Input
                  placeholder="이름 검색"
                  value={nameFilter}
                  onChange={(val) => applyFilter(filter, val)}
                  style={{ width: 180 }}
                />
                <SelectPicker
                  style={{ width: 200 }}
                  placeholder="권한별 보기"
                  data={[{ label: "전체 보기", value: null }, ...adminOptions]}
                  value={filter}
                  onChange={(val) => applyFilter(val, nameFilter)}
                  cleanable={false}
                />
              </div>
            </div>

            {/* 테이블 */}
            <Table
            className="admin-role-table"
            data={employees}
            autoHeight
            rowHeight={60}
            bordered
            cellBordered
            rowClassName={(rowData) =>
              rowData && rowData.admin_type >= 2 ? "highlight-row" : ""
            }
          >
              <Column width={100} align="center">
                <HeaderCell>사번</HeaderCell>
                <Cell dataKey="emp_no" />
              </Column>
              <Column width={150} align="center">
                <HeaderCell>이름</HeaderCell>
                <Cell dataKey="emp_name" />
              </Column>
              <Column width={300} align="center" flexGrow={1}>
                <HeaderCell>현재 권한</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <SelectPicker
                      cleanable={false}
                      data={adminOptions}
                      value={rowData?.admin_type}
                      onChange={(val) => handleRoleChange(rowData.emp_no, val)}
                      style={{ width: "100%" }}
                      block
                    />
                  )}
                </Cell>
              </Column>
            </Table>
          </Card>
        </Content>
      </Container>
    </Container>
  );
};

export default AdminRoleManage;
