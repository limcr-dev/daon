import {
  Button,
  Divider,
  Sidebar,
  Sidenav,
  Text,
} from 'rsuite';

import ScheduleTree from '../components/ScheduleTree';
import { useEffect, useState } from 'react';

// icon
import { faCalendarPlus } from '@fortawesome/free-solid-svg-icons'

// css
import "../css/ScheduleLeftbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ScheduleLeftbar = (props) => {
  
  // 직원 정보
  const emp_no = props.emp_no

  // 오늘 날짜 불러오기
  // const today = new Date();
  // const dayOfWeek = today.toLocaleDateString("ko-KR", { weekday: "short" });
  // const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}일(${dayOfWeek})`;

  const check_in = () => {
    fetch("http://localhost:8081/attend/checkIn/", {
      method: "POST"
    })
      .then((res) => res.json())
      .then((res) => {
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }

  return (
    <Sidebar style={{ backgroundColor: '#f0f0f0', width: '150px' }} >
      {/* header 시작 */}
      <Sidenav.Header
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
        <Text size={24} style={{ marginTop: '20px' }}>일정</Text>
        <Divider />

        {/* 출퇴근 버튼 시작 */}
        <div style={{ gap: "10px", display: "flex" }}>

          <Button style={{ backgroundColor: '#CECEF2' }} onClick={check_in}>
            <FontAwesomeIcon icon={faCalendarPlus} /> <p style={{ margin: '5px' }}>일정 등록</p>
          </Button>
        </div>
        {/* 출퇴근 버튼 끝 */}

      </Sidenav.Header>
      <Divider />
      {/* header 끝 */}

      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0', padding:"20px"}}>
          <ScheduleTree emp_no={emp_no}/>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default ScheduleLeftbar;