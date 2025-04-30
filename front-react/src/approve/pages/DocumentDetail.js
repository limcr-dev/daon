import React, { useEffect, useState } from 'react';
import ReportForm from '../components/ReportForm';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Content, Divider, Button, Modal, Form, Input } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import ExpenseForm from '../components/ExpenseForm ';
import '../css/approveForm.css'; // 스타일 파일
import { useUser } from '../../common/contexts/UserContext';
import { API_URL, request } from '../../common/components/helpers/axios_helper';
import WorkReportDetail from '../components/WorkReportDetail';
import { getFormName, StatusBadge, UrgentBadge } from '../components/ApprCodeToText';
import VacationDetail from '../components/VacationDetail';
import ApproveInfo from '../components/ApproveInfo';
import Header from '../../common/pages/Header';

const DocumentDetail = () => {
    const { user } = useUser();     // 로그인 유저 정보
    const params = useParams(); // form_no를 가져오기 위한 변수
    const form_no = parseInt(params.form_no);
    const doc_no = parseInt(params.doc_no);
    const [isUrgent, setIsUrgent] = useState(false);

    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [comment, setComment] = useState("");

    const navigate = useNavigate(); // 화면 이동을 위한 변수

    const [line, setLine] = useState([]);   // 결재 라인 정보 저장
    const [formData, setFormData] = useState(null); // 각 양식별 데이터 저장
    const [document, setDocument] = useState([])

    // 결재자 상태 확인 함수
    const getApproverStatus = () => {
        // 결재선에서 현재 사용자의 결재 정보 찾기
        const currentApprover = line.find(item => item.appr_no === user.emp_no);
        console.log("currentApprover:", currentApprover);
        return currentApprover ? currentApprover.appr_status : null;
    };

    // 승인 처리 함수
    const handleApprove = () => {
        const currentApprover = line.find(item => item.appr_no === user.emp_no);
        console.log(currentApprover);
        request("POST", `/approve/sign/${document.doc_no}`, {
            doc_no: document.doc_no,
            appr_no: user.emp_no,
            appr_status: 3, // 반려 상태 코드
            appr_comment: comment,
            appr_order: currentApprover.appr_order  // 다음 승인자 상태 변경을 위한 승인 순서
        })
            .then(() => {
                alert("승인 처리되었습니다.");
                setApproveModalOpen(false);
                navigate('/approveMgt');
            })
            .catch(error => {
                console.error("승인 처리 오류:", error);
                alert("승인 처리 중 오류가 발생했습니다.");
            });
    };

    // 반려 처리 함수
    const handleReject = () => {
        request("POST", `/approve/reject/${document.doc_no}`, {
            doc_no: document.doc_no,
            appr_no: user.emp_no,
            appr_status: 4, // 반려 상태 코드
            appr_comment: comment
        })
            .then(() => {
                alert("반려 처리되었습니다.");
                setRejectModalOpen(false);
                navigate('/approveMgt');
            })
            .catch(error => {
                console.error("반려 처리 오류:", error);
                alert("반려 처리 중 오류가 발생했습니다.");
            });
    };

    // 상신 취소 함수
    const handleCancel = async () => {
        if (window.confirm("상신을 취소하시겠습니까?")) {
            try {
                await request("POST", `approve/cancel/${document.doc_no}`);
                alert("상신이 취소되었습니다.");
                navigate('/approveMgt');
            } catch (error) {
                console.error("상신 취소 오류:", error);
                alert("상신 취소 중 오류가 발생했습니다.")
            }
        }
    };

    // DocumentDetail.js에서 데이터를 가져오는 부분
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await request("GET", "approve/detail/" + form_no + "/" + doc_no);

                if (response) {
                    setDocument(response.data.document);
                    setLine(response.data.lineList);
                    setIsUrgent(response.data.document.doc_urgent === 'Y' ? true : false)

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

    // form_no에 따라 다른 양식 컴포넌트를 렌더링
    const renderFormContent = () => {
        switch (form_no) {
            case 1:
                return <VacationDetail approveLine={line} formData={formData} docData={document} />;
            case 2:
                return <ExpenseForm approveLine={line} />;
            case 3:
                return <ReportForm approveLine={line} />;
            case 5:
                return <WorkReportDetail approveLine={line} formData={formData} docData={document} />;
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
                    <Content style={{ margin: '20px' }}>
                        <div className="document-header">
                            <div className="document-title">
                                <h3>{getFormName(form_no)} 상세내용</h3>
                            </div>
                        </div>
                        <br />
                        {/* 문서 액션 버튼 */}
                        {/* Icon 컴포넌트 import 추가 필요: import { Icon } from 'rsuite'; */}

                        <div className="document-actions" style={{ display: 'flex', flexDirection: 'row', marginTop: '10px', gap: '10px' }}>

                            {/* 문서 작성자이고 임시저장 상태일 때 */}
                            {user.emp_no === document.emp_no && document.doc_status === 1 && (
                                <>
                                    <Button appearance='primary' color='blue' onClick={() => { navigate(`/approveMgt/documentUpdate/${form_no}/${doc_no}`) }}>수정</Button>
                                </>
                            )}

                            {/* 문서 작성자이고 임시저장 상태가 아닐 때 */}
                            {user.emp_no === document.emp_no && document.doc_status === 2 && (
                                <Button appearance='primary' color='orange' onClick={handleCancel}>상신 취소</Button>
                            )}

                            {/* 결재자이고 결재 상태가 대기(2)일 때 */}
                            {user.emp_no !== document.emp_no && getApproverStatus() === 2 && (
                                <>
                                    <Button appearance='primary' color='green' onClick={() => setApproveModalOpen(true)}>승인</Button>
                                    <Button appearance='primary' color='red' onClick={() => setRejectModalOpen(true)}>반려</Button>
                                </>
                            )}

                            {/* 공통 버튼 */}
                            <Button appearance='ghost' color='blue' onClick={() => navigate('/approveMgt')}>목록</Button>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                            }}>
                                <UrgentBadge isUrgent={document.doc_urgent} />
                                <span style={{ marginLeft: '10px' }}><StatusBadge status={document.doc_status} /></span>
                            </div>

                            {/* 승인 모달 */}
                            <Modal open={approveModalOpen} onClose={() => setApproveModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Modal.Header style={{ minWidth: '300px' }}>
                                    <Modal.Title>결재 승인</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form fluid>
                                        <Form.Group>
                                            <Form.ControlLabel>코멘트</Form.ControlLabel>
                                            <Input
                                                as="textarea"
                                                rows={3}
                                                placeholder="승인 코멘트를 입력하세요..."
                                                value={comment}
                                                onChange={(value) => setComment(value)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={handleApprove} appearance="primary" color="green">
                                        승인
                                    </Button>
                                    <Button onClick={() => setApproveModalOpen(false)} appearance="subtle">
                                        취소
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {/* 반려 모달 */}
                            <Modal open={rejectModalOpen} onClose={() => setRejectModalOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Modal.Header style={{ minWidth: '300px' }}>
                                    <Modal.Title>결재 반려</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form fluid>
                                        <Form.Group>
                                            <Form.ControlLabel>반려 사유</Form.ControlLabel>
                                            <Input
                                                as="textarea"
                                                rows={3}
                                                placeholder="반려 사유를 입력하세요..."
                                                value={comment}
                                                onChange={(value) => setComment(value)}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onClick={handleReject} appearance="primary" color="red">
                                        반려
                                    </Button>
                                    <Button onClick={() => setRejectModalOpen(false)} appearance="subtle">
                                        취소
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {document.doc_filename ? (
                                <>
                                    <Button
                                        appearance="ghost"
                                        size="sm"
                                        onClick={() => {
                                            const encodedFilename = encodeURIComponent(document.doc_filename);
                                            const downloadUrl = `${API_URL}/api/s3/library/download/${encodedFilename}`;
                                            window.open(downloadUrl, '_blank');
                                        }}
                                    >
                                        파일 다운로드
                                    </Button>
                                    &nbsp;&nbsp;&nbsp; 파일명 &nbsp;:&nbsp;&nbsp;
                                    {document.doc_filename && document.doc_filename.includes('_')
                                        ? decodeURIComponent(document.doc_filename.substring(document.doc_filename.indexOf('_') + 1))
                                        : '첨부 없음'}
                                </>
                            ) : (
                                <span>첨부 없음</span>
                            )}
                        </div>

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

export default DocumentDetail;