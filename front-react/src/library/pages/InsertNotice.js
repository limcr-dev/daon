import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Divider, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';

const InsertNotice = () => {

    // 링크 이동을 위해 선언
    const navigate = useNavigate();

    // UserContext에서 사용자 정보 가져오기
    const { user } = useUser();

    // useState를 사용해서 notice 변수를 초기화해줌
    const [notice, setNotice] = useState({
        emp_no: user ? user.emp_no : '',
        emp_name: user ? user.emp_name : '',
        position_id: user ? user.position_id : '',
        dept_no: user ? user.dept_no : '',
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
    const submitNotice = async (e) => {
        e.preventDefault(); // submit이 action을 안 타고 자기 할 일을 그만함

        // 필수 입력값 체크
        if (!notice.notice_title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!notice.emp_name.trim()) {
            alert("작성자를 입력해주세요.");
            return;
        }

        if (!notice.notice_content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            // insertNotice 링크로 DB에 접속
            const res = await request("post", "/board/notice", notice);
            console.log(1, res);

            if (res.status === 201) {
                console.log('정상', res.data);
                navigate('/board/noticeList');  // 작성 성공 시, 공지 목록 페이지로 이동
            } else {
                alert("공지 작성에 실패하였습니다.");   // 작성 실패 시, alert 창 띄움
            }
        } catch (error) {
            console.log('실패', error);
            alert("공지 작성에 실패하였습니다.");
        }
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
                                            {/* 현재 로그인한 사용자 이름을 표시하고 읽기 전용으로 설정 */}
                                            <input
                                                type="text"
                                                value={user ? user.emp_name : '로그인 필요'}
                                                style={{ width: '100%' }}
                                                readOnly
                                            />
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
                                    <div style={{ marginTop: '10px', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button appearance="primary" color="blue" onClick={submitNotice}>작성</Button>
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