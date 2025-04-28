import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Button, Form, Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import { request } from '../../common/components/helpers/axios_helper';
import { useUser } from '../../common/contexts/UserContext';

const Login = () => {

  const navigate = useNavigate();
  const { login } = useUser();

  const [dto, setDto] = useState({
    emp_email: '',
    emp_pwd: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const changeValue = (value, event) => {
    setDto({
      ...dto,
      [event.target.name]: value,
    });
  };

  // JWT 기반 로그인 인증 흐름
  // 1. 사용자 로그인 시도
  // 1-1. 입력한 아이디로 로그인 요청
  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 로그인 시도 정보 출력
    console.log("===== 로그인 시도 =====");
    console.log("입력 데이터:", dto);

    try {
      // 요청 시작 로깅
      console.log("===== 서버 요청 시작 =====");

      // 요청 전송 및 응답 받기 (withCredentials: true로 쿠키 수신 가능)
      const response = await request("POST", "/api/login", dto);

      // 응답 데이터 상세 로깅
      console.log("===== 서버 응답 =====");
      console.log("응답 상태 코드:", response.status);
      console.log("응답 헤더:", response.headers);
      console.log("응답 전체 데이터:", response.data);

      // 토큰 추출 및 확인(쿠키 기반에서는 리프레시 토큰을 직접 추출하지 않음)
      const accessToken = response.data.accessToken;

      console.log("추출된 액세스 토큰:", accessToken);

      if (!accessToken) {
        console.error("액세스 토큰이 없거나 null/undefined 입니다");
        throw new Error("토큰이 제공되지 않았습니다.");
      }

      // 토큰 저장 및 사용자 정보 설정(리프레시 토큰은 쿠키로 자동 저장됨)
      console.log("===== 로그인 함수 호출 전 =====");
      await login(accessToken);
      console.log("===== 로그인 함수 호출 완료 =====");

      // 홈 화면 이동
      console.log("홈 화면으로 이동 시도");
      navigate('/home');
      console.log("navigate 호출 완료");

    } catch (error) {
      console.error("===== 로그인 오류 발생 =====");
      console.error("오류 객체:", error);

      // 응답이 있는 경우 응답 정보 추출
      if (error.response) {
        console.error("응답 상태:", error.response.status);
        console.error("응답 데이터:", error.response.data);

        // 상태 코드별 오류 처리
        if (error.response.status === 401) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
          console.error("인증 실패 (401)");
        } else if (error.response.status === 500) {
          setError('서버 내부 오류가 발생했습니다. 나중에 다시 시도해주세요.');
          console.error("서버 오류 (500)");
        } else {
          setError('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
          console.error(`기타 HTTP 오류 (${error.response.status})`);
        }
      } else if (error.request) {
        // 요청은 전송되었지만 응답을 받지 못한 경우
        console.error("요청은 전송되었으나 응답 없음:", error.request);
        setError('서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.');
      } else {
        // 요청 설정 과정에서 오류가 발생한 경우
        console.error("요청 설정 오류:", error.message);
        setError('로그인 요청을 보낼 수 없습니다. 다시 시도해주세요.');
      }

      // 요청 설정 로깅
      if (error.config) {
        console.error("요청 설정:", {
          url: error.config.url,
          method: error.config.method,
          headers: error.config.headers,
          data: error.config.data
        });
      }

    } finally {
      console.log("===== 로그인 프로세스 종료 =====");
      setLoading(false);
    }
  };
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{ height: '100vh' }}
    >

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<p style={{ fontSize: '25px' }}>로그인</p>}>
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>
              <span>이메일</span>
            </Form.ControlLabel>
            <Form.Control type="text" name="emp_email" onChange={changeValue} placeholder="Please input email" style={{ width: '100%' }} />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <span>비밀번호</span>
            </Form.ControlLabel>
            <Form.Control type="password" name="emp_pwd" onChange={changeValue} placeholder="Please input password" style={{ width: '100%' }} />
          </Form.Group>

          {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}

          <Stack spacing={6} justifyContent="flex-end">
            <Button onClick={submit}>로그인</Button>
          </Stack>
        </Form>
      </Panel>
    </Stack>
  );
}

export default Login;