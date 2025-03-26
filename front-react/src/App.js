import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home";
import AttendanceManagement from "./pages/AttendanceManagement/AttendanceManagement";
import Mail from "./pages/Mail/Mail";
import ReferenceRoom from "./pages/ReferenceRoom/ReferenceRoom";
import PersonnelEvaluation from "./pages/PersonnelEvaluation/PersonnelEvaluation";
import Schedule from "./pages/Schedule/Schedule";
import Reservation from "./pages/Reservation/Reservation";
import Administrator from "./pages/Administrator/Administrator";
import OrganizationChart from "./pages/OrganizationChart/OrganizationChart";
import ApproveMain from "./pages/Approve/ApproveMain";
import Messenger from "./pages/Messenger/Messenger";


function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/attendanceManagement" element={<AttendanceManagement/>} />      {/* 근태관리 */}
          <Route path="/mail" element={<Mail/>} />                                      {/* 메일 */}
          <Route path="/approveMain" element={<ApproveMain/>} />            {/* 전자결재 */}
          {/* <Route path="/referenceRoom" element={<ReferenceRoom/>} />                    {/* 자료실 */}
          <Route path="/personnelEvaluation" element={<PersonnelEvaluation/>} />        {/* 인사평가 */}
          <Route path="/schedule" element={<Schedule/>} />                              {/* 일정 */}
          {/* <Route path="/reservation" element={<Reservation/>} />                        {/* 예약 */}
          <Route path="/administrator" element={<Administrator/>} />                    {/* 관리자 */}
          <Route path="/oganizationChart" element={<OrganizationChart/>} />            {/* 조직도 */}  
          <Route path="/messenger" element={<Messenger/>} />            {/* 메신저 */} 
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;