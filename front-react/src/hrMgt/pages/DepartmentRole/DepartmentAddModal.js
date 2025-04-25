import React, { useEffect, useState, useCallback } from "react";
import { Modal, Button, Input, SelectPicker, Message, useToaster } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper"; // ✅ axios 헬퍼 import

const DepartmentAddModal = ({ open, onClose, onSuccess }) => {
  const [deptName, setDeptName] = useState("");
  const [parentOptions, setParentOptions] = useState([]);
  const [parentDept, setParentDept] = useState(null);
  const toaster = useToaster();

  // ✅ 상위 부서 옵션 조회
  const fetchParentDepartments = useCallback(() => {
    request("get", "/api/departments")
      .then((res) => {
        const topDepts = res.data.filter((d) => d.dept_parent === 1);
        const options = topDepts.map((d) => ({ label: d.dept_name, value: d.dept_no }));
        setParentOptions(options);
      })
      .catch((err) => {
        console.error("부서 옵션 조회 실패:", err);
        toaster.push(<Message showIcon type="error">부서 목록을 불러오지 못했습니다.</Message>, {
          placement: "topCenter",
        });
      });
  }, [toaster]);

  useEffect(() => {
    if (open) {
      fetchParentDepartments();
    }
  }, [open, fetchParentDepartments]);

  // ✅ 부서 등록
  const handleSubmit = () => {
    if (!deptName) return;

    const payload = {
      dept_name: deptName,
      dept_parent: parentDept || 1,
    };

    request("post", "/api/departments", payload)
      .then(() => {
        toaster.push(<Message showIcon type="success">등록 완료</Message>, { placement: "topCenter" });
        setDeptName("");
        setParentDept(null);
        onClose();
        onSuccess();
      })
      .catch((err) => {
        console.error("부서 등록 실패:", err);
        toaster.push(<Message showIcon type="error">등록 실패</Message>, { placement: "topCenter" });
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>📁 부서 등록</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Input
          placeholder="부서명 입력"
          value={deptName}
          onChange={setDeptName}
          style={{ marginBottom: 10 }}
        />
        <SelectPicker
          data={parentOptions}
          value={parentDept}
          onChange={setParentDept}
          style={{ width: "100%" }}
          placeholder="상위 부서 선택 (선택 안하면 대표 부서)"
          cleanable
        />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={handleSubmit}>등록</Button>
        <Button onClick={onClose}>취소</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DepartmentAddModal;
