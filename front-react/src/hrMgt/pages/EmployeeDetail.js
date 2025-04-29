import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Container, Content, Card, Button,
  Input, SelectPicker, DatePicker, Notification, toaster, Divider, Loader
} from "rsuite";
import Leftbar from "../../common/pages/Leftbar";
import EmployeeLeftbar from "./EmployeeLeftbar";
import { getPositionName, getDeptName, getRoleName, getEmpType } from "../components/getEmployeeInfo";
import { request } from "../../common/components/helpers/axios_helper";
import { API_URL } from "../../common/components/helpers/axios_helper"; 
import Header from '../../common/pages/Header';

// (부서데이터는 프로젝트 데이터에 맞게 조정!)
const departmentData = {
  1: {
    name: "회사",
    children: {
      10: { name: "인사부", children: [{ label: "인사팀", value: 101 }, { label: "총무팀", value: 102 }, { label: "회계팀", value: 103 }] },
      20: { name: "개발부", children: [{ label: "연구개발팀", value: 201 }, { label: "생산관리팀", value: 202 }, { label: "IT팀", value: 203 }] },
      30: { name: "영업부", children: [{ label: "영업팀", value: 301 }, { label: "마케팅팀", value: 302 }, { label: "품질관리팀", value: 303 }] },
    }
  }
};



