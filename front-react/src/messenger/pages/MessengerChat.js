import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Input, Button, Divider } from 'rsuite';
import { useParams } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { API_URL, getAuthToken, request } from '../../common/components/helpers/axios_helper';
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
	const [participants, setParticipants] = useState([]);
	const [showParticipants, setShowParticipants] = useState(false);
	const [empImg, setEmpImg] = useState(null);
	const chatEndRef = useRef(null);
	const stompClientRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	// 유저 정보 불러오기
	useEffect(() => {
		request("GET", `/messenger/chat/info?roomCode=${roomId}&userId=${user.emp_no}`)
			.then(res => {
				// 1:1 채팅방이면 targetUser 저장
				setTargetUser(res.data.targetUser);
				setEmpImg(res.data.targetUser?.emp_img);
			})
			.catch(err => {
				console.error("상대방 정보 불러오기 실패:", err);
				// 단체방이라 상대방 정보 없을 수 있으니 무시
				setTargetUser(null);

				// 단체채팅방이면 참여자 목록 호출
				request("GET", `/messenger/chat/participants?roomCode=${roomId}`)
					.then(res => setParticipants(res.data))
					.catch(err => console.error("단체 채팅 참여자 불러오기 실패:", err));
			});
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

	// 시간 맞추기
	const formatTime = (timestamp) => {
		if (!timestamp) return '';

		if (typeof timestamp === 'string') {
			// 예: "2025-04-27T00:15:30.000+09:00"
			const timePart = timestamp.split('T')[1];
			if (timePart) {
				const [hour, minute] = timePart.split(':');
				const hourNum = parseInt(hour, 10);
				const ampm = hourNum >= 12 ? '오후' : '오전';
				const displayHour = hourNum % 12 || 12;
				return `${ampm} ${String(displayHour).padStart(2, '0')}:${minute}`;
			}
		}
		if (typeof timestamp === 'object' && timestamp.year) {
			const { hour, minute } = timestamp;
			const ampm = hour >= 12 ? '오후' : '오전';
			const displayHour = hour % 12 || 12;
			return `${ampm} ${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
		}
		return '';
	};

	// 메세지 보내기
	const sendMessage = () => {
		if (!input.trim()) return;

		const message = {
			roomCode: roomId,
			senderId: user.emp_no,
			senderName: user.emp_name,
			content: input,
			type: 'TEXT',
		};

		if (stompClientRef.current && stompClientRef.current.connected) {
			stompClientRef.current.publish({
				destination: `/app/chat.send`,
				body: JSON.stringify(message)
			});
			setInput('');
			// 메시지 보낸 직후 채팅방리스트에 갱신
			localStorage.setItem('messenger-refresh', JSON.stringify({
				time: Date.now(),
				roomCode: roomId,
				lastMessage: message.content
			}));
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

		axios.post(`${API_URL}/messenger/file/upload`, formData, {
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
			.then(async res => {
				const messagesWithNames = await Promise.all(res.data.map(async (msg) => {
					if (msg.senderId === user.emp_no) {
						return { ...msg, senderName: user.emp_name }; // 내꺼는 그냥 내 이름
					} else {
						// 상대방 이름 조회
						try {
							const res = await request("GET", `/messenger/chat/userName?userId=${msg.senderId}`);
							return { ...msg, senderName: res.data.emp_name };
						} catch (err) {
							console.error("이름 조회 실패:", err);
							return { ...msg, senderName: "알 수 없음" };
						}
					}
				}));
				setMessages(messagesWithNames);
			})
			.catch(console.error);

		// 소켓 연결
		const socket = new SockJS(`${API_URL}/ws-chat`);
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
					console.log('받은 메시지:', msg);

					if (msg.timestamp && typeof msg.timestamp === 'object' && msg.timestamp.year) {
						// 객체형이면 문자열로 변환
						const { year, monthValue, dayOfMonth, hour, minute, second } = msg.timestamp;
						msg.timestamp = `${year}-${String(monthValue).padStart(2, '0')}-${String(dayOfMonth).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
					}
					// 메세지 추가
					setMessages(prev => [...prev, msg]);

					// 메시지 받은 순간에 최근대화목록 갱신
					localStorage.setItem('messenger-refresh', JSON.stringify({
						time: Date.now(),
						roomCode: roomId,
						lastMessage: msg.content
					}));
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
		console.log("메시지 불러옴:", messages);
	}, [messages]);

	// 참가자 목록
	const toggleParticipants = () => {
		setShowParticipants(prev => !prev);
	};

	const imageUrl = empImg
		? `${API_URL}/api/images/${encodeURIComponent(empImg)}`
		: '/default-profile.png';

	return (
		<div style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
			{targetUser ? (
				<>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<img
							src={imageUrl}
							alt="프로필"
							style={{
								width: '50px',
								height: '50px',
								borderRadius: '50%',
								marginRight: '10px',
								objectFit: 'cover'
							}}
						/>
						<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
							<div style={{ fontWeight: 'bold', fontSize: '1.1em', lineHeight: '1.2' }}>
								{targetUser.emp_name} [{targetUser.emp_no}]
							</div>
							<div style={{ fontSize: '0.85em', color: 'gray', marginTop: '2px', lineHeight: '1.2' }}>
								{departmentNames[targetUser.dept_no]} / {positionNames[targetUser.position_id]}
							</div>
							<div style={{ fontSize: '0.85em', marginTop: '2px', lineHeight: '1.2', color: onlineStatus ? 'green' : 'gray', marginTop: '5px' }}>
								● {onlineStatus ? '온라인' : '오프라인'}
							</div>
						</div>
					</div>


				</>
			) : (
				<>
					<div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={toggleParticipants}>
						<h4 style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
							<span role="img" aria-label="group" style={{ marginRight: '8px' }}>👥</span> 단체 채팅방
						</h4>
					</div>

					{showParticipants && (
						<div style={{ marginTop: '8px', paddingLeft: '10px' }}>
							{participants.map(user => (
								<div key={user.emp_no} style={{ fontSize: '14px', marginBottom: '4px' }}>
									👤 {user.emp_name} ({user.emp_no})
								</div>
							))}
						</div>
					)}
				</>
			)}

			<div style={{ flex: 1, overflowY: 'auto', padding: '10px', background: '#f9f9f9', borderRadius: '10px' }}>
				{messages.map((msg, idx) => (
					<div key={idx} style={{ display: 'flex', justifyContent: msg.senderId === user.emp_no ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
						<div style={{ maxWidth: '60%', background: msg.senderId === user.emp_no ? '#d4f1ff' : '#e9e9e9', padding: '10px', borderRadius: '15px' }}>
							<b>{msg.senderId === user.emp_no ? '나' : `👤${msg.senderName || '알 수 없음'}`}</b>
							{msg.type === 'IMAGE' ? (
								<img
									src={`${API_URL}${msg.content}`}
									alt={msg.originalName}
									style={{ maxWidth: '200px', borderRadius: '10px' }}
								/>
							) : msg.type === 'FILE' ? (
								<a
									href={`${API_URL}/messenger/file/uploads/download/${msg.content.split('/').pop()}`}
									download
									target="_blank"
									rel="noopener noreferrer"
								>
									{getFilename(msg.content, msg.originalName)}
								</a>
							) : (
								<div>{msg.content}</div>
							)}
							{/* <div style={{ fontSize: '11px', textAlign: 'right', marginTop: '5px', color: '#888' }}>
								{new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
							</div> */}
							<div style={{ fontSize: '11px', textAlign: 'right', marginTop: '5px', color: '#888' }}>
								{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : ''}
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