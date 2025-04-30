import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Divider } from 'rsuite';

const MessengerNewChat = () => {
  const navigate = useNavigate();

  const goSingle = () => navigate('/messengerMgt/messengerNewSingle');
  const goGroup = () => navigate('/messengerMgt/messengerNewGroup');

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h3>새 대화 시작</h3>
      <Divider />
      <Button appearance="primary" size="lg" onClick={goSingle} style={{ marginBottom: '20px', width: '200px' }}>
        1:1 채팅 시작
      </Button>
      <br />
      <Button appearance="primary" size="lg" onClick={goGroup} style={{ width: '200px' }}>
        단체 채팅 시작
      </Button>
    </div>
  );
};

export default MessengerNewChat;
