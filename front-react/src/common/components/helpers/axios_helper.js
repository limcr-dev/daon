import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/';
// ❌ 이 줄 삭제했습니다:
// axios.defaults.headers.post["Content-type"] = 'application/json';

// 인증 토큰 관리 함수
export const getAuthToken = () => {
   return window.localStorage.getItem("accessToken");
};

export const setAuthToken = (token) => {
   window.localStorage.setItem("accessToken", token);
};

export const getRefreshToken = () => {
   return window.localStorage.getItem("refreshToken");
};

export const setRefreshToken = (token) => {
   if (token) {
      window.localStorage.setItem("refreshToken", token);
   } else {
      window.localStorage.removeItem("refreshToken");
   }
};

export const refreshAccessToken = async () => {
   const refreshToken = getRefreshToken();

   if (!refreshToken) {
      console.log("리프레시 토큰이 없습니다.");
      return null;
   }

   try {
      const response = await axios({
         method: 'post',
         url: '/api/token/refresh',
         headers: {
            'Authorization': `Bearer ${refreshToken}`
         }
      });

      const newAccessToken = response.data.accessToken;
      if (!newAccessToken) return null;

      setAuthToken(newAccessToken);
      return newAccessToken;
   } catch (error) {
      console.error("토큰 갱신 실패:", error.message);
      if (error.response) {
         console.error("서버 응답:", error.response.status, error.response.data);
      }
      return null;
   }
};

// axios 인스턴스 생성
const api = axios.create({
   baseURL: 'http://localhost:8081/'
});

// 요청 인터셉터
api.interceptors.request.use(
   (config) => {
      const token = getAuthToken();
      if (token && token !== "null") {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// 응답 인터셉터
api.interceptors.response.use(
   (response) => response,
   async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
         originalRequest._retry = true;
         try {
            const newToken = await refreshAccessToken();
            if (newToken) {
               originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
               return api(originalRequest);
            } else {
               window.location.href = '/';
               return Promise.reject(error);
            }
         } catch (refreshError) {
            window.location.href = '/';
            return Promise.reject(refreshError);
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
      headers: isFormData ? undefined : { "Content-Type": "application/json", ...config.headers }
   });
};

export default api;
