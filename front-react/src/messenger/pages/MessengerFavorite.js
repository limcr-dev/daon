import React, { useState } from 'react';
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';
import { Avatar, List } from 'rsuite';

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

const MessengerFavorite = ({ list }) => {
  const { user } = useUser();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, emp_no: null });
  const [onlineStatus, setOnlineStatus] = useState(false);

  const openChat = async (emp_no) => {
    const res = await request("POST", "/messenger/chat/enter", {
      userId: user.emp_no,
      targetId: emp_no
    });
    const roomCode = res.data?.roomCode;
    if (roomCode) {
      window.open(`/messenger/chat/${roomCode}`, '_blank', 'width=500,height=600');
    }
  };

  const removeFavorite = (emp_no) => {
    request("DELETE", `/messenger/favorite/remove?userId=${user.emp_no}&favoriteId=${emp_no}`)
      .then(() => {
        alert("즐겨찾기 해제됨");
        window.location.reload(); // 또는 상위에서 fetchFavorites 다시 호출
      })
      .catch(() => alert("해제 실패"));
  };

  const handleContextMenu = (e, emp_no) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, emp_no });
  };

  return (
    <div>
      <h5 style={{ marginBottom: '15px' }}>⭐ 즐겨찾기목록</h5>
      <List bordered hover>
        {list.map((emp, idx) => (
          <List.Item
            key={idx}
            onDoubleClick={() => openChat(emp.emp_no)}
            onContextMenu={(e) => handleContextMenu(e, emp.emp_no)}
            style={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}
          >
            <Avatar circle src={`/images/profiles/${emp.emp_img}`} />
            <div style={{ flexGrow: 1 }}>
              <div><strong>{emp.emp_name}</strong></div>
              <div style={{ fontSize: '12px', color: '#888' }}>
                {departmentNames[emp.dept_no] || '-'} / {positionNames[emp.position_id] || '-'}
              </div>
            </div>
            <p style={{ color: onlineStatus ? 'green' : 'gray' }}>
              ● {onlineStatus ? '온라인' : '오프라인'}
            </p>
          </List.Item>
        ))}
      </List>

      {/* 우클릭 메뉴 */}
      {contextMenu.visible && (
        <ul style={{
          position: 'absolute', top: contextMenu.y, left: contextMenu.x,
          backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '6px',
          padding: '8px', listStyle: 'none', zIndex: 1000
        }}>
          <li
            style={{ cursor: 'pointer', color: 'red' }}
            onClick={() => removeFavorite(contextMenu.emp_no)}
          >❌ 즐겨찾기 해제</li>
        </ul>
      )}
    </div>
  );
};

export default MessengerFavorite;