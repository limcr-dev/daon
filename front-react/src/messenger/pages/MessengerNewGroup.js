import React, { useEffect, useState } from 'react';
import { Button, Input, List, Checkbox } from 'rsuite';
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';

const MessengerNewGroup = () => {
  const { user } = useUser();
  const [employees, setEmployees] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (!user?.emp_no) return;
    request('GET', `/messenger/chat/users?myId=${user.emp_no}`)
      .then(res => {
        setEmployees(res.data);
      })
      .catch(console.error);
  }, [user]);

  const handleSelect = (empNo) => {
    setSelectedIds(prev =>
      prev.includes(empNo)
        ? prev.filter(id => id !== empNo)
        : [...prev, empNo]
    );
  };

  const handleCreateGroup = () => {
    if (selectedIds.length < 1) {
      alert('1명 이상 선택하세요.');
      return;
    }
    const body = {
      creatorId: user.emp_no,
      userIds: selectedIds
    };
    request('POST', '/messenger/chat/createGroup', body)
      .then(res => {
        const newRoomCode = res.data.roomCode;
        window.open(`/messengerMgt/chat/${newRoomCode}`, '_blank', 'width=500,height=600');
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
        <span style={{ marginRight: '8px' }}>👥</span> 단체 채팅방 생성
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
            <List.Item key={emp.emp_no} style={{ display: 'flex', alignItems: 'center', padding: '10px 15px' }}>
              <Checkbox
                checked={selectedIds.includes(emp.emp_no)}
                onChange={() => handleSelect(emp.emp_no)}
                style={{ marginRight: '10px' }}
              />
              {emp.emp_name} ({emp.emp_no})
            </List.Item>
          ))}
        </List>
      </div>
      <Button appearance="primary" block style={{ marginTop: '10px', height: '40px' }} onClick={handleCreateGroup}>
        ➕ 단체 채팅방 만들기
      </Button>
    </div>
  );
};

export default MessengerNewGroup;
