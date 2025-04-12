import React from 'react';
import VacationMain from './pages/VacationMain';
import { Route, Routes } from 'react-router-dom';
import AttendMgt from './pages/AttendMgt';
import DeptStatus from './pages/DeptStatus';

const AttendRouter = () => {
    return (
        <div>
            <Routes>
                <Route path="/" element={<AttendMgt />} />                  {/* 내 근태 현황 */}
                <Route path="/attendance" element={<AttendMgt />} />                  {/* 내 근태 현황 */}
                <Route path="/vacationMain" element={<VacationMain />} />               {/* 내 연차 내역 */}
                <Route path="/deptStatus" element={<DeptStatus />} />               {/* 부서근태현황 */}
            </Routes>
        </div>
    );
};

export default AttendRouter;