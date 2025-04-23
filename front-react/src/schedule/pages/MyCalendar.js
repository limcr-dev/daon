import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import '../css/ScheduleCalendar.css';
import { useState } from "react";



import "react-datepicker/dist/react-datepicker.css";
import '../css/DatePicker.css';
import '../css/Modal.css';
import ScheduleAdd from "./ScheduleAdd";


const MyCalendar = ({user}) => {

  // 날짜 값 저장하는 변수
  const [pickDate, setPickDate] = useState();

  // 스케쥴 추가 모달창
  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => setModalShow(false);

  const openAddPage = (date) => {
    setPickDate(date.dateStr);
    setModalShow(true);
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


  return (
    <div style={{ margin: "auto", maxWidth: "1200px" }}>

      {/* 일정추가모달창 */}
      <ScheduleAdd open={modalShow} onClose={closeModal} user={user} pickDate={pickDate}/>

      
      {/* 풀캘린더 시작 */}
      <div className="scheduleCalendar" style={{ display: 'grid' }}>
        <FullCalendar
          plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin, listPlugin]}
          initialView={'dayGridMonth'}  // 첫 화면 뷰어 설정
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
          height={"95vh"}
          dateClick={openAddPage}
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