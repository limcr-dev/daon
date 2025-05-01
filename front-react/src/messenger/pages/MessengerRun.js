import React, { useEffect, useState } from 'react';
import { Container, Content, InputGroup, Input } from 'rsuite';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';
import MessengerFavorite from './MessengerFavorite';
import { useNavigate } from 'react-router-dom';
import {
  Button
} from 'rsuite';

const MessengerRun = () => {

  // UserContext에서 사용자 정보 가져오기
  const { user } = useUser();
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const goHome = () => navigate('/messengerMgt/messengerRun');
  const goChattingList = () => navigate('/messengerMgt/messengerChatList');
  const goSetting = () => navigate('/messengerMgt/messengerSetting');

  const filtered = Array.isArray(favorites)
    ? favorites.filter(item =>
      item.emp_name.includes(search) || String(item.emp_no).includes(search)
    )
    : [];


  const fetchFavorites = (keyword = '') => {
    const url = keyword
      ? `/messenger/favorite/search?userId=${user.emp_no}&keyword=${encodeURIComponent(keyword)}`
      : `/messenger/favorite/list?userId=${user.emp_no}`;

    request("GET", url)
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.warn("서버 응답이 배열이 아닙니다:", data);
          setFavorites([]);
        }
      })
      .catch(() => setFavorites([]));

  };

  useEffect(() => {
    if (!user?.emp_no) return;
    request("GET", `/messenger/favorite/list?userId=${user.emp_no}`)
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.warn("서버 응답이 배열이 아닙니다:", data);
          setFavorites([]);
        }
      })
      .catch(() => setFavorites([]));
  }, [user.emp_no]);

  return (
    <Container style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 상단 검색창 고정 */}
      <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ddd' }}>
        <InputGroup inside>
          <Input
            placeholder="사번/이름 검색"
            value={search}
            onChange={(value) => {
              setSearch(value);
              fetchFavorites(value);
            }}
          />
        </InputGroup>
      </div>

      {/* 즐겨찾기 목록 - 가운데 스크롤 */}
      <Content style={{ flex: 1, overflowY: 'auto', padding: '15px' }}>
        <MessengerFavorite list={favorites} />
      </Content>

      {/* 하단 메뉴 고정 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderTop: '1px solid #ddd'
      }}>
        <Button onClick={goHome}>👥 Contacts</Button>
        <Button onClick={goChattingList}>💬 Chats</Button>
        {/* <Button onClick={goSetting}>⚙️ Settings</Button> */}
      </div>
    </Container>
  );
};
export default MessengerRun;