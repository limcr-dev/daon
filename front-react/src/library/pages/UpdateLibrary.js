import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Content, Divider, Row } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import BoardLeftbar from './BoardLeftbar';
import Header from '../../common/pages/Header';
import FileUpload from '../components/FileUpload';
import '../css/board.css'

const Updatelibrary = (props) => {

    const propsParam = useParams();
    const navigate = useNavigate();
    const library_no = propsParam.library_no;

    const [library, setLibrary] = useState({
        library_no: '',
        emp_no: '',
        library_title: '',
        library_reg_date: '',
        library_views: '',
        library_content: ''
    })

    useEffect(() => {
        fetch("http://localhost:8081/board/library/" + library_no, { // DB에 들림
            method: "GET"   // @GetMapping 사용
          }).then((res) => res.json())
            .then((res) => {
                setLibrary(res)
            });
    }, []);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

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

    const submitlibrary = (e) => {
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

        fetch("http://localhost:8081/board/library/" + library_no, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(library)
            // javascript object를 json으로 변경해서 넘김. 데이터를 스프링부트에서 insert하고 201을 리턴한다.
        })
            .then((res) => {
                console.log(1, res);
                if (res.status === 200) {
                    return res.json();
                } else {
                    return null;
                }
            })
            .then((res) => {    // catch는 여기에서 오류가 발생해야 실행됨.
                console.log('정상', res);
                if (res !== null) {
                    navigate('/board/libraryDetail/' + library_no); // old  버전 : props.history.push()
                } else {
                    alert("게시글 수정에 실패하였습니다.");
                }
            })
            .catch((error) => {
                console.log('실패', error);
            });
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
                                    <span style={{ fontWeight: '600', fontSize: '16px' }}>
                                        공지 수정
                                    </span>
                                </Card.Header>
                                <table className='board-table'>
                                    <tr>
                                        <th style={{ width: '20%' }}>제목</th>
                                        <td style={{ width: '80%' }} colSpan={3}>
                                            <input type='text' name='library_title' style={{ width: '100%' }} value={library.library_title} onChange={changeValue} placeholder='공지 제목을 입력하세요.' />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%' }}>작성자</th>
                                        <td>{library.emp_no}</td>
                                        <th style={{ width: '20%' }}>첨부 파일</th>
                                        <td>
                                            {library.library_filename ? (
                                        <td style={{ width: '40%' }} >
                                            {/* FileUpload 컴포넌트 추가 */}
                                            <FileUpload onFileUpload={handleFileUpload} />
                                        </td>
                                        ) : (
                                            <span>첨부 없음</span>
                                        )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th style={{ width: '20%' }}>작성일</th>
                                        <td>{formatDate(library.library_reg_date)}</td>
                                        <th style={{ width: '20%' }}>조회수</th>
                                        <td>{library.library_views}</td>
                                    </tr>
                                    <tr>
                                        <th colSpan={4}>내용</th>
                                    </tr>
                                    <tr>
                                        <td colSpan={4}>
                                            <textarea
                                                name="library_content"
                                                style={{ width: '100%', height: '500px', verticalAlign: 'top' }}
                                                placeholder="공지 내용을 입력하세요"
                                                value={library.library_content}
                                                onChange={changeValue}
                                            />
                                        </td>
                                    </tr>
                                </table>
                                <Card.Footer>
                                    <div style={{ marginTop:'10px'}}>
                                        <Button onClick={submitlibrary}>수정</Button>
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