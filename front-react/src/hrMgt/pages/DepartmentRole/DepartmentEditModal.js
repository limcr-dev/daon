import React, { useState, useEffect } from "react";
import { Modal, Button, Input, toaster, Notification } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";

const DepartmentEditModal = ({ open, onClose, dept, onSuccess }) => {
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    if (dept) {
      setDeptName(dept.dept_name);
    }
  }, [dept]);

  const handleSubmit = () => {
    if (!deptName.trim()) {
      toaster.push(
        <Notification type="warning" header="입력 필요" closable>
          부서명을 입력해주세요.
        </Notification>,
        { placement: "topCenter" }
      );
      return;
    }

    const payload = {
      dept_no: dept.dept_no,
      dept_name: deptName,
      dept_parent: dept.dept_parent // 기존 상위 부서 정보 유지
    };

    request("put", `/api/departments`, payload)
      .then(() => {
        toaster.push(
          <Notification type="success" header="수정 완료" closable>
            부서명이 수정되었습니다.
          </Notification>,
          { placement: "topCenter" }
        );
        onSuccess(); // 목록 새로고침
        onClose();   // 모달 닫기
      })
      .catch((err) => {
        console.error("부서 수정 실패:", err);
        toaster.push(
          <Notification type="error" header="수정 실패" closable>
            부서명 수정에 실패했습니다.
          </Notification>,
          { placement: "topCenter" }
        );
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="xs">
      <Modal.Header>
        <Modal.Title>📁 부서 수정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          value={deptName}
          onChange={setDeptName}
          placeholder="부서명을 입력하세요"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={handleSubmit}>
          저장
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DepartmentEditModal;
