import axios from 'axios';  // npm install axios

axios.defaults.baseURL = 'http://localhost:8081/'
axios.defaults.headers.post["Content-type"] = 'application/json'

// backend와 통신
// 로그인이 완료시 JWT를 저장한다.

export const getAuthToken = () => {
    // localStorage에서 인증 토큰 조회함
    return window.localStorage.getItem("auth_token");
}

export const setAuthToken = (token) => {
    // token 값 지정
    window.localStorage.setItem("auth_token", token);
}

// 백엔드(springBoot) 서버와의 HTTP 통신을 담당하는 핵심 함수
export const request = (method, url, data) => {

    let headers = {};
    if(getAuthToken() != null && getAuthToken() !== "null") {
        headers = {"Authorization": `Bearer ${getAuthToken()}`};
        console.log('headers: ', headers);
    }

    console.log('axios !!!!!!!!');
    console.log('method: ', method);
    console.log('url: ', url);
    console.log('data: ', data);
  
    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    });
};