const EmployeeDetail = () => {
  const { emp_no } = useParams();
  const [employee, setEmployee] = useState(null);
  const [empPwdInput, setEmpPwdInput] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [ext1, setExt1] = useState("");
  const [ext2, setExt2] = useState("");
  const [upperDept, setUpperDept] = useState("");
  const [middleDept, setMiddleDept] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const fetchEmployee = useCallback(() => {
    request("get", `/api/employee/${emp_no}`)
      .then((res) => {
        const emp = res.data;
        setEmployee(emp);
        setEmpPwdInput("");
        if (emp.emp_mobile) {
          const parts = emp.emp_mobile.split("-");
          setPhone2(parts[1] || "");
          setPhone3(parts[2] || "");
        }
        if (emp.emp_ext_tel) {
          const parts = emp.emp_ext_tel.split("-");
          setExt1(parts[0] || "");
          setExt2(parts[1] || "");
        }
        if (emp.dept_no) {
          for (const [key, dept] of Object.entries(departmentData[1].children)) {
            if (dept.children.some(child => child.value === emp.dept_no)) {
              setUpperDept(key);
              setMiddleDept(emp.dept_no);
              break;
            }
          }
        }
      })
      .catch((err) => {
        console.error("사원 정보 조회 실패:", err);
        toaster.push(
          <Notification type="error" header="조회 실패" closable>
            사원 정보를 불러올 수 없습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  }, [emp_no]);

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  const handleChange = (name, value) => {
    setEmployee(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTopDeptChange = (e) => {
    setUpperDept(e.target.value);
    setMiddleDept("");
  };

  const handleMiddleDeptChange = (e) => {
    setMiddleDept(e.target.value);
    handleChange("dept_no", e.target.value);
  };

  const handleUpdate = () => {
    if (!employee) return;
    setIsSaving(true);

    const employeeToSend = { ...employee };
    employeeToSend.emp_mobile = `010-${phone2}-${phone3}`;
    employeeToSend.emp_ext_tel = ext1 && ext2 ? `${ext1}-${ext2}` : "";

    if (empPwdInput.trim()) {
      employeeToSend.emp_pwd = empPwdInput;
    } else {
      delete employeeToSend.emp_pwd;
    }

    const formData = new FormData();
    formData.append("employee", new Blob([JSON.stringify(employeeToSend)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    request("put", `/api/updateEmployee/${emp_no}`, formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(() => {
        setIsEdit(false);
        fetchEmployee();
        toaster.push(
          <Notification type="success" header="수정 완료" closable>
            사원 정보가 수정되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      })
      .catch((err) => {
        console.error("업데이트 실패:", err);
        toaster.push(
          <Notification type="error" header="수정 실패" closable>
            사원 정보 수정에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      })
      .finally(() => setIsSaving(false));
  };

  if (!employee) {
    return (
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Loader size="lg" content="사원 정보를 불러오는 중..." />
      </div>
    );
  }

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content>
          <Header />
          <div style={{ display: "flex", gap: "30px", justifyContent: "center", alignItems: "flex-start", marginTop: "50px" }}>
            {/* 왼쪽 사원 정보 카드 */}
            <Card style={{ width: "45%", minHeight: "720px", padding: "30px" }}>
              <h4>👤 사원 정보</h4>
              <Divider />
              {employee.emp_img && (
                <img
                  src={`${API_URL}/api/images/${encodeURIComponent(employee.emp_img)}`}
                  alt="프로필"
                style={{ width: 150, height: 150, objectFit: "cover", borderRadius: "50%", marginBottom: 20 }}
                />
              )}
              <p><b>이름:</b> {employee.emp_name}</p>
              <p><b>성별:</b> {employee.emp_gender === 'M' ? '남자' : '여자'}</p>
              <p><b>생년월일:</b> {employee.emp_birthday}</p>
              <p><b>사내 이메일:</b> {employee.emp_email}</p>
              <p><b>외부 이메일:</b> {employee.emp_ext_email}</p>
              <p><b>휴대폰:</b> {employee.emp_mobile}</p>
              <p><b>내선번호:</b> {employee.emp_ext_tel}</p>
              <p><b>부서:</b> {getDeptName(employee.dept_no)}</p>
              <p><b>직급:</b> {getPositionName(employee.position_id)}</p>
              <p><b>직책:</b> {getRoleName(employee.role_id)}</p>
              <p><b>직원구분:</b> {getEmpType(employee.emp_type)}</p>
              <p><b>입사일:</b> {employee.hire_date}</p>
              {['2', '3'].includes(String(employee.emp_type)) && (
                <p><b>계약 만료일:</b> {employee.contract_end_date || '-'}</p>
              )}
              <p><b>재직상태:</b> {employee.emp_status === 1 ? '재직' : '퇴사'}</p>
              <Divider />
              <Button appearance="primary" onClick={() => setIsEdit(true)}>수정</Button>
            </Card>
            {/* 오른쪽 수정폼 카드 */}
            {isEdit && (
              <Card style={{ width: "45%", minHeight: "720px", padding: "30px" }}>
                <h4>✏️ 사원 정보 수정</h4>
                <Divider />
                {/* 파일 선택 + 비밀번호 입력 */}
                <div style={{
                  display: "flex",
                  gap: "16px",
                  alignItems: "center",
                  marginBottom: "24px",
                }}>
                  {/* 파일 선택 */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "100px" }}>파일 선택</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 비밀번호 입력 */}
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>비밀번호</label>
                    <Input
                      type="password"
                      value={empPwdInput}
                      onChange={(val) => setEmpPwdInput(val)}
                      placeholder="비밀번호 변경 시 입력"
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                {/* 2개씩 가로 정렬 */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "24px",
                }}>
                  {/* 이름 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>이름</label>
                    <Input value={employee.emp_name} onChange={(val) => handleChange("emp_name", val)} />
                  </div>
                  {/* 영문 이름 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>영문 이름</label>
                    <Input value={employee.emp_eng_name} onChange={(val) => handleChange("emp_eng_name", val)} />
                  </div>
                  {/* 성별 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>성별</label>
                    <SelectPicker
                      data={[{ label: "남자", value: "M" }, { label: "여자", value: "F" }]}
                      value={employee.emp_gender}
                      onChange={(val) => handleChange("emp_gender", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 생년월일 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>생년월일</label>
                    <DatePicker
                      value={employee.emp_birthday ? new Date(employee.emp_birthday) : null}
                      onChange={(val) => handleChange("emp_birthday", val?.toISOString().split("T")[0])}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 사내 이메일 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>사내 이메일</label>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Input
                        value={employee.emp_email.split('@')[0]}
                        onChange={(val) => handleChange("emp_email", `${val}@daon-ai.com`)}
                        style={{ flex: 1 }}
                      />
                      <span>@daon-ai.com</span>
                    </div>
                  </div>
                  {/* 외부 이메일 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>외부 이메일</label>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Input
                        value={employee.emp_ext_email.split('@')[0]}
                        onChange={(val) => {
                          const domain = employee.emp_ext_email.split('@')[1] || 'naver.com';
                          handleChange("emp_ext_email", `${val}@${domain}`);
                        }}
                        style={{ flex: 1 }}
                      />
                      <span>@</span>
                      <SelectPicker
                        data={[
                          { label: "naver.com", value: "naver.com" },
                          { label: "daum.net", value: "daum.net" },
                          { label: "gmail.com", value: "gmail.com" }
                        ]}
                        value={employee.emp_ext_email.split('@')[1]}
                        onChange={(val) => {
                          const id = employee.emp_ext_email.split('@')[0] || '';
                          handleChange("emp_ext_email", `${id}@${val}`);
                        }}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                  {/* 휴대폰 번호 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>휴대폰</label>
                    <div style={{ flex: 1, display: "flex", gap: "5px" }}>
                      <Input value="010" readOnly style={{ width: 60, textAlign: "center", backgroundColor: "#f0f0f0" }} />
                      <span>-</span>
                      <Input maxLength={4} value={phone2} onChange={(val) => setPhone2(val.replace(/[^0-9]/g, ''))} style={{ width: 80, textAlign: "center" }} />
                      <span>-</span>
                      <Input maxLength={4} value={phone3} onChange={(val) => setPhone3(val.replace(/[^0-9]/g, ''))} style={{ width: 80, textAlign: "center" }} />
                    </div>
                  </div>
                  {/* 내선 번호 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>내선 번호</label>
                    <div style={{ flex: 1, display: "flex", gap: "5px" }}>
                      <Input maxLength={4} value={ext1} onChange={(val) => setExt1(val.replace(/[^0-9]/g, ''))} style={{ width: 70, textAlign: "center" }} />
                      <span>-</span>
                      <Input maxLength={4} value={ext2} onChange={(val) => setExt2(val.replace(/[^0-9]/g, ''))} style={{ width: 80, textAlign: "center" }} />
                    </div>
                  </div>
                  {/* 입사일 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>입사일</label>
                    <DatePicker
                      value={employee.hire_date ? new Date(employee.hire_date) : null}
                      onChange={(val) => handleChange("hire_date", val?.toISOString().split("T")[0])}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 직급 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>직급</label>
                    <SelectPicker
                      data={[
                        { label: "사장", value: "10" },
                        { label: "부사장", value: "15" },
                        { label: "전무", value: "20" },
                        { label: "상무", value: "25" },
                        { label: "이사", value: "30" },
                        { label: "부장", value: "35" },
                        { label: "차장", value: "40" },
                        { label: "과장", value: "45" },
                        { label: "대리", value: "50" },
                        { label: "사원", value: "55" },
                        { label: "인턴", value: "60" },
                      ]}
                      value={employee.position_id}
                      onChange={(val) => handleChange("position_id", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 직책 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>직책</label>
                    <SelectPicker
                      data={[
                        { label: "임원", value: "10" },
                        { label: "부서장", value: "20" },
                        { label: "팀장", value: "30" },
                        { label: "부팀장", value: "40" },
                        { label: "팀원", value: "50" },
                      ]}
                      value={employee.role_id}
                      onChange={(val) => handleChange("role_id", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 상위 부서 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>상위 부서</label>
                    <select value={upperDept} onChange={handleTopDeptChange} style={{ flex: 1, padding: "8px" }}>
                      <option value="">상위 부서 선택</option>
                      {Object.entries(departmentData[1].children).map(([key, dept]) => (
                        <option key={key} value={key}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* 하위 부서 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>하위 부서</label>
                    <select value={middleDept} onChange={handleMiddleDeptChange} style={{ flex: 1, padding: "8px" }}>
                      <option value="">하위 부서 선택</option>
                      {departmentData[1].children[upperDept]?.children.map((child) => (
                        <option key={child.value} value={child.value}>{child.label}</option>
                      ))}
                    </select>
                  </div>
                  {/* 고용형태 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>고용형태</label>
                    <SelectPicker
                      data={[
                        { label: "정직원", value: "1" },
                        { label: "계약직", value: "2" },
                        { label: "인턴", value: "3" },
                        { label: "프리랜서", value: "4" },
                      ]}
                      value={employee.emp_type}
                      onChange={(val) => handleChange("emp_type", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 계약 만료일 (계약직/인턴만) */}
                  {['2', '3'].includes(String(employee.emp_type)) && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <label style={{ minWidth: "80px" }}>계약만료일</label>
                      <DatePicker
                        value={employee.contract_end_date ? new Date(employee.contract_end_date) : null}
                        onChange={(val) => handleChange("contract_end_date", val?.toISOString().split("T")[0])}
                        style={{ flex: 1 }}
                      />
                    </div>
                  )}
                  {/* 근무형태 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>근무형태</label>
                    <SelectPicker
                      data={[
                        { label: "오전근무", value: "1" },
                        { label: "오후근무", value: "2" },
                      ]}
                      value={employee.work_type_no}
                      onChange={(val) => handleChange("work_type_no", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                  {/* 권한 */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <label style={{ minWidth: "80px" }}>권한</label>
                    <SelectPicker
                      data={[
                        { label: "일반 사용자", value: "1" },
                        { label: "관리자", value: "2" },
                        { label: "인사 관리자", value: "3" },
                        { label: "부서 관리자", value: "4" },
                        { label: "팀 관리자", value: "5" },
                      ]}
                      value={employee.admin_type}
                      onChange={(val) => handleChange("admin_type", val)}
                      style={{ flex: 1 }}
                    />
                  </div>
                </div>
                <Divider />
                {/* 버튼 저장 / 취소 가로 정렬 */}
                <div style={{ display: "flex", gap: "20px" }}>
                  <Button appearance="primary" onClick={handleUpdate} loading={isSaving} style={{ flex: 1 }}>저장</Button>
                  <Button appearance="subtle" onClick={() => setIsEdit(false)} style={{ flex: 1 }}>취소</Button>
                </div>
              </Card>
            )}
          </div>
        </Content>
      </Container>
    </Container>
  );
};

export default EmployeeDetail;
