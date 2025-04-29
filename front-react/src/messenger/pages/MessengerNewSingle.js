import React, { useEffect, useState } from 'react';
import { Button, Input, List } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';

const MessengerNewSingle = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (!user?.emp_no) return;
    request('GET', `/messenger/chat/users?myId=${user.emp_no}`)
      .then(res => setEmployees(res.data))
      .catch(console.error);
  }, [user]);

  const handleStartChat = (targetId) => {
    request('POST', '/messenger/chat/enter', { userId: user.emp_no, targetId })
      .then(res => {
        const { roomCode, newRoom } = res.data;
        window.open(`/messenger/chat/${roomCode}`, '_blank', 'width=500,height=600');
        if (newRoom && window.opener) {
          console.log("새 방 생성 -> 부모창 리로드");
          window.opener.location.reload();
        }
        window.close();
      })
      .catch(console.error);
  };

  const filteredEmployees = employees.filter(emp =>
    emp.emp_name.includes(searchKeyword) ||
    String(emp.emp_no).includes(searchKeyword)
  );

  return (
    <div style={{ padding: '20px', height: '100vh', background: '#ffffff', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ marginBottom: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px' }}>💬</span> 1:1 채팅 시작
      </h4>
      <Input
        placeholder="사번/이름 검색"
        value={searchKeyword}
        onChange={value => setSearchKeyword(value)}
        style={{ marginBottom: '10px' }}
      />
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List bordered>
          {filteredEmployees.map(emp => (
            <List.Item
              key={emp.emp_no}
              style={{ cursor: 'pointer', padding: '10px 15px' }}
              onClick={() => handleStartChat(emp.emp_no)}
            >
              {emp.emp_name} ({emp.emp_no})
            </List.Item>
          ))}
        </List>
      </div>
      <Button appearance="primary" block style={{ marginTop: '10px', height: '40px' }} onClick={() => window.close()}>
        닫기
      </Button>
    </div>
  );
};

export default MessengerNewSingle;
