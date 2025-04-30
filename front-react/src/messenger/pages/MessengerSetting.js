import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { Button } from 'rsuite';

const MessengerSetting = () => {
	// UserContext에서 사용자 정보 가져오기
	const { user } = useUser();
	const navigate = useNavigate();

	const goHome = () => navigate('/messengerMgt/messengerRun');
	const goChattingList = () => navigate('/messengerMgt/messengerChatList');
	const goSetting = () => navigate('/messengerMgt/messengerSetting');
	return (
		<div>
			설정 think중..
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
				<Button onClick={goSetting}>⚙️ Settings</Button>
			</div>
		</div>
	);
};

export default MessengerSetting;