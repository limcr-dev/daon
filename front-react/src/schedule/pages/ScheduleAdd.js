import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Form,
  Modal,
  Radio,
  RadioGroup,
  Tabs,
  TimePicker,
} from "rsuite";
import { ko } from "date-fns/locale";
import MemberAdd from "./MemberAdd";
import { request } from "../../common/components/helpers/axios_helper";
import { combineDateTime, formatDate } from "../components/ScheduleUtil";

const ScheduleAdd = ({ user, pickDate }) => {
  // 참석자 추가 모달창
  const [memberModalShow, setMemberModalShow] = useState(false);

  const closeMemberModal = () => setMemberModalShow(false);

  const openModalAddPage = () => {
    setMemberModalShow(true);
  };

  const [pickMember, setPickMember] = useState([]);

  // 스케쥴 카테고리 저장 함수
  const [schedule_setting, setSchedule_setting] = useState([]);

  // 스케쥴 카테고리 가져오기
  useEffect(() => {
    request("GET", "/schedule/getCategory/" + user.emp_no)
      .then((res) => {
        setSchedule_setting(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no]);

  const [allDay, setAllDay] = useState(false);
  // 종일 버튼 클릭 시
  const handleAllDay = () => {
    setAllDay((prev) => !prev);
  };

  // 전사일정 등록 전환시
  const [isVisible, setIsVisible] = useState(true);

  // 스케쥴 저장할 변수
  const [schedule, setSchedule] = useState({
    emp_no: user.emp_no,
    sch_title: "",
    sch_content: "",
    sch_start_time: "",
    sch_end_time: "",
    c_sch_no: "",
    c_sch_type: "",
  });

  const [startDate, setStartDate] = useState(new Date(pickDate));
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);

  // 수정데이터 반영함수
  const changeValue = (e) => {
    setSchedule({
      ...schedule,
      [e.target.name]: e.target.value,
    });
  };

  // 등록 버튼 클릭 시
  const submitScheduleAdd = (e) => {
    e.preventDefault(); // 폼 제출 기본 동작을 막음

    if (
      !schedule.sch_title ||
      (!schedule.c_sch_no && schedule.c_sch_type !== "A") ||
      !startTime ||
      !endDate ||
      !endTime
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    const fullStart = formatDate(startDate, startTime);
    const fullEnd = formatDate(endDate, endTime);

    const updatedSchedule = {
      ...schedule,
      sch_start_time: fullStart,
      sch_end_time: fullEnd,
    };

    // 등록 request
    request("POST", "/schedule/addSchedule/", updatedSchedule)
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
  //   const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  //   useEffect(() => {
  //     // pickDate가 변경될 때마다 startDate를 업데이트
  //     if (pickDate) {
  //       setStartDate(new Date(pickDate));
  //     }
  //   }, [pickDate]);
  return (
    <div>
      {/* 참석자 추가 모달창 */}
      <MemberAdd
        open={memberModalShow}
        onClose={closeMemberModal}
        user={user}
        pickMember={pickMember}
        setPickMember={setPickMember}
      />
      {/* <Modal
        open={open}
        onClose={() => {
          onClose();
          closeMemberModal();
        }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "1500px",
        }}
        backdrop="static"
        dialogClassName="modal-450w"
      > */}
      <Modal.Header closeButton>
        <Modal.Title>일정 추가</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form
          onSubmit={submitScheduleAdd}
          style={{ minWidth: "400px", padding: "20px" }}
        >
          <label style={{ minWidth: "360px" }}>
            <Tabs
              defaultActiveKey="1"
              onSelect={(key) => {
                if (key === "2") {
                  closeMemberModal();
                  setPickMember([]);
                  setIsVisible(false);
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule, // 기존 schedule 상태를 유지하면서
                    c_sch_type: "A", // c_sch_type만 'A'로 업데이트
                  }));
                } else {
                  setIsVisible(true);
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule, // 기존 schedule 상태를 유지하면서
                    c_sch_type: "", // c_sch_type만 'A'로 업데이트
                  }));
                }
              }}
            >
              <Tabs.Tab eventKey="1" title="일정등록"></Tabs.Tab>
              <Tabs.Tab eventKey="2" title="전사일정등록"></Tabs.Tab>
            </Tabs>
          </label>
          <div className="form-row">
            <div className="form-group">
              <label>* 일정명:</label>
              <input
                type="text"
                name="sch_title"
                onChange={changeValue}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>반복:</label>
              <RadioGroup name="radio-group" defaultValue="A" inline>
                <Radio value="A">없음</Radio>
                <Radio value="B">매주</Radio>
                <Radio value="C">매월</Radio>
                <Radio value="D">매년</Radio>
              </RadioGroup>
              {/* <input type="text" name="emp_name" value={attendance.emp_name} disabled /> */}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>* 일시:</label>
              <DatePicker
                name="sch_start_time"
                className="custom-datepicker"
                defaultValue={startDate}
                onChange={(value) => setStartDate(value)}
                format=" yyyy-MM-dd"
              />
              &nbsp;&nbsp;&nbsp;
              <TimePicker
                className="custom-datepicker"
                onChange={(value) => setStartTime(value)}
                format="HH:mm"
                value={startTime}
                disabled={allDay}
              />
              &nbsp;&nbsp;&nbsp;
              <Button variant="primary" onClick={handleAllDay}>
                종일
              </Button>
            </div>
          </div>
          <div className="form-row">
            <div style={{ marginLeft: "50px" }} className="form-group">
              ~ &nbsp;
              <DatePicker
                className="custom-datepicker"
                format=" yyyy-MM-dd"
                onChange={(value) => setEndDate(value)}
              />
              &nbsp;&nbsp;&nbsp;
              <TimePicker
                className="custom-datepicker"
                onChange={(value) => setEndTime(value)}
                format="HH:mm"
                disabled={allDay}
              />
            </div>
          </div>
          <div style={{ display: isVisible ? "block" : "none" }}>
            <div className="form-row">
              <div className="form-group">
                <label>* 카테고리:</label>
                <select name="c_sch_no" onChange={changeValue} required>
                  <option value="">카테고리 선택</option>
                  {schedule_setting
                    .filter((category) => category.c_sch_type === "I")
                    .map((category) => (
                      <option key={category.c_sch_no} value={category.c_sch_no}>
                        {category.c_sch_title}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div
                className="form-group"
                style={{ height: "100px", overflowY: "scroll" }}
              >
                <label>
                  {" "}
                  참석자:{" "}
                  {pickMember?.map((member, index) => (
                    <button
                      type="button"
                      style={{ marginRight: "8px", fontSize: "12px" }}
                      onClick={() => {
                        setPickMember((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      {member} X
                    </button>
                  ))}
                  <button
                    type="button"
                    style={{ backgroundColor: "white", color: "gray" }}
                    onClick={openModalAddPage}
                  >
                    + 참석자 선택
                  </button>
                </label>
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>일정내용:</label>
              <textarea
                style={{ width: "100%" }}
                type="text"
                name="sch_content"
                onChange={changeValue}
                required
              />
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={submitScheduleAdd}>
          등록
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            closeMemberModal();
          }}
        >
          취소
        </Button>
      </Modal.Footer>
      {/* </Modal> */}
    </div>
  );
};

export default ScheduleAdd;
