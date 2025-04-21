import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Approve from './pages/Approve';
import ApproveForm from './pages/ApproveForm';
import ApproverDocList from './pages/ApproverDocList';
import DocumentList from './pages/DocumentList';

const ApproveRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Approve />} />         {/* 전자결재 */}
            <Route path="/form/:form_no" element={<ApproveForm />} />         {/* 전자결재 */}
            <Route path='/approver/:status' element={<ApproverDocList />} />
            <Route path='/documents' element={<DocumentList />} />
            <Route path='/documents/:status' element={<DocumentList />} />
        </Routes>
    );
};

export default ApproveRouter;