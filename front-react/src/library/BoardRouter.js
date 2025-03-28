
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoticeList from './pages/NoticeList';
import Board from './pages/Board';

const BoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Board />} />  {/* 기본 /board 경로 */}
            <Route path="/noticeList" element={<NoticeList />} />
        </Routes>
    );
};

export default BoardRouter;