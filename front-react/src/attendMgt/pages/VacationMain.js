import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Divider,
  Popover,
  Row,
  Whisper,
} from 'rsuite';

import Leftbar from '../../common/pages/Leftbar';
import AttendMgtLeftbar from './AttendMgtLeftbar';
import Header from '../../common/pages/Header';

// data

// css
import "../css/AttendCalendar.css";
import "../css/AttendMgtMain.css";

// icon
import VacationFooter from './VacationFooter';
import MoveDateHeader from './MoveDateHeader';

const VacationMain = () => {

  const [employees, setEmployees] = useState({
    emp_no: '1010',
    work_type_no: ''
  });
  
  // 근무 유형 정보
  const [work_schedules, setWork_schedules] = useState({
    type_name: '',
    start_time: '',
    end_time: '',
  });

  // 근무 유형 정보
  const [vacation_occur, setVacation_occur] = useState({
    earned_days : '',
    expire_date	: '',
    occur_reason : '',
    create_at : '',
  });

  // 날짜 이동 버튼 시작
  const [currentDate, setCurrentDate] = useState(new Date());

  // 초기 날짜 설정
  const [moveDate, setMoveDate] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1
  });

  // 연차 목록
  useEffect(() => {
    fetch("http://localhost:8081/attend/attendCnt/" + employees.emp_no + "/" + moveDate.year + "/" + moveDate.month, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((res) => {
        // moveDate 값이 변경될때만 set (날짜 이동 버튼 클릭 시에만)
        if (JSON.stringify(moveDate) !== JSON.stringify(res)) {
          setVacation_occur(res);
        }
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [employees.emp_no, moveDate])

  // 발생 연차 설명
  const vacationInfo = (
    <Popover style={{ minWidth: "300px", whiteSpace: "pre-line", padding: "10px" }} arrow={false}>
      <div>
        <b>1년 미만 근속자</b><br />
        - 입사 후 1개월 근무할 때마다 1일씩 지급<br />
        - 최대 1년간 11일 발생<br />
        - 단, 1년 이상 근속 시 기존 지급분(최대 11일)은 차감됨<br /><br />

        <b>1년 이상 근속자</b><br />
        - 1년 근속 시 15일 지급<br />
        - 이후 2년마다 1일 추가 지급, 최대 25일까지 가능<br />
        - 예: 3년차 16일, 5년차 17일, … 21년차 25일<br />
        - 1년간 소정 근로일의 80% 이상 출근해야 발생
      </div>
    </Popover>
  )

  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>

          <AttendMgtLeftbar emp_no={employees.emp_no} work_schedules={work_schedules} />

          <Content style={{ marginTop: '20px' }}>
            <Header />

            <Divider style={{ margin: "0px" }} />

            <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
              <Col>
                {/* 상단 날짜 이동 헤더  */}
                <MoveDateHeader currentDate={currentDate} setCurrentDate={setCurrentDate} setMoveDate={setMoveDate} />

                {/* 상단 연차 내역 시작 */}
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header className="headerContents" style={{ minWidth: "800px", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '30px', paddingBottom: '30px', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <div>발생 연차
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo}
                      > 💡
                      </Whisper>
                      <p>0</p>
                    </div>
                    <div>발생 월차<br /> <p>0</p></div>
                    <div>이월 연차<br /> <p>0</p></div>
                    <div>총 연차<br /> <p>17</p></div>
                    <div>사용 연차<br /> <p>3</p></div>
                    <div>잔여 연차<br /> <p>14</p></div>

                  </Card.Header>
                </Card>
                <br />
                {/* 상단 연차 내역 끝 */}

                {/* 연차 사용 내역 시작 */}
                  <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Header style={{ justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>사용 내역</span>
                    </Card.Header>
                    <table className='board-table'>
                      <tr>
                        <th>휴가종류</th>
                        <th>연차 사용기간</th>
                        <th>사용 연차</th>
                        <th>사유</th>
                      </tr>
                      <tr>
                        <td>연차</td>
                        <td>2025-03-20 ~ 2025-03-22</td>
                        <td>2</td>
                        <td>개인사유</td>
                      </tr>
                      <tr>
                        <td>연차</td>
                        <td>2025-03-20 ~ 2025-03-22</td>
                        <td>2</td>
                        <td>개인사유</td>
                      </tr>
                    </table>
                  </Card>
                {/* 연차 사용 내역 끝 */}
                <br />
                {/* 생성 내역 시작 */}
                <VacationFooter emp_no={employees.emp_no} year={moveDate.year} month={moveDate.month} />
                {/* 생성 내역 끝 */}
              </Col>
            </Row>
          </Content>
        </Container>
      </Container >
    </div>
  );
};

export default VacationMain;