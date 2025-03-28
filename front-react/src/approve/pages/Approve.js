import React from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Content,
  Divider,
  FlexboxGrid,
  List,
  Row
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import Header from '../../common/pages/Header';
import "../css/approve.css";

const Approve = () => {
  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < ApproveLeftbar />
        <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
          <Header />
          <Divider />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* 공지사항 목록 (1행) */}

            {/* 결재현황 및 메일함 (2행에서 가로로 정렬) */}
            <Col style={{ marginBottom: '20px' }}>
              <FlexboxGrid justify="start" style={{ gap: '20px' }}>
                <Card style={{ borderRadius: '15px', width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  {/* 상단 상태 표시 */}
                  <Card.Header style={{ justifyContent: 'right' }}>
                    <span>
                      진행중
                    </span>
                  </Card.Header>

                  {/* 본문 */}
                  <Card.Body className="p-4 space-y-2">
                    <p style={{ fontWeight: '600', fontSize: '16px' }}>
                      (신규)휴가신청-연차관리
                    </p>
                    <p style={{ color: 'gray' }}>기안자 : 김지연 부장</p>
                    <p style={{ color: 'gray' }}> 기안일 : 2025-03-17</p>
                    <p style={{ color: 'gray' }}>
                      결재양식 : (신규)휴가신청-연차관리연동
                    </p>
                  </Card.Body>

                  {/* 하단 버튼 */}
                  <Card.Footer>
                    <Button>
                      결재하기
                    </Button>
                  </Card.Footer>
                </Card>

                <Card style={{ borderRadius: '15px', width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  {/* 상단 상태 표시 */}
                  <Card.Header style={{ display: 'flex', justify: 'end' }}>
                    <span>
                      진행중
                    </span>
                  </Card.Header>

                  {/* 본문 */}
                  <Card.Body className="p-4 space-y-2">
                    <p style={{ fontWeight: '600', fontSize: '16px' }}>
                      (신규)휴가신청-연차관리
                    </p>
                    <p style={{ color: 'gray' }}>기안자 : 김지연 부장</p>
                    <p style={{ color: 'gray' }}> 기안일 : 2025-03-17</p>
                    <p style={{ color: 'gray' }}>
                      결재양식 : (신규)휴가신청-연차관리연동
                    </p>
                  </Card.Body>

                  {/* 하단 버튼 */}
                  <Card.Footer>
                    <Button>
                      결재하기
                    </Button>
                  </Card.Footer>
                </Card>
              </FlexboxGrid>
            </Col>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>결재 진행 문서</span>
                  <Button appearance="link">더보기</Button>
                </Card.Header>
                <table class='approve-table'>
                  <tr>
                    <th>기안일</th>
                    <th>결재양식</th>
                    <th>긴급</th>
                    <th>제목</th>
                    <th>첨부</th>
                    <th>결재상태</th>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>진행중</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>진행중</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>진행중</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>진행중</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>진행중</td>
                  </tr>
                </table>
              </Card>
            </Col>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>완료 문서</span>
                  <Button appearance="link">더보기</Button>
                </Card.Header>
                
                <table class='approve-table'>
                  <tr>
                    <th>기안일</th>
                    <th>결재양식</th>
                    <th>긴급</th>
                    <th>제목</th>
                    <th>첨부</th>
                    <th>결재상태</th>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>완료</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>완료</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>완료</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>완료</td>
                  </tr>
                  <tr>
                    <td>2025-03-27</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>긴급</td>
                    <td>(신규)휴가신청-연차관리연동</td>
                    <td>첨부</td>
                    <td>완료</td>
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
export default Approve;