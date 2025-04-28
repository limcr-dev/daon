import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Container, Content, Divider, FlexboxGrid, Row, Tooltip } from 'rsuite';
import Leftbar from '../../common/pages/Leftbar';
import ApproveLeftbar from './ApproveLeftbar';
import Header from '../../common/pages/Header';
import "../css/approve.css";
import { request } from '../../common/components/helpers/axios_helper';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../common/contexts/UserContext';
import { getFormName, StatusBadge, UrgentBadge } from '../components/ApprCodeToText';
import { getPositionName } from '../../hrMgt/components/getEmployeeInfo';
import OverlayTrigger from 'rsuite/esm/internals/Overlay/OverlayTrigger';
import { MdAttachFile } from 'react-icons/md';

const Approve = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [approverList, setApproverList] = useState([]);
  const [proceedList, setProceedList] = useState([]);
  const [completeList, setCompleteList] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await request("GET", `/approve/approverInfo/${user.emp_no}`);
        if (response && response.data) {
          // 배열인지 확인하고 설정
          const data = Array.isArray(response.data) ? response.data : [];
          setApproverList(data);

        }
      };
      fetchData();
    } catch (error) {
      console.log("error :", error);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await request("GET", "/approve/documents/2/" + parseInt(user.emp_no));
        if (response && response.data) {
          // 배열인지 확인하고 설정
          const data = Array.isArray(response.data) ? response.data : [];
          setProceedList(data);
        }
      };
      fetchData();
    } catch (error) {
      console.log("error :", error);
    }
  }, []);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response = await request("GET", "/approve/documents/3/" + parseInt(user.emp_no));
        if (response && response.data) {
          // 배열인지 확인하고 설정
          const data = Array.isArray(response.data) ? response.data : [];
          setCompleteList(data);
        }
      };
      fetchData();
    } catch (error) {
      console.log("error :", error);
    }
  }, []);

  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
        < ApproveLeftbar />
        <Content>
          <Header />
          <Row gutter={20} style={{ display: 'flex', flexDirection: 'column' }}>

            <Col style={{ marginBottom: '20px' }}>
              <FlexboxGrid justify="start" style={{ gap: '20px' }}>
                {approverList.length > 0 ? (
                  approverList.slice(0, 5).map((doc, index) => (
                    <Card key={index} style={{ borderRadius: '15px', width: '300px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                      {/* 상단 상태 표시 */}
                      <Card.Header style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <UrgentBadge isUrgent={doc.doc_urgent} />
                        <span style={{ marginLeft: '5px' }}>
                          <StatusBadge status={doc.doc_status} />
                        </span>
                      </Card.Header>

                      {/* 본문 */}
                      <Card.Body className="p-4 space-y-2">
                        <p style={{ fontWeight: '600', fontSize: '20px' }}>
                          {doc.doc_title || '제목 없음'}
                        </p>
                        <p style={{ color: 'gray' }}>기안자 : {doc.emp_name || '이름 없음'} ({getPositionName(doc.position_id) || ''})</p>
                        <p style={{ color: 'gray' }}>기안일 : {doc.doc_reg_date || '-'}</p>
                        <p style={{ color: 'gray' }}>
                          결재양식 : {getFormName(doc.doc_form) || '-'}
                        </p>
                      </Card.Body>

                      {/* 하단 버튼 */}
                      <Card.Footer style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          appearance="primary"
                          onClick={() => navigate("/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no)}
                        >
                          결재하기
                        </Button>
                      </Card.Footer>
                    </Card>
                  ))
                ) : (
                  <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                      <span style={{ fontWeight: '600', fontSize: '16px' }}>결재 대기 문서</span>
                    </Card.Header>
                    <Card.Body className="p-4" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                      <p style={{ textAlign: 'center', color: '#666' }}>
                        대기 중인 결재 문서가 없습니다.
                      </p>
                    </Card.Body>
                  </Card>
                )}
              </FlexboxGrid>
            </Col>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>결재 진행 문서</span>
                  <Button appearance="link">더보기</Button>
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
                    {proceedList.length === 0 ? (
                      <tr>
                        <td colSpan={7} align='center'>진행 중인 결재 문서가 존재하지 않습니다.</td>
                      </tr>
                    ) : (
                      proceedList.slice(0, 5).map(doc => (
                        <tr key={doc.doc_no}>
                          <td>{doc.doc_no}</td>
                          <td>{doc.doc_reg_date}</td>
                          <td>{getFormName(doc.doc_form)}</td>
                          <td><Link to={"/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no}>{doc.doc_title}</Link></td>
                          <td>
                            {doc.doc_filename ? (
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
                            ) : ''}
                          </td>
                          <td><UrgentBadge isUrgent={doc.doc_urgent} /></td>
                          <td><StatusBadge status={doc.doc_status} /></td>
                        </tr>

                      )))}

                  </tbody>

                </table>
              </Card>
            </Col>

            <Col style={{ marginBottom: '20px' }}>
              <Card style={{ borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f5f5f5', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                  <span style={{ fontWeight: '600', fontSize: '16px' }}>결재 승인 문서</span>
                  <Button appearance="link">더보기</Button>
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
                    {completeList.length === 0 ? (
                      <tr>
                        <td colSpan={7} align='center'>완료된 결재 문서가 존재하지 않습니다.</td>
                      </tr>
                    ) : (
                      completeList.slice(0, 5).map(doc => (
                        <tr key={doc.doc_no}>
                          <td>{doc.doc_no}</td>
                          <td>{doc.doc_reg_date}</td>
                          <td>{getFormName(doc.doc_form)}</td>
                          <td><Link to={"/approve/documentDetail/" + doc.doc_form + "/" + doc.doc_no}>{doc.doc_title}</Link></td>
                          <td>
                            {doc.doc_filename ? (
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
                            ) : ''}
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
export default Approve;