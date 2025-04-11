import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Approve from './pages/Approve';
import ApproveForm from './pages/ApproveForm';

const ApproveRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Approve />} />         {/* 전자결재 */}
            <Route path="/form/:form_no" element={<ApproveForm />} />         {/* 전자결재 */}
        </Routes>
    );
};

export default ApproveRouter;