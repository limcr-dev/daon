import React, { useState } from 'react';
import { SelectPicker, InputPicker, Panel, Nav, Form, Radio, Checkbox, Avatar, Divider } from 'rsuite';
import '../css/approveForm.css'; // 스타일 파일
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import { getPosition } from 'rsuite/esm/DOMHelper';

const ApproveInfo = ({ approveLine = [] }) => {
    const [activeTab, setActiveTab] = useState('결재선');
    const { user } = useUser();

    // 드롭다운 옵션 데이터
    const preservationOptions = [
        { label: '1년', value: '1년' },
        { label: '3년', value: '3년' },
        { label: '5년', value: '5년' },
        { label: '10년', value: '10년' },
        { label: '영구', value: '영구' }
    ];

    const departmentOptions = [
        { label: '영업팀', value: '영업팀' },
        { label: '개발팀', value: '개발팀' },
        { label: '인사팀', value: '인사팀' },
        { label: '총무팀', value: '총무팀' }
    ];

    const deptDocOptions = [
        { label: '미지정', value: '미지정' },
        { label: '영업문서', value: '영업문서' },
        { label: '회의록', value: '회의록' }
    ];

    const handleTabChange = (eventKey) => {
        setActiveTab(eventKey);
    };

    return (
        <div className="right-sidebar" style={{height:'100%'}}>
            <Nav appearance="tabs" activeKey={activeTab} onSelect={handleTabChange}>
                <Nav.Item eventKey="결재선">결재선</Nav.Item>
                <Nav.Item eventKey="문서정보">문서정보</Nav.Item>
            </Nav>

            {activeTab === '결재선' ? (
                <Panel className="sidebar-panel approver-panel">
                    {/* 기안자 정보 */}
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ marginBottom: '10px' }}>기안자</h5>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <div>이름: {user.emp_name}</div>
                            <div>부서: {getDeptName(user.dept_no)}</div>
                            <div>직급: {getPositionName(user.position_id)}</div>
                        </div>
                    </div>

                    <Divider />

                    {/* 결재선 정보 */}
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ marginBottom: '10px' }}>결재선</h5>
                        {approveLine.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {approveLine.map((approver, index) => (
                                    <div key={index} style={{ padding: '10px', border: '1px solid #e5e5e5', borderRadius: '4px', background: '#fff' }}>
                                        <div style={{ fontWeight: 'bold' }}>{approver.emp_name} ({approver.position})</div>
                                        <div>부서: {approver.dept_name}</div>
                                        <div>상태: {approver.status}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ color: '#888' }}>지정된 결재선이 없습니다.</div>
                        )}
                    </div>
                </Panel>
            ) : (
                <Panel className="sidebar-panel">
                    <Form fluid>
                        <Form.Group>
                            <Form.ControlLabel>문서번호</Form.ControlLabel>
                            <Form.Control readOnly value="" />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>공개여부</Form.ControlLabel>
                            <div className="radio-group">
                                <Radio checked> 공개 </Radio>
                                <Radio> 비공개 </Radio>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>전사문서함</Form.ControlLabel>
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>보존연한</Form.ControlLabel>
                            <SelectPicker
                                data={preservationOptions}
                                defaultValue="5년"
                                block
                                cleanable={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>기안부서</Form.ControlLabel>
                            <SelectPicker
                                data={departmentOptions}
                                defaultValue="영업팀"
                                block
                                cleanable={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>부서문서함</Form.ControlLabel>
                            <SelectPicker
                                data={deptDocOptions}
                                defaultValue="미지정"
                                block
                                cleanable={false}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>문서접수</Form.ControlLabel>
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>문서열람</Form.ControlLabel>
                        </Form.Group>

                        <Form.Group>
                            <Form.ControlLabel>긴급문서</Form.ControlLabel>
                            <div>
                                <Checkbox> 긴급 </Checkbox>
                                <div className="form-help-text">
                                    결재자의 대기문서 가장 상단에 표시됩니다.
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
                </Panel>
            )}
        </div>
    );
};

export default ApproveInfo;