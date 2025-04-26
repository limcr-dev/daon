import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../../common/contexts/UserContext';

const MesseangerPop = () => {
	const { user } = useUser();

	useEffect(() => {
		if (!user) return;

		const socket = new SockJS("http://localhost:8081/ws-chat");
		const client = new Client({
			webSocketFactory: () => socket,
			connectHeaders: {
				emp_no: String(user.emp_no),
			},
			reconnectDelay: 5000,
			onConnect: () => {
				console.log("🔔 알림 WebSocket 연결됨");

				client.subscribe(`/topic/alert/${user.emp_no}`, (message) => {
					const msg = JSON.parse(message.body);

					// 채팅방이 이미 열려 있는지 확인
					const isOpen = localStorage.getItem(`chat-open-${msg.roomCode}`) === 'true';
					if (isOpen) return;

					const preview = msg.type === 'TEXT' ? msg.content : (msg.type === 'FILE' ? '[파일]' : '[이미지]');

					toast.info(`${msg.senderName || '새 메시지'} 님: ${preview}`, {
						position: "bottom-right",
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						onClick: () => {
							const newWindow = window.open(`/messenger/chat/${msg.roomCode}`, '_blank', 'width=500,height=600');
							if (newWindow) {
								newWindow.focus();
							}
						}
					});
				});
			}
		});
		client.activate();
		return () => client.deactivate();
	}, [user]);

	return (
		<div>
			<ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
		</div>
	);
};

export default MesseangerPop;