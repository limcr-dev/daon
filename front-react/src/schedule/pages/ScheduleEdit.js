import React, { useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Modal,
  Radio,
  RadioGroup,
  TimePicker,
} from "rsuite";
import { request } from "../../common/components/helpers/axios_helper";
import { formatDate } from "../components/ScheduleUtil";
import ScheduleDeleteModal from "../components/ScheduleDeleteModal";

const ScheduleEdit = ({ user, pickEvent, closeEditModal }) => {

  // 선택 이벤트 정보 불러올 함수
  const [eventInfo, setEventInfo] = useState({
    emp_no: "",
    sch_no: "",
    sch_title: "",
    sch_content: "",
    sch_start_time: new Date(),
    sch_end_time: new Date(),
    sch_all_day: false,
    sch_type: "",
    c_sch_no: "",
    c_sch_type: "",
    sch_repeat: "N",
    sch_repeat_count: 1,
    emp_name: "",
  });
  // 이벤트 한개 정보 불러오기
  useEffect(() => {
    request("GET", `/schedule/getEvent/${pickEvent}`)
      .then((res) => {
        setEventInfo(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [pickEvent]);

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

  // 일정 날짜 시간 설정
  const [startDate, setStartDate] = useState(eventInfo.sch_start_time);
  const [startTime, setStartTime] = useState();
  const [endDate, setEndDate] = useState(new Date(eventInfo.sch_end_time));
  const [endTime, setEndTime] = useState(new Date(eventInfo.sch_end_time));

  const [repeatAndAllDayStatus, setRepeatAndAllDayStatus] = useState('N');

  useEffect(() => {
    handleRepeatAndAll(eventInfo.sch_repeat);
    if (eventInfo.sch_start_time) {
      setStartDate(new Date(eventInfo.sch_start_time));
      setStartTime(new Date(eventInfo.sch_start_time));
    }
    if (eventInfo.sch_end_time) {
      setEndDate(new Date(eventInfo.sch_end_time));
      setEndTime(new Date(eventInfo.sch_end_time));
    }
  }, [eventInfo.sch_start_time, eventInfo.sch_end_time, eventInfo.sch_repeat])

  // 종일/반복 버튼 클릭 시
  const handleRepeatAndAll = (e) => {
    // 반복 없음 선택 시
    if (e === 'N') {
      setRepeatAndAllDayStatus(e);
      setEventInfo((prev) => ({
        ...prev,
        sch_all_day: true
      }));
    }
    if (e === 'A') {
      setRepeatAndAllDayStatus(e);
      setStartTime(null);
      setEndTime(null);
      setEventInfo((prev) => ({
        ...prev,
        sch_all_day: true
      }));
    }
    else {
      setRepeatAndAllDayStatus(e);
      setStartTime(null);
      setEndTime(null);
      setEndDate(null);
      setEventInfo((prev) => ({
        ...prev,
        sch_repeat: e,
        sch_all_day: true
      }));
    }
  };

  // 수정데이터 반영함수
  const changeValue = (e) => {
    setEventInfo({
      ...eventInfo,
      [e.target.name]: e.target.value,
    });
  };

  // 수정 버튼 클릭 시
  const submitScheduleEdit = (e) => {
    if (eventInfo.emp_no !== user.emp_no) {
      alert("작성자만 수정 가능합니다.")
      return false;
    }
    e.preventDefault(); // 폼 제출 기본 동작을 막음
    // 입력칸 제대로 작성되었는지 확인
    if (
      // title 필수
      !eventInfo.sch_title ||
      // 개인 일정이 아닐 시 c_sch_no없어도 가능
      (!eventInfo.c_sch_no && eventInfo.c_sch_type !== "A") ||
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

    // 수정할 일정데이터
    const updatedSchedule = {
      ...eventInfo,
      sch_start_time: fullStart,
      sch_end_time: fullEnd,
    };

    // 수정 request
    request("PUT", "/schedule/editSchedule/", updatedSchedule)
      .then((res) => {
        if (res.status === 200) {
          alert("수정 성공");
          window.location.reload(); // 새로고침
        } else {
          alert("일정 수정 실패하였습니다");
        }
      })
      .catch((error) => {
        console.log("실패", error);
      });
  };

  // 일정 삭제
  // 삭제 할 카테고리 저장 함수
    const [pickSchedule, setPickSchedule] = useState();
    // 삭제 확인 모달창
    const [deleteMadalOpen, setDeleteMadalOpen] = useState(false);
  
    const modal_open = (sch_no) => {
      setPickSchedule(sch_no);
      setDeleteMadalOpen(true);
    }
    const modal_Close = () => setDeleteMadalOpen(false);
  

  
  return (
    <div>
      <Modal
        open={deleteMadalOpen}
        onClose={modal_Close}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
      <ScheduleDeleteModal eventInfo={eventInfo} pickSchedule={pickSchedule} modal_Close={modal_Close} user={user}/>
      </Modal>
      <Modal.Header closeButton>
        <Modal.Title> {eventInfo.sch_type === 'I' ? "개인" : "전사"} 일정 수정</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form
          onSubmit={submitScheduleEdit}
          style={{ minWidth: "400px", padding: "20px" }}
        >
          {/* 전사일정만 작성자 보이게 설정 */}
          {eventInfo.sch_type === 'A' ? 
          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>* 작성자: {eventInfo.emp_name}</label>
            </div>
          </div>
           : ""}
          <div className="schedule-form-row">
            <div className="schedule-form-group">
              <label>* 일정명:</label>
              <input
                type="text"
                name="sch_title"
                defaultValue={eventInfo.sch_title}
                onChange={changeValue}
                required
              />
            </div>
          </div>

          <div className="schedule-form-row">
            <div className="schedule-form-group" >
              <label style={{ display: "flex", alignItems: "center" }}>반복 횟수 :&nbsp;
                <select style={{ width: "50px" }} value={eventInfo.sch_repeat_count} name="sch_repeat_count" onChange={changeValue} disabled={repeatAndAllDayStatus === 'N' || repeatAndAllDayStatus === 'A'}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </label>
              <RadioGroup name="radio-group" value={eventInfo.sch_repeat} onChange={(value) => handleRepeatAndAll(value)} inline>
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
                value={startDate}
                onChange={(value) => setStartDate(value)}
                format=" yyyy-MM-dd"
              />
              &nbsp;
              <TimePicker
                className="custom-datepicker"
                value={startTime}
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
                value={endDate}
                format=" yyyy-MM-dd"
                onChange={(value) => setEndDate(value)}
                disabled={repeatAndAllDayStatus !== 'N' && repeatAndAllDayStatus !== 'A'}
              />
              &nbsp;
              <TimePicker
                className="custom-datepicker"
                value={endTime}
                onChange={(value) => setEndTime(value)}
                format="HH:mm"
                disabled={repeatAndAllDayStatus !== 'N'}
              />
            </div>
          </div>
          <div style={{ display: eventInfo.sch_type === 'I' ? "block" : "none" }}>
            <div className="schedule-form-row">
              <div className="schedule-form-group">
                <label>* 카테고리: </label>
                <select
                  name="c_sch_no"
                  value={eventInfo.c_sch_no}
                  onChange={changeValue}
                  required>
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
                defaultValue={eventInfo.sch_content}
                onChange={changeValue}
                required
              />
            </div>
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={submitScheduleEdit}>
          수정
        </Button>
        <Button variant="primary" onClick={modal_open}>
          삭제
        </Button>
        <Button variant="secondary" onClick={closeEditModal} >
          취소
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default ScheduleEdit;
