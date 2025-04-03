
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import NoticeList from './pages/NoticeList';
import Board from './pages/Board';
import NoticeDetail from './pages/NoticeDetail';
import InsertNotice from './pages/InsertNotice';
import UpdateNotice from './pages/UpdateNotice';
import LibraryDetail from './pages/LibraryDetail';
import UpdateLibrary from './pages/UpdateLibrary';
import InsertLibrary from './pages/InsertLibrary';
import LibraryList from './pages/LibraryList';


const BoardRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Board />} />  {/* 기본 /board 경로 */}
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/noticeList" element={<NoticeList />} />
            <Route path="/noticeDetail/:notice_no" element={<NoticeDetail/>}/>
            <Route path="/insertNotice" element={<InsertNotice /> }/>
            <Route path="/updateNotice/:notice_no" element={<UpdateNotice/>}/>

            <Route path="/library" element={<LibraryList />} />
            <Route path="/libraryList" element={<LibraryList />} />
            <Route path="/libraryDetail/:library_no" element={<LibraryDetail/>}/>
            <Route path="/insertLibrary" element={<InsertLibrary /> }/>
            <Route path="/updateLibrary/:library_no" element={<UpdateLibrary/>}/>
        </Routes>
    );
};

export default BoardRouter;