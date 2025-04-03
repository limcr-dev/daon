import React from 'react';
import VacationMain from './pages/VacationMain';
import { Route, Routes } from 'react-router-dom';
import AttendMgt from './pages/AttendMgt';

const AttendRouter = () => {
    return (
        <div>
                <Routes>
                    <Route path="/" element={<AttendMgt />} />                  {/* 내 근태 현황 */}

                    <Route path="/vacationMain" element={<VacationMain />} />               {/* 내 연차 내력 */}
                  
                </Routes>
        </div>
    );
};

export default AttendRouter;