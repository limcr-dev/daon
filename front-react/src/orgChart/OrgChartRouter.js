import React from 'react';
import { Route, Routes } from 'react-router-dom';
import OrgChart from './pages/OrgChart';

const OrgChartRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<OrgChart />} />       {/* 조직도 */}
        </Routes>
    );
};

export default OrgChartRouter;