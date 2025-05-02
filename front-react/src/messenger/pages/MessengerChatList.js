import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';
import { Button, List } from 'rsuite';

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

const MessengerChatList = () => {
	const { user } = useUser();
	const [rooms, setRooms] = useState([]);
	const [targetUsers, setTargetUsers] = useState({});
	const navigate = useNavigate();

	const fetchRooms = () => {
		if (!user?.emp_no) return;
		const fetchPrivateRooms = request("GET", `/messenger/chat/rooms?userId=${user.emp_no}`);
		const fetchGroupRooms = request("GET", `/messenger/chat/groupList?userId=${user.emp_no}`);

		Promise.all([fetchPrivateRooms, fetchGroupRooms])
			.then(([privateRes, groupRes]) => {
				console.log("1:1 방 목록:", privateRes.data);
				console.log("단체 방 목록:", groupRes.data);

				const allRooms = [...privateRes.data, ...groupRes.data]
					.filter(room => room && room.roomCode); // null 방 제거

				setRooms(allRooms);

				allRooms.forEach(room => {
					request("GET", `/messenger/chat/info?roomCode=${room.roomCode}&userId=${user.emp_no}`)
						.then(res => {
							setTargetUsers(prev => ({ ...prev, [room.roomCode]: res.data.targetUser }));
						})
						.catch(err => console.error("상대방 정보 불러오기 실패:", err));
				});
			})
			.catch(err => console.error("채팅방 목록 호출 실패:", err));
	};

	useEffect(() => {
		fetchRooms();
	}, [user]);

	useEffect(() => {
		const handleStorage = (event) => {
			if (event.key === 'messenger-refresh') {
				console.log("📩 메시지 보냈다 신호 감지! 방 목록 다시 로드");
				const data = JSON.parse(event.newValue || '{}');
				if (data.roomCode && data.lastMessage) {
					setRooms(prevRooms =>
						(prevRooms || []).map(room => {
							if (!room || !room.roomCode) return room;
							if (room.roomCode === data.roomCode) {
								return { ...room, lastMessage: data.lastMessage, lastTime: new Date().toISOString() };
							}
							return room;
						})
					);
				}
				fetchRooms();
			}
		};
		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	}, []);

	const goHome = () => navigate('/messenger/messengerRun');
	const goChattingList = () => navigate('/messenger/messengerChatList');
	const goSetting = () => navigate('/messenger/messengerSetting');

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			height: '100vh'
		}}>
			<div style={{
				padding: '10px',
				backgroundColor: '#f5f5f5',
				borderBottom: '1px solid #ccc',
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center'
			}}>
				<h5 style={{ margin: 0 }}>💬 최근 대화 목록</h5>
				<Button size="xs" appearance="primary" onClick={() => {
					const url = `/messenger/messengerNewChat`;
					window.open(url, '_blank', 'width=500,height=600');
				}}>
					➕ 새 대화
				</Button>
			</div>

			<div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
				<List bordered>
					{rooms.map((room, idx) => {
						const target = targetUsers[room.roomCode];
						return (
							<List.Item key={room.roomCode || idx}>
								<div
									onClick={() => window.open(`/messenger/chat/${room.roomCode}`, '_blank', 'width=500,height=600')}
									style={{ cursor: 'pointer' }}
								>
									{target ? (
										<>
											<div><b>{target.emp_no}</b> {target.emp_name}</div>
											<div>{departmentNames[target.dept_no]} / {positionNames[target.position_id]}</div>
										</>
									) : (
										<>
											<div><b>👥 단체 채팅방</b></div>
										</>
									)}
									<div>{room.lastMessage || "메시지 없음"}</div>
									<div style={{ fontSize: "12px", color: "#888" }}>
										{room.lastTime ? new Date(room.lastTime).toLocaleString() : "시간 없음"}
									</div>
								</div>
							</List.Item>
						);
					})}
				</List>
			</div>

			<div style={{
				display: 'flex',
				justifyContent: 'space-around',
				padding: '10px',
				backgroundColor: '#f5f5f5',
				borderTop: '1px solid #ddd'
			}}>
				<Button onClick={goHome}>👥 Contacts</Button>
				<Button onClick={goChattingList}>💬 Chats</Button>
			</div>
		</div>
	);
};

export default MessengerChatList;
