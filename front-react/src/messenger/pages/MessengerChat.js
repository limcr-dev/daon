import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Input, Button, Divider } from 'rsuite';
import { useParams } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { getAuthToken, request } from '../../common/components/helpers/axios_helper';
import axios from 'axios';

const departmentNames = {
	1: '다온', 10: '경영부', 20: '개발부', 30: '영업부',
	101: '인사팀', 102: '총무팀', 103: '회계팀',
	201: '연구개발팀', 202: '생산관리팀', 203: 'IT팀',
	301: '영업팀', 302: '마케팅팀', 303: '품질관리팀'
};

const positionNames = {
	10: '사장', 15: '부사장', 20: '전무', 25: '상무', 30: '이사',
	35: '부장', 40: '차장', 45: '과장', 50: '대리', 55: '사원', 60: '인턴'
};

const MessengerChat = () => {
	// UserContext에서 사용자 정보 가져오기
	const { user } = useUser();
	const { roomId } = useParams();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [connected, setConnected] = useState(false);
	const [targetUser, setTargetUser] = useState(null);
	const [isTyping, setIsTyping] = useState(false);
	const [typingUserName, setTypingUserName] = useState('');
	const [onlineStatus, setOnlineStatus] = useState(false);
	const chatEndRef = useRef(null);
	const stompClientRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	// 유저 정보 불러오기
	useEffect(() => {
		request("GET", `/messenger/chat/info?roomCode=${roomId}&userId=${user.emp_no}`)
			.then(res => setTargetUser(res.data.targetUser))
			.catch(err => console.error("상대방 정보 불러오기 실패:", err));
	}, [roomId]);

	// 입력중
	const handleInputChange = (value) => {
		setInput(value);
		if (stompClientRef.current?.connected && value.trim()) {
			stompClientRef.current.publish({
				destination: `/app/chat.typing`,
				body: JSON.stringify({
					roomCode: roomId,
					senderId: user.emp_no,
					senderName: user.emp_name
				})
			});
		}
	};

	// 메세지 보내기
	const sendMessage = () => {
		if (!input.trim()) return;

		const message = {
			roomCode: roomId,
			senderId: user.emp_no,
			content: input,
			type: 'TEXT',
		};

		if (stompClientRef.current && stompClientRef.current.connected) {
			stompClientRef.current.publish({
				destination: `/app/chat.send`,
				body: JSON.stringify(message)
			});
			setInput('');
		} else {
			console.warn("STOMP 연결이 아직 완료되지 않았습니다.");
		}
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('roomCode', roomId);
		formData.append('senderId', user.emp_no);

		axios.post(`http://${window.location.hostname}:8081/messenger/file/upload`, formData, {
			headers: { 'Authorization': `Bearer ${getAuthToken()}` }
		})
			.then(res => {
				const message = {
					roomCode: roomId,
					senderId: user.emp_no,
					content: `/uploads/${res.data.savedName}`,
					type: file.type.startsWith("image/") ? "IMAGE" : "FILE",
					originalName: res.data.originalName,
					// timestamp: new Date().toISOString()
				};
				stompClientRef.current.publish({
					destination: "/app/chat.send",
					body: JSON.stringify(message)
				});
			})
			.catch(console.error);
	};

	// 소켓 연결 및 구독
	useEffect(() => {
		// 이전 메시지 불러오기
		request("GET", `/messenger/chat/history?roomCode=${roomId}`)
			.then(res => setMessages(res.data))
			.catch(err => console.error("이전 메시지 로드 실패:", err));

		// 소켓 연결
		const socket = new SockJS(`http://${window.location.hostname}:8081/ws-chat`);
		const client = new Client({
			webSocketFactory: () => socket,
			connectHeaders: {
				emp_no: String(user.emp_no)
			},
			reconnectDelay: 5000,
			onConnect: () => {
				setConnected(true);

				client.subscribe(`/topic/room/${roomId}`, (message) => {
					const msg = JSON.parse(message.body);
					setMessages(prev => [...prev, msg]);
				});

				// 입력중 표시
				client.subscribe(`/topic/room/${roomId}/typing`, (message) => {
					const typingInfo = JSON.parse(message.body);
					setIsTyping(true);
					setTypingUserName(typingInfo.senderName || '상대방');

					clearTimeout(typingTimeoutRef.current);
					typingTimeoutRef.current = setTimeout(() => {
						setIsTyping(false);
						setTypingUserName('');
					}, 3000);
				});
			}
		});

		client.activate();
		stompClientRef.current = client;
		return () => client.deactivate();
	}, [roomId]);

	useEffect(() => {
		window.name = `chat-${roomId}`; // 새창 식별자
		localStorage.setItem(`chat-open-${roomId}`, 'true');

		const unloadHandler = () => {
			localStorage.removeItem(`chat-open-${roomId}`);
		};

		window.addEventListener('beforeunload', unloadHandler);
		return () => {
			unloadHandler();
			window.removeEventListener('beforeunload', unloadHandler);
		};
	}, [roomId]);

	// 상태
	useEffect(() => {
		if (!targetUser) return;

		const fetchStatus = () => {
			request("GET", `/messenger/chat/status?targetId=${targetUser.emp_no}`)
				.then(res => setOnlineStatus(res.data))
				.catch(err => console.error("상대방 상태 조회 실패:", err));
		};

		fetchStatus();
		const interval = setInterval(fetchStatus, 5000); // 5초마다 체크
		return () => clearInterval(interval);
	}, [targetUser]);

	const isImage = (filename) => /\.(png|jpe?g|gif|bmp|webp)$/i.test(filename);
	const getFilename = (uuidName, originalName) => originalName || uuidName?.split('_').slice(1).join('_');

	// 스크롤 하단 고정
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{targetUser && (
				<>
					<h4><img src={`/images/profiles/${targetUser.emp_img}`} alt="프로필" style={{ width: '50px', borderRadius: '50%' }} />{targetUser.emp_name} [{targetUser.emp_no}]</h4>
					<p>{departmentNames[targetUser.dept_no]} / {positionNames[targetUser.position_id]}</p>
					<p style={{ color: onlineStatus ? 'green' : 'gray' }}>
						● {onlineStatus ? '온라인' : '오프라인'}
					</p>
					<Divider />
				</>
			)}

			<div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#f9f9f9', borderRadius: '10px' }}>
				{messages.map((msg, idx) => (
					<div key={idx} style={{ display: 'flex', justifyContent: msg.senderId === user.emp_no ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
						<div style={{ maxWidth: '60%', background: msg.senderId === user.emp_no ? '#d4f1ff' : '#e9e9e9', padding: '10px', borderRadius: '15px' }}>
							<b>{msg.senderId === user.emp_no ? '나' : `👤${targetUser?.emp_name}`}</b>
							{msg.type === 'IMAGE' ? (
								<img
									src={`http://${window.location.hostname}:8081${msg.content}`}
									alt={msg.originalName}
									style={{ maxWidth: '200px', borderRadius: '10px' }}
								/>
							) : msg.type === 'FILE' ? (
								<a
									href={`http://${window.location.hostname}:8081/messenger/file/uploads/download/${msg.content.split('/').pop()}`}
									download
									target="_blank"
									rel="noopener noreferrer"
								>
									{getFilename(msg.content, msg.originalName)}
								</a>
							) : (
								<div>{msg.content}</div>
							)}
							<div style={{ fontSize: '11px', textAlign: 'right', marginTop: '5px', color: '#888' }}>
								{new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
							</div>
						</div>
					</div>
				))}
				{isTyping && <p style={{ color: '#888' }}>{typingUserName}님이 입력 중...</p>}
				<div ref={chatEndRef} />
			</div>

			<div style={{ display: 'flex', marginTop: '15px', alignItems: 'center' }}>
				<Input
					value={input}
					onChange={handleInputChange}
					placeholder="메시지를 입력하세요..."
					onPressEnter={sendMessage}
					style={{ flex: 1 }}
				/>
				<input
					type="file"
					onChange={handleFileChange}
					style={{ display: 'none' }}
					id="file-upload"
				/>
				<label htmlFor="file-upload">
					<Button as="span" appearance="ghost" style={{ marginLeft: '10px' }}>
						📎
					</Button>
				</label>
				<Button disabled={!connected} appearance="primary" onClick={sendMessage} style={{ marginLeft: '10px' }}>
					전송
				</Button>
			</div>
		</div>
	);
};

export default MessengerChat;