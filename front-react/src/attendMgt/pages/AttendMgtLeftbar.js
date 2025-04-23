import {
  Button,
  Divider,
  Dropdown,
  Sidebar,
  Sidenav,
  Text,
  Modal,
} from "rsuite";

// 공통 js
import { request } from '../../common/components/helpers/axios_helper';

import AttendMgtTree from "../components/AttendMgtTree";
import Clock from "react-live-clock";
import React, { useEffect, useState } from "react";

// icon
import {
  faArrowRightFromBracket,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
// css
import "../css/AttendMgtLeftbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AttendMgtLeftbar = (props) => {
  // 직원코드
  const emp_no = props.user.emp_no;

  // 오늘 근태정보 불러올 변수
  const [todayAttendance, setTodayAttendance] = useState({
    date: "",
    check_in_time: "",
    check_out_time: "",
    vacation: "",
  });
  // 근무 유형정보 불러올 변수
  const [work_schedules, setWork_schedules] = useState();

  // 직원 코드에 따른 근무 유형정보 불러오기
  useEffect(() => {
    request("GET", "/attend/workType/" + emp_no)
      .then((res) => {
        setWork_schedules(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [emp_no]);

  // 오늘 근태정보 불러오기
  useEffect(() => {
    request("GET", "/attend/attendByDate/" + emp_no)
      .then((res) => {
        setTodayAttendance(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [emp_no])

  // 출퇴근 확인 모달창 시작
  const [inOpen, setInOpen] = useState(false);
  const [outOpen, setOutOpen] = useState(false);

  const check_in_open = () => setInOpen(true);
  const check_in_Close = () => setInOpen(false);
  const check_out_open = () => setOutOpen(true);
  const check_out_Close = () => setOutOpen(false);
  // 출퇴근 확인 모달창 끝

  // 출근 버튼 클릭 시 (근무유형의 시작시간을 가져가 인서트)
  const check_in = () => {
    request("POST", "/attend/checkIn/" + emp_no + "/" + work_schedules.start_time)
      .then((res) => {
        setTodayAttendance(res.data);
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  };

  // 퇴근 버튼 클릭시(근무유형의 종료시간을 가져가 업데이트)
  const check_out = () => {
    request("PUT", "/attend/checkOut/" + emp_no + "/" + work_schedules.end_time)
      .then((res) => {
        setTodayAttendance(res.data);
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  };

  // 오늘 날짜 불러오기
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString("ko-KR", { weekday: "short" });
  const formattedDate = `${today.getFullYear()}-${today.getMonth() + 1
    }-${today.getDate()}일(${dayOfWeek})`;

  return (
    <Sidebar style={{ backgroundColor: "#f0f0f0", width: "150px" }}>
      {/* header 시작 */}
      <Sidenav.Header
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Text size={24} style={{ marginTop: "20px" }}>
          근태관리  
        </Text>
        <Divider />
        {formattedDate} {/* 오늘 날짜 */}
        {/* 현재시각 시작 */}
        <span style={{ fontSize: "32px" }}>
          <Clock format={"HH:mm:ss"} ticking={true} timezone={"Rok"} />
        </span>
        {/* 현재시각 끝 */}
        <div>
          출근 시간 : {todayAttendance.check_in_time}
          <br />
          퇴근 시간 : {todayAttendance.check_out_time}
        </div>
        {/* 출퇴근 버튼 시작 */}
        <div style={{ gap: "10px", display: "flex" }}>

          {/* 출근 버튼 */}
          <Button
            style={{ backgroundColor: "#CECEF2" }}
            onClick={check_in_open}
            // 이미 누른 경우 비활성화
            disabled={!!todayAttendance.check_in_time || !!todayAttendance.vacation}>
            <FontAwesomeIcon icon={faPersonWalking} />
            <p style={{ margin: "5px" }}>출근</p>
          </Button>

          {/* 출근확인 모달창 시작 */}
          <Modal
            open={inOpen}
            onClose={check_in_Close}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Header style={{ width: "200px" }}>
              <Modal.Title>출근</Modal.Title>
            </Modal.Header>
            <Modal.Body>출근하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <Button onClick={check_in} appearance="primary">
                Ok
              </Button>
              <Button onClick={check_in_Close} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 출근확인 모달창 끝 */}

          {/* 퇴근 버튼 */}
          <Button
            style={{ backgroundColor: "#CECEF2" }}
            onClick={check_out_open}
            // 이미 누른 경우 비활성화
            disabled={!!todayAttendance.check_out_time || !todayAttendance.check_in_time}>
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <p style={{ margin: "5px" }}>퇴근</p>
          </Button>

          {/* 퇴근 확인 모달창 시작 */}
          <Modal
            open={outOpen}
            onClose={check_out_Close}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Modal.Header style={{ width: "200px" }}>
              <Modal.Title>퇴근</Modal.Title>
            </Modal.Header>
            <Modal.Body>퇴근하시겠습니까?</Modal.Body>
            <Modal.Footer>
              <Button onClick={check_out} appearance="primary">
                Ok
              </Button>
              <Button onClick={check_out_Close} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
          {/* 퇴근 확인 모달창 끝 */}
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

      <Sidenav style={{ marginTop: "20px" }}>
        <Sidenav.Body style={{ backgroundColor: "#f0f0f0", paddingLeft: "20px" }} >
          {/* 레프트 바 트리 구조 */}
          <AttendMgtTree user={props.user} />
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};
export default AttendMgtLeftbar;
