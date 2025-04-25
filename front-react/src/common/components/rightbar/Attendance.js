import React, { useState, useEffect } from 'react';
import { Badge, Button, Divider } from 'rsuite';
import { format } from 'date-fns';

const Attendance = () => {
  const [attendanceStatus, setAttendanceStatus] = useState("결근");
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(format(new Date(), 'HH:mm:ss'));

  // 실시간으로 현재 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), 'HH:mm:ss'));
    }, 1000);

    return () => clearInterval(interval); // 정리
  }, []);

  const handleCheckIn = () => {
    const time = format(new Date(), 'HH:mm:ss');
    setCheckInTime(time);
    setAttendanceStatus("출근 완료");
  };

  const handleCheckOut = () => {
    const time = format(new Date(), 'HH:mm:ss');
    setCheckOutTime(time);
    setAttendanceStatus("퇴근 완료");
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h5 style={{ margin: '0 0 15px', color: '#333', fontWeight: '600' }}>근태 관리</h5>

      <p style={{ fontSize: '10px' }}>현재 시간: {currentTime}</p>
      <p style={{ fontSize: '14px' }}>출근 시간: {checkInTime || "없음"}</p>
      <p style={{ fontSize: '14px' }}>퇴근 시간: {checkOutTime || "없음"}</p>

      {/* 🔧 <p> 대신 <div> 사용하여 DOM nesting 오류 해결 */}
      <div style={{ margin: '10px 0' }}>
        <Badge
          color={
            attendanceStatus === "출근 완료" ? "green" :
            attendanceStatus === "퇴근 완료" ? "blue" : "red"
          }
        >
          {attendanceStatus}
        </Badge>
      </div>

      <Divider />

      {/* 버튼 영역 */}
      {attendanceStatus !== "출근 완료" && (
        <Button
          color="green"
          onClick={handleCheckIn}
          style={{ width: '100%', borderRadius: '25px', fontSize: '16px' }}
        >
          출근
        </Button>
      )}

      {attendanceStatus === "출근 완료" && (
        <Button
          color="blue"
          onClick={handleCheckOut}
          style={{ width: '100%', borderRadius: '25px', fontSize: '16px' }}
        >
          퇴근
        </Button>
      )}
    </div>
  );
};

export default Attendance;
