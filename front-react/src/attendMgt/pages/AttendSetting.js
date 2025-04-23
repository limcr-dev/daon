import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Content, DatePicker, Divider, Input, InputGroup, Row, Whisper } from "rsuite";

import { useParams } from "react-router-dom";

// 공통 js
import Leftbar from "../../common/pages/Leftbar";
import Header from "../../common/pages/Header";
import { request } from '../../common/components/helpers/axios_helper';

// css
import "../css/AttendCalendar.css";
import "../css/DeptStatus.css";

// js
import AttendMgtLeftbar from "./AttendMgtLeftbar";
import { useUser } from "../../common/contexts/UserContext";
import { deptStatusInfo } from "../components/Info";
import { formatDate, getStatusText } from '../components/CommonUtil';
import { getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import AttendPaging from "../components/AttendPaging";
import ColorLegend from "../components/ColorLegend";

const AttendSetting = () => {
    // 직원 정보
    const { user } = useUser();
    return (
        <div>
            <Container style={{ minHeight: "100vh", width: "100%" }}>
                <Leftbar />
                <Container>
                    <AttendMgtLeftbar user={user} />

                    <Content style={{ marginTop: "20px" }}>
                        <Header />

                        <Divider style={{ margin: "0px" }} />

                        <Row
                            gutter={20}
                            style={{
                                padding: "15px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Col>
                                <div style={{ display: 'flex' }}>
                                    <b style={{ fontSize: "20px" }}>전사 근태 설정</b><br /><br />
                                </div>
                                <p style={{ fontSize: "16px" }}>근무 타입 설정
                                </p>
                                <div style={{ display: "flex" }}>
                                
                                </div>
                                <br /><br />
                                <Card className="attendCard">
                                    <Card.Header className="cardHeaderList">
                                        <span style={{ fontWeight: '600', fontSize: '16px' }}>근태현황</span>
                                    </Card.Header>
                                    <table className='board-table'>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%", textAlign: "center" }}>직원명</th>
                                                <th style={{ width: "10%", textAlign: "center" }}>근무타입</th>
                                                <th style={{ width: "10%", textAlign: "center" }}>부서명</th>
                                                <th style={{ width: "8%", textAlign: "center" }}>직급</th>
                                                <th style={{ width: "12%", textAlign: "center" }}>날짜</th>
                                                <th style={{ width: "8%", textAlign: "center" }}>출근</th>
                                                <th style={{ width: "8%", textAlign: "center" }}>퇴근</th>
                                                <th style={{ width: "16%", textAlign: "center" }}>비고 </th>
                                                <th style={{ width: "35%", textAlign: "center" }}>수정메시지 </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* {pageDeptStatusList
                                                .filter(deptStatus => deptStatus.date >= moveDate.startDate && deptStatus.date <= moveDate.endDate)
                                                .map((deptStatus) => (
                                                    <tr key={deptStatus.attendance_no} onClick={() => openEditPage(deptStatus.attendance_no)}>
                                                        <td align="center">{deptStatus.emp_name}</td>
                                                        <td align="center">{deptStatus.type_name}</td>
                                                        <td align="center">{deptStatus.dept_name}</td>
                                                        <td align="center">{getPositionName(deptStatus.position_id)}</td>
                                                        <td align="center">{deptStatus.date}</td>
                                                        <td style={{ color: deptStatus.late ? '#FF6B6B' : '#49A902' }} align="center">
                                                            <b>{deptStatus.check_in_time || '-'}</b>
                                                        </td>
                                                        <td style={{ color: deptStatus.early_leave ? '#FFA500' : '#49A902' }} align="center">
                                                            <b>{deptStatus.check_out_time || '-'}</b>
                                                        </td>
                                                        <td style={{ color: deptStatus.vacation ? '#3B82F6' : 'black' }} align="center">
                                                            {getStatusText(deptStatus)}
                                                        </td>
                                                        <td className="customText-truncate" align="center">
                                                            {deptStatus.message || '-'}
                                                        </td>
                                                    </tr>
                                                ))} */}
                                        </tbody>
                                    </table>

                                    <div style={{ paddingLeft: "10px" }}>
                                        <ColorLegend />
                                    </div>
                                    <div style={{ margin: 'auto' }}>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </Content>
                </Container>
            </Container>
        </div>
    );
};

export default AttendSetting;