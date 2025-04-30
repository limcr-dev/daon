import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import FileUpload from '../components/FileUpload';  // FileUpload 컴포넌트 추가
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const InsertLibrary = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [library, setLibrary] = useState({
        emp_no: user.emp_no,
        library_title: '',
        library_filename: '',
        library_content: '',
    });

    const changeValue = (e) => {
        setLibrary({
            ...library,
            [e.target.name]: e.target.value,
        });
    };

    const submitLibrary = async (e) => {
        e.preventDefault();

        if (!library.library_title.trim()) {
            alert('자료 제목을 입력해주세요.');
            return;
        }

        if (!library.library_content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }

        console.log('보내는 데이터:', JSON.stringify(library));

        try {
            const res = await request("post", "/board/library", library);

            if (res.status === 201) {
                alert('자료를 성공적으로 입력하였습니다.');
                navigate('/boardMgt/libraryList');
            } else {
                alert('자료 입력에 실패하였습니다.');
            }
        } catch (error) {
            console.log('실패', error);
            alert('자료 입력 중 오류가 발생했습니다.');
        }
    };

    const libraryList = () => {
        navigate('/boardMgt/libraryList');
    };

    // FileUpload 컴포넌트에서 전달된 파일 이름을 받아서 상태를 업데이트
    const handleFileUpload = (savedFileName) => {
        setLibrary({ ...library, library_filename: savedFileName });
    };


    return (
        <Container style={{ minHeight: '100vh', width: '100%' }}>
            <Leftbar />
            <Container>
                <BoardLeftbar />
                <Content>
                    <Header />
                    <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
                        <Col style={{ marginBottom: '20px' }}>
                            <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                                <Card.Header
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '15px',
                                        backgroundColor: '#f5f5f5',
                                        borderTopLeftRadius: '15px',
                                        borderTopRightRadius: '15px',
                                    }}
                                >
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>자료 내용 작성</span>
                                    <Button appearance="link" onClick={libraryList}>
                                        목록
                                    </Button>
                                </Card.Header>
                                <table className="board-table">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>제목</th>
                                            <td style={{ width: '80%' }} colSpan={3}>
                                                <input type='text' name='library_title' style={{ width: '100%' }} onChange={changeValue} placeholder='제목을 입력하세요.' />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>작성자</th>
                                            <td style={{ width: '30%' }}>{user.emp_name}({getPositionName(user.position_id)})</td>
                                            <th style={{ width: '20%' }}>부서</th>
                                            <td style={{ width: '30%' }}>{getDeptName(user.dept_no)}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>첨부 파일  </th>
                                            <td colSpan={3}>
                                                {/* FileUpload 컴포넌트 추가 */}
                                                <FileUpload onFileUpload={handleFileUpload} />
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={4}>자료 내용</th>
                                        </tr>
                                        <tr>
                                            <td colSpan={4}>
                                                <textarea
                                                    name="library_content"
                                                    style={{ width: '100%', height: '500px', verticalAlign: 'top' }}
                                                    placeholder="자료 내용을 입력하세요"
                                                    onChange={changeValue}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                                    <div style={{ marginTop: '10px' }}>
                                        <Button appearance="primary" color="blue" onClick={submitLibrary}>자료 입력</Button>
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

export default InsertLibrary;
