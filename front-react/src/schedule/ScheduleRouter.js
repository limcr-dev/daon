import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ScheduleMain from './pages/ScheduleMain';

const ScheduleRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<ScheduleMain />} />       {/* 일정 */}
            <Route path="/schedule" element={<ScheduleMain />} />       {/* 일정 */}
        </Routes>
        
    );
};

export default ScheduleRouter;