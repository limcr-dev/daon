import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Messenger from './pages/Messenger';
import AddressBook from './pages/AddressBook';
import AddressBookList from './pages/AddressBookList';

const MessengerRouter = () => {
    return (
        <Routes>
            <Route path="/" exact={true} element={<Messenger/>} />                              {/* 메신저 */}
            <Route path="/addressBook" exact={true} element={<AddressBook />} />                {/* 주소록검색 */}
            <Route path="/addressBookList" exact={true} element={<AddressBookList />} />        {/* 주소록목록 */}
        </Routes>
    );
};

export default MessengerRouter;