// 📁 Registration.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "rsuite";
import "../css/Registration.css";
import { request } from "../../common/components/helpers/axios_helper";

// ✅ 부서 계층 구조
const departmentData = {
  1: {
    name: "회사",
    children: {
      10: {
        name: "인사부",
        children: [
          { label: "인사팀", value: 101 },
          { label: "총무팀", value: 102 },
          { label: "회계팀", value: 103 },
        ]
      },
      20: {
        name: "개발부",
        children: [
          { label: "연구개발팀", value: 201 },
          { label: "생산관리팀", value: 202 },
          { label: "IT팀", value: 203 },
        ]
      },
      30: {
        name: "영업부",
        children: [
          { label: "영업팀", value: 301 },
          { label: "마케팅팀", value: 302 },
          { label: "품질관리팀", value: 303 },
        ]
      }
    }
  }
};

const Registration = ({ open, onClose }) => {
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    emp_name: '',
    emp_eng_name: '',
    emp_email: '',
    emp_ext_email: '',
    emp_gender: '',
    emp_birthday: '',
    emp_mobile: '',
    emp_ext_tel: '',
    position_id: '',
    role_id: '',
    dept_no: '1',
    emp_status: '1',
    emp_type: '',
    emp_img: '',
    hire_date: '',
    leave_date: '',
    contract_end_date: '',
    admin_type: '1',
    work_type_no: '',
    token: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [upperDept, setUpperDept] = useState('');
  const [middleDept, setMiddleDept] = useState('');

  const changeValue = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleTopDeptChange = (e) => {
    setUpperDept(e.target.value);
    setMiddleDept('');
    setEmployee((prev) => ({ ...prev, dept_no: '' }));
  };

  const handleMiddleDeptChange = (e) => {
    setMiddleDept(e.target.value);
    setEmployee((prev) => ({ ...prev, dept_no: e.target.value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const submitEmployee = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("employee", new Blob([JSON.stringify(employee)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    request("post", "/api/insertEmployee", formData, {})
      .then((res) => {
        if (res.status === 201 || res.data) {
          alert("사원 등록이 완료되었습니다.");
          navigate("/employee");
          onClose();
        } else {
          alert("사원 등록에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.error("등록 실패:", err);
        alert("사원 등록 중 오류가 발생했습니다.");
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header><h3>👤 사원 등록</h3></Modal.Header>
      <Modal.Body>
        <form onSubmit={submitEmployee} style={{ maxWidth: "860px", margin: "0 auto" }}>
          <div className="form-row">
            <div className="form-group">
              <label>프로필 이미지:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>
            <div className="form-group">
              <label>성별:</label>
              <select name="emp_gender" value={employee.emp_gender} onChange={changeValue} required>
                <option value="">선택</option>
                <option value="M">남자</option>
                <option value="F">여자</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>이름:</label>
              <input type="text" name="emp_name" value={employee.emp_name} onChange={changeValue} required />
            </div>
            <div className="form-group">
              <label>영문 이름:</label>
              <input type="text" name="emp_eng_name" value={employee.emp_eng_name} onChange={changeValue} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>생년월일:</label>
              <input type="date" name="emp_birthday" value={employee.emp_birthday} onChange={changeValue} required />
            </div>
            <div className="form-group">
              <label>입사일:</label>
              <input type="date" name="hire_date" value={employee.hire_date} onChange={changeValue} required />
            </div>
          </div>

          
          <div className="form-row">
            <div className="form-group">
              <label>사내 이메일:</label>
              <input type="email" name="emp_email" value={employee.emp_email} onChange={changeValue} required />
            </div>
            <div className="form-group">
              <label>외부 이메일:</label>
              <input type="email" name="emp_ext_email" value={employee.emp_ext_email} onChange={changeValue} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>휴대폰 번호:</label>
              <input type="text" name="emp_mobile" value={employee.emp_mobile} onChange={changeValue} required />
            </div>
            <div className="form-group">
              <label>내선 번호:</label>
              <input type="text" name="emp_ext_tel" value={employee.emp_ext_tel} onChange={changeValue} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>직책:</label>
              <select name="role_id" value={employee.role_id} onChange={changeValue} required>
                <option value="">선택</option>
                <option value="10">임원</option>
                <option value="20">부서장</option>
                <option value="30">팀장</option>
                <option value="40">부팀장</option>
                <option value="50">팀원</option>
              </select>
            </div>
            <div className="form-group">
              <label>직급:</label>
              <select name="position_id" value={employee.position_id} onChange={changeValue} required>
                <option value="">선택</option>
                <option value="10">사장</option>
                <option value="20">전무</option>
                <option value="30">이사</option>
                <option value="40">부장</option>
                <option value="50">과장</option>
                <option value="60">대리</option>
                <option value="70">사원</option>
                <option value="80">인턴</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>상위 부서:</label>
              <select value={upperDept} onChange={handleTopDeptChange} required>
                <option value="">상위 부서 선택</option>
                {Object.entries(departmentData[1].children).map(([key, dept]) => (
                  <option key={key} value={key}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>하위 부서:</label>
              <select value={middleDept} onChange={handleMiddleDeptChange} required>
                <option value="">하위 부서 선택</option>
                {departmentData[1].children[upperDept]?.children.map((child) => (
                  <option key={child.value} value={child.value}>{child.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>고용 형태:</label>
              <select name="emp_type" value={employee.emp_type} onChange={changeValue} required>
                <option value="">선택</option>
                <option value="1">정직원</option>
                <option value="2">계약직</option>
                <option value="3">인턴</option>
                <option value="4">프리랜서</option>
              </select>
            </div>
            {(employee.emp_type === '2' || employee.emp_type === '3') && (
            
              <div className="form-group">
                <label>계약 만료일:</label>
                <input type="date" name="contract_end_date" value={employee.contract_end_date} onChange={changeValue} />
              </div>
            )}

            <div className="form-group">
              <label>근무 형태:</label>
              <select name="work_type_no" value={employee.work_type_no} onChange={changeValue} required>
                <option value="1">오전근무</option>
                <option value="2">오후근무</option>
              </select>
            </div>
            <div className="form-group">
              <label>권한:</label>
              <select name="admin_type" value={employee.admin_type} onChange={changeValue} required>
                <option value="1">일반 사용자</option>
                <option value="2">관리자</option>
                <option value="3">인사 관리자</option>
                <option value="4">부서 관리자</option>
                <option value="5">팀 관리자</option>
              </select>
            </div>
          </div>

          <div className="button">
            <Button type="submit" appearance="primary">등록</Button>
            <Button onClick={onClose} appearance="subtle">취소</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Registration;
