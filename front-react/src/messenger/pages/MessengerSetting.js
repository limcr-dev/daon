import React from 'react';
import {
	FiSearch,
	FiMessageSquare,
	FiUsers,
	FiSettings
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const MessengerSetting = () => {
	const navigate = useNavigate();

	const goHome = () => {
		navigate('/messenger/messengerRun');
	}

	const goChattingList = () => {
		navigate('/messenger/messengerChatList');
	}

	const goSetting = () => {
		navigate('/messenger/messengerSetting');
	}
	return (
		<div>
			설정 think중..
			{/* Bottom Navigation */}
			<div className="flex justify-around items-center py-3 border-t bg-white" style={{ display: 'flex' }}>
				<div className="flex flex-col items-center text-gray-400">
					<button className="text-xs mt-1" onClick={goHome}><FiUsers size={20} />Contacts</button>
				</div>

				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

				<div className="flex flex-col items-center text-purple-400">
					<button className="text-xs mt-1" onClick={goChattingList}><FiMessageSquare size={20} />Chats</button>
				</div>

				&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

				<div className="flex flex-col items-center text-gray-400">
					<button className="text-xs mt-1" onClick={goSetting}><FiSettings size={20} />Settings</button>
				</div>
			</div>
		</div>
	);
};

export default MessengerSetting;