import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Content, Row, Tooltip } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import Header from '../../common/pages/Header';
import "../css/approve.css";
import { request } from '../../common/components/helpers/axios_helper';
import { Link, useParams } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { getFormName, getStatusText, StatusBadge, UrgentBadge } from '../components/ApprCodeToText';
import OverlayTrigger from 'rsuite/esm/internals/Overlay/OverlayTrigger';
import { MdAttachFile } from 'react-icons/md';

// 결재자 문서 목록
const DocumentList = () => {
  const { user } = useUser();
  const param = useParams();
  const status = parseInt(param.status);
  const [docList, setDocList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let endpoint;
        if (!isNaN(status)) {
          endpoint = `/approve/documents/${status}/${user.emp_no}`;
        } else {
          endpoint = `/approve/documents/all/${user.emp_no}`;
        }

        const response = await request("GET", endpoint);
        if (response && response.data) {
          const data = Array.isArray(response.data) ? response.data : [];
          setDocList(data);
        }
      } catch (error) {
        console.log("fetch error :", error);
      }
    };

    if (user && user.emp_no) {
      fetchData();
    }
  }, [param.status, user.emp_no]);


  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < ApproveLeftbar />
        <Content>
          <Header />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>
            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', minWidth: '500px' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>
                    결재 {getStatusText(status)} 문서
                  </span>
                </Card.Header>
                <table className='approve-table'>
                  <thead>
                    <tr>
                      <th>번호</th>
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
                        <td colSpan={7} align='center'>결재 {getStatusText(status)} 문서가 존재하지 않습니다.</td>
                      </tr>
                    ) : (
                      docList.map(doc => (
                        <tr key={doc.doc_no}>
                          <td>{doc.doc_no}</td>
                          <td>{doc.doc_reg_date}</td>
                          <td>{getFormName(doc.doc_form)}</td>
                          <td><Link to={"/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no}>{doc.doc_title}</Link></td>
                          <td>
                            {doc.doc_filename && (
                              <OverlayTrigger
                                placement="top"
                                speaker={
                                  <Tooltip>
                                    {doc.doc_filename.includes('_')
                                      ? decodeURIComponent(doc.doc_filename.substring(doc.doc_filename.indexOf('_') + 1))
                                      : doc.doc_filename}
                                  </Tooltip>
                                }
                              >
                                <div style={{ display: 'inline-block', cursor: 'pointer' }}>
                                  <MdAttachFile />
                                </div>
                              </OverlayTrigger>
                            )}
                          </td>
                          <td><UrgentBadge isUrgent={doc.doc_urgent} /></td>
                          <td><StatusBadge status={doc.doc_status} /></td>
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