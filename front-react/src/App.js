import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home";
import AttendanceManagement from "./pages/AttendanceManagement/AttendanceManagement";
import Mail from "./pages/Mail/Mail";
import ElectronicPayment from "./pages/ElectronicPayment/ElectronicPayment";
import ReferenceRoom from "./pages/ReferenceRoom/ReferenceRoom";
import PersonnelEvaluation from "./pages/PersonnelEvaluation/PersonnelEvaluation";
import Schedule from "./pages/Schedule/Schedule";
import Reservation from "./pages/Reservation/Reservation";
import Administrator from "./pages/Administrator/Administrator";
import OrganizationChart from "./pages/OrganizationChart/OrganizationChart";


function App() {
  return(
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignUp/>} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/AttendanceManagement" element={<AttendanceManagement/>} />      {/* 근태관리 */}
          <Route path="/Mail" element={<Mail/>} />                                      {/* 메일 */}
          <Route path="/ElectronicPayment" element={<ElectronicPayment/>} />            {/* 전자결재재 */}
          <Route path="/ReferenceRoom" element={<ReferenceRoom/>} />                    {/* 자료실 */}
          <Route path="/PersonnelEvaluation" element={<PersonnelEvaluation/>} />        {/* 인사평가 */}
          <Route path="/Schedule" element={<Schedule/>} />                              {/* 일정 */}
          <Route path="/Reservation" element={<Reservation/>} />                        {/* 예약 */}
          <Route path="/Administrator" element={<Administrator/>} />                    {/* 관리자 */}
          <Route path="/OrganizationChart" element={<OrganizationChart/>} />            {/* 조직도도 */}  

        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;