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
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import FullCalendar from '@fullcalendar/react';

// 공통 js
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';

// data
import History from './History'

// css
import "../css/AttendCalendar.css";
import "../css/AttendCommon.css";

// js
import AttendFooter from './AttendFooter';
import MoveDateHeader from './MoveDateHeader';
import AttendMgtLeftbar from './AttendMgtLeftbar';
import ColorLegned from '../components/ColorLegned';

const AttendMgt = () => {

  // 직원 정보 불러오기
  // const emp_no = propsParam.emp_no;  // props로 받아온 값 emp_no로 저장 

  // 직원 정보
  const [employees, setEmployees] = useState({
    emp_no: '1019'
  });

  // 근무 유형 정보
  const [work_schedules, setWork_schedules] = useState({
    type_name: ''
  });

  // 직원 코드에 따른 근무유형 이름 가져오기
  useEffect(() => {
    fetch("http://localhost:8081/attend/workType/" + employees.emp_no)
      .then((res) => res.json())
      .then((res) => {
        setWork_schedules(res);
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [])

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

  // 출퇴근 통계 불러오기
  const [attendance, setAttendance] = useState({
    date: '',
    normal: '',
    check_in_time: '',
    check_out_time: '',
    late: '',
    early_leave: '',
    out_status: '',
    absent: ''
  });

  useEffect(() => {
    fetch("http://localhost:8081/attend/attendCnt/" + employees.emp_no + "/" + moveDate.year + "/" + moveDate.month, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => {
        // moveDate 값이 변경될때만 set (날짜 이동 버튼 클릭 시에만)
        if (JSON.stringify(moveDate) !== JSON.stringify(res)) {
          setAttendance(res);
        }
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [employees.emp_no, moveDate])
  // 출퇴근 통계 불러오기 끝

  // return
  return (
    <Container className="attendContainer">
      <Leftbar />
      <Container>

        <AttendMgtLeftbar emp_no={employees.emp_no} />

        <Content style={{ marginTop: '20px' }}>
          <Header />

          {/* 캘린더 데이터 가져오기 */}
          <History
            emp_no={employees.emp_no}
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
                setMoveDate={setMoveDate} />

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
                  <div>외출<br /> <p>{attendance.out_status}</p></div>
                  <div>결근<br /> <p>{attendance.absent}</p></div>
                  <div>이번달 연장<br /> <p>1h30m</p></div>
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
                            bootstrap5Plugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                            interactionPlugin]
                        }
                        initialView={'dayGridMonth'}
                        locales={allLocales}  // 언어설정 가져오기
                        locale="kr"   // 한국어로 설정
                        height={"58vh"}
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
                        dayMaxEventRows={2}
                        events={attendHistoryList}
                      />
                    </div>
                  </Card.Header>
                </Card>
                {/* 날짜 선택 캘린더 끝 */}

                {/* 근태 정보 캘린더 시작 */}
                <Card className="attendCard" style={{ width: "30%" }}>
                  <Card.Header className="rightCalendar">
                    <div style={{ width: '100%' }}>
                      <FullCalendar
                        ref={dayRef}
                        plugins={
                          [dayGridPlugin,
                            bootstrap5Plugin,
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
                      <ColorLegned />
                    </div>
                  </Card.Header>
                </Card>
                {/* 근태 정보 캘린더 끝 */}
              </div>
              {/* 캘린더 끝 */}
              <br />
              {/* 변경 이력 */}
              <AttendFooter emp_no={employees.emp_no} year={moveDate.year} month={moveDate.month} />
            </Col>
          </Row>
        </Content>
      </Container>
    </Container >
  );
};
export default AttendMgt;