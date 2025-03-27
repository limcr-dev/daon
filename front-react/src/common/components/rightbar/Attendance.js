import { React, useState, useEffect } from 'react';
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

        // 컴포넌트가 unmount될 때 interval 정리
        return () => clearInterval(interval);
    }, []);

    const handleCheckIn = () => {
        const currentTime = format(new Date(), 'HH:mm:ss');
        setCheckInTime(currentTime);
        setAttendanceStatus("출근 완료");
    };

    const handleCheckOut = () => {
        const currentTime = format(new Date(), 'HH:mm:ss');
        setCheckOutTime(currentTime);
        setAttendanceStatus("퇴근 완료");
    };

    return (
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h5 style={{ margin: '0 0 15px', color: '#333', fontWeight: '600' }}>근태 관리</h5>
            <p style={{ fontSize: '10px'}}>현재 시간: {currentTime}</p>
            <p style={{ fontSize: '14px'}}>출근 시간: {checkInTime || "없음"}</p>
            <p style={{ fontSize: '14px'}}>퇴근 시간: {checkOutTime || "없음"}</p>
            <p >
                <Badge color={attendanceStatus === "출근 완료" ? "green" : (attendanceStatus === "퇴근 완료" ? "blue" : "red")}>
                    {attendanceStatus}
                </Badge>
            </p>
             <Divider/>
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

            {/* 출근/퇴근 버튼 */}
            <div>
                
            </div>
        </div>
    );
};

export default Attendance;
