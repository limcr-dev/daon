// src/common/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { setAuthToken, request, getAuthToken } from '../components/helpers/axios_helper';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

// Context 생성
const UserContext = createContext(null);

// Provider 컴포넌트 생성
export const UserProvider = ({ children }) => {

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    // JWT 토큰에서 사용자 정보 추출
    const extractUserFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);

            // JWT 토큰에서 정보 추출
            return {
                emp_no: parseInt(decoded.sub),   // sub(subject)은 사원번호
                emp_name: decoded.emp_name,
                dept_no: decoded.dept_no,
                position_id: decoded.position_id,
                admin_type: decoded.admin_type,
                // 토큰 만료 시간
                exp: decoded.exp * 1000, // 밀리초 단위 변환
            };

        } catch (error) {
            console.error("JWT 토큰 디코딩 오류 : ", error);
            return null;
        }
    };

    // 토큰 유효성 검사
    const isTokenValid = (token) => {
        if(!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;  // 초 단위 현재 시간

            // 토큰이 만료되지 않았는지 확인
            return decoded.exp > currentTime;
        } catch(error) {
            console.error("토큰 유효성 검사 오류:", error);
            return false;
        }
    };

    // 사용자 정보 조회(추가 정보가 필요한 경우)
    const fetchUserData = useCallback(async () => {
        const token = getAuthToken();

        if(token && token !== "null"){
            // 토큰 유효성 검사
            if(!isTokenValid(token)){
                handleSessionExpired();
                return;
            }
            
            try{
                setLoading(true);

                // 1. 토큰에서 기본 사용자 정보 추출
                const tokenUserInfo = extractUserFromToken(token);

                // // 2. 필요한 경우 서버에서 추가 사용자 정보 요청
                // // 토큰에 충분항 정보가 있다면 이 부분은 생략 가능
                // try{
                //     const response = await request("GET", "/api/user/me", null);
                //     // 토큰 정보와 서버 응답 정보 병합
                //     setUser({...tokenUserInfo, ...response.data});
                // } catch(error){
                //     console.warn("추가 사용자 정보를 가져오지 못했습니다. 토큰 정보만 사용합니다.");
                //     setUser(tokenUserInfo);
                // }
                setUser(tokenUserInfo);
                setSessionExpired(false);
            } catch(error){
                console.error("사용자 데이터를 가져오는데 실패했습니다.", error);

                if(error.response && (error.response.status === 401 || error.response.status === 403)){
                    handleSessionExpired();
                }

                setAuthToken(null);
                setUser(null);
            } finally{
                setLoading(false);
            }
 
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    // 세션 만료 처리
    const handleSessionExpired = () => {
        setSessionExpired(true);
        setUser(null);
        setAuthToken(null);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        navigate('/');
    };

    // 주기적으로 토큰 유효성 확인
    useEffect(() => {
        const tokenCheckInterval = setInterval(() => {
            const token = getAuthToken();
            if(token && token !== "null"){
                if(!isTokenValid(token)){
                    handleSessionExpired();
                }
            }
        }, 5 * 60 * 1000);  // 5분마다 확인

        return () => {
            clearInterval(tokenCheckInterval);
        };
    }, []);

    // 애플리케이션 로드 시 사용자 데이터 초기화
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // 로그인 처리 함수
    const login = async(token) => {
        if(!token){
            console.error("토큰이 제공되지 않았습니다.");
            return;
        }

        // 토큰 저장
        setAuthToken(token);

        // 토큰에서 사용자 정보 추출 및 상태 업데이트
        await fetchUserData();

    };

    // 로그아웃 처리 함수
    const logout = useCallback(() => {
        // 백엔드에 로그아웃 요청(필요한 경우)
        // try{
        //     request("POST", "/api/logout", null);
        // } catch (error) {
        //     console.error("로그아웃 요청 처리 중 오류:", error);
        // } finally {
        //     // 로컬 상태 정리
            setAuthToken(null);
            setUser(null);
            // 로그아웃 후 로그인 페이지로 리다이렉션
            navigate("/");
        //}
    }, [navigate]);

    // 현재 사용자가 특정 권한을 가지고 있는지 확인하는 유틸리티 함수
    const hasPermission = (requiredAdminType) => {
        if(!user) return false;
        return user.admin_type >= requiredAdminType;
    };

    // Context 소비자에게 제공될 값
    const value = {
        user,
        loading,
        login,
        logout,
        fetchUserData,
        sessionExpired,
        hasPermission,
        isAdmin: user ? user.admin_type >= 2 : false,
        isHRAdmin: user ? user.admin_type === 3 : false,
        isDeptManager: user ? user.admin_type === 4 : false,
        isTeamManager: user ? user.admin_type === 5 : false
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// 사용자 컨텍스트를 사용하기 위한 커스텀 훅
export const useUser = () => {
    const context = useContext(UserContext);
    if(context === undefined) {
        throw new Error('useUser는 UserProvider 내부에서만 사용할 수 있습니다.');
    }
    return context;
};