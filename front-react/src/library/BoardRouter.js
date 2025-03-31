
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoticeList from './pages/NoticeList';
import Board from './pages/Board';
import NoticeDetail from './pages/NoticeDetail';
import InsertNotice from './pages/InsertNotice';
import UpdateNotice from './pages/UpdateNotice';

const BoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Board />} />  {/* 기본 /board 경로 */}
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/noticeList" element={<NoticeList />} />
            <Route path="/noticeDetail/:notice_no" element={<NoticeDetail/>}/>
            <Route path="/insertNotice" element={<InsertNotice /> }/>
            <Route path="/updateNotice/:notice_no" element={<UpdateNotice/>}/>
        </Routes>
    );
};

export default BoardRouter;