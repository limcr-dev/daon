import React, { useEffect, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { getPositionName, getRoleName, getDeptName, getEmpType, getEmpStatus, getGender } from "../components/getEmployeeInfo.js"; 
import { Container, Content } from 'rsuite';
import EmployeeUpdate from './EmployeeUpdate';

import "../css/EmployeeDetail.css";

const EmployeeDetail = () => {
  const propsParam = useParams();
  const emp_no = propsParam.emp_no;
  const navigate = useNavigate();
  const [updateModal, setUpdateModal] = useState(false);

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

  const openUpdateModal = () => setUpdateModal(true);
  const closeUpdateModal = () => setUpdateModal(false);


  // 1건조회
  useEffect(() => {
    fetch("http://localhost:8081/api/employee/" + emp_no)
      .then((res) => res.json())
      .then((res) => {
        setEmployee(res);
      });
  }, [emp_no]);

  // 삭제
  const deleteEmployee = () => {
    fetch("http://localhost:8081/api/deleteEmployee/" + emp_no, {
      method: 'DELETE',
    })
    .then((res) => res.text())
    .then((res) => {
      if(res === "ok") {
        navigate('/employee');
      }else {
        alert('삭제실패')
      }
    });
  }

  return (
    <Container>
    <div className="profile-container">
      <div className="profile-header">
        <img src={employee.emp_img} alt="Profile" className="profile-image" />
        <div className="profile-info">
          <h2>{employee.emp_name}</h2>
          <h4>{employee.emp_eng_name}</h4>
          <p></p>
        </div>
      </div>
      <Content>
      <div className="profile-section">
        <h3>기본 정보</h3>
        <p><strong>사내 이메일:</strong> {employee.emp_email}</p>
        <p><strong>외부 이메일:</strong> {employee.emp_ext_email}</p>
        <p><strong>비밀번호:</strong> {employee.emp_pwd}</p> {/* 비밀번호는 보통 안 보이게 처리하지만, 예시로 넣었습니다 */}
        <p><strong>성별:</strong> {getGender(employee.emp_gender)}</p>
        <p><strong>생년월일:</strong> {employee.emp_birthday}</p>
      </div>

      <div className="profile-section">
        <h3>연락처</h3>
        <p><strong>전화번호:</strong> {employee.emp_ext_tel}</p>
        <p><strong>내선번호:</strong> {employee.emp_mobile}</p>
      </div>

      <div className="profile-section">
        <h3>직무 정보</h3>
        <p><strong>직급:</strong> {getPositionName(employee.position_id)}</p>  
        <p><strong>직책:</strong> {getRoleName(employee.role_id)}</p>  
        <p><strong>부서:</strong> {getDeptName(employee.dept_no)}</p>  
        <p><strong>재직 상태:</strong> {getEmpStatus(employee.emp_status)}</p> 
        <p><strong>고용 형태:</strong> {getEmpType(employee.emp_type)}</p>  
        <p><strong>근무 유형:</strong> {employee.work_type_no}</p>
        <p><strong>입사일:</strong> {employee.hire_date}</p>
      </div>
      </Content>
      <button onClick={openUpdateModal}>수정</button>
      
      <button onClick={deleteEmployee}>삭제</button>
    </div>
    <EmployeeUpdate open={updateModal} onClose={closeUpdateModal} emp_no={emp_no}/>
    </Container>
    
  );
};

export default EmployeeDetail;
