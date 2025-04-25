// 📁 src/pages/hrMgt/PositionModal.js
import React, { useEffect, useState } from "react";
import { Modal, Button, Input } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";

const PositionModal = ({ open, onClose, item, onSuccess }) => {
  const [form, setForm] = useState({
    position_name: "",
    base_salary: ""
  });

  useEffect(() => {
    if (item) {
      setForm({
        position_name: item.position_name,
        base_salary: item.base_salary
      });
    } else {
      setForm({
        position_name: "",
        base_salary: ""
      });
    }
  }, [item]);

  const handleChange = (value, name) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const method = item ? "put" : "post";
    const url = item ? `/api/positions` : `/api/positions`;

    const payload = item
      ? { ...item, ...form }
      : form;

    request(method, url, payload)
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch(() => alert("저장 실패"));
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <Modal.Title>{item ? "직급 수정" : "직급 등록"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label>직급명</label>
        <Input
          value={form.position_name}
          onChange={(value) => handleChange(value, "position_name")}
        />

        <label style={{ marginTop: 10 }}>기본급 (원)</label>
        <Input
          type="number"
          value={form.base_salary}
          onChange={(value) => handleChange(value, "base_salary")}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button appearance="primary" onClick={handleSubmit}>
          {item ? "수정" : "등록"}
        </Button>
        <Button appearance="subtle" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PositionModal;
