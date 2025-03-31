import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Divider, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';

const InsertNotice = (props) => {

    // 링크 이동을 위해 선언
    const navigate = useNavigate();

    // useState를 사용해서 notice 변수를 초기화해줌
    const [notice, setNotice] = useState({
        emp_no: '',
        notice_title: '',
        notice_content: ''
    });

    // 값이 변경되면 notice에 저장
    const changeValue = (e) => {
        setNotice({
            ...notice,
            [e.target.name]: e.target.value
        });
    };

    // '작성'버튼 눌러 공지 작성
    const submitNotice = (e) => {
        e.preventDefault(); // submit이 action을 안 타고 자기 할 일을 그만함

        // 필수 입력값 체크
        if (!notice.notice_title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!notice.emp_no.trim()) {
            alert("작성자를 입력해주세요.");
            return;
        }

        if (!notice.notice_content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        console.log("보내는 데이터:", JSON.stringify(notice)); // 디버깅 로그 추가

        // insertNotice 링크로 DB에 접속
        fetch("http://localhost:8081/board/notice", {
            method: "POST", // @PostMapping 사용
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(notice)

        })
            .then((res) => {
                console.log(1, res);
                if (res.status === 201) {
                    return res.json();  // 응답 값을 json 형식으로 변환
                } else {
                    return null;
                }
            })
            .then((res) => {
                console.log('정상', res);
                if (res !== null) {
                    navigate('/board/noticeList');  // 작성 성공 시, 공지 목록 페이지로 이동
                } else {
                    alert("공지 작성에 실패하였습니다.");   // 작성 실패 시, alert 창 띄움
                }
            })
            .catch((error) => {
                console.log('실패', error);
            })

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
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}> 공지사항 작성</span>
                                    <Button appearance="link" onClick={noticeList}>목록</Button>
                                </Card.Header>
                                <table className='board-table'>
                                    <tr>
                                        <th style={{ width: '20%' }}>제목</th>
                                        <td style={{ width: '80%' }} colSpan={3}>
                                            <input type='text' name='notice_title' style={{ width: '100%' }} onChange={changeValue} placeholder='공지 제목을 입력하세요.' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%' }}>작성자</th>
                                        <td style={{ width: '80%' }} colSpan={3}>
                                            <input type="text" name="emp_no" style={{ width: '100%' }} onChange={changeValue} placeholder='작성자를 입력하세요.' />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th colSpan={4}>내용</th>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <textarea
                                                name="notice_content"
                                                style={{ width: '100%', height: '500px', verticalAlign: 'top' }}
                                                placeholder="공지 내용을 입력하세요"
                                                onChange={changeValue}
                                            />
                                        </td>
                                    </tr>
                                </table>
                                <Card.Footer>
                                    {/* 버튼 클릭 시 submitNotice 함수 실행 */}
                                    <div style={{ marginTop: '10px' }}>
                                        <Button onClick={submitNotice}>작성</Button>
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

export default InsertNotice;