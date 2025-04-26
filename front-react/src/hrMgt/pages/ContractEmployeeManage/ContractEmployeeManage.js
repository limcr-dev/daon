import React, { useEffect, useState } from "react";
import { Container, Content, Card, Button, Input, Modal, DatePicker } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";
import { getDeptName, getPositionName, getEmpType } from "../../components/getEmployeeInfo";
import Leftbar from "../../../common/pages/Leftbar";
import EmployeeLeftbar from "../EmployeeLeftbar";
import Header from "../../../common/pages/Header";
import "../../css/ContractEmployeeManage.css"; // ✅ employee-list 스타일 포함

const ContractEmployeeManage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [newDate, setNewDate] = useState(null);

  // ✅ 계약직/인턴 사원 목록 불러오기
  const fetchContractEmployees = () => {
    setLoading(true);
    request("get", "/api/employee/contractList")
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        alert("목록 조회 실패");
        console.error(err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContractEmployees();
  }, []);

  const filteredList = employees.filter((emp) =>
    emp.emp_name.includes(searchKeyword)
  );

  // ✅ 연장 처리
  const handleExtend = () => {
    if (!selectedEmp || !newDate) return;
    request(
      "put",
      `/api/employee/${selectedEmp.emp_no}/extendContract?newDate=${newDate.toISOString().split("T")[0]}`
    )
      .then(() => {
        alert("계약 만료일 연장 완료");
        setExtendModalOpen(false);
        fetchContractEmployees();
      })
      .catch((err) => {
        alert("연장 실패");
        console.error(err);
      });
  };

  // ✅ 정직원 전환 처리
  const handleConvert = (empNo) => {
    if (!window.confirm("정직원으로 전환하시겠습니까?")) return;
    request("put", `/api/employee/${empNo}/convertToRegular`)
      .then(() => {
        alert("전환 완료");
        fetchContractEmployees();
      })
      .catch((err) => {
        alert("전환 실패");
        console.error(err);
      });
  };

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />

          <Card
            style={{
              borderRadius: "15px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              padding: "20px",
              marginBottom: "30px",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>📋 계약직/인턴 관리</h3>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Input
                placeholder="이름으로 검색"
                value={searchKeyword}
                onChange={setSearchKeyword}
                style={{ width: 250 }}
              />
            </div>

            {/* ✅ HTML table로 리팩토링 */}
            {loading ? (
              <p>로딩 중...</p>
            ) : (
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
                  {filteredList.map((row) => (
                    <tr key={row.emp_no}>
                      <td>{row.emp_no}</td>
                      <td>{row.emp_name}</td>
                      <td>{getDeptName(row.dept_no)}</td>
                      <td>{getPositionName(row.position_id)}</td>
                      <td>{getEmpType(row.emp_type)}</td>
                      <td>{row.contract_end_date}</td>
                      <td>
                        <button
                          className="rs-btn rs-btn-xs rs-btn-primary"
                          onClick={() => {
                            setSelectedEmp(row);
                            setExtendModalOpen(true);
                          }}
                        >
                          연장
                        </button>
                      </td>
                      <td>
                        <button
                          className="rs-btn rs-btn-xs rs-btn-ghost"
                          onClick={() => handleConvert(row.emp_no)}
                        >
                          전환
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {/* ✅ 연장 모달 */}
          <Modal open={extendModalOpen} onClose={() => setExtendModalOpen(false)} size="xs">
            <Modal.Header>
              <Modal.Title>📅 계약 연장</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><b>{selectedEmp?.emp_name}</b>님의 새로운 계약만료일을 선택하세요.</p>
              <DatePicker format="yyyy-MM-dd" value={newDate} onChange={setNewDate} style={{ width: "100%" }} />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleExtend} appearance="primary">저장</Button>
              <Button onClick={() => setExtendModalOpen(false)} appearance="subtle">취소</Button>
            </Modal.Footer>
          </Modal>
        </Content>
      </Container>
    </Container>
  );
};

export default ContractEmployeeManage;
