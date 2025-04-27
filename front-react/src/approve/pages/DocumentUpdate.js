import React, { useEffect, useState } from 'react';
import ReportForm from '../components/ReportForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Content, Divider, Button, Modal, ButtonGroup } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import ExpenseForm from '../components/ExpenseForm ';
import '../css/approveForm.css'; // 스타일 파일
import ApproveLine from '../components/ApproveLine';
import { request } from '../../common/components/helpers/axios_helper';
import WorkReportUpdate from '../components/WorkReportUpdate';
import VacationUpdate from '../components/VacationUpdate';
import ApproveInfo from '../components/ApproveInfo';
import Header from '../../common/pages/Header';
import FileUpload from '../../library/components/FileUpload';

const DocumentUpdate = () => {
    const params = useParams(); // form_no를 가져오기 위한 변수
    const form_no = parseInt(params.form_no);
    const doc_no = parseInt(params.doc_no);

    const navigate = useNavigate(); // 화면 이동을 위한 변수

    const [line, setLine] = useState([]);           // 결재 라인 데이터 저장
    const [formData, setFormData] = useState(null); // 각 양식별 데이터 저장
    const [document, setDocument] = useState([])    // 문서 데이터 저장
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await request("GET", "approve/detail/" + form_no + "/" + doc_no);
                if (response) {
                    setDocument(response.data.document);
                    setLine(response.data.lineList);
                    setIsUrgent(response.data.document.doc_urgent === 'Y' ? true : false);

                    console.log(response.data);
                    // form_no가 5인 경우 vacation_req 데이터 설정
                    if (form_no === 1) {
                        if (response.data.vacation_req) {
                            console.log("vacation_req 데이터 설정:", response.data.vacation_req);
                            setFormData(response.data.vacation_req);
                        } else {
                            console.warn("vacation_req 데이터가 없습니다!");
                            setFormData({});  // 빈 객체로 초기화
                        }
                    }

                    // form_no가 5인 경우 work_report 데이터 설정
                    if (form_no === 5) {
                        if (response.data.work_report) {
                            console.log("work_report 데이터 설정:", response.data.work_report);
                            setFormData(response.data.work_report);
                        } else {
                            console.warn("work_report 데이터가 없습니다!");
                            setFormData({});  // 빈 객체로 초기화
                        }
                    }
                }
            }
            fetchData();
        } catch (error) {
            console.error("전자결재 데이터 불러오기 오류:", error)
        }
    }, [doc_no, form_no])

    // 데이터 변화를 감지하는 이벤트 핸들러
    const handleFormDataChange = (data) => {
        setFormData(data);
        const title = data.title
        setDocument({
            ...document,
            doc_title: title
        })
        console.log("전달받은 변경 데이터:", data);
    };

    // 모달창 오픈 함수
    const [InfoOpen, setInfoOpen] = useState(false);

    // 모달창에서 저장된 결재선을 부모창에서 저장하는 함수
    const handleSaveLine = (lineData) => {
        // 검증: 데이터가 배열이고 비어있지 않은지 확인
        if (lineData.length > 0) {
            setLine(lineData);
            console.log('결재선 상태 업데이트됨');
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
            case 2:
                return true;
            case 3:
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
                requestData = {
                    vacation_req: formData
                };
                break;
            case 2:
                requestData = {
                    vacation_req: formData
                };
                break;
            case 3:
                requestData = {
                    vacation_req: formData
                };
                return requestData;
            case 5:
                requestData = {
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

        if (!checkValid(formData)) return;

        if (line.length <= 1) {
            alert("결재자를 지정해주세요.");
            return;
        }

        let requestData = addFormData(formData);

        // document 객체에 임시저장 상태값(1) 추가
        const tempDocument = {
            ...document,
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
            request("POST", "/approve/update/" + form_no, JSON.stringify(requestData))
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

        if (!checkValid(formData)) return;

        // 양식별 데이터 저장
        let requestData = addFormData(formData);

        // document 객체에 임시저장 상태값(1) 추가
        const tempDocument = {
            ...document,
            doc_status: 1  // 임시저장 상태코드
        };

        // 결재 요청 데이터 구성
        requestData = {
            ...requestData,
            document: tempDocument,
            lineList: line
        };

        console.log("임시저장 데이터:", requestData);

        try {
            request("POST", "/approve/update/" + form_no, JSON.stringify(requestData))
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
                return <VacationUpdate approveLine={line} onFormDataChange={handleFormDataChange} docData={document} formData={formData} />;
            case 2:
                return <ExpenseForm approveLine={line} onFormDataChange={handleFormDataChange} docData={document} />;
            case 3:
                return <ReportForm approveLine={line} onFormDataChange={handleFormDataChange} docData={document} />;
            case 5:
                return <WorkReportUpdate approveLine={line} onFormDataChange={handleFormDataChange} docData={document} formData={formData} />;
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
                                <h3>결재 문서 수정</h3>
                            </div>
                        </div>
                        <br />

                        {/* 문서 액션 버튼 */}
                        <div className="document-actions" style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', gap: '10px' }}>

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
                        </div>
                        <div style={{marginTop:'20px'}}>
                            <FileUpload
                                initialFileName={document.doc_filename}
                                onFileUpload={(savedFileName) => setDocument({ ...document, doc_filename: savedFileName })}
                            />
                        </div>
                        <Modal open={InfoOpen} onClose={() => setInfoOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

export default DocumentUpdate;