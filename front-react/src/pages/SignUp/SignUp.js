import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Form, Panel, Divider } from 'rsuite';  
import 'rsuite/dist/rsuite.min.css';

const SignUp = () => {

    const navigate = useNavigate();

    const Home = () => {
        navigate('/Home');
    };
  
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh',
      }}
    >
      {/* <div 로고 넣을 공간 </div> */}
      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>로그인</h3>}>
        <Form>
          <Form.Group>
            <Form.ControlLabel>
              <span>이메일</span>
            </Form.ControlLabel>
            <Form.Control name="email" />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <span>비밀번호</span>
            </Form.ControlLabel>
            <Form.Control name="password" type="password" />
          </Form.Group>

          <Stack spacing={6} divider={<Divider vertical />}>
            <Button onClick={Home} appearance="blue">로그인</Button>  {/* 로그인 버튼 클릭 시 home 함수 호출 */}
          </Stack>
        </Form>
      </Panel>
    </Stack>
  );
}

export default SignUp;