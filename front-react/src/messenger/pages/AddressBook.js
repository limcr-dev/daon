import React, { useEffect, useState } from 'react';
import {
  Card,
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
import Header from '../../common/pages/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const { user } = useUser();
  const [abList, setAbList] = useState([]);
  const [paging, setPaging] = useState({ page: 1, size: 13, totalCount: 0 });
  const [keyword, setKeyword] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, user: null });
  const [modal, setModal] = useState({ visible: false, type: '', user: null });
  const [favoriteList, setFavoriteList] = useState([]);

  const fetchData = async (page = 1, search = keyword) => {
    try {
      const res1 = await request("GET", `/messenger/addressBook?page=${page}&size=${paging.size}&search=${search || ''}`);
      setAbList(res1.data?.list || []);
      setPaging(res1.data?.paging || paging);

      const res2 = await request("GET", `/messenger/favorite/list?userId=${user.emp_no}`);
      setFavoriteList(res2.data || []);
    } catch (err) {
      console.error("주소록 요청 실패:", err);
      setAbList([]);
    }
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
    fetchData(1, value);
  };

  const handleModalConfirm = async () => {
    let popup = null;
    if (modal.type === 'chat') {
      popup = window.open('', '_blank', 'width=500,height=600');
    }

    try {
      if (modal.type === 'chat') {
        const res = await request("POST", `/messenger/chat/enter`, {
          userId: user.emp_no,
          targetId: modal.user.emp_no
        });

        const { roomCode, newRoom } = res.data;
        console.log("newRoom 값:", newRoom);
        if (roomCode && popup) {
          popup.location.href = `/messenger/chat/${roomCode}`;
          if (newRoom) {
            window.location.reload();
          }
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
          <Header />
          <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
            <div style={{ marginTop: "50px" }}>
              <Card style={{
                borderRadius: "15px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                padding: "20px",
                marginBottom: "30px",
              }}>
                <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>📖 주소록</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <InputGroup inside style={styles}>
                    <Input
                      placeholder='사번/이름 입력'
                      value={keyword}
                      onChange={searchPerson}
                    />
                  </InputGroup>
                </div>
                <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                  <table className='abList'>
                    <thead>
                      <tr>
                        <th> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;사번 </th>
                        <th style={{ textAlign: 'center' }}> 이름 </th>
                        <th style={{ textAlign: 'center' }}> 부서 </th>
                        <th style={{ textAlign: 'center' }}> 직급 </th>
                        <th style={{ textAlign: 'center' }}> 사내번호 </th>
                      </tr>
                    </thead>
                    <tbody>
                      {abList.map((employees, index) => {
                        const isFavorite = Array.isArray(favoriteList)
                          ? favoriteList.some(fav => fav.emp_no === employees.emp_no)
                          : false;

                        const handleStarClick = async () => {
                          try {
                            if (isFavorite) {
                              await request("DELETE", `/messenger/favorite/remove?userId=${user.emp_no}&favoriteId=${employees.emp_no}`);
                              toast.info('즐겨찾기에서 제거되었습니다.');
                            } else {
                              await request("POST", `/messenger/favorite/add`, {
                                userId: user.emp_no,
                                favoriteId: employees.emp_no
                              });
                              toast.success('즐겨찾기에 추가되었습니다!');
                            }
                            fetchData(paging.page);
                          } catch (e) {
                            toast.error('오류가 발생했습니다.');
                          }
                        };

                        return (
                          <tr
                            key={index}
                            onContextMenu={(e) => handleContextMenu(e, employees)}
                            style={{ cursor: 'context-menu' }}
                          >
                            <td>
                              <span
                                style={{
                                  marginRight: '5px',
                                  cursor: 'pointer',
                                  color: isFavorite ? 'gold' : '#ccc',
                                  fontSize: '18px'
                                }}
                                onClick={handleStarClick}
                              >
                                {isFavorite ? '★' : '☆'}
                              </span>
                              {employees.emp_no}
                            </td>
                            <td style={{ textAlign: 'center' }}>{employees.emp_name}</td>
                            <td style={{ textAlign: 'center' }}>{departmentNames[employees.dept_no] || '-'}</td>
                            <td style={{ textAlign: 'center' }}>{positionNames[employees.position_id] || '-'}</td>
                            <td style={{ textAlign: 'center' }}>
                              {typeof employees.emp_ext_tel === 'string' && employees.emp_ext_tel.length >= 9
                                ? employees.emp_ext_tel.slice(4, 9)
                                : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ margin: 'auto' }}>
                    <Paging paging={paging} onPageChange={(page) => fetchData(page)} />
                  </div>
                </Card>
              </Card>
            </div>
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
          >
            💬 대화하기
          </li>
          <li
            style={{ cursor: 'pointer' }}
            onClick={() => {
              const already = Array.isArray(favoriteList)
                ? favoriteList.some(fav => fav.emp_no === contextMenu.user?.emp_no)
                : false;

              if (already) {
                alert("이미 등록된 사용자입니다.");
                return;
              }

              request("POST", `/messenger/favorite/add`, {
                userId: user.emp_no,
                favoriteId: contextMenu.user?.emp_no
              })
                .then(res => {
                  if (res.data === "추가 성공") {
                    alert("즐겨찾기에 추가되었습니다!");
                    fetchData(paging.page);
                  } else {
                    alert("이미 등록된 사용자입니다.");
                  }
                })
                .catch(() => alert("오류가 발생했습니다."));
            }}
          >
            ⭐ 즐겨찾기 등록
          </li>
        </ul>
      )}

      {/* 예/아니오 모달 */}
      <Modal open={modal.visible} onClose={() => setModal({ ...modal, visible: false })}>
        <Modal.Header>
          <Modal.Title>대화하기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>{modal.user?.emp_name}</strong>님과 대화를 시작하시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" onClick={handleModalConfirm}>예</Button>
          <Button appearance="subtle" onClick={() => setModal({ ...modal, visible: false })}>아니오</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
};

export default AddressBook;
