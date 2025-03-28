import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <div>
      <BrowserRouter>

        <ApproveRouter />     {/* 전자결재 */}
        <AttendRouter />      {/* 근태관리 */}
        <HrMgtRouter />       {/* 인사관리 */}
        <MailRouter />        {/* 메일 */}
        <MessengerRouter />   {/* 메신저 */}
        <OrgChartRouter />    {/* 조직도 */}
        <PerformMgtRouter />  {/* 인사평가 */}
        <ScheduleRouter />    {/* 일정 */}

        <Routes>
          <Route path="/" element={<Login />} />                  {/* 로그인 */}
          <Route path="/home" element={<Home />} />               {/* 메인화면 */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;