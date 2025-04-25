import React, { useState, useEffect } from 'react';
import { Badge, Button, Divider, Modal } from 'rsuite';
import { format } from 'date-fns';
import { useUser } from '../../contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// icon
import {
  faArrowRightFromBracket,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import { request } from '../helpers/axios_helper';

const Attendance = () => {

  // UserContext에서 사용자 정보 가져오기
  const { user } = useUser();

  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

  // 오늘 근태정보 불러올 변수
  const [todayAttendance, setTodayAttendance] = useState({
    date: "",
    check_in_time: "",
    check_out_time: "",
    vacation: "",
    late: "",
    early_leave: "",
    absent: "",
    vacation: "",
  });
  // 근무 유형정보 불러올 변수
  const [work_schedules, setWork_schedules] = useState();

  // 직원 코드에 따른 근무 유형정보 불러오기
  useEffect(() => {
    request("GET", "/attend/workType/" + user.emp_no)
      .then((res) => {
        setWork_schedules(res.data);
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no]);

  // 오늘 근태정보 불러오기
  useEffect(() => {
    request("GET", "/attend/attendByDate/" + user.emp_no)
      .then((res) => {
        if (res.data !== null) {
          setTodayAttendance(res.data);
        }
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  }, [user.emp_no])

  // 출퇴근 확인 모달창 시작
  const [inOpen, setInOpen] = useState(false);
  const [outOpen, setOutOpen] = useState(false);

  const check_in_open = () => setInOpen(true);
  const check_in_Close = () => setInOpen(false);
  const check_out_open = () => setOutOpen(true);
  const check_out_Close = () => setOutOpen(false);

  // 출근 버튼 클릭 시 (근무유형의 시작시간을 가져가 인서트)
  const check_in = () => {
    request("POST", "/attend/checkIn/" + user.emp_no + "/" + work_schedules.start_time)
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
    request("PUT", "/attend/checkOut/" + user.emp_no + "/" + work_schedules.end_time)
      .then((res) => {
        setTodayAttendance(res.data);
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        console.log("로그인정보를 확인해주세요", error);
      });
  };

  // 실시간으로 현재 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);
    return () => clearInterval(interval); // 정리
  }, []);

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      <h5 style={{ margin: '0 0 15px', color: '#333', fontWeight: '600' }}>근태 관리</h5>

      <p style={{ fontSize: '10px' }}>현재 시간: {currentTime}</p>
      <p style={{ fontSize: '14px' }}>출근 시간: {todayAttendance.check_in_time || "없음"}</p>
      <p style={{ fontSize: '14px' }}>퇴근 시간: {todayAttendance.check_out_time || "없음"}</p>

      <Divider />
      {/* 모달 시작 */}
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
      {/* 모달 끝 */}

      {/* 출근 버튼 */}
      <Button
        color="green"
        onClick={check_in_open}
        style={{ width: '100%', borderRadius: '25px', fontSize: '16px' }}
        // 이미 누른 경우 비활성화
        disabled={!!todayAttendance.check_in_time || !!todayAttendance.vacation}>
        <FontAwesomeIcon icon={faPersonWalking} />
        <p style={{ margin: "5px" }}>출근</p>{todayAttendance.check_in_time}
      </Button>

      {/* 퇴근 버튼 */}
      <Button
        color="green"
        style={{ width: '100%', borderRadius: '25px', fontSize: '16px' }}
        onClick={check_out_open}
        // 이미 누른 경우 비활성화
        disabled={!!todayAttendance.check_out_time || !todayAttendance.check_in_time}>
        <FontAwesomeIcon icon={faArrowRightFromBracket} />
        <p style={{ margin: "5px" }}>퇴근</p>
      </Button>
    </div>
  );
};

export default Attendance;
