import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Input,
  InputGroup,
  Modal,
  Button
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import "../css/abList.css";
import Paging from '../../common/components/paging';
import { useUser } from '../../common/contexts/UserContext';
import { request } from '../../common/components/helpers/axios_helper';
import MessengerPop from './MessengerPop';
import Header from '../../common/pages/Header';

const styles = {
  width: 300,
  marginBottom: 0
};

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

const AddressBook = () => {

  // UserContext에서 사용자 정보 가져오기
  const { user } = useUser();
  console.log("현재 유저:", user);

  const [abList, setAbList] = useState([]);
  const [paging, setPaging] = useState({ page: 1, size: 10, totalCount: 0 });
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState();
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, user: null });
  const [modal, setModal] = useState({
    visible: false,
    type: '', // 'chat' or 'email'
    user: null
  });

  const fetchData = (page = 1, search = keyword) => {
    request("GET", `/messenger/addressBook?page=${page}&size=${paging.size}&search=${search || ''}`)
      .then(res => {
        setAbList(res.data?.list || []);
        setPaging(res.data?.paging || paging);
      })
      .catch(err => {
        console.error("주소록 요청 실패:", err);
        setAbList([]);
      })
  };

  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, user });
  };

  useEffect(() => {
    const handleClick = () => setContextMenu(prev => ({ ...prev, visible: false }));
    window.addEventListener('click', handleClick);
    fetchData();
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const searchPerson = (value) => {
    setKeyword(value);
    fetchData(1, value); // 검색 시 1페이지부터 다시
  };

  const handleModalConfirm = async () => {
    let popup = null;
    if (modal.type === 'chat') {
      popup = window.open('', '_blank', 'width=500,height=600');
    }

    try {
      if (modal.type === 'email') {
        window.location.href = `mailto:${modal.user.emp_email}`;
      } else if (modal.type === 'chat') {
        const res = await request("POST", `/messenger/chat/enter`, {
          userId: user.emp_no,
          targetId: modal.user.emp_no
        });

        const roomCode = res.data?.roomCode;
        if (roomCode && popup) {
          popup.location.href = `/messenger/chat/${roomCode}`;
        } else {
          popup?.close();
          alert("채팅방 생성 실패");
        }
      }
    } catch (e) {
      console.error("채팅방 생성 실패:", e);
      popup?.close();
    }

    setModal({ ...modal, visible: false });
  };

  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>
          <Header/>
          <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', maxHeight: '35px' }}>

              <InputGroup inside style={styles}>
                <Input
                  placeholder='사번/이름 입력'
                  value={keyword}
                  onChange={searchPerson}
                />
              </InputGroup>
            </div>

            <Container>
              <Col style={{ marginBottom: '20px' }}>
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>

                  <table className='abList'>
                    <thead>
                      <tr>
                        <th> 사번 </th>
                        <th style={{ textAlign: 'center' }}> 이름 </th>
                        <th style={{ textAlign: 'center' }}> 이메일 </th>
                        <th style={{ textAlign: 'center' }}> 부서 </th>
                        <th style={{ textAlign: 'center' }}> 직급 </th>
                        <th style={{ textAlign: 'center' }}> 사내번호 </th>
                      </tr>
                    </thead>
                    <tbody>
                      {abList.map((employees, index) => (
                        <tr
                          key={index}
                          onContextMenu={(e) => handleContextMenu(e, employees)}
                          style={{ cursor: 'context-menu' }}>
                          <td> {employees.emp_no} </td>
                          <td style={{ textAlign: 'center' }}> {employees.emp_name} </td>
                          <td style={{ textAlign: 'center' }}> {employees.emp_email} </td>
                          <td style={{ textAlign: 'center' }}> {departmentNames[employees.dept_no] || '-'} </td>
                          <td style={{ textAlign: 'center' }}> {positionNames[employees.position_id] || '-'} </td>
                          <td style={{ textAlign: 'center' }}> {employees.emp_ext_tel?.slice(4, 9)} </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div style={{ margin: 'auto' }}>
                    <Paging paging={paging} onPageChange={(page) => fetchData(page)} />
                  </div>
                </Card>
              </Col>
            </Container>
          </Content>
        </Container>
      </Container>

      {/* 우클릭 메뉴 */}
      {contextMenu.visible && (
        <ul style={{
          position: 'absolute', top: contextMenu.y, left: contextMenu.x,
          backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px',
          padding: '10px', listStyle: 'none', zIndex: 1000
        }}>
          <li
            style={{ cursor: 'pointer', marginBottom: '5px' }}
            onClick={() => setModal({ visible: true, type: 'chat', user: contextMenu.user })}
          >💬 대화하기</li>
          <li
            style={{ cursor: 'pointer' }}
            onClick={() => {
              request("POST", `/messenger/favorite/add`, {
                userId: user.emp_no,
                favoriteId: contextMenu.user.emp_no
              })
              .then(res => {
                if (res.data === "추가 성공") {
                  alert("즐겨찾기에 추가되었습니다!");
                } else {
                  alert("이미 등록된 사용자입니다.");
                }
              })
              .catch(() => alert("오류가 발생했습니다."));
            }}
          >⭐ 즐겨찾기 등록</li>
        </ul>
      )}

      {/* 예/아니오 모달 */}
      <Modal open={modal.visible} onClose={() => setModal({ ...modal, visible: false })}>
        <Modal.Header>
          <Modal.Title>{modal.type === 'chat' ? '대화하기' : '즐겨찾기 추가'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>{modal.user?.emp_name}</strong>
            {modal.type === 'chat' ? '님과 대화를 시작하시겠습니까?' : '님을 즐겨찾기에 추가하시겠습니까?'}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleModalConfirm}>예</Button>
          <Button appearance="subtle" onClick={() => setModal({ ...modal, visible: false })}>아니오</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default AddressBook;