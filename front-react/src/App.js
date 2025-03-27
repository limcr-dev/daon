import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './login/pages/Login';
import Home from './common/pages/Home';
import AttendMgt from './attendMgt/pages/AttendMgt';
import Mail from './mail/pages/Mail';
import Approve from './approve/pages/Approve';
import PerfomeMgt from './performMgt/pages/PerfomeMgt';
import Schedule from './schedule/pages/Schedule';
import HRMgt from './hrMgt/pages/HRMgt';
import OrgChart from './orgChart/pages/OrgChart';
import Messenger from './messenger/pages/Messenger';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />                  {/* 로그인 */}

          <Route path="/home" element={<Home />} />               {/* 메인화면 */}
          <Route path="/attendMgt" element={<AttendMgt />} />     {/* 근태관리 */}
          <Route path="/mail" element={<Mail />} />               {/* 메일 */}
          <Route path="/schedule" element={<Schedule />} />       {/* 일정 */}
          <Route path="/approve" element={<Approve />} />         {/* 전자결재 */}
          <Route path="/performMgt" element={<PerfomeMgt />} />   {/* 인사평가 */}

          <Route path="/HRMgt" element={<HRMgt />} />             {/* 인사관리 */}
          <Route path="/orgChart" element={<OrgChart />} />       {/* 조직도 */}
          <Route path="/messenger" element={<Messenger />} />     {/* 메신저 */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;