import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from './login/pages/Login';
import Home from './common/pages/Home';

import AttendRouter from "./attendMgt/AttendRouter";
import ApproveRouter from "./approve/ApproveRouter";
import HrMgtRouter from "./hrMgt/HrMgtRouter";
import MailRouter from "./mail/MailRouter";
import MessengerRouter from "./messenger/MessengerRouter";
import PerformMgtRouter from "./performMgt/PerformMgtRouter";
import ScheduleRouter from "./schedule/ScheduleRouter";
import BoardRouter from "./library/BoardRouter";
import SalaryRouter from "./salary/SalaryRouter";

import { UserProvider, useUser } from "./common/contexts/UserContext";

//  로그인하지 않은 경우 접근 막기
const ProtectedRoute = ({ element, requiredAdminTypes }) => {
  const { user, loading } = useUser();

  if (loading) return <div className="loading-screen">로딩 중...</div>;

  if (!user) return <Navigate to="/" replace />;

  //  admin_type 기반 접근 제어
  if (requiredAdminTypes && !requiredAdminTypes.includes(user.admin_type)) {
    alert("해당 페이지에 접근할 권한이 없습니다.");
    return <Navigate to="/home" replace />;
  }

  return element;
};

//  로그인 상태에서는 로그인 페이지 접근 막기
const LoginRoute = ({ element }) => {
  const { user, loading } = useUser();

  if (loading) return <div className="loading-screen">로딩 중...</div>;
  if (user) return <Navigate to="/home" replace />;

  return element;
};

//  앱 전체 라우터
const AppRoutes = () => {
  return (
    <Routes>
      {/*  로그인 */}
      <Route path="/" element={<LoginRoute element={<Login />} />} />

      {/*  로그인 필요 */}
      <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
      <Route path="/approve/*" element={<ProtectedRoute element={<ApproveRouter />} />} />
      <Route path="/attendMgt/*" element={<ProtectedRoute element={<AttendRouter />} />} />
      <Route path="/employee/*" element={<ProtectedRoute element={<HrMgtRouter />} requiredAdminTypes={[ 2, 3]}/>} />
      <Route path="/mail/*" element={<ProtectedRoute element={<MailRouter />} />} />
      <Route path="/messenger/*" element={<ProtectedRoute element={<MessengerRouter />} />} />
      <Route path="/performMgt/*" element={<ProtectedRoute element={<PerformMgtRouter />} />} />
      <Route path="/schedule/*" element={<ProtectedRoute element={<ScheduleRouter />} />} />
      <Route path="/board/*" element={<ProtectedRoute element={<BoardRouter />} />} />

      {/*  급여 라우트는 admin_type === 4 (급여 관리자)만 접근 가능 */}
      <Route
        path="/salary/*"
        element={<ProtectedRoute element={<SalaryRouter />} requiredAdminTypes={[ 2, 4]} />}
      />
    </Routes>
  );
};

//  최상위 App 컴포넌트
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
