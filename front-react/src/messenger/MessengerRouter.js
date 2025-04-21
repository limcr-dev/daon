import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Messenger from './pages/Messenger';
import AddressBook from './pages/AddressBook';
import MessengerRun from './pages/MessengerRun';
import MessengerChatList from './pages/MessengerChatList';
import MessengerSetting from './pages/MessengerSetting';

const MessengerRouter = () => {
	return (
		<Routes>
			<Route path="/" exact={true} element={<Messenger />} />                              {/* 메신저 */}
			<Route path="/addressBook" exact={true} element={<AddressBook />} />                {/* 주소록검색 */}
			<Route path="/messengerRun" exact={true} element={<MessengerRun />} />
			<Route path="/messengerChatList" exact={true} element={<MessengerChatList />} />
			<Route path="/messengerSetting" exact={true} element={<MessengerSetting />} />
		</Routes>
	);
};

export default MessengerRouter;