import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Content, Row, Tooltip } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import BoardLeftbar from './BoardLeftbar';
import { Link, useNavigate } from 'react-router-dom';
import { request } from '../../common/components/helpers/axios_helper';
import OverlayTrigger from 'rsuite/esm/internals/Overlay/OverlayTrigger';
import { MdAttachFile } from 'react-icons/md';
import "../css/board.css";

const LibraryList = () => {
  const navigate = useNavigate();
  const [libraryList, setLibraryList] = useState([]);

  // libraryList 링크로 들어왔을 때 처음 실행되는 부분
  // dependency가 빈 배열[]이기 때문에 처음 한 번만 실행됨
  useEffect(() => {
    const fetchLibraryList = async () => {
      try {
        const res = await request("get", "/board/library");
        console.log(1, res.data);
        setLibraryList(res.data); // 응답 값을 setLibraryList 통해서 LibraryList 변수에 저장함
      } catch (error) {
        console.error("자료실 목록 조회 실패:", error);
      }
    };

    fetchLibraryList();
  }, []); // [] : dependency, 페이지가 처음 로딩될 때 한 번만 실행되도록 사용하는 것

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
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>자료 목록</span>
                </Card.Header>
                <table className='board-table'>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>첨부 파일</th>
                    <th>작성일</th>
                    <th>조회수</th>
                  </tr>
                  {libraryList.length === 0 ? (
                    <tr>
                      <td colSpan={6} align='center'>자료가 존재하지 않습니다.</td>
                    </tr>
                  ) : (
                    libraryList.map(library => (
                      <tr key={library.library_no}>
                        <td>{library.library_no}</td>
                        <td><Link to={"/board/libraryDetail/" + library.library_no}>{library.library_title}</Link></td>
                        <td>{library.emp_name}</td>
                        <td>
                          {library.library_filename ? (
                            <OverlayTrigger
                              placement="top"
                              speaker={
                                <Tooltip>
                                  {library.library_filename.includes('_')
                                    ? decodeURIComponent(library.library_filename.substring(library.library_filename.indexOf('_') + 1))
                                    : library.library_filename}
                                </Tooltip>
                              }
                            >
                              <div style={{ display: 'inline-block', cursor: 'pointer' }}>
                                <MdAttachFile />
                              </div>
                            </OverlayTrigger>
                          ) : ''}
                        </td>
                        <td>{library.library_reg_date}</td>
                        <td>{library.library_views}</td>
                      </tr>
                    )))}
                </table>
                <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end', padding: '15px' }}>
                  <Button appearance="primary" color="blue" onClick={() => navigate('/board/insertLibrary')}>작성</Button>
                </Card.Footer>
              </Card>
            </Col>
          </Row>
        </Content>
      </Container>
    </Container>
  );
};
export default LibraryList;