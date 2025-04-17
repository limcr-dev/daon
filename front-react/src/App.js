import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from './login/pages/Login';
import Home from './common/pages/Home';
import AttendRouter from "./attendMgt/AttendRouter";
import ApproveRouter from "./approve/ApproveRouter";
import HrMgtRouter from "./hrMgt/HrMgtRouter";
import MailRouter from "./mail/MailRouter";
import MessengerRouter from "./messenger/MessengerRouter";
import OrgChartRouter from "./orgChart/OrgChartRouter";
import PerformMgtRouter from "./performMgt/PerformMgtRouter";
import ScheduleRouter from "./schedule/ScheduleRouter";
import BoardRouter from "./library/BoardRouter";
import { UserProvider, useUser } from "./common/contexts/UserContext";

// 인증 라우트 컴포넌트 - 로그인하지 않은 사용자는 로그인 페이지로 리다이렉트
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div className="loading-screen">로딩 중...</div>;
  }
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  return element;
};

// 로그인 라우트 컴포넌트 - 이미 로그인한 사용자는 홈페이지로 리다이렉트
const LoginRoute = ({ element }) => {
  const { user, loading } = useUser();
  
  if (loading) {
    return <div className="loading-screen">로딩 중...</div>;
  }
  
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  return element;
};

// 앱의 라우트 구성
const AppRoutes = () => {
  return (
    <Routes>
      {/* 로그인 페이지 - 이미 로그인한 사용자는 접근 불가 */}
      <Route path="/" element={<LoginRoute element={<Login />} />} />
      
      {/* 보호된 라우트들 - 인증 필요 */}
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/approve/*" element={<ProtectedRoute element={<ApproveRouter />} />} />
      <Route path="/attendMgt/*" element={<ProtectedRoute element={<AttendRouter />} />} />
      <Route path="/employee/*" element={<ProtectedRoute element={<HrMgtRouter />} />} />
      <Route path="/mail/*" element={<ProtectedRoute element={<MailRouter />} />} />
      <Route path="/messenger/*" element={<ProtectedRoute element={<MessengerRouter />} />} />
      <Route path="/orgChart/*" element={<ProtectedRoute element={<OrgChartRouter />} />} />
      <Route path="/performMgt/*" element={<ProtectedRoute element={<PerformMgtRouter />} />} />
      <Route path="/schedule/*" element={<ProtectedRoute element={<ScheduleRouter />} />} />
      <Route path="/board/*" element={<ProtectedRoute element={<BoardRouter />} />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;