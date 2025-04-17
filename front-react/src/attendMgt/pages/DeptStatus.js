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
import allLocales from "@fullcalendar/core/locales-all";
import { ko } from 'date-fns/locale';

// data

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css"
// icon
import VacationFooter from './VacationFooter';
import MoveDateHeader from './MoveDateHeader';

import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from '@fullcalendar/react';
const DeptStatus = () => {

    const [employees, setEmployees] = useState({
        emp_no: '1002',
        work_type_no: ''
    });

    // 근무 유형 정보
    const [work_schedules, setWork_schedules] = useState({
        type_name: '',
        start_time: '',
        end_time: '',
    });

    // 날짜 이동 버튼 시작
    const [currentDate, setCurrentDate] = useState(new Date());

    // 초기 날짜 설정
    const [moveDate, setMoveDate] = useState({
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1
    });

    return (
        <div>
            <Container style={{ minHeight: '100vh', width: '100%' }}>

                <Leftbar />
                <Container>

                    <AttendMgtLeftbar emp_no={employees.emp_no} work_schedules={work_schedules} />

                    <Content style={{ marginTop: '20px' }}>
                        <Header />

                        <Divider style={{ margin: "0px" }} />

                        <Row gutter={20} style={{ padding: '15px', display: 'flex', flexDirection: 'column', }}>
                            <Col>
                            {/* <MoveDateHeader/> */}
                             <table>
                                <tr>
                                    <th>ddd</th>
                                </tr>
                             </table>
                              
                                
                            </Col>
                        </Row>
                    </Content>
                </Container>
            </Container >
        </div>
    );
};

export default DeptStatus;