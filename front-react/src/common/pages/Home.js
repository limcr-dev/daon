import React, { useState } from 'react';
import { Container, Content, List, FlexboxGrid, Button, Card } from 'rsuite';
import { useNavigate } from 'react-router-dom';
import Leftbar from './Leftbar';
import Rightbar from './Rightbar';
import Header from './Header';
import Weather from '../../crawl/weather';
import Weather_more from '../../crawl/weather_more';
import News from '../../crawl/news';
import OrgChartPopup from '../../orgChart/pages/OrgChartPopup';
import EmployeeProfilePage from '../../orgChart/pages/EmployeeProfilePage';

const Home = () => {
  const navigate = useNavigate();

  // 상태 관리
  const [showWeatherMore, setShowWeatherMore] = useState(false);
  const [showTodayWeather, setShowTodayWeather] = useState(false);
  const [showOrgChart, setShowOrgChart] = useState(false);
  const [selectedEmpNo, setSelectedEmpNo] = useState(null);
  const [profileReloadKey, setProfileReloadKey] = useState(0);

  // 핸들러
  const handleItemClick = (path) => navigate(path);
  const handleMoreClick = () => alert('더보기 버튼 클릭!');
  const handleWeatherClick = () => {
    setShowWeatherMore(true);
    setShowTodayWeather(prev => !prev);
  };
  const handleNewsClick = () => navigate('../Crwal/news_more.js');

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
                    <Card style={{ borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: '600' }}>공지사항</span>
                        <Button onClick={handleMoreClick} appearance="link">더보기</Button>
                      </Card.Header>
                      <Card.Body>
                        <List bordered>
                          <List.Item onClick={() => handleItemClick('/notice/1')}>제59회 납세자의 날 기념 「감사 이벤트」</List.Item>
                          <List.Item onClick={() => handleItemClick('/notice/2')}>공지사항 2</List.Item>
                          <List.Item onClick={() => handleItemClick('/notice/3')}>공지사항 3</List.Item>
                        </List>
                      </Card.Body>
                    </Card>
                  </FlexboxGrid.Item>

                  {/* 결재현황 */}
                  <FlexboxGrid.Item colspan={12}>
                    <Card style={{ borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>결재현황</span>
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

                  {/* 뉴스 */}
                  <FlexboxGrid.Item colspan={12}>
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

                  {/* 날씨 */}
                  <FlexboxGrid.Item colspan={24}>
                    <Card style={{ borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <Card.Header style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{!showTodayWeather ? '주간 날씨' : '오늘 날씨'}</span>
                        <Button onClick={handleWeatherClick}>{!showWeatherMore ? '오늘날씨' : ''}</Button>
                      </Card.Header>
                      <Card.Body>
                        {showWeatherMore ? <Weather_more /> : <Weather />}
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
