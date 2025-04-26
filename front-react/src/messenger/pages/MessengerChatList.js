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
	// UserContext에서 사용자 정보 가져오기
	const { user } = useUser();
	const [rooms, setRooms] = useState([]);
	const [targetUsers, setTargetUsers] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		if (!user?.emp_no) return;
		// 1. 채팅방 목록 불러오기
		request("GET", `/messenger/chat/rooms?userId=${user.emp_no}`)
			.then(res => {
				setRooms(res.data);

				// 2. 각 roomCode마다 상대방 정보 요청
				res.data.forEach(room => {
					if (room.roomCode) {
						request("GET", `/messenger/chat/info?roomCode=${room.roomCode}&userId=${user.emp_no}`)
							.then(res => {
								setTargetUsers(prev => ({ ...prev, [room.roomCode]: res.data.targetUser }));
							})
							.catch(err => console.error("상대방 정보 불러오기 실패:", err));
					}
				});
			})
			.catch(err => console.error("채팅방 목록 호출 실패:", err));
	}, [user]);

	const goHome = () => navigate('/messenger/messengerRun');
	const goChattingList = () => navigate('/messenger/messengerChatList');
	const goSetting = () => navigate('/messenger/messengerSetting');

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			height: '100vh'
		}}>
			{/* 상단 고정 영역 */}
			<div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderBottom: '1px solid #ccc' }}>
				<h5>💬 최근 대화 목록</h5>
			</div>

			{/* 채팅 리스트 영역 */}
			<div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
				<List bordered>
					{rooms.map(room => {
						const target = targetUsers[room.roomCode];
						return (
							<List.Item key={room.roomCode}>
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
										<div>상대방 정보 로딩 중...</div>
									)}
									<div>{room.lastMessage || "메시지 없음"}</div>
									<div style={{ fontSize: "12px", color: "#888" }}>
										{room.lastTime ? new Date(room.lastTime).toLocaleString() : ""}
									</div>
								</div>
							</List.Item>
						);
					})}
				</List>
			</div>

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

export default MessengerChatList;