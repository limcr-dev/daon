import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Notification, toaster } from "rsuite";
import "../css/Registration.css";
import { request } from "../../common/components/helpers/axios_helper";

const EmployeeUpdate = ({ open, onClose, emp_no }) => {
  const [employee, setEmployee] = useState({
    emp_no: '',
    emp_name: '',
    emp_eng_name: '',
    emp_email: '',
    emp_ext_email: '',
    emp_pwd: '',
    emp_gender: '',
    emp_birthday: '',
    emp_mobile: '',
    emp_ext_tel: '',
    position_id: '',
    role_id: '',
    dept_no: '',
    emp_status: '',
    emp_type: '',
    emp_img: '',
    hire_date: '',
    leave_date: '',
    admin_type: '',
    work_type_no: ''
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchEmployee = useCallback(() => {
    if (!emp_no) return;
    request("get", `/api/employee/${emp_no}`)
      .then(res => setEmployee(res.data))
      .catch(err => {
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

  const changeValue = (e) => {
    const { name, value, files } = e.target;
    if (name === "emp_img" && files.length > 0) {
      setImageFile(files[0]);
    } else {
      setEmployee({ ...employee, [name]: value });
    }
  };

  const updateEmployee = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("employee", new Blob([JSON.stringify(employee)], { type: "application/json" }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    request("put", `/api/updateEmployee/${emp_no}`, formData, true)
      .then(res => {
        if (res.status === 200 || res.data) {
          toaster.push(
            <Notification type="success" header="수정 완료" closable>
              사원 정보가 수정되었습니다.
            </Notification>,
            { placement: "topCenter" }
          );
          onClose();
        } else {
          toaster.push(
            <Notification type="error" header="수정 실패" closable>
              사원 정보 수정에 실패했습니다.
            </Notification>,
            { placement: "topCenter" }
          );
        }
      })
      .catch(err => {
        console.error("사원 수정 실패:", err);
        toaster.push(
          <Notification type="error" header="수정 오류" closable>
            수정 중 오류가 발생했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="lg">
      <Modal.Header><h3>사원 수정</h3></Modal.Header>
      <Modal.Body>
        <form onSubmit={updateEmployee}>
          <div className="form-row">
            <div className="form-group">
              <label>프로필 이미지:</label>
              <input type="file" name="emp_img" onChange={changeValue} />
            </div>
            <div className="form-group">
              <label>성별:</label>
              <select name="emp_gender" value={employee.emp_gender} onChange={changeValue} required>
                <option value="">성별 선택</option>
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
              <label>영어 이름:</label>
              <input type="text" name="emp_eng_name" value={employee.emp_eng_name} onChange={changeValue} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>비밀번호 (변경 시만 입력):</label>
              <input type="password" name="emp_pwd" value={employee.emp_pwd} onChange={changeValue} placeholder="입력 시 새 비밀번호로 변경됩니다" />
            </div>
            <div className="form-group">
              <label>생년월일:</label>
              <input type="date" name="emp_birthday" value={employee.emp_birthday} onChange={changeValue} required />
            </div>
          </div>

          {/* 필요하면 부서, 직급, 직책 입력 추가 가능 */}

          <div className="button">
            <Button type="submit" appearance="primary">수정</Button>
            <Button type="button" appearance="ghost" onClick={onClose}>취소</Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EmployeeUpdate;
