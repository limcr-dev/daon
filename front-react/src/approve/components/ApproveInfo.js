import React, { useEffect, useState } from 'react';
import { Panel, Divider } from 'rsuite';
import '../css/approveForm.css'; // 스타일 파일
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { ApprStatusBadge, getApprStatusText, StatusBadge } from './ApprCodeToText';

const ApproveInfo = ({ approveLine = [] }) => {
    const { user } = useUser();
    const [line, setLine] = useState(approveLine || []);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        if (approveLine && Array.isArray(approveLine)) {
            setLine(approveLine);
            console.log("문서정보 결재선:", line)
        }

        if (line) {
            setIsLoading(false);
        }

    }, []);

    if (isLoading) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }

    return (
        <div className="right-sidebar" style={{ height: '100%' }}>

            <Panel className="sidebar-panel approver-panel">
                {/* 기안자 정보 */}

                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ marginBottom: '10px' }}>기안자</h5>
                    {approveLine.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{ padding: '10px', border: '1px solid #e5e5e5', borderRadius: '4px', background: '#fff', display: 'flex', alignItems: 'flex-start' }}>
                                {/* 왼쪽에 정사각형 형태로 상태 배지 표시 */}
                                <div style={{ marginRight: '10px' }}>
                                    <ApprStatusBadge status={approveLine[0].appr_status} isSquare={true} />
                                </div>

                                {/* 오른쪽에 사용자 정보 표시 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {approveLine[0].appr_name} ({approveLine[0].appr_position})
                                    </div>
                                    <div>부서: {getDeptName(approveLine[0].appr_dept_no)}</div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div style={{ padding: '10px', border: '1px solid #e5e5e5', borderRadius: '4px', background: '#fff', display: 'flex', alignItems: 'flex-start' }}>
                                {/* 왼쪽에 정사각형 형태로 상태 배지 표시 */}
                                <div style={{ marginRight: '10px' }}>
                                    <ApprStatusBadge status={0} isSquare={true} />
                                </div>
                                {/* 오른쪽에 사용자 정보 표시 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 'bold' }}>
                                        {user.emp_name} ({getPositionName(user.position_id)})
                                    </div>
                                    <div>부서: {getDeptName(user.dept_no)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <Divider />

                {/* 결재선 정보 */}
                <div style={{ marginBottom: '20px' }}>
                    <h5 style={{ marginBottom: '10px' }}>결재선</h5>
                    {approveLine.length > 1 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {approveLine.slice(1).map((approver, index) => (
                                <div key={index} style={{ padding: '10px', border: '1px solid #e5e5e5', borderRadius: '4px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                                    {/* 상단 영역: 상태 배지와 사용자 정보 */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: approver.comment ? '8px' : '0' }}>
                                        {/* 왼쪽에 정사각형 형태로 상태 배지 표시 */}
                                        <div style={{ marginRight: '10px' }}>
                                            <ApprStatusBadge status={approver.appr_status} isSquare={true} />
                                        </div>

                                        {/* 오른쪽에 사용자 정보 표시 */}
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 'bold' }}>
                                                {approver.appr_name} ({approver.appr_position})
                                            </div>
                                            <div>부서: {getDeptName(approver.appr_dept_no)}</div>
                                            
                                        </div>
                                    </div>

                                    {/* 코멘트 영역 - 코멘트가 있을 때만 표시 */}
                                    {(approver.appr_status === 3 || approver.appr_status === 4) &&  (
                                        <div style={{
                                            marginTop: '5px',
                                            backgroundColor: '#f5f5f5',
                                            padding: '8px',
                                            borderRadius: '4px',
                                            fontSize: '0.9em',
                                            borderLeft: '3px solid #ccc'
                                        }}>
                                            변경일 : {approver.appr_date} <br/>
                                            {approver.appr_comment !== '' && approver.appr_comment !== null && <>의견 : {approver.appr_comment}</> }
                                        </div>
                                    )}
                                </div>
                            ))}

                        </div>
                    ) : (
                        <div style={{ color: '#888' }}>지정된 결재선이 없습니다.</div>
                    )}
                </div>
            </Panel>
        </div>
    );
};

export default ApproveInfo;