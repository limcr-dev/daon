import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import "../css/ScheduleCalendar.css";
import { useEffect, useState } from "react";

import "react-datepicker/dist/react-datepicker.css";
import "../css/DatePicker.css";
import "../css/Modal.css";
import ScheduleAdd from "./ScheduleAdd";
import { request } from "../../common/components/helpers/axios_helper";
import { Modal } from "rsuite";
import { useCategory } from "../components/CategoryContext";
import { formatData } from "../components/ScheduleUtil";

const MyCalendar = ({ user }) => {
  // 날짜 값 저장하는 변수
  const [pickDate, setPickDate] = useState(new Date());

  // 스케쥴 추가 모달창
  const [modalShow, setModalShow] = useState(false);

  const closeModal = () => setModalShow(false);

  // 날짜 클릭 시
  const openAddPage = (date) => {
    const selectedDate = new Date(date.dateStr);
    setPickDate(selectedDate);
    setModalShow(true); // 모달을 여는 동작
  };

  // 이벤트 클릭시
  const handleEventClick = (info) => {
    alert(info.event.description);
  };

  // 일정 불러올 변수
  const [scheduleList, setScheduleList] = useState([]);

  // 일정 불러오기
  useEffect(() => {
    request("GET", `/schedule/getSchedules/${user.emp_no}`)
      .then((res) => {
        setScheduleList(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no]);

  const { selectedCategoryNos } = useCategory([]);
  useEffect(() => {
    console.log("selectedCategoryNos:", selectedCategoryNos);  // 상태 출력
  }, [selectedCategoryNos]); 
  return (
    <div style={{ margin: "auto", width: "100%" }}>
      {/* 일정추가모달창 */}
      {/* <CategoryFilter/> */}
      {selectedCategoryNos}ㅇㅈㅇㅈ
      <Modal
        open={modalShow}
        onClose={closeModal}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          maxHeight: "1500px",
        }}
        backdrop="static"
        dialogClassName="modal-450w"
      >
        <ScheduleAdd user={user} pickDate={pickDate} />
      </Modal>
      {/* 풀캘린더 시작 */}
      {scheduleList.emp_no}
      <div className="scheduleCalendar" style={{ display: "grid" }}>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            bootstrap5Plugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView={"dayGridMonth"} // 첫 화면 뷰어 설정
          // editable={true} // 수정 가능 여부
          selectable={true} // 선택 가능 여부
          selectMirror={true} // TimeGrid 뷰에서 자리 표시자 여부
          dayMaxEvents={true} // 한 셀에 최대 이벤트(more) 표시 여부
          // weekends={this.state.weekendsVisible}
          locales={allLocales} // 언어설정 가져오기
          locale="kr" // 한국어로 설정
          dayCellContent={(info) => {
            // 일 지우기
            return info.date.getDate();
          }}
          headerToolbar={{
            start: "dayGridMonth,timeGridWeek,timeGridDay",
            // left: 'prevYear',
            center: "title",
            // right: 'nextYear',
            end: "prev,today,next",
          }}
          // 커스텀버튼 만들기
          customButtons={{
            myCustomButton: {
              text: "+",
              click: () => {
                alert("dd");
              },
            },
          }}
          footerToolbar={{
            end: "listMonth",
          }}
          buttonText={{
            today: "오늘",
            month: "월",
            week: "주",
            day: "일",
            list: "이벤트 목록",
          }}
          views={{
            timeGridWeek: { buttonText: "주간" },
            timeGridDay: { buttonText: "일간" },
            listMonth: { buttonText: "목록" },
          }}
          height={"90vh"}
          dateClick={openAddPage}
          events={formatData(scheduleList, selectedCategoryNos)}
          dayMaxEventRows="3" // 이벤트 최대 수 잘안됌
          eventClick={handleEventClick} // 이벤트 클릭 기능 설정
        />
      </div>
      {/* 풀캘린더 끝 */}
    </div>
  );
};
export default MyCalendar;
