import {
  Button,
  Divider,
  Dropdown,
  Sidebar,
  Sidenav,
  Text,
  Modal
} from 'rsuite';

import AttendMgtTree from '../components/AttendMgtTree';
import Clock from "react-live-clock";
import React, { useEffect, useState } from 'react';

// icon
import { faArrowRightFromBracket, faPersonWalking } from '@fortawesome/free-solid-svg-icons'


// css
import "../css/AttendMgtLeftbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AttendMgtLeftbar = (props) => {

  // 근태 정보
  const emp_no = props.user.emp_no

  const [todayAttendance, setTodayAttendance] = useState({
    b_num: '',
    date: '',
    check_in_time: '',
    check_out_time: '',
    work_hours: '',
    status: ''
  });
  // 근무 유형 정보
  const [work_schedules, setWork_schedules] = useState();
  // 근무 코드에 따른 정보 가져오기
  useEffect(() => {
    fetch("http://localhost:8081/attend/workType/" + emp_no)
      .then((res) => res.json())
      .then((res) => {
        setWork_schedules(res);
        fetch("http://localhost:8081/attend/attendByDate/" + emp_no, {
          method: "GET"
        })
          .then((res) => res.json())
          .then((res) => {
            // todayAttendance 값이 변경될때만 set
            if (JSON.stringify(todayAttendance) !== JSON.stringify(res)) {
              setTodayAttendance(res);
            }
          })
          .catch((error) => {
            console.log('로그인정보를 확인해주세요', error);
          })
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }, [emp_no, todayAttendance])

  const [open, setOpen] = React.useState(false);
  const check_in_open = () => setOpen(true);
  const check_in_Close = () => setOpen(false);

  // 출근 버튼 클릭시
  const check_in = () => {
    fetch("http://localhost:8081/attend/checkIn/" + emp_no + "/" + work_schedules.start_time, {
      method: "POST"
    })
      .then((res) => res.json())
      .then((res) => {
        setTodayAttendance(res);
        window.location.reload()
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }

  // 퇴근 버튼 클릭시
  const check_out = () => {
    fetch("http://localhost:8081/attend/checkOut/" + emp_no + "/" + work_schedules.end_time, {
      method: "PUT"
    })
      .then((res) => res.json())
      .then((res) => {
        setTodayAttendance(res);
        window.location.reload()
      })
      .catch((error) => {
        console.log('로그인정보를 확인해주세요', error);
      })
  }

  // 오늘 출퇴근 기록 불러오기


  // 오늘 날짜 불러오기
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("ko-KR", { weekday: "short" });
  const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}일(${dayOfWeek})`;

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
        <Text size={24} style={{ marginTop: '20px' }}>근태관리</Text>

        <Divider />
        {formattedDate} {/* 오늘 날짜 */}

        {/* 현재시각 시작 */}
        <span style={{ fontSize: "32px" }}>
          <Clock format={"HH:mm:ss"}
            ticking={true}
            timezone={"Rok"} />
        </span>
        {/* 현재시각 끝 */}
        <div>
          출근 시간 : {todayAttendance.check_in_time}<br />
          퇴근 시간 : {todayAttendance.check_out_time}
        </div>

        {/* 출퇴근 버튼 시작 */}
        <div style={{ gap: "10px", display: "flex" }}>

          <Button style={{ backgroundColor: '#CECEF2' }} onClick={check_in_open}
            disabled={!!todayAttendance.check_in_time}>  {/* 이미 누른 경우 비활성화 */}
            <FontAwesomeIcon icon={faPersonWalking} /> <p style={{ margin: '5px' }}>출근</p>
          </Button>
          <Modal open={open} onClose={check_in_Close} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
            <Modal.Header style={{width:"200px"}}>
              <Modal.Title>출근</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              출근하시겠습니까?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={check_in} appearance="primary">
                Ok
              </Button>
              <Button onClick={check_in_Close} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          <Button style={{ backgroundColor: '#CECEF2' }} onClick={check_out}
            disabled={!!todayAttendance.check_out_time || !todayAttendance.check_in_time}> {/* 이미 누른 경우 비활성화 */}
            <FontAwesomeIcon icon={faArrowRightFromBracket} /> <p style={{ margin: '5px' }}>퇴근</p>
          </Button>
        </div>
        {/* 출퇴근 버튼 끝 */}

        <Dropdown title="근무상태 변경" className="custom-dropdown">
          <Dropdown.Item>업무</Dropdown.Item>
          <Dropdown.Item>업무종료</Dropdown.Item>
          <Dropdown.Item>외근</Dropdown.Item>
          <Dropdown.Item>출장</Dropdown.Item>
          <Dropdown.Item>반차</Dropdown.Item>
        </Dropdown>

      </Sidenav.Header>
      <Divider />
      {/* header 끝 */}

      <Sidenav style={{ marginTop: '20px' }}>
        <Sidenav.Body style={{ backgroundColor: '#f0f0f0', paddingLeft: "20px" }}>
          <AttendMgtTree user={props.user} />
        </Sidenav.Body>
      </Sidenav>

    </Sidebar>
  );
};
export default AttendMgtLeftbar;