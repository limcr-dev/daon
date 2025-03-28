import React from 'react';
import VacationHistory from './pages/VacationHistory';
import { Route, Routes } from 'react-router-dom';
import AttendMgt from './pages/AttendMgt';

const AttendRouter = () => {
    return (
        <div>
                <Routes>
                    <Route path="/" element={<AttendMgt />} />                  {/* 내 근태 현황 */}

                    <Route path="/vacationHistory" element={<VacationHistory />} />               {/* 내 연차 내력 */}
                  
                </Routes>
        </div>
    );
};

export default AttendRouter;