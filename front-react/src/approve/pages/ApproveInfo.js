import React, { useState } from 'react';
import { SelectPicker, InputPicker, Panel, Nav, Form, Radio, Checkbox, Avatar } from 'rsuite';
import '../css/approveForm.css'; // 스타일 파일
import { useUser } from '../../common/contexts/UserContext';

const ApproveInfo = () => {
    const [activeTab, setActiveTab] = useState('문서정보');
    
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
        <div className="right-sidebar">
            <Nav appearance="tabs" activeKey={activeTab} onSelect={handleTabChange}>
                <Nav.Item eventKey="결재선">결재선</Nav.Item>
                <Nav.Item eventKey="문서정보">문서정보</Nav.Item>
            </Nav>

            {activeTab === '결재선' ? (
                <Panel className="sidebar-panel approver-panel">
                    <div className="approver-list">
                        <div className="approver-item">
                            <Avatar className="approver-avatar">김</Avatar>
                            <div className="approver-info">
                                <div className="approver-name">김지연 부장</div>
                                <div className="approver-dept">영업팀</div>
                                <div className="approver-status">기안</div>
                            </div>
                        </div>
                        {/* 추가 결재자가 있을 경우 여기에 더 추가할 수 있습니다 */}
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