import React from 'react';
import VacationForm from './VacationForm';
import ReportForm from './ReportForm';
import { useParams } from 'react-router-dom';
import { Container, Content, Divider, Header as RsuiteHeader, Row, FlexboxGrid, IconButton, Dropdown, ButtonGroup, Button, Panel, Nav, Form, Radio, Checkbox, Input } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import ApproveInfo from './ApproveInfo';
import ExpenseForm from './ExpenseForm ';
import '../css/approveForm.css'; // 스타일 파일


const ApproveForm = () => {
    const propsParam = useParams();
    const form_no = parseInt(propsParam.form_no);

    // form_no에 따라 다른 양식 컴포넌트를 렌더링
    const renderFormContent = () => {
        switch (form_no) {
            case 1:
                return <VacationForm />;
            case 2:
                return <ExpenseForm />;
            case 3:
                return <ReportForm />;
            default:
                return <div>유효한 양식 유형을 선택해 주세요</div>;
        }
    };

    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <ApproveLeftbar />
                <Content style={{ marginLeft: '15px', marginTop: '15px', position: 'relative' }}>
                    {/* 상단 헤더 */}
                    <div className="document-header">
                        <div className="document-title">
                            <h3>휴가신청서</h3>
                        </div>
                    </div>
                    <br/>
                    {/* 문서 액션 버튼 */}
                    <div className="document-actions">
                        <ButtonGroup>
                            <Button >결재요청</Button>
                            <Button >임시저장</Button>
                            <Button >미리보기</Button>
                            <Button>취소</Button>
                            <Button >결재 정보</Button>
                        </ButtonGroup>
                    </div>
                    <Divider />
                    {/* 메인 콘텐츠와 우측 사이드바 */}
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={18}>
                            <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
                                {renderFormContent()}
                            </Row>
                        </FlexboxGrid.Item>

                        {/* 우측 사이드바 */}
                        <FlexboxGrid.Item colspan={6}>
                            <ApproveInfo />
                            
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Content>
            </Container>
        </Container>
    );
};

export default ApproveForm;