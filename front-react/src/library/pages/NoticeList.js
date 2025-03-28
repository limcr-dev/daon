import React from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Content,
  Divider,
  Row
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import "../css/board.css";
import LibraryLeftbar from './BaordLeftbar';

const NoticeList = () => {
  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < LibraryLeftbar />
        <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
          <Header />
          <Divider />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항</span>
                  <Button appearance="link">더보기</Button>
                </Card.Header>
                <table className='board-table'>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일</th>
                    <th>조회수</th>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                  </tr>
                </table>
              </Card>
            </Col>

          </Row>
        </Content>
      </Container>
    </Container>
  );
};
export default NoticeList;