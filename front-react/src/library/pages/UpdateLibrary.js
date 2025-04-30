import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import FileUpload from '../components/FileUpload';
import '../css/board.css'
import { request } from '../../common/components/helpers/axios_helper';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const Updatelibrary = () => {

    const propsParam = useParams();
    const navigate = useNavigate();
    const library_no = propsParam.library_no;

    const [library, setLibrary] = useState({})

    useEffect(() => {
        const fetchLibraryDetail = async () => {
            try {
                const response = await request('get', `/board/library/${library_no}`);
                setLibrary(response.data);
            } catch (error) {
                console.error('자료 상세 정보 불러오기 에러:', error);
            }
        };

        fetchLibraryDetail();
    }, []);

    const changeValue = (e) => {
        setLibrary({
            ...library,
            [e.target.name]: e.target.value
        });
    }

    // FileUpload 컴포넌트에서 전달된 파일 이름을 받아서 상태를 업데이트
    const handleFileUpload = (savedFileName) => {
        setLibrary({ ...library, library_filename: savedFileName });
    };

    const submitlibrary = async (e) => {
        e.preventDefault(); // submit이 action을 안 타고 자기 할 일을 그만함

        // 필수 입력값 체크
        if (!library.library_title.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        if (!library.library_content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            const response = await request(
                'put',
                `/board/library/${library_no}`,
                library
            );

            console.log('정상', response.data);
            alert("게시글을 수정하였습니다.");
            navigate('/boardMgt/libraryList/');
        } catch (error) {
            console.log('실패', error);
            alert("게시글 수정에 실패하였습니다.");
        }
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
                                        자료 수정
                                    </span>
                                </Card.Header>
                                <table className='board-table'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>제목</th>
                                            <td style={{ width: '80%' }} colSpan={3}>
                                                <input type='text' name='notice_title' style={{ width: '100%' }} value={library.library_title} onChange={changeValue} placeholder='공지 제목을 입력하세요.' />
                                            </td>
                                        </tr>

                                        <tr>
                                            <th style={{ width: '20%' }}>작성자</th>
                                            <td style={{ width: '30%' }}>{library.emp_name}({getPositionName(library.position_id)})</td>
                                            <th style={{ width: '20%' }}>부서</th>
                                            <td style={{ width: '30%' }}>{getDeptName(library.dept_no)}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>작성일</th>
                                            <td style={{ width: '30%' }}>{library.library_reg_date}</td>
                                            <th style={{ width: '20%' }} >조회수</th>
                                            <td style={{ width: '30%' }}>{library.library_views}</td>
                                        </tr>
                                        <tr>
                                            <th style={{ width: '20%' }}>첨부 파일 { /* 파일명에서 UUID 제거한 원래 파일명만 표시 */}
                                            </th>
                                            <td colSpan={3}>
                                                <FileUpload
                                                    initialFileName={library.library_filename}
                                                    onFileUpload={(savedFileName) => setLibrary({ ...library, library_filename: savedFileName })}
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
                                                    name="library_content"
                                                    style={{ width: '100%', height: '500px', verticalAlign: 'top' }}
                                                    placeholder="내용을 입력하세요"
                                                    value={library.library_content}
                                                    onChange={changeValue}
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                                    <div style={{ marginTop: '10px' }}>
                                        <Button appearance="primary" color="blue" onClick={submitlibrary}>수정</Button>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <Button appearance="ghost" color="blue" onClick={() => navigate('/boardMgt/libraryList')}>목록</Button>
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

export default Updatelibrary;