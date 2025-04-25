import React, { useEffect, useState } from "react";
import {
  Container,
  Content,
  Table,
  Input,
  Button,
  Card,
} from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import EmployeeLeftbar from "./EmployeeLeftbar";
import "../css/EmployeeResignPage.css";



const { Column, HeaderCell, Cell } = Table;

const EmployeeResignPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");

  // ✅ 사원 조회 (재직자만)
  const fetchEmployees = () => {
    request("get", "/api/employeeList")
      .then((res) => {
        const filtered = res.data.filter((e) => e.emp_status === 1); // 재직자만
        setEmployees(filtered);
      })
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        alert("사원 정보를 불러오지 못했습니다.");
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ✅ 퇴사 처리
  const handleResign = (empNo) => {
    if (window.confirm("정말 퇴사 처리하시겠습니까?")) {
      request("put", `/api/employee/${empNo}/resign`)
        .then(() => {
          alert("퇴사 처리 완료");
          fetchEmployees();
        })
        .catch(() => {
          alert("퇴사 처리 실패");
        });
    }
  };

  // ✅ 이름 검색 필터
  const filteredEmployees = employees.filter((e) =>
    e.emp_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

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
            {/* ✅ 상단 필터 영역 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <h3 style={{  margin: 0, fontSize: "20px", fontWeight: "bold"  }}>👋 퇴사 처리</h3>
              <Input
                placeholder="이름 검색"
                style={{ width: 200 }}
                value={searchKeyword}
                onChange={setSearchKeyword}
              />
            </div>

            {/* ✅ 사원 테이블 */}
            <Table
              className="employee-resign-table"
              data={filteredEmployees}
              autoHeight
              rowHeight={50}
              bordered
              cellBordered
            >
              <Column width={100} align="center">
                <HeaderCell>사번</HeaderCell>
                <Cell dataKey="emp_no" />
              </Column>
              <Column width={150} align="center">
                <HeaderCell>이름</HeaderCell>
                <Cell dataKey="emp_name" />
              </Column>
              <Column width={180} align="center">
                <HeaderCell>입사일</HeaderCell>
                <Cell dataKey="hire_date" />
              </Column>
              <Column width={150} align="center">
                <HeaderCell>관리</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <Button
                      size="xs"
                      color="red"
                      appearance="ghost"
                      onClick={() => handleResign(rowData.emp_no)}
                    >
                      퇴사 처리
                    </Button>
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

export default EmployeeResignPage;
