import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Content,
  Divider,
  Heading,
  List,
  Row,
} from 'rsuite';
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import allLocales from "@fullcalendar/core/locales-all";
import listPlugin from "@fullcalendar/list";
import Leftbar from '../../common/pages/Leftbar';
import AttendMgtLeftbar from './AttendMgtLeftbar';
import Header from '../../common/pages/Header';
import "../css/attendMgtMain.css";
import MyCalendar from './MyCalendar';
import Plan from '../../common/components/rightbar/Plan';
import FullCalendar from '@fullcalendar/react';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass , faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons'
const VacationHistory = () => {

  // 근태 정보 불러오기
  // const emp_no = propsParam.emp_no;
  const emp_no = "test";
  const [board, setBoard] = useState({
    b_num: '333',
    date: '',
    check_in_time: '',
    check_out_time: '',
    work_hours: '',
    status: ''
  });
  useEffect(() => {
    fetch("http://localhost:8081/api/attendMgtMain" + emp_no)
      .then((res) => res.json())
      .then((res) => {
        setBoard(res);
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [])

  // 날짜 이동 버튼
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef();

  const changeDate = (plusminus) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + plusminus
      
    );
      setCurrentDate(newDate);
      calendarRef.current.getApi().gotoDate(currentDate); // 새로운 날짜로 이동
  };
  const monthDisplay = currentDate.toLocaleString('default', {
    year: 'numeric',
    month: 'long'
  });

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>

      <Leftbar />
      <Container>

        <AttendMgtLeftbar />

        <Content style={{ marginTop: '20px' }}>
          <Header />

          <Divider style={{ margin: "0px" }} />

          <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>

            <Col style={{ marginBottom: '20px' }}>
              <div style={{ display: "flex" }}>
                <b style={{ fontSize: "20px" }}>내 연차 내역</b>

                <div style={{ display: "flex", position: "absolute", left: "50%", transform: "translateX(-50%)"}}>

                  <button onClick={() => changeDate(-1)}><FontAwesomeIcon icon={faChevronLeft} /></button>
                  <h5>{monthDisplay}</h5>
                  <button onClick={() => changeDate(1)}><FontAwesomeIcon icon={faChevronRight} /></button>
                </div>
                <br /> <br />
              </div>
              <p style={{ fontSize: "16px" }}>근태유형 A</p>

              {/* 상단 근무정보 시작 */}
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header className="headerContents" style={{ minWidth: "800px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>

                  <div>이번주 누적<br /> <p>20h57m15s</p></div>
                  <div>이번주 초과<br /> <p>0h0m0s</p></div>
                  <div>이번주 잔여<br /> <p>19h2m45s</p></div>
                  <div>이번달 누적<br /> <p>41h27m58s</p></div>
                  <div>이번달 연장<br /> <p>1h0m0s</p></div>

                </Card.Header>
              </Card>
              {/* 상단 근무정보 끝 */}
              <br></br>
              {/* 캘린더 시작 */}
              <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                <Card style={{ borderRadius: '15px', width: "48%", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

                  {/* 날짜 선택 캘린더 시작 */}

                  <Card.Header className="" style={{ minWidth: "100px", display: 'flex', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <div style={{ width: '100%' }}>
                      <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin, listPlugin, interactionPlugin]}
                        initialView={'dayGridMonth'}
                        locales={allLocales}  // 언어설정 가져오기
                        locale="kr"   // 한국어로 설정
                        height={"55vh"}
                        dayCellContent={(info) => { // 일 지우기
                          return info.date.getDate();
                        }}
                      />
                    </div>
                  </Card.Header>
                </Card>
                {/* 날짜 선택 캘린더 끝 */}

                {/* 근태 정보 캘린더 시작 */}
                <Card style={{ borderRadius: '15px', width: "48%", boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header className="" style={{ minWidth: "100px", display: 'flex', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <div style={{ width: '100%' }}>
                      <FullCalendar
                        plugins={[dayGridPlugin, bootstrap5Plugin, timeGridPlugin, interactionPlugin, listPlugin]}
                        initialView={'dayGridDay'}
                        locales={allLocales}  // 언어설정 가져오기
                        locale="kr"   // 한국어로 설정
                        height={"55vh"}
                      />
                    </div>

                  </Card.Header>
                </Card>
                {/* 근태 정보 캘린더 끝 */}

              </div>
              {/* 캘린더 끝 */}
            </Col>
          </Row>

        </Content>
      </Container>
    </Container >
  );
};
export default VacationHistory;