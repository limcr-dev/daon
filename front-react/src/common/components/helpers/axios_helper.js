import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//import { getAuthToken, removeAuthToken, setAuthToken } from './auth_helper';

// API 기본 URL 설정
const API_URL = 'http://localhost:8081';

// axios 인스턴스 생성
const api = axios.create({
   baseURL: API_URL,
   timeout: 5000,
   withCredentials: true, // 쿠키를 주고받기 위해 필요
   headers: {
      'Content-Type': 'application/json',
   }
});

// 액세스 토큰 가져오기
export const getAuthToken = () => {
   return localStorage.getItem('accessToken');
};

// 액세스 토큰 저장하기
export const setAuthToken = (token) => {
   localStorage.setItem('accessToken', token);
};

// 액세스 토큰 제거하기
export const removeAuthToken = () => {
   localStorage.removeItem('accessToken');
};

const isTokenValid = (token) => {
   try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
   } catch (e) {
      return false;
   }
}

// 액세스 토큰 재발급
export const refreshAccessToken = async () => {
   try {
      // 리프레시 토큰이 HttpOnly 쿠키에 있으므로 요청시 자동으로 포함됨
      const response = await axios({
         method: 'post',
         url: `${API_URL}/api/token/refresh`,
         withCredentials: true   // 쿠키를 포함하기 위해 필요
      });

      if (!response.data.accessToken) {
         throw new Error("응답에 액세스 토큰이 없습니다");
      }

      const newAccessToken = response.data.accessToken;
      setAuthToken(newAccessToken); // 반드시 localStorage 업데이트
      return newAccessToken; // 토큰 반환 추가

   } catch (error) {
      console.error("토큰 갱신 실패:", error.message);

      if (error.response) {
         console.error("응답 상태:", error.response.status);
         console.error("응답 데이터:", error.response.data);
      }
      removeAuthToken();   // 토큰 갱신 실패 시 액세스 토큰 제거
      setTimeout(() => {
         window.location.href = '/';
         alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      }, 0);
      return null;
   }
}

// 요청 인터셉터
api.interceptors.request.use(
   async (config) => {
      let token = getAuthToken();
      if (token && token !== "null") {
         if (!isTokenValid(token)) {
            console.log("요청 직전 토큰 만료 감지");
            const newToken = await refreshAccessToken();
            if (newToken) {
               config.headers['Authorization'] = `Bearer ${newToken}`;
            } else {
               console.log("새 토큰 발급 실패 -> 로그인 페이지 이동");
               window.location.href = '/';
               throw new Error("Unable to refresh token");
            }
         } else {
            config.headers['Authorization'] = `Bearer ${token}`;
         }
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// 응답 인터셉터
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
   failedQueue.forEach(prom => {
      if (error) {
         prom.reject(error);
      } else {
         prom.resolve(token);
      }
   });

   failedQueue = [];
}

api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      // 네트워크 에러 따로 처리
      if (error.message === 'Network Error') {
         setTimeout(() => {
            alert('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
         }, 100);
         return Promise.reject(error);
      }

      // 토큰이 만료되었고, 이 요청이 이미 재시도된 것이 아니라면
      if (error.response?.status === 401 && !originalRequest._retry) {

         // 로그인 요청이면 토큰 갱신 시도하지 않고 바로 에러 던짐
         if (originalRequest.url.includes('/api/login')) {
            return Promise.reject(error);
         }

         if (isRefreshing) {
            // 이미 토큰 갱신 중이면 대기열에 요청 추가
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            })
               .then(token => {
                  originalRequest.headers['Authorization'] = `Bearer ${token}`;
                  return api(originalRequest);
               })
               .catch(err => {
                  return Promise.reject(err);
               });
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            const newToken = await refreshAccessToken();
            if (newToken) {
               // 새 토큰으로 대기열의 모든 요청 처리
               processQueue(null, newToken);
               // 원래 요청 재시도
               originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
               return api(originalRequest);
            } else {
               processQueue(new Error('토큰 갱신 실패'), null);
               return Promise.reject(error);
            }
         } catch (refreshError) {
            processQueue(refreshError, null);
            window.location.href = '/';
            return Promise.reject(refreshError);
         } finally {
            isRefreshing = false;
         }
      }

      return Promise.reject(error);
   }
);

// 핵심 요청 함수
export const request = (method, url, data, config = {}) => {
   const isFormData = data instanceof FormData;
   return api({
      method: method,
      url: url,
      data: data,
      headers: isFormData ? { ...config.headers } : { "Content-Type": "application/json", ...config.headers }
   });
};

export default api;