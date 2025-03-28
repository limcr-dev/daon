import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HRMgt from './pages/HRMgt';

const HrMgtRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HRMgt />} />         {/* 전자결재 */}
        </Routes>
    );
};

export default HrMgtRouter;