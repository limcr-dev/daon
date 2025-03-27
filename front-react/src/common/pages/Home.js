import React from 'react';
import { Container, Content, Row, Col, List, FlexboxGrid, Button, Divider, Card, Text } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import Rightbar from './Rightbar';
import Header from './Header';
import Leftbar from './Leftbar';

const Home = () => {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    navigate(path);
  };

  const handleMoreClick = () => {
    // 여기에 더보기 버튼 클릭 시 실행할 로직을 추가하세요.
    alert('더보기 버튼 클릭!');
  };

  return (
    <Container style={{ minHeight: '100vh', width: '100%'}}>
      <Leftbar />
      <Container style={{ padding: '20px', borderRadius: '8px' }}>
        
        
        <Content>
        <Header style={{ marginTop: '100px' }} />
        
        <Divider/>
      <Row gutter={20} style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
        {/* 공지사항 목록 (1행) */}

        <Col style={{ marginBottom: '20px' }}>
          <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항</span>
              <Button onClick={handleMoreClick} appearance="link">더보기</Button>
            </Card.Header>
            <Card.Body>
              <List bordered>
                <List.Item onClick={() => handleItemClick('/notice/1')}>제59회 납세자의 날 기념 「감사 이벤트」 당첨자 발표</List.Item>
                <List.Item onClick={() => handleItemClick('/notice/2')}>공지사항 2</List.Item>
                <List.Item onClick={() => handleItemClick('/notice/3')}>공지사항 3</List.Item>
              </List>
            </Card.Body>
          </Card>
        </Col>

        {/* 결재현황 및 메일함 (2행에서 가로로 정렬) */}
        <Col>
          <FlexboxGrid justify="space-between" style={{ gap: '20px' }}>
           
            <FlexboxGrid.Item colspan={11}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>결재현황</span>
                  <Button onClick={handleMoreClick} appearance="link">더보기</Button>
                </Card.Header>
                <Card.Body>
                  <List bordered>
                    <List.Item onClick={() => handleItemClick('/payment/1')}>결재내역 1</List.Item>
                    <List.Item onClick={() => handleItemClick('/payment/2')}>결재내역 2</List.Item>
                    <List.Item onClick={() => handleItemClick('/payment/3')}>결재내역 3</List.Item>
                  </List>
                </Card.Body>
              </Card>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={12}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>오늘 뉴스</span>
                  <Button onClick={handleMoreClick} appearance="link">더보기</Button>
                </Card.Header>
                <Card.Body>
                  <List bordered>
                    <List.Item onClick={() => handleItemClick('/news/1')}>[속보] 집가고싶다"</List.Item>
                    <List.Item onClick={() => handleItemClick('/news/2')}>뉴스 제목 2</List.Item>
                    <List.Item onClick={() => handleItemClick('/news/3')}>뉴스 제목 3</List.Item>
                  </List>
                </Card.Body>
              </Card>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={11}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>메일함</span>
                  <Button onClick={handleMoreClick} appearance="link">더보기</Button>
                </Card.Header>
                <Card.Body>
                  <List bordered>
                    <List.Item onClick={() => handleItemClick('/mail/1')}>메일 1</List.Item>
                    <List.Item onClick={() => handleItemClick('/mail/2')}>메일 2</List.Item>
                    <List.Item onClick={() => handleItemClick('/mail/3')}>메일 3</List.Item>
                  </List>
                </Card.Body>
              </Card>
            </FlexboxGrid.Item>

            <FlexboxGrid.Item colspan={12}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>오늘 날씨</span>
                  <Button onClick={handleMoreClick} appearance="link">더보기</Button>
                </Card.Header>
                <Card.Body>
                  <Text size="sm">서울: 맑음, 기온: 18°C</Text>
                  <Text size="sm">강수확률: 0%</Text>
                </Card.Body>
              </Card>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Col>
        
      </Row>
      
    </Content>
      </Container>
      <Rightbar />
    </Container>
  );
};

export default Home;
