import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
//import { getAuthToken, removeAuthToken, setAuthToken } from './auth_helper';

// API 기본 URL 설정
const API_URL = 'https://daon-ai.com';

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

let isRedirecting = false;

export const refreshAccessToken = async () => {
   try {
      const response = await axios.post(`${API_URL}/api/token/refresh`, null, {
         withCredentials: true,
      });

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) throw new Error('응답에 액세스 토큰 없음');

      setAuthToken(newAccessToken);
      return newAccessToken;

   } catch (error) {
      console.error('🔁 토큰 갱신 실패:', error.message);
      removeAuthToken();

      if (!isRedirecting) {
         isRedirecting = true;
         alert('세션이 만료되었습니다. 다시 로그인해주세요.');
         setTimeout(() => {
            window.location.href = '/';
         }, 300);
      }
      return null;
   }
};

// 요청 인터셉터
api.interceptors.request.use(
   async (config) => {
      if (isRedirecting) {
         return Promise.reject(new Error("Redirecting in progress"));
      }

      const isLogin = config.url?.endsWith('/api/login');
      if (isLogin) return config;

      let token = getAuthToken();

      if (!token || token === "null") {
         console.log("🔒 토큰 없음 → 리프레시 시도");
         const newToken = await refreshAccessToken();
         if (!newToken) throw new Error("토큰 없음 → 로그인 이동");
         config.headers['Authorization'] = `Bearer ${newToken}`;
         return config;
      }

      if (!isTokenValid(token)) {
         console.log("🔒 토큰 만료 → 리프레시 시도");
         const newToken = await refreshAccessToken();
         if (!newToken) throw new Error("토큰 만료 → 로그인 이동");
         config.headers['Authorization'] = `Bearer ${newToken}`;
         return config;
      }

      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
   },
   (error) => Promise.reject(error)
);


// 응답 인터셉터
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
   failedQueue.forEach(prom => {
      if (error) prom.reject(error);
      else prom.resolve(token);
   });
   failedQueue = [];
};

api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;

      if (error.message === 'Network Error') {
         alert('서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.');
         return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
         if (originalRequest.url?.includes('/api/login')) {
            return Promise.reject(error);
         }

         if (isRefreshing) {
            return new Promise((resolve, reject) => {
               failedQueue.push({ resolve, reject });
            }).then((token) => {
               originalRequest.headers['Authorization'] = `Bearer ${token}`;
               return api(originalRequest);
            }).catch(Promise.reject);
         }

         originalRequest._retry = true;
         isRefreshing = true;

         try {
            const newToken = await refreshAccessToken();
            processQueue(null, newToken);
            if (newToken) {
               originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
               return api(originalRequest);
            } else {
               return Promise.reject(error);
            }
         } catch (refreshError) {
            processQueue(refreshError, null);
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
      method,
      url,
      data,
      headers: isFormData
         ? { ...config.headers }
         : { "Content-Type": "application/json", ...config.headers }
   });
};

export default api;
