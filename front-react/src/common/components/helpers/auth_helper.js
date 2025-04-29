// src/common/components/helpers/auth_helper.js

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
