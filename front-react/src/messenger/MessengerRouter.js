import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Messenger from './pages/Messenger';

const MessengerRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Messenger/>} />         {/* 메신저 */}
        </Routes>
    );
};

export default MessengerRouter;