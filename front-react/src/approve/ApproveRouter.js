import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Approve from './pages/Approve';

const ApproveRouter = () => {
    return (
        <Routes>
            <Route path="/approve" element={<Approve />} />         {/* 전자결재 */}
        </Routes>
    );
};

export default ApproveRouter;