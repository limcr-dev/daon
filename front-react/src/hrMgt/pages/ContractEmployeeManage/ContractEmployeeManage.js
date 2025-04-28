import React, { useEffect, useState } from "react";
import {
  Container, Content, Card, Button, Input, Modal, DatePicker,
  Notification, toaster
} from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";
import { getDeptName, getPositionName, getEmpType } from "../../components/getEmployeeInfo";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import Header from "../../../common/pages/Header";
import "../../css/ContractEmployeeManage.css";
import Paging from "../../../common/components/paging.js";

const ContractEmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newDate, setNewDate] = useState(null);
  const [page, setPage] = useState(1);
  const size = 10;

  const fetchContractEmployees = () => {
    setLoading(true);
    request("get", "/api/employee/contractList")
      .then((res) => {
        console.log("서버에서 받은 데이터:", res.data);
        setEmployees(res.data);
      })
      .catch((err) => {
        console.error(err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            계약직/인턴 목록 조회에 실패했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchContractEmployees();
  }, []);

  const handleSearchChange = (value) => {
    setSearchKeyword(value);
    setPage(1);
  };

  const filteredList = employees.filter((emp) =>
    emp.emp_name.includes(searchKeyword)
  );

  const startIndex = (page - 1) * size;
  const endIndex = startIndex + size;
  const paginatedList = filteredList.slice(startIndex, endIndex);

  const handleExtend = () => {
    if (!selectedEmp || !newDate) return;

    request(
      "put",
      `/api/employee/${selectedEmp.emp_no}/extendContract?newDate=${newDate.toISOString().split("T")[0]}`
    )
      .then(() => {
        toaster.push(
          <Notification type="success" header="연장 완료" closable>
            계약 만료일이 성공적으로 연장되었습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
        setExtendModalOpen(false);
        fetchContractEmployees();
      })
      .catch((err) => {
        console.error(err);
        toaster.push(
          <Notification type="error" header="연장 실패" closable>
            계약 만료일 연장에 실패했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      });
  };

  const handleConvert = (empNo) => {
    if (!window.confirm("정직원으로 전환하시겠습니까?")) return;

    request("put", `/api/employee/${empNo}/convertToRegular`)
      .then(() => {
        toaster.push(
          <Notification type="success" header="전환 완료" closable>
            정직원 전환이 완료되었습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
        fetchContractEmployees();
      })
      .catch((err) => {
        console.error(err);
        toaster.push(
          <Notification type="error" header="전환 실패" closable>
            정직원 전환에 실패했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      });
  };

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
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "30px",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
                📋 계약직/인턴 관리
              </h3>

              <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 20
              }}>
                <Input
                  placeholder="이름으로 검색"
                  value={searchKeyword}
                  onChange={handleSearchChange}
                  style={{ width: 250 }}
                />
              </div>

              {loading ? (
                <p>로딩 중...</p>
              ) : (
                <>
                  {/* 테이블 */}
                  <table className="contract-employee-list">
                    <thead>
                      <tr>
                        <th>사번</th>
                        <th>이름</th>
                        <th>부서</th>
                        <th>직급</th>
                        <th>고용형태</th>
                        <th>계약만료일</th>
                        <th>연장</th>
                        <th>정직원 전환</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedList.map((row) => (
                        <tr key={row.emp_no}>
                          <td>{row.emp_no}</td>
                          <td>{row.emp_name}</td>
                          <td>{getDeptName(row.dept_no)}</td>
                          <td>{getPositionName(row.position_id)}</td>
                          <td>{getEmpType(row.emp_type)}</td>
                          <td>{row.contract_end_date}</td>
                          <td>
                            <Button
                              size="xs"
                              appearance="primary"
                              onClick={() => {
                                setSelectedEmp(row);
                                setExtendModalOpen(true);
                              }}
                            >
                              연장
                            </Button>
                          </td>
                          <td>
                            <Button
                              size="xs"
                              appearance="ghost"
                              onClick={() => handleConvert(row.emp_no)}
                            >
                              전환
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* 페이징 */}
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
                </>
              )}
            </Card>
          </div>
          {/* 연장 모달 */}
          <Modal open={extendModalOpen} onClose={() => setExtendModalOpen(false)} size="xs">
            <Modal.Header>
              <Modal.Title>📅 계약 연장</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><b>{selectedEmp?.emp_name}</b>님의 새로운 계약만료일을 선택하세요.</p>
              <DatePicker
                format="yyyy-MM-dd"
                value={newDate}
                onChange={setNewDate}
                style={{ width: "100%" }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button appearance="primary" onClick={handleExtend}>저장</Button>
              <Button appearance="subtle" onClick={() => setExtendModalOpen(false)}>취소</Button>
            </Modal.Footer>
          </Modal>
        </Content>
      </Container>
    </Container>
  );
};

export default ContractEmployeeManage;
