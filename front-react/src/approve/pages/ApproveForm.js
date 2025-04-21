import React, { useEffect, useState } from 'react';
import VacationForm from '../components/VacationForm';
import ReportForm from '../components/ReportForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Content, Divider, Header as RsuiteHeader, Row, FlexboxGrid, IconButton, Dropdown, ButtonGroup, Button, Panel, Nav, Form, Radio, Checkbox, Input, Modal } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import ApproveInfo from './ApproveInfo';
import ExpenseForm from '../components/ExpenseForm ';
import '../css/approveForm.css'; // 스타일 파일
import WorkReportForm from '../components/WorkReportForm';
import ApproveLine from './ApproveLine';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';
import { setSeconds } from 'date-fns';


const ApproveForm = () => {
    const { user } = useUser();     // 로그인 유저 정보
    const params = useParams(); // form_no를 가져오기 위한 변수
    const form_no = parseInt(params.form_no);

    const navigate = useNavigate(); // 화면 이동을 위한 변수

    const today = new Date();       // 기안일 지정
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const [line, setLine] = useState([]);   // 결재 라인 정보 저장

    const [formData, setFormData] = useState(null); // 각 양식별 데이터 저장

    const [isUrgent, setIsUrgent] = useState(false);

    const [document, setDocument] = useState({
        doc_form: form_no,
        emp_no: user.emp_no,
        dept_no: user.dept_no,
        doc_title: '',
        doc_reg_date: formattedDate,
        doc_urgent: 'N'
    })

    // 데이터 변화를 감지하는 이벤트 핸들러
    const handleFormDataChange = (data) => {
        setFormData(data);
        const title = data.title
        setDocument({
            ...document,
            doc_title: title
        })
        console.log("양식 데이터 업데이트됨:", data);
    };

    // 모달창 오픈 함수
    const [InfoOpen, setInfoOpen] = useState(false);

    // 모달창에서 저장된 결재선을 부모창에서 저장하는 함수
    const handleSaveLine = (lineData) => {
        console.log('결재선 저장 함수 호출됨, 데이터:', lineData);

        // 검증: 데이터가 배열이고 비어있지 않은지 확인
        if (lineData.length > 0) {
            setLine(lineData);
            console.log('결재선 상태 업데이트됨');
        } else {
            console.warn('받은 결재선 데이터가 비어있거나 배열이 아님:', lineData);
        }
    }

    const handleUrgentChange = (event) => {
        const checked = event.target.checked;
        console.log("event.target.checked 값:", checked);

        // isUrgent 상태 업데이트
        setIsUrgent(checked);

        // document 상태도 업데이트 - 이 부분이 빠져있었습니다!
        setDocument({
            ...document,
            doc_urgent: checked ? 'Y' : 'N'
        });

        console.log("업데이트될 문서:", {
            ...document,
            doc_urgent: checked ? 'Y' : 'N'
        });
    };

    const createRequestData = () => {
        // 결재 요청 데이터 구성
        let requestData = {
            document: document,
            lineList: line
        };

        switch (form_no) {
            case 1:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                break;
            case 2:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                break;
            case 3:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                return requestData;
            case 5:
                requestData = {
                    ...requestData,
                    work_report: formData
                };
                return requestData;
            default:
                alert("유효한 양식이 아닙니다.");
                return null;
        }

        return requestData;
    }

    // 결재 요청 처리 함수
    const handleSubmitRequest = async (e) => {
        e.preventDefault();

        // 필수 입력 체크
        if (!formData.title) {
            alert("제목을 작성해주세요.");
            return;
        }

        if (!formData.content) {
            alert("내용을 작성해주세요.");
            return;
        }

        if (!formData.execution_date) {
            alert("업무 시행일을 지정해주세요.");
            return;
        }

        if (line.length === 0) {
            alert("결재 라인을 지정해주세요.");
            return;
        }

        const requestData = createRequestData();
        console.log("결재 요청 데이터:", requestData);

        try {
            request("POST", "/approve/submit/" + form_no, JSON.stringify(requestData))
                .then(response => {
                    console.log("결재 요청 성공:", response);
                    alert("결재 요청이 완료되었습니다.");
                    navigate('/approve');
                })
                .catch(error => {
                    console.error("결재 요청 오류:", error);
                    alert("결재 요청 중 오류가 발생했습니다.");
                });
        } catch (error) {
            console.error("결재 요청 오류:", error);
            alert("결재 요청 중 오류가 발생했습니다.");
        }

    };

    // 임시저장 처리 함수
    const handleSaveRequest = async (e) => {
        e.preventDefault();

        // 필수 입력 체크
        if (!formData.title) {
            alert("제목을 작성해주세요.");
            return;
        }

        if (!formData.content) {
            alert("내용을 작성해주세요.");
            return;
        }

        if (!formData.execution_date) {
            alert("업무 시행일을 지정해주세요.");
            return;
        }

        // document 객체에 임시저장 상태값(4) 추가
        const tempDocument = {
            ...document,
            doc_status: 4  // 임시저장 상태코드
        };

        // 결재 요청 데이터 구성 (원래 함수 대신 직접 구성)
        let requestData = {
            document: tempDocument,
            lineList: line.length > 0 ? line : []  // 결재선이 없어도 임시저장 가능하게 함
        };

        // 양식별 데이터 추가
        switch (form_no) {
            case 1:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                break;
            case 2:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                break;
            case 3:
                requestData = {
                    ...requestData,
                    vacation_req: formData
                };
                break;
            case 5:
                requestData = {
                    ...requestData,
                    work_report: formData
                };
                break;
            default:
                alert("유효한 양식이 아닙니다.");
                return;
        }

        console.log("임시저장 데이터:", requestData);

        try {
            request("POST", "/approve/submit/" + form_no, JSON.stringify(requestData))
                .then(response => {
                    console.log("임시저장 성공:", response);
                    alert("임시저장 요청이 완료되었습니다.");
                    navigate('/approve');
                })
                .catch(error => {
                    console.error("임시저장 요청 오류:", error);
                    alert("임시저장 요청 중 오류가 발생했습니다.");
                });
        } catch (error) {
            console.error("임시저장 요청 오류:", error);
            alert("임시저장 요청 중 오류가 발생했습니다.");
        }

    };

    // form_no에 따라 다른 양식 컴포넌트를 렌더링
    const renderFormContent = () => {
        switch (form_no) {
            case 1:
                return <VacationForm approveLine={line} onFormDataChange={handleFormDataChange} />;
            case 2:
                return <ExpenseForm approveLine={line} onFormDataChange={handleFormDataChange} />;
            case 3:
                return <ReportForm approveLine={line} onFormDataChange={handleFormDataChange} />;
            case 5:
                return <WorkReportForm approveLine={line} onFormDataChange={handleFormDataChange} />;
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
                            <h3>결재 문서 작성</h3>
                        </div>
                    </div>
                    <br />
                    {/* 문서 액션 버튼 */}
                    <div className="document-actions" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                        <Button onClick={handleSubmitRequest} className='buttonStyle'>결재요청</Button>
                        <Button onClick={handleSaveRequest} className='buttonStyle'>임시저장</Button>
                        <Button className='buttonStyle'>취소</Button>
                        <Button className='buttonStyle' onClick={() => setInfoOpen(true)}>결재선 지정</Button>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="urgentCheckbox"
                                checked={isUrgent}
                                onChange={handleUrgentChange}
                                style={{ cursor: 'pointer' }}
                            />
                            <label
                                htmlFor="urgentCheckbox"
                                style={{
                                    marginLeft: '5px',
                                    color: isUrgent ? '#f44336' : 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                긴급
                            </label>
                        </div>
                    </div>

                    <Modal open={InfoOpen} onClose={() => setInfoOpen(false)} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Modal.Header><h3>결재선 지정</h3></Modal.Header>
                        <Modal.Body style={{ width: '800px' }}>
                            <ApproveLine closeModal={() => setInfoOpen(false)} approveLine={line} onSave={handleSaveLine} />
                        </Modal.Body>
                    </Modal>

                    <Divider />
                    {/* 메인 콘텐츠와 우측 사이드바 */}
                    <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
                        {/* 메인 콘텐츠 영역 */}
                        <div style={{ flex: '1 1 auto', minWidth: '900px' }}>
                            {renderFormContent()}
                        </div>

                        {/* 우측 사이드바 영역 - 미디어 쿼리로 제어 */}
                        <div className="side-panel">
                            <ApproveInfo approveLine={line} />
                        </div>
                    </div>
                </Content>
            </Container>
        </Container>
    );
};

export default ApproveForm;