// src/common/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getAuthToken, setAuthToken, removeAuthToken } from '../components/helpers/auth_helper';
import { jwtDecode } from 'jwt-decode';
import { request, refreshAccessToken } from '../components/helpers/axios_helper';  // 여기 추가!!! ✨
import { useNavigate } from 'react-router-dom';

// Context 생성
const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionExpired, setSessionExpired] = useState(false);

    const extractUserFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return {
                emp_no: parseInt(decoded.sub),
                emp_name: decoded.emp_name,
                dept_no: decoded.dept_no,
                position_id: decoded.position_id,
                role_id: decoded.role_id,
                admin_type: decoded.admin_type,
                exp: decoded.exp * 1000,
            };
        } catch (error) {
            console.error("토큰 디코딩 실패:", error);
            return null;
        }
    };

    const handleSessionExpired = () => {
        setSessionExpired(true);
        setUser(null);
        removeAuthToken();
        setTimeout(() => {
            alert('세션이 만료되었습니다. 다시 로그인해주세요.');
            navigate('/');
        }, 100);
    };

    const fetchUserData = useCallback(async () => {
        const token = getAuthToken();
        if (token && token !== "null") {
            try {
                const userInfo = extractUserFromToken(token);
                setUser(userInfo);
                setSessionExpired(false);
            } catch (error) {
                console.error("유저 데이터 가져오기 실패:", error);
                handleSessionExpired();
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const login = async (accessToken) => {
        if (!accessToken) {
            console.error("로그인 실패: accessToken 없음");
            return;
        }
        setAuthToken(accessToken);
        const userInfo = extractUserFromToken(accessToken);
        setUser(userInfo);
    };

    const logout = useCallback(async () => {
        try {
            if (user && user.emp_no) {
                await request('POST', '/api/logout', { emp_no: user.emp_no });
            }
        } catch (error) {
            console.log("로그아웃 요청 실패:", error);
        } finally {
            removeAuthToken();
            setUser(null);
            navigate('/');
        }
    }, [navigate, user]);

    const value = {
        user,
        loading,
        login,
        logout,
        refreshAccessToken, 
        sessionExpired,
        hasPermission: (requiredAdminType) => user ? user.admin_type >= requiredAdminType : false,
        isAdmin: user ? user.admin_type >= 2 : false,
        isHRAdmin: user ? user.admin_type === 3 : false,
        isDeptManager: user ? user.admin_type === 4 : false,
        isTeamManager: user ? user.admin_type === 5 : false
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// 커스텀 훅
export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser는 UserProvider 안에서 사용해야 합니다.');
    }
    return context;
};
