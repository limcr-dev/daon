import React from 'react';
import {
  Container,
  Content,
} from 'rsuite';

import { Button, Card, Row, Col } from "react-bootstrap";
import "../css/MainContent.css"; // CSS 파일 import
import { Link, useNavigate } from "react-router-dom";

import main from './../image/main.jpg';
import icon1 from './../image/icon1.png';
import icon2 from './../image/icon2.png';
import list1 from './../image/list1.jpg';
import list2 from './../image/list2.jpg';
import list3 from './../image/list3.jpg';


import Leftbar from '../../common/pages/Leftbar';
import LeftbarDEvaluation from '../components/LeftbarDEvaluation';

const PerfomeMgt = () => {
    const navigate = useNavigate();

    const goToEval = () =>{
      navigate('/performMgt/evalque');
    };
  
  return (
    <Container style={{ minHeight: '100vh', width: '100%' }}>
      <Leftbar />
      <Container>
      <LeftbarDEvaluation />
        <Content>
          <div className="main-content p-4">

            <Row>
              {/* 왼쪽: 인사 평가 */}
              <Col md={8}>
                <h2 className="mb-4">인사 평가</h2>

                {/* 버튼 */}
                <div className="button-container-top mb-4 d-flex flex-row-reverse bd-highlight">
                  <Button className="custom-button" onClick={goToEval}>
                    <img className="image-icon" src={icon1} />
                    {/* <Image src="../PerfomeMgt/image/icon1.png" className="image-icon" alt="" rounded /> */}
                    평가 조회
                  </Button>
                  <Button className="custom-button">
                    <img className="image-icon" src={icon2} />
                    {/* <Image src="../image/icon2.png" className="image-icon" alt="" rounded /> */}
                    평가 리스트
                  </Button>
                </div>

                <img className="image-main" src={main} />
                <br />
                {/* 버튼 */}
                <div className="button-container-middle mb-4 d-flex justify-content-center">
                  <Button className="custom-button-big" onClick={goToEval}>
                    ✏️ 자가 평가
                  </Button>
                  <Button className="custom-button-big" onClick={goToEval}>
                    
                    📝 동료 평가
                  </Button>
                </div>
              </Col>

              {/* 오른쪽: 달성 평가 */}
              <Col md={4}>
                <h4 className="mb-3">달성 평가</h4>
                <Row>
                  <Col md={12} className="mb-3">
                    <Card className="text-center">

                      <Card.Body>
                        <img className="image-list" src={list1} />
                        {/* <Image src="../image/list1.jpg" className="image-list" alt="" rounded /> */}
                        <Card.Title>📊 실적 달성률</Card.Title>

                      </Card.Body>
                    </Card>

                  </Col>
                  <Col md={12} className="mb-3">
                    <Card className="text-center">
                      <Card.Body>
                        <Card.Title>💼 업무 달성률</Card.Title>
                        <img className="image-list" src={list2} />
                        {/* <Image src="../image/list2.jpg" className="image-list" alt="" rounded /> */}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={12}>
                    <Card className="text-center">
                      <Card.Body>
                        <Card.Title>📝 테스트 하기</Card.Title>
                        <img className="image-list" src={list3} />
                        {/* <Image src="../image/list3.jpg" className="image-list" alt="" rounded /> */}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>

          </div>
        </Content>
      </Container>
    </Container>
  );
};
export default PerfomeMgt;