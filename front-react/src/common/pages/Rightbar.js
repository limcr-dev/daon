import React, { useState } from 'react';
import { Button, Card, Sidebar, Sidenav } from 'rsuite';
import Profile from '../components/rightbar/Profile';
import Weather_more from '../../crawl/weather_more';
import Weather from '../../crawl/weather';

const Rightbar = ({ reloadTrigger }) => {
  const [showWeatherMore, setShowWeatherMore] = useState(false);
  const [showTodayWeather, setShowTodayWeather] = useState(false);

  const handleWeatherClick = () => {
    setShowWeatherMore(true);
    setShowTodayWeather(prev => !prev);
  };

  return (
    <Sidebar style={{ display: 'flex', flexDirection: 'column' }} collapsible>
      <Sidenav.Header>
        <Profile reloadTrigger={reloadTrigger} />
      </Sidenav.Header>

      <Sidenav>
        <Sidenav.Body>
          <Card style={{ borderRadius: 15, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
              <span style={{ fontWeight: '600', fontSize: '16px' }}>
                {showWeatherMore ? '오늘 날씨' : '주간 날씨'}
              </span>
              <Button size="xs" onClick={handleWeatherClick}>
                {showWeatherMore ? '주간날씨' : '오늘날씨'}
              </Button>
            </Card.Header>
            <Card.Body>
              {showWeatherMore ? <Weather_more /> : <Weather />}
            </Card.Body>
          </Card>
        </Sidenav.Body>
      </Sidenav>
    </Sidebar>
  );
};

export default Rightbar;