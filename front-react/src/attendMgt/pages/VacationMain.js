import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  DatePicker,
  Divider,
  Row,
  Whisper,
} from 'rsuite';

// 공통 js
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import { request } from '../../common/components/helpers/axios_helper';

// css
import "../css/AttendCalendar.css";
import "../css/AttendCommon.css"

// js
import AttendMgtLeftbar from './AttendMgtLeftbar';
import VacationFooter from './VacationFooter';
import { useUser } from '../../common/contexts/UserContext';
import VacationHistory from './VacationHistory';
import { getCurrentVacationCycle, getExpireDate, getUsedVacation } from '../components/VacationUtil';
import { formatDate } from '../components/CommonUtil';
import { vacationInfo, vacationInfo2, vacationInfo3, vacationInfo4 } from "../components/Info";

const VacationMain = () => {

  // 직원 정보
  const { user } = useUser();

  const [employees, setEmployees] = useState({});

  const [vacation_occurList, setVacation_occurList] = useState([]);

  const [vacationHistoryList, setVacationHistoryList] = useState([]);

  // 가장 빠른 만료 예정일, 잔여 연차, 총 연차 불러오기
  const { maxExpireDate, remainVacation, createVacation } = getExpireDate(vacation_occurList);

  // 입사일 기준 이번 주기 시작,끝 날짜 불러오기
  const { start, end } = getCurrentVacationCycle(employees.hire_date);

  // 사용연차 수 불러오기
  const { useVacation } = getUsedVacation(vacationHistoryList, start, end);

  useEffect(() => {
    // 입사일 가져오기
    request("GET", "/api/getEmpInfo/" + user.emp_no)
      .then((res) => {
        setEmployees(res.data);

        // 휴가정보 불러오기
        request("GET", "/attend/vacation_log/" + user.emp_no)
          .then((res) => {
            setVacation_occurList(res.data);
          })
        // 휴가 사용기록 불러오기
        request("GET", "/attend/vacationHistory/" + user.emp_no)
          .then((res) => {
            setVacationHistoryList(res.data);
          })
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [user.emp_no])

  // <<< 날짜 선택 시작 >>>
  // 초기 날짜 설정
  const currentDate = new Date();
  const [moveDate, setMoveDate] = useState({
    startDate: currentDate.getFullYear() + "-01-01",
    endDate: currentDate.getFullYear() + "-12-31",
  });

  // 1번 데이트피커 선택
  const startDatePick = (startDatePick) => {
    if (startDatePick != null) {
      setMoveDate(prev => ({
        ...prev,// endDate값 보존
        startDate: formatDate(startDatePick),
      }));
    }
  }
  // 2번 데이트피커 선택
  const endDatePick = (endDatePick) => {
    if (endDatePick != null) {
      setMoveDate(prev => ({
        ...prev, // startDate값 보존
        endDate: formatDate(endDatePick),
      }));
    }
  }
  // <<< 날짜 선택 끝 >>>

  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>

          <AttendMgtLeftbar user={user} />

          <Content style={{ marginTop: '20px' }}>
            <Header />

            <Divider style={{ margin: "0px" }} />

            <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column' }}>
              <Col>
                {/* 상단 날짜 */}
                <div style={{ display: 'flex' }}>
                  <b style={{ fontSize: "20px" }}>내 연차 내역</b>
                  <div className='headCenter'>
                    <h5>
                      {start} ~ {end}
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo2}
                      > 💡
                      </Whisper>
                    </h5>
                  </div><br /><br />
                </div>

                {/* 상단 연차 내역 시작 */}
                <Card className="attendCard" >
                  <Card.Header className="cardHeaderContents" >
                    <div>발생 연차
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo}
                      > 💡
                      </Whisper>
                      <p>{createVacation}</p>
                    </div>
                    <div>사용 연차<br /> <p>{useVacation}</p></div>
                    {/* 결재승인 시 사용가능연차 업데이트 완료 후{remainVacation}로 바꿀 예정 */}
                    <div>잔여 연차<br /> <p>{createVacation - useVacation}</p></div>
                    <div>만료 예정
                      <Whisper
                        placement="right"
                        trigger="click"
                        speaker={vacationInfo3}
                      > 💡
                      </Whisper>
                      {maxExpireDate && <p>{maxExpireDate} </p>}
                    </div>
                    <div>입사일<br /> <p>{employees.hire_date}</p></div>
                  </Card.Header>
                </Card>
                <br />
                {/* 상단 연차 내역 끝 */}

                {/* 연차 사용,생성 내역 시작 */}
                <div style={{ display: "flex" }}> </div>
                <p style={{ fontSize: "16px" }}>기간 선택 (사용 / 생성 내역)
                  <Whisper
                    placement="right"
                    trigger="click"
                    speaker={vacationInfo4}
                  > 💡
                  </Whisper></p>
                <DatePicker oneTap format="yyyy-MM-dd" onChange={startDatePick} value={new Date(moveDate.startDate)} />~
                <DatePicker oneTap format="yyyy-MM-dd" onChange={endDatePick} value={new Date(moveDate.endDate)} />
                <br></br><br></br>
                <VacationHistory moveDate={moveDate} vacationHistoryList={vacationHistoryList} />

                <br />
                {/* 생성 내역 */}
                <VacationFooter moveDate={moveDate} vacation_occurList={vacation_occurList} />
                {/* 연차 사용,생성 내역 끝 */}
              </Col>
            </Row>
          </Content>
        </Container>
      </Container >
    </div >
  );
};

export default VacationMain;