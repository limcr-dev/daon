import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import '../css/board.css'
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';
import { getDeptName, getPositionName } from '../../hrMgt/components/getEmployeeInfo';

const LibraryDetail = () => {

    const { user } = useUser();
    const propsParam = useParams();
    const navigate = useNavigate();
    const library_no = propsParam.library_no; // 링크로 전달된 library_no를 받아서 변수에 저장

    // useState를 통해 library 변수의 key값을 지정하고 value값을 초기화함
    const [library, setLibrary] = useState({
        library_no: '',
        emp_no: '',
        library_title: '',
        library_reg_date: '',
        library_views: '',
        library_content: ''
    })

    // 공지사항 상세 페이지가 로딩될 때, 처음으로 실행되는 부분
    // dependency가 빈 배열이라 처음 화면 로딩 시, 한번만 실행됨
    useEffect(() => {
        const fetchLibraryDetail = async () => {
            try {
                const res = await request("get", "/board/library/" + library_no);
                setLibrary(res.data); // DB에서 꺼내온 값을 setlibrary 함수를 통해서 library 변수에 저장함
            } catch (error) {
                console.error("자료실 게시글 조회 실패:", error);
            }
        };

        fetchLibraryDetail();
    }, []);

    // 수정 버튼 누르면 실행되는 함수(arrow function 활용)
    const updateLibrary = () => {
        navigate('/board/updateLibrary/' + library_no);
    }

    // 삭제 버튼 누르면 실행되는 함수(arrow function 활용)

    const deleteLibrary = async () => {
        try {
            const response = await request('delete', `/board/library/${library_no}`);

            // response.data로 접근하되, 서버가 text로 반환한다면 response.data가 텍스트일 것임
            if (response.data === 'ok') {
                alert('자료를 삭제하였습니다.');
                navigate('/board/libraryList');  // 삭제 성공 시, 자료 목록 페이지로 이동
            } else {
                alert('자료 삭제에 실패하였습니다.');
            }
        } catch (error) {
            console.error('자료 삭제 에러:', error);
            alert('자료 삭제 중 오류가 발생했습니다.');
        }
    }

    const libraryList = () => {
        navigate('/board/libraryList');
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
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>자료 상세 내용</span>
                                    <Button appearance="link" onClick={libraryList}>목록</Button>
                                </Card.Header>
                                <table className='board-table'>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '20%' }}>제목</th>
                                            <td colSpan={3}>{library.library_title}</td>
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
                                                {library.library_filename ? (
                                                    <>
                                                        <Button
                                                            appearance="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const encodedFilename = encodeURIComponent(library.library_filename);
                                                                const downloadUrl = `http://localhost:8081/api/s3/library/download/${encodedFilename}`;
                                                                window.open(downloadUrl, '_blank');
                                                            }}
                                                        >
                                                            파일 다운로드
                                                        </Button>
                                                        &nbsp;&nbsp;&nbsp; 파일명 &nbsp;:&nbsp;&nbsp;
                                                        {library.library_filename && library.library_filename.includes('_')
                                                            ? decodeURIComponent(library.library_filename.substring(library.library_filename.indexOf('_') + 1))
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
                                            <td colSpan={4}>{library.library_content}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                                    <div style={{ marginTop: '10px' }}>
                                        {/* 버튼 클릭 시 onClick에 지정되어있는 함수 실행됨 */}
                                        {library.emp_no === user.emp_no &&
                                            <>
                                                <Button appearance="primary" color="blue" onClick={updateLibrary}>수정</Button>
                                                <Button style={{marginLeft:'10px'}} appearance="ghost" color="blue" onClick={deleteLibrary}>삭제</Button>
                                            </>
                                        }
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>

                    </Row>
                </Content>
            </Container>
        </Container >


    );
};

export default LibraryDetail;