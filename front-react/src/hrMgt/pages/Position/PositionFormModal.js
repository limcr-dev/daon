import React, { useEffect, useState } from "react";
import { Modal, Button, Input, toaster, Notification } from "rsuite";
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
    const url = `/api/positions`; 

    const payload = item
      ? { ...item, ...form }
      : form;

    request(method, url, payload)
      .then(() => {
        toaster.push(
          <Notification type="success" header={item ? "수정 완료" : "등록 완료"} closable>
            {item ? "직급이 성공적으로 수정되었습니다." : "직급이 성공적으로 등록되었습니다."}
          </Notification>,
          { placement: 'topEnd' }
        );
        onSuccess();
        onClose();
      })
      .catch(() => {
        toaster.push(
          <Notification type="error" header="저장 실패" closable>
            직급 저장에 실패했습니다.
          </Notification>,
          { placement: 'topEnd' }
        );
      });
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
