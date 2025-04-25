import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Content,
  Divider,
  Row
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import Header from '../../common/pages/Header';
import "../css/board.css";
import BoardLeftbar from './BoardLeftbar';
import { Link } from 'react-router-dom';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const LibraryList = () => {

  const [libraryList, setLibraryList] = useState([]);

  // libraryListList 링크로 들어왔을 때 처음 실행되는 부분
  // dependency가 빈 배열[]이기 때문에 처음 한 번만 실행됨
  useEffect(() => {
    fetch("http://localhost:8081/board/library", { // DB에 들림
      method: "GET"   // @GetMapping 사용
    }).then(res => res.json())  // 응답 값을 json형식으로 변환
      .then(res => {
        console.log(1, res);
        setLibraryList(res); // 응답 값을 setLibraryList 통해서 LibraryList 변수에 저장함
      })
  }, []); // [] : dependency, 페이지가 처음 로딩될 때 한 번만 실행되도록 사용하는 것

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < BoardLeftbar />
        <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
          <Header />
          <Divider />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>자료 목록</span>
                </Card.Header>
                  <table className='board-table'>
                    <tr>
                      <th>번호</th>
                      <th>자료명</th>
                      <th>작성자</th>
                      <th>작성일</th>
                      <th>첨부 파일</th>
                    </tr>
                    {/* .map() 함수를 사용하여 libraryList 안의 값을 하나씩 꺼냄 */}
                    {libraryList.map(library => (
                      <tr key={library.library_no}>
                        <td>{library.library_no}</td>
                        {/* 제목 클릭 시, 공지사항 상세 페이지로 이동 */}
                        <td><Link to={"/board/libraryDetail/" + library.library_no}>{library.library_title}</Link></td>
                        <td>{library.emp_no}</td>
                        <td>{formatDate(library.library_reg_date)}</td>
                        <td>
                          {library.library_filename && library.library_filename.includes('_')
                             ? decodeURIComponent(library.library_filename.substring(library.library_filename.indexOf('_') + 1))
                             : '첨부 없음'}
                        </td>
                      </tr>

                    ))}
                  </table>
              </Card>
            </Col>

          </Row>
        </Content>
      </Container>
    </Container>
  );
};
export default LibraryList;