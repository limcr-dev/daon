import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Container, Content, Divider, Card, Button, Input, SelectPicker, DatePicker } from "rsuite";
import Leftbar from "../../common/pages/Leftbar";
import EmployeeLeftbar from "./EmployeeLeftbar";
import { getPositionName, getDeptName, getRoleName, getEmpType } from "../components/getEmployeeInfo";
import { request } from "../../common/components/helpers/axios_helper"; // ✅ axios 헬퍼 import

const EmployeeDetail = () => {
  const { emp_no } = useParams();
  const [employee, setEmployee] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // ✅ 사원 조회 API 호출
  const fetchEmployee = useCallback(() => {
    request("get", `/api/employee/${emp_no}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => {
        console.error("사원 정보 조회 실패:", err);
        alert("사원 정보를 불러올 수 없습니다.");
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

  // ✅ 사원 수정 API 호출
  const handleUpdate = () => {
    const formData = new FormData();
    formData.append("employee", new Blob([JSON.stringify(employee)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    request("put", `/api/updateEmployee/${emp_no}`, formData, true) // ✅ multipart 처리
      .then(() => {
        setIsEdit(false);
        fetchEmployee();
      })
      .catch(err => {
        console.error("업데이트 실패:", err);
        alert("사원 정보 수정에 실패했습니다.");
      });
  };

  if (!employee) return <div>로딩 중...</div>;

  return (
    <Container style={{ display: "flex", minHeight: "100vh" }}>
      <Leftbar />
      <Container>
        <EmployeeLeftbar />
        <Content style={{ padding: 20 }}>
          <Divider />
          <div style={{ display: "flex", gap: "30px", justifyContent: "center", alignItems: "flex-start" }}>
            {/* 왼쪽: 상세 보기 */}
            <Card style={{ width: "45%", minHeight: "720px", padding: "30px" }}>
              <h4>👤 사원 정보</h4>
              <Divider />
              {employee.emp_img && (
                <img
                  src={`http://localhost:8081/api/images/${employee.emp_img.split("/").pop()}`}
                  alt="프로필"
                  style={{ width: 150, height: 150, objectFit: "cover", borderRadius: "50%", marginBottom: 20 }}
                />
              )}
              <p><b>사번:</b> {employee.emp_no}</p>
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
              <p><b>퇴사일:</b> {employee.leave_date || '-'}</p>
              <p><b>재직상태:</b> {employee.emp_status === 1 ? '재직' : '퇴사'}</p>
              <Divider />
              <Button appearance="primary" onClick={() => setIsEdit(true)}>수정</Button>
            </Card>

            {/* 오른쪽: 수정 폼 */}
            {isEdit && (
              <Card style={{ width: "45%", minHeight: "720px", padding: "30px" }}>
                <h4>✏️ 사원 정보 수정</h4>
                <Divider />
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginBottom: 20 }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <p style={{ marginBottom: 4 }}>이름</p>
                    <Input value={employee.emp_name} onChange={(val) => handleChange("emp_name", val)} />
                  </div>
                  <div>
                    <p style={{ marginBottom: 4 }}>영문 이름</p>
                    <Input value={employee.emp_eng_name} onChange={(val) => handleChange("emp_eng_name", val)} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div>
                      <p style={{ marginBottom: 4 }}>성별</p>
                      <SelectPicker
                        data={[{ label: "남자", value: "M" }, { label: "여자", value: "F" }]}
                        value={employee.emp_gender}
                        onChange={(val) => handleChange("emp_gender", val)}
                        style={{ width: 120 }}
                      />
                    </div>
                    <div>
                      <p style={{ marginBottom: 4 }}>생년월일</p>
                      <DatePicker
                        value={new Date(employee.emp_birthday)}
                        onChange={(val) => handleChange("emp_birthday", val.toISOString().split("T")[0])}
                        style={{ width: 200 }}
                      />
                    </div>
                  </div>
                  <div>
                    <p style={{ marginBottom: 4 }}>사내 이메일</p>
                    <Input value={employee.emp_email} onChange={(val) => handleChange("emp_email", val)} />
                  </div>
                  <div>
                    <p style={{ marginBottom: 4 }}>외부 이메일</p>
                    <Input value={employee.emp_ext_email} onChange={(val) => handleChange("emp_ext_email", val)} />
                  </div>
                  <div>
                    <p style={{ marginBottom: 4 }}>휴대폰</p>
                    <Input value={employee.emp_mobile} onChange={(val) => handleChange("emp_mobile", val)} />
                  </div>
                  <div>
                    <p style={{ marginBottom: 4 }}>내선번호</p>
                    <Input value={employee.emp_ext_tel} onChange={(val) => handleChange("emp_ext_tel", val)} />
                  </div>
                </div>
                <Divider />
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button appearance="primary" onClick={handleUpdate} style={{ flex: 1 }}>저장</Button>
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
