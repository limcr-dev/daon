import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Schedule from './pages/Schedule';

const ScheduleRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Schedule />} />       {/* 일정 */}
            <Route path="/schedule" element={<Schedule />} />       {/* 일정 */}
        </Routes>
        
    );
};

export default ScheduleRouter;