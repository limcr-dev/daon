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

const NoticeList = () => {

  const [noticeList, setNoticeList] = useState([]);

  // noticeList 링크로 들어왔을 때 처음 실행되는 부분
  // dependency가 빈 배열[]이기 때문에 처음 한 번만 실행됨
  useEffect(() => {
    fetch("http://localhost:8081/board/notice", { // DB에 들림
      method: "GET"   // @GetMapping 사용
    }).then(res => res.json())  // 응답 값을 json형식으로 변환
      .then(res => {
        console.log(1, res);
        setNoticeList(res); // 응답 값을 setNoticeList를 통해서 noticeList 변수에 저장함
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
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>공지사항</span>
                </Card.Header>
                  <table className='board-table'>
                    <tr>
                      <th>번호</th>
                      <th>제목</th>
                      <th>작성자</th>
                      <th>작성일</th>
                      <th>조회수</th>
                    </tr>
                    {/* .map() 함수를 사용하여 noticeList 안의 값을 하나씩 꺼냄 */}
                    {noticeList.map(notice => (
                      <tr key={notice.notice_no}>
                        <td>{notice.notice_no}</td>
                        {/* 제목 클릭 시, 공지사항 상세 페이지로 이동 */}
                        <td><Link to={"/board/noticeDetail/" + notice.notice_no}>{notice.notice_title}</Link></td>
                        <td>{notice.emp_no}</td>
                        <td>{notice.notice_reg_date}</td>
                        <td>{notice.notice_views}</td>
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
export default NoticeList;