import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import '../css/MyCalendar.css';
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

import { ko } from 'date-fns/esm/locale';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../css/DatePicker.css';


const MyCalendar = () => {

  // 날짜 값 저장하는 용도
  const [date, setDate] = useState(0);

  // 일정추가모달창
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (info) => {
    setDate(info.dateStr);
    setShow(true);
  }

  //  참석자 추가 모달창
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = (info) => {
    setDate(info.dateStr);
    setShow2(true);
  }
  // 이벤트 클릭시
  const handleEventClick = (info) => {
    alert(info.event.title)
  }

  // 이벤트 데이터 위치
  const event = [{ title: '판매건수 : 23건', date: '2025-03-11', color: 'red' },
  { title: '판매건수 : 23건', date: '2025-03-17' },
  { title: '판매건수 : 23건', date: '2025-03-11', color: 'red' },
  { title: '판매건수 : 234건', date: '2025-03-12', time: '', color: 'red' },
  { title: '판매건수 : 23건', date: '2025-03-18', color: 'red' },
  { title: '판매건수 : 23건', date: '2025-04-11', color: 'red' },
  { title: '판매건수 : 23건', date: '2025-05-11', color: 'red' },
  { title: '판매건수 : 23건', date: '2025-06-11', color: 'red' },]

  // state: DemoAppState = {
  //   weekendsVisible: true,
  //   currentEvents: []
  // }
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div style={{ margin: "auto", maxWidth: "1200px" }}>

      {/* 일정추가모달창 */}
      <div>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          centered
          dialogClassName="modal-450w"
        >
          <Modal.Header closeButton>
            <Modal.Title>일정 추가</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form className="custom-form">

              <Form.Group className="mb-3 " controlId="exampleForm.ControlInput1">
                <Form.Label>일정명</Form.Label>
                <Form.Control
                  type="text"
                  placeholder=""
                  autoFocus
                />
              </Form.Group>

              <Form.Label>반복</Form.Label>

              <br></br>

              <div style={{ display: "inline-block" }}>
                일시&nbsp;&nbsp;
                <DatePicker
                  className="custom-datepicker"
                  showIcon
                  selected={date}
                  onChange={date => setStartDate(date)}
                  locale={ko}
                  dateFormat=" yyyy년 MM월 dd일"
                  width="2000px"
                />
              </div>
              &nbsp;&nbsp;
              <div style={{ display: "inline-block" }}>
                <DatePicker
                  className="custom-datepicker"
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  locale={ko}
                  timeIntervals={15}
                  dateFormat="aa h:mm"
                  showTimeCaption={false}
                />
              </div>
              <div>

              </div>
              <br></br>
              <div>
                <DatePicker
                  selected={date}
                  onChange={date => setStartDate(date)}
                  locale={ko}
                  dateFormat="yyyy년 MM월 dd일"
                />
              </div>
              <br></br>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>참석자<p onClick={handleShow2} style={{ cursor: "pointer", fontSize: "10px" }}> + 참석자 선택</p> </Form.Label>
              </Form.Group>
            </Form>
          </Modal.Body>

          <Modal.Footer>

            <Button variant="primary" onClick={handleClose}>
              등록
            </Button>
            <Button variant="secondary" onClick={handleClose}>
              취소
            </Button>
          </Modal.Footer>

        </Modal>
      </div>

      {/* 참석자 추가 모달창 */}
      <div style={{ margin: "auto", width: "100px" }} >
        <Modal
          show={show2}
          onHide={handleClose2}
          backdrop="" centered
          dialogClassName="modal-300w"
        >
          <div style={{ boxShadow: "3px 3px 50px 1px #555555" }}>
            <Modal.Header closeButton>
              <Modal.Title>{date}참석자 추가</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <input type={"text"}></input>
              참석자
            </Modal.Body>

            <Modal.Footer>
              <Button variant="primary" onClick={handleClose2}>
                등록
              </Button>
              <Button variant="secondary" onClick={handleClose2}>
                취소
              </Button>
            </Modal.Footer>
          </div>
        </Modal>
      </div>
      {/* 풀캘린더 시작 */}
      <div style={{ display: 'grid' }}>
        <FullCalendar
          plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={'dayGridMonth'}  // 첫 화면 뷰어 설정
          // themeSystem= {'bootstrap5'} // 테마설정 
          editable={true} // 수정 가능 여부
          selectable={true} // 선택 가능 여부
          selectMirror={true} // TimeGrid 뷰에서 자리 표시자 여부
          dayMaxEvents={true} // 한 셀에 최대 이벤트(more) 표시 여부
          // weekends={this.state.weekendsVisible}
          locales={allLocales}  // 언어설정 가져오기
          locale="kr"   // 한국어로 설정
          dayCellContent={(info) => { // 일 지우기
            return info.date.getDate();
          }}
          headerToolbar={
            {
              start: 'dayGridMonth,timeGridWeek,timeGridDay',
              // left: 'prevYear',
              center: 'title',
              // right: 'nextYear',
              end: 'prev,today,next'
            }
          }
          // 커스텀버튼 만들기
          customButtons={{
            myCustomButton: {
              text: "+",
              click: () => {
                alert("dd")
              },
            },
          }}
          footerToolbar={
            {
              end: "listMonth"
            }
          }

          buttonText={{
            today: "오늘",
            month: "월",
            week: "주",
            day: "일",
            list: "이벤트 목록"
          }}
          views={{
            timeGridWeek: { buttonText: "주간" },
            timeGridDay: { buttonText: "일간" },
            listMonth: { buttonText: "목록" }
          }}
          height={"100vh"}
          style={{ width: "50px" }}
          dateClick={handleShow}
          events={event}
          dayMaxEventRows="3" // 이벤트 최대 수 잘안됌
          eventClick={handleEventClick} // 이벤트 클릭 기능 설정
        />
      </div>
      {/* 풀캘린더 끝 */}
    </div>
  );
}
export default MyCalendar;