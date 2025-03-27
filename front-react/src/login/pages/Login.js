import React, { Component, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Stack, Button, Form, Panel, Divider } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const Login = () => {

  const navigate = useNavigate();  
  const[dto, setDto] = useState({     
      emp_email : '',
      emp_pwd : ''
  });

  const changeValue = (value, event) => {
    setDto({
        ...dto,
        [event.target.name]: value,
    });
  };

  const submit = (e) => {    // 호출하는 부분
    e.preventDefault(); // submit이 action을 안 타고 자기 할 일을 그만함
    fetch("http://localhost:8081/api/login", {      // 스프링부트
        method: "POST",     // INSERT는 "POST"
        headers: {
            "Content-Type" : "application/json;charset=utf-8"
        },
        body: JSON.stringify(dto) // Controller에서 @RequestBody BoardDTO board로 받는다.
        // javascript object를 json으로 변경해서 넘김. 데이터를 스프링부트에서 insert하고 201을 리턴한다.
    })
    .then((res) => {        // 결과를 돌려받는 부분
        console.log(1, res);
        if(res.status === 200){
            return res;
        } else {
            return null;
        }
    })
    .then((res) => {    // catch는 여기에서 오류가 발생해야 실행됨.
        console.log('정상', res);
        if(res !== null){
            navigate('/home'); // 페이지 이동 : navigate, old  버전 : props.history.push()
        }else{
            alert("로그인에 실패하였습니다.");
        }
    })
    .catch((error) => {
        console.log('실패', error);
    })
}

  
// const submit =  (e) => {    
//   e.preventDefault();
//   try {
//     const res =  fetch('http://localhost:8081/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json;charset=utf-8',
//         },
//         body: JSON.stringify(dto),
//     });

//     if (res.status === 200) {
//         throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     const result = res.json();
//     console.log('정상', result);
//     navigate('/home');
// } catch (error) {
//     console.error('로그인 실패', error);
//     alert('로그인에 실패하였습니다.');
// }
// };

return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{height: '100vh' }}
    >      

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<p style={{ fontSize: '25px' }}>로그인</p>}>
        <Form>
          <Form.Group>
            <Form.ControlLabel>
              <span>이메일</span>
            </Form.ControlLabel>
            <Form.Control type="text" name="emp_email" onChange={changeValue} placeholder="Please input email"/>
            
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <span>비밀번호</span>
            </Form.ControlLabel>
            <Form.Control type="password" name="emp_pwd" onChange={changeValue} placeholder="Please input password"/>
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