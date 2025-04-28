import React, { useEffect, useState } from "react";
import { Button, DatePicker, Modal, TimePicker } from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";

const WorkScheduleAdd = ({ closeAddModal }) => {
  // 근무유형정보 가져오기
  const [work_schedule, setWork_schedule] = useState({
    work_type_no: "",
    type_name: "",
    start_time: new Date(),
    end_time: new Date()
  });

  // 수정데이터 반영함수
  const changeValue = (e) => {
    let value = e.target.value;

    if (e.target.name === "start_time" || e.target.name === "end_time") {
      // value를 Date로 변환한 뒤, 다시 "HH:MM:SS" 포맷으로 변환
      const date = new Date(`1970-01-01T${value}:00`);
      const hh = String(date.getHours()).padStart(2, "0");
      const mm = String(date.getMinutes()).padStart(2, "0");
      const ss = String(date.getSeconds()).padStart(2, "0");
      value = `${hh}:${mm}:${ss}`;
    }

    setWork_schedule({
      ...work_schedule,
      [e.target.name]: value,
    });
  };
  // 수정 버튼 클릭 시
  const submitScheduleAdd = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작을 막음

    console.log("test" + work_schedule.start_time)
    console.log(work_schedule.end_time)
    
    if (work_schedule.start_time >= work_schedule.end_time) {
      alert("근무 시작시간은 끝나는 시간보다 같거나 늦을 수 없습니다.");
      return false;
    }

    request("POST", "/attend/addWorkSchedule", work_schedule)
      .then((res) => {
        if (res.status === 200) {
          alert("등록 성공");
          window.location.reload(); // 새로고침
        } else {
          alert("일정 등록 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log("실패", error);
      });
  };
  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>근무타입 추가</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form
          onSubmit={submitScheduleAdd}
          style={{ minWidth: "400px", padding: "20px" }}
        >
          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>근무타입명:</label>
              <input
                type="text"
                name="type_name"
                onChange={(value) => changeValue(value)}
                required
              />
            </div>
          </div>
          <br />
          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>근무 시간:</label>
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="time"
                  name="start_time"
                  value={work_schedule.start_time}
                  onChange={changeValue}
                  max={work_schedule.end_time}
                  required
                />
                ~
                <input
                  type="time"
                  name="end_time"
                  value={work_schedule.end_time}
                  onChange={changeValue}
                  min={work_schedule.start_time}
                  required
                />
              </div>
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={submitScheduleAdd}>
          등록
        </Button>
        <Button variant="secondary" onClick={closeAddModal}>
          취소
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default WorkScheduleAdd;
