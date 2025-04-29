import React, { useEffect, useState } from "react";
import { Modal, Button } from "rsuite";
import { request } from "../../../common/components/helpers/axios_helper";

const DeductionModal = ({ open, onClose, item, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    rate: "",
    fixed_amount: "",
    is_tax: false,
    is_active: true,
  });

  // 수정 모드일 경우 기존 값 세팅
  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || "",
        rate: item.rate ?? "",
        fixed_amount: item.fixed_amount ?? "",
        is_tax: item.is_tax ?? false,
        is_active: item.is_active ?? true,
      });
    } else {
      setForm({
        name: "",
        rate: "",
        fixed_amount: "",
        is_tax: false,
        is_active: true,
      });
    }
  }, [item]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "is_tax") {
      setForm({
        ...form,
        is_tax: checked,
        rate: checked ? "" : form.rate,
        fixed_amount: checked ? "" : form.fixed_amount,
      });
    } else {
      setForm({
        ...form,
        [name]: type === "checkbox" ? checked : value
      });
    }
  };

  // 저장 처리
  const handleSubmit = () => {
    const method = item ? "put" : "post";
    const url = item
      ? `/api/deduction/${item.id}`
      : `/api/deduction`;

    request(method, url, form)
      .then(() => {
        onSuccess(); // 목록 새로고침
        onClose();   // 모달 닫기
      })
      .catch((err) => {
        console.error("공제 항목 저장 실패:", err);
        alert("저장에 실패했습니다.");
      });
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <Modal.Header>
        <h4>{item ? "공제 항목 수정" : "공제 항목 등록"}</h4>
      </Modal.Header>

      <Modal.Body>
        <label>항목명</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>공제율 (%)</label>
        <input
          type="number"
          step="0.001"
          name="rate"
          value={form.rate}
          onChange={handleChange}
          disabled={form.is_tax}
        />

        <label>고정 금액</label>
        <input
          type="number"
          step="0.01"
          name="fixed_amount"
          value={form.fixed_amount}
          onChange={handleChange}
          disabled={form.is_tax}
        />

        <label>
          <input
            type="checkbox"
            name="is_tax"
            checked={form.is_tax}
            onChange={handleChange}
          />
          소득세/지방세 여부 (자동 계산 대상)
        </label>

        <label>
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
          />
          사용 여부
        </label>
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

export default DeductionModal;
