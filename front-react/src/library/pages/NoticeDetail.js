import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Row } from 'rsuite';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import '../css/board.css'
import { API_URL, request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';

const NoticeDetail = () => {

    const { user } = useUser();

    const propsParam = useParams();
    const navigate = useNavigate();
    const notice_no = propsParam.notice_no; // 링크로 전달된 notice_no를 받아서 변수에 저장

    // useState를 통해 notice 변수의 key값을 지정하고 value값을 초기화함
    const [notice, setNotice] = useState({})

    // 공지사항 상세 페이지가 로딩될 때, 처음으로 실행되는 부분
    useEffect(() => {
        request("get", "/board/notice/" + notice_no)
            .then((res) => {
                setNotice(res.data) // axios는 응답을 res.data에 담아 반환합니다
            })
            .catch((error) => {
                console.error("공지사항 조회 실패:", error);
            });
    }, []);

    // 수정 버튼 누르면 실행되는 함수(arrow function 활용)
    const updateNotice = () => {
        navigate('/boardMgt/updateNotice/' + notice_no);
    }

    // 삭제 버튼 누르면 실행되는 함수(arrow function 활용)
    const deleteNotice = () => {
        request("delete", "/board/notice/" + notice_no)
            .then((res) => {
                // axios는 응답을 자동으로 JSON으로 파싱하므로, res.data로 접근
                if (res.data === 'ok') {
                    navigate('/boardMgt/noticeList');  // 삭제 성공 시, 공지사항 목록 페이지로 이동
                } else {
                    alert('게시글 삭제에 실패하였습니다.'); // 삭제 실패 시, alert창 띄움
                }
            })
            .catch((error) => {
                console.error("공지사항 삭제 실패:", error);
                alert('게시글 삭제에 실패하였습니다.');
            });
    }

    const noticeList = () => {
        navigate('/boardMgt/noticeList');
    }

    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                < BoardLeftbar />
                <Content>
                    <Header />
                    <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col style={{ marginBottom: '20px' }}>
                            <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항 상세 내용</span>
                                    <Button appearance="link" onClick={noticeList}>목록</Button>
                                </Card.Header>
                                <table className='board-table'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>제목</th>
                                            <td colSpan={3}>{notice.notice_title}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>작성자</th>
                                            <td style={{ width: '30%' }}>{notice.emp_name}({getPositionName(notice.position_id)})</td>
                                            <th style={{ width: '20%' }}>부서</th>
                                            <td style={{ width: '30%' }}>{getDeptName(notice.dept_no)}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>작성일</th>
                                            <td style={{ width: '30%' }}>{notice.notice_reg_date}</td>
                                            <th style={{ width: '20%' }} >조회수</th>
                                            <td style={{ width: '30%' }}>{notice.notice_views}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>첨부 파일 { /* 파일명에서 UUID 제거한 원래 파일명만 표시 */}
                                            </th>
                                            <td colSpan={3}>
                                                {notice.notice_filename ? (
                                                    <>
                                                        <Button
                                                            appearance="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const encodedFilename = encodeURIComponent(notice.notice_filename);
                                                                const downloadUrl = `${API_URL}/api/s3/library/download/${encodedFilename}`;
                                                                window.open(downloadUrl, '_blank');
                                                            }}
                                                        >
                                                            파일 다운로드
                                                        </Button>
                                                        &nbsp;&nbsp;&nbsp; 파일명 &nbsp;:&nbsp;&nbsp;
                                                        {notice.notice_filename && notice.notice_filename.includes('_')
                                                            ? decodeURIComponent(notice.notice_filename.substring(notice.notice_filename.indexOf('_') + 1))
                                                            : '첨부 없음'}
                                                    </>
                                                ) : (
                                                    <span>첨부 없음</span>
                                                )}
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4}>내용</th>
                                        </tr>
                                        <tr style={{ height: '500px', verticalAlign: 'top' }}>
                                            <td colSpan={4}>{notice.notice_content}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                                    <div>
                                        {/* 버튼 클릭 시 onClick에 지정되어있는 함수 실행됨 */}
                                        {notice.emp_no === user.emp_no &&
                                            <>
                                                <Button appearance="primary" color="blue" onClick={updateNotice}>수정</Button>
                                                <Button appearance="ghost" color="blue" onClick={deleteNotice} style={{ marginLeft: '10px' }}>삭제</Button>
                                            </>
                                        }
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>

                    </Row>
                </Content>
            </Container>
        </Container>


    );
};

export default NoticeDetail;