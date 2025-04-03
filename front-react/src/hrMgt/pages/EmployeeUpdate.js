import React, { useEffect, useState } from "react";
import { Modal, Button } from "rsuite";

import "../css/Registration.css";

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

    useEffect(() => {
            fetch("http://localhost:8081/api/employee/" + emp_no)
                .then((res) => res.json())
                .then((res) => {
                    setEmployee(res);
                })
                
        
    }, [emp_no])

    const updateEmployee = (e) => {
      e.preventDefault();
      console.log('key', emp_no)
      fetch("http://localhost:8081/api/updateEmployee/" + emp_no, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(employee)
        })
        .then((res) => {
            console.log(1, res);
            if(res.status === 200) {
                return res.json();
            }else {
                return null;
            }
        })
        .then((res) => {
            console.log('정상', res);
            if(res != null) {
            onClose();  
            }else{
                alert("직원등록 실패하였습니다")
            }
        })
        .catch((error) => {
            console.log("실패", error)
        })
    }

    // 입력값 변경 핸들러
    const changeValue = (e) => {
        setEmployee({
            ...employee,
            [e.target.name]: e.target.value
        })
    };

    return (
        <Modal open={open} onClose={onClose} size="lg">
            <Modal.Header>
                <h3>사원 수정</h3>
            </Modal.Header>
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
                <label>비밀번호:</label>
                <input type="password" name="emp_pwd" value={employee.emp_pwd} onChange={changeValue} required />
            </div>
            <div className="form-group">
                <label>생년월일:</label>
                <input type="date" name="emp_birthday" value={employee.emp_birthday} onChange={changeValue} required />
            </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>외부 이메일:</label>
                <input type="email" name="emp_ext_email" value={employee.emp_ext_email} onChange={changeValue} required />
            </div>
            <div className="form-group">
                <label>사내 이메일:</label>
                <input type="email" name="emp_email" value={employee.emp_email} onChange={changeValue} required />
            </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>휴대폰 번호:</label>
                <input type="text" name="emp_mobile" value={employee.emp_mobile} onChange={changeValue} required />
            </div>
            <div className="form-group">
                <label>내선 번호:</label>
                <input type="text" name="emp_ext_tel" value={employee.emp_ext_tel} onChange={changeValue} required />
            </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>직책:</label>
                <select name="role_id" value={employee.role_id} onChange={changeValue} required>
                <option value="">직책 선택</option>
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
                    <option value="">직급 선택</option>
                    <option value="10">사장</option>
                    <option value="15">부사장</option>
                    <option value="20">전무</option>
                    <option value="25">상무</option>
                    <option value="30">이사</option>
                    <option value="35">부장</option>
                    <option value="40">차장</option>
                    <option value="45">과장</option>
                    <option value="50">대리</option>
                    <option value="55">사원</option>
                    <option value="60">인턴</option>
                </select>
            </div>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>부서 코드:</label>
                <select name="dept_no" value={employee.dept_no} onChange={changeValue} required>
                <option value="">부서 선택</option>
                <option value="1">다온</option>
                <option value="10">경영부</option>
                <option value="101">경영부(인사팀)</option>
                <option value="102">경영부(총무팀)</option>
                <option value="103">경영부(회계팀)</option>
                <option value="20">개발부</option>
                <option value="201">개발부(연구개발팀)</option>
                <option value="202">개발부(생산관리팀)</option>
                <option value="203">개발부(it팀)</option>
                <option value="30">영업부</option>
                <option value="301">영업부(영업팀)</option>
                <option value="302">영업부(마케팅팀)</option>
                <option value="303">영업부(품질관리팀)</option>
                </select>
            </div>

            <div className="form-group">
              <label>입사일:</label>
              <input type="date" name="hire_date" value={employee.hire_date} onChange={changeValue} required />
            </div>
            </div>

          
          

          <div className="form-row">
            <div className="form-group">
                <label>권한:</label>
                <select name="admin_type" value={employee.admin_type} onChange={changeValue} required>
                    <option value="1">일반 사용자</option>
                    <option value="2">관리자</option>
                    <option value="3">인사 관리자</option>
                </select>
            </div>
            
            <div className="form-group">
                <label>고용 형태:</label>
                <select name="emp_type" value={employee.emp_type} onChange={changeValue} required>
                        <option value="1">정직원</option>
                        <option value="2">계약직</option>
                        <option value="3">인턴</option>
                        <option value="4">프리랜서</option>
                </select>
            </div>
            <div className="form-group">
                <label>근무 형태:</label>
                <select name="work_type_no" value={employee.work_type_no} onChange={changeValue} required>
                        <option value="1">오전근무</option>
                        <option value="2">오후근무</option>
                </select>
            </div>
          </div>
          <div className="button">
          <Button type="submit" appearance="primary">수정</Button>
          <Button type="button" appearance="primary">취소</Button>
          </div>
        </form>
      </Modal.Body>
        </Modal>
    );
};

export default EmployeeUpdate;
