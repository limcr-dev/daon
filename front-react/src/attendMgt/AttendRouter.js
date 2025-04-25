import React from 'react';
import VacationMain from './pages/VacationMain';
import { Route, Routes } from 'react-router-dom';
import AttendMgt from './pages/AttendMgt';
import DeptStatus from './pages/DeptStatus';
import DeptStats from './pages/DeptStats';
import AllVacationCreate from './pages/AllVacationCreate';
import AllVacationUsed from './pages/AllVacationUsed';
import AttendSetting from './pages/AttendSetting';

const AttendRouter = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AttendMgt />} />                  {/* 내 근태 현황 */}
                <Route path="/attendance" element={<AttendMgt />} />                  {/* 내 근태 현황 */}
                <Route path="/vacationMain" element={<VacationMain />} />               {/* 내 연차 내역 */}
                <Route path="/teamstatus/:pickDept_no" element={<DeptStatus />} />               {/* 팀근태현황 */}
                <Route path="/teamstats/:pickDept_no" element={<DeptStats />} />               {/* 팀근태통계 */}

                <Route path="/deptStatus/:pickDept_no" element={<DeptStatus />} />               {/* 부서근태현황 */}
                <Route path="/deptStats/:pickDept_no" element={<DeptStats />} />               {/* 부서근태통계 */}

                <Route path="/AllVacationCreate" element={<AllVacationCreate />} />               {/* 전사 연차 생성내역 */}
                <Route path="/allVacationUsed" element={<AllVacationUsed />} />               {/* 전사 연차 사용내역 */}
                <Route path="/attendSetting" element={<AttendSetting />} />               {/* 전사 연차 사용내역 */}
            </Routes>
        </div>
    );
};

export default AttendRouter;