import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Approve from './pages/Approve';
import DocumentForm from './pages/DocumentForm';
import ApproverDocList from './pages/ApproverDocList';
import DocumentList from './pages/DocumentList';
import DocumentDetail from './pages/DocumentDetail';
import DocumentUpdate from './pages/DocumentUpdate';

const ApproveRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Approve />} />                                        {/* 전자결재 메인 */}
            <Route path="/form/:form_no" element={<DocumentForm />} />                      {/* 새 결재 작성 */}
            <Route path='/approver/:status' element={<ApproverDocList />} />                {/* 결재자 문서 목록 */}
            <Route path='/documents' element={<DocumentList />} />                          {/* 기안자 문서 목록 */}
            <Route path='/documents/:status' element={<DocumentList />} />                  {/* 기안자 문서 상태별 목록 */}
            <Route path='/documentDetail/:form_no/:doc_no' element={<DocumentDetail />} />  {/* 결재 문서 상세 페이지 */}
            <Route path='/documentUpdate/:form_no/:doc_no' element={<DocumentUpdate />} />  {/* 결재 문서 수정 페이지 */}
        </Routes>
    );
};

export default ApproveRouter;