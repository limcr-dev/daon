import React, { useEffect, useState } from 'react';
import { Container, Content, FlexboxGrid, Button, Card, Tooltip } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import Leftbar from './Leftbar';
import Rightbar from './Rightbar';
import Header from './Header';
import News from '../../crawl/news';
import OrgChartPopup from '../../orgChart/pages/OrgChartPopup';
import EmployeeProfilePage from '../../orgChart/pages/EmployeeProfilePage';
import OverlayTrigger from 'rsuite/esm/internals/Overlay/OverlayTrigger';
import { MdAttachFile } from 'react-icons/md';
import { useUser } from '../contexts/UserContext';
import { request } from '../components/helpers/axios_helper';
import { getFormName, StatusBadge, UrgentBadge } from '../../approve/components/ApprCodeToText';

const Home = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  // 상태 관리

  const [showOrgChart, setShowOrgChart] = useState(false);
  const [selectedEmpNo, setSelectedEmpNo] = useState(null);
  const [profileReloadKey, setProfileReloadKey] = useState(0);
  const [noticeList, setNoticeList] = useState([]);
  const [libraryList, setLibraryList] = useState([]);
  const [docList, setDocList] = useState([]);

  // 핸들러
  const handleNewsClick = () => navigate('../Crwal/news_more.js');

  // noticeList 링크로 들어왔을 때 처음 실행되는 부분
  useEffect(() => {
    const fetchNoticeData = async () => {
      try {
        const response = await request('get', '/board/notice');
        console.log(1, response.data);
        setNoticeList(response.data);
      } catch (error) {
        console.error('공지사항 불러오기 에러:', error);
      }
    };

    fetchNoticeData();
  }, [user]); // 페이지가 처음 로딩될 때 한 번만 실행

  // libraryList 링크로 들어왔을 때 처음 실행되는 부분
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        const response = await request('get', '/board/library');
        console.log(1, response.data);
        setLibraryList(response.data || []); // 응답이 null이면 빈 배열 설정
      } catch (error) {
        console.error('자료실 불러오기 에러:', error);
      }
    };

    fetchLibraryData();
  }, [user]); // 페이지가 처음 로딩될 때 한 번만 실행

  useEffect(() => {
    try {
      const fetchData = async () => {
        const endpoint = `/approve/documents/all/${user.emp_no}`;  // all 엔드포인트 사용

        const response = await request("GET", endpoint);

        if (response && response.data) {
          const data = Array.isArray(response.data) ? response.data : [];
          setDocList(data);
        }
      };

      if (user && user.emp_no) {
        fetchData();
      }
    } catch (error) {
      console.log("error :", error);
    }
  }, [user]);

  return (
    <>
      {/* 메인 레이아웃 */}
      <Container style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9f9f9' }}>
        {/* 왼쪽 사이드바 */}
        <Leftbar onOpenOrgChart={() => setShowOrgChart(true)} />

        {/* 오른쪽 메인 콘텐츠 */}
        <div style={{ flexGrow: 1 }}>
          <Header onProfileUpdated={() => setProfileReloadKey(prev => prev + 1)} />

          <Content>
            <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
              {/* 메인 카드들 */}
              <div style={{ flex: 1 }}>
                <FlexboxGrid justify="space-between" style={{ gap: '20px', flexWrap: 'wrap' }}>
                  {/* 공지사항 */}
                  <FlexboxGrid.Item colspan={24}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항</span>
                        <Button appearance="link" onClick={() => navigate('/board/noticeList')}>더보기</Button>
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
                      </table>
                    </Card>
                  </FlexboxGrid.Item>

                  <FlexboxGrid.Item colspan={24}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>자료실</span>
                        <Button appearance="link" onClick={() => navigate('/board/libraryList')}>더보기</Button>
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
                    </Card>
                  </FlexboxGrid.Item>

                  {/* 결재현황 */}
                  <FlexboxGrid.Item colspan={24}>
                    <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minWidth: '500px' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                        <span style={{ fontWeight: '600', fontSize: '16px' }}>
                          기안 문서
                        </span>
                        <Button appearance="link" onClick={() => navigate('/approve/documents')}>더보기</Button>
                      </Card.Header>
                      <table className='approve-table'>
                        <thead>
                          <tr>
                            <th>번호</th>
                            <th>기안일</th>
                            <th>결재양식</th>
                            <th>제목</th>
                            <th>첨부</th>
                            <th>긴급</th>
                            <th>결재상태</th>
                          </tr>
                        </thead>
                        <tbody>
                          {docList.length === 0 ? (
                            <tr>
                              <td colSpan={7} align='center'>결재 기안 문서가 존재하지 않습니다.</td>
                            </tr>
                          ) : (
                            docList.slice(0, 5).map(doc => (
                              <tr key={doc.doc_no}>
                                <td>{doc.doc_no}</td>
                                <td>{doc.doc_reg_date}</td>
                                <td>{getFormName(doc.doc_form)}</td>
                                <td><Link to={"/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no}>{doc.doc_title}</Link></td>
                                <td>
                                  {doc.doc_filename ? (
                                    <OverlayTrigger
                                      placement="top"
                                      speaker={
                                        <Tooltip>
                                          {doc.doc_filename.includes('_')
                                            ? decodeURIComponent(doc.doc_filename.substring(doc.doc_filename.indexOf('_') + 1))
                                            : doc.doc_filename}
                                        </Tooltip>
                                      }
                                    >
                                      <div style={{ display: 'inline-block', cursor: 'pointer' }}>
                                        <MdAttachFile />
                                      </div>
                                    </OverlayTrigger>
                                  ) : ''}
                                </td>
                                <td><UrgentBadge isUrgent={doc.doc_urgent} /></td>
                                <td><StatusBadge status={doc.doc_status} /></td>
                              </tr>
                            )))}
                        </tbody>
                      </table>
                    </Card>
                  </FlexboxGrid.Item>

                  {/* 뉴스 */}
                  <FlexboxGrid.Item colspan={24}>
                    <Card style={{ borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>랭킹 뉴스</span>
                        <Button onClick={handleNewsClick} appearance="link">더보기</Button>
                      </Card.Header>
                      <Card.Body>
                        <News />
                      </Card.Body>
                    </Card>
                  </FlexboxGrid.Item>



                </FlexboxGrid>
              </div>

              {/* 오른쪽 부가 사이드바 */}
              <div style={{ width: '260px' }}>
                <Rightbar reloadTrigger={profileReloadKey} />
              </div>
            </div>
          </Content>
        </div>
      </Container>

      {/* 팝업 레이어 */}
      {(showOrgChart || selectedEmpNo) && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '200px',
          backgroundColor: 'white', // ✅ 배경 없음
          borderRadius: '12px',  // ✅ 모서리를 둥글게 만든다
        }}>
          {showOrgChart && (
            <OrgChartPopup
              onClose={() => setShowOrgChart(false)}
              onSelectEmployee={(empNo) => {
                setSelectedEmpNo(empNo);
                setShowOrgChart(false);
              }}
            />
          )}

          {selectedEmpNo && (
            <EmployeeProfilePage
              empNo={selectedEmpNo}
              onClose={() => setSelectedEmpNo(null)}
            />
          )}
        </div>
      )}
    </>
  );
};

export default Home;
