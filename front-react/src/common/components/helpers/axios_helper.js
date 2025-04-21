import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:8081/';
axios.defaults.headers.post["Content-type"] = 'application/json';

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

// 리프레시 토큰을 이용해 새 액세스 토큰 요청
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        console.log("리프레시 토큰이 없습니다.");
        return null;
    }

    try {
        console.log("리프레시 토큰으로 새 액세스 토큰 요청 시도");
        console.log("사용하는 리프레시 토큰:", refreshToken.substring(0, 20) + "...");
        console.log("리프레시 토큰 타입:", typeof refreshToken);

        const response = await axios({
            method: 'post',
            url: '/api/token/refresh',
            headers: {
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        console.log("토큰 갱신 응답:", response.data);
        const newAccessToken = response.data.accessToken;
        if(!newAccessToken) {
            console.log("새 액세스 토큰이 없습니다.");
            return null;
        }

        setAuthToken(newAccessToken);
        console.log("새 액세스 토큰 발급 성공:", newAccessToken.substring(0,10) + "...");
        return newAccessToken;
    } catch (error) {
        console.error("토큰 갱신 실패:", error.message);
        // 오류 상세 정보 로깅
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

// 요청 인터셉터 추가
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

// 응답 인터셉터 설정
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 오류이고 재시도 표시가 없는 경우에만 리프레시 시도
        if (error.response?.status === 401 && !originalRequest._retry) {
            console.log("401 오류 감지, 토큰 리프레시 시도");
            originalRequest._retry = true;

            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    // 헤더 업데이트
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    return api(originalRequest); // 원래 요청 재시도
                } else {
                    // 토큰 갱신 실패 시 로그인 페이지로 이동
                    window.location.href = '/';
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error("토큰 리프레시 중 오류 발생:", refreshError);
                // 실패 시 로그인 페이지로 이동
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// 백엔드 서버와의 HTTP 통신을 담당하는 핵심 함수
export const request = (method, url, data, config = {}) => {
    return api({
        method: method,
        headers: { ...config.headers },
        url: url,
        data: data
    });
};

export default api;