import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Modal,
  Radio,
  RadioGroup,
  Tabs,
  TimePicker,
} from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";
import { formatDate } from "../components/ScheduleUtil";

const ScheduleAdd = ({ user, pickDate, closeModal }) => {

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

  // 전사일정 등록 전환시
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("1");

  // 스케쥴 저장할 변수
  const [schedule, setSchedule] = useState({
    emp_no: user.emp_no,
    sch_title: "",
    sch_content: "",
    sch_start_time: "",
    sch_end_time: "",
    c_sch_no: "",
    c_sch_type: "",
    sch_all_day: false,
    sch_repeat: "N",
    sch_repeat_count: 1,
  });

  // 일정 날짜 시간 설정
  const [startDate, setStartDate] = useState(new Date(pickDate));
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [repeatAndAllDayStatus, setRepeatAndAllDayStatus] = useState('N');

  // 종일/반복 버튼 클릭 시
  const handleRepeatAndAll = (e) => {

    // 반복 없음 선택 시
    if (e === 'N') {
      setRepeatAndAllDayStatus(e);
      setSchedule((prev) => ({
        ...prev,
        sch_all_day: true
      }));
    }
    if (e === 'A') {
      setRepeatAndAllDayStatus(e);
      setStartTime(null);
      setEndTime(null);
      setSchedule((prev) => ({
        ...prev,
        sch_all_day: true
      }));
    }
    else {
      setRepeatAndAllDayStatus(e);
      setStartTime(null);
      setEndTime(null);
      setEndDate(null);
      setSchedule((prev) => ({
        ...prev,
        sch_repeat: e,
        sch_all_day: true
      }));
    }
  };

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
    // 입력칸 제대로 작성되었는지 확인
    if (
      // title 필수
      !schedule.sch_title ||
      // 개인 일정이 아닐 시 c_sch_no없어도 가능
      (!schedule.c_sch_no && schedule.c_sch_type !== "A") ||
      // 종일 여부에 따라 startTime, endTime 생략가능

      // 일반 상태일 때
      (repeatAndAllDayStatus === 'N' && (!startDate || !startTime || !endTime || !endDate)) ||
      // 종일 상태일 때
      (repeatAndAllDayStatus === 'A' && (!startDate || !endDate)) ||
      // 반복 상태일 때
      (['W', 'M', 'Y'].includes(repeatAndAllDayStatus) && (!startDate))
    ) {
      alert("필수 항목을 모두 입력해주세요.");
      return;
    }

    // 날짜+시간 합치기
    const fullStart = formatDate(startDate, startTime);
    const fullEnd = formatDate(endDate, endTime);

    // 등록할 일정데이터
    const updatedSchedule = {
      ...schedule,
      sch_start_time: fullStart,
      sch_end_time: fullEnd,
    };
    if (updatedSchedule.sch_start_time > updatedSchedule.sch_end_time){
      alert("종료 시간은 시작 시간 이후여야 합니다.");
      return false;
    }
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
  return (
    <div>
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
              activeKey={activeTab}
              onSelect={(key) => {
                if (key === "2") {
                  if (user.admin_type !== 2 && user.admin_type !== 3) {
                    alert("전사일정 등록은 관리자만 가능합니다.");
                    setActiveTab("1");
                    return false;
                  }
                  setActiveTab("2");
                  setIsVisible(false);
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule, // 기존 schedule 상태를 유지하면서
                    c_sch_type: "A", // c_sch_type만 'A'로 업데이트
                  }));
                } else {
                  setActiveTab("1");
                  setIsVisible(true);
                  setSchedule((prevSchedule) => ({
                    ...prevSchedule, // 기존 schedule 상태를 유지하면서
                    c_sch_type: "", // c_sch_type만 ''로 업데이트
                  }));
                }
              }}
            >
              <Tabs.Tab eventKey="1" title="일정등록"></Tabs.Tab>
              <Tabs.Tab eventKey="2" title="전사일정등록"></Tabs.Tab>
            </Tabs>
          </label>
          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>* 일정명:</label>
              <input
                type="text"
                name="sch_title"
                onChange={changeValue}
                required
              />
            </div>
          </div>

          <div className="schedule-form-row">
            <div className="schedule-form-group" >
              <label style={{ display: "flex", alignItems: "center" }}>반복 횟수:&nbsp;
                <select style={{ width: "50px" }} name="sch_repeat_count" onChange={changeValue} disabled={repeatAndAllDayStatus === 'N' || repeatAndAllDayStatus === 'A'}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <RadioGroup name="radio-group" value={repeatAndAllDayStatus} onChange={(value) => handleRepeatAndAll(value)} inline>
                <Radio value="N">없음</Radio>
                <Radio value="W">매주</Radio>
                <Radio value="M">매월</Radio>
                <Radio value="Y">매년</Radio>
              </RadioGroup>
            </div>
          </div>

          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>* 일시:</label>
              <DatePicker
                name="sch_start_time"
                className="custom-datepicker"
                defaultValue={startDate}
                onChange={(value) => setStartDate(value)}
                format=" yyyy-MM-dd"
              />
              &nbsp;
              <TimePicker
                className="custom-datepicker"
                onChange={(value) => setStartTime(value)}
                format="HH:mm"
                disabled={repeatAndAllDayStatus !== 'N'}
              />
              &nbsp;
              <Button variant="primary" onClick={() => handleRepeatAndAll("A")}>
                종일
              </Button>
            </div>
          </div>
          <div className="schedule-form-row">
            <div style={{ marginLeft: "50px" }} className="schedule-form-group">
              ~ 
              <DatePicker
                className="custom-datepicker"
                format=" yyyy-MM-dd"
                onChange={(value) => setEndDate(value)}
                disabled={repeatAndAllDayStatus !== 'N' && repeatAndAllDayStatus !== 'A'}
              />
              &nbsp;
              <TimePicker
                className="custom-datepicker"
                onChange={(value) => setEndTime(value)}
                format="HH:mm"
                disabled={repeatAndAllDayStatus !== 'N'}
              />
            </div>
          </div>
          <div style={{ display: isVisible ? "block" : "none" }}>
            <div className="schedule-form-row">
              <div className="schedule-form-group">
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
          </div>
          <div className="schedule-form-row">
            <div className="schedule-form-group">
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
        <Button variant="secondary" onClick={closeModal} >
          취소
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default ScheduleAdd;
