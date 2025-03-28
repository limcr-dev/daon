import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PerfomeMgt from './pages/PerfomeMgt';

const PerformMgtRouter = () => {
    return (
        <Routes>
            <Route path="/performMgt" element={<PerfomeMgt />} />   {/* 인사평가 */}
        </Routes>
    );
};

export default PerformMgtRouter;