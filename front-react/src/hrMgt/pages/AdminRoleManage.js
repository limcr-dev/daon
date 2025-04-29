import React, { useEffect, useState, useCallback } from "react";
import {
  Container,
  Content,
  Table,
  Input,
  Card,
  Notification,
  toaster
} from "rsuite";
import Leftbar from "../../common/pages/Leftbar";
import EmployeeLeftbar from "./EmployeeLeftbar";
import { request } from "../../common/components/helpers/axios_helper";
import Header from "../../common/pages/Header";
import "../css/AdminRoleManage.css";
import Paging from "../../common/components/paging.js";

const { Column, HeaderCell, Cell } = Table;

const AdminRoleManage = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [page, setPage] = useState(1);
  const size = 8;

  const fetchEmployees = useCallback(() => {
    request("get", "/api/employeeList")
      .then((res) => {
        setAllEmployees(res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="목록 조회 실패" closable>
            사원 목록을 불러오지 못했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleRoleChange = (empNo, newType) => {
    request("put", `/api/${empNo}/adminType?adminType=${newType}`)
      .then(() => {
        const updated = allEmployees.map((e) =>
          e.emp_no === empNo ? { ...e, admin_type: newType } : e
        );
        setAllEmployees(updated);
        applyFilter(nameFilter, updated);

        toaster.push(
          <Notification type="success" header="변경 완료" closable>
            권한이 변경되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      })
      .catch((err) => {
        console.error("권한 변경 실패:", err);
        toaster.push(
          <Notification type="error" header="변경 실패" closable>
            권한 변경에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  const applyFilter = (name = "", list = allEmployees) => {
    let filtered = [...list];

    if (name.trim()) {
      const lowerName = name.toLowerCase();
      filtered = filtered.filter((e) =>
        e.emp_name.toLowerCase().includes(lowerName)
      );
    }

    setNameFilter(name);
    setEmployees(filtered);
    setPage(1);
  };

  const adminOptions = [
    { label: "일반 사용자", value: 1 },
    { label: "관리자", value: 2 },
    { label: "인사 관리자", value: 3 },
    { label: "급여 관리자", value: 4 },
    { label: "부서 관리자", value: 5 },
    { label: "팀 관리자", value: 6 },
  ];

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = employees.slice(startIndex, endIndex);

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          <div style={{ marginTop: "50px", marginLeft: "30px", marginRight: "30px" }}>
            <Card
              style={{
                borderRadius: "12px",
                padding: "25px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", marginBottom: 10 }}>
                🔑 권한 설정
              </h3>
              <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 20 }}>
                <Input
                  placeholder="이름 검색"
                  value={nameFilter}
                  onChange={(val) => applyFilter(val)}
                  style={{ width: 180 }}
                />
              </div>
              <Table
                className="admin-role-table"
                data={paginatedList}
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
                      <select
                        value={rowData.admin_type}
                        onChange={(e) => handleRoleChange(rowData.emp_no, parseInt(e.target.value))}
                        style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
                      >
                        {adminOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </Cell>
                </Column>
              </Table>
              {/* 페이징 */}
              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <Paging
                  paging={{
                    page: page,
                    size: size,
                    totalCount: employees.length
                  }}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </Card>
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default AdminRoleManage;
