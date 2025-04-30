import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Divider, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import '../css/board.css'
import { request } from '../../common/components/helpers/axios_helper';
import FileUpload from '../components/FileUpload';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const UpdateNotice = (props) => {

    const propsParam = useParams();
    const navigate = useNavigate();
    const notice_no = propsParam.notice_no;

    const [notice, setNotice] = useState({
        notice_no: '',
        emp_no: '',
        emp_name: '',
        position_id: '',
        notice_title: '',
        notice_filename: '',
        notice_reg_date: '',
        notice_views: '',
        notice_content: ''
    })

    useEffect(() => {
        const fetchNoticeDetail = async () => {
            try {
                const res = await request("get", "/board/notice/" + notice_no);
                setNotice(res.data);
            } catch (error) {
                console.error("공지사항 조회 실패:", error);
            }
        };

        fetchNoticeDetail();
    }, []);

    const changeValue = (e) => {
        setNotice({
            ...notice,
            [e.target.name]: e.target.value
        });
    }

    const submitNotice = async (e) => {
        e.preventDefault(); // submit이 action을 안 타고 자기 할 일을 그만함

        // 필수 입력값 체크
        if (!notice.notice_title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!notice.notice_content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            const res = await request("put", "/board/notice/" + notice_no, notice);
            console.log('정상', res.data);

            if (res.status === 200) {
                navigate('/boardMgt/noticeDetail/' + notice_no);
            } else {
                alert("게시글 수정에 실패하였습니다.");
            }
        } catch (error) {
            console.log('실패', error);
            alert("게시글 수정에 실패하였습니다.");
        }
    }

    // FileUpload 컴포넌트에서 전달된 파일 이름을 받아서 상태를 업데이트
    const handleFileUpload = (savedFileName) => {
        setNotice({ ...notice, notice_filename: savedFileName });
    };

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
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                        공지 수정
                                    </span>
                                </Card.Header>
                                <table className='board-table'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>제목</th>
                                            <td style={{ width: '80%' }} colSpan={3}>
                                                <input type='text' name='notice_title' style={{ width: '100%' }} value={notice.notice_title} onChange={changeValue} placeholder='공지 제목을 입력하세요.' />
                                            </td>
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
                                                <FileUpload
                                                    initialFileName={notice.notice_filename}
                                                    onFileUpload={(savedFileName) => setNotice({ ...notice, notice_filename: savedFileName })}
                                                />
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4}>내용</th>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>
                                                <textarea
                                                    name="notice_content"
                                                    style={{ width: '100%', height: '500px', verticalAlign: 'top' }}
                                                    placeholder="공지 내용을 입력하세요"
                                                    value={notice.notice_content}
                                                    onChange={changeValue}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Button appearance="primary" color="blue" onClick={submitNotice}>수정</Button>
                                        <Button appearance="ghost" color="blue" onClick={() => navigate('/boardMgt')}>취소</Button>
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

export default UpdateNotice;