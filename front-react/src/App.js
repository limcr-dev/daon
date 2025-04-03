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
import BoardRouter from "./library/BoardRouter";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로 라우트 */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* 서브 라우트들 */}
        <Route path="/approve/*" element={<ApproveRouter />} />
        <Route path="/attendMgt/*" element={<AttendRouter />} />
        <Route path="/employee/*" element={<HrMgtRouter />} />
        <Route path="/mail/*" element={<MailRouter />} />
        <Route path="/messenger/*" element={<MessengerRouter />} />
        <Route path="/orgChart/*" element={<OrgChartRouter />} />
        <Route path="/performMgt/*" element={<PerformMgtRouter />} />
        <Route path="/schedule/*" element={<ScheduleRouter />} />
        <Route path="/board/*" element={<BoardRouter />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;