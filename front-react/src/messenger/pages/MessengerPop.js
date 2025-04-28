import React, { useEffect, useRef } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useUser } from '../../common/contexts/UserContext';

const MessengerPop = () => {
	const { user } = useUser();
	const clientRef = useRef(null);

	useEffect(() => {
		if (!user?.emp_no) return;

		const socket = new SockJS(`http://${window.location.hostname}:8081/ws-chat`);
		const client = new Client({
			webSocketFactory: () => socket,
			reconnectDelay: 5000,
			connectHeaders: {
				emp_no: String(user.emp_no),
			},
			onConnect: () => {
				console.log("🔔 알림 WebSocket 연결 완료");

				// ✨ 소켓 연결 완료 후 약간 딜레이 주고 구독
				setTimeout(() => {
					client.subscribe(`/topic/alert/${user.emp_no}`, (message) => {
						console.log("내가 구독한 경로:", `/topic/alert/${user.emp_no}`);
						const msg = JSON.parse(message.body);
						// 1. 현재 URL 체크
						const currentPath = window.location.pathname;

						const isMessengerRun = currentPath.startsWith('/messenger/messengerRun');
						const isChatList = currentPath.startsWith('/messenger/messengerChatList');
						const isChatRoom = currentPath.startsWith('/messenger/chat/');

						// 2. localStorage + 현재 화면 둘 다 체크
						const isChatWindowOpen = localStorage.getItem(`chat-open-${msg.roomCode}`) === 'true';
						const isMessengerPage = isMessengerRun || isChatList || isChatRoom;

						// 3. 둘 중 하나라도 해당하면 알림 띄우지 않음
						if (isChatWindowOpen || isMessengerPage) {
							console.log("✅ 메신저 관련 화면이거나 채팅창 열려있어서 알림 스킵:", msg.roomCode);
							return;
						}

						console.log("🔔 수신된 알림 메시지:", msg);

						const preview = msg.type === 'TEXT'
							? (msg.content.length > 20 ? msg.content.slice(0, 20) + "..." : msg.content)
							: (msg.type === 'FILE' ? '[파일]' : '[이미지]');

						toast.info(`${msg.senderName || '새 메시지'} 님: ${preview}`, {
							position: "bottom-right",
							autoClose: 3000,
							hideProgressBar: false,
							closeOnClick: true,
							pauseOnHover: true,
							onClick: () => {
								// window.location.href = `/messenger/chat/${msg.roomCode}`;
								const windowName = `chat-${msg.roomCode}`;
								window.open(`${window.location.origin}/messenger/chat/${msg.roomCode}`, windowName, 'width=500,height=600');
							}
						});
					});
				}, 500); // << 0.5초 딜레이 후 구독
			}
		});

		client.activate();
		clientRef.current = client;

		return () => {
			if (clientRef.current) {
				clientRef.current.deactivate();
			}
		};
	}, [user?.emp_no]);

	return (
		<>
			<ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
		</>
	);
};

export default MessengerPop;
