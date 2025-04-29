import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Avatar, Uploader } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';

const ProfileEditModal = ({ show, onClose, empNo, onSuccess }) => {
  const [form, setForm] = useState({
    emp_name: '',
    emp_ext_email: '',
    emp_mobile: '',
    emp_pwd: '',
    emp_img: null
  });
  const [employeeFromApi, setEmployeeFromApi] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ 기존 정보 불러오기
  useEffect(() => {
    if (empNo) {
      request("get", `/api/employee/${empNo}`)
        .then((res) => {
          const { emp_name, emp_ext_email, emp_mobile, emp_img } = res.data;
          setForm({
            emp_name,
            emp_ext_email,
            emp_mobile,
            emp_pwd: '',
            emp_img: null
          });
          setPreview(emp_img ? `http://localhost:8081/api/images/${encodeURIComponent(emp_img)}` : null);
          setEmployeeFromApi(res.data);
        })
        .catch((err) => console.error('사원 정보 불러오기 실패:', err));
    }
  }, [empNo]);

  // ✅ 입력 변경 핸들러
  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ 저장 처리
  const handleSave = async () => {
    if (!employeeFromApi) return;

    const updatedForm = {
      ...employeeFromApi,
      emp_name: form.emp_name,
      emp_ext_email: form.emp_ext_email,
      emp_mobile: form.emp_mobile,
      emp_no: empNo,
      // 📌 비밀번호 입력된 경우만 서버에서 암호화 처리
      emp_pwd: form.emp_pwd?.trim() ? form.emp_pwd : "",
      // 이미지 이름만 저장 (없으면 기존 이미지 유지)
      emp_img: form.emp_img ? form.emp_img.name : employeeFromApi.emp_img
    };

    const data = new FormData();
    data.append("employee", new Blob([JSON.stringify(updatedForm)], { type: "application/json" }));
    if (form.emp_img) {
      data.append("image", form.emp_img);
    }

    try {
      await request("put", `/api/updateEmployee/${empNo}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      localStorage.setItem("emp_img", updatedForm.emp_img); // 새 이미지 캐시

      alert("프로필이 성공적으로 수정되었습니다.");
      onSuccess?.(); // 헤더 등 리렌더링 트리거  
      onClose();
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("필수 항목이 누락되었거나 잘못된 값이 있을 수 있습니다.");
    }
  };

  return (
    <Modal open={show} onClose={onClose} size="sm">
      <Modal.Header><Modal.Title>프로필 수정</Modal.Title></Modal.Header>
      <Modal.Body>
        <div style={{ textAlign: 'center', marginBottom: '15px' }}>
          <Avatar circle size="lg" src={preview || '/default-profile.png'} />
        </div>
        <Form fluid>
          <Form.Group controlId="name">
            <Form.ControlLabel>이름</Form.ControlLabel>
            <Form.Control name="emp_name" value={form.emp_name} onChange={(val) => handleChange("emp_name", val)} />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.ControlLabel>외부 이메일</Form.ControlLabel>
            <Form.Control name="emp_ext_email" value={form.emp_ext_email} onChange={(val) => handleChange("emp_ext_email", val)} />
          </Form.Group>
          <Form.Group controlId="mobile">
            <Form.ControlLabel>휴대폰 번호</Form.ControlLabel>
            <Form.Control name="emp_mobile" value={form.emp_mobile} onChange={(val) => handleChange("emp_mobile", val)} />
          </Form.Group>
          <Form.Group controlId="pwd">
            <Form.ControlLabel>비밀번호 변경 (입력 시만 적용)</Form.ControlLabel>
            <Form.Control
              type="password"
              name="emp_pwd"
              value={form.emp_pwd}
              onChange={(val) => handleChange("emp_pwd", val)}
              placeholder="변경할 경우에만 입력"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>프로필 이미지</Form.ControlLabel>
            <Uploader
              autoUpload={false}
              fileListVisible={false}
              onChange={(fileList) => {
                const file = fileList[0]?.blobFile;
                if (file) {
                  setForm((prev) => ({ ...prev, emp_img: file }));
                  setPreview(URL.createObjectURL(file));
                }
              }}
            >
              <Button size="sm">이미지 업로드</Button>
            </Uploader>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSave} appearance="primary">저장</Button>
        <Button onClick={onClose} appearance="subtle">취소</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProfileEditModal;