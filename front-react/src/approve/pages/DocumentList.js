import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Container,
  Content,
  Divider,
  FlexboxGrid,
  Row
} from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import Header from '../../common/pages/Header';
import "../css/approve.css";
import { request } from '../../common/components/helpers/axios_helper';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { getStatusText } from '../components/ApprCodeToText';

// 결재자 문서 목록
const DocumentList = () => {
  const { user } = useUser();
  const param = useParams();
  const status = parseInt(param.status);
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    console.log("useEffect 실행됨, param.status:", param.status);
    console.log("파싱된 status:", status);
    try {
      const fetchData = async () => {
        let endpoint;
        
        // status 값이 있으면 상태별 문서 조회, 아니면 전체 문서 조회
        if (status !== null && status !== undefined && !isNaN(status)) {
          endpoint = `/approve/documents/${status}/${user.emp_no}`;
        } else {
          endpoint = `/approve/documents/all/${user.emp_no}`;  // all 엔드포인트 사용
        }
  
        console.log("요청 URL:", endpoint);  // 디버깅용
        const response = await request("GET", endpoint);
        
        if (response && response.data) {
          const data = Array.isArray(response.data) ? response.data : [];
          setDocList(data);
        }
      };
      
      if (user && user.emp_no) {
        fetchData();
      }
    } catch (error) {
      console.log("error :", error);
    }
  }, [param.status]);

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < ApproveLeftbar />
        <Content style={{ marginLeft: '15px', marginTop: '15px' }}>
          <Header />
          <Divider />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minWidth: '500px' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    {status !== null && status !== undefined && !isNaN(status) ? '임시 저장함' : '기안 문서함'}
                  </span>
                </Card.Header>
                <table class='approve-table'>
                  <thead>
                    <tr>
                      <th>기안일</th>
                      <th>결재양식</th>
                      <th>제목</th>
                      <th>첨부</th>
                      <th>긴급</th>
                      <th>결재상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docList.length === 0 ? (
                      <tr>
                        <td colSpan={6} align='center'>결재 {getStatusText(status)} 문서가 존재하지 않습니다.</td>
                      </tr>
                    ) : (
                      docList.slice(0, 5).map(doc => (
                        <tr key={doc.notice_no}>
                          <td>{doc.doc_reg_date}</td>
                          <td>{doc.doc_form}</td>
                          <td><Link to={"/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no}>{doc.doc_title}</Link></td>
                          <td>첨부</td>
                          <td>{doc.doc_urgent}</td>
                          <td>{getStatusText(doc.doc_status)}</td>
                        </tr>
                      )))}
                  </tbody>
                </table>
              </Card>
            </Col>

          </Row>
        </Content>
      </Container>
    </Container>
  );
};
export default DocumentList;