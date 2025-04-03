import React, { Component, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Button, Form, Panel, Divider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

import { request, setAuthToken } from '../helpers/axios_helper';
const Login = () => {

  const navigate = useNavigate();
  const [dto, setDto] = useState({
    emp_email: '',
    emp_pwd: ''
  });

  const changeValue = (value, event) => {
    setDto({
      ...dto,
      [event.target.name]: value,
    });
  };

  // JWT 기반 로그인 인증 흐름
  // 1. 사용자 로그인 시도
  // 1-1. 입력한 아이디로 로그인 요청
  const submit = (e) => {
    e.preventDefault();

    // 1-2. 클라이언트(react)에서 서버(springBoot)로 로그인 정보 전송
    request(  // axios_helper.js에서 정의한 함수
      "POST", // method : @PostMapping
      "/login", // url : http://localhost:8081/login (axios_helper에서 baseUrl로 설정한 값이 앞에 붙음)
      dto)
      .then((res) => {
        setAuthToken(res.data.token);   // 스프링부트에서 생성한 토큰을 저장후 다른 메뉴 클릭시 토큰을 들고가서 인증받는다.
      })
      .then((res) => {    // catch는 여기에서 오류가 발생해야 실행됨.
        console.log('정상', res);
        if (res !== null) {
          navigate('/home'); // 페이지 이동 : navigate, old  버전 : props.history.push()
        } else {
          alert("로그인에 실패하였습니다.");
        }
      })
      .catch((error) => {
        setAuthToken(null);
      }
      );
  }

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{ height: '100vh' }}
    >

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<p style={{ fontSize: '25px' }}>로그인</p>}>
        <Form>
          <Form.Group>
            <Form.ControlLabel>
              <span>이메일</span>
            </Form.ControlLabel>
            <Form.Control type="text" name="emp_email" onChange={changeValue} placeholder="Please input email" />

          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <span>비밀번호</span>
            </Form.ControlLabel>
            <Form.Control type="password" name="emp_pwd" onChange={changeValue} placeholder="Please input password" />
          </Form.Group>

          <Stack spacing={6} divider={<Divider vertical />}>
            <Button onClick={submit}>로그인</Button>
          </Stack>
        </Form>
      </Panel>
    </Stack>
  );
}

export default Login;