import React, { useEffect, useState } from 'react';
import VacationForm from '../components/VacationForm';
import ReportForm from '../components/ReportForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Content, Divider, Button, Modal, ButtonGroup } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import ExpenseForm from '../components/ExpenseForm ';
import '../css/approveForm.css'; // 스타일 파일
import WorkReportForm from '../components/WorkReportForm';
import ApproveLine from '../components/ApproveLine';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';
import { getFormName } from '../components/ApprCodeToText';
import Header from '../../common/pages/Header';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import ApproveInfo from '../components/ApproveInfo';
import FileUpload from '../../library/components/FileUpload';

const DocumentForm = () => {
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
        doc_urgent: 'N',
        doc_status: 2,   // (기본)진행중
        doc_filename: ''
    })

    // 초기 결재선에 기안자(로그인 유저) 추가
    useEffect(() => {
        // 결재선이 비어있을 때만 기안자 정보 추가
        if (line.length === 0 && user && user.emp_no) {
            const applicant = {
                appr_no: user.emp_no,
                appr_name: user.emp_name,
                appr_position: getPositionName(user.position_id),
                appr_dept_name: getDeptName(user.dept_no),
                appr_dept_no: user.dept_no,
                appr_status: 0,
                appr_type: '기안자',
                appr_date: formattedDate
            };
            setLine([applicant]);
        }
    }, [user]);


    // 데이터 변화를 감지하는 이벤트 핸들러
    const handleFormDataChange = (data) => {
        setFormData(data);
        setDocument({
            ...document,
            doc_title: data.title
        })
    };

    // 모달창 오픈 함수
    const [InfoOpen, setInfoOpen] = useState(false);

    // 모달창에서 저장된 결재선을 부모창에서 저장하는 함수
    const handleSaveLine = (lineData) => {
        if (lineData.length > 0) {
            setLine(lineData);
        } else {
            console.warn('받은 결재선 데이터가 비어있거나 배열이 아님:', lineData);
        }
    }

    // 각 양식 별 유효성 체크
    const checkValid = (formData) => {

        if (!formData.title) {
            alert("제목을 입력하세요.");
            return false;
        }
        if (!formData.content) {
            alert("내용을 작성해주세요.");
            return false;
        }

        switch (form_no) {
            case 1:
                if (!formData.vacation_type) {
                    alert("휴가 유형을 지정해주세요.");
                    return false;
                }
                if (!formData.start_date) {
                    alert("휴가 시작일 지정해주세요.");
                    return false;
                }
                if (!formData.end_date) {
                    alert("휴가 종료일 지정해주세요.");
                    return false;
                }
                if (formData.vacation_type === 1 && formData.remaining_days - formData.used_days < 0) {
                    alert("연차 신청 가능일을 초과하였습니다.");
                    return false;
                }
                return true;
            case 5:
                if (!formData.execution_date) {
                    alert("업무 시행일을 지정해주세요.");
                    return false;
                }
                return true;
            default:
                return false;
        }
    };

    const addFormData = (formData) => {

        let requestData = {};
        switch (form_no) {
            case 1:
                requestData = { vacation_req: formData };
                break;
            case 5:
                requestData = { work_report: formData };
                return requestData;
            default:
                alert("유효한 양식이 아닙니다.");
                return null;
        }

        return requestData;
    }

    // FileUpload 컴포넌트에서 전달된 파일 이름을 받아서 상태를 업데이트
    const handleFileUpload = (savedFileName) => {
        setDocument({ ...document, doc_filename: savedFileName });
    };

    // 결재 요청 처리 함수
    const handleSubmitRequest = async (e) => {
        e.preventDefault();

        if (!checkValid(formData)) return;

        if (line.length <= 1) {
            alert("결재자를 지정해주세요.");
            return;
        }

        let requestData = addFormData(formData);

        // document 객체에 임시저장 상태값(1) 추가
        const tempDocument = {
            ...document,
            doc_form: form_no,
            doc_status: 2  // 진행중 상태코드
        };

        // 결재 요청 데이터 구성
        requestData = {
            ...requestData,
            document: tempDocument,
            lineList: line
        };

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
    const handleSaveRequest = (e) => {
        e.preventDefault();

        if (!checkValid(formData)) return;

        let requestData = addFormData(formData);

        // document 객체에 임시저장 상태값(1) 추가
        const tempDocument = {
            ...document,
            doc_form: form_no,
            doc_status: 1  // 임시저장 상태코드
        };

        // 결재 요청 데이터 구성 (원래 함수 대신 직접 구성)
        requestData = {
            ...requestData,
            document: tempDocument,
            lineList: line
        };

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
                <Content>
                    <Header />

                    <Content style={{ margin: '20px', position: 'relative' }}>
                        {/* 상단 헤더 */}
                        <div className="document-header">
                            <div className="document-title">
                                <h3>{getFormName(form_no)}</h3>
                            </div>
                        </div>
                        <br />
                        {/* 문서 액션 버튼 */}
                        <div className="document-actions" style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <Button appearance='primary' color='blue' onClick={handleSubmitRequest}>결재 요청</Button>
                            <Button appearance='ghost' color='blue' onClick={handleSaveRequest}>임시저장</Button>
                            <Button appearance='ghost' color='blue' onClick={() => navigate('/approve')}>목록</Button>
                            <Button appearance='primary' color='green' onClick={() => setInfoOpen(true)}>결재선 지정</Button>
                            <ButtonGroup>
                                <Button
                                    appearance={isUrgent ? 'primary' : 'ghost'}
                                    color="red"
                                    onClick={() => {
                                        setIsUrgent(true);
                                        setDocument({ ...document, doc_urgent: 'Y' });
                                    }}
                                >
                                    긴급
                                </Button>
                                <Button
                                    appearance={!isUrgent ? 'primary' : 'ghost'}
                                    color="green"
                                    onClick={() => {
                                        setIsUrgent(false);
                                        setDocument({ ...document, doc_urgent: 'N' });
                                    }}
                                >
                                    일반
                                </Button>
                            </ButtonGroup>

                        </div>
                        <div style={{ marginTop: '20px' }}>
                            <FileUpload onFileUpload={handleFileUpload} />
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
                </Content>
            </Container>
        </Container>
    );
};

export default DocumentForm;