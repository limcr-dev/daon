import React, { useEffect, useState } from 'react';
import {
  Card,
  Col,
  Container,
  Content,
  Input,
  InputGroup,
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import MessengerLeftbar from './MessengerLeftbar';
import "../css/abList.css";
import Paging from '../../common/components/paging';

const styles = {
  width: 300,
  marginBottom: 0
};

const departmentNames = {
  1: '다온',
  10: '경영부',
  20: '개발부',
  30: '영업부',
  101: '인사팀',
  102: '총무팀',
  103: '회계팀',
  201: '연구개발팀',
  202: '생산관리팀',
  203: 'IT팀',
  301: '영업팀',
  302: '마케팅팀',
  303: '품질관리팀'
};

const positionNames = {
  10: '사장',
  15: '부사장',
  20: '전무',
  25: '상무',
  30: '이사',
  35: '부장',
  40: '차장',
  45: '과장',
  50: '대리',
  55: '사원',
  60: '인턴'
}

const selectCount = [
  { value: 'count10', name: '10개' },
  { value: 'count15', name: '15개' },
  { value: 'count20', name: '20개' },
  { value: 'countAll', name: '전체' },
]



const AddressBook = () => {
  const [abList, setAbList] = useState([]);
  const [paging, setPaging] = useState({
    page: 1,
    size: 10,
    totalCount: 0,
  });
  const [keyword, setKeyword] = useState('');
  const [selected, setSelected] = useState();
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    user: null
  });

  const fetchData = (page = 1, search = keyword) => {
    const url = `/messenger/addressBook?page=${page}&size=${paging.size}&search=${search || ''}`;
    fetch("http://localhost:8081" + url)
      .then(res => res.json())
      .then(data => {
        // setAbList(data.list);
        // setPaging(data.paging);
        if (data && data.list) {
          setAbList(data.list);
          setPaging(data.paging);
        } else {
          console.error("응답 형식 이상함:", data);
          setAbList([]); // 기본값으로 비워줌
        }
      })
      .catch(err => {
        console.error("API 요청 실패:", err);
        setAbList([]);
      });
  };

  const handleContextMenu = (e, user) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      user
    });
  };

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(prev => ({ ...prev, visible: false }));
    };
    window.addEventListener('click', handleClick);

    fetchData();
    
    return () => window.removeEventListener('click', handleClick);
    
  }, []);

  const searchPerson = (value) => {
    setKeyword(value);
    fetchData(1, value); // 검색 시 1페이지부터 다시
  };

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };



  return (
    <div>
      <Container style={{ minHeight: '100vh', width: '100%' }}>
        <Leftbar />
        <Container>
          <MessengerLeftbar />
          <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
            <div style={{ display: 'flex', maxHeight: '35px' }}>
              <InputGroup inside style={styles}>

                <Input
                  placeholder='사번/이름 입력'
                  value={keyword}
                  onChange={searchPerson}
                />

              </InputGroup>
              <select onChange={handleSelect} value={selected} style={{ width: '70px', textAlign: 'center' }}>
                {selectCount.map((option) => (
                  <option key={option.value} value={option.value}> {option.name} </option>
                ))}
              </select>
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

      {contextMenu.visible && (
        <ul
          style={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            listStyle: 'none',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            zIndex: 1000
          }}
        >
          <li style={{ cursor: 'pointer', marginBottom: '5px' }}
            onClick={() => alert(`"${contextMenu.user.emp_name}"님과 대화 시작`)}>💬 대화하기</li>
          <li style={{ cursor: 'pointer' }}
            onClick={() => alert(`"${contextMenu.user.emp_email}" 주소로 이메일 작성`)}>✉️ 이메일 작성</li>
        </ul>
      )}

    </div >

  );
};
export default AddressBook;