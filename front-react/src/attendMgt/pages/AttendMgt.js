import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Divider,
  Row,
} from 'rsuite';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import FullCalendar from '@fullcalendar/react';

// 공통 js
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import { request } from '../../common/components/helpers/axios_helper';
// data
import History from './History'

// css
import "../css/AttendCalendar.css";
import "../css/AttendCommon.css";

// js
import AttendFooter from './AttendFooter';
import MoveDateHeader from './MoveDateHeader';
import AttendMgtLeftbar from './AttendMgtLeftbar';
import ColorLegend from '../components/ColorLegend';
import { useUser } from '../../common/contexts/UserContext';

const AttendMgt = () => {

  // UserContext에서 사용자 정보 가져오기
  const { user } = useUser();

  // 근무 유형 정보
  const [work_schedules, setWork_schedules] = useState({
    type_name: ''
  });

  // 직원 코드에 따른 근무유형 이름 가져오기
  useEffect(() => {
    request("GET", "/attend/workType/" + user.emp_no)
      .then((res) => {
        setWork_schedules(res.data);
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [user.emp_no])

  // 날짜 이동 버튼 시작
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef();
  const dayRef = useRef();

  // currentDate 변경 시
  useEffect(() => {
    calendarRef.current.getApi().gotoDate(currentDate); // 새로운 날짜로 이동
  }, [currentDate])

  // 초기 날짜 설정
  const [moveDate, setMoveDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });
  // 날짜 이동 버튼 끝


  // 날짜, 이벤트 클릭 시 오른쪽 캘린더 날짜 변경
  const handleShow = (pickDate) => {
    dayRef.current.getApi().gotoDate(pickDate.dateStr); // 날짜 클릭 시 날짜로 이동
  }
  const eventhandleShow = (pickEvent) => {
    dayRef.current.getApi().gotoDate(pickEvent.event.start); // 이벤트 클릭 시 날짜로 이동
  }

  // 캘린더 데이터 불러오기
  const [attendHistoryList, setAttendHistoryList] = useState([])
  // 캘린더 데이터 반환 후 attendHistory리스트에 값 저장
  const handleAttendanceData = (data) => {
    setAttendHistoryList(data);
  };

  // 출퇴근 통계 불러올 변수
  const [attendance, setAttendance] = useState({
    date: '',
    normal: '',
    check_in_time: '',
    check_out_time: '',
    late: '',
    early_leave: '',
    absent: ''
  });

  // 출퇴근 통계 불러오기
  useEffect(() => {
    request("GET", "/attend/attendCnt/" + user.emp_no + "/" + moveDate.year + "/" + moveDate.month)
      .then((res) => {
          setAttendance(res.data);
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [user.emp_no, moveDate])

  return (
    <Container className="attendContainer">
      <Leftbar />
      <Container style={{ height: '1050px', width: '100%' }}>

        <AttendMgtLeftbar user={user} />

        <Content style={{ marginTop: '20px' }}>
          <Header />

          {/* 캘린더 데이터 가져오기 */}
          <History
            emp_no={user.emp_no}
            moveDate={moveDate}
            onDataFetched={handleAttendanceData}
            attendance={attendance} />

          <Divider style={{ margin: "0px" }} />

          <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
            <Col>
              {/* 상단 날짜 이동 헤더  */}
              <MoveDateHeader
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                setMoveDate={setMoveDate}
                pageName={'내 근태 현황'} />

              <p style={{ fontSize: "16px" }}>
                {work_schedules.type_name}
              </p>
              {/* 상단 날짜 이동 버튼 시작 끝 */}

              {/* 상단 근무통계 시작 */}
              <Card className="attendCard" >
                <Card.Header className="cardHeaderContents">
                  <div>정상근무<br /> <p>{attendance.normal}</p></div>
                  <div>지각<br /> <p>{attendance.late}</p></div>
                  <div>조퇴<br /> <p>{attendance.early_leave}</p></div>
                  <div>결근<br /> <p>{attendance.absent}</p></div>
                  <div>연차/휴가 사용 횟수<br /> <p>{attendance.vacation}</p></div>
                </Card.Header>
              </Card>
              <br />
              {/* 상단 근무통계 끝 */}

              {/* 캘린더 시작 */}
              <div className='attendCalendar' style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Card className="attendCard" style={{ width: "68%" }}>

                  {/* 날짜 선택 캘린더 시작 */}
                  <Card.Header className="leftCalendar">
                    <div style={{ width: '100%' }}>
                      <FullCalendar
                        ref={calendarRef}
                        plugins={
                          [dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin]
                        }
                        initialView={'dayGridMonth'}
                        locales={allLocales}  // 언어설정 가져오기
                        locale="kr"   // 한국어로 설정
                        height={"58vh"} // 높이 설정
                        dayCellContent={(info) => { // 일 지우기
                          return info.date.getDate();
                        }}
                        headerToolbar={
                          {
                            start: '',
                            center: 'title',
                            end: ''
                          }
                        }
                        dateClick={handleShow}
                        eventClick={eventhandleShow}
                        dayMaxEventRows={2} // 한번에 보여줄 이벤트 갯수
                        events={attendHistoryList}
                      />
                    </div>
                  </Card.Header>
                </Card>
                {/* 날짜 선택 캘린더 끝 */}

                {/* 세부 정보 캘린더 시작 */}
                <Card className="attendCard" style={{ width: "30%" }}>
                  <Card.Header className="rightCalendar">
                    <div style={{ width: '100%' }}>
                      <FullCalendar
                        ref={dayRef}
                        plugins={
                          [dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin]
                        }
                        initialView={'timeGridDay'}
                        locales={allLocales}  // 언어설정 가져오기
                        locale="kr"   // 한국어로 설정
                        height={"55vh"}
                        headerToolbar={
                          {
                            start: '',
                            center: 'title',
                            end: ''
                          }
                        }
                        events={attendHistoryList}
                      />
                      <ColorLegend />
                    </div>
                  </Card.Header>
                </Card>
                {/* 세부 정보 캘린더 끝 */}
              </div>
              {/* 캘린더 끝 */}
              <br />
              {/* 변경 이력 */}
              <AttendFooter emp_no={user.emp_no} year={moveDate.year} month={moveDate.month} />
            </Col>
          </Row>
        </Content>
      </Container>
    </Container >
  );
};
export default AttendMgt;