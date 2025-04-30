import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Content, Row, Tooltip } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import "../css/board.css";
import BoardLeftbar from './BoardLeftbar';
import { Link, useNavigate } from 'react-router-dom';
import { MdAttachFile } from "react-icons/md";
import OverlayTrigger from 'rsuite/esm/internals/Overlay/OverlayTrigger';
import { request } from '../../common/components/helpers/axios_helper';

const Board = () => {

  const navigate = useNavigate();

  const [noticeList, setNoticeList] = useState([]);
  const [libraryList, setLibraryList] = useState([]);

  // noticeList 링크로 들어왔을 때 처음 실행되는 부분
  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await request('get', '/board/notice');
        setNoticeList(response.data || []);
      } catch (error) {
        console.error('공지사항 불러오기 에러:', error);
      }
    };

    fetchNoticeData();
  }, []); // 페이지가 처음 로딩될 때 한 번만 실행

  const notice = () => {
    navigate('/boardMgt/noticeList');
  }

  // libraryList 링크로 들어왔을 때 처음 실행되는 부분
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await request('get', '/board/library');
        setLibraryList(response.data || []); // 응답이 null이면 빈 배열 설정
      } catch (error) {
        console.error('자료실 불러오기 에러:', error);
      }
    };

    fetchLibraryData();
  }, []); // 페이지가 처음 로딩될 때 한 번만 실행

  const library = () => {
    navigate('/boardMgt/libraryList');
  }

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < BoardLeftbar />
        <Content>
          <Header />
          <Content>
            <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
              <Col style={{ marginBottom: '20px' }}>
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항</span>
                    <Button appearance="link" onClick={notice}>더보기</Button>
                  </Card.Header>
                  <table className='board-table'>
                    <thead>
                      <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>첨부 파일</th>
                        <th>작성일</th>
                        <th>조회수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noticeList.length === 0 ? (
                        <tr>
                          <td colSpan={6} align='center'>공지사항이 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        noticeList.map(notice => (
                          <tr key={notice.notice_no}>
                            <td>{notice.notice_no}</td>
                            <td><Link to={"/board/noticeDetail/" + notice.notice_no}>{notice.notice_title}</Link></td>
                            <td>{notice.emp_name}</td>
                            <td>
                              {notice.notice_filename ? (
                                <OverlayTrigger
                                  placement="top"
                                  speaker={
                                    <Tooltip>
                                      {notice.notice_filename.includes('_')
                                        ? decodeURIComponent(notice.notice_filename.substring(notice.notice_filename.indexOf('_') + 1))
                                        : notice.notice_filename}
                                    </Tooltip>
                                  }
                                >
                                  <div style={{ display: 'inline-block', cursor: 'pointer' }}>
                                    <MdAttachFile />
                                  </div>
                                </OverlayTrigger>
                              ) : ''}
                            </td>
                            <td>{notice.notice_reg_date}</td>
                            <td>{notice.notice_views}</td>
                          </tr>
                        )))}
                    </tbody>
                  </table>
                </Card>
              </Col>

              <Col style={{ marginBottom: '20px' }}>
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>자료실</span>
                    <Button appearance="link" onClick={library}>더보기</Button>
                  </Card.Header>
                  <table className='board-table'>
                    <thead>
                    <tr>
                      <th>번호</th>
                      <th>제목</th>
                      <th>작성자</th>
                      <th>첨부 파일</th>
                      <th>작성일</th>
                      <th>조회수</th>
                    </tr>
                    </thead>
                    <tbody>
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
                      </tbody>
                  </table>
                </Card>
              </Col>
            </Row>
          </Content>
        </Content>
      </Container>
    </Container>
  );
};
export default Board;