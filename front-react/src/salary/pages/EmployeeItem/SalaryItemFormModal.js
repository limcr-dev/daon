import React, { useEffect, useState } from "react";
import { Modal, Button } from "rsuite";

const SalaryItemFormModal = ({ open, onClose, empNo, salaryMonth, type, item, onSuccess }) => {
  const [itemList, setItemList] = useState([]);
  const [formValue, setFormValue] = useState({
    item_id: "",
    amount: "",
  });

  // ✅ 수당 또는 공제 항목 불러오기
  useEffect(() => {
    const endpoint = type === "ALLOWANCE" ? "allowances" : "deductions";
    fetch(`http://localhost:8081/api/${endpoint}`)
      .then(res => res.json())
      .then(data => setItemList(data));
  }, [type]);

  // ✅ 수정 모드일 경우 기존 항목 세팅
  useEffect(() => {
    if (item) {
      setFormValue({
        item_id: item.item_id,
        amount: item.amount,
      });
    } else {
      setFormValue({
        item_id: "",
        amount: "",
      });
    }
  }, [item]);

  // ✅ 공제 항목 자동 계산 (기본급 × rate / 100)
  useEffect(() => {
    if (type === "DEDUCTION" && formValue.item_id && !item) {
      const selected = itemList.find(i => i.id === parseInt(formValue.item_id));
      if (selected?.rate) {
        fetch(`http://localhost:8081/api/employee/${empNo}/baseSalary`)
          .then(res => res.json())
          .then(base => {
            const rate = parseFloat(selected.rate) / 100;  // 퍼센트 → 소수
            const amount = Math.round(base * rate);        // 계산
            setFormValue(prev => ({ ...prev, amount }));
          });
      }
    }
  }, [formValue.item_id, itemList, type, empNo, item]);

  // ✅ 수당 항목 고정 금액 자동 입력
  useEffect(() => {
    if (type === "ALLOWANCE" && formValue.item_id && !item) {
      const selected = itemList.find(i => i.id === parseInt(formValue.item_id));
      if (selected?.is_fixed && selected.fixed_amount) {
        setFormValue(prev => ({ ...prev, amount: selected.fixed_amount }));
      }
    }
  }, [formValue.item_id, itemList, type, item]);

  // ✅ 입력값 변경 핸들러
  const changeValue = (e) => {
    const { name, value } = e.target;
    setFormValue({
      ...formValue,
      [name]: value
    });
  };

  // ✅ 저장 처리
  const handleSubmit = () => {
    const method = item ? "PUT" : "POST";
    const url = item
      ? `http://localhost:8081/api/salaryItem/${item.id}`
      : `http://localhost:8081/api/salaryItem`;

    const payload = {
      emp_no: empNo,
      salary_month: salaryMonth,
      item_type: type,
      ...formValue
    };

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(res => {
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        alert("저장 실패");
      }
    });
  };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <Modal.Header>
        <h4>{item ? "항목 수정" : "항목 추가"} ({type === "ALLOWANCE" ? "수당" : "공제"})</h4>
      </Modal.Header>
      <Modal.Body>
        <label>항목 선택</label>
        <select
          name="item_id"
          value={formValue.item_id}
          onChange={changeValue}
          disabled={!!item} // 수정 시 항목 고정
        >
          <option value="">항목 선택</option>
          {itemList.map(i => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        <label>금액</label>
        <input
          type="number"
          name="amount"
          value={formValue.amount}
          onChange={changeValue}
          disabled={
            (!item && type === "DEDUCTION" && itemList.find(i => i.id === parseInt(formValue.item_id))?.rate) ||
            (!item && type === "ALLOWANCE" && itemList.find(i => i.id === parseInt(formValue.item_id))?.is_fixed)
          }
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

export default SalaryItemFormModal;
