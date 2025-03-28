import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Mail from './pages/Mail';

const MailRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Mail />} />         {/* 메일 */}
        </Routes>
    );
};

export default MailRouter;