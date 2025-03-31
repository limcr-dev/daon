import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Divider, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import '../css/board.css'

const NoticeDetail = (props) => {

    const propsParam = useParams();
    const navigate = useNavigate();
    const notice_no = propsParam.notice_no; // 링크로 전달된 notice_no를 받아서 변수에 저장

    // useState를 통해 notice 변수의 key값을 지정하고 value값을 초기화함
    const [notice, setNotice] = useState({
        notice_no: '',
        emp_no: '',
        notice_title: '',
        notice_reg_date: '',
        notice_views: '',
        notice_content: ''
    })

    // 공지사항 상세 페이지가 로딩될 때, 처음으로 실행되는 부분
    // dependency가 빈 배열이라 처음 화면 로딩 시, 한번만 실행됨
    useEffect(() => {
        fetch("http://localhost:8081/board/notice/" + notice_no)  // DB에 들림
            .then((res) => res.json())
            .then((res) => {
                setNotice(res) // DB에서 꺼내온 값을 setNotice 함수를 통해서 notice 변수에 저장함
            });
    }, []);

    // 수정 버튼 누르면 실행되는 함수(arrow function 활용)
    const updateNotice = () => {
        navigate('/board/updateNotice/' + notice_no);
    }

    // 삭제 버튼 누르면 실행되는 함수(arrow function 활용)
    const deleteNotice = () => {
        fetch("http://localhost:8081/board/notice/" + notice_no, {
            method: "DELETE"
        })
            .then((res) => res.text())  // 응답 값을 text형식으로 받음
            .then((res) => {
                if (res == 'ok') {
                    navigate('/board/noticeList');  // 삭제 성공 시, 공지사항 목록 페이지로 이동
                } else {
                    alert('게시글 삭제에 실패하였습니다.'); // 삭제 실패 시, alert창 띄움
                }
            });
    }

    const noticeList = () => {
        navigate('/board/noticeList');
    }

    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                < BoardLeftbar />
                <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
                    <Header />
                    <Divider />
                    <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>

                        <Col style={{ marginBottom: '20px' }}>
                            <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항 상세 내용</span>
                                    <Button appearance="link" onClick={noticeList}>목록</Button>
                                </Card.Header>
                                <table className='board-table'>
                                    <tr>
                                        <th style={{ width: '20%' }}>제목</th>
                                        <td colSpan={3}>{notice.notice_title}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%' }}>작성자</th>
                                        <td colSpan={3}>{notice.emp_no}</td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%' }}>작성일</th>
                                        <td>{notice.notice_reg_date}</td>
                                        <th style={{ width: '20%' }} >조회수</th>
                                        <td>{notice.notice_views}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={4}>내용</th>
                                    </tr>
                                    <tr style={{ height: '500px', verticalAlign: 'top' }}>
                                        <td colSpan={4}>{notice.notice_content}</td>
                                    </tr>
                                </table>
                                <Card.Footer>
                                    <div style={{ marginTop:'10px' }}>
                                        {/* 버튼 클릭 시 onClick에 지정되어있는 함수 실행됨 */}
                                        <Button onClick={updateNotice}>수정</Button>
                                        <Button onClick={deleteNotice}>삭제</Button>
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