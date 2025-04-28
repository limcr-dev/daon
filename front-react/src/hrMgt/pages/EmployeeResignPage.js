import React, { useEffect, useState } from "react";
import {
  Container,
  Content,
  Table,
  Input,
  Button,
  Card,
  Modal,
  Notification,
  toaster
} from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import EmployeeLeftbar from "./EmployeeLeftbar";
import Paging from "../../common/components/paging.js";
import "../css/EmployeeResignPage.css";

const { Column, HeaderCell, Cell } = Table;

const EmployeeResignPage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;
  const [resignTarget, setResignTarget] = useState(null); // ✅ 퇴사처리할 대상

  const fetchEmployees = () => {
    request("get", "/api/employeeList")
      .then((res) => {
        const filtered = res.data.filter((e) => e.emp_status === 1); // 재직자만
        setEmployees(filtered);
      })
      .catch((err) => {
        console.error("사원 목록 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            사원 정보를 불러오지 못했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleResign = (empNo) => {
    setResignTarget(empNo);
  };

  const confirmResign = () => {
    if (!resignTarget) return;

    request("put", `/api/employee/${resignTarget}/resign`)
      .then(() => {
        toaster.push(
          <Notification type="success" header="퇴사 완료" closable>
            퇴사 처리가 완료되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        setResignTarget(null);
        fetchEmployees();
      })
      .catch(() => {
        toaster.push(
          <Notification type="error" header="퇴사 실패" closable>
            퇴사 처리에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1);
  };

  const filteredEmployees = employees.filter((e) =>
    e.emp_name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredEmployees.slice(startIndex, endIndex);

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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>👋 퇴사 처리</h3>
                <Input
                  placeholder="이름 검색"
                  style={{ width: 200 }}
                  value={searchKeyword}
                  onChange={handleSearchChange}
                />
              </div>

              <Table
                className="employee-resign-table"
                data={paginatedList}
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
                        style={{ fontWeight: "bold" }} // ← 약간 강조하면 좋아
                      >
                        퇴사 처리
                      </Button>
                    )}
                  </Cell>
                </Column>
              </Table>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "center" }}>
                <Paging
                  paging={{
                    page: page,
                    size: size,
                    totalCount: filteredEmployees.length
                  }}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            </Card>
          </div>
          {/* 퇴사 확인 모달 */}
          <Modal open={!!resignTarget} onClose={() => setResignTarget(null)} size="xs">
            <Modal.Header>
              <Modal.Title>퇴사 확인</Modal.Title>
            </Modal.Header>
            <Modal.Body>정말로 퇴사 처리하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <Button appearance="primary" onClick={confirmResign}>확인</Button>
              <Button appearance="subtle" onClick={() => setResignTarget(null)}>취소</Button>
            </Modal.Footer>
          </Modal>

        </Content>
      </Container>
    </Container>
  );
};

export default EmployeeResignPage;
